import { useState } from 'react';
import { useToast } from '../../components/ui/Toast';
import { Alert } from '../../components/ui/Alert';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { Skeleton } from '../../components/ui/Skeleton';
import { useCategories } from '../../features/categories/useCategories';
import {
  useCreateCategory,
  useDeleteCategory,
  useUpdateCategory,
} from '../../features/categories/useAdminCategories';
import type { Category } from '../../types/product';
import { ApiError } from '../../types/api';

export default function AdminCategoriesPage() {
  const { data: categories, isLoading } = useCategories();
  const toast = useToast();

  const [editing, setEditing] = useState<Category | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [error, setError] = useState<string | null>(null);

  const create = useCreateCategory();
  const update = useUpdateCategory();
  const remove = useDeleteCategory();

  const startEdit = (category: Category) => {
    setEditing(category);
    setName(category.name);
    setDescription(category.description);
    setImageUrl(category.imageUrl ?? '');
    setError(null);
  };

  const reset = () => {
    setEditing(null);
    setName('');
    setDescription('');
    setImageUrl('');
    setError(null);
  };

  const submit = () => {
    setError(null);
    if (!name.trim()) return setError('Name is required.');

    const input = { name: name.trim(), description: description.trim(), imageUrl: imageUrl || null };
    const onError = (err: unknown) =>
      setError(err instanceof ApiError ? err.message : 'Could not save.');

    if (editing) {
      update.mutate(
        { id: editing.id, input: { ...input, isActive: editing.isActive } },
        { onSuccess: () => { toast.show('Category updated.'); reset(); }, onError },
      );
    } else {
      create.mutate(input, {
        onSuccess: () => { toast.show('Category created.'); reset(); },
        onError,
      });
    }
  };

  const handleDelete = (category: Category) => {
    if (!confirm(`Delete “${category.name}”? This fails if it still has products.`)) return;
    remove.mutate(category.id, {
      onSuccess: () => toast.show('Category deleted.'),
      onError: (err) => toast.show(err instanceof ApiError ? err.message : 'Could not delete.'),
    });
  };

  return (
    <div className="space-y-8">
      <h1 className="display text-3xl font-bold text-ink">Categories</h1>

      <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
        {/* List */}
        <div className="space-y-3">
          {isLoading &&
            Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-16 w-full" />)}

          {categories?.map((category) => (
            <div
              key={category.id}
              className="flex items-center justify-between rounded-card border border-line bg-surface p-4"
            >
              <div>
                <p className="text-sm font-medium text-ink">{category.name}</p>
                <p className="price text-xs text-muted">{category.slug}</p>
              </div>
              <div className="flex gap-3 text-sm">
                <button onClick={() => startEdit(category)} className="text-brand hover:underline">
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(category)}
                  className="text-muted hover:text-danger"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Form */}
        <aside className="h-fit rounded-card border border-line bg-surface p-5">
          <h2 className="text-sm font-semibold text-ink">
            {editing ? 'Edit category' : 'New category'}
          </h2>

          <div className="mt-4 space-y-4">
            {error && <Alert message={error} />}
            <Input label="Name" value={name} onChange={(e) => setName(e.target.value)} />
            <Textarea
              label="Description"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <Input
              label="Image URL (optional)"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
            />

            <div className="flex gap-2">
              <Button loading={create.isPending || update.isPending} onClick={submit}>
                {editing ? 'Save' : 'Create'}
              </Button>
              {editing && (
                <Button variant="secondary" onClick={reset}>
                  Cancel
                </Button>
              )}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}