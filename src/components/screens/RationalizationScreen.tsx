import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

export const RationalizationScreen: React.FC = () => {
  const { rationalizationActions, openImpactModal, addAuditLog } = useApp();
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
      title: `Execute Rationalization: ${selectedAction}`,
      sourceCode,
      targetCnmc,
      impactedCount: 4,
      onConfirm: () => {
        addAuditLog({
          action: `Rationalization Action: ${selectedAction}`,
          description: `Applied ${selectedAction} to local code ${sourceCode} targeting canonical ${targetCnmc}. Forward aliases generated.`,
          user: {
            name: 'A. Kumar',
            role: 'Lead Data Steward',
            initials: 'AK'
          },
          targetEntity: sourceCode
        });
        setSuccessNotice(`Action ${selectedAction} successfully committed on ${sourceCode}.`);
        setTimeout(() => setSuccessNotice(null), 4000);
      }
    });
  };

  return (
    <main className="flex-1 overflow-y-auto p-margin-page bg-background transition-colors duration-200 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h1 className="font-headline-section text-headline-section text-on-surface font-bold">
            Rationalization & Migration
          </h1>
          <p className="font-data-mono text-xs text-on-surface-variant mt-0.5">
            Material consolidation, duplicate pruning, and migration governance across CPSEs
          </p>
        </div>

        {successNotice && (
          <div className="px-3.5 py-1.5 bg-primary/10 border border-primary/30 text-primary text-xs rounded-xl font-data-mono flex items-center animate-in fade-in">
            <span className="material-symbols-outlined text-sm mr-1.5">check_circle</span>
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
              className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between h-24 ${
                isSelected
                  ? 'bg-primary-container/20 border-primary shadow-sm'
                  : 'bg-surface-container border-outline-variant/40 hover:border-outline-variant/80'
              }`}
            >
              <div className="flex justify-between items-center w-full">
                <span className={`font-data-mono text-xs font-bold ${isSelected ? 'text-primary' : 'text-on-surface'}`}>
                  {action}
                </span>
                <span className={`material-symbols-outlined text-[18px] ${isSelected ? 'text-primary' : 'text-on-surface-variant'}`}>
                  {action === 'MAP' ? 'link' : action === 'MERGE' ? 'merge' : action === 'RETIRE' ? 'delete_forever' : action === 'SPLIT' ? 'call_split' : action === 'RETAIN' ? 'lock' : 'rate_review'}
                </span>
              </div>
              <p className="font-data-mono text-[10px] text-on-surface-variant">
                {action === 'MAP' ? 'Associate to CNMC' : action === 'MERGE' ? 'Prune duplicate' : action === 'RETIRE' ? 'Deprecate item' : action === 'SPLIT' ? 'Diverge variant' : action === 'RETAIN' ? 'Preserve unique' : 'Manual inspection'}
              </p>
            </button>
          );
        })}
      </div>

      {/* Progress Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-gutter">
        {rationalizationActions.map((action) => (
          <div key={action.id} className="bg-surface-container border border-outline-variant/40 rounded-2xl p-5 shadow-sm">
            <div className="flex justify-between items-center mb-2">
              <span className="font-body-bold text-sm text-on-surface">{action.title}</span>
              <span className="font-data-mono text-sm text-primary font-bold">{action.percentage}%</span>
            </div>
            <div className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden mb-3">
              <div 
                className="bg-primary h-full transition-all duration-500 rounded-full" 
                style={{ width: `${action.percentage}%` }}
              />
            </div>
            <p className="text-xs text-on-surface-variant leading-relaxed mb-2">
              {action.description}
            </p>
            <span className="font-data-mono text-[11px] text-primary block text-right font-medium">
              {action.recordCount} completed
            </span>
          </div>
        ))}
      </div>

      {/* Interactive Rationalization Console */}
      <div className="bg-surface-container border border-outline-variant/40 rounded-2xl p-5 shadow-sm">
        <h3 className="font-headline-section text-sm font-bold text-on-surface uppercase mb-3 flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-[18px]">terminal</span>
          Rationalization Workbench: Apply {selectedAction} to Target Records
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-surface-container-high border-b border-outline-variant/40 font-table-header text-[11px] text-on-surface-variant">
              <tr>
                <th className="p-3">Source CPSE & Code</th>
                <th className="p-3">Local Raw Description</th>
                <th className="p-3">Target National Canonical</th>
                <th className="p-3 text-center">Duplicate Codes</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/20 font-data-mono">
              {sampleTargets.map((item) => (
                <tr key={item.sourceCode} className="hover:bg-surface-container-high/60 transition-colors">
                  <td className="p-3">
                    <span className="text-primary font-semibold">{item.sourceCode}</span>
                    <span className="text-on-surface-variant block text-[10px]">{item.cpse}</span>
                  </td>
                  <td className="p-3 text-on-surface font-sans max-w-xs truncate">{item.description}</td>
                  <td className="p-3 text-primary font-semibold">{item.targetCnmc}</td>
                  <td className="p-3 text-center">
                    <span className="px-2 py-0.5 rounded bg-surface-container-low text-relationship-near border border-relationship-near/30 font-bold">
                      {item.potentialDuplicates} items
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => handleExecuteAction(item.sourceCode, item.targetCnmc)}
                      className="px-3.5 py-1.5 bg-primary text-on-primary rounded-xl font-body-bold text-xs hover:brightness-110 transition-all shadow-sm"
                    >
                      Execute {selectedAction}
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
