import { useAuth } from '../../features/auth/useAuth';

export default function AccountProfilePage() {
  const { user } = useAuth();

  return (
    <div className="space-y-4">
      <h1 className="display text-2xl font-bold text-ink sm:text-3xl">Profile</h1>

      <div className="max-w-lg rounded-lg border border-line bg-surface p-5">
        <Row label="Full name" value={user?.fullName ?? '—'} />
        <Row label="Email" value={user?.email ?? '—'} />
        <Row label="Account type" value={user?.role ?? 'Customer'} />
      </div>

      <p className="text-xs text-muted">
        Need to change something? Profile editing is coming soon.
      </p>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between border-b border-line py-3 last:border-0">
      <span className="text-sm text-muted">{label}</span>
      <span className="text-sm font-medium text-ink">{value}</span>
    </div>
  );
}