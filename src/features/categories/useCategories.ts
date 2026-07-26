import { useQuery } from '@tanstack/react-query';
import { categoryApi } from './categoryApi';

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: categoryApi.list,
    staleTime: 10 * 60_000, // categories rarely change
  });
}