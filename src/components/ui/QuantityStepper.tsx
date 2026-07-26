interface QuantityStepperProps {
  value: number;
  max: number;
  disabled?: boolean;
  onChange: (quantity: number) => void;
}

export function QuantityStepper({ value, max, disabled, onChange }: QuantityStepperProps) {
  return (
    <div className="inline-flex items-center rounded-lg border border-line">
      <button
        type="button"
        aria-label="Decrease quantity"
        disabled={disabled || value <= 1}
        onClick={() => onChange(value - 1)}
        className="grid size-8 place-items-center text-ink-soft transition-colors hover:text-ink disabled:opacity-40"
      >
        −
      </button>

      <span className="price w-9 text-center text-sm font-medium tabular-nums">{value}</span>

      <button
        type="button"
        aria-label="Increase quantity"
        disabled={disabled || value >= max}
        onClick={() => onChange(value + 1)}
        className="grid size-8 place-items-center text-ink-soft transition-colors hover:text-ink disabled:opacity-40"
      >
        +
      </button>
    </div>
  );
}