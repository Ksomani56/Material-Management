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
    <main className="flex-1 overflow-y-auto p-margin-page bg-background transition-colors duration-200 space-y-6">
      {/* Page Title & Subtitle */}
      <div>
        <h1 className="font-headline-section text-headline-section text-on-surface font-bold">
          National Material Master Overview
        </h1>
        <p className="text-xs text-on-surface-variant mt-0.5">
          Real-time catalog performance, CPSE harmonization metrics, and items requiring action.
        </p>
      </div>

      {/* KPI Row (4 Cards with What + Value + Next Action) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter">
        {/* KPI 1 */}
        <div className="bg-surface-container rounded-2xl p-5 border border-outline-variant/40 relative overflow-hidden shadow-sm card-interactive flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start mb-1">
              <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">
                Total Source Records
              </span>
              <span className="material-symbols-outlined text-primary text-xl">dataset</span>
            </div>
            <h2 className="font-display-cnmc text-display-cnmc text-on-surface font-bold">
              {mockDashboardKPIs.totalSourceCodes}
            </h2>
            <p className="text-xs text-on-surface-variant mt-1">
              Materials imported across 6 CPSEs
            </p>
          </div>
          <div className="pt-3 border-t border-outline-variant/30 mt-3 flex items-center justify-between text-xs">
            <span className="text-status-success font-semibold flex items-center gap-1 font-data-mono">
              <span className="material-symbols-outlined text-[14px]">trending_up</span>
              +12.4% this year
            </span>
            <button 
              onClick={() => setActiveScreen('datahub')}
              className="text-primary font-semibold hover:underline flex items-center gap-0.5"
            >
              View Data Hub <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
            </button>
          </div>
        </div>

        {/* KPI 2 */}
        <div className="bg-surface-container rounded-2xl p-5 border border-outline-variant/40 relative overflow-hidden shadow-sm card-interactive flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start mb-1">
              <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">
                Approved Masters (CNMC)
              </span>
              <span className="material-symbols-outlined text-primary text-xl">inventory_2</span>
            </div>
            <h2 className="font-display-cnmc text-display-cnmc text-primary font-bold">
              {mockDashboardKPIs.canonicalMaterialsCount}
            </h2>
            <p className="text-xs text-on-surface-variant mt-1">
              Standardized national catalog codes
            </p>
          </div>
          <div className="pt-3 border-t border-outline-variant/30 mt-3 flex items-center justify-between text-xs">
            <span className="text-status-success font-semibold flex items-center gap-1 font-data-mono">
              <span className="material-symbols-outlined text-[14px]">verified</span>
              100% Validated
            </span>
            <button 
              onClick={() => setActiveScreen('master')}
              className="text-primary font-semibold hover:underline flex items-center gap-0.5"
            >
              View Catalogue <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
            </button>
          </div>
        </div>

        {/* KPI 3 */}
        <div className="bg-surface-container rounded-2xl p-5 border border-outline-variant/40 relative overflow-hidden shadow-sm card-interactive flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start mb-1">
              <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">
                Harmonization Coverage
              </span>
              <span className="material-symbols-outlined text-relationship-identical text-xl">donut_large</span>
            </div>
            <h2 className="font-display-cnmc text-display-cnmc text-on-surface font-bold">
              {mockDashboardKPIs.mappingCoveragePct}%
            </h2>
            <p className="text-xs text-on-surface-variant mt-1">
              Source items mapped to national codes
            </p>
            <div className="w-full bg-surface-container-high h-2 mt-2 rounded-full overflow-hidden">
              <div 
                className="bg-relationship-identical h-full transition-all duration-500 rounded-full" 
                style={{ width: `${mockDashboardKPIs.mappingCoveragePct}%` }}
              />
            </div>
          </div>
          <div className="pt-3 border-t border-outline-variant/30 mt-3 flex items-center justify-between text-xs">
            <span className="text-on-surface-variant font-data-mono">
              21.6% pending
            </span>
            <button 
              onClick={() => setActiveScreen('harmonization')}
              className="text-primary font-semibold hover:underline flex items-center gap-0.5"
            >
              Start Matching <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
            </button>
          </div>
        </div>

        {/* KPI 4 */}
        <div className="bg-surface-container rounded-2xl p-5 border border-primary/40 relative overflow-hidden shadow-sm card-interactive flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start mb-1">
              <span className="font-label-caps text-label-caps text-status-warning uppercase font-bold">
                Review Backlog
              </span>
              <span className="material-symbols-outlined text-status-warning text-xl">fact_check</span>
            </div>
            <h2 className="font-display-cnmc text-display-cnmc text-status-warning font-bold">
              {reviewQueue.length > 0 ? (12400 + reviewQueue.length).toLocaleString() : '12,405'}
            </h2>
            <p className="text-xs text-on-surface-variant mt-1">
              Materials requiring cataloger review
            </p>
          </div>
          <div className="pt-3 border-t border-outline-variant/30 mt-3 flex items-center justify-between text-xs">
            <span className="text-status-warning font-data-mono font-semibold">
              Action Required
            </span>
            <button 
              onClick={() => setActiveScreen('review')}
              className="px-2.5 py-1 bg-primary text-on-primary font-semibold rounded-lg hover:brightness-110 transition flex items-center gap-1 text-[11px]"
            >
              Open Queue <span className="material-symbols-outlined text-[13px]">arrow_forward</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Mapping Health & Action Progress */}
      <div className="grid grid-cols-12 gap-gutter">
        {/* Mapping Health Chart (Span 8) */}
        <div className="col-span-12 lg:col-span-8 bg-surface-container rounded-2xl border border-outline-variant/40 flex flex-col shadow-sm overflow-hidden">
          <div className="p-4 border-b border-outline-variant/30 flex justify-between items-center bg-surface-container-high/50">
            <div>
              <h3 className="font-headline-section text-headline-section text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-sm">auto_graph</span>
                Mapping & Standardization Trend
              </h3>
              <p className="text-[11px] text-on-surface-variant mt-0.5">
                Weekly progress of materials mapped to approved CNMC masters across CPSEs
              </p>
            </div>
            <div className="flex gap-2">
              <span className="text-[11px] px-2.5 py-1 rounded-full bg-surface-container-low border border-outline-variant/40 text-on-surface-variant font-data-mono">
                Duplicates Resolved: <strong className="text-on-surface">94.2%</strong>
              </span>
              <span className="text-[11px] px-2.5 py-1 rounded-full bg-primary/10 border border-primary/30 text-primary font-data-mono">
                Approved CNMC: <strong className="text-primary">+14,280</strong>
              </span>
            </div>
          </div>

          <div className="p-6 flex-1 flex flex-col justify-end">
            <div className="h-56 flex items-end gap-5 justify-between px-4 pb-2 border-b border-outline-variant/40">
              {mockMappingHealthTrend.map((bar, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                  <div className="w-full flex items-end justify-center gap-1.5 h-full">
                    {/* Approved bar */}
                    <div 
                      style={{ height: `${bar.approvedCnmcsPct}%` }}
                      className="w-4/5 bg-primary/80 group-hover:bg-primary transition-all duration-300 rounded-t-md relative"
                    >
                      <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-surface-container-high text-on-surface text-[10px] font-data-mono px-2 py-0.5 rounded shadow whitespace-nowrap z-20 transition-opacity">
                        {bar.approvedCnmcsPct}% Mapped
                      </div>
                    </div>
                  </div>
                  <span className="font-data-mono text-[11px] text-on-surface-variant font-medium">
                    {bar.label}
                  </span>
                </div>
              ))}
            </div>
            <div className="flex justify-between items-center text-xs text-on-surface-variant font-data-mono pt-3">
              <span>Past 6 Weeks of Harmonization Operations</span>
              <span className="text-status-success font-medium">Steady upward progress across all sectors</span>
            </div>
          </div>
        </div>

        {/* Action Progress Summary (Span 4) */}
        <div className="col-span-12 lg:col-span-4 bg-surface-container rounded-2xl border border-outline-variant/40 p-5 flex flex-col justify-between shadow-sm">
          <div>
            <div className="flex justify-between items-center mb-1">
              <h3 className="font-headline-section text-headline-section text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-sm">account_tree</span>
                Consolidation Progress
              </h3>
              <button 
                onClick={() => setActiveScreen('rationalization')}
                className="text-xs text-primary font-semibold hover:underline"
              >
                Open Workbench
              </button>
            </div>
            <p className="text-[11px] text-on-surface-variant mb-4">
              Status of catalog consolidation and cleanup actions
            </p>

            <div className="space-y-4">
              {rationalizationActions.slice(0, 3).map((act) => (
                <div key={act.id} className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-on-surface">{act.title}</span>
                    <span className="font-data-mono text-on-surface-variant">{act.percentage}%</span>
                  </div>
                  <div className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${
                        act.actionType === 'MAP' ? 'bg-relationship-duplicate' :
                        act.actionType === 'MERGE' ? 'bg-primary' : 'bg-outline'
                      }`}
                      style={{ width: `${act.percentage}%` }}
                    />
                  </div>
                  <span className="text-[11px] text-on-surface-variant block font-data-mono">
                    {act.recordCount}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-outline-variant/30 mt-4 flex items-center justify-between">
            <span className="text-xs text-on-surface-variant">Batch Import New Datasets</span>
            <button 
              onClick={() => openUploadModal('ONGC')}
              className="px-3 py-1.5 bg-surface-container-high hover:bg-surface-container-highest border border-outline-variant/50 text-xs font-semibold rounded-xl text-on-surface transition flex items-center gap-1.5 shadow-sm"
            >
              <span className="material-symbols-outlined text-sm text-primary">upload_file</span>
              Upload XLS/CSV
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Grid: Priority Review Items & CPSE Status Table */}
      <div className="grid grid-cols-12 gap-gutter">
        {/* Priority Duplicates (Span 7) */}
        <div className="col-span-12 lg:col-span-7 bg-surface-container rounded-2xl border border-outline-variant/40 p-5 shadow-sm">
          <div className="flex justify-between items-center mb-1">
            <h3 className="font-headline-section text-headline-section text-on-surface">
              Pending Duplicate Candidates
            </h3>
            <button 
              onClick={() => setActiveScreen('review')}
              className="text-xs text-primary font-semibold hover:underline"
            >
              View Full Queue ({reviewQueue.length > 0 ? reviewQueue.length : 12405})
            </button>
          </div>
          <p className="text-[11px] text-on-surface-variant mb-4">
            Items flagged with high duplicate probability across different CPSE ERP systems
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-surface-container-high text-on-surface-variant font-table-header text-[11px] border-b border-outline-variant/30">
                <tr>
                  <th className="p-2.5">Material Group</th>
                  <th className="p-2.5">Description</th>
                  <th className="p-2.5 text-center">Duplicates</th>
                  <th className="p-2.5 text-right">Match Confidence</th>
                  <th className="p-2.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/20 font-data-mono text-xs">
                {mockDuplicateCandidatesTable.map((item, idx) => (
                  <tr key={idx} className="hover:bg-surface-container-high/60 transition-colors">
                    <td className="p-2.5 text-on-surface font-semibold">{item.groupCode}</td>
                    <td className="p-2.5 font-sans text-on-surface-variant max-w-xs truncate" title={item.description}>
                      {item.description}
                    </td>
                    <td className="p-2.5 text-center">
                      <span className="px-2 py-0.5 rounded-full bg-surface-container-high text-on-surface font-bold">
                        {item.candidates}
                      </span>
                    </td>
                    <td className="p-2.5 text-right text-status-success font-bold">
                      {item.confidence}%
                    </td>
                    <td className="p-2.5 text-right">
                      <button 
                        onClick={() => setActiveScreen('review')}
                        className="text-xs text-primary hover:underline font-semibold"
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
        <div className="col-span-12 lg:col-span-5 bg-surface-container rounded-2xl border border-outline-variant/40 p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-1">
              <h3 className="font-headline-section text-headline-section text-on-surface">
                CPSE Harmonization Status
              </h3>
              <button 
                onClick={() => setActiveScreen('datahub')}
                className="text-xs text-primary font-semibold hover:underline"
              >
                Data Hub
              </button>
            </div>
            <p className="text-[11px] text-on-surface-variant mb-4">
              Catalog synchronization progress per public enterprise
            </p>

            <div className="space-y-3">
              {cpseList.slice(0, 4).map((cpse) => (
                <div 
                  key={cpse.id}
                  className="p-3 bg-surface-container-low rounded-xl border border-outline-variant/30 flex items-center justify-between"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-xs text-on-surface">{cpse.name}</span>
                      <span className="text-[10px] text-on-surface-variant font-data-mono">{cpse.sector}</span>
                    </div>
                    <span className="text-[11px] text-on-surface-variant font-data-mono mt-0.5 block">
                      {cpse.mappedRecords.toLocaleString()} of {cpse.totalRecords.toLocaleString()} records mapped
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="font-display-cnmc text-sm font-bold text-primary">
                      {cpse.coveragePercentage}%
                    </span>
                    <span className="block text-[10px] text-status-success font-semibold">
                      Connected
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-outline-variant/30 mt-3 flex justify-between items-center text-xs">
            <span className="text-on-surface-variant font-data-mono">All CPSE ERP connectors healthy</span>
            <button 
              onClick={() => setActiveScreen('datahub')}
              className="text-xs text-primary font-semibold hover:underline flex items-center gap-0.5"
            >
              Manage Connectors <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};
