import { describe, expect, it } from 'vitest';
import { makeCoin } from '../test/utils';
import { filterAndSortCoins, getPageItems, paginate } from './coins';

const coins = [
  makeCoin({ id: 'bitcoin', name: 'Bitcoin', symbol: 'btc', current_price: 66000, price_change_percentage_24h: 2, market_cap_rank: 1 }),
  makeCoin({ id: 'ethereum', name: 'Ethereum', symbol: 'eth', current_price: 3200, price_change_percentage_24h: -1, market_cap_rank: 2 }),
  makeCoin({ id: 'tether', name: 'Tether', symbol: 'usdt', current_price: 1, price_change_percentage_24h: null, market_cap_rank: 3 }),
  makeCoin({ id: 'mystery', name: 'Mystery', symbol: 'mys', current_price: null, price_change_percentage_24h: 9, market_cap_rank: null }),
];

const ids = (list: { id: string }[]) => list.map((coin) => coin.id);

describe('filterAndSortCoins', () => {
  it('matches name or symbol, case-insensitively and ignoring whitespace', () => {
    expect(ids(filterAndSortCoins(coins, '  ETHER ', 'rank'))).toEqual(['ethereum', 'tether']);
    expect(ids(filterAndSortCoins(coins, 'MYS', 'rank'))).toEqual(['mystery']);
    expect(ids(filterAndSortCoins(coins, 'usdt', 'rank'))).toEqual(['tether']);
    expect(ids(filterAndSortCoins(coins, 'bit', 'rank'))).toEqual(['bitcoin']);
  });

  it('returns nothing when no coin matches', () => {
    expect(filterAndSortCoins(coins, 'dogecoin', 'rank')).toEqual([]);
  });

  it('sorts by market cap rank with unranked coins last', () => {
    expect(ids(filterAndSortCoins(coins, '', 'rank'))).toEqual(['bitcoin', 'ethereum', 'tether', 'mystery']);
  });

  it('sorts by price in both directions, keeping null prices last', () => {
    expect(ids(filterAndSortCoins(coins, '', 'price-desc'))).toEqual(['bitcoin', 'ethereum', 'tether', 'mystery']);
    expect(ids(filterAndSortCoins(coins, '', 'price-asc'))).toEqual(['tether', 'ethereum', 'bitcoin', 'mystery']);
  });

  it('sorts by 24h change in both directions, keeping null changes last', () => {
    expect(ids(filterAndSortCoins(coins, '', 'change-desc'))).toEqual(['mystery', 'bitcoin', 'ethereum', 'tether']);
    expect(ids(filterAndSortCoins(coins, '', 'change-asc'))).toEqual(['ethereum', 'bitcoin', 'mystery', 'tether']);
  });

  it('does not mutate the input array', () => {
    const copy = [...coins];
    filterAndSortCoins(coins, '', 'price-asc');
    expect(coins).toEqual(copy);
  });
});

describe('paginate', () => {
  const items = Array.from({ length: 25 }, (_, index) => index + 1);

  it('returns the requested slice', () => {
    expect(paginate(items, 1, 12)).toEqual(items.slice(0, 12));
    expect(paginate(items, 3, 12)).toEqual([25]);
  });

  it('returns an empty list past the last page', () => {
    expect(paginate(items, 4, 12)).toEqual([]);
  });
});

describe('getPageItems', () => {
  it('lists every page when there are few', () => {
    expect(getPageItems(2, 3)).toEqual([1, 2, 3]);
  });

  it('collapses distant pages into ellipses', () => {
    expect(getPageItems(5, 9)).toEqual([1, null, 4, 5, 6, null, 9]);
    expect(getPageItems(1, 9)).toEqual([1, 2, null, 9]);
  });
});
