import { Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import TickerBar from './components/TickerBar';
import { useCoins } from './hooks/useCoins';
import { useTheme } from './hooks/useTheme';
import CoinDetailPage from './pages/CoinDetailPage';
import MarketsPage from './pages/MarketsPage';

export default function App() {
  const { theme, toggleTheme } = useTheme();
  const { data: coins = [] } = useCoins();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-white">
      <Navbar theme={theme} onToggleTheme={toggleTheme} />
      <TickerBar coins={coins} />

      <main>
        <Routes>
          <Route path="/" element={<MarketsPage />} />
          <Route path="/coin/:id" element={<CoinDetailPage />} />
          <Route path="*" element={<MarketsPage />} />
        </Routes>
      </main>
    </div>
  );
}
