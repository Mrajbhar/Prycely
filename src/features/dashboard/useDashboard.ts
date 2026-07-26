import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from './dashboardApi';

export function useStats() {
  return useQuery({ queryKey: ['dashboard', 'stats'], queryFn: dashboardApi.stats });
}

export function useRevenue(days: number) {
  return useQuery({
    queryKey: ['dashboard', 'revenue', days],
    queryFn: () => dashboardApi.revenue(days),
    placeholderData: (previous) => previous,
  });
}

export function useTopProducts(limit = 5) {
  return useQuery({
    queryKey: ['dashboard', 'top-products', limit],
    queryFn: () => dashboardApi.topProducts(limit),
  });
}

export function useOrderStatus() {
  return useQuery({ queryKey: ['dashboard', 'order-status'], queryFn: dashboardApi.orderStatus });
}

export function useLowStock(threshold = 10) {
  return useQuery({
    queryKey: ['dashboard', 'low-stock', threshold],
    queryFn: () => dashboardApi.lowStock(threshold),
  });
}