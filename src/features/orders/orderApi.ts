import { api, unwrap } from '../../lib/axios';
import type { ApiResponse } from '../../types/api';
import type { Address, Order } from '../../types/order';
import type { PagedResult } from '../../types/product';

export const orderApi = {
  create: (shippingAddress: Address) =>
    unwrap(api.post<ApiResponse<Order>>('/orders', { shippingAddress })),

  myOrders: (page = 1) =>
    unwrap(api.get<ApiResponse<PagedResult<Order>>>('/orders', { params: { page, pageSize: 10 } })),

  byId: (id: string) => unwrap(api.get<ApiResponse<Order>>(`/orders/${id}`)),

  cancel: (id: string) => unwrap(api.post<ApiResponse<Order>>(`/orders/${id}/cancel`)),
};