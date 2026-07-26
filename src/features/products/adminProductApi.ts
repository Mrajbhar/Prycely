import { api, unwrap } from '../../lib/axios';
import type { ApiResponse } from '../../types/api';
import type { Product } from '../../types/product';

export interface ProductInput {
  name: string;
  description: string;
  price: number;
  compareAtPrice?: number | null;
  stock: number;
  sku: string;
  categoryId: string;
  imageUrls: string[];
  attributes: Record<string, string>;
  isFeatured: boolean;
}

export const adminProductApi = {
  create: (input: ProductInput) =>
    unwrap(api.post<ApiResponse<Product>>('/products', input)),

  update: (id: string, input: ProductInput & { isActive: boolean }) =>
    unwrap(api.put<ApiResponse<Product>>(`/products/${id}`, input)),

  remove: (id: string) => api.delete<ApiResponse<null>>(`/products/${id}`),
};