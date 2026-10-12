import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { makeCoin, renderWithProviders } from '../test/utils';
import CoinCard from './CoinCard';

describe('CoinCard', () => {
  it('shows the coin name, symbol, price, change, and stats', () => {
    renderWithProviders(
      <CoinCard coin={makeCoin()} watched={false} onToggleWatchlist={vi.fn()} />
    );

    expect(screen.getByRole('heading', { name: 'Bitcoin' })).toBeInTheDocument();
    expect(screen.getByText('btc')).toBeInTheDocument();
    expect(screen.getByText('$66,400.00')).toBeInTheDocument();
    expect(screen.getByText('3.70%')).toBeInTheDocument();
    expect(screen.getByText('up')).toBeInTheDocument();
    expect(screen.getByText('$1.28T')).toBeInTheDocument();
    expect(screen.getByText('$42.3B')).toBeInTheDocument();
    expect(screen.getByText('+5.20%')).toBeInTheDocument();
  });

  it('marks negative changes as down', () => {
    renderWithProviders(
      <CoinCard
        coin={makeCoin({ price_change_percentage_24h: -1.4 })}
        watched={false}
        onToggleWatchlist={vi.fn()}
      />
    );

    expect(screen.getByText('1.40%')).toHaveClass('text-red-600');
    expect(screen.getByText('down')).toBeInTheDocument();
  });

  it('shows N/A for missing price data', () => {
    renderWithProviders(
      <CoinCard
        coin={makeCoin({ current_price: null, price_change_percentage_24h: null })}
        watched={false}
        onToggleWatchlist={vi.fn()}
      />
    );

    expect(screen.getAllByText('N/A')).toHaveLength(2);
  });

  it('links to the detail page and toggles the watchlist', async () => {
    const onToggle = vi.fn();
    renderWithProviders(
      <CoinCard coin={makeCoin()} watched={false} onToggleWatchlist={onToggle} />
    );

    expect(screen.getByRole('link', { name: 'View Bitcoin details' })).toHaveAttribute(
      'href',
      '/coin/bitcoin'
    );

    await userEvent.click(screen.getByRole('button', { name: 'Add Bitcoin to watchlist' }));
    expect(onToggle).toHaveBeenCalledWith('bitcoin');
  });
});
