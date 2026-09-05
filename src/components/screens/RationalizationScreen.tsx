import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

const ACTION_META = {
  MAP:    { icon: 'link',        label: 'Link to Master',       desc: 'Creates a bi-directional alias between legacy CPSE items and the national master CNMC with full provenance.' },
  MERGE:  { icon: 'call_merge',  label: 'Combine Duplicates',   desc: 'Safely merges identical source records into a single CNMC with full traceability and alias forwarding.' },
  RETIRE: { icon: 'archive',     label: 'Deactivate Obsolete',  desc: 'Marks obsolete, deprecated, or superseded materials as retired with automatic replacement forwarding.' },
  REVIEW: { icon: 'tune',        label: 'Manual Check',         desc: 'Routes ambiguous attribute conflicts to the technical committee for physical inspection.' },
  SPLIT:  { icon: 'call_split',  label: 'Divergent Specs',      desc: 'Partitions overloaded legacy descriptions into discrete standardized materials.' },
  RETAIN: { icon: 'lock',        label: 'Keep As-Is',           desc: 'Protects specialized local inventory codes that do not require national standardization.' },
};

type ActionType = keyof typeof ACTION_META;

export const RationalizationScreen: React.FC = () => {
  const { openImpactModal, addAuditLog, addToast, reviewQueue } = useApp();
  const [selectedAction, setSelectedAction] = useState<ActionType>('MERGE');

  const candidates = reviewQueue.length > 0
    ? reviewQueue.slice(0, 10).map((item) => ({
        sourceCode: item.sourceCode,
        targetCnmc: item.candidateCnmc,
        description: item.sourceDescription,
        cpse: item.sourceCpse,
        potentialDuplicates: Math.max(2, Math.round(item.confidence / 25)),
      }))
    : [
        { sourceCode: 'ONGC-VLV-009', targetCnmc: 'CNMC-00018427', description: '6 IN BALL VALVE CLASS 300 A105', cpse: 'ONGC', potentialDuplicates: 3 },
        { sourceCode: 'IOCL-PMP-104', targetCnmc: 'CNMC-883210',   description: 'CENTRIFUGAL PUMP 50M3/HR 120M HEAD CS', cpse: 'IOCL', potentialDuplicates: 2 },
        { sourceCode: 'NTPC-FST-881', targetCnmc: 'CNMC-110482',   description: 'HEX BOLT M16 X 75 GR 8.8 GALV', cpse: 'NTPC', potentialDuplicates: 4 },
      ];

  const handleExecuteAction = (sourceCode: string, targetCnmc: string) => {
    openImpactModal({
      action: selectedAction,
      title: `Confirm Catalog Operation: ${selectedAction}`,
      sourceCode,
      targetCnmc,
      impactedCount: 4,
      onConfirm: () => {
        addAuditLog({
          action: `Catalog Consolidation: ${selectedAction}`,
          description: `Applied ${selectedAction} to ${sourceCode} → ${targetCnmc}. Aliases and cross-links generated.`,
          user: { name: 'A. Kumar', role: 'Catalog Committee Steward', initials: 'AK' },
          targetEntity: sourceCode,
        });
        addToast('success', `${selectedAction} executed on ${sourceCode}. Cross-references updated.`);
      },
    });
  };

  const meta = ACTION_META[selectedAction];

  return (
    <main className="flex-1 overflow-y-auto p-6 space-y-5" style={{ background: 'var(--bg)' }}>
      {/* Header */}
      <div>
        <h2 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
          Catalog Rationalization &amp; Migration
        </h2>
        <p className="text-sm mt-0.5" style={{ color: 'var(--text-secondary)' }}>
          Safe, staged workflow: Select action → Review candidates → Confirm impacts → Execute.
        </p>
      </div>

      {/* 6 Action type cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {(Object.keys(ACTION_META) as ActionType[]).map(action => {
          const isSelected = selectedAction === action;
          const m = ACTION_META[action];
          return (
            <button
              key={action}
              onClick={() => setSelectedAction(action)}
              className="p-4 rounded-xl text-left flex flex-col gap-2 transition-all hover:brightness-105"
              style={{
                background: isSelected ? 'var(--blue-dim)' : 'var(--bg-card)',
                border: `1px solid ${isSelected ? 'var(--blue)' : 'var(--border)'}`,
              }}
            >
              <div className="flex justify-between items-center">
                <span className="font-mono text-sm font-bold" style={{ color: isSelected ? 'var(--blue)' : 'var(--text-primary)' }}>
                  {action}
                </span>
                <span className="material-symbols-outlined text-[18px]" style={{ color: isSelected ? 'var(--blue)' : 'var(--text-muted)' }}>
                  {m.icon}
                </span>
              </div>
              <span className="text-xs" style={{ color: isSelected ? 'var(--blue)' : 'var(--text-secondary)' }}>
                {m.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Selected action description */}
      <div
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-xl"
        style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
      >
        <div className="flex items-start gap-3">
          <span className="material-symbols-outlined icon-fill text-[22px] mt-0.5" style={{ color: 'var(--blue)' }}>
            {meta.icon}
          </span>
          <div>
            <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
              Operation: {selectedAction} — {meta.label}
            </p>
            <p className="text-sm mt-0.5" style={{ color: 'var(--text-secondary)' }}>{meta.desc}</p>
          </div>
        </div>
        <span
          className="text-xs font-mono px-3 py-1.5 rounded shrink-0"
          style={{ background: 'var(--bg-hover)', color: 'var(--text-muted)', border: '1px solid var(--border)' }}
        >
          Review → Confirm → Execute
        </span>
      </div>

      {/* Candidates table */}
      <div className="rounded-xl overflow-hidden" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
        <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid var(--border)' }}>
          <div>
            <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
              Candidates Ready for {selectedAction}
            </h3>
            <p className="text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>
              Review each item before applying changes to the live master
            </p>
          </div>
          <span className="text-sm font-mono" style={{ color: 'var(--text-muted)' }}>
            {candidates.length} items queued
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                {['Source Code & CPSE', 'Target CNMC', 'Description', 'Duplicates', ''].map(h => (
                  <th key={h} className="px-5 py-3 text-xs font-semibold uppercase tracking-wide"
                    style={{ color: 'var(--text-muted)' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {candidates.map(row => (
                <tr key={row.sourceCode} className="transition-colors hover:opacity-90"
                  style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                  <td className="px-5 py-4">
                    <span className="text-sm font-bold font-mono block" style={{ color: 'var(--blue)' }}>{row.sourceCode}</span>
                    <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{row.cpse}</span>
                  </td>
                  <td className="px-5 py-4 text-sm font-mono font-semibold" style={{ color: 'var(--text-primary)' }}>
                    {row.targetCnmc}
                  </td>
                  <td className="px-5 py-4 text-sm max-w-xs truncate" style={{ color: 'var(--text-secondary)' }}
                    title={row.description}>
                    {row.description}
                  </td>
                  <td className="px-5 py-4 text-center">
                    <span className="px-2.5 py-1 rounded text-xs font-mono font-semibold"
                      style={{ background: 'var(--bg-hover)', color: 'var(--warning)' }}>
                      {row.potentialDuplicates} items
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <button
                      onClick={() => handleExecuteAction(row.sourceCode, row.targetCnmc)}
                      className="px-4 py-2 rounded-lg text-sm font-semibold hover:brightness-110 transition-all"
                      style={{ background: 'var(--blue)', color: '#fff' }}
                    >
                      Review &amp; Confirm
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
};
