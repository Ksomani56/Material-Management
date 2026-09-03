import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { AuditLog } from '../../types/material';

const STATUS_CONFIG: Record<string, { icon: string; color: string; bg: string }> = {
  approved:    { icon: 'check_circle', color: 'var(--success)', bg: 'var(--success-dim)' },
  harmonized:  { icon: 'check_circle', color: 'var(--success)', bg: 'var(--success-dim)' },
  flagged:     { icon: 'warning',      color: 'var(--warning)', bg: 'var(--warn-dim)' },
  conflict:    { icon: 'warning',      color: 'var(--warning)', bg: 'var(--warn-dim)' },
  created:     { icon: 'add_circle',   color: 'var(--blue)',    bg: 'var(--blue-dim)' },
  ingestion:   { icon: 'upload',       color: 'var(--indigo)',  bg: 'var(--indigo-dim)' },
  updated:     { icon: 'edit',         color: 'var(--info, var(--blue))', bg: 'var(--blue-dim)' },
  default:     { icon: 'history',      color: 'var(--text-muted)', bg: 'var(--bg-hover)' },
};

function getStatusCfg(action: string) {
  const key = action.toLowerCase();
  for (const [k, v] of Object.entries(STATUS_CONFIG)) {
    if (key.includes(k)) return v;
  }
  return STATUS_CONFIG.default;
}

export const GovernanceScreen: React.FC = () => {
  const { auditLogs } = useApp();
  const [filterQuery, setFilterQuery] = useState('');
  const [selectedActionFilter, setSelectedActionFilter] = useState('ALL');
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);

  const filteredLogs = useMemo(() => auditLogs.filter(log => {
    const q = filterQuery.toLowerCase();
    const matchSearch = !q || log.action.toLowerCase().includes(q) ||
      log.description.toLowerCase().includes(q) ||
      log.targetEntity.toLowerCase().includes(q) ||
      log.user.name.toLowerCase().includes(q) || log.id.toLowerCase().includes(q);
    const matchAction = selectedActionFilter === 'ALL' ||
      log.action.toLowerCase().includes(selectedActionFilter.toLowerCase());
    return matchSearch && matchAction;
  }), [auditLogs, filterQuery, selectedActionFilter]);

  const stats = {
    totalEvents:    auditLogs.length,
    aiDecisions:    auditLogs.filter(l => l.user.isAi).length,
    humanApprovals: auditLogs.filter(l => !l.user.isAi).length,
    uniqueEntities: new Set(auditLogs.map(l => l.targetEntity)).size,
  };

  return (
    <main className="flex-1 flex flex-col overflow-hidden p-6 gap-4" style={{ background: 'var(--bg)' }}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 shrink-0">
        <div>
          <h2 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
            Governance &amp; Audit Trail
          </h2>
          <p className="text-sm mt-0.5" style={{ color: 'var(--text-secondary)' }}>
            Complete history of changes, approvals, and AI decisions across the national catalog.
          </p>
        </div>
        <span
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium shrink-0"
          style={{ background: 'var(--success-dim)', color: 'var(--success)', border: '1px solid rgba(34,197,94,0.2)' }}
        >
          <span className="material-symbols-outlined icon-fill text-[16px]">verified</span>
          Audit Trail Verified &amp; Immutable
        </span>
      </div>

      {/* Stats strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 shrink-0">
        {[
          { label: 'Total Audit Events', value: stats.totalEvents, color: 'var(--text-primary)', icon: 'history' },
          { label: 'AI Recommendations', value: stats.aiDecisions, color: 'var(--blue)', icon: 'smart_toy' },
          { label: 'Cataloger Actions', value: stats.humanApprovals, color: 'var(--indigo)', icon: 'person' },
          { label: 'Entities Impacted', value: stats.uniqueEntities, color: 'var(--success)', icon: 'category' },
        ].map(s => (
          <div key={s.label} className="p-4 rounded-xl flex items-center justify-between"
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
            <div>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{s.label}</p>
              <p className="text-2xl font-bold font-mono mt-0.5" style={{ color: s.color }}>{s.value}</p>
            </div>
            <span className="material-symbols-outlined text-[24px]" style={{ color: s.color, opacity: 0.5 }}>{s.icon}</span>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2.5 items-center p-3 rounded-xl shrink-0"
        style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg flex-1 min-w-[200px] max-w-sm"
          style={{ background: 'var(--bg-input)', border: '1px solid var(--border)' }}>
          <span className="material-symbols-outlined text-[16px]" style={{ color: 'var(--text-muted)' }}>search</span>
          <input
            type="text"
            value={filterQuery}
            onChange={e => setFilterQuery(e.target.value)}
            placeholder="Search action, material code, or user..."
            className="bg-transparent border-none text-sm focus:ring-0 w-full outline-none"
            style={{ color: 'var(--text-primary)' }}
          />
          {filterQuery && (
            <button onClick={() => setFilterQuery('')} style={{ color: 'var(--text-muted)' }} className="hover:opacity-80">
              <span className="material-symbols-outlined text-[14px]">close</span>
            </button>
          )}
        </div>
        <select
          value={selectedActionFilter}
          onChange={e => setSelectedActionFilter(e.target.value)}
          className="px-3 py-2 rounded-lg text-sm outline-none"
          style={{ background: 'var(--bg-input)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
        >
          <option value="ALL">All Actions</option>
          <option value="approved">Approvals</option>
          <option value="flagged">Flagged / Conflicts</option>
          <option value="ingestion">File Ingestions</option>
          <option value="updated">Updates &amp; Edits</option>
        </select>
      </div>

      {/* Audit table */}
      <div className="flex-1 overflow-hidden rounded-xl flex flex-col"
        style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
        <div className="overflow-auto flex-1">
          <table className="w-full text-left">
            <thead className="sticky top-0 z-10" style={{ background: 'var(--bg-card)', borderBottom: '1px solid var(--border)' }}>
              <tr>
                {['Time / Date', 'Action Performed', 'Target Material', 'Performed By', 'Summary', 'Audit ID'].map(h => (
                  <th key={h} className="px-4 py-3 text-xs font-semibold uppercase tracking-wide whitespace-nowrap"
                    style={{ color: 'var(--text-muted)' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map(log => {
                const cfg = getStatusCfg(log.action);
                return (
                  <tr key={log.id} onClick={() => setSelectedLog(log)}
                    className="cursor-pointer transition-colors hover:opacity-90 whitespace-nowrap"
                    style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    <td className="px-4 py-3.5 text-sm font-mono" style={{ color: 'var(--text-muted)' }}>
                      {log.timestamp}
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined icon-fill text-[15px]" style={{ color: cfg.color }}>{cfg.icon}</span>
                        <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{log.action}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="px-2 py-1 rounded text-xs font-mono font-semibold"
                        style={{ background: 'var(--blue-dim)', color: 'var(--blue)' }}>
                        {log.targetEntity}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full shrink-0"
                          style={{ background: log.user.isAi ? 'var(--blue)' : 'var(--indigo)' }} />
                        <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{log.user.name}</span>
                        <span className="text-xs" style={{ color: 'var(--text-muted)' }}>({log.user.role})</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-sm max-w-xs truncate" style={{ color: 'var(--text-secondary)' }}
                      title={log.description}>
                      {log.description}
                    </td>
                    <td className="px-4 py-3.5 text-right text-sm font-mono font-semibold" style={{ color: 'var(--blue)' }}>
                      {log.id}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="h-10 shrink-0 flex items-center justify-between px-4 text-sm"
          style={{ borderTop: '1px solid var(--border)', background: 'var(--bg-hover)', color: 'var(--text-muted)' }}>
          <span>Showing <strong style={{ color: 'var(--text-primary)' }}>{filteredLogs.length}</strong> audit events</span>
          <span>Click any row to view full details</span>
        </div>
      </div>

      {/* Detail modal */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
          onClick={() => setSelectedLog(null)}>
          <div className="w-full max-w-lg rounded-xl shadow-elevated p-6 space-y-4 animate-fade-in"
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
            onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-start pb-3" style={{ borderBottom: '1px solid var(--border)' }}>
              <div>
                <span className="text-xs font-mono font-bold" style={{ color: 'var(--blue)' }}>{selectedLog.id}</span>
                <h3 className="text-base font-semibold mt-0.5" style={{ color: 'var(--text-primary)' }}>{selectedLog.action}</h3>
              </div>
              <button onClick={() => setSelectedLog(null)}
                className="p-1 rounded hover:opacity-80 transition-opacity"
                style={{ color: 'var(--text-muted)' }}>
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3 p-4 rounded-lg text-sm font-mono"
              style={{ background: 'var(--bg-hover)', border: '1px solid var(--border-subtle)' }}>
              {[
                { label: 'Material Code', val: selectedLog.targetEntity, color: 'var(--blue)' },
                { label: 'Timestamp', val: selectedLog.timestamp, color: 'var(--text-primary)' },
                { label: 'Actor', val: selectedLog.user.name, color: 'var(--text-primary)' },
                { label: 'Verification', val: 'Immutable Ledger', color: 'var(--success)' },
              ].map(r => (
                <div key={r.label}>
                  <span className="text-xs uppercase block mb-0.5" style={{ color: 'var(--text-muted)' }}>{r.label}</span>
                  <span className="font-semibold" style={{ color: r.color }}>{r.val}</span>
                </div>
              ))}
            </div>
            <div>
              <p className="text-xs uppercase mb-2" style={{ color: 'var(--text-muted)' }}>Action Description</p>
              <p className="text-sm leading-relaxed p-4 rounded-lg" style={{
                background: 'var(--bg-hover)', border: '1px solid var(--border-subtle)', color: 'var(--text-secondary)'
              }}>
                {selectedLog.description}
              </p>
            </div>
            <div className="flex justify-end pt-1">
              <button onClick={() => setSelectedLog(null)}
                className="px-4 py-2 rounded-lg text-sm font-medium hover:brightness-110 transition-all"
                style={{ background: 'var(--bg-hover)', color: 'var(--text-primary)', border: '1px solid var(--border)' }}>
                Close Audit Record
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};
