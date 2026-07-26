import { Link } from 'react-router-dom';
import { useToast } from '../../components/ui/Toast';
import { Button } from '../../components/ui/Button';
import { Skeleton } from '../../components/ui/Skeleton';
import { useProducts } from '../../features/products/useProducts';
import { useDeleteProduct } from '../../features/products/useAdminProducts';
import { assetUrl } from '../../lib/assetUrl';
import { formatPrice } from '../../lib/format';
import { ApiError } from '../../types/api';

export default function AdminProductsPage() {
  const { data, isLoading } = useProducts({ pageSize: 100, sortBy: 'name' });
  const remove = useDeleteProduct();
  const toast = useToast();

  const handleDelete = (id: string, name: string) => {
    if (!confirm(`Remove “${name}” from the store?`)) return;
    remove.mutate(id, {
      onSuccess: () => toast.show('Product removed.'),
      onError: (err) => toast.show(err instanceof ApiError ? err.message : 'Could not remove.'),
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="display text-2xl font-bold text-ink sm:text-3xl">Products</h1>
        <Link to="/admin/products/new">
          <Button>Add product</Button>
        </Link>
      </div>

      {isLoading ? (
        <Skeleton className="h-64 w-full" />
      ) : (
        <div className="overflow-x-auto rounded-card border border-line bg-surface">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-line text-left text-xs uppercase tracking-wide text-muted">
                <th className="px-4 py-3 font-medium">Product</th>
                <th className="px-4 py-3 font-medium">Category</th>
                <th className="px-4 py-3 text-right font-medium">Price</th>
                <th className="px-4 py-3 text-right font-medium">Stock</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {data?.items.map((product) => (
                <tr key={product.id} className="hover:bg-subtle">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={assetUrl(product.imageUrls[0])}
                        alt=""
                        className="size-10 rounded-md border border-line object-cover"
                      />
                      <span className="font-medium text-ink">{product.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-ink-soft">{product.categoryName}</td>
                  <td className="price px-4 py-3 text-right text-accent">
                    {formatPrice(product.price)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className={`price ${product.stock === 0 ? 'text-danger' : 'text-ink'}`}>
                      {product.stock}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-3">
                      <Link
                        to={`/admin/products/${product.id}/edit`}
                        className="font-medium text-ink hover:text-accent hover:underline"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(product.id, product.name)}
                        className="text-muted hover:text-danger"
                      >
                        Remove
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}