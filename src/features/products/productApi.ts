import { api, unwrap } from '../../lib/axios';
import type { ApiResponse, PagedResult } from '../../types/api';
import type { Product } from '../../types/product';

export interface ProductQuery {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  search?: string;
  categorySlug?: string;
  minPrice?: number;
  maxPrice?: number;
  inStockOnly?: boolean;
  onSale?: boolean;
  featuredOnly?: boolean;
}

export const productApi = {
  list: (query: ProductQuery = {}) => {
    const params = new URLSearchParams();

    if (query.page) params.set('page', String(query.page));
    if (query.pageSize) params.set('pageSize', String(query.pageSize));
    if (query.sortBy) params.set('sortBy', query.sortBy);
    if (query.search) params.set('search', query.search);
    if (query.categorySlug) params.set('categorySlug', query.categorySlug);
    if (query.minPrice != null) params.set('minPrice', String(query.minPrice));
    if (query.maxPrice != null) params.set('maxPrice', String(query.maxPrice));
    if (query.inStockOnly) params.set('inStockOnly', 'true');
    if (query.onSale) params.set('onSale', 'true');
    if (query.featuredOnly) params.set('featuredOnly', 'true');

    return unwrap(api.get<ApiResponse<PagedResult<Product>>>(`/products?${params.toString()}`));
  },

  byId: (id: string) =>
    unwrap(api.get<ApiResponse<Product>>(`/products/${id}`)),

  bySlug: (slug: string) =>
    unwrap(api.get<ApiResponse<Product>>(`/products/slug/${slug}`)),

  similar: (productId: string) =>
    unwrap(api.get<ApiResponse<Product[]>>(`/products/${productId}/similar`)),
};