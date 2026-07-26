import { api, unwrap } from '../../lib/axios';
import type { ApiResponse } from '../../types/api';
import type { Product } from '../../types/product';

export const wishlistApi = {
  list: () => unwrap(api.get<ApiResponse<Product[]>>('/wishlist')),
  ids: () => unwrap(api.get<ApiResponse<string[]>>('/wishlist/ids')),
  add: (productId: string) => api.post<ApiResponse<null>>(`/wishlist/${productId}`),
  remove: (productId: string) => api.delete<ApiResponse<null>>(`/wishlist/${productId}`),
};