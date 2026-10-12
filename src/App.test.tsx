import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import App from './App';
import { jsonResponse, makeCoins, renderWithProviders } from './test/utils';

const fetchMock = vi.fn<typeof fetch>();

beforeEach(() => {
  vi.stubGlobal('fetch', fetchMock);
});

afterEach(() => {
  fetchMock.mockReset();
});

const coinHeadings = () =>
  screen.getAllByRole('heading', { level: 2 }).map((heading) => heading.textContent);

describe('Markets dashboard', () => {
  it('shows a loading state, then the first page of coins', async () => {
    fetchMock.mockResolvedValue(jsonResponse(makeCoins(15)));
    renderWithProviders(<App />);

    expect(screen.getByLabelText('Loading market data')).toBeInTheDocument();
    expect(await screen.findByRole('heading', { name: 'Coin 1' })).toBeInTheDocument();
    expect(coinHeadings()).toHaveLength(12);
    expect(screen.getByText('Showing 1–12 of 15')).toBeInTheDocument();
  });

  it('paginates between pages', async () => {
    fetchMock.mockResolvedValue(jsonResponse(makeCoins(15)));
    renderWithProviders(<App />);
    await screen.findByRole('heading', { name: 'Coin 1' });

    await userEvent.click(screen.getByRole('button', { name: 'Next page' }));

    expect(coinHeadings()).toEqual(['Coin 13', 'Coin 14', 'Coin 15']);
    expect(screen.getByRole('button', { name: 'Page 2' })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('button', { name: 'Next page' })).toBeDisabled();

    await userEvent.click(screen.getByRole('button', { name: 'Page 1' }));
    expect(coinHeadings()).toHaveLength(12);
  });

  it('filters by search and resets to page 1', async () => {
    fetchMock.mockResolvedValue(jsonResponse(makeCoins(15)));
    renderWithProviders(<App />);
    await screen.findByRole('heading', { name: 'Coin 1' });

    await userEvent.click(screen.getByRole('button', { name: 'Page 2' }));
    await userEvent.type(
      screen.getByRole('searchbox', { name: 'Search cryptocurrencies' }),
      'coin 1'
    );

    // Matches "Coin 1" and "Coin 10" through "Coin 15".
    expect(coinHeadings()).toEqual([
      'Coin 1', 'Coin 10', 'Coin 11', 'Coin 12', 'Coin 13', 'Coin 14', 'Coin 15',
    ]);
    expect(screen.queryByRole('navigation', { name: 'Pagination' })).not.toBeInTheDocument();
  });

  it('shows an empty state when the search matches nothing', async () => {
    fetchMock.mockResolvedValue(jsonResponse(makeCoins(3)));
    renderWithProviders(<App />);
    await screen.findByRole('heading', { name: 'Coin 1' });

    await userEvent.type(screen.getByRole('searchbox'), 'zzz');
    expect(screen.getByText('No cryptocurrencies found.')).toBeInTheDocument();
  });

  it('sorts by price and 24h change', async () => {
    fetchMock.mockResolvedValue(jsonResponse(makeCoins(3)));
    renderWithProviders(<App />);
    await screen.findByRole('heading', { name: 'Coin 1' });
    const sort = screen.getByRole('combobox', { name: 'Sort cryptocurrencies' });

    await userEvent.selectOptions(sort, 'price-asc');
    expect(coinHeadings()).toEqual(['Coin 3', 'Coin 2', 'Coin 1']);

    await userEvent.selectOptions(sort, 'change-desc');
    expect(coinHeadings()).toEqual(['Coin 3', 'Coin 2', 'Coin 1']);

    await userEvent.selectOptions(sort, 'price-desc');
    expect(coinHeadings()).toEqual(['Coin 1', 'Coin 2', 'Coin 3']);
  });

  it('shows an error when the API fails, and recovers on retry', async () => {
    fetchMock.mockResolvedValue(jsonResponse({ error: 'rate limited' }, 429));
    renderWithProviders(<App />);

    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent('Unable to load market data');
    // Initial attempt plus two retries.
    expect(fetchMock).toHaveBeenCalledTimes(3);

    fetchMock.mockResolvedValue(jsonResponse(makeCoins(2)));
    await userEvent.click(within(alert).getByRole('button', { name: 'Retry' }));

    expect(await screen.findByRole('heading', { name: 'Coin 1' })).toBeInTheDocument();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('shows an error when the network request rejects', async () => {
    fetchMock.mockRejectedValue(new TypeError('Failed to fetch'));
    renderWithProviders(<App />);

    expect(await screen.findByRole('alert')).toHaveTextContent('Unable to load market data');
  });

  it('adds coins to the watchlist and filters by it', async () => {
    fetchMock.mockResolvedValue(jsonResponse(makeCoins(3)));
    renderWithProviders(<App />);
    await screen.findByRole('heading', { name: 'Coin 1' });

    await userEvent.click(screen.getByRole('tab', { name: 'Watchlist (0)' }));
    expect(screen.getByText(/watchlist is empty/i)).toBeInTheDocument();

    await userEvent.click(screen.getByRole('tab', { name: 'All Tokens' }));
    await userEvent.click(screen.getByRole('button', { name: 'Add Coin 2 to watchlist' }));
    await userEvent.click(screen.getByRole('tab', { name: 'Watchlist (1)' }));

    expect(coinHeadings()).toEqual(['Coin 2']);
    expect(JSON.parse(localStorage.getItem('watchlist') ?? '[]')).toEqual(['coin-2']);
  });

  it('toggles the theme and remembers the choice', async () => {
    fetchMock.mockResolvedValue(jsonResponse([]));
    renderWithProviders(<App />);

    // matchMedia is stubbed to prefer light in the test setup.
    expect(document.documentElement).not.toHaveClass('dark');

    await userEvent.click(screen.getByRole('button', { name: 'Switch to dark mode' }));
    expect(document.documentElement).toHaveClass('dark');
    expect(localStorage.getItem('theme')).toBe('dark');

    await userEvent.click(screen.getByRole('button', { name: 'Switch to light mode' }));
    expect(document.documentElement).not.toHaveClass('dark');
    expect(localStorage.getItem('theme')).toBe('light');
  });

  it('starts in the saved theme', () => {
    localStorage.setItem('theme', 'dark');
    fetchMock.mockResolvedValue(jsonResponse([]));
    renderWithProviders(<App />);

    expect(document.documentElement).toHaveClass('dark');
    expect(screen.getByRole('button', { name: 'Switch to light mode' })).toBeInTheDocument();
  });
});

describe('Coin detail page', () => {
  const detail = {
    id: 'bitcoin',
    symbol: 'btc',
    name: 'Bitcoin',
    image: { large: 'l.png', small: 's.png', thumb: 't.png' },
    description: { en: 'Bitcoin is the <a href="https://x">first</a> cryptocurrency.' },
    links: { homepage: ['https://bitcoin.org', ''] },
    market_cap_rank: 1,
    market_data: {
      current_price: { usd: 66400 },
      market_cap: { usd: 1_280_000_000_000 },
      total_volume: { usd: 42_300_000_000 },
      high_24h: { usd: 67000 },
      low_24h: { usd: 65000 },
      ath: { usd: 73000 },
      atl: { usd: 67.81 },
      price_change_percentage_24h: 3.7,
      price_change_percentage_7d: 5.1,
      price_change_percentage_30d: -2.4,
      circulating_supply: 19_700_000,
      total_supply: 21_000_000,
      max_supply: 21_000_000,
    },
  };

  const routeFetch = (detailStatus?: number) =>
    fetchMock.mockImplementation(async (input) => {
      const url = String(input);
      if (url.includes('/coins/markets')) return jsonResponse([]);
      if (url.includes('/market_chart')) {
        return jsonResponse({
          prices: [
            [1700000000000, 65000],
            [1700003600000, 66400],
          ],
        });
      }
      return detailStatus ? jsonResponse({}, detailStatus) : jsonResponse(detail);
    });

  it('shows coin information, stats, and switches chart range', async () => {
    routeFetch();
    renderWithProviders(<App />, { route: '/coin/bitcoin' });

    expect(await screen.findByRole('heading', { name: 'Bitcoin', level: 1 })).toBeInTheDocument();
    expect(screen.getByText('Rank #1')).toBeInTheDocument();
    expect(screen.getByText('$66,400.00')).toBeInTheDocument();
    expect(screen.getByText('$73,000.00')).toBeInTheDocument();
    expect(screen.getByText('-2.40%')).toBeInTheDocument();
    // Description HTML is rendered as plain text.
    expect(screen.getByText('Bitcoin is the first cryptocurrency.')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /website/i })).toHaveAttribute(
      'href',
      'https://bitcoin.org'
    );

    await userEvent.click(screen.getByRole('button', { name: '30D' }));
    await waitFor(() =>
      expect(fetchMock).toHaveBeenCalledWith(
        expect.stringContaining('/coins/bitcoin/market_chart?vs_currency=usd&days=30'),
        expect.anything()
      )
    );
    expect(screen.getByRole('button', { name: '30D' })).toHaveAttribute('aria-pressed', 'true');
  });

  it('shows an error for an unknown coin', async () => {
    routeFetch(404);
    renderWithProviders(<App />, { route: '/coin/not-a-coin' });

    expect(await screen.findByRole('alert')).toHaveTextContent('Unable to load this coin');
    expect(screen.getByRole('link', { name: 'All coins' })).toHaveAttribute('href', '/');
  });
});
