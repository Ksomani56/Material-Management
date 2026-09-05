import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { DateRangePicker } from '../common/DateRangePicker';
import { ScreenFooter } from '../common/FooterLegalModal';

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
  const { openImpactModal, addAuditLog, addToast, setActiveScreen, reviewQueue, nationalAnalytics } = useApp();
  const [selectedAction, setSelectedAction] = useState<ActionType>('MERGE');

  const duplicateClusters = nationalAnalytics?.total_equivalence_groups || reviewQueue.length || 129;
  const skuReduction = nationalAnalytics?.deduplication_ratio_pct ? `${nationalAnalytics.deduplication_ratio_pct}%` : '98.8%';
  const capitalUnlocked = nationalAnalytics?.estimated_synergy_savings 
    ? `₹${(nationalAnalytics.estimated_synergy_savings / 10000000).toFixed(2)} Cr`
    : '₹2.84 Cr';

  const candidateTargets = React.useMemo(() => {
    if (reviewQueue && reviewQueue.length > 0) {
      return reviewQueue.slice(0, 10).map(item => ({
        sourceCode: item.sourceCode,
        targetCnmc: item.candidateCnmc,
        description: item.sourceDescription,
        cpse: item.sourceCpse,
        potentialDuplicates: 2,
      }));
    }
    return [];
  }, [reviewQueue]);

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
          <span className="text-[#F3F4F6]">Rationalization & Migration</span>
        </div>

        <DateRangePicker />
      </div>

      {/* 2. Page Title Block */}
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-white font-sans">
          Catalog Rationalization & Migration
        </h1>
        <p className="text-xs md:text-sm text-[#9CA3AF] leading-relaxed max-w-4xl">
          Safe, staged SKU consolidation workflow: select operational mode, review cross-enterprise merge candidates, verify dependencies, and execute.
        </p>
      </div>

      {/* 3. Hero Split Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-1">
        <div className="lg:col-span-7 space-y-2">
          <h2 className="text-sm font-semibold text-[#F3F4F6] tracking-normal font-sans">
            Redundant SKU Elimination
          </h2>
          <p className="text-xs text-[#9CA3AF] leading-relaxed font-sans">
            Centralized consolidation preserves ERP historical purchase orders while mapping multiple redundant local codes to a single authoritative CNMC. This eliminates duplicate safety stock and enables pooling across regional depots.
          </p>
        </div>

        <div className="lg:col-span-5 grid grid-cols-3 gap-4 pt-1">
          <div>
            <div className="text-2xl lg:text-3xl font-bold font-sans text-white tracking-tight">
              {duplicateClusters}
            </div>
            <div className="text-xs font-semibold text-[#F3F4F6] mt-1 leading-tight">
              Duplicate Clusters
            </div>
            <div className="text-[11px] text-[#6B7280] leading-snug">
              Ready for merge
            </div>
          </div>

          <div>
            <div className="text-2xl lg:text-3xl font-bold font-sans text-[#10B981] tracking-tight">
              {skuReduction}
            </div>
            <div className="text-xs font-semibold text-[#F3F4F6] mt-1 leading-tight">
              SKU Reduction
            </div>
            <div className="text-[11px] text-[#6B7280] leading-snug">
              Deduplication Rate
            </div>
          </div>

          <div>
            <div className="text-2xl lg:text-3xl font-bold font-sans text-[#22D3EE] tracking-tight">
              {capitalUnlocked}
            </div>
            <div className="text-xs font-semibold text-[#F3F4F6] mt-1 leading-tight">
              Holding Capital
            </div>
            <div className="text-[11px] text-[#6B7280] leading-snug">
              Projected Synergy
            </div>
          </div>
        </div>
      </div>

      {/* 4. 6 Action Type Selection Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {(Object.keys(ACTION_META) as ActionType[]).map(action => {
          const isSelected = selectedAction === action;
          const m = ACTION_META[action];
          return (
            <button
              key={action}
              onClick={() => setSelectedAction(action)}
              className={`p-3.5 rounded-xl text-left flex flex-col gap-1.5 transition-all ${
                isSelected
                  ? 'bg-[#10B981]/10 border border-[#10B981]'
                  : 'bg-[#0C0E0D] border border-[#232825] hover:border-[#38423C]'
              }`}
            >
              <div className="flex justify-between items-center">
                <span className={`font-mono text-xs font-bold ${isSelected ? 'text-[#10B981]' : 'text-white'}`}>
                  {action}
                </span>
                <span className={`material-symbols-outlined text-[18px] ${isSelected ? 'text-[#10B981]' : 'text-[#9CA3AF]'}`}>
                  {m.icon}
                </span>
              </div>
              <span className={`text-[11px] font-medium leading-tight ${isSelected ? 'text-[#F3F4F6]' : 'text-[#9CA3AF]'}`}>
                {m.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Selected Action Description Banner */}
      <div className="p-4 rounded-xl bg-[#0C0E0D] border border-[#232825] flex items-center gap-3">
        <span className="material-symbols-outlined text-[20px] text-[#10B981]">
          {meta.icon}
        </span>
        <div className="text-xs">
          <span className="font-semibold text-white mr-2">Operation: {selectedAction} — {meta.label}:</span>
          <span className="text-[#9CA3AF]">{meta.desc}</span>
        </div>
      </div>

      {/* 5. Candidate Materials Table */}
      <div className="bg-[#0C0E0D] border border-[#232825] rounded-xl overflow-hidden">
        <div className="p-5 border-b border-[#232825] flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-white font-sans">
              Candidates for {selectedAction} Operation
            </h3>
            <p className="text-xs text-[#9CA3AF] mt-0.5">
              Review impact scope before executing catalog mutation
            </p>
          </div>
          <span className="text-xs font-mono px-2.5 py-0.5 rounded bg-[#161B18] text-[#9CA3AF] border border-[#232825]">
            {candidateTargets.length} Candidates Pending
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#232825] text-[10px] uppercase font-semibold text-[#6B7280]">
                <th className="px-5 py-3 font-medium">Source Item (CPSE)</th>
                <th className="px-5 py-3 font-medium">Target National CNMC</th>
                <th className="px-5 py-3 font-medium">Description</th>
                <th className="px-5 py-3 font-medium text-center">Cluster Duplicates</th>
                <th className="px-5 py-3 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1B201D]">
              {candidateTargets.map((item, idx) => (
                <tr key={idx} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-[#10B981]">
                        {item.sourceCode}
                      </span>
                      <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-[#161B18] text-[#9CA3AF] border border-[#232825]">
                        {item.cpse}
                      </span>
                    </div>
                  </td>

                  <td className="px-5 py-4 font-mono text-xs font-bold text-[#22D3EE]">
                    {item.targetCnmc}
                  </td>

                  <td className="px-5 py-4 text-xs text-[#F3F4F6] max-w-sm truncate">
                    {item.description}
                  </td>

                  <td className="px-5 py-4 text-center font-mono font-semibold text-white">
                    {item.potentialDuplicates} records
                  </td>

                  <td className="px-5 py-4 text-right">
                    <button
                      onClick={() => handleExecuteAction(item.sourceCode, item.targetCnmc)}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#10B981] text-[#000000] hover:brightness-110 transition-all shadow-sm"
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

      {/* 6. Footer */}
      <ScreenFooter />
    </main>
  );
};
