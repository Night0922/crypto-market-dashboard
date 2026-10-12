export interface Coin {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number | null;
  price_change_percentage_24h: number | null;
  price_change_percentage_7d_in_currency?: number | null;
  market_cap: number | null;
  market_cap_rank: number | null;
  total_volume: number | null;
  sparkline_in_7d?: { price: number[] } | null;
}

type UsdValue = { usd?: number | null };

export interface CoinDetail {
  id: string;
  symbol: string;
  name: string;
  image: { large: string; small: string; thumb: string };
  description: { en: string };
  links: { homepage: string[] };
  market_cap_rank: number | null;
  market_data: {
    current_price: UsdValue;
    market_cap: UsdValue;
    total_volume: UsdValue;
    high_24h: UsdValue;
    low_24h: UsdValue;
    ath: UsdValue;
    atl: UsdValue;
    price_change_percentage_24h: number | null;
    price_change_percentage_7d: number | null;
    price_change_percentage_30d: number | null;
    circulating_supply: number | null;
    total_supply: number | null;
    max_supply: number | null;
  };
}

export interface PricePoint {
  time: number;
  price: number;
}
