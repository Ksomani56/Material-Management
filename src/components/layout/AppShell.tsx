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
    { id: 'dashboard', label: 'Overview', icon: 'dashboard' },
    { id: 'datahub', label: 'CPSE Data Hub', icon: 'database' },
    { id: 'harmonization', label: 'Harmonization', icon: 'rebase_edit' },
    { id: 'master', label: 'Material Master', icon: 'inventory_2' },
    { id: 'review', label: 'Review Queue', icon: 'fact_check', badge: reviewQueue.length },
    { id: 'rationalization', label: 'Rationalization', icon: 'call_merge' },
    { id: 'analytics', label: 'Analytics', icon: 'monitoring' },
    { id: 'governance', label: 'Audit Trail', icon: 'gavel' },
  ];

  return (
    <nav
      style={{ background: 'var(--bg-sidebar)', borderRight: '1px solid var(--border)' }}
      className="fixed left-0 top-0 h-full w-[200px] flex flex-col z-50 shrink-0"
    >
      {/* Brand */}
      <div
        style={{ borderBottom: '1px solid var(--border)' }}
        className="flex items-center gap-2.5 px-4 py-3.5 cursor-pointer"
        onClick={() => setActiveScreen('dashboard')}
      >
        <div
          style={{ background: 'var(--accent-dim)', border: '1px solid var(--accent)' }}
          className="w-7 h-7 rounded flex items-center justify-center shrink-0"
        >
          <span
            className="material-symbols-outlined text-[16px]"
            style={{ color: 'var(--accent)', fontVariationSettings: "'FILL' 1" }}
          >
            inventory_2
          </span>
        </div>
        <div>
          <p style={{ color: 'var(--text-primary)' }} className="text-xs font-semibold leading-tight">
            NMM Platform
          </p>
          <p style={{ color: 'var(--text-muted)' }} className="text-[10px] leading-tight">
            MoPNG · SIH26099
          </p>
        </div>
      </div>

      {/* Nav Items */}
      <div className="flex-1 overflow-y-auto py-2 px-2 space-y-0.5">
        {navItems.map((item) => {
          const isActive = activeScreen === item.id || (item.id === 'master' && activeScreen === 'detail');
          return (
            <button
              key={item.id}
              onClick={() => setActiveScreen(item.id)}
              style={{
                background: isActive ? 'var(--bg-hover)' : 'transparent',
                color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                borderLeft: isActive ? '2px solid var(--accent)' : '2px solid transparent',
              }}
              className="w-full flex items-center justify-between px-3 py-2 text-left text-xs rounded-r-md transition-all duration-100 group"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <span
                  className="material-symbols-outlined text-[16px] shrink-0"
                  style={{ color: isActive ? 'var(--accent)' : 'var(--text-muted)' }}
                >
                  {item.icon}
                </span>
                <span className={`font-${isActive ? 'medium' : 'normal'} truncate`}>{item.label}</span>
              </div>
              {item.badge !== undefined && item.badge > 0 && (
                <span
                  style={{ background: isActive ? 'var(--accent)' : 'var(--bg-hover)', color: isActive ? '#022c1e' : 'var(--warning)' }}
                  className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full min-w-[18px] text-center shrink-0"
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Bottom */}
      <div style={{ borderTop: '1px solid var(--border)' }} className="p-3 space-y-2">
        <button
          onClick={() => openUploadModal('ONGC')}
          style={{ background: 'var(--accent-dim)', color: 'var(--accent)', border: '1px solid rgba(16,185,129,0.2)' }}
          className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded text-xs font-medium"
        >
          <span className="material-symbols-outlined text-[14px]">upload_file</span>
          Import Data
        </button>

        <div className="flex items-center gap-1 px-1">
          <button
            onClick={() => setActiveScreen('settings')}
            style={{ color: activeScreen === 'settings' ? 'var(--accent)' : 'var(--text-muted)' }}
            className="flex items-center gap-1 text-[11px] hover:opacity-80 transition-opacity"
          >
            <span className="material-symbols-outlined text-[13px]">settings</span>
            Settings
          </button>
          <span style={{ color: 'var(--text-muted)' }} className="mx-1">·</span>
          <button
            onClick={() => setActiveScreen('support')}
            style={{ color: activeScreen === 'support' ? 'var(--accent)' : 'var(--text-muted)' }}
            className="flex items-center gap-1 text-[11px] hover:opacity-80 transition-opacity"
          >
            <span className="material-symbols-outlined text-[13px]">help</span>
            Help
          </button>
        </div>

        {/* User Row */}
        <div
          style={{ background: 'var(--bg-hover)' }}
          className="flex items-center gap-2 px-2.5 py-2 rounded cursor-pointer"
          onClick={() => setActiveScreen('settings')}
        >
          <div
            style={{ background: 'var(--accent-dim)', border: '1px solid var(--accent)', color: 'var(--accent)' }}
            className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0"
          >
            AU
          </div>
          <div className="min-w-0">
            <p style={{ color: 'var(--text-primary)' }} className="text-[11px] font-medium leading-tight truncate">
              Admin Steward
            </p>
            <p style={{ color: 'var(--text-muted)' }} className="text-[10px] leading-tight truncate">
              MoPNG Governance
            </p>
          </div>
          <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: 'var(--success)' }} />
        </div>
      </div>
    </nav>
  );
};
