import axios, { AxiosError } from "axios";
import { useConnectionStore } from "../store/useConnectionStore";

export const API_ORIGIN = import.meta.env.VITE_API_URL ?? "";

const TOKEN_KEY = "novashop_token";
export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const setToken = (t: string | null) =>
  t ? localStorage.setItem(TOKEN_KEY, t) : localStorage.removeItem(TOKEN_KEY);

// Matches ECommerce.API.Models.Dtos.ApiResponse<T>
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: Record<string, string[]>;
}

export class ApiError extends Error {
  errors?: Record<string, string[]>;
  status?: number;
  constructor(message: string, errors?: Record<string, string[]>, status?: number) {
    super(message);
    this.name = "ApiError";
    this.errors = errors;
    this.status = status;
  }
}

export const api = axios.create({
  baseURL: API_ORIGIN ? `${API_ORIGIN}/api` : "/api",
  timeout: 65000, // tolerate a cold start on the first real call
});

// Attach JWT to every request
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Unwrap the envelope; normalize errors; detect a sleeping backend
api.interceptors.response.use(
  (response) => {
    const body = response.data as ApiResponse<unknown> | undefined;
    if (body && typeof body === "object" && "success" in body) {
      if (!body.success) {
        throw new ApiError(body.message ?? "Request failed", body.errors, response.status);
      }
      return { ...response, data: body.data };
    }
    return response; // non-enveloped responses pass through untouched
  },
  (error: AxiosError<ApiResponse<unknown>>) => {
    const status = error.response?.status;
    const noResponse = !error.response; // network drop or timeout

    // Cold-sleep / gateway errors → tell the UI to show the reconnect banner
    if (noResponse || status === 502 || status === 503 || status === 504) {
      useConnectionStore.getState().setOffline(true);
    }
    if (status === 401) setToken(null); // token expired/invalid

    const body = error.response?.data;
    const message =
      body?.message ??            // your ApiResponse.message (incl. the 429 text)
      error.message ??
      "Something went wrong. Please try again.";

    return Promise.reject(new ApiError(message, body?.errors, status));
  }
);