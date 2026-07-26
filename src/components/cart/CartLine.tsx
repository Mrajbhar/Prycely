import { Link } from 'react-router-dom';
import { useRemoveCartItem, useUpdateCartItem } from '../../features/cart/useCart';
import { assetUrl } from '../../lib/assetUrl';
import { formatPrice } from '../../lib/format';
import type { CartItem } from '../../types/cart';
import { QuantityStepper } from '../ui/QuantityStepper';

export function CartLine({ item, onNavigate }: { item: CartItem; onNavigate?: () => void }) {
  const updateItem = useUpdateCartItem();
  const removeItem = useRemoveCartItem();

  const isBusy = updateItem.isPending || removeItem.isPending;
  const overStock = item.quantity > item.availableStock;

  return (
    <li className="flex gap-3 border-b border-line py-4 last:border-0">
      <Link to={`/products/${item.productSlug}`} onClick={onNavigate} className="shrink-0">
        <img
          src={assetUrl(item.imageUrl ?? '')}
          alt={item.productName}
          className="h-24 w-[72px] rounded border border-line object-cover"
        />
      </Link>

      <div className="flex min-w-0 flex-1 flex-col">
        <Link
          to={`/products/${item.productSlug}`}
          onClick={onNavigate}
          className="line-clamp-2 text-xs font-semibold text-ink hover:text-accent"
        >
          {item.productName}
        </Link>

        <span className="price mt-1 text-sm font-bold text-ink">
          {formatPrice(item.unitPrice)}
        </span>

        {overStock && (
          <p className="price mt-1 text-[11px] font-bold text-danger">
            Only {item.availableStock} left — reduce quantity
          </p>
        )}

        <div className="mt-auto flex items-center gap-4 pt-2">
          <QuantityStepper
            value={item.quantity}
            max={Math.max(item.availableStock, 1)}
            disabled={isBusy}
            onChange={(quantity) => updateItem.mutate({ productId: item.productId, quantity })}
          />

          <button
            type="button"
            disabled={isBusy}
            onClick={() => removeItem.mutate(item.productId)}
            className="text-[11px] font-bold uppercase tracking-wide text-muted transition-colors hover:text-danger disabled:opacity-50"
          >
            Remove
          </button>
        </div>
      </div>

      <span className="price shrink-0 self-start text-sm font-bold text-ink">
        {formatPrice(item.lineTotal)}
      </span>
    </li>
  );
}