import { api, unwrap } from '../../lib/axios';
import type { ApiResponse } from '../../types/api';
import type {
  CategorySales,
  DashboardStats,
  LowStockProduct,
  OrderStatusCount,
  RevenuePoint,
  TopProduct,
} from '../../types/dashboard';

export const dashboardApi = {
  stats: () => unwrap(api.get<ApiResponse<DashboardStats>>('/dashboard/stats')),

  revenue: (days: number) =>
    unwrap(api.get<ApiResponse<RevenuePoint[]>>('/dashboard/revenue', { params: { days } })),

  topProducts: (limit: number) =>
    unwrap(api.get<ApiResponse<TopProduct[]>>('/dashboard/top-products', { params: { limit } })),

  orderStatus: () =>
    unwrap(api.get<ApiResponse<OrderStatusCount[]>>('/dashboard/order-status')),

  salesByCategory: () =>
    unwrap(api.get<ApiResponse<CategorySales[]>>('/dashboard/sales-by-category')),

  lowStock: (threshold: number) =>
    unwrap(api.get<ApiResponse<LowStockProduct[]>>('/dashboard/low-stock', { params: { threshold } })),
};