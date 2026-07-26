import { useQuery } from '@tanstack/react-query';
import { searchApi } from './searchApi';

export function useSemanticSearch(query: string) {
  const trimmed = query.trim();
  return useQuery({
    queryKey: ['search', 'semantic', trimmed],
    queryFn: () => searchApi.semantic(trimmed),
    enabled: trimmed.length > 1,
    retry: false, // Ollama may be offline — fail fast, show the fallback.
  });
}