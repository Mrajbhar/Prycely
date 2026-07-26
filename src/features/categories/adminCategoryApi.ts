import { api, unwrap } from '../../lib/axios';
import type { ApiResponse } from '../../types/api';
import type { Category } from '../../types/product';

export interface CategoryInput {
  name: string;
  description: string;
  imageUrl?: string | null;
}

export const adminCategoryApi = {
  create: (input: CategoryInput) =>
    unwrap(api.post<ApiResponse<Category>>('/categories', input)),

  update: (id: string, input: CategoryInput & { isActive: boolean }) =>
    unwrap(api.put<ApiResponse<Category>>(`/categories/${id}`, input)),

  remove: (id: string) => api.delete<ApiResponse<null>>(`/categories/${id}`),
};