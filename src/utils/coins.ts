import type { Coin } from '../types/coin';

export type SortOption =
  | 'rank'
  | 'price-asc'
  | 'price-desc'
  | 'change-asc'
  | 'change-desc';

export function filterAndSortCoins(
  coins: Coin[],
  search: string,
  sort: SortOption
): Coin[] {
  const searchTerm = search.trim().toLowerCase();

  const filtered = coins.filter(
    (coin) =>
      coin.name.toLowerCase().includes(searchTerm) ||
      coin.symbol.toLowerCase().includes(searchTerm)
  );

  if (sort === 'rank') {
    return [...filtered].sort(
      (a, b) =>
        (a.market_cap_rank ?? Infinity) -
        (b.market_cap_rank ?? Infinity)
    );
  }

  const field = sort.startsWith('price')
    ? 'current_price'
    : 'price_change_percentage_24h';

  return [...filtered].sort((a, b) => {
    const first = a[field];
    const second = b[field];

    // Missing values always sink to the bottom.
    if (first === null) return second === null ? 0 : 1;
    if (second === null) return -1;

    return sort.endsWith('asc')
      ? first - second
      : second - first;
  });
}

export function paginate<T>(
  items: T[],
  page: number,
  pageSize: number
): T[] {
  const start = (page - 1) * pageSize;
  return items.slice(start, start + pageSize);
}

/** First, last, and a window around the current page; gaps become null (ellipsis). */
export function getPageItems(page: number, totalPages: number): (number | null)[] {
  const pages = new Set([1, totalPages, page - 1, page, page + 1]);
  const sorted = [...pages]
    .filter((p) => p >= 1 && p <= totalPages)
    .sort((a, b) => a - b);

  const items: (number | null)[] = [];
  sorted.forEach((p, index) => {
    if (index > 0 && p - sorted[index - 1] > 1) items.push(null);
    items.push(p);
  });
  return items;
}
