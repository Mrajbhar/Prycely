import { useMutation, useQueryClient } from '@tanstack/react-query';
import { adminCategoryApi, type CategoryInput } from './adminCategoryApi';

function useInvalidate() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: ['categories'] });
}

export function useCreateCategory() {
  const invalidate = useInvalidate();
  return useMutation({ mutationFn: adminCategoryApi.create, onSuccess: invalidate });
}

export function useUpdateCategory() {
  const invalidate = useInvalidate();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: CategoryInput & { isActive: boolean } }) =>
      adminCategoryApi.update(id, input),
    onSuccess: invalidate,
  });
}

export function useDeleteCategory() {
  const invalidate = useInvalidate();
  return useMutation({ mutationFn: adminCategoryApi.remove, onSuccess: invalidate });
}