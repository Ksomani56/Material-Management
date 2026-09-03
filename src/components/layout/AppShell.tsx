import React from 'react';
import { useApp, ScreenType } from '../../context/AppContext';

interface NavItem {
  id: ScreenType;
  label: string;
  icon: string;
  badge?: number;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

export const AppShell: React.FC = () => {
  const { activeScreen, setActiveScreen, reviewQueue, openUploadModal } = useApp();

  const sections: NavSection[] = [
    {
      title: 'OVERVIEW',
      items: [
        { id: 'dashboard', label: 'Executive Dashboard', icon: 'dashboard' },
        { id: 'home', label: 'Problem & Architecture', icon: 'info' },
      ]
    },
    {
      title: 'CATALOG & HARMONIZATION',
      items: [
        { id: 'datahub', label: 'CPSE Data Hub', icon: 'database' },
        { id: 'harmonization', label: 'Harmonization Workbench', icon: 'rebase_edit' },
        { id: 'master', label: 'National Material Master', icon: 'inventory_2' },
        { id: 'review', label: 'Review Queue', icon: 'fact_check', badge: reviewQueue.length },
      ]
    },
    {
      title: 'OPERATIONS & GOVERNANCE',
      items: [
        { id: 'rationalization', label: 'Rationalization & Merge', icon: 'call_merge' },
        { id: 'analytics', label: 'Analytics & Savings', icon: 'monitoring' },
        { id: 'governance', label: 'Audit Trail Ledger', icon: 'gavel' },
      ]
    }
  ];

  return (
    <nav className="fixed left-0 top-0 h-full w-[250px] bg-surface border-r border-outline-variant/60 flex flex-col z-50 shrink-0 select-none">
      {/* Brand Header */}
      <div 
        onClick={() => setActiveScreen('dashboard')}
        className="p-4 border-b border-outline-variant/50 flex items-center gap-3 cursor-pointer hover:bg-surface-container-high/40 transition-colors"
      >
        <div className="w-8 h-8 rounded-lg bg-primary/15 text-primary flex items-center justify-center shrink-0 border border-primary/30">
          <span className="material-symbols-outlined text-[18px]">inventory_2</span>
        </div>
        <div className="overflow-hidden">
          <div className="flex items-center gap-1.5">
            <h1 className="font-semibold text-xs tracking-tight text-on-surface truncate">
              National Unified Master
            </h1>
          </div>
          <p className="text-[10px] text-on-surface-variant tracking-normal truncate">
            MoPNG Enterprise Catalog
          </p>
        </div>
      </div>

      {/* Navigation Sections */}
      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-5">
        {sections.map((section, idx) => (
          <div key={idx} className="space-y-1">
            <div className="px-2 pb-1 text-[10px] font-semibold tracking-wider text-on-surface-variant/70 uppercase">
              {section.title}
            </div>
            <ul className="space-y-0.5">
              {section.items.map((item) => {
                const isActive = activeScreen === item.id || (item.id === 'master' && activeScreen === 'detail');
                return (
                  <li key={item.id}>
                    <button
                      onClick={() => setActiveScreen(item.id)}
                      className={`w-full flex items-center justify-between px-2.5 py-1.5 text-left text-xs rounded-md transition-all duration-140 ${
                        isActive
                          ? 'text-on-surface font-medium bg-surface-container-high border-l-2 border-primary pl-2 shadow-xs'
                          : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high/60 border-l-2 border-transparent font-normal'
                      }`}
                    >
                      <div className="flex items-center min-w-0 gap-2.5">
                        <span className={`material-symbols-outlined text-[17px] shrink-0 ${isActive ? 'text-primary' : 'text-on-surface-variant'}`}>
                          {item.icon}
                        </span>
                        <span className="truncate">{item.label}</span>
                      </div>
                      {item.badge !== undefined && item.badge > 0 && (
                        <span className={`px-1.5 py-0.2 rounded text-[10px] font-mono font-medium shrink-0 ${
                          isActive 
                            ? 'bg-primary text-on-primary font-bold' 
                            : 'bg-surface-container-highest text-status-warning'
                        }`}>
                          {item.badge}
                        </span>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}

        {/* Quick Ingest Button */}
        <div className="pt-2">
          <button
            onClick={() => openUploadModal('ONGC')}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 font-medium text-xs transition-colors"
          >
            <span className="material-symbols-outlined text-[15px]">upload_file</span>
            <span>Ingest Spreadsheets</span>
          </button>
        </div>
      </div>

      {/* System & Support Footer */}
      <div className="p-3 border-t border-outline-variant/50 bg-surface-container-low/40 space-y-2">
        <div className="flex items-center justify-between px-1 text-xs">
          <button
            onClick={() => setActiveScreen('settings')}
            className={`flex items-center gap-1.5 py-1 text-xs transition-colors rounded ${
              activeScreen === 'settings' ? 'text-primary font-semibold' : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-[15px]">settings</span>
            <span>Settings</span>
          </button>
          <button
            onClick={() => setActiveScreen('support')}
            className={`flex items-center gap-1.5 py-1 text-xs transition-colors rounded ${
              activeScreen === 'support' ? 'text-primary font-semibold' : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-[15px]">help</span>
            <span>Support</span>
          </button>
        </div>

        {/* User Card */}
        <div className="flex items-center gap-2.5 px-2.5 py-2 bg-surface-container rounded-lg border border-outline-variant/50">
          <div className="relative">
            <div className="w-7 h-7 rounded-full bg-primary/20 border border-primary/40 overflow-hidden shrink-0 flex items-center justify-center font-bold text-[11px] text-primary">
              AU
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-status-success ring-1 ring-surface" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-xs text-on-surface truncate leading-tight">Admin Steward</p>
            <p className="text-[10px] text-on-surface-variant truncate">MoPNG Governance</p>
          </div>
        </div>
      </div>
    </nav>
  );
};
