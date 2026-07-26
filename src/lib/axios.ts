import axios, {
  AxiosError,
  type AxiosInstance,
  type InternalAxiosRequestConfig,
} from 'axios';
import { tokenStore } from './tokenStore';
import { ApiError, type ApiResponse } from '../types/api';
import type { AuthResponse } from '../types/auth';

const BASE_URL = import.meta.env.VITE_API_URL as string;

/** Bare client for /auth/refresh — must not run the interceptor, or 401s recurse. */
const refreshClient = axios.create({ baseURL: BASE_URL });

export const api: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

/** Called when refresh fails — wired up by the auth layer to log the user out. */
let onAuthFailure: () => void = () => {};
export const setAuthFailureHandler = (fn: () => void) => {
  onAuthFailure = fn;
};

// ---------- request: attach the token ----------
api.interceptors.request.use((config) => {
  const token = tokenStore.getAccessToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;

  // FormData (file uploads) must NOT carry the JSON content-type. Deleting it
  // lets the browser set 'multipart/form-data; boundary=...' so the server can
  // parse the file. Without this the upload arrives with an empty filename.
  if (config.data instanceof FormData) {
    delete config.headers['Content-Type'];
  }

  return config;
});

// ---------- response: refresh once, retry the rest ----------
type RetryConfig = InternalAxiosRequestConfig & { _retried?: boolean };

let isRefreshing = false;
let waiters: Array<(token: string | null) => void> = [];

const notifyWaiters = (token: string | null) => {
  waiters.forEach((resolve) => resolve(token));
  waiters = [];
};

async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = tokenStore.getRefreshToken();
  if (!refreshToken) return null;

  try {
    const { data } = await refreshClient.post<ApiResponse<AuthResponse>>(
      '/auth/refresh',
      { refreshToken },
    );

    if (!data.success || !data.data) return null;

    // The backend rotates: the old refresh token is now dead.
    tokenStore.setAccessToken(data.data.accessToken);
    tokenStore.setRefreshToken(data.data.refreshToken);

    return data.data.accessToken;
  } catch {
    return null;
  }
}

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiResponse<unknown>>) => {
    const original = error.config as RetryConfig | undefined;
    const status = error.response?.status;

    const isRefreshCall = original?.url?.includes('/auth/refresh');

    if (status === 401 && original && !original._retried && !isRefreshCall) {
      original._retried = true;

      // A refresh is already in flight — wait for it rather than starting another.
      if (isRefreshing) {
        const token = await new Promise<string | null>((resolve) => waiters.push(resolve));
        if (!token) return Promise.reject(toApiError(error));

        original.headers.Authorization = `Bearer ${token}`;
        return api(original);
      }

      isRefreshing = true;
      const token = await refreshAccessToken();
      isRefreshing = false;
      notifyWaiters(token);

      if (!token) {
        tokenStore.clear();
        onAuthFailure();
        return Promise.reject(toApiError(error));
      }

      original.headers.Authorization = `Bearer ${token}`;
      return api(original);
    }

    return Promise.reject(toApiError(error));
  },
);

function toApiError(error: AxiosError<ApiResponse<unknown>>): ApiError {
  const status = error.response?.status ?? 0;
  const body = error.response?.data;

  if (!error.response) {
    return new ApiError('Cannot reach the server. Check your connection.', 0);
  }

  return new ApiError(
    body?.message ?? 'Something went wrong. Try again.',
    status,
    body?.errors,
  );
}

/** Unwraps the ApiResponse envelope so callers get plain data. */
export async function unwrap<T>(promise: Promise<{ data: ApiResponse<T> }>): Promise<T> {
  const { data } = await promise;

  if (!data.success || data.data === undefined) {
    throw new ApiError(data.message ?? 'Request failed.', 200, data.errors);
  }

  return data.data;
}