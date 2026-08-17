import { useQuery } from '@tanstack/react-query';
import {
  getPublicResources,
  getFeaturedResource,
  getPublicResourceBySlug,
} from '@/features/public/publicResourcesService';

export const publicResourceKeys = {
  all: ['public', 'resources'],
  list: (params) => [...publicResourceKeys.all, 'list', params],
  featured: ['public', 'resources', 'featured'],
  detail: (slug) => [...publicResourceKeys.all, 'detail', slug],
};

export function usePublicResources(params) {
  return useQuery({
    queryKey: publicResourceKeys.list(params),
    queryFn: () => getPublicResources(params),
    placeholderData: (previousData) => previousData,
    staleTime: 30_000,
  });
}

export function useFeaturedResource() {
  return useQuery({
    queryKey: publicResourceKeys.featured,
    queryFn: getFeaturedResource,
    staleTime: 30_000,
  });
}

export function usePublicResourceDetails(slug) {
  return useQuery({
    queryKey: publicResourceKeys.detail(slug),
    queryFn: () => getPublicResourceBySlug(slug),
    enabled: Boolean(slug),
    staleTime: 30_000,
  });
}
