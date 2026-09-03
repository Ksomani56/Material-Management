import React from 'react';
import { useApp, ScreenType } from '../../context/AppContext';

interface NavItem {
  id: ScreenType;
  label: string;
  icon: string;
  badge?: number;
}

export const AppShell: React.FC = () => {
  const { activeScreen, setActiveScreen, reviewQueue, openUploadModal } = useApp();

  const navItems: NavItem[] = [
    { id: 'home', label: 'Home (How It Works)', icon: 'info' },
    { id: 'dashboard', label: 'Executive Dashboard', icon: 'dashboard' },
    { id: 'datahub', label: 'CPSE Data Hub', icon: 'database' },
    { id: 'harmonization', label: 'Material Harmonization', icon: 'rebase_edit' },
    { id: 'master', label: 'National Material Master', icon: 'inventory_2' },
    { id: 'review', label: 'Review Queue', icon: 'fact_check', badge: reviewQueue.length },
    { id: 'rationalization', label: 'Rationalization & Migration', icon: 'move_up' },
    { id: 'analytics', label: 'Analytics & Savings', icon: 'monitoring' },
    { id: 'governance', label: 'Audit History', icon: 'gavel' },
  ];

  return (
    <nav className="fixed left-0 top-0 h-full w-[240px] bg-surface border-r border-outline-variant/60 flex flex-col z-50 shrink-0 select-none">
      {/* Brand Header */}
      <div 
        onClick={() => setActiveScreen('home')}
        className="p-4 border-b border-outline-variant/50 flex items-center gap-3 cursor-pointer hover:bg-surface-container/60 transition-colors duration-150"
      >
        <div className="w-8 h-8 rounded-lg bg-primary/15 text-primary flex items-center justify-center shrink-0 border border-primary/30">
          <span className="material-symbols-outlined text-[18px]">inventory_2</span>
        </div>
        <div className="overflow-hidden">
          <h1 className="font-semibold text-xs tracking-tight text-on-surface leading-tight truncate">
            National Unified Master
          </h1>
          <p className="font-mono text-[10px] text-on-surface-variant tracking-normal truncate mt-0.5">
            Material Management
          </p>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto py-3 px-2">
        <ul className="space-y-0.5">
          {navItems.map((item) => {
            const isActive = activeScreen === item.id || (item.id === 'master' && activeScreen === 'detail');
            return (
              <li key={item.id}>
                <button
                  onClick={() => setActiveScreen(item.id)}
                  className={`w-full flex items-center justify-between px-2.5 py-2 text-left text-xs rounded-lg transition-all duration-150 relative ${
                    isActive
                      ? 'text-on-surface font-semibold bg-surface-container-high border-l-2 border-primary shadow-xs pl-2'
                      : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container/70 border-l-2 border-transparent font-normal'
                  }`}
                >
                  <div className="flex items-center min-w-0">
                    <span className={`material-symbols-outlined mr-2.5 text-[17px] shrink-0 ${isActive ? 'text-primary' : 'text-on-surface-variant'}`}>
                      {item.icon}
                    </span>
                    <span className="truncate">{item.label}</span>
                  </div>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className={`px-1.5 py-0.5 rounded font-mono text-[10px] font-semibold shrink-0 ml-1.5 ${
                      isActive 
                        ? 'bg-primary text-on-primary' 
                        : 'bg-surface-container-highest text-status-warning border border-status-warning/20'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>

        {/* Quick Ingest Button */}
        <div className="mt-4 pt-3 border-t border-outline-variant/40">
          <button
            onClick={() => openUploadModal('ONGC')}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface border border-outline-variant/60 font-medium text-xs transition-colors duration-150"
          >
            <span className="material-symbols-outlined text-[15px] text-primary">upload_file</span>
            <span>Ingest Spreadsheet</span>
          </button>
        </div>
      </div>

      {/* System & Support Footer */}
      <div className="p-3 border-t border-outline-variant/50 bg-surface-container-low/50">
        <ul className="space-y-0.5 mb-2">
          <li>
            <button
              onClick={() => setActiveScreen('settings')}
              className={`w-full flex items-center px-2.5 py-1.5 text-xs transition-colors rounded-lg ${
                activeScreen === 'settings'
                  ? 'text-on-surface bg-surface-container font-semibold border-l-2 border-primary pl-2'
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container border-l-2 border-transparent'
              }`}
            >
              <span className="material-symbols-outlined mr-2 text-[15px]">settings</span>
              <span>Settings</span>
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveScreen('support')}
              className={`w-full flex items-center px-2.5 py-1.5 text-xs transition-colors rounded-lg ${
                activeScreen === 'support'
                  ? 'text-on-surface bg-surface-container font-semibold border-l-2 border-primary pl-2'
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container border-l-2 border-transparent'
              }`}
            >
              <span className="material-symbols-outlined mr-2 text-[15px]">help</span>
              <span>Support</span>
            </button>
          </li>
        </ul>

        {/* User Card */}
        <div className="flex items-center gap-2 px-2.5 py-1.5 bg-surface-container rounded-lg border border-outline-variant/50">
          <div className="w-7 h-7 rounded-full bg-primary/15 border border-primary/30 overflow-hidden shrink-0 flex items-center justify-center font-bold text-[11px] text-primary">
            AU
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-xs text-on-surface truncate leading-tight">Admin User</p>
            <p className="font-mono text-[10px] text-on-surface-variant truncate">ID: 8492-AX</p>
          </div>
        </div>
      </div>
    </nav>
  );
};
