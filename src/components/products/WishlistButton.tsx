import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../features/auth/useAuth';
import { useToggleWishlist, useWishlistIds } from '../../features/wishlist/useWishlist';

export function WishlistButton({ productId, slug }: { productId: string; slug: string }) {
  const { isAuthenticated } = useAuth();
  const { data: ids } = useWishlistIds();
  const toggle = useToggleWishlist();
  const navigate = useNavigate();

  const wished = ids?.includes(productId) ?? false;

  const onClick = (e: React.MouseEvent) => {
    e.preventDefault(); // don't trigger the card link
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/products/${slug}` } });
      return;
    }
    toggle.mutate({ productId, wished });
  };

  return (
    <button
      onClick={onClick}
      aria-label={wished ? 'Remove from wishlist' : 'Add to wishlist'}
      aria-pressed={wished}
      className="grid size-9 place-items-center rounded-full bg-surface/90 backdrop-blur transition-colors hover:bg-surface"
    >
      <motion.svg
        key={wished ? 'on' : 'off'}
        initial={{ scale: 0.7 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 500, damping: 15 }}
        width="18" height="18" viewBox="0 0 24 24"
        fill={wished ? 'var(--color-accent)' : 'none'}
        stroke={wished ? 'var(--color-accent)' : 'var(--color-ink-soft)'}
        strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 1 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78Z" />
      </motion.svg>
    </button>
  );
}