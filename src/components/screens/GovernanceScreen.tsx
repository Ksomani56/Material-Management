import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

export const GovernanceScreen: React.FC = () => {
  const { auditLogs } = useApp();
  const [filterQuery, setFilterQuery] = useState('');

  const filteredLogs = auditLogs.filter(log => 
    !filterQuery.trim() ||
    log.action.toLowerCase().includes(filterQuery.toLowerCase()) ||
    log.description.toLowerCase().includes(filterQuery.toLowerCase()) ||
    log.targetEntity.toLowerCase().includes(filterQuery.toLowerCase()) ||
    log.user.name.toLowerCase().includes(filterQuery.toLowerCase())
  );

  return (
    <main className="flex-1 flex flex-col overflow-hidden p-margin-page gap-4 bg-background transition-colors duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 shrink-0">
        <div>
          <h1 className="font-headline-section text-headline-section text-on-surface font-bold">
            Governance & Audit Trail
          </h1>
          <p className="font-data-mono text-xs text-on-surface-variant mt-0.5">
            Cryptographically verifiable, tamper-evident audit history under MoPNG Guidelines
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-data-mono text-xs text-status-success bg-status-success/15 border border-status-success/30 px-3 py-1 rounded-xl">
            All Records Signed & Immutable
          </span>
        </div>
      </div>

      {/* Filter */}
      <div className="flex items-center gap-2 px-3 py-2 bg-surface-container rounded-2xl border border-outline-variant/40 max-w-md shrink-0 shadow-sm">
        <span className="material-symbols-outlined text-on-surface-variant text-[18px]">search</span>
        <input 
          type="text" 
          value={filterQuery}
          onChange={(e) => setFilterQuery(e.target.value)}
          placeholder="Filter audit entries by action, entity or user..."
          className="bg-transparent border-none p-0 text-xs focus:ring-0 w-full text-on-surface placeholder-on-surface-variant font-data-mono outline-none"
        />
        {filterQuery && (
          <button onClick={() => setFilterQuery('')} className="text-xs text-on-surface-variant hover:text-on-surface">✕</button>
        )}
      </div>

      {/* Logs Table */}
      <div className="flex-1 overflow-hidden bg-surface-container rounded-2xl border border-outline-variant/40 flex flex-col relative shadow-sm">
        <div className="overflow-auto flex-1 p-5">
          <div className="relative border-l border-outline-variant/60 ml-4 space-y-5">
            {filteredLogs.map((log) => (
              <div key={log.id} className="relative pl-7">
                {/* Node dot */}
                <div className="absolute w-3 h-3 rounded-full bg-primary -left-[6.5px] top-1 border-2 border-surface shadow-sm" />
                
                <div className="bg-surface-container-low p-4 rounded-xl border border-outline-variant/40 space-y-2">
                  <div className="flex flex-wrap justify-between items-center gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-body-bold text-sm text-on-surface font-semibold">{log.action}</span>
                      <span className="font-data-mono text-xs text-primary bg-primary/10 px-2 py-0.5 rounded-md border border-primary/20">
                        {log.targetEntity}
                      </span>
                    </div>
                    <span className="font-data-mono text-xs text-on-surface-variant">{log.timestamp}</span>
                  </div>

                  <p className="font-body-standard text-xs text-on-surface-variant leading-relaxed">
                    {log.description}
                  </p>

                  <div className="pt-2 border-t border-outline-variant/30 flex items-center justify-between text-xs font-data-mono">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-surface-container-high border border-outline-variant flex items-center justify-center text-[10px] text-primary font-bold">
                        {log.user.initials || (log.user.isAi ? 'AI' : 'U')}
                      </div>
                      <span className="text-on-surface">{log.user.name}</span>
                      <span className="text-on-surface-variant">({log.user.role})</span>
                    </div>
                    <span className="text-[10px] text-on-surface-variant opacity-60">ID: {log.id}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
};
