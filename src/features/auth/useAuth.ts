import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { queryClient } from '../../app/queryClient';
import { tokenStore } from '../../lib/tokenStore';
import type { AuthResponse } from '../../types/auth';
import { authApi } from './authApi';
import { signedIn, signedOut } from './authSlice';

export function useAuth() {
  const { user, status } = useAppSelector((state) => state.auth);

  return {
    user,
    status,
    isAuthenticated: status === 'authenticated',
    isAdmin: user?.role === 'Admin',
  };
}

export function useLogin() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: authApi.login,
    onSuccess: (auth: AuthResponse) => {
      tokenStore.setAccessToken(auth.accessToken);
      tokenStore.setRefreshToken(auth.refreshToken);
      dispatch(signedIn(auth.user));
      navigate('/', { replace: true });
    },
  });
}

export function useRegister() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: authApi.register,
    onSuccess: (auth: AuthResponse) => {
      tokenStore.setAccessToken(auth.accessToken);
      tokenStore.setRefreshToken(auth.refreshToken);
      dispatch(signedIn(auth.user));
      navigate('/', { replace: true });
    },
  });
}

export function useLogout() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  return async () => {
    const refreshToken = tokenStore.getRefreshToken();

    // Best effort — if the call fails, still clear locally.
    if (refreshToken) {
      try {
        await authApi.logout(refreshToken);
      } catch {
        /* ignore */
      }
    }

    tokenStore.clear();
    dispatch(signedOut());
    queryClient.clear();
    navigate('/login', { replace: true });
  };
}