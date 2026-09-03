import React from 'react';
import { useApp, ScreenType } from '../../context/AppContext';

interface NavItem {
  id: ScreenType;
  label: string;
  icon: string;
  badge?: number;
}

interface NavGroup {
  id: string;
  label: string;
  items: NavItem[];
}

export const AppShell: React.FC = () => {
  const {
    activeScreen, setActiveScreen,
    reviewQueue,
    openUploadModal,
    sidebarCollapsed, setSidebarCollapsed,
    sidebarOpenGroups, toggleSidebarGroup,
  } = useApp();

  const groups: NavGroup[] = [
    {
      id: 'overview',
      label: 'Overview',
      items: [
        { id: 'dashboard', label: 'Executive Dashboard', icon: 'dashboard' },
        { id: 'home', label: 'Problem & Architecture', icon: 'info' },
      ],
    },
    {
      id: 'catalog',
      label: 'Catalog Management',
      items: [
        { id: 'datahub', label: 'CPSE Data Hub', icon: 'database' },
        { id: 'harmonization', label: 'Harmonization', icon: 'rebase_edit' },
        { id: 'master', label: 'Material Master', icon: 'inventory_2' },
      ],
    },
    {
      id: 'operations',
      label: 'Review & Operations',
      items: [
        { id: 'review', label: 'Review Queue', icon: 'fact_check', badge: reviewQueue.length },
        { id: 'rationalization', label: 'Rationalization', icon: 'call_merge' },
      ],
    },
    {
      id: 'reporting',
      label: 'Reporting & Governance',
      items: [
        { id: 'analytics', label: 'Analytics & Savings', icon: 'monitoring' },
        { id: 'governance', label: 'Audit Trail', icon: 'gavel' },
      ],
    },
  ];

  const isActive = (id: ScreenType) =>
    activeScreen === id || (id === 'master' && activeScreen === 'detail');

  const W = sidebarCollapsed ? 64 : 240;

  return (
    <nav
      className="sidebar fixed left-0 top-0 h-full flex flex-col z-50 overflow-hidden"
      style={{
        width: `${W}px`,
        background: 'var(--bg-sidebar)',
        borderRight: '1px solid var(--border)',
      }}
    >
      {/* Brand + Collapse Toggle */}
      <div
        className="flex items-center justify-between shrink-0 px-3 h-12"
        style={{ borderBottom: '1px solid var(--border)' }}
      >
        {!sidebarCollapsed && (
          <div
            className="flex items-center gap-2.5 cursor-pointer min-w-0"
            onClick={() => setActiveScreen('dashboard')}
          >
            <div
              className="w-7 h-7 rounded flex items-center justify-center shrink-0"
              style={{ background: 'var(--blue-dim)', border: '1px solid rgba(59,130,246,0.3)' }}
            >
              <span
                className="material-symbols-outlined icon-fill text-[16px]"
                style={{ color: 'var(--blue)' }}
              >
                inventory_2
              </span>
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold truncate" style={{ color: 'var(--text-primary)' }}>
                NMM Platform
              </p>
              <p className="text-[10px] truncate" style={{ color: 'var(--text-muted)' }}>
                MoPNG · SIH26099
              </p>
            </div>
          </div>
        )}

        {sidebarCollapsed && (
          <div
            className="w-7 h-7 rounded flex items-center justify-center cursor-pointer mx-auto"
            style={{ background: 'var(--blue-dim)' }}
            onClick={() => setActiveScreen('dashboard')}
          >
            <span className="material-symbols-outlined icon-fill text-[16px]" style={{ color: 'var(--blue)' }}>
              inventory_2
            </span>
          </div>
        )}

        {!sidebarCollapsed && (
          <button
            onClick={() => setSidebarCollapsed(true)}
            className="p-1 rounded hover:opacity-80 transition-opacity shrink-0"
            style={{ color: 'var(--text-muted)' }}
            title="Collapse sidebar"
          >
            <span className="material-symbols-outlined text-[18px]">chevron_left</span>
          </button>
        )}
      </div>

      {/* Expand button when collapsed */}
      {sidebarCollapsed && (
        <button
          onClick={() => setSidebarCollapsed(false)}
          className="flex items-center justify-center h-8 mt-1 mx-2 rounded hover:opacity-80 transition-opacity"
          style={{ color: 'var(--text-muted)', background: 'var(--bg-hover)' }}
          title="Expand sidebar"
        >
          <span className="material-symbols-outlined text-[18px]">chevron_right</span>
        </button>
      )}

      {/* Nav Groups */}
      <div className="flex-1 overflow-y-auto py-2 space-y-0.5">
        {groups.map((group) => {
          const open = sidebarOpenGroups.includes(group.id);
          const groupHasActive = group.items.some(i => isActive(i.id));
          const totalBadge = group.items.reduce((sum, i) => sum + (i.badge || 0), 0);

          return (
            <div key={group.id}>
              {/* Group Header */}
              {!sidebarCollapsed && (
                <button
                  onClick={() => toggleSidebarGroup(group.id)}
                  className="w-full flex items-center justify-between px-3 py-1.5 text-left transition-colors hover:opacity-90"
                  style={{ color: groupHasActive ? 'var(--blue)' : 'var(--text-muted)' }}
                >
                  <span className="text-[10px] font-semibold uppercase tracking-wider">
                    {group.label}
                    {totalBadge > 0 && (
                      <span
                        className="ml-1.5 px-1 py-0 rounded text-[9px] font-bold"
                        style={{ background: 'var(--warn-dim)', color: 'var(--warning)' }}
                      >
                        {totalBadge}
                      </span>
                    )}
                  </span>
                  <span className="material-symbols-outlined text-[14px] transition-transform duration-200"
                    style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
                  >
                    expand_more
                  </span>
                </button>
              )}

              {/* Accordion Items */}
              <div
                className={`accordion-content ${(!sidebarCollapsed && open) || sidebarCollapsed ? 'open' : 'closed'}`}
              >
                {group.items.map((item) => {
                  const active = isActive(item.id);
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveScreen(item.id)}
                      title={sidebarCollapsed ? item.label : undefined}
                      className="w-full flex items-center justify-between transition-colors duration-150"
                      style={{
                        padding: sidebarCollapsed ? '8px 0' : '6px 12px 6px 14px',
                        justifyContent: sidebarCollapsed ? 'center' : 'space-between',
                        borderLeft: active ? '2px solid var(--blue)' : '2px solid transparent',
                        background: active ? 'var(--blue-dim)' : 'transparent',
                        color: active ? 'var(--blue)' : 'var(--text-secondary)',
                      }}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span
                          className="material-symbols-outlined text-[16px] shrink-0"
                          style={{ color: active ? 'var(--blue)' : 'var(--text-muted)' }}
                        >
                          {item.icon}
                        </span>
                        {!sidebarCollapsed && (
                          <span className={`text-xs truncate ${active ? 'font-medium' : 'font-normal'}`}>
                            {item.label}
                          </span>
                        )}
                      </div>
                      {!sidebarCollapsed && item.badge !== undefined && item.badge > 0 && (
                        <span
                          className="text-[10px] font-bold px-1.5 py-0.5 rounded-full shrink-0"
                          style={{
                            background: active ? 'var(--blue)' : 'var(--warn-dim)',
                            color: active ? '#fff' : 'var(--warning)',
                          }}
                        >
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div style={{ borderTop: '1px solid var(--border)' }} className="p-2 space-y-2 shrink-0">
        {!sidebarCollapsed && (
          <button
            onClick={() => openUploadModal('ONGC')}
            className="w-full flex items-center justify-center gap-1.5 py-2 rounded text-xs font-medium transition-all hover:brightness-110"
            style={{
              background: 'var(--blue-dim)',
              color: 'var(--blue)',
              border: '1px solid rgba(59,130,246,0.2)',
            }}
          >
            <span className="material-symbols-outlined text-[14px]">upload_file</span>
            Ingest Spreadsheet
          </button>
        )}

        {!sidebarCollapsed && (
          <div className="flex items-center justify-between px-1 text-[11px]">
            <button
              onClick={() => setActiveScreen('settings')}
              className="flex items-center gap-1 hover:opacity-80 transition-opacity"
              style={{ color: activeScreen === 'settings' ? 'var(--blue)' : 'var(--text-muted)' }}
            >
              <span className="material-symbols-outlined text-[13px]">settings</span>
              Settings
            </button>
            <button
              onClick={() => setActiveScreen('support')}
              className="flex items-center gap-1 hover:opacity-80 transition-opacity"
              style={{ color: activeScreen === 'support' ? 'var(--blue)' : 'var(--text-muted)' }}
            >
              <span className="material-symbols-outlined text-[13px]">help</span>
              Support
            </button>
          </div>
        )}

        {/* User card */}
        <div
          className="flex items-center gap-2 rounded cursor-pointer hover:opacity-90 transition-opacity"
          style={{
            padding: sidebarCollapsed ? '4px 0' : '6px 8px',
            justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
            background: 'var(--bg-hover)',
          }}
          onClick={() => setActiveScreen('settings')}
          title="Admin Steward — MoPNG Governance"
        >
          <div
            className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0"
            style={{ background: 'var(--blue)', color: '#fff' }}
          >
            AU
          </div>
          {!sidebarCollapsed && (
            <div className="min-w-0">
              <p className="text-[11px] font-medium leading-tight truncate" style={{ color: 'var(--text-primary)' }}>
                Admin Steward
              </p>
              <p className="text-[10px] leading-tight truncate" style={{ color: 'var(--text-muted)' }}>
                MoPNG Governance
              </p>
            </div>
          )}
          {!sidebarCollapsed && (
            <div className="w-1.5 h-1.5 rounded-full ml-auto shrink-0" style={{ background: 'var(--success)' }} />
          )}
        </div>
      </div>
    </nav>
  );
};
