import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../auth/useAuth';
import { wishlistApi } from './wishlistApi';

const IDS_KEY = ['wishlist', 'ids'];
const LIST_KEY = ['wishlist'];

/** Full product objects — for the wishlist page. */
export function useWishlist() {
  const { isAuthenticated } = useAuth();
  return useQuery({
    queryKey: LIST_KEY,
    queryFn: wishlistApi.list,
    enabled: isAuthenticated,
  });
}

/** Just the IDs — cheap, powers every heart icon's filled/empty state. */
export function useWishlistIds() {
  const { isAuthenticated } = useAuth();
  return useQuery({
    queryKey: IDS_KEY,
    queryFn: wishlistApi.ids,
    enabled: isAuthenticated,
    staleTime: 60_000,
  });
}

/** Optimistic toggle — the heart flips instantly, reverts if the server says no. */
export function useToggleWishlist() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ productId, wished }: { productId: string; wished: boolean }) =>
      wished ? wishlistApi.remove(productId) : wishlistApi.add(productId),

    onMutate: async ({ productId, wished }) => {
      await queryClient.cancelQueries({ queryKey: IDS_KEY });
      const previous = queryClient.getQueryData<string[]>(IDS_KEY) ?? [];

      queryClient.setQueryData<string[]>(IDS_KEY, (ids = []) =>
        wished ? ids.filter((id) => id !== productId) : [...ids, productId],
      );

      return { previous };
    },

    onError: (_err, _vars, context) => {
      if (context?.previous) queryClient.setQueryData(IDS_KEY, context.previous);
    },

    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: IDS_KEY });
      void queryClient.invalidateQueries({ queryKey: LIST_KEY });
    },
  });
}