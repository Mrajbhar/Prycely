import { api, unwrap } from '../../lib/axios';
import type { ApiResponse } from '../../types/api';
import type { Product } from '../../types/product';

export interface SearchResult {
  product: Product;
  score: number;
}

export const searchApi = {
  semantic: (query: string, limit = 12) =>
    unwrap(
      api.post<ApiResponse<SearchResult[]>>('/products/search/semantic', {
        query,
        limit,
        minScore: 0.3,
      }),
    ),
};