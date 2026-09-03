import React from 'react';
import { useApp, ScreenType } from '../../context/AppContext';

export const TopAppBar: React.FC = () => {
  const { theme, toggleTheme, activeScreen, setActiveScreen, globalSearch, setGlobalSearch, navigateToMaterial, openUploadModal, reviewQueue } = useApp();

  const screenTitles: Record<ScreenType, string> = {
    home: 'Architecture & Problem Context',
    dashboard: 'Overview',
    datahub: 'CPSE Data Hub',
    harmonization: 'Harmonization Workbench',
    master: 'National Material Master',
    detail: 'Material Specification Sheet',
    review: 'Review Queue',
    rationalization: 'Rationalization & Merge',
    analytics: 'Analytics & Savings',
    governance: 'Audit Trail',
    settings: 'Settings',
    support: 'Documentation & Support',
  };

  const handleSearchKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && globalSearch.trim()) {
      if (globalSearch.toUpperCase().startsWith('CNMC')) {
        navigateToMaterial(globalSearch.trim().toUpperCase());
      } else {
        setActiveScreen('master');
      }
    }
  };

  return (
    <header
      style={{ background: 'var(--bg-surface)', borderBottom: '1px solid var(--border)' }}
      className="flex items-center justify-between px-5 h-12 shrink-0 z-40"
    >
      {/* Left: Screen Title + Date */}
      <div className="flex items-center gap-3">
        <h1
          style={{ color: 'var(--text-primary)' }}
          className="text-sm font-semibold"
        >
          {screenTitles[activeScreen] ?? 'Overview'}
        </h1>
        <div
          style={{ color: 'var(--text-muted)', border: '1px solid var(--border)', background: 'var(--bg-input)' }}
          className="flex items-center gap-1.5 px-2 py-1 rounded text-[11px]"
        >
          <span className="material-symbols-outlined text-[13px]">calendar_today</span>
          <span>Last 30 days</span>
        </div>
      </div>

      {/* Right: Search + Actions */}
      <div className="flex items-center gap-2">
        {/* Search Input */}
        <div className="relative">
          <span
            className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-[14px] pointer-events-none"
            style={{ color: 'var(--text-muted)' }}
          >
            search
          </span>
          <input
            type="text"
            value={globalSearch}
            onChange={e => setGlobalSearch(e.target.value)}
            onKeyDown={handleSearchKey}
            placeholder="Search..."
            style={{
              background: 'var(--bg-input)',
              border: '1px solid var(--border)',
              color: 'var(--text-primary)',
            }}
            className="text-xs pl-7 pr-3 py-1.5 rounded w-44 focus:w-56 transition-all duration-150 focus:outline-none focus:ring-1 placeholder:opacity-50"
          />
        </div>

        {/* Notification Bell */}
        <button
          onClick={() => setActiveScreen('review')}
          className="relative p-1.5 rounded transition-colors hover:opacity-80"
          style={{ color: 'var(--text-secondary)' }}
          title="Review Queue"
        >
          <span className="material-symbols-outlined text-[18px]">notifications</span>
          {reviewQueue.length > 0 && (
            <span
              className="absolute top-0.5 right-0.5 w-2 h-2 rounded-full"
              style={{ background: 'var(--warning)' }}
            />
          )}
        </button>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-1.5 rounded transition-colors hover:opacity-80"
          style={{ color: 'var(--text-secondary)' }}
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
        >
          <span className="material-symbols-outlined text-[18px]">
            {theme === 'dark' ? 'light_mode' : 'dark_mode'}
          </span>
        </button>

        {/* User Avatar */}
        <div
          onClick={() => setActiveScreen('settings')}
          style={{ background: 'var(--accent)', color: '#022c1e' }}
          className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold cursor-pointer hover:opacity-90 transition-opacity"
          title="Admin Steward"
        >
          AU
        </div>
      </div>
    </header>
  );
};
