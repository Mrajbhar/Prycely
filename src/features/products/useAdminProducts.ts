import { useMutation, useQueryClient } from '@tanstack/react-query';
import { adminProductApi, type ProductInput } from './adminProductApi';

function useInvalidate() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: ['products'] });
}

export function useCreateProduct() {
  const invalidate = useInvalidate();
  return useMutation({ mutationFn: adminProductApi.create, onSuccess: invalidate });
}

export function useUpdateProduct() {
  const invalidate = useInvalidate();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: ProductInput & { isActive: boolean } }) =>
      adminProductApi.update(id, input),
    onSuccess: invalidate,
  });
}

export function useDeleteProduct() {
  const invalidate = useInvalidate();
  return useMutation({ mutationFn: adminProductApi.remove, onSuccess: invalidate });
}