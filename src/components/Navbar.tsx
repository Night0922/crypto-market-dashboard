import { Link } from 'react-router-dom';
import type { Theme } from '../hooks/useTheme';
import ThemeToggle from './ThemeToggle';

interface NavbarProps {
  theme: Theme;
  onToggleTheme: () => void;
}

export default function Navbar({ theme, onToggleTheme }: NavbarProps) {
  return (
    <header className="border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
      <div className="flex h-16 items-center justify-between px-5">
        <Link to="/" className="flex items-center gap-2.5 font-semibold text-slate-900 dark:text-white">
          <svg viewBox="0 0 32 32" className="h-8 w-8" aria-hidden="true">
            <rect width="32" height="32" rx="9" className="fill-slate-900 dark:fill-white" />
            <path
              d="M9 20l5-6 4 4 5-7"
              fill="none"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="stroke-white dark:stroke-slate-900"
            />
          </svg>
          Crypto Market Dashboard
        </Link>

        <ThemeToggle theme={theme} onToggle={onToggleTheme} />
      </div>
    </header>
  );
}
