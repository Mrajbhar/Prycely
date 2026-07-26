import { Link } from 'react-router-dom';
export function Logo({
  className = '',
  variant = 'light',
}: {
  className?: string;
  variant?: 'light' | 'dark';
}) {
  const tile = variant === 'dark' ? 'bg-white/15 text-white' : 'bg-accent text-white';
  const word = variant === 'dark' ? 'text-white' : 'text-ink';
  return (
    <Link to="/" className={`flex shrink-0 items-center gap-2 ${className}`}>
      <span className={`grid size-7 place-items-center rounded-md ${tile}`}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M20.59 13.41 13.42 20.6a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82Z" />
          <circle cx="7" cy="7" r="1.3" fill="currentColor" />
        </svg>
      </span>
      <span className={`display text-lg font-extrabold tracking-tight ${word}`}>Prycely</span>
    </Link>
  );
}