import { useQuery } from '@tanstack/react-query';
import { productApi, type ProductQuery } from './productApi';

export function useProducts(query: ProductQuery = {}) {
  return useQuery({
    queryKey: ['products', query],
    queryFn: () => productApi.list(query),
    // Keeps the old page on screen while the next one loads — no layout flash.
    placeholderData: (previous) => previous,
  });
}

export function useProduct(slug: string) {
  return useQuery({
    queryKey: ['product', slug],
    queryFn: () => productApi.bySlug(slug),
    enabled: !!slug,
  });
}

export function useSimilarProducts(productId: string | undefined) {
  return useQuery({
    queryKey: ['products', 'similar', productId],
    queryFn: () => productApi.similar(productId!),
    enabled: !!productId,
    // Embeddings may not exist yet; an empty strip is fine, don't retry hard.
    retry: false,
  });
}