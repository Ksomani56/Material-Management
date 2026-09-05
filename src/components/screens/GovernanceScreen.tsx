import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { AuditLog } from '../../types/material';

const STATUS_CONFIG: Record<string, { icon: string; color: string; bg: string }> = {
  approved:    { icon: 'check_circle', color: '#10B981', bg: 'rgba(16, 185, 129, 0.12)' },
  harmonized:  { icon: 'check_circle', color: '#10B981', bg: 'rgba(16, 185, 129, 0.12)' },
  flagged:     { icon: 'warning',      color: '#EAB308', bg: 'rgba(234, 179, 8, 0.12)' },
  conflict:    { icon: 'warning',      color: '#EAB308', bg: 'rgba(234, 179, 8, 0.12)' },
  created:     { icon: 'add_circle',   color: '#22D3EE', bg: 'rgba(34, 211, 238, 0.12)' },
  ingestion:   { icon: 'upload',       color: '#3B82F6', bg: 'rgba(59, 130, 246, 0.12)' },
  updated:     { icon: 'edit',         color: '#10B981', bg: 'rgba(16, 185, 129, 0.12)' },
  default:     { icon: 'history',      color: '#9CA3AF', bg: 'rgba(255, 255, 255, 0.05)' },
};

function getStatusCfg(action: string) {
  const key = action.toLowerCase();
  for (const [k, v] of Object.entries(STATUS_CONFIG)) {
    if (key.includes(k)) return v;
  }
  return STATUS_CONFIG.default;
}

export const GovernanceScreen: React.FC = () => {
  const { auditLogs, setActiveScreen } = useApp();
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
    <main className="flex-1 overflow-y-auto px-8 py-6 space-y-6 bg-[#070908] text-[#F3F4F6]">
      {/* 1. Breadcrumbs & Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-medium text-[#9CA3AF]">
          <span 
            onClick={() => setActiveScreen('dashboard')} 
            className="cursor-pointer hover:text-[#F3F4F6] transition-colors"
          >
            Home
          </span>
          <span className="text-[#6B7280]">›</span>
          <span className="text-[#F3F4F6]">Audit History</span>
        </div>

        <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30 text-xs font-medium">
          <span className="material-symbols-outlined text-[15px]">verified</span>
          <span>Statutory Audit Trail Verified</span>
        </span>
      </div>

      {/* 2. Page Title Block */}
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-white font-sans">
          Audit History & Governance
        </h1>
        <p className="text-xs md:text-sm text-[#9CA3AF] leading-relaxed max-w-4xl">
          Immutable audit ledger capturing all CNMC assignments, attribute extractions, manual overrides, and cross-enterprise merges.
        </p>
      </div>

      {/* 3. Hero Split Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-1">
        <div className="lg:col-span-7 space-y-2">
          <h2 className="text-sm font-semibold text-[#F3F4F6] tracking-normal font-sans">
            Cryptographic Accountability Ledger
          </h2>
          <p className="text-xs text-[#9CA3AF] leading-relaxed font-sans">
            Every catalog mutation is recorded with digital signatures, actor identifiers, timestamp telemetry, and before-and-after attribute state hashes to comply with MoPNG statutory audit requirements.
          </p>
        </div>

        <div className="lg:col-span-5 grid grid-cols-3 gap-4 pt-1">
          <div>
            <div className="text-2xl lg:text-3xl font-bold font-sans text-white tracking-tight">
              {stats.totalEvents}
            </div>
            <div className="text-xs font-semibold text-[#F3F4F6] mt-1 leading-tight">
              Total Events
            </div>
            <div className="text-[11px] text-[#6B7280] leading-snug">
              Immutable ledger
            </div>
          </div>

          <div>
            <div className="text-2xl lg:text-3xl font-bold font-sans text-[#10B981] tracking-tight">
              {stats.humanApprovals}
            </div>
            <div className="text-xs font-semibold text-[#F3F4F6] mt-1 leading-tight">
              Steward Actions
            </div>
            <div className="text-[11px] text-[#6B7280] leading-snug">
              Manual approvals
            </div>
          </div>

          <div>
            <div className="text-2xl lg:text-3xl font-bold font-sans text-[#22D3EE] tracking-tight">
              {stats.uniqueEntities}
            </div>
            <div className="text-xs font-semibold text-[#F3F4F6] mt-1 leading-tight">
              Entities Logged
            </div>
            <div className="text-[11px] text-[#6B7280] leading-snug">
              Cross-CPSE items
            </div>
          </div>
        </div>
      </div>

      {/* 4. Filter Strip */}
      <div className="flex flex-wrap gap-3 items-center p-3 rounded-xl bg-[#0C0E0D] border border-[#232825]">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#070908] border border-[#232825] flex-1 min-w-[200px] max-w-sm">
          <span className="material-symbols-outlined text-[16px] text-[#9CA3AF]">search</span>
          <input
            type="text"
            value={filterQuery}
            onChange={e => setFilterQuery(e.target.value)}
            placeholder="Search action, material, or actor..."
            className="bg-transparent border-none text-xs text-[#F3F4F6] placeholder-[#9CA3AF] outline-none w-full"
          />
        </div>

        <select
          value={selectedActionFilter}
          onChange={e => setSelectedActionFilter(e.target.value)}
          className="px-3 py-1.5 rounded-lg text-xs bg-[#070908] border border-[#232825] text-[#F3F4F6] outline-none"
        >
          <option value="ALL">All Actions</option>
          <option value="Approved">Approvals</option>
          <option value="Harmonized">Harmonizations</option>
          <option value="Ingestion">Ingestions</option>
          <option value="Flagged">Flags & Audits</option>
        </select>
      </div>

      {/* 5. Audit Log Table */}
      <div className="bg-[#0C0E0D] border border-[#232825] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#232825] text-[10px] uppercase font-semibold text-[#6B7280]">
                <th className="px-5 py-3 font-medium">Event & Action</th>
                <th className="px-5 py-3 font-medium">Target Entity</th>
                <th className="px-5 py-3 font-medium">Actor</th>
                <th className="px-5 py-3 font-medium text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1B201D]">
              {filteredLogs.map(log => {
                const cfg = getStatusCfg(log.action);
                return (
                  <tr
                    key={log.id}
                    onClick={() => setSelectedLog(log)}
                    className="hover:bg-white/[0.02] cursor-pointer transition-colors"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2.5">
                        <span
                          className="w-7 h-7 rounded-lg flex items-center justify-center text-[15px] shrink-0"
                          style={{ background: cfg.bg, color: cfg.color }}
                        >
                          <span className="material-symbols-outlined text-[15px]">{cfg.icon}</span>
                        </span>
                        <div>
                          <div className="font-semibold text-white">{log.action}</div>
                          <div className="text-xs text-[#9CA3AF] mt-0.5 line-clamp-1">{log.description}</div>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4 font-mono text-xs font-bold text-[#10B981]">
                      {log.targetEntity}
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-[#161B18] border border-[#232825] flex items-center justify-center text-[10px] font-bold font-mono text-white">
                          {log.user.initials}
                        </div>
                        <div>
                          <div className="font-semibold text-white text-xs">{log.user.name}</div>
                          <div className="text-[10px] text-[#6B7280]">{log.user.role}</div>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4 text-right font-mono text-[11px] text-[#6B7280]">
                      {log.timestamp ? new Date(log.timestamp).toLocaleString() : 'Recent'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 6. Footer */}
      <footer className="flex flex-col sm:flex-row items-center justify-between text-xs text-[#6B7280] pt-4 pb-2 border-t border-[#1B201D] gap-2">
        <div>
          National Material Master &nbsp;|&nbsp; Government of India &nbsp;|&nbsp; SIH26099
        </div>
        <div className="flex items-center gap-4">
          <a href="#privacy" className="hover:text-[#9CA3AF] transition-colors">Privacy</a>
          <a href="#terms" className="hover:text-[#9CA3AF] transition-colors">Terms</a>
          <a href="#contact" className="hover:text-[#9CA3AF] transition-colors">Contact</a>
        </div>
      </footer>
    </main>
  );
};
