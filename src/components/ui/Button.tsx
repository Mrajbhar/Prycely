import clsx from 'clsx';
import type { ButtonHTMLAttributes } from 'react';
import { Spinner } from './Spinner';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'accent';
  loading?: boolean;
  fullWidth?: boolean;
}

const variants = {
  primary: 'bg-brand text-white hover:bg-brand-hover disabled:bg-muted',
  accent: 'bg-accent text-white hover:bg-accent-hover disabled:bg-muted',
  secondary: 'bg-surface text-ink border border-line hover:border-ink',
  ghost: 'text-ink-soft hover:bg-brand-tint hover:text-ink',
} as const;

export function Button({
  variant = 'primary',
  loading = false,
  fullWidth = false,
  disabled,
  children,
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      disabled={disabled || loading}
      className={clsx(
        'inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5',
        'text-sm font-medium transition-colors duration-150',
        'disabled:cursor-not-allowed disabled:opacity-70',
        variants[variant],
        fullWidth && 'w-full',
        className,
      )}
    >
      {loading && <Spinner />}
      {children}
    </button>
  );
}