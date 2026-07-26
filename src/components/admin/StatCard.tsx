import { Skeleton } from '../ui/Skeleton';

interface StatCardProps {
  label: string;
  value: string;
  hint?: string;
  loading?: boolean;
  tone?: 'default' | 'accent' | 'warning';
}

const valueTone = {
  default: 'text-ink',
  accent: 'text-accent',
  warning: 'text-danger',
} as const;

export function StatCard({ label, value, hint, loading, tone = 'default' }: StatCardProps) {
  return (
    <div className="rounded-card border border-line bg-surface p-5">
      <p className="text-xs uppercase tracking-wide text-muted">{label}</p>

      {loading ? (
        <Skeleton className="mt-2 h-8 w-24" />
      ) : (
        <p className={`price mt-1.5 text-2xl font-bold ${valueTone[tone]}`}>{value}</p>
      )}

      {hint && !loading && <p className="mt-1 text-xs text-muted">{hint}</p>}
    </div>
  );
}