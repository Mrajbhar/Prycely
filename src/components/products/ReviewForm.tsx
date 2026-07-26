import { useEffect, useState } from 'react';
import { useToast } from '../ui/Toast';
import { Alert } from '../ui/Alert';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { StarRatingInput } from './StarRatingInput';
import { useAuth } from '../../features/auth/useAuth';
import {
  useCreateReview,
  useDeleteReview,
  useMyReview,
  useUpdateReview,
} from '../../features/reviews/useReviews';
import { ApiError } from '../../types/api';

export function ReviewForm({ productId }: { productId: string }) {
  const { isAuthenticated } = useAuth();
  const { data: mine } = useMyReview(productId);
  const toast = useToast();

  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [error, setError] = useState<string | null>(null);

  const editing = !!mine;

  // Prefill when the user's existing review loads.
  useEffect(() => {
    if (mine) {
      setRating(mine.rating);
      setTitle(mine.title);
      setComment(mine.comment);
    }
  }, [mine]);

  const create = useCreateReview(productId);
  const update = useUpdateReview(productId, mine?.id ?? '');
  const remove = useDeleteReview(productId, mine?.id ?? '');

  if (!isAuthenticated) {
    return (
      <p className="rounded-card border border-line bg-surface p-5 text-sm text-muted">
        Sign in to write a review.
      </p>
    );
  }

  const submit = () => {
    setError(null);

    if (rating < 1) return setError('Pick a star rating.');
    if (!title.trim()) return setError('Add a short title.');
    if (comment.trim().length < 10) return setError('Your review needs at least 10 characters.');

    const input = { rating, title: title.trim(), comment: comment.trim() };
    const mutation = editing ? update : create;

    mutation.mutate(input, {
      onSuccess: () => toast.show(editing ? 'Review updated.' : 'Review posted.'),
      onError: (err) => setError(err instanceof ApiError ? err.message : 'Could not save review.'),
    });
  };

  const handleDelete = () =>
    remove.mutate(undefined, {
      onSuccess: () => {
        toast.show('Review removed.');
        setRating(0);
        setTitle('');
        setComment('');
      },
    });

  return (
    <div className="rounded-card border border-line bg-surface p-5">
      <h3 className="text-sm font-semibold text-ink">
        {editing ? 'Edit your review' : 'Write a review'}
      </h3>

      <div className="mt-4 space-y-4">
        {error && <Alert message={error} />}

        <div className="space-y-1.5">
          <span className="block text-sm font-medium text-ink">Rating</span>
          <StarRatingInput value={rating} onChange={setRating} />
        </div>

        <Input
          label="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Sums up your experience"
        />

        <Textarea
          label="Review"
          rows={4}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="What did you like or dislike?"
        />

        <div className="flex items-center gap-3">
          <Button loading={create.isPending || update.isPending} onClick={submit}>
            {editing ? 'Update review' : 'Post review'}
          </Button>

          {editing && (
            <button
              type="button"
              onClick={handleDelete}
              disabled={remove.isPending}
              className="text-xs text-muted hover:text-danger disabled:opacity-50"
            >
              Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
}