import React from 'react';
import { useApp } from '../../context/AppContext';

export const AnalyticsScreen: React.FC = () => {
  const { cpseList } = useApp();

  return (
    <main className="flex-1 overflow-y-auto p-margin-page bg-background transition-colors duration-200 space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-headline-section text-headline-section text-on-surface font-bold">
          National Material Analytics & Savings
        </h1>
        <p className="text-xs text-on-surface-variant mt-0.5">
          Measurable procurement impact, catalog reduction metrics, and CPSE harmonization performance.
        </p>
      </div>

      {/* KPI Stats with Clear Contextual Explanations */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-gutter">
        <div className="bg-surface-container p-5 rounded-2xl border border-outline-variant/40 shadow-sm card-interactive">
          <p className="font-label-caps text-on-surface-variant text-[10px] uppercase mb-1">
            Estimated Annual Procurement Savings
          </p>
          <h2 className="font-display-cnmc text-2xl font-bold text-primary">₹ 4,820 Cr</h2>
          <p className="text-xs text-status-success mt-1.5 flex items-center font-data-mono">
            <span className="material-symbols-outlined text-sm mr-1">trending_up</span>
            Via bulk cross-CPSE procurement pooling
          </p>
          <p className="text-[11px] text-on-surface-variant mt-2 border-t border-outline-variant/30 pt-2">
            Achieved by combining identical RFQs across ONGC, IOCL, and GAIL for common piping and valves.
          </p>
        </div>

        <div className="bg-surface-container p-5 rounded-2xl border border-outline-variant/40 shadow-sm card-interactive">
          <p className="font-label-caps text-on-surface-variant text-[10px] uppercase mb-1">
            Catalog Redundancy Reduced
          </p>
          <h2 className="font-display-cnmc text-2xl font-bold text-relationship-duplicate">68.2%</h2>
          <p className="text-xs text-on-surface mt-1.5 font-data-mono">
            From 14.2M local codes to 3.1M canonical masters
          </p>
          <p className="text-[11px] text-on-surface-variant mt-2 border-t border-outline-variant/30 pt-2">
            Eliminates duplicate inventory holding and duplicate vendor registrations across enterprises.
          </p>
        </div>

        <div className="bg-surface-container p-5 rounded-2xl border border-outline-variant/40 shadow-sm card-interactive">
          <p className="font-label-caps text-on-surface-variant text-[10px] uppercase mb-1">
            Cross-CPSE Interoperability
          </p>
          <h2 className="font-display-cnmc text-2xl font-bold text-relationship-identical">91.4%</h2>
          <p className="text-xs text-status-success mt-1.5 font-data-mono">
            Standard taxonomy alignment score
          </p>
          <p className="text-[11px] text-on-surface-variant mt-2 border-t border-outline-variant/30 pt-2">
            Enables immediate emergency spare part transfers between refineries and offshore platforms.
          </p>
        </div>
      </div>

      {/* CPSE Breakdown Table */}
      <div className="bg-surface-container rounded-2xl border border-outline-variant/40 p-5 shadow-sm">
        <div className="flex justify-between items-center mb-1">
          <h3 className="font-headline-section text-sm font-bold text-on-surface uppercase flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[18px]">bar_chart</span>
            CPSE Harmonization & Interoperability Index
          </h3>
          <span className="text-xs font-data-mono text-on-surface-variant">Live Pipeline Status</span>
        </div>
        <p className="text-[11px] text-on-surface-variant mb-4">
          Breakdown of legacy catalog records harmonized into the national standard per public enterprise
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-surface-container-high border-b border-outline-variant/40 font-table-header text-[11px] text-on-surface-variant">
              <tr>
                <th className="p-3">CPSE Entity</th>
                <th className="p-3">Sector</th>
                <th className="p-3 text-right">Source Records</th>
                <th className="p-3 text-right">Harmonized CNMC</th>
                <th className="p-3 text-right">Pending Review</th>
                <th className="p-3 text-right">Coverage %</th>
                <th className="p-3 text-center">Connection Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/20 font-data-mono text-xs">
              {cpseList.map((cpse) => (
                <tr key={cpse.id} className="hover:bg-surface-container-high/60 transition-colors">
                  <td className="p-3 font-semibold text-on-surface flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-surface-container-highest border border-outline-variant flex items-center justify-center text-[10px] font-bold text-primary">
                      {cpse.name[0]}
                    </span>
                    {cpse.fullName}
                  </td>
                  <td className="p-3 text-on-surface-variant">{cpse.sector}</td>
                  <td className="p-3 text-right text-on-surface">{cpse.totalRecords.toLocaleString()}</td>
                  <td className="p-3 text-right text-primary font-bold">{cpse.mappedRecords.toLocaleString()}</td>
                  <td className="p-3 text-right text-status-warning">{cpse.pendingRecords.toLocaleString()}</td>
                  <td className="p-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <span className="font-bold text-on-surface">{cpse.coveragePercentage}%</span>
                      <div className="w-12 bg-surface-container-high h-1.5 rounded-full overflow-hidden">
                        <div 
                          className="bg-primary h-full rounded-full" 
                          style={{ width: `${cpse.coveragePercentage}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="p-3 text-center">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-status-success/15 text-status-success border border-status-success/30">
                      Active Sync
                    </span>
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
