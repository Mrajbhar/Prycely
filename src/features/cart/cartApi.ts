import { api, unwrap } from '../../lib/axios';
import type { ApiResponse } from '../../types/api';
import type { Cart } from '../../types/cart';

export const cartApi = {
  get: () => unwrap(api.get<ApiResponse<Cart>>('/cart')),

  addItem: (productId: string, quantity: number) =>
    unwrap(api.post<ApiResponse<Cart>>('/cart/items', { productId, quantity })),

  updateItem: (productId: string, quantity: number) =>
    unwrap(api.put<ApiResponse<Cart>>(`/cart/items/${productId}`, { quantity })),

  removeItem: (productId: string) =>
    unwrap(api.delete<ApiResponse<Cart>>(`/cart/items/${productId}`)),

  clear: () => api.delete<ApiResponse<null>>('/cart'),
};