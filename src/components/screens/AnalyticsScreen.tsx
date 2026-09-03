import React from 'react';
import { useApp } from '../../context/AppContext';

export const AnalyticsScreen: React.FC = () => {
  const { cpseList } = useApp();

  return (
    <main className="flex-1 overflow-y-auto p-6 bg-background space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-base font-bold text-on-surface tracking-tight">
          National Material Analytics & Savings
        </h1>
        <p className="text-xs text-on-surface-variant mt-0.5">
          Measurable procurement impact, catalog reduction metrics, and CPSE harmonization performance.
        </p>
      </div>

      {/* KPI Stats with Clear Contextual Explanations */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-surface-container p-5 rounded-xl border border-outline-variant/60 card-interactive">
          <p className="text-on-surface-variant text-[11px] font-medium uppercase mb-1">
            Estimated Annual Procurement Savings
          </p>
          <h2 className="font-mono text-2xl font-bold text-primary">₹ 4,820 Cr</h2>
          <p className="text-xs text-status-success mt-1.5 flex items-center font-mono">
            <span className="material-symbols-outlined text-[15px] mr-1">trending_up</span>
            Via bulk cross-CPSE procurement pooling
          </p>
          <p className="text-[11px] text-on-surface-variant mt-2.5 border-t border-outline-variant/40 pt-2.5 leading-relaxed">
            Achieved by combining identical RFQs across ONGC, IOCL, and GAIL for common piping and valves.
          </p>
        </div>

        <div className="bg-surface-container p-5 rounded-xl border border-outline-variant/60 card-interactive">
          <p className="text-on-surface-variant text-[11px] font-medium uppercase mb-1">
            Catalog Redundancy Reduced
          </p>
          <h2 className="font-mono text-2xl font-bold text-relationship-duplicate">68.2%</h2>
          <p className="text-xs text-on-surface mt-1.5 font-mono">
            From 14.2M local codes to 3.1M canonical masters
          </p>
          <p className="text-[11px] text-on-surface-variant mt-2.5 border-t border-outline-variant/40 pt-2.5 leading-relaxed">
            Eliminates duplicate inventory holding and duplicate vendor registrations across enterprises.
          </p>
        </div>

        <div className="bg-surface-container p-5 rounded-xl border border-outline-variant/60 card-interactive">
          <p className="text-on-surface-variant text-[11px] font-medium uppercase mb-1">
            Cross-CPSE Interoperability
          </p>
          <h2 className="font-mono text-2xl font-bold text-status-success">91.4%</h2>
          <p className="text-xs text-status-success mt-1.5 font-mono">
            Standard taxonomy alignment score
          </p>
          <p className="text-[11px] text-on-surface-variant mt-2.5 border-t border-outline-variant/40 pt-2.5 leading-relaxed">
            Enables immediate emergency spare part transfers between refineries and offshore platforms.
          </p>
        </div>
      </div>

      {/* CPSE Breakdown Table */}
      <div className="bg-surface-container rounded-xl border border-outline-variant/60 p-5">
        <div className="flex justify-between items-center mb-1">
          <h3 className="text-xs font-semibold text-on-surface uppercase flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[17px]">bar_chart</span>
            CPSE Harmonization & Interoperability Index
          </h3>
          <span className="text-xs font-mono text-on-surface-variant">Live Pipeline Status</span>
        </div>
        <p className="text-[11px] text-on-surface-variant mb-4">
          Breakdown of legacy catalog records harmonized into the national standard per public enterprise
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-surface-container-high border-b border-outline-variant/50 text-on-surface-variant text-[11px] font-medium">
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
            <tbody className="divide-y divide-outline-variant/30 font-mono text-xs">
              {cpseList.map((cpse) => (
                <tr key={cpse.id} className="hover:bg-surface-container-high/40 transition-colors">
                  <td className="p-3 font-medium text-on-surface flex items-center gap-2 font-sans">
                    <span className="w-6 h-6 rounded-md bg-surface-container-highest border border-outline-variant/60 flex items-center justify-center text-[10px] font-bold text-primary font-mono">
                      {cpse.name[0]}
                    </span>
                    {cpse.fullName}
                  </td>
                  <td className="p-3 text-on-surface-variant font-sans">{cpse.sector}</td>
                  <td className="p-3 text-right text-on-surface">{cpse.totalRecords.toLocaleString()}</td>
                  <td className="p-3 text-right text-primary font-semibold">{cpse.mappedRecords.toLocaleString()}</td>
                  <td className="p-3 text-right text-status-warning">{cpse.pendingRecords.toLocaleString()}</td>
                  <td className="p-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <span className="font-semibold text-on-surface">{cpse.coveragePercentage}%</span>
                      <div className="w-12 bg-surface-container-high h-1.5 rounded-full overflow-hidden">
                        <div 
                          className="bg-primary h-full rounded-full" 
                          style={{ width: `${cpse.coveragePercentage}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="p-3 text-center font-sans">
                    <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-status-success/10 text-status-success">
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
