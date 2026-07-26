import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Link, useSearchParams } from 'react-router-dom';
import { GoogleButton } from '../components/auth/GoogleButton';
import { AuthLayout } from '../components/layout/AuthLayout';
import { Alert } from '../components/ui/Alert';
import { Input } from '../components/ui/Input';
import { PasswordInput } from '../components/ui/PasswordInput';
import { loginSchema, type LoginInput } from '../features/auth/authSchemas';
import { useLogin } from '../features/auth/useAuth';
import { ApiError } from '../types/api';

export default function LoginPage() {
  const login = useLogin();
  const [searchParams] = useSearchParams();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({ resolver: zodResolver(loginSchema) });

  const serverError = login.error instanceof ApiError ? login.error.message : null;
  const oauthError = searchParams.get('error')
    ? 'Google sign-in didn’t complete. Try again or use your email.'
    : null;

  const handleGoogle = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`;
  };

  return (
    <AuthLayout
      title="Sign in"
      subtitle="Pick up where you left off."
      footer={
        <>
          New to Prycely?{' '}
          <Link to="/register" className="font-bold uppercase tracking-wide text-accent hover:underline">
            Create account
          </Link>
        </>
      }
    >
      <div className="space-y-5">
        {oauthError && <Alert message={oauthError} />}

        <GoogleButton onClick={handleGoogle} />

        <div className="flex items-center gap-3">
          <span className="h-px flex-1 bg-line" />
          <span className="text-[10px] font-bold uppercase tracking-wide text-muted">or</span>
          <span className="h-px flex-1 bg-line" />
        </div>

        <form onSubmit={handleSubmit((values) => login.mutate(values))} className="space-y-4">
          {serverError && <Alert message={serverError} />}

          <Input
            label="Email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            error={errors.email?.message}
            {...register('email')}
          />

          <PasswordInput
            label="Password"
            autoComplete="current-password"
            error={errors.password?.message}
            {...register('password')}
          />

          <button
            type="submit"
            disabled={login.isPending}
            className="w-full rounded bg-accent py-3 text-sm font-bold uppercase tracking-wide text-white transition-colors hover:bg-accent-hover disabled:bg-muted"
          >
            {login.isPending ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <p className="text-center text-[11px] leading-relaxed text-muted">
          By continuing you agree to our{' '}
          <Link to="/terms" className="text-ink hover:underline">
            Terms
          </Link>{' '}
          and{' '}
          <Link to="/privacy" className="text-ink hover:underline">
            Privacy Policy
          </Link>
          .
        </p>
      </div>
    </AuthLayout>
  );
}