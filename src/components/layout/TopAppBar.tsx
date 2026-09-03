import React from 'react';
import { useApp, ScreenType } from '../../context/AppContext';

export const TopAppBar: React.FC = () => {
  const { 
    theme, 
    toggleTheme, 
    activeScreen, 
    setActiveScreen, 
    globalSearch, 
    setGlobalSearch,
    navigateToMaterial,
    openUploadModal,
    reviewQueue
  } = useApp();

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && globalSearch.trim()) {
      if (globalSearch.toUpperCase().includes('CNMC')) {
        navigateToMaterial(globalSearch.trim().toUpperCase());
      } else {
        setActiveScreen('master');
      }
    }
  };

  const getScreenTitle = (screen: ScreenType): string => {
    switch (screen) {
      case 'dashboard': return 'Executive Dashboard';
      case 'home': return 'Problem & Architecture';
      case 'datahub': return 'CPSE Data Hub';
      case 'harmonization': return 'Harmonization Workbench';
      case 'master': return 'National Material Master';
      case 'detail': return 'Master Specification Sheet';
      case 'review': return 'Review Queue';
      case 'rationalization': return 'Rationalization & Merge';
      case 'analytics': return 'Analytics & Savings';
      case 'governance': return 'Audit Trail Ledger';
      case 'settings': return 'System Settings';
      case 'support': return 'Documentation & Support';
      default: return 'Overview';
    }
  };

  return (
    <header className="flex justify-between items-center w-full px-6 h-13 border-b border-outline-variant/60 z-40 bg-surface shrink-0 select-none">
      {/* Contextual Breadcrumb & Live Pipeline Badge */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 text-xs">
          <span className="text-on-surface-variant font-medium">Unified Master</span>
          <span className="text-on-surface-variant/40">/</span>
          <span className="font-semibold text-on-surface">{getScreenTitle(activeScreen)}</span>
        </div>

        <div className="hidden sm:flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-status-success/10 text-status-success text-[10px] font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-status-success" />
          <span>6 CPSE ERPs Live</span>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Global Search Bar with Keyboard Shortcut */}
        <div className="relative">
          <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-on-surface-variant text-[15px] pointer-events-none">
            search
          </span>
          <input
            type="text"
            value={globalSearch}
            onChange={(e) => setGlobalSearch(e.target.value)}
            onKeyDown={handleSearchKeyDown}
            placeholder="Search CNMC, materials..."
            className="bg-surface-container-low border border-outline-variant/60 text-on-surface text-xs pl-8 pr-12 py-1.5 rounded-lg w-52 focus:w-64 transition-all duration-140 font-mono focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary placeholder:text-on-surface-variant/60"
          />
          <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-mono text-on-surface-variant/60 bg-surface-container-high px-1 rounded border border-outline-variant/50 pointer-events-none">
            ⌘K
          </span>
        </div>

        {/* Upload Dataset Button */}
        <button
          onClick={() => openUploadModal('ONGC')}
          title="Upload Excel or CSV Dataset"
          className="px-3 py-1.5 rounded-lg bg-primary text-on-primary text-xs font-semibold flex items-center gap-1.5 hover:brightness-110 transition-all shadow-xs"
        >
          <span className="material-symbols-outlined text-[15px]">upload_file</span>
          <span>Import Data</span>
        </button>

        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
          className="p-1.5 rounded-lg text-on-surface-variant hover:text-on-surface bg-surface-container hover:bg-surface-container-high border border-outline-variant/60 transition-colors flex items-center justify-center"
        >
          <span className="material-symbols-outlined text-[16px]">
            {theme === 'dark' ? 'light_mode' : 'dark_mode'}
          </span>
        </button>

        {/* Notifications */}
        <button 
          onClick={() => setActiveScreen('review')}
          title="Notifications & Review Backlog"
          className="p-1.5 rounded-lg hover:text-on-surface hover:bg-surface-container text-on-surface-variant transition-colors relative"
        >
          <span className="material-symbols-outlined text-[17px]">notifications</span>
          {reviewQueue.length > 0 && (
            <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-status-warning" />
          )}
        </button>

        {/* Administrator Avatar */}
        <div 
          onClick={() => setActiveScreen('settings')}
          className="w-7 h-7 rounded-full bg-primary/20 border border-primary/30 overflow-hidden cursor-pointer hover:border-primary transition-colors flex items-center justify-center font-bold text-[11px] text-primary"
          title="Logged in as System Administrator"
        >
          AU
        </div>
      </div>
    </header>
  );
};
