import type { Coin, CoinDetail, PricePoint } from '../types/coin';

const API_BASE = 'https://api.coingecko.com/api/v3';

async function getJson<T>(
  url: string,
  signal?: AbortSignal
): Promise<T> {
  const response = await fetch(url, { signal });

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export function fetchCoins(signal?: AbortSignal): Promise<Coin[]> {
  const params = new URLSearchParams({
    vs_currency: 'usd',
    order: 'market_cap_desc',
    per_page: '100',
    page: '1',
    sparkline: 'true',
    price_change_percentage: '7d',
  });

  return getJson<Coin[]>(
    `${API_BASE}/coins/markets?${params.toString()}`,
    signal
  );
}

export function fetchCoinDetail(
  id: string,
  signal?: AbortSignal
): Promise<CoinDetail> {
  const params = new URLSearchParams({
    localization: 'false',
    tickers: 'false',
    community_data: 'false',
    developer_data: 'false',
  });

  return getJson<CoinDetail>(
    `${API_BASE}/coins/${encodeURIComponent(id)}?${params.toString()}`,
    signal
  );
}

export async function fetchPriceHistory(
  id: string,
  days: number,
  signal?: AbortSignal
): Promise<PricePoint[]> {
  const params = new URLSearchParams({
    vs_currency: 'usd',
    days: String(days),
  });

  const data = await getJson<{ prices: [number, number][] }>(
    `${API_BASE}/coins/${encodeURIComponent(id)}/market_chart?${params.toString()}`,
    signal
  );

  return data.prices.map(([time, price]) => ({ time, price }));
}
