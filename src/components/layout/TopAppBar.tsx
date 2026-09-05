import React from 'react';
import { useApp } from '../../context/AppContext';

export const TopAppBar: React.FC = () => {
  const {
    globalSearch,
    setSearchOpen,
    openUploadModal,
    reviewQueue,
    setActiveScreen,
  } = useApp();

  return (
    <header
      className="flex items-center justify-between px-8 h-16 shrink-0 z-30 border-b border-[#232825] bg-[#000000]"
    >
      {/* Search Bar - Center/Left Aligned matching image */}
      <div className="flex-1 max-w-xl">
        <div 
          onClick={() => setSearchOpen(true)}
          className="relative flex items-center cursor-pointer group"
        >
          <span className="material-symbols-outlined absolute left-3.5 text-[#9CA3AF] text-[18px] group-hover:text-[#F3F4F6] transition-colors pointer-events-none">
            search
          </span>
          <input
            readOnly
            value={globalSearch}
            placeholder="Search materials, CNMC codes, CPSEs..."
            className="w-full pl-10 pr-10 py-2 text-xs md:text-sm rounded-lg bg-[#0C0E0D] border border-[#232825] text-[#F3F4F6] placeholder-[#9CA3AF] outline-none group-hover:border-[#38423C] transition-all cursor-pointer font-sans"
          />
          <kbd className="absolute right-3 px-1.5 py-0.5 rounded bg-[#161B18] border border-[#2A332E] text-[11px] font-mono text-[#9CA3AF] pointer-events-none">
            /
          </kbd>
        </div>
      </div>

      {/* Right Controls matching image */}
      <div className="flex items-center gap-4 ml-6">
        {/* Upload Dataset Button */}
        <button
          onClick={() => openUploadModal('ONGC')}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-[#F3F4F6] bg-[#0C0E0D] border border-[#232825] hover:border-[#38423C] hover:bg-[#131715] transition-all shadow-sm"
        >
          <span className="material-symbols-outlined text-[16px] text-[#9CA3AF]">
            upload
          </span>
          <span>Upload</span>
        </button>

        {/* Notifications */}
        <button
          onClick={() => setActiveScreen('review')}
          className="relative p-2 rounded-lg text-[#9CA3AF] hover:text-[#F3F4F6] hover:bg-white/5 transition-colors"
          title="Review Queue"
        >
          <span className="material-symbols-outlined text-[20px]">notifications</span>
          {reviewQueue.length > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#10B981] ring-2 ring-[#000000]" />
          )}
        </button>

        {/* User Profile Badge (Krishna Somani · CPSE User) */}
        <div 
          onClick={() => setActiveScreen('settings')}
          className="flex items-center gap-3 pl-2 py-1 cursor-pointer group select-none"
        >
          <div className="w-8 h-8 rounded-full bg-[#2563EB] text-white flex items-center justify-center text-xs font-bold font-sans shadow-sm shrink-0">
            KS
          </div>
          <div className="hidden sm:flex flex-col text-left">
            <span className="text-xs font-semibold text-[#F3F4F6] leading-tight group-hover:text-white transition-colors">
              Krishna Somani
            </span>
            <span className="text-[11px] text-[#9CA3AF] font-medium leading-tight">
              CPSE User
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
