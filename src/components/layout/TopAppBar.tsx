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
    globalSearch,
    setSearchOpen,
    openUploadModal,
    reviewQueue,
  } = useApp();

  return (
    <header
      className="flex items-center justify-between px-6 h-14 shrink-0 z-40"
      style={{
        background: '#0F1110',
        borderBottom: '1px solid #303532',
      }}
    >
      {/* Title + Date filter chip matching template */}
      <div className="flex items-center gap-3">
        <h1 className="text-xl font-bold text-[#F3F4F6] tracking-tight">
          {titles[activeScreen] ?? 'Overview'}
        </h1>
        <div
          className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium select-none text-[#A7ADA9]"
          style={{
            background: '#171A18',
            border: '1px solid #303532',
          }}
        >
          <span className="material-symbols-outlined text-[14px]">calendar_today</span>
          Last 30 days
        </div>
      </div>

      {/* Right controls matching template */}
      <div className="flex items-center gap-3">
        {/* Search bar matching template */}
        <div className="relative">
          <span
            className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-[15px] pointer-events-none text-[#A7ADA9]"
          >
            search
          </span>
          <input
            readOnly
            value={globalSearch}
            onFocus={() => setSearchOpen(true)}
            onClick={() => setSearchOpen(true)}
            placeholder="Search..."
            className="text-sm pl-9 pr-12 py-2 rounded-lg w-60 cursor-pointer text-[#F3F4F6] placeholder-[#A7ADA9] outline-none transition-all"
            style={{
              background: '#121513',
              border: '1px solid #303532',
            }}
          />
          <kbd
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] pointer-events-none rounded px-1.5 py-0.5 text-[#A7ADA9] font-mono"
            style={{
              background: '#171A18',
              border: '1px solid #303532',
            }}
          >
            ⌘K
          </kbd>
        </div>

        {/* Upload Dataset Button */}
        <button
          onClick={() => openUploadModal('ONGC')}
          className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold hover:brightness-110 transition-all text-[#F3F4F6] shadow-sm"
          style={{
            background: '#171A18',
            border: '1px solid #303532',
          }}
        >
          <span className="material-symbols-outlined text-[15px]">upload_file</span>
          Upload
        </button>

        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="p-1.5 rounded-lg hover:bg-white/5 transition-colors text-[#A7ADA9] hover:text-[#F3F4F6]"
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
        >
          <span className="material-symbols-outlined text-[18px]">
            {theme === 'dark' ? 'light_mode' : 'dark_mode'}
          </span>
        </button>

        {/* Bell Notifications matching template */}
        <button
          onClick={() => setActiveScreen('review')}
          className="relative p-1.5 rounded-lg hover:bg-white/5 transition-colors text-[#A7ADA9] hover:text-[#F3F4F6]"
          title="Review Queue"
        >
          <span className="material-symbols-outlined text-[18px]">notifications</span>
          {reviewQueue.length > 0 && (
            <span
              className="absolute top-1 right-1 w-2 h-2 rounded-full"
              style={{ background: '#10B981' }}
            />
          )}
        </button>

        {/* Square Avatar matching template */}
        <div
          onClick={() => setActiveScreen('settings')}
          className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold cursor-pointer hover:opacity-90 transition-opacity shadow-sm"
          style={{ background: '#10B981', color: '#0F1110' }}
          title="Admin Steward"
        >
          JD
        </div>
      </div>
    </header>
  );
};
