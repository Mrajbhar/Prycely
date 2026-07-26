import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useToast } from '../../components/ui/Toast';
import { Alert } from '../../components/ui/Alert';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Textarea } from '../../components/ui/Textarea';
import { Skeleton } from '../../components/ui/Skeleton';
import { ImageUploader } from '../../components/admin/ImageUploader';
import { productApi } from '../../features/products/productApi';
import { useCategories } from '../../features/categories/useCategories';
import { useCreateProduct, useUpdateProduct } from '../../features/products/useAdminProducts';
import { ApiError } from '../../types/api';

type AttrRow = { key: string; value: string };
type FieldErrors = Partial<Record<
  'name' | 'description' | 'price' | 'compareAtPrice' | 'stock' | 'sku' | 'categoryId' | 'imageUrls',
  string
>>;



export default function AdminProductFormPage() {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();
  const toast = useToast();

  const { data: categories } = useCategories();
  const create = useCreateProduct();
  const update = useUpdateProduct();

  const { data: existing, isLoading } = useQuery({
    queryKey: ['product', 'admin', id],
    queryFn: () => productApi.byId(id!),
    enabled: isEdit,
  });

  const [form, setForm] = useState({
    name: '', description: '', price: '', compareAtPrice: '',
    stock: '', sku: '', categoryId: '', isFeatured: false, isActive: true,
  });
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [attrs, setAttrs] = useState<AttrRow[]>([]);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (existing) {
      setForm({
        name: existing.name,
        description: existing.description,
        price: String(existing.price),
        compareAtPrice: existing.compareAtPrice ? String(existing.compareAtPrice) : '',
        stock: String(existing.stock),
        sku: existing.sku,
        categoryId: existing.categoryId,
        isFeatured: existing.isFeatured,
        isActive: true,
      });
      setImageUrls(existing.imageUrls);
      setAttrs(Object.entries(existing.attributes).map(([key, value]) => ({ key, value })));
    }
  }, [existing]);

  const set = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined })); // clear field error on edit
  };

  /** Client-side validation mirroring the backend FluentValidation rules. */
  const validate = (): FieldErrors => {
    const e: FieldErrors = {};
    const price = Number(form.price);
    const compareAt = form.compareAtPrice ? Number(form.compareAtPrice) : null;
    const stock = Number(form.stock);

    if (!form.name.trim()) e.name = 'Name is required.';
    else if (form.name.trim().length > 200) e.name = 'Name is too long (max 200).';

    if (!form.description.trim()) e.description = 'Description is required.';
    else if (form.description.trim().length > 5000) e.description = 'Description is too long (max 5000).';

    if (!form.price || Number.isNaN(price) || price <= 0) e.price = 'Enter a price greater than 0.';

    if (compareAt !== null) {
      if (Number.isNaN(compareAt)) e.compareAtPrice = 'Enter a valid number.';
      else if (compareAt <= price) e.compareAtPrice = 'Compare-at price must be higher than the price.';
    }

    if (form.stock === '' || !Number.isInteger(stock) || stock < 0) e.stock = 'Enter a whole number, 0 or more.';

    if (!form.sku.trim()) e.sku = 'SKU is required.';
    else if (form.sku.trim().length > 50) e.sku = 'SKU is too long (max 50).';

    if (!form.categoryId) e.categoryId = 'Choose a category.';

    if (imageUrls.length === 0) e.imageUrls = 'Add at least one image.';
    else if (imageUrls.length > 10) e.imageUrls = 'A product can have at most 10 images.';

    return e;
  };

  const submit = () => {
    setFormError(null);

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setFormError('Please fix the highlighted fields.');
      return;
    }
    setErrors({});

    const attributes = Object.fromEntries(
      attrs.filter((a) => a.key.trim()).map((a) => [a.key.trim(), a.value.trim()]),
    );

    const input = {
      name: form.name.trim(),
      description: form.description.trim(),
      price: Number(form.price),
      compareAtPrice: form.compareAtPrice ? Number(form.compareAtPrice) : null,
      stock: Number(form.stock),
      sku: form.sku.trim(),
      categoryId: form.categoryId,
      imageUrls,
      attributes,
      isFeatured: form.isFeatured,
    };

    const onSuccess = () => {
      toast.show(isEdit ? 'Product updated.' : 'Product created.');
      navigate('/admin/products');
    };

    // Server rejected it anyway — surface its field errors on the form.
    const onError = (err: unknown) => {
      if (err instanceof ApiError && err.fieldErrors) {
        const mapped: FieldErrors = {};
        for (const [field, messages] of Object.entries(err.fieldErrors)) {
          // Backend keys are PascalCase (Price); our state is camelCase (price).
          const key = (field.charAt(0).toLowerCase() + field.slice(1)) as keyof FieldErrors;
          mapped[key] = messages[0];
        }
        setErrors(mapped);
        setFormError(err.message);
      } else {
        setFormError(err instanceof ApiError ? err.message : 'Could not save the product.');
      }
    };

    if (isEdit) {
      update.mutate({ id: id!, input: { ...input, isActive: form.isActive } }, { onSuccess, onError });
    } else {
      create.mutate(input, { onSuccess, onError });
    }
  };

  if (isEdit && isLoading) return <Skeleton className="h-96 w-full" />;

  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="display text-3xl font-bold text-ink">
        {isEdit ? 'Edit product' : 'New product'}
      </h1>

      {formError && <Alert message={formError} />}

      <div className="space-y-4">
        <Input
          label="Name"
          value={form.name}
          error={errors.name}
          onChange={(e) => set('name', e.target.value)}
        />
        <Textarea
          label="Description"
          rows={4}
          value={form.description}
          error={errors.description}
          onChange={(e) => set('description', e.target.value)}
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="Price (₹)"
            type="number"
            value={form.price}
            error={errors.price}
            onChange={(e) => set('price', e.target.value)}
          />
          <Input
            label="Compare-at price (optional)"
            type="number"
            value={form.compareAtPrice}
            error={errors.compareAtPrice}
            onChange={(e) => set('compareAtPrice', e.target.value)}
          />
          <Input
            label="Stock"
            type="number"
            value={form.stock}
            error={errors.stock}
            onChange={(e) => set('stock', e.target.value)}
          />
          <Input
            label="SKU"
            value={form.sku}
            error={errors.sku}
            onChange={(e) => set('sku', e.target.value)}
          />
        </div>

        <Select
          label="Category"
          value={form.categoryId}
          error={errors.categoryId}
          onChange={(e) => set('categoryId', e.target.value)}
          options={[
            { value: '', label: 'Choose a category…' },
            ...(categories ?? []).map((c) => ({ value: c.id, label: c.name })),
          ]}
        />

        <div>
          <ImageUploader value={imageUrls} onChange={(urls) => { setImageUrls(urls); setErrors((e) => ({ ...e, imageUrls: undefined })); }} />
          {errors.imageUrls && <p className="mt-1 text-xs text-danger">{errors.imageUrls}</p>}
        </div>

        <div className="space-y-2">
          <span className="block text-sm font-medium text-ink">Attributes</span>
          {attrs.map((row, i) => (
            <div key={i} className="flex gap-2">
              <input
                placeholder="Key (e.g. Color)"
                value={row.key}
                onChange={(e) =>
                  setAttrs((prev) => prev.map((r, j) => (j === i ? { ...r, key: e.target.value } : r)))
                }
                className="w-1/2 rounded-lg border border-line bg-surface px-3 py-2 text-sm focus:border-ink"
              />
              <input
                placeholder="Value"
                value={row.value}
                onChange={(e) =>
                  setAttrs((prev) => prev.map((r, j) => (j === i ? { ...r, value: e.target.value } : r)))
                }
                className="w-1/2 rounded-lg border border-line bg-surface px-3 py-2 text-sm focus:border-ink"
              />
              <button
                type="button"
                onClick={() => setAttrs((prev) => prev.filter((_, j) => j !== i))}
                className="px-2 text-muted hover:text-danger"
              >
                ✕
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => setAttrs((prev) => [...prev, { key: '', value: '' }])}
            className="text-sm font-medium text-ink hover:underline"
          >
            + Add attribute
          </button>
        </div>

        <div className="flex flex-wrap gap-6 pt-2">
          <label className="flex items-center gap-2 text-sm text-ink">
            <input
              type="checkbox"
              checked={form.isFeatured}
              onChange={(e) => set('isFeatured', e.target.checked)}
              className="size-4 rounded border-line accent-ink"
            />
            Featured
          </label>

          {isEdit && (
            <label className="flex items-center gap-2 text-sm text-ink">
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(e) => set('isActive', e.target.checked)}
                className="size-4 rounded border-line accent-ink"
              />
              Active (visible in store)
            </label>
          )}
        </div>

        <div className="flex gap-2 pt-2">
          <Button loading={create.isPending || update.isPending} onClick={submit}>
            {isEdit ? 'Save changes' : 'Create product'}
          </Button>
          <Button variant="secondary" onClick={() => navigate('/admin/products')}>
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}