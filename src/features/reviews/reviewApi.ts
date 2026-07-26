import { api, unwrap } from '../../lib/axios';
import type { ApiResponse } from '../../types/api';
import type { PagedResult } from '../../types/product';
import type { Review, ReviewSummary } from '../../types/review';

export interface ReviewInput {
  rating: number;
  title: string;
  comment: string;
}
export const reviewApi = {
  forProduct: (productId: string, page = 1) =>
    unwrap(
      api.get<ApiResponse<PagedResult<Review>>>(`/reviews/product/${productId}`, {
        params: { page, pageSize: 5 },
      }),
    ),

  summary: (productId: string) =>
    unwrap(api.get<ApiResponse<ReviewSummary>>(`/reviews/product/${productId}/summary`)),

  mine: (productId: string) =>
    unwrap(api.get<ApiResponse<Review | null>>(`/reviews/product/${productId}/mine`)),

  canReview: (productId: string) =>
    unwrap(api.get<ApiResponse<boolean>>(`/reviews/product/${productId}/can-review`)),

  create: (productId: string, input: ReviewInput) =>
    unwrap(api.post<ApiResponse<Review>>('/reviews', { productId, ...input })),

  update: (id: string, input: ReviewInput) =>
    unwrap(api.put<ApiResponse<Review>>(`/reviews/${id}`, input)),

  remove: (id: string) => api.delete<ApiResponse<null>>(`/reviews/${id}`),
};