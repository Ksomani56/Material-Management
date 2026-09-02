import React from 'react';
import { useApp } from '../../context/AppContext';

export const AnalyticsScreen: React.FC = () => {
  const { cpseList } = useApp();

  return (
    <main className="flex-1 overflow-y-auto p-margin-page bg-background transition-colors duration-200 space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-headline-section text-headline-section text-on-surface font-bold">
          National Material Analytics & Intelligence
        </h1>
        <p className="font-data-mono text-xs text-on-surface-variant mt-0.5">
          System-wide procurement harmonization, redundancy reduction, and financial optimization
        </p>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-gutter">
        <div className="bg-surface-container p-5 rounded-2xl border border-outline-variant/40 shadow-sm card-interactive">
          <p className="font-label-caps text-on-surface-variant text-[10px] uppercase mb-1">Estimated Annual Procurement Savings</p>
          <h2 className="font-display-cnmc text-2xl font-bold text-primary">₹ 4,820 Cr</h2>
          <p className="font-data-mono text-xs text-status-success mt-1 flex items-center">
            <span className="material-symbols-outlined text-sm mr-1">trending_up</span>
            Via bulk cross-CPSE procurement pooling
          </p>
        </div>

        <div className="bg-surface-container p-5 rounded-2xl border border-outline-variant/40 shadow-sm card-interactive">
          <p className="font-label-caps text-on-surface-variant text-[10px] uppercase mb-1">Catalog Redundancy Reduced</p>
          <h2 className="font-display-cnmc text-2xl font-bold text-relationship-duplicate">68.2%</h2>
          <p className="font-data-mono text-xs text-on-surface-variant mt-1">
            From 14.2M local codes to 3.1M canonical items
          </p>
        </div>

        <div className="bg-surface-container p-5 rounded-2xl border border-outline-variant/40 shadow-sm card-interactive">
          <p className="font-label-caps text-on-surface-variant text-[10px] uppercase mb-1">Cross-CPSE Interoperability</p>
          <h2 className="font-display-cnmc text-2xl font-bold text-relationship-identical">91.4%</h2>
          <p className="font-data-mono text-xs text-status-success mt-1">
            Standard taxonomy alignment score
          </p>
        </div>
      </div>

      {/* CPSE Breakdown Table */}
      <div className="bg-surface-container rounded-2xl border border-outline-variant/40 p-5 shadow-sm">
        <h3 className="font-headline-section text-sm font-bold text-on-surface uppercase mb-3 flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-[18px]">bar_chart</span>
          CPSE Material Efficiency Matrix
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-surface-container-high border-b border-outline-variant/40 font-table-header text-[11px] text-on-surface-variant">
              <tr>
                <th className="p-3">CPSE Entity</th>
                <th className="p-3">Sector</th>
                <th className="p-3 text-right">Source Records</th>
                <th className="p-3 text-right">Harmonized CNMC</th>
                <th className="p-3 text-right">Duplicates Pruned</th>
                <th className="p-3 text-right">Coverage</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/20 font-data-mono">
              {cpseList.map((c) => {
                const duplicatesPruned = Math.round(c.mappedRecords * 0.38);
                return (
                  <tr key={c.id} className="hover:bg-surface-container-high/60 transition-colors">
                    <td className="p-3 font-semibold text-primary">{c.name}</td>
                    <td className="p-3 font-sans text-on-surface">{c.sector}</td>
                    <td className="p-3 text-right">{c.totalRecords.toLocaleString()}</td>
                    <td className="p-3 text-right text-status-success">{c.mappedRecords.toLocaleString()}</td>
                    <td className="p-3 text-right text-relationship-duplicate">{duplicatesPruned.toLocaleString()}</td>
                    <td className="p-3 text-right font-bold text-on-surface">{c.coveragePercentage}%</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
};
