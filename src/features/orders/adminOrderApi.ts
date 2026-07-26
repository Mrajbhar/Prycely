import { api, unwrap } from '../../lib/axios';
import type { ApiResponse } from '../../types/api';
import type { Order, OrderStatus } from '../../types/order';
import type { PagedResult } from '../../types/product';

export const adminOrderApi = {
  all: (page = 1, status?: OrderStatus) =>
    unwrap(
      api.get<ApiResponse<PagedResult<Order>>>('/orders/all', {
        params: { page, pageSize: 20, status },
      }),
    ),

  updateStatus: (id: string, status: OrderStatus) =>
    unwrap(api.put<ApiResponse<Order>>(`/orders/${id}/status`, { status })),
};