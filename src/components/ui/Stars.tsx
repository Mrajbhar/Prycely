import clsx from 'clsx';

interface StarsProps {
  rating: number;
  size?: 'sm' | 'md';
}

export function Stars({ rating, size = 'sm' }: StarsProps) {
  const rounded = Math.round(rating);

  return (
    <span
      className={clsx('inline-flex gap-0.5', size === 'sm' ? 'text-xs' : 'text-base')}
      aria-label={`${rating.toFixed(1)} out of 5`}
    >
      {[1, 2, 3, 4, 5].map((star) => (
        <span key={star} aria-hidden className={star <= rounded ? 'text-sale' : 'text-line'}>
          ★
        </span>
      ))}
    </span>
  );
}