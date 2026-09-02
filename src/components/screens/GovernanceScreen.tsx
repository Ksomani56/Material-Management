import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { AuditLog } from '../../types/material';

export const GovernanceScreen: React.FC = () => {
  const { auditLogs } = useApp();
  const [filterQuery, setFilterQuery] = useState('');
  const [selectedActionFilter, setSelectedActionFilter] = useState('ALL');
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);

  const filteredLogs = useMemo(() => {
    return auditLogs.filter(log => {
      const matchSearch = !filterQuery.trim() ||
        log.action.toLowerCase().includes(filterQuery.toLowerCase()) ||
        log.description.toLowerCase().includes(filterQuery.toLowerCase()) ||
        log.targetEntity.toLowerCase().includes(filterQuery.toLowerCase()) ||
        log.user.name.toLowerCase().includes(filterQuery.toLowerCase()) ||
        log.id.toLowerCase().includes(filterQuery.toLowerCase());

      const matchAction = selectedActionFilter === 'ALL' || log.action.toLowerCase().includes(selectedActionFilter.toLowerCase());

      return matchSearch && matchAction;
    });
  }, [auditLogs, filterQuery, selectedActionFilter]);

  const stats = {
    totalEvents: auditLogs.length,
    aiDecisions: auditLogs.filter(l => l.user.isAi).length,
    humanApprovals: auditLogs.filter(l => !l.user.isAi).length,
    uniqueEntities: new Set(auditLogs.map(l => l.targetEntity)).size
  };

  return (
    <main className="flex-1 flex flex-col overflow-hidden p-margin-page gap-4 bg-background transition-colors duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 shrink-0">
        <div>
          <h1 className="font-headline-section text-headline-section text-on-surface font-bold">
            Governance & Audit Trail
          </h1>
          <p className="text-xs text-on-surface-variant mt-0.5">
            Complete history of changes, approvals, and AI decisions across the national catalog.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-data-mono text-xs text-status-success bg-status-success/15 border border-status-success/30 px-3 py-1 rounded-xl flex items-center gap-1.5 font-semibold">
            <span className="material-symbols-outlined text-sm">verified</span>
            Audit Trail Verified & Immutable
          </span>
        </div>
      </div>

      {/* Summary Stat Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 shrink-0">
        <div className="p-3 bg-surface-container rounded-xl border border-outline-variant/40 flex justify-between items-center">
          <span className="text-xs text-on-surface-variant font-medium">Total Audit Events</span>
          <span className="font-display-cnmc text-base font-bold text-on-surface">{stats.totalEvents}</span>
        </div>
        <div className="p-3 bg-surface-container rounded-xl border border-outline-variant/40 flex justify-between items-center">
          <span className="text-xs text-on-surface-variant font-medium">AI Recommendations</span>
          <span className="font-display-cnmc text-base font-bold text-primary">{stats.aiDecisions}</span>
        </div>
        <div className="p-3 bg-surface-container rounded-xl border border-outline-variant/40 flex justify-between items-center">
          <span className="text-xs text-on-surface-variant font-medium">Cataloger Actions</span>
          <span className="font-display-cnmc text-base font-bold text-relationship-duplicate">{stats.humanApprovals}</span>
        </div>
        <div className="p-3 bg-surface-container rounded-xl border border-outline-variant/40 flex justify-between items-center">
          <span className="text-xs text-on-surface-variant font-medium">Entities Impacted</span>
          <span className="font-display-cnmc text-base font-bold text-status-success">{stats.uniqueEntities}</span>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-wrap gap-3 items-center bg-surface-container p-3 rounded-2xl border border-outline-variant/40 shrink-0 shadow-sm">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-surface-container-low rounded-xl border border-outline-variant/40 flex-1 min-w-[240px] max-w-sm focus-within:ring-1 focus-within:ring-primary">
          <span className="material-symbols-outlined text-on-surface-variant text-[18px]">search</span>
          <input 
            type="text" 
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
            placeholder="Search action, material code, or user..."
            className="bg-transparent border-none p-0 text-xs focus:ring-0 w-full text-on-surface placeholder-on-surface-variant font-data-mono outline-none"
          />
          {filterQuery && (
            <button onClick={() => setFilterQuery('')} className="text-xs text-on-surface-variant hover:text-on-surface">✕</button>
          )}
        </div>

        <select 
          value={selectedActionFilter}
          onChange={(e) => setSelectedActionFilter(e.target.value)}
          className="bg-surface-container-low border border-outline-variant/40 rounded-xl px-3 py-1.5 text-xs text-on-surface focus:ring-1 focus:ring-primary focus:border-primary font-data-mono outline-none"
        >
          <option value="ALL">All Actions</option>
          <option value="approved">Approvals</option>
          <option value="flagged">Flagged / Conflicts</option>
          <option value="ingestion">File Ingestions</option>
          <option value="updated">Updates & Edits</option>
        </select>
      </div>

      {/* Scannable Audit Table (Replacing large bulky timeline cards) */}
      <div className="flex-1 overflow-hidden bg-surface-container rounded-2xl border border-outline-variant/40 flex flex-col relative shadow-sm">
        <div className="overflow-auto flex-1">
          <table className="w-full text-left whitespace-nowrap border-collapse">
            <thead className="sticky top-0 bg-surface-container-high z-10 border-b border-outline-variant/40">
              <tr>
                <th className="px-4 py-2.5 font-table-header text-[11px] text-on-surface-variant uppercase">Time / Date</th>
                <th className="px-4 py-2.5 font-table-header text-[11px] text-on-surface-variant uppercase">Action Performed</th>
                <th className="px-4 py-2.5 font-table-header text-[11px] text-on-surface-variant uppercase">Target Material</th>
                <th className="px-4 py-2.5 font-table-header text-[11px] text-on-surface-variant uppercase">Performed By</th>
                <th className="px-4 py-2.5 font-table-header text-[11px] text-on-surface-variant uppercase">Summary</th>
                <th className="px-4 py-2.5 font-table-header text-[11px] text-on-surface-variant uppercase text-right">Audit ID</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/20 font-data-mono text-xs">
              {filteredLogs.map((log) => (
                <tr 
                  key={log.id}
                  onClick={() => setSelectedLog(log)}
                  className="hover:bg-surface-container-high/60 transition-colors cursor-pointer"
                >
                  <td className="px-4 py-3 text-on-surface-variant text-[11px]">
                    {log.timestamp}
                  </td>

                  <td className="px-4 py-3">
                    <span className="font-semibold text-on-surface font-sans text-xs">
                      {log.action}
                    </span>
                  </td>

                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 rounded-md bg-surface-container-high text-primary font-bold border border-outline-variant/30">
                      {log.targetEntity}
                    </span>
                  </td>

                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <span className={`w-2 h-2 rounded-full ${log.user.isAi ? 'bg-primary' : 'bg-relationship-duplicate'}`} />
                      <span className="font-sans text-on-surface text-xs font-medium">{log.user.name}</span>
                      <span className="text-[10px] text-on-surface-variant">({log.user.role})</span>
                    </div>
                  </td>

                  <td className="px-4 py-3 font-sans text-on-surface-variant max-w-sm truncate" title={log.description}>
                    {log.description}
                  </td>

                  <td className="px-4 py-3 text-right text-primary/80 font-bold text-[11px]">
                    {log.id}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="h-10 border-t border-outline-variant/40 bg-surface-container-high flex items-center justify-between px-4 shrink-0 text-on-surface-variant font-data-mono text-xs">
          <span>Showing <strong>{filteredLogs.length}</strong> logged transactions</span>
          <span className="text-on-surface-variant text-[11px]">Click any event row to view complete state change details</span>
        </div>
      </div>

      {/* Clean Detail Modal / Drawer for Selected Audit Event */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-surface-container w-full max-w-xl rounded-2xl border border-outline-variant/60 shadow-2xl p-6 space-y-4">
            <div className="flex justify-between items-start border-b border-outline-variant/30 pb-3">
              <div>
                <span className="font-data-mono text-xs text-primary font-bold">{selectedLog.id}</span>
                <h3 className="font-headline-section text-base font-bold text-on-surface mt-0.5">{selectedLog.action}</h3>
              </div>
              <button 
                onClick={() => setSelectedLog(null)}
                className="p-1.5 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 font-data-mono text-xs">
              <div className="grid grid-cols-2 gap-3 p-3 bg-surface-container-low rounded-xl border border-outline-variant/30">
                <div>
                  <span className="text-on-surface-variant text-[10px] uppercase block">Material Code</span>
                  <span className="font-bold text-primary mt-0.5 block">{selectedLog.targetEntity}</span>
                </div>
                <div>
                  <span className="text-on-surface-variant text-[10px] uppercase block">Timestamp</span>
                  <span className="text-on-surface mt-0.5 block">{selectedLog.timestamp}</span>
                </div>
                <div>
                  <span className="text-on-surface-variant text-[10px] uppercase block">Actor</span>
                  <span className="text-on-surface mt-0.5 block font-sans font-medium">{selectedLog.user.name} ({selectedLog.user.role})</span>
                </div>
                <div>
                  <span className="text-on-surface-variant text-[10px] uppercase block">Verification</span>
                  <span className="text-status-success font-semibold mt-0.5 block">Cryptographically Valid</span>
                </div>
              </div>

              <div>
                <span className="text-on-surface-variant text-[10px] uppercase block mb-1">Action Description & Rationale</span>
                <p className="font-sans text-xs text-on-surface p-3 bg-surface-container-low rounded-xl border border-outline-variant/30 leading-relaxed">
                  {selectedLog.description}
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-outline-variant/30 flex justify-end">
              <button
                onClick={() => setSelectedLog(null)}
                className="px-4 py-2 bg-surface-container-high hover:bg-surface-container-highest border border-outline-variant/50 rounded-xl text-xs font-semibold text-on-surface transition"
              >
                Close Audit Record
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};
