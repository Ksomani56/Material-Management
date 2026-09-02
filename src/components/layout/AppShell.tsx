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
    <nav className="fixed left-0 top-0 h-full w-[240px] bg-surface border-r border-outline-variant/40 flex flex-col z-50 shrink-0 transition-colors duration-200">
      {/* Brand Header */}
      <div 
        onClick={() => setActiveScreen('home')}
        className="p-4 border-b border-outline-variant/40 flex items-center gap-3 cursor-pointer hover:bg-surface-container/50 transition-colors"
      >
        <div className="w-9 h-9 rounded-xl bg-primary-container text-on-primary-container flex items-center justify-center shrink-0 shadow-sm">
          <span className="material-symbols-outlined text-lg fill-icon">inventory_2</span>
        </div>
        <div className="overflow-hidden">
          <h1 className="font-headline-section text-sm font-bold text-on-surface leading-tight truncate">
            National Unified Master
          </h1>
          <p className="font-data-mono text-[11px] text-on-surface-variant truncate">
            Material Management
          </p>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto py-3 px-2">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive = activeScreen === item.id || (item.id === 'master' && activeScreen === 'detail');
            return (
              <li key={item.id}>
                <button
                  onClick={() => setActiveScreen(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 text-left text-xs rounded-xl transition-all duration-150 ${
                    isActive
                      ? 'text-primary font-body-bold bg-surface-container-high shadow-sm border border-outline-variant/40'
                      : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container/60 border border-transparent font-body-standard'
                  }`}
                >
                  <div className="flex items-center min-w-0">
                    <span className={`material-symbols-outlined mr-2.5 text-[18px] shrink-0 ${isActive ? 'fill-icon text-primary' : 'text-on-surface-variant'}`}>
                      {item.icon}
                    </span>
                    <span className="truncate">{item.label}</span>
                  </div>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className={`px-2 py-0.5 rounded-full font-data-mono text-[10px] font-bold shrink-0 ml-1.5 ${
                      isActive 
                        ? 'bg-primary text-on-primary' 
                        : 'bg-surface-container-highest text-relationship-near border border-relationship-near/30'
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
        <div className="mt-4 pt-3 border-t border-outline-variant/30">
          <button
            onClick={() => openUploadModal('ONGC')}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-primary/10 hover:bg-primary/20 text-primary border border-primary/30 font-body-bold text-xs transition-all shadow-sm"
          >
            <span className="material-symbols-outlined text-[16px]">upload_file</span>
            <span>Ingest Spreadsheet</span>
          </button>
        </div>
      </div>

      {/* System & Support Footer */}
      <div className="p-3 border-t border-outline-variant/40 bg-surface-container-lowest/50">
        <ul className="space-y-0.5 mb-2">
          <li>
            <button
              onClick={() => setActiveScreen('settings')}
              className={`w-full flex items-center px-3 py-1.5 text-xs transition-colors rounded-lg ${
                activeScreen === 'settings'
                  ? 'text-primary bg-surface-container font-body-bold'
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
              }`}
            >
              <span className="material-symbols-outlined mr-2.5 text-[16px]">settings</span>
              <span>Settings</span>
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveScreen('support')}
              className={`w-full flex items-center px-3 py-1.5 text-xs transition-colors rounded-lg ${
                activeScreen === 'support'
                  ? 'text-primary bg-surface-container font-body-bold'
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
              }`}
            >
              <span className="material-symbols-outlined mr-2.5 text-[16px]">help</span>
              <span>Support</span>
            </button>
          </li>
        </ul>

        {/* User Card */}
        <div className="flex items-center gap-2.5 px-3 py-2 bg-surface-container rounded-xl border border-outline-variant/40">
          <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/30 overflow-hidden shrink-0 flex items-center justify-center font-bold text-xs text-primary">
            AU
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-body-bold text-xs text-on-surface truncate leading-tight">Admin User</p>
            <p className="font-data-mono text-[10px] text-on-surface-variant truncate">ID: 8492-AX</p>
          </div>
        </div>
      </div>
    </nav>
  );
};
