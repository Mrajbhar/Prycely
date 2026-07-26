import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../auth/useAuth';
import { cartApi } from './cartApi';

const CART_KEY = ['cart'];

export function useCart() {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: CART_KEY,
    queryFn: cartApi.get,
    // Cart is per-user. Don't fetch (or 401) for guests.
    enabled: isAuthenticated,
    staleTime: 0,
  });
}

/** Every mutation returns the whole cart, so we seed the cache instead of refetching. */
export function useAddToCart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ productId, quantity }: { productId: string; quantity: number }) =>
      cartApi.addItem(productId, quantity),
    onSuccess: (cart) => queryClient.setQueryData(CART_KEY, cart),
  });
}

export function useUpdateCartItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ productId, quantity }: { productId: string; quantity: number }) =>
      cartApi.updateItem(productId, quantity),
    onSuccess: (cart) => queryClient.setQueryData(CART_KEY, cart),
  });
}

export function useRemoveCartItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (productId: string) => cartApi.removeItem(productId),
    onSuccess: (cart) => queryClient.setQueryData(CART_KEY, cart),
  });
}