import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  mockDashboardKPIs,
  mockMappingHealthTrend,
  mockDuplicateCandidatesTable
} from '../../data/mockData';

export const OverviewScreen: React.FC = () => {
  const { setActiveScreen, reviewQueue, cpseList, rationalizationActions, openUploadModal } = useApp();

  return (
    <main className="flex-1 overflow-y-auto p-6 bg-background space-y-6">
      {/* Page Title & Subtitle */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h1 className="text-base font-bold text-on-surface tracking-tight">
            National Material Master Overview
          </h1>
          <p className="text-xs text-on-surface-variant mt-0.5">
            Real-time catalog performance, CPSE harmonization metrics, and pending cataloger actions.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => openUploadModal('ONGC')}
            className="px-3 py-1.5 bg-surface-container hover:bg-surface-container-high border border-outline-variant/60 text-on-surface rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors"
          >
            <span className="material-symbols-outlined text-[15px] text-primary">upload_file</span>
            Import Dataset
          </button>
          <button
            onClick={() => setActiveScreen('review')}
            className="px-3 py-1.5 bg-primary text-on-primary rounded-lg text-xs font-semibold hover:brightness-110 transition-all flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[15px]">fact_check</span>
            Review Queue ({reviewQueue.length > 0 ? reviewQueue.length : 12405})
          </button>
        </div>
      </div>

      {/* KPI Row (4 Cards with What + Value + Short Context + Next Action) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1 */}
        <div className="bg-surface-container rounded-xl p-4 border border-outline-variant/60 flex flex-col justify-between card-interactive">
          <div>
            <div className="flex justify-between items-start mb-1">
              <span className="text-[11px] font-medium text-on-surface-variant">
                Total Source Records
              </span>
              <span className="material-symbols-outlined text-on-surface-variant text-[17px]">dataset</span>
            </div>
            <h2 className="font-mono text-2xl font-bold text-on-surface mt-1">
              {mockDashboardKPIs.totalSourceCodes}
            </h2>
            <p className="text-xs text-on-surface-variant mt-1 leading-snug">
              Materials across 6 CPSE enterprise systems
            </p>
          </div>
          <div className="pt-3 border-t border-outline-variant/40 mt-3 flex items-center justify-between text-xs">
            <span className="text-status-success font-medium flex items-center gap-1 font-mono text-[11px]">
              <span className="material-symbols-outlined text-[13px]">trending_up</span>
              +12.4% yoy
            </span>
            <button
              onClick={() => setActiveScreen('datahub')}
              className="text-primary font-medium hover:underline flex items-center gap-0.5 text-xs"
            >
              Data Hub <span className="material-symbols-outlined text-[13px]">chevron_right</span>
            </button>
          </div>
        </div>

        {/* KPI 2 */}
        <div className="bg-surface-container rounded-xl p-4 border border-outline-variant/60 flex flex-col justify-between card-interactive">
          <div>
            <div className="flex justify-between items-start mb-1">
              <span className="text-[11px] font-medium text-on-surface-variant">
                Approved Masters (CNMC)
              </span>
              <span className="material-symbols-outlined text-primary text-[17px]">inventory_2</span>
            </div>
            <h2 className="font-mono text-2xl font-bold text-primary mt-1">
              {mockDashboardKPIs.canonicalMaterialsCount}
            </h2>
            <p className="text-xs text-on-surface-variant mt-1 leading-snug">
              Standardized national catalog codes
            </p>
          </div>
          <div className="pt-3 border-t border-outline-variant/40 mt-3 flex items-center justify-between text-xs">
            <span className="text-status-success font-medium flex items-center gap-1 font-mono text-[11px]">
              <span className="material-symbols-outlined text-[13px]">verified</span>
              100% Governed
            </span>
            <button
              onClick={() => setActiveScreen('master')}
              className="text-primary font-medium hover:underline flex items-center gap-0.5 text-xs"
            >
              Catalogue <span className="material-symbols-outlined text-[13px]">chevron_right</span>
            </button>
          </div>
        </div>

        {/* KPI 3 */}
        <div className="bg-surface-container rounded-xl p-4 border border-outline-variant/60 flex flex-col justify-between card-interactive">
          <div>
            <div className="flex justify-between items-start mb-1">
              <span className="text-[11px] font-medium text-on-surface-variant">
                Harmonization Coverage
              </span>
              <span className="material-symbols-outlined text-primary text-[17px]">pie_chart</span>
            </div>
            <h2 className="font-mono text-2xl font-bold text-on-surface mt-1">
              {mockDashboardKPIs.mappingCoveragePct}%
            </h2>
            <p className="text-xs text-on-surface-variant mt-1 leading-snug">
              Source items mapped to national standards
            </p>
            <div className="w-full bg-surface-container-high h-1.5 mt-2.5 rounded-full overflow-hidden">
              <div
                className="bg-primary h-full transition-all duration-300 rounded-full"
                style={{ width: `${mockDashboardKPIs.mappingCoveragePct}%` }}
              />
            </div>
          </div>
          <div className="pt-3 border-t border-outline-variant/40 mt-3 flex items-center justify-between text-xs">
            <span className="text-on-surface-variant font-mono text-[11px]">
              21.6% pending review
            </span>
            <button
              onClick={() => setActiveScreen('harmonization')}
              className="text-primary font-medium hover:underline flex items-center gap-0.5 text-xs"
            >
              Harmonize <span className="material-symbols-outlined text-[13px]">chevron_right</span>
            </button>
          </div>
        </div>

        {/* KPI 4 */}
        <div className="bg-surface-container rounded-xl p-4 border border-outline-variant/60 flex flex-col justify-between card-interactive">
          <div>
            <div className="flex justify-between items-start mb-1">
              <span className="text-[11px] font-medium text-status-warning">
                Review Backlog
              </span>
              <span className="material-symbols-outlined text-status-warning text-[17px]">fact_check</span>
            </div>
            <h2 className="font-mono text-2xl font-bold text-status-warning mt-1">
              {reviewQueue.length > 0 ? (12400 + reviewQueue.length).toLocaleString() : '12,405'}
            </h2>
            <p className="text-xs text-on-surface-variant mt-1 leading-snug">
              Suspected duplicates requiring cataloger review
            </p>
          </div>
          <div className="pt-3 border-t border-outline-variant/40 mt-3 flex items-center justify-between text-xs">
            <span className="text-status-warning font-mono text-[11px] font-medium">
              Action Required
            </span>
            <button
              onClick={() => setActiveScreen('review')}
              className="px-2.5 py-1 bg-primary text-on-primary font-semibold rounded-md hover:brightness-110 transition flex items-center gap-1 text-[11px]"
            >
              Open Queue <span className="material-symbols-outlined text-[12px]">chevron_right</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Standardization Trend & Action Progress */}
      <div className="grid grid-cols-12 gap-4">
        {/* Mapping Health Chart (Span 8) */}
        <div className="col-span-12 lg:col-span-8 bg-surface-container rounded-xl border border-outline-variant/60 flex flex-col overflow-hidden">
          <div className="px-5 py-3.5 border-b border-outline-variant/50 flex justify-between items-center bg-surface-container">
            <div>
              <h3 className="text-xs font-semibold text-on-surface">
                Standardization & Mapping Velocity
              </h3>
              <p className="text-[11px] text-on-surface-variant mt-0.5">
                Weekly progress of materials mapped to approved CNMC masters across CPSEs
              </p>
            </div>
            <div className="flex gap-2">
              <span className="text-[11px] px-2 py-0.5 rounded bg-surface-container-high text-on-surface-variant font-mono">
                Resolved: <strong className="text-on-surface font-semibold">94.2%</strong>
              </span>
              <span className="text-[11px] px-2 py-0.5 rounded bg-primary/10 text-primary font-mono font-medium">
                Approved: <strong>+14,280</strong>
              </span>
            </div>
          </div>

          <div className="p-5 flex-1 flex flex-col justify-end">
            <div className="h-48 flex items-end gap-5 justify-between px-2 pb-2 border-b border-outline-variant/40">
              {mockMappingHealthTrend.map((bar, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                  <div className="w-full flex items-end justify-center h-full">
                    <div
                      style={{ height: `${bar.approvedCnmcsPct}%` }}
                      className="w-3/5 bg-primary/70 group-hover:bg-primary transition-all duration-200 rounded-t-sm relative"
                    >
                      <div className="opacity-0 group-hover:opacity-100 absolute -top-7 left-1/2 -translate-x-1/2 bg-surface-container-highest text-on-surface text-[10px] font-mono px-1.5 py-0.5 rounded border border-outline-variant/60 shadow whitespace-nowrap z-20 pointer-events-none transition-opacity">
                        {bar.approvedCnmcsPct}% Mapped
                      </div>
                    </div>
                  </div>
                  <span className="font-mono text-[11px] text-on-surface-variant">
                    {bar.label}
                  </span>
                </div>
              ))}
            </div>
            <div className="flex justify-between items-center text-xs text-on-surface-variant font-mono pt-3">
              <span>Past 6 Weeks of Harmonization Operations</span>
              <span className="text-status-success font-medium">Steady upward progress across all sectors</span>
            </div>
          </div>
        </div>

        {/* Action Progress Summary (Span 4) */}
        <div className="col-span-12 lg:col-span-4 bg-surface-container rounded-xl border border-outline-variant/60 p-5 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-1">
              <h3 className="text-xs font-semibold text-on-surface">
                Catalog Rationalization Actions
              </h3>
              <button
                onClick={() => setActiveScreen('rationalization')}
                className="text-xs text-primary font-medium hover:underline"
              >
                Workbench
              </button>
            </div>
            <p className="text-[11px] text-on-surface-variant mb-4">
              Status of catalog consolidation and cleanup actions
            </p>

            <div className="space-y-4">
              {rationalizationActions.slice(0, 3).map((act) => (
                <div key={act.id} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-medium text-on-surface">{act.title}</span>
                    <span className="font-mono text-on-surface-variant">{act.percentage}%</span>
                  </div>
                  <div className="w-full bg-surface-container-high h-1.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        act.actionType === 'MAP' ? 'bg-relationship-duplicate' :
                        act.actionType === 'MERGE' ? 'bg-primary' : 'bg-outline'
                      }`}
                      style={{ width: `${act.percentage}%` }}
                    />
                  </div>
                  <span className="text-[11px] text-on-surface-variant block font-mono">
                    {act.recordCount}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-outline-variant/40 mt-4 flex items-center justify-between">
            <span className="text-xs text-on-surface-variant">Batch Import New Datasets</span>
            <button
              onClick={() => openUploadModal('ONGC')}
              className="px-2.5 py-1.5 bg-surface-container-high hover:bg-surface-container-highest border border-outline-variant/60 text-xs font-medium rounded-lg text-on-surface transition-colors flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[15px] text-primary">upload_file</span>
              Upload XLS/CSV
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Grid: Priority Review Items & CPSE Status Table */}
      <div className="grid grid-cols-12 gap-4">
        {/* Priority Duplicates (Span 7) */}
        <div className="col-span-12 lg:col-span-7 bg-surface-container rounded-xl border border-outline-variant/60 p-5">
          <div className="flex justify-between items-center mb-1">
            <h3 className="text-xs font-semibold text-on-surface">
              Pending Duplicate Candidates
            </h3>
            <button
              onClick={() => setActiveScreen('review')}
              className="text-xs text-primary font-medium hover:underline"
            >
              View Full Queue ({reviewQueue.length > 0 ? reviewQueue.length : 12405})
            </button>
          </div>
          <p className="text-[11px] text-on-surface-variant mb-4">
            Items flagged with high duplicate probability across different CPSE ERP systems
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-surface-container-high text-on-surface-variant font-medium text-[11px] border-b border-outline-variant/40">
                <tr>
                  <th className="p-2.5">Material Group</th>
                  <th className="p-2.5">Description</th>
                  <th className="p-2.5 text-center">Candidates</th>
                  <th className="p-2.5 text-right">Confidence</th>
                  <th className="p-2.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/30 font-mono text-xs">
                {mockDuplicateCandidatesTable.map((item, idx) => (
                  <tr key={idx} className="hover:bg-surface-container-high/40 transition-colors">
                    <td className="p-2.5 text-on-surface font-semibold">{item.groupCode}</td>
                    <td className="p-2.5 font-sans text-on-surface-variant max-w-xs truncate" title={item.description}>
                      {item.description}
                    </td>
                    <td className="p-2.5 text-center">
                      <span className="px-2 py-0.5 rounded bg-surface-container-high text-on-surface font-mono text-[11px]">
                        {item.candidates}
                      </span>
                    </td>
                    <td className="p-2.5 text-right text-status-success font-semibold">
                      {item.confidence}%
                    </td>
                    <td className="p-2.5 text-right">
                      <button
                        onClick={() => setActiveScreen('review')}
                        className="text-xs text-primary hover:underline font-medium font-sans"
                      >
                        Review
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* CPSE Ingestion Status (Span 5) */}
        <div className="col-span-12 lg:col-span-5 bg-surface-container rounded-xl border border-outline-variant/60 p-5 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-1">
              <h3 className="text-xs font-semibold text-on-surface">
                CPSE Harmonization Status
              </h3>
              <button
                onClick={() => setActiveScreen('datahub')}
                className="text-xs text-primary font-medium hover:underline"
              >
                Data Hub
              </button>
            </div>
            <p className="text-[11px] text-on-surface-variant mb-4">
              Catalog synchronization progress per public enterprise
            </p>

            <div className="space-y-2.5">
              {cpseList.slice(0, 4).map((cpse) => (
                <div
                  key={cpse.id}
                  className="p-3 bg-surface-container-low rounded-lg border border-outline-variant/40 flex items-center justify-between"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-xs text-on-surface">{cpse.name}</span>
                      <span className="text-[10px] text-on-surface-variant font-mono">{cpse.sector}</span>
                    </div>
                    <span className="text-[11px] text-on-surface-variant font-mono mt-0.5 block">
                      {cpse.mappedRecords.toLocaleString()} of {cpse.totalRecords.toLocaleString()} mapped
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="font-mono text-sm font-bold text-primary">
                      {cpse.coveragePercentage}%
                    </span>
                    <span className="block text-[10px] text-status-success font-medium">
                      Connected
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-outline-variant/40 mt-3 flex justify-between items-center text-xs">
            <span className="text-on-surface-variant font-mono text-[11px]">All CPSE ERP connectors healthy</span>
            <button
              onClick={() => setActiveScreen('datahub')}
              className="text-xs text-primary font-medium hover:underline flex items-center gap-0.5"
            >
              Manage Connectors <span className="material-symbols-outlined text-[13px]">chevron_right</span>
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};
