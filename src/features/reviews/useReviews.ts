import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../auth/useAuth';
import { reviewApi, type ReviewInput } from './reviewApi';

export function useReviews(productId: string | undefined, page = 1) {
  return useQuery({
    queryKey: ['reviews', productId, page],
    queryFn: () => reviewApi.forProduct(productId!, page),
    enabled: !!productId,
  });
}

export function useReviewSummary(productId: string | undefined) {
  return useQuery({
    queryKey: ['reviews', 'summary', productId],
    queryFn: () => reviewApi.summary(productId!),
    enabled: !!productId,
  });
}

export function useMyReview(productId: string | undefined) {
  return useQuery({
    queryKey: ['reviews', 'mine', productId],
    queryFn: () => reviewApi.mine(productId!),
    enabled: !!productId,
    retry: false,
  });
}

/** Is the signed-in user eligible to review this product? Backend decides. */
export function useCanReview(productId: string | undefined) {
  const { isAuthenticated } = useAuth();
  return useQuery({
    queryKey: ['reviews', 'can-review', productId],
    queryFn: () => reviewApi.canReview(productId!),
    enabled: !!productId && isAuthenticated,
    retry: false,
  });
}

/** Refreshes reviews, summary, my-review, eligibility, and the product (averageRating changed). */
function useReviewInvalidation(productId: string) {
  const queryClient = useQueryClient();
  return () => {
    void queryClient.invalidateQueries({ queryKey: ['reviews', productId] });
    void queryClient.invalidateQueries({ queryKey: ['reviews', 'summary', productId] });
    void queryClient.invalidateQueries({ queryKey: ['reviews', 'mine', productId] });
    void queryClient.invalidateQueries({ queryKey: ['reviews', 'can-review', productId] });
    void queryClient.invalidateQueries({ queryKey: ['product'] });
  };
}

export function useCreateReview(productId: string) {
  const invalidate = useReviewInvalidation(productId);
  return useMutation({
    mutationFn: (input: ReviewInput) => reviewApi.create(productId, input),
    onSuccess: invalidate,
  });
}

export function useUpdateReview(productId: string, reviewId: string) {
  const invalidate = useReviewInvalidation(productId);
  return useMutation({
    mutationFn: (input: ReviewInput) => reviewApi.update(reviewId, input),
    onSuccess: invalidate,
  });
}

export function useDeleteReview(productId: string, reviewId: string) {
  const invalidate = useReviewInvalidation(productId);
  return useMutation({
    mutationFn: () => reviewApi.remove(reviewId),
    onSuccess: invalidate,
  });
}