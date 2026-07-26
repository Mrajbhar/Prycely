import { Button } from '../ui/Button';

interface PaginationProps {
  page: number;
  totalPages: number;
  hasPrevious: boolean;
  hasNext: boolean;
  onChange: (page: number) => void;
}

export function Pagination({ page, totalPages, hasPrevious, hasNext, onChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <nav className="mt-10 flex items-center justify-center gap-3" aria-label="Pagination">
      <Button variant="secondary" disabled={!hasPrevious} onClick={() => onChange(page - 1)}>
        Previous
      </Button>

      <span className="price text-sm text-muted">
        {page} / {totalPages}
      </span>

      <Button variant="secondary" disabled={!hasNext} onClick={() => onChange(page + 1)}>
        Next
      </Button>
    </nav>
  );
}