import React from 'react';
import { useApp } from '../../context/AppContext';

export const TopAppBar: React.FC = () => {
  const { 
    theme, 
    toggleTheme, 
    activeScreen, 
    setActiveScreen, 
    globalSearch, 
    setGlobalSearch,
    navigateToMaterial,
    openUploadModal
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

  return (
    <header className="flex justify-between items-center w-full px-margin-page h-row-height-standard border-b border-outline-variant/40 z-40 bg-surface shrink-0 shadow-sm transition-colors">
      {/* Navigation Links for Top Bar */}
      <div className="flex items-center gap-6">
        <nav className="hidden md:flex gap-4 h-full items-end">
          <button
            onClick={() => setActiveScreen('home')}
            className={`pb-1.5 text-sm transition-all border-b-2 font-body-bold ${
              activeScreen === 'home'
                ? 'text-primary border-primary'
                : 'text-on-surface-variant hover:text-on-surface border-transparent font-body-standard'
            }`}
          >
            Home
          </button>
          <button
            onClick={() => setActiveScreen('dashboard')}
            className={`pb-1.5 text-sm transition-all border-b-2 font-body-bold ${
              activeScreen === 'dashboard'
                ? 'text-primary border-primary'
                : 'text-on-surface-variant hover:text-on-surface border-transparent font-body-standard'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveScreen('harmonization')}
            className={`pb-1.5 text-sm transition-all border-b-2 font-body-bold ${
              activeScreen === 'harmonization'
                ? 'text-primary border-primary'
                : 'text-on-surface-variant hover:text-on-surface border-transparent font-body-standard'
            }`}
          >
            Harmonization
          </button>
          <button
            onClick={() => setActiveScreen('governance')}
            className={`pb-1.5 text-sm transition-all border-b-2 font-body-bold ${
              activeScreen === 'governance'
                ? 'text-primary border-primary'
                : 'text-on-surface-variant hover:text-on-surface border-transparent font-body-standard'
            }`}
          >
            Governance
          </button>
        </nav>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Global Search Bar */}
        <div className="relative focus-within:ring-1 focus-within:ring-primary rounded-lg transition-all">
          <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm pointer-events-none">
            search
          </span>
          <input
            type="text"
            value={globalSearch}
            onChange={(e) => setGlobalSearch(e.target.value)}
            onKeyDown={handleSearchKeyDown}
            placeholder="Search CNMC or Material..."
            className="bg-surface-container-low border border-outline-variant/50 text-on-surface text-xs pl-8 pr-3 py-1.5 rounded-lg w-60 focus:w-72 transition-all font-data-mono focus:outline-none focus:border-primary placeholder:text-on-surface-variant/60 shadow-inner"
          />
          {globalSearch && (
            <button 
              onClick={() => setGlobalSearch('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface text-xs"
            >
              ✕
            </button>
          )}
        </div>

        {/* Upload Dataset Button (Direct Access) */}
        <button
          onClick={() => openUploadModal('ONGC')}
          title="Upload Excel or CSV Dataset"
          className="px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high border border-outline-variant/50 text-on-surface text-xs font-body-bold flex items-center gap-1.5 transition-all shadow-sm hover:border-primary/50"
        >
          <span className="material-symbols-outlined text-[16px] text-primary">upload_file</span>
          <span className="hidden sm:inline">Upload XLS/CSV</span>
        </button>

        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
          className="p-1.5 rounded-lg text-on-surface-variant hover:text-on-surface bg-surface-container hover:bg-surface-container-high transition-colors flex items-center justify-center border border-outline-variant/40"
        >
          <span className="material-symbols-outlined text-[18px]">
            {theme === 'dark' ? 'light_mode' : 'dark_mode'}
          </span>
        </button>

        {/* Action Icons */}
        <div className="flex items-center gap-1 text-on-surface-variant">
          <button 
            onClick={() => setActiveScreen('review')}
            title="Notifications & Review Backlog"
            className="p-1.5 rounded-lg hover:text-on-surface hover:bg-surface-container transition-colors relative"
          >
            <span className="material-symbols-outlined text-[18px]">notifications</span>
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-status-warning animate-subtle-pulse" />
          </button>
          
          <button 
            onClick={() => setActiveScreen('governance')}
            title="Audit Trail History"
            className="p-1.5 rounded-lg hover:text-on-surface hover:bg-surface-container transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">history</span>
          </button>
          
          <button 
            onClick={() => setActiveScreen('settings')}
            title="System Settings"
            className="p-1.5 rounded-lg hover:text-on-surface hover:bg-surface-container transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">admin_panel_settings</span>
          </button>
        </div>

        {/* Administrator Avatar */}
        <div 
          onClick={() => setActiveScreen('settings')}
          className="w-8 h-8 rounded-full bg-primary/10 border border-primary/30 overflow-hidden cursor-pointer hover:border-primary transition-all flex items-center justify-center font-bold text-xs text-primary shadow-sm"
          title="Logged in as System Administrator"
        >
          AU
        </div>
      </div>
    </header>
  );
};
