import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { GoogleButton } from '../components/auth/GoogleButton';
import { AuthLayout } from '../components/layout/AuthLayout';
import { Alert } from '../components/ui/Alert';
import { Input } from '../components/ui/Input';
import { PasswordInput } from '../components/ui/PasswordInput';
import { registerSchema, type RegisterInput } from '../features/auth/authSchemas';
import { useRegister } from '../features/auth/useAuth';
import { ApiError } from '../types/api';

export default function RegisterPage() {
  const createAccount = useRegister();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({ resolver: zodResolver(registerSchema) });

  const serverError =
    createAccount.error instanceof ApiError ? createAccount.error.message : null;

  const handleGoogle = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`;
  };

  return (
    <AuthLayout
      title="Create account"
      subtitle="Takes about a minute."
      footer={
        <>
          Already have an account?{' '}
          <Link to="/login" className="font-bold uppercase tracking-wide text-accent hover:underline">
            Sign in
          </Link>
        </>
      }
    >
      <div className="space-y-5">
        <GoogleButton onClick={handleGoogle} />

        <div className="flex items-center gap-3">
          <span className="h-px flex-1 bg-line" />
          <span className="text-[10px] font-bold uppercase tracking-wide text-muted">or</span>
          <span className="h-px flex-1 bg-line" />
        </div>

        <form
          onSubmit={handleSubmit((values) => createAccount.mutate(values))}
          className="space-y-4"
        >
          {serverError && <Alert message={serverError} />}

          <Input
            label="Full name"
            autoComplete="name"
            error={errors.fullName?.message}
            {...register('fullName')}
          />

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
            autoComplete="new-password"
            hint="At least 8 characters, with an uppercase letter and a number."
            error={errors.password?.message}
            {...register('password')}
          />

          <button
            type="submit"
            disabled={createAccount.isPending}
            className="w-full rounded bg-accent py-3 text-sm font-bold uppercase tracking-wide text-white transition-colors hover:bg-accent-hover disabled:bg-muted"
          >
            {createAccount.isPending ? 'Creating…' : 'Create account'}
          </button>
        </form>

        <p className="text-center text-[11px] leading-relaxed text-muted">
          By creating an account you agree to our{' '}
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