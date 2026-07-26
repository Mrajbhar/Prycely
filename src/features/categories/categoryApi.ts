import { api, unwrap } from '../../lib/axios';
import type { ApiResponse } from '../../types/api';
import type { Category } from '../../types/product';

export const categoryApi = {
  list: () => unwrap(api.get<ApiResponse<Category[]>>('/categories')),
};