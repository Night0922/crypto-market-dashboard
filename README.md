# Crypto Market Dashboard

A responsive cryptocurrency market dashboard built with React, TypeScript, Vite, and Tailwind CSS.

## Features

- Live market data for the top 100 cryptocurrencies from the CoinGecko API
- Responsive card grid with price, 24h change, 7-day sparkline, market cap, and volume
- Scrolling price ticker
- Search by cryptocurrency name or symbol
- Sorting by market cap rank, price, and 24-hour percentage change
- Pagination (12 coins per page)
- Watchlist saved in the browser, with an All Tokens / Watchlist tab
- Coin detail pages with key stats and a historical price chart (24H, 7D, 30D, 90D, 1Y)
- Dark and light themes, saved between visits
- API caching and retry handling using TanStack Query
- Loading skeletons, error states with retry, and empty search results
- Automated tests using Vitest and React Testing Library

## Tech Stack

React, TypeScript, Vite, Tailwind CSS, TanStack Query, React Router, Recharts, Lucide icons, and Vitest.

## Getting Started

### Prerequisites

Node.js 20.19+ or 22.12+ and npm.

### Installation

```bash
git clone https://github.com/YOUR_USERNAME/crypto-market-dashboard.git
cd crypto-market-dashboard
npm install
npm run dev
```

Open the local URL displayed by Vite.

No API key is needed.

## Scripts

| Command              | Description                        |
| -------------------- | ---------------------------------- |
| `npm run dev`        | Start the development server       |
| `npm run build`      | Type-check and build for production |
| `npm run preview`    | Preview the production build       |
| `npm run lint`       | Run ESLint                         |
| `npm test`           | Run the test suite once            |
| `npm run test:watch` | Run tests in watch mode            |

## Testing

```bash
npm test
npm run lint
npm run build
```

The tests cover:

- Search filtering and every sort option, including coins with missing data
- Pagination and page-number logic
- Loading, error, retry, and empty states
- Failed API responses and network errors
- Watchlist and theme toggle, including saved preferences
- Coin card rendering and the coin detail page

API calls are mocked, so the tests do not depend on the network.

## Project Structure

```
src/
├── api/          CoinGecko API requests
├── components/   Reusable UI (CoinCard, Pagination, PriceChart, ThemeToggle, ...)
├── hooks/        Data fetching, theme, and watchlist hooks
├── pages/        MarketsPage and CoinDetailPage
├── test/         Test setup and helpers
├── types/        API response types
└── utils/        Filtering, sorting, pagination, and number formatting
```

## Technical Decisions

**Data fetching:** TanStack Query handles request caching, loading states, and retries. The coin list is fetched once and shared by the ticker and the grid.

**Client-side filtering and pagination:** The top 100 coins are loaded in a single request, so search, sort, and pagination are instant and do not use up the API rate limit.

**URL state:** Search, sort, tab, and page are stored in the URL, so returning from a coin detail page restores the previous view.

**TypeScript:** API response types help ensure safe access to cryptocurrency data. Missing values are shown as "N/A" and sorted last.

**Responsive design:** Tailwind CSS provides mobile-first responsive layouts.

**Theming:** Tailwind's class-based dark mode. The first visit follows the system setting, and later visits use the saved choice.

**API error handling:** Users see an error message and can retry failed requests manually.

**Security:** Coin descriptions from the API contain HTML. They are shown as plain text instead of being inserted as HTML.

## API

Market data is provided by the free public [CoinGecko API](https://www.coingecko.com/en/api).

- `/coins/markets`: top 100 coins with 7-day sparklines
- `/coins/{id}`: coin details
- `/coins/{id}/market_chart`: price history for the chart

The public API is rate limited. If requests are made too quickly, the app shows an error state with a Retry button.

## Potential Improvements

- Better API rate-limit handling, for example using a CoinGecko API key or a backend proxy
- Code-splitting the detail page and chart library to reduce bundle size
- Server-side pagination to support more than 100 coins
- Additional chart options, such as candlesticks and volume
- End-to-end tests with Playwright
- Deployment and monitoring
