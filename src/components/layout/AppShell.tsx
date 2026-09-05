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
    activeScreen,
    setActiveScreen,
    sidebarCollapsed,
    setSidebarCollapsed,
    sidebarOpenGroups,
    toggleSidebarGroup,
    reviewQueue,
  } = useApp();

  const toggleSidebar = () => setSidebarCollapsed(!sidebarCollapsed);

  const groups: NavGroup[] = [
    {
      id: 'core',
      label: 'Overview',
      items: [
        { id: 'dashboard', label: 'Overview', icon: 'grid_view' },
        { id: 'home', label: 'Problem & Architecture', icon: 'hub' },
      ],
    },
    {
      id: 'catalog',
      label: 'Catalog Management',
      items: [
        { id: 'master', label: 'Master Catalog', icon: 'inventory_2' },
        { id: 'detail', label: 'Material Spec Sheet', icon: 'description' },
        { id: 'datahub', label: 'CPSE Data Hub', icon: 'dataset' },
      ],
    },
    {
      id: 'review-ops',
      label: 'Review & Operations',
      items: [
        { id: 'harmonization', label: 'Harmonization', icon: 'compare_arrows' },
        {
          id: 'review',
          label: 'Review Queue',
          icon: 'fact_check',
          badge: reviewQueue.length,
        },
        { id: 'rationalization', label: 'Rationalization', icon: 'call_merge' },
      ],
    },
    {
      id: 'reporting',
      label: 'Reporting & Governance',
      items: [
        { id: 'analytics', label: 'Analytics & Savings', icon: 'monitoring' },
        { id: 'governance', label: 'Audit Trail', icon: 'gavel' },
        { id: 'settings', label: 'Settings', icon: 'settings' },
        { id: 'support', label: 'Documentation', icon: 'help_outline' },
      ],
    },
  ];

  const isActive = (id: ScreenType) => activeScreen === id;

  const width = sidebarCollapsed ? 'w-16' : 'w-60';

  return (
    <aside
      className={`fixed top-0 left-0 h-screen z-40 flex flex-col justify-between transition-all duration-200 select-none ${width}`}
      style={{
        background: '#000000',
        borderRight: '1px solid rgba(255, 255, 255, 0.08)',
      }}
    >
      {/* Top Brand Header */}
      <div>
        <div
          onClick={() => setActiveScreen('landing')}
          className="flex items-center gap-3 px-4 h-14 cursor-pointer hover:opacity-90 transition-opacity"
          style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}
        >
          {/* Logo icon box matching template */}
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 shadow-sm"
            style={{
              background: '#ffffff',
              color: '#000000',
            }}
          >
            <span className="material-symbols-outlined icon-fill text-[20px]">
              inventory_2
            </span>
          </div>

          {!sidebarCollapsed && (
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-white tracking-tight truncate leading-tight">
                National Master
              </p>
              <p className="text-[10px] text-[#71717a] truncate font-mono">
                SIH26099 · MoPNG
              </p>
            </div>
          )}
        </div>

        {/* Navigation Items */}
        <nav className="p-2 space-y-4 overflow-y-auto max-h-[calc(100vh-120px)]">
          {groups.map((group) => {
            const open = sidebarOpenGroups.includes(group.id);
            const groupHasActive = group.items.some((i) => isActive(i.id));

            return (
              <div key={group.id} className="space-y-1">
                {/* Category Header */}
                {!sidebarCollapsed && (
                  <button
                    onClick={() => toggleSidebarGroup(group.id)}
                    className="w-full flex items-center justify-between px-2.5 py-1 text-left text-[11px] font-semibold uppercase tracking-wider transition-colors"
                    style={{
                      color: groupHasActive ? '#ffffff' : '#71717a',
                    }}
                  >
                    <span>{group.label}</span>
                    <span
                      className="material-symbols-outlined text-[14px] transition-transform duration-200"
                      style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
                    >
                      expand_more
                    </span>
                  </button>
                )}

                {/* Sub-items */}
                <div
                  className={`accordion-content ${
                    (!sidebarCollapsed && open) || sidebarCollapsed ? 'open' : 'closed'
                  } space-y-0.5`}
                >
                  {group.items.map((item) => {
                    const active = isActive(item.id);
                    return (
                      <button
                        key={item.id}
                        onClick={() => setActiveScreen(item.id)}
                        title={sidebarCollapsed ? item.label : undefined}
                        className="w-full flex items-center gap-3 rounded-lg transition-all duration-150"
                        style={{
                          padding: sidebarCollapsed ? '9px 0' : '8px 12px',
                          justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
                          background: active ? 'rgba(255, 255, 255, 0.08)' : 'transparent',
                          color: active ? '#ffffff' : '#a1a1aa',
                          fontWeight: active ? 500 : 400,
                        }}
                        onMouseEnter={(e) => {
                          if (!active) {
                            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)';
                            e.currentTarget.style.color = '#ffffff';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!active) {
                            e.currentTarget.style.background = 'transparent';
                            e.currentTarget.style.color = '#a1a1aa';
                          }
                        }}
                      >
                        <span
                          className="material-symbols-outlined text-[19px] shrink-0"
                          style={{
                            color: active ? '#8b5cf6' : '#71717a',
                          }}
                        >
                          {item.icon}
                        </span>

                        {!sidebarCollapsed && (
                          <span className="text-sm truncate flex-1 text-left">
                            {item.label}
                          </span>
                        )}

                        {!sidebarCollapsed && item.badge !== undefined && item.badge > 0 && (
                          <span
                            className="text-[10px] font-bold px-1.5 py-0.2 rounded-full font-mono shrink-0"
                            style={{
                              background: 'rgba(245, 158, 11, 0.15)',
                              color: '#f59e0b',
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
        </nav>
      </div>

      {/* Bottom Collapse Button matching template */}
      <div
        className="p-2 shrink-0"
        style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}
      >
        <button
          onClick={toggleSidebar}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-[#71717a] hover:text-white hover:bg-white/5 transition-colors"
          style={{ justifyContent: sidebarCollapsed ? 'center' : 'flex-start' }}
        >
          <span className="material-symbols-outlined text-[18px]">
            {sidebarCollapsed ? 'chevron_right' : 'chevron_left'}
          </span>
          {!sidebarCollapsed && <span>Collapse</span>}
        </button>
      </div>
    </aside>
  );
};
