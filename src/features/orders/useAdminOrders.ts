import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { adminOrderApi } from './adminOrderApi';
import type { OrderStatus } from '../../types/order';

export function useAllOrders(page: number, status?: OrderStatus) {
  return useQuery({
    queryKey: ['orders', 'all', page, status],
    queryFn: () => adminOrderApi.all(page, status),
    placeholderData: (previous) => previous,
  });
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: OrderStatus }) =>
      adminOrderApi.updateStatus(id, status),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['orders'] });
      void queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
}