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
    <header className="flex justify-between items-center w-full px-6 h-13 border-b border-outline-variant/60 z-40 bg-surface shrink-0 select-none">
      {/* Navigation Links for Top Bar */}
      <div className="flex items-center gap-6">
        <nav className="hidden md:flex gap-1 h-full items-center">
          <button
            onClick={() => setActiveScreen('home')}
            className={`px-3 py-1 text-xs rounded-md font-medium transition-colors duration-150 ${
              activeScreen === 'home'
                ? 'bg-surface-container-high text-on-surface font-semibold'
                : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
            }`}
          >
            Home
          </button>
          <button
            onClick={() => setActiveScreen('dashboard')}
            className={`px-3 py-1 text-xs rounded-md font-medium transition-colors duration-150 ${
              activeScreen === 'dashboard'
                ? 'bg-surface-container-high text-on-surface font-semibold'
                : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveScreen('harmonization')}
            className={`px-3 py-1 text-xs rounded-md font-medium transition-colors duration-150 ${
              activeScreen === 'harmonization'
                ? 'bg-surface-container-high text-on-surface font-semibold'
                : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
            }`}
          >
            Harmonization
          </button>
          <button
            onClick={() => setActiveScreen('governance')}
            className={`px-3 py-1 text-xs rounded-md font-medium transition-colors duration-150 ${
              activeScreen === 'governance'
                ? 'bg-surface-container-high text-on-surface font-semibold'
                : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
            }`}
          >
            Governance
          </button>
        </nav>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2.5">
        {/* Global Search Bar */}
        <div className="relative">
          <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-on-surface-variant text-[15px] pointer-events-none">
            search
          </span>
          <input
            type="text"
            value={globalSearch}
            onChange={(e) => setGlobalSearch(e.target.value)}
            onKeyDown={handleSearchKeyDown}
            placeholder="Search CNMC or material..."
            className="bg-surface-container-low border border-outline-variant/60 text-on-surface text-xs pl-8 pr-7 py-1.5 rounded-lg w-56 focus:w-68 transition-all duration-150 font-mono focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary placeholder:text-on-surface-variant/70"
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
          className="px-2.5 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high border border-outline-variant/60 text-on-surface text-xs font-medium flex items-center gap-1.5 transition-colors duration-150"
        >
          <span className="material-symbols-outlined text-[15px] text-primary">upload_file</span>
          <span className="hidden sm:inline">Import Data</span>
        </button>

        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
          className="p-1.5 rounded-lg text-on-surface-variant hover:text-on-surface bg-surface-container hover:bg-surface-container-high border border-outline-variant/60 transition-colors duration-150 flex items-center justify-center"
        >
          <span className="material-symbols-outlined text-[17px]">
            {theme === 'dark' ? 'light_mode' : 'dark_mode'}
          </span>
        </button>

        {/* Action Icons */}
        <div className="flex items-center gap-1 text-on-surface-variant">
          <button 
            onClick={() => setActiveScreen('review')}
            title="Notifications & Review Backlog"
            className="p-1.5 rounded-lg hover:text-on-surface hover:bg-surface-container transition-colors duration-150 relative"
          >
            <span className="material-symbols-outlined text-[17px]">notifications</span>
            <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-status-warning" />
          </button>
          
          <button 
            onClick={() => setActiveScreen('governance')}
            title="Audit Trail History"
            className="p-1.5 rounded-lg hover:text-on-surface hover:bg-surface-container transition-colors duration-150"
          >
            <span className="material-symbols-outlined text-[17px]">history</span>
          </button>
          
          <button 
            onClick={() => setActiveScreen('settings')}
            title="System Settings"
            className="p-1.5 rounded-lg hover:text-on-surface hover:bg-surface-container transition-colors duration-150"
          >
            <span className="material-symbols-outlined text-[17px]">admin_panel_settings</span>
          </button>
        </div>

        {/* Administrator Avatar */}
        <div 
          onClick={() => setActiveScreen('settings')}
          className="w-7 h-7 rounded-lg bg-primary/15 border border-primary/30 overflow-hidden cursor-pointer hover:border-primary transition-colors flex items-center justify-center font-bold text-xs text-primary"
          title="Logged in as System Administrator"
        >
          AU
        </div>
      </div>
    </header>
  );
};
