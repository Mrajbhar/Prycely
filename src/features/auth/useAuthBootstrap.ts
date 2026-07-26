import { useEffect, useRef } from 'react';
import axios from 'axios';
import { useAppDispatch } from '../../app/hooks';
import { setAuthFailureHandler } from '../../lib/axios';
import { tokenStore } from '../../lib/tokenStore';
import type { ApiResponse } from '../../types/api';
import type { AuthResponse } from '../../types/auth';
import { signedIn, signedOut } from './authSlice';

const bootClient = axios.create({ baseURL: import.meta.env.VITE_API_URL as string });

export function useAuthBootstrap() {
  const dispatch = useAppDispatch();
  const started = useRef(false);

  useEffect(() => {
    // Ref survives StrictMode's double-invoke; the second run bails here.
    if (started.current) return;
    started.current = true;

    setAuthFailureHandler(() => dispatch(signedOut()));

    const restore = async () => {
      const refreshToken = tokenStore.getRefreshToken();

      if (!refreshToken) {
        dispatch(signedOut());
        return;
      }

      try {
        const { data } = await bootClient.post<ApiResponse<AuthResponse>>('/auth/refresh', {
          refreshToken,
        });

        if (!data.success || !data.data) throw new Error('Refresh failed');

        tokenStore.setAccessToken(data.data.accessToken);
        tokenStore.setRefreshToken(data.data.refreshToken);
        dispatch(signedIn(data.data.user));
      } catch {
        tokenStore.clear();
        dispatch(signedOut());
      }
    };

    void restore();
  }, [dispatch]);
}