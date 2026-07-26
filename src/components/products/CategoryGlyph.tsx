interface GlyphProps {
  slug: string;
  className?: string;
}

export function CategoryGlyph({ slug, className = 'text-accent' }: GlyphProps) {
  const p = {
    width: 24,
    height: 24,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    className,
    'aria-hidden': true,
  };

  switch (slug) {
    case 'electronics':
      return (
        <svg {...p}>
          <rect x="2" y="4" width="20" height="14" rx="2" />
          <path d="M8 21h8M12 18v3" />
        </svg>
      );
    case 'clothing':
      return (
        <svg {...p}>
          <path d="M6 2 3 6l3 2v13a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V8l3-2-3-4-4 2a4 4 0 0 1-4 0Z" />
        </svg>
      );
    case 'home-kitchen':
      return (
        <svg {...p}>
          <path d="M3 10.5 12 3l9 7.5" />
          <path d="M5 9v11a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V9" />
          <path d="M9 21v-6h6v6" />
        </svg>
      );
    case 'books':
      return (
        <svg {...p}>
          <path d="M4 4a2 2 0 0 1 2-2h12v18H6a2 2 0 0 0-2 2V4Z" />
          <path d="M4 20a2 2 0 0 0 2 2h12" />
        </svg>
      );
    default:
      return (
        <svg {...p}>
          <circle cx="12" cy="12" r="9" />
          <path d="M8 12h8" />
        </svg>
      );
  }
}

export function TagGlyph({ className = 'text-gold' }: { className?: string }) {
  return (
    <svg
      width="24" height="24" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round"
      className={className} aria-hidden="true"
    >
      <path d="M20.59 13.41 13.42 20.6a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82Z" />
      <circle cx="7" cy="7" r="1.5" />
    </svg>
  );
}