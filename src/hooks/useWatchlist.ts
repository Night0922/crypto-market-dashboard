import { useCallback, useEffect, useState } from 'react';

const STORAGE_KEY = 'watchlist';

function readWatchlist(): string[] {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]');
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
}

export function useWatchlist() {
  const [watchlist, setWatchlist] = useState<string[]>(readWatchlist);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(watchlist));
    } catch {
      // Storage unavailable (private mode); keep in-memory only.
    }
  }, [watchlist]);

  const toggleWatchlist = useCallback((id: string) => {
    setWatchlist((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id]
    );
  }, []);

  const isWatched = useCallback(
    (id: string) => watchlist.includes(id),
    [watchlist]
  );

  return { watchlist, toggleWatchlist, isWatched };
}
