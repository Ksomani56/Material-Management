import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

export const RationalizationScreen: React.FC = () => {
  const { openImpactModal, addAuditLog } = useApp();
  const [selectedAction, setSelectedAction] = useState<'MAP' | 'MERGE' | 'RETIRE' | 'REVIEW' | 'SPLIT' | 'RETAIN'>('MERGE');
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  const sampleTargets = [
    { sourceCode: 'ONGC-VLV-009', targetCnmc: 'CNMC-00018427', description: '6 IN BALL VALVE CLASS 300 A105', cpse: 'ONGC', potentialDuplicates: 3 },
    { sourceCode: 'IOCL-PMP-104', targetCnmc: 'CNMC-883210', description: 'CENTRIFUGAL PUMP 50M3/HR 120M HEAD CS', cpse: 'IOCL', potentialDuplicates: 2 },
    { sourceCode: 'NTPC-FST-881', targetCnmc: 'CNMC-110482', description: 'HEX BOLT M16 X 75 GR 8.8 GALV', cpse: 'NTPC', potentialDuplicates: 4 },
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
          description: `Applied ${selectedAction} operation to source item ${sourceCode} targeting canonical ${targetCnmc}. Aliases and cross-links generated.`,
          user: {
            name: 'A. Kumar',
            role: 'Catalog Committee Steward',
            initials: 'AK'
          },
          targetEntity: sourceCode
        });
        setSuccessNotice(`Action ${selectedAction} successfully executed on ${sourceCode}. Forward cross-references updated.`);
        setTimeout(() => setSuccessNotice(null), 4000);
      }
    });
  };

  return (
    <main className="flex-1 overflow-y-auto p-6 bg-background space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h1 className="text-base font-bold text-on-surface tracking-tight">
            Catalog Rationalization & Migration
          </h1>
          <p className="text-xs text-on-surface-variant mt-0.5">
            Safe, staged workflow: Review items → Confirm impacts → Consolidate duplicate catalog entries.
          </p>
        </div>

        {successNotice && (
          <div className="px-3 py-1.5 bg-primary/10 border border-primary/30 text-primary text-xs rounded-lg font-mono flex items-center">
            <span className="material-symbols-outlined text-[15px] mr-1.5">check_circle</span>
            {successNotice}
          </div>
        )}
      </div>

      {/* 6 Rationalization Actions Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {(['MAP', 'MERGE', 'RETIRE', 'REVIEW', 'SPLIT', 'RETAIN'] as const).map((action) => {
          const isSelected = selectedAction === action;
          return (
            <button
              key={action}
              onClick={() => setSelectedAction(action)}
              className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between h-22 ${
                isSelected
                  ? 'bg-primary/10 border-primary'
                  : 'bg-surface-container border-outline-variant/60 hover:border-outline'
              }`}
            >
              <div className="flex justify-between items-center w-full">
                <span className={`font-mono text-xs font-bold ${isSelected ? 'text-primary' : 'text-on-surface'}`}>
                  {action}
                </span>
                <span className="material-symbols-outlined text-[16px] text-on-surface-variant">
                  {action === 'MAP' ? 'link' : action === 'MERGE' ? 'call_merge' : action === 'RETIRE' ? 'archive' : 'tune'}
                </span>
              </div>
              <span className="text-[11px] text-on-surface-variant">
                {action === 'MAP' && 'Link to Master'}
                {action === 'MERGE' && 'Combine Duplicates'}
                {action === 'RETIRE' && 'Deactivate Obsolete'}
                {action === 'REVIEW' && 'Manual Check'}
                {action === 'SPLIT' && 'Divergent Specs'}
                {action === 'RETAIN' && 'Keep As-Is'}
              </span>
            </button>
          );
        })}
      </div>

      {/* Action Description Banner */}
      <div className="p-4 bg-surface-container rounded-xl border border-outline-variant/60 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h3 className="text-xs font-semibold text-on-surface flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[17px]">verified</span>
            Operation: {selectedAction}
          </h3>
          <p className="text-xs text-on-surface-variant mt-0.5">
            {selectedAction === 'MERGE' && 'Safely merges identical source records into a single Common National Material Code (CNMC) with full traceability.'}
            {selectedAction === 'MAP' && 'Creates a bi-directional cross-reference alias between legacy CPSE items and the national master.'}
            {selectedAction === 'RETIRE' && 'Marks obsolete, deprecated, or superseded materials as retired with automatic replacement forwarding.'}
            {selectedAction === 'REVIEW' && 'Routes ambiguous attribute conflicts to the technical committee for physical inspection.'}
            {selectedAction === 'SPLIT' && 'Partitions overloaded legacy item descriptions into discrete standardized materials.'}
            {selectedAction === 'RETAIN' && 'Protects specialized local inventory codes that do not require national standardization.'}
          </p>
        </div>
        <span className="text-xs font-mono text-on-surface-variant bg-surface-container-low px-2.5 py-1 rounded-md border border-outline-variant/50 shrink-0">
          Staged Workflow: Review → Confirm → Execute
        </span>
      </div>

      {/* Migration Workbench Candidates Table */}
      <div className="bg-surface-container rounded-xl border border-outline-variant/60 overflow-hidden">
        <div className="p-4 border-b border-outline-variant/50 bg-surface-container flex justify-between items-center">
          <div>
            <h3 className="text-xs font-semibold text-on-surface">
              Candidates Ready for {selectedAction}
            </h3>
            <p className="text-[11px] text-on-surface-variant">Review each item before applying changes to the live master</p>
          </div>
          <span className="font-mono text-xs text-on-surface-variant">
            {sampleTargets.length} Items Queued
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse font-mono">
            <thead className="bg-surface-container-high border-b border-outline-variant/50 text-on-surface-variant text-[11px] font-medium">
              <tr>
                <th className="p-3">Source Code & CPSE</th>
                <th className="p-3">Target National Master (CNMC)</th>
                <th className="p-3">Material Description</th>
                <th className="p-3 text-center">Duplicates Detected</th>
                <th className="p-3 text-right">Action Workflow</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/30">
              {sampleTargets.map((row) => (
                <tr key={row.sourceCode} className="hover:bg-surface-container-high/40 transition-colors">
                  <td className="p-3">
                    <span className="font-bold text-primary block">{row.sourceCode}</span>
                    <span className="text-[10px] text-on-surface-variant font-sans">{row.cpse}</span>
                  </td>
                  <td className="p-3 text-on-surface font-semibold">
                    {row.targetCnmc}
                  </td>
                  <td className="p-3 font-sans text-on-surface-variant max-w-sm truncate" title={row.description}>
                    {row.description}
                  </td>
                  <td className="p-3 text-center">
                    <span className="px-2 py-0.5 rounded bg-surface-container-high text-on-surface font-mono text-[11px]">
                      {row.potentialDuplicates} items
                    </span>
                  </td>
                  <td className="p-3 text-right font-sans">
                    <button
                      onClick={() => handleExecuteAction(row.sourceCode, row.targetCnmc)}
                      className="px-3 py-1.5 bg-primary text-on-primary font-semibold text-xs rounded-lg hover:brightness-110 transition-all"
                    >
                      Review & Confirm
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
