import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import type { Address, Order } from '../../types/order';
import { orderApi } from './orderApi';

export function useMyOrders(page = 1) {
  return useQuery({
    queryKey: ['orders', page],
    queryFn: () => orderApi.myOrders(page),
    placeholderData: (previous) => previous,
  });
}

export function useOrder(id: string) {
  return useQuery({
    queryKey: ['order', id],
    queryFn: () => orderApi.byId(id),
    enabled: !!id,
  });
}

export function usePlaceOrder() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (address: Address) => orderApi.create(address),
    onSuccess: (order: Order) => {
      // The backend cleared the cart and decremented stock — our caches are stale.
      queryClient.setQueryData(['cart'], { id: '', items: [], subtotal: 0, totalItems: 0 });
      void queryClient.invalidateQueries({ queryKey: ['orders'] });
      void queryClient.invalidateQueries({ queryKey: ['products'] });

      navigate(`/orders/${order.id}`, { replace: true });
    },
  });
}

export function useCancelOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => orderApi.cancel(id),
    onSuccess: (order) => {
      queryClient.setQueryData(['order', order.id], order);
      void queryClient.invalidateQueries({ queryKey: ['orders'] });
      void queryClient.invalidateQueries({ queryKey: ['products'] }); // stock restored
    },
  });
}