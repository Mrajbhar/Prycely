type AlertVariant = 'error' | 'info' | 'success';

const variants: Record<AlertVariant, string> = {
  error: 'border-danger/30 bg-danger-tint text-danger',
  info: 'border-info/30 bg-info-tint text-info',
  success: 'border-success/30 bg-success-tint text-success',
};

export function Alert({
  message,
  variant = 'error',
}: {
  message: string;
  variant?: AlertVariant;
}) {
  return (
    <div
      role="alert"
      className={`rounded-lg border px-3.5 py-3 text-sm ${variants[variant]}`}
    >
      {message}
    </div>
  );
}