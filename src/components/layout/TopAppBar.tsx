import React from 'react';
import { useApp, ScreenType } from '../../context/AppContext';

const titles: Record<ScreenType, string> = {
  landing: 'Welcome',
  home: 'Problem & Architecture',
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
  support: 'Documentation',
};

export const TopAppBar: React.FC = () => {
  const {
    theme, toggleTheme,
    activeScreen, setActiveScreen,
    globalSearch, setGlobalSearch,
    setSearchOpen,
    navigateToMaterial,
    openUploadModal,
    reviewQueue,
  } = useApp();

  const handleSearchKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && globalSearch.trim()) {
      if (globalSearch.toUpperCase().startsWith('CNMC')) navigateToMaterial(globalSearch.trim().toUpperCase());
      else setActiveScreen('master');
    }
  };

  return (
    <header
      className="flex items-center justify-between px-5 h-12 shrink-0 z-40"
      style={{ background: 'var(--bg-surface)', borderBottom: '1px solid var(--border)' }}
    >
      {/* Title + date chip */}
      <div className="flex items-center gap-3">
        <h1 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
          {titles[activeScreen] ?? 'Overview'}
        </h1>
        <div
          className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] select-none"
          style={{ background: 'var(--bg-hover)', border: '1px solid var(--border)', color: 'var(--text-muted)' }}
        >
          <span className="material-symbols-outlined text-[13px]">calendar_today</span>
          Last 30 days
        </div>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-2">
        {/* Search bar — opens spotlight on focus */}
        <div className="relative">
          <span
            className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-[14px] pointer-events-none"
            style={{ color: 'var(--text-muted)' }}
          >
            search
          </span>
          <input
            readOnly
            value={globalSearch}
            onFocus={() => setSearchOpen(true)}
            onClick={() => setSearchOpen(true)}
            placeholder="Search CNMC or Material..."
            className="text-xs pl-7 pr-16 py-1.5 rounded w-48 cursor-pointer"
            style={{
              background: 'var(--bg-input)',
              border: '1px solid var(--border)',
              color: 'var(--text-primary)',
              outline: 'none',
            }}
          />
          <span
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] pointer-events-none rounded px-1 py-0.5"
            style={{
              color: 'var(--text-muted)',
              background: 'var(--bg-hover)',
              border: '1px solid var(--border)',
              fontFamily: 'monospace',
            }}
          >
            ⌘K
          </span>
        </div>

        {/* Upload */}
        <button
          onClick={() => openUploadModal('ONGC')}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium hover:brightness-110 transition-all"
          style={{ background: 'var(--blue)', color: '#fff' }}
        >
          <span className="material-symbols-outlined text-[14px]">upload_file</span>
          Upload XLS/CSV
        </button>

        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="p-1.5 rounded hover:opacity-80 transition-opacity"
          style={{ color: 'var(--text-secondary)' }}
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
        >
          <span className="material-symbols-outlined text-[18px]">
            {theme === 'dark' ? 'light_mode' : 'dark_mode'}
          </span>
        </button>

        {/* Notifications */}
        <button
          onClick={() => setActiveScreen('review')}
          className="relative p-1.5 rounded hover:opacity-80 transition-opacity"
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

        {/* Avatar */}
        <div
          onClick={() => setActiveScreen('settings')}
          className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold cursor-pointer hover:opacity-90 transition-opacity"
          style={{ background: 'var(--blue)', color: '#fff' }}
          title="Admin Steward"
        >
          AU
        </div>
      </div>
    </header>
  );
};
