import type { ReactElement } from 'react';
import { render } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import type { Coin } from '../types/coin';

export function renderWithProviders(ui: ReactElement, { route = '/' } = {}) {
  const queryClient = new QueryClient({
    // Keep the hooks' retry count but don't wait between attempts.
    defaultOptions: { queries: { retryDelay: 0 } },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[route]}>{ui}</MemoryRouter>
    </QueryClientProvider>
  );
}

export function makeCoin(overrides: Partial<Coin> = {}): Coin {
  return {
    id: 'bitcoin',
    symbol: 'btc',
    name: 'Bitcoin',
    image: 'https://example.com/btc.png',
    current_price: 66400,
    price_change_percentage_24h: 3.7,
    price_change_percentage_7d_in_currency: 5.2,
    market_cap: 1_280_000_000_000,
    market_cap_rank: 1,
    total_volume: 42_300_000_000,
    sparkline_in_7d: { price: [60000, 62000, 66400] },
    ...overrides,
  };
}

/** `count` coins ranked 1..count; rank 1 is the most expensive, the last has the biggest 24h gain. */
export function makeCoins(count: number): Coin[] {
  return Array.from({ length: count }, (_, index) =>
    makeCoin({
      id: `coin-${index + 1}`,
      symbol: `c${index + 1}`,
      name: `Coin ${index + 1}`,
      market_cap_rank: index + 1,
      current_price: (count - index) * 10,
      price_change_percentage_24h: index - 5,
    })
  );
}

export function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
