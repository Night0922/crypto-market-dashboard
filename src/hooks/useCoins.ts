import { useQuery } from '@tanstack/react-query';
import {
  fetchCoinDetail,
  fetchCoins,
  fetchPriceHistory,
} from '../api/coins';

export function useCoins() {
  return useQuery({
    queryKey: ['coins', 'top100', 'usd'],
    queryFn: ({ signal }) => fetchCoins(signal),
    staleTime: 60 * 1000,
    gcTime: 5 * 60 * 1000,
    retry: 2,
    refetchOnWindowFocus: false,
  });
}

export function useCoinDetail(id: string) {
  return useQuery({
    queryKey: ['coin', id],
    queryFn: ({ signal }) => fetchCoinDetail(id, signal),
    staleTime: 60 * 1000,
    retry: 2,
    refetchOnWindowFocus: false,
  });
}

export function usePriceHistory(id: string, days: number) {
  return useQuery({
    queryKey: ['coin', id, 'history', days],
    queryFn: ({ signal }) => fetchPriceHistory(id, days, signal),
    staleTime: 5 * 60 * 1000,
    retry: 2,
    refetchOnWindowFocus: false,
  });
}
