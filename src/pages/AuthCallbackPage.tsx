import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../app/hooks';
import { api, unwrap } from '../lib/axios';
import { tokenStore } from '../lib/tokenStore';
import { signedIn } from '../features/auth/authSlice';
import { Spinner } from '../components/ui/Spinner';
import type { ApiResponse } from '../types/api';
import type { User } from '../types/auth';

export default function AuthCallbackPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const done = useRef(false);

  useEffect(() => {
    if (done.current) return;
    done.current = true;

    const finish = async () => {
      // Tokens arrive in the URL fragment: #accessToken=...&refreshToken=...
      const params = new URLSearchParams(window.location.hash.slice(1));
      const accessToken = params.get('accessToken');
      const refreshToken = params.get('refreshToken');

      if (!accessToken || !refreshToken) {
        navigate('/login?error=google_failed', { replace: true });
        return;
      }

      tokenStore.setAccessToken(accessToken);
      tokenStore.setRefreshToken(refreshToken);

      try {
        // Fetch the user with the fresh token so Redux knows who they are.
        const user = await unwrap(api.get<ApiResponse<User>>('/auth/me'));
        dispatch(signedIn(user));
        navigate('/', { replace: true });
      } catch {
        tokenStore.clear();
        navigate('/login?error=google_failed', { replace: true });
      }
    };

    void finish();
  }, [dispatch, navigate]);

  return (
    <div className="grid min-h-[60vh] place-items-center">
      <div className="text-center">
        <Spinner className="mx-auto size-6 text-ink" />
        <p className="mt-3 text-sm text-muted">Signing you in…</p>
      </div>
    </div>
  );
}