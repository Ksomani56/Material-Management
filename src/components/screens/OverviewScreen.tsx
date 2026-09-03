import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  mockDashboardKPIs,
  mockMappingHealthTrend,
  mockDuplicateCandidatesTable
} from '../../data/mockData';

export const OverviewScreen: React.FC = () => {
  const { setActiveScreen, reviewQueue, cpseList, rationalizationActions, openUploadModal } = useApp();
  const [hoveredBarIndex, setHoveredBarIndex] = useState<number | null>(null);

  return (
    <main className="flex-1 overflow-y-auto p-6 bg-background space-y-6">
      {/* Page Header with Timeframe & Filters */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl font-bold text-on-surface tracking-tight">
            Executive Dashboard
          </h1>
          <p className="text-xs text-on-surface-variant mt-0.5">
            National material master standardization metrics, duplicate resolution, and active pipeline health across 6 CPSEs.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container border border-outline-variant/60 text-xs text-on-surface-variant font-mono">
            <span className="material-symbols-outlined text-[15px]">calendar_today</span>
            <span>Last 6 Weeks</span>
          </div>
          <button
            onClick={() => openUploadModal('ONGC')}
            className="px-3 py-1.5 bg-surface-container hover:bg-surface-container-high border border-outline-variant/60 text-on-surface rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors"
          >
            <span className="material-symbols-outlined text-[15px] text-primary">upload_file</span>
            Import Dataset
          </button>
        </div>
      </div>

      {/* 4 Compact SalesOps KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1 */}
        <div className="bg-surface-container rounded-xl p-4.5 border border-outline-variant/60 flex flex-col justify-between card-interactive">
          <div className="flex justify-between items-start">
            <span className="text-xs font-medium text-on-surface-variant">
              Total Source Records
            </span>
            <span className="material-symbols-outlined text-on-surface-variant/60 text-[18px]">dataset</span>
          </div>
          <div className="my-2">
            <div className="text-2xl font-bold text-on-surface tracking-tight font-sans">
              {mockDashboardKPIs.totalSourceCodes}
            </div>
            <div className="flex items-center gap-1.5 mt-1 text-xs">
              <span className="text-status-success font-medium flex items-center gap-0.5">
                <span className="material-symbols-outlined text-[14px]">arrow_upward</span>
                +12.4%
              </span>
              <span className="text-on-surface-variant text-[11px]">vs last period</span>
            </div>
          </div>
          <p className="text-[11px] text-on-surface-variant/80 truncate">
            Across ONGC, IOCL, GAIL, NTPC, SAIL, BHEL
          </p>
        </div>

        {/* KPI 2 */}
        <div className="bg-surface-container rounded-xl p-4.5 border border-outline-variant/60 flex flex-col justify-between card-interactive">
          <div className="flex justify-between items-start">
            <span className="text-xs font-medium text-on-surface-variant">
              Approved Masters (CNMC)
            </span>
            <span className="material-symbols-outlined text-primary text-[18px]">inventory_2</span>
          </div>
          <div className="my-2">
            <div className="text-2xl font-bold text-primary tracking-tight font-sans">
              {mockDashboardKPIs.canonicalMaterialsCount}
            </div>
            <div className="flex items-center gap-1.5 mt-1 text-xs">
              <span className="text-status-success font-medium flex items-center gap-0.5">
                <span className="material-symbols-outlined text-[14px]">verified</span>
                100% Validated
              </span>
              <span className="text-on-surface-variant text-[11px]">national standard</span>
            </div>
          </div>
          <p className="text-[11px] text-on-surface-variant/80 truncate">
            Governed under MoPNG unified taxonomy
          </p>
        </div>

        {/* KPI 3 */}
        <div className="bg-surface-container rounded-xl p-4.5 border border-outline-variant/60 flex flex-col justify-between card-interactive">
          <div className="flex justify-between items-start">
            <span className="text-xs font-medium text-on-surface-variant">
              Harmonization Coverage
            </span>
            <span className="material-symbols-outlined text-primary text-[18px]">pie_chart</span>
          </div>
          <div className="my-2">
            <div className="text-2xl font-bold text-on-surface tracking-tight font-sans">
              {mockDashboardKPIs.mappingCoveragePct}%
            </div>
            <div className="w-full bg-surface-container-high h-1.5 mt-2 rounded-full overflow-hidden">
              <div
                className="bg-primary h-full transition-all duration-500 rounded-full"
                style={{ width: `${mockDashboardKPIs.mappingCoveragePct}%` }}
              />
            </div>
          </div>
          <p className="text-[11px] text-on-surface-variant/80 truncate">
            21.6% pending automated/cataloger review
          </p>
        </div>

        {/* KPI 4 */}
        <div className="bg-surface-container rounded-xl p-4.5 border border-outline-variant/60 flex flex-col justify-between card-interactive">
          <div className="flex justify-between items-start">
            <span className="text-xs font-medium text-status-warning">
              Review Backlog
            </span>
            <span className="material-symbols-outlined text-status-warning text-[18px]">fact_check</span>
          </div>
          <div className="my-2">
            <div className="text-2xl font-bold text-status-warning tracking-tight font-sans">
              {reviewQueue.length > 0 ? (12400 + reviewQueue.length).toLocaleString() : '12,405'}
            </div>
            <div className="flex items-center gap-1.5 mt-1 text-xs">
              <span className="text-status-warning font-medium">
                Action Required
              </span>
              <span className="text-on-surface-variant text-[11px]">high duplicate probability</span>
            </div>
          </div>
          <button
            onClick={() => setActiveScreen('review')}
            className="w-full py-1.5 bg-primary text-on-primary font-semibold rounded-md text-xs hover:brightness-110 transition flex items-center justify-center gap-1"
          >
            <span>Resolve Queue</span>
            <span className="material-symbols-outlined text-[13px]">arrow_forward</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Real Chart & Action Progress */}
      <div className="grid grid-cols-12 gap-5">
        {/* Standardization & Mapping Velocity Chart (Span 8) */}
        <div className="col-span-12 lg:col-span-8 bg-surface-container rounded-xl border border-outline-variant/60 p-5 flex flex-col justify-between">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-xs font-semibold text-on-surface uppercase tracking-wide">
                Standardization Velocity & Duplicate Resolution
              </h3>
              <p className="text-[11px] text-on-surface-variant mt-0.5">
                Weekly progress of materials resolved into approved CNMC national standards
              </p>
            </div>

            {/* Chart Legend */}
            <div className="flex items-center gap-3 text-[11px] font-mono">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-primary" />
                <span className="text-on-surface">Approved CNMC</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-surface-container-highest" />
                <span className="text-on-surface-variant">Duplicate Backlog</span>
              </div>
            </div>
          </div>

          {/* Genuine SVG/CSS Bar Chart with Gridlines and Tooltip */}
          <div className="relative pt-6 pb-2">
            {/* Horizontal Dashed Guidelines */}
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-6">
              <div className="border-b border-outline-variant/30 w-full flex justify-between text-[10px] text-on-surface-variant/50 font-mono">
                <span>100%</span>
              </div>
              <div className="border-b border-outline-variant/30 w-full flex justify-between text-[10px] text-on-surface-variant/50 font-mono">
                <span>75%</span>
              </div>
              <div className="border-b border-outline-variant/30 w-full flex justify-between text-[10px] text-on-surface-variant/50 font-mono">
                <span>50%</span>
              </div>
              <div className="border-b border-outline-variant/30 w-full flex justify-between text-[10px] text-on-surface-variant/50 font-mono">
                <span>25%</span>
              </div>
              <div className="border-b border-outline-variant/50 w-full flex justify-between text-[10px] text-on-surface-variant/50 font-mono">
                <span>0%</span>
              </div>
            </div>

            {/* Bar Columns Container */}
            <div className="h-52 flex items-end justify-between gap-4 px-6 relative z-10">
              {mockMappingHealthTrend.map((bar, idx) => {
                const approvedHeight = (bar.approvedCnmcsPct / 100) * 190;
                const duplicateHeight = (bar.duplicateCandidatesPct / 100) * 190;

                return (
                  <div
                    key={idx}
                    onMouseEnter={() => setHoveredBarIndex(idx)}
                    onMouseLeave={() => setHoveredBarIndex(null)}
                    className="flex-1 flex flex-col items-center justify-end h-full group cursor-pointer relative"
                  >
                    {/* Hover Floating Tooltip */}
                    {hoveredBarIndex === idx && (
                      <div className="absolute -top-12 z-30 bg-surface-container-highest text-on-surface border border-outline-variant/80 text-[11px] font-mono px-2.5 py-1 rounded shadow-lg whitespace-nowrap pointer-events-none">
                        <div className="text-primary font-bold">Approved: {bar.approvedCnmcsPct}% ({bar.approvedVal})</div>
                        <div className="text-on-surface-variant">Duplicate: {bar.duplicateCandidatesPct}% ({bar.duplicateVal})</div>
                      </div>
                    )}

                    {/* Dual Bars */}
                    <div className="flex items-end gap-1.5 w-full justify-center">
                      {/* Approved Bar */}
                      <div
                        style={{ height: `${approvedHeight}px` }}
                        className="w-4 sm:w-6 bg-primary rounded-t-sm transition-all duration-200 group-hover:brightness-110"
                      />
                      {/* Duplicate Candidates Bar */}
                      <div
                        style={{ height: `${duplicateHeight}px` }}
                        className="w-4 sm:w-6 bg-surface-container-highest rounded-t-sm transition-all duration-200 group-hover:brightness-125"
                      />
                    </div>

                    {/* X-axis Label */}
                    <span className="text-[11px] font-mono text-on-surface-variant mt-2 font-medium">
                      {bar.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex justify-between items-center text-xs text-on-surface-variant font-mono pt-3 border-t border-outline-variant/40 mt-2">
            <span>Cumulative 6-Week Progress</span>
            <span className="text-status-success font-medium">+14,280 New Approved Masters</span>
          </div>
        </div>

        {/* Action Progress Summary (Span 4) */}
        <div className="col-span-12 lg:col-span-4 bg-surface-container rounded-xl border border-outline-variant/60 p-5 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-1">
              <h3 className="text-xs font-semibold text-on-surface uppercase tracking-wide">
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
              Status of catalog consolidation and duplicate resolution actions
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
                      className={`h-full rounded-full transition-all duration-500 ${
                        act.actionType === 'MAP' ? 'bg-relationship-duplicate' :
                        act.actionType === 'MERGE' ? 'bg-primary' : 'bg-outline'
                      }`}
                      style={{ width: `${act.percentage}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[11px] text-on-surface-variant font-mono">
                    <span>{act.recordCount}</span>
                    <span className="text-[10px] text-status-success font-medium">Active</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-outline-variant/40 mt-4 flex items-center justify-between">
            <span className="text-xs text-on-surface-variant">Batch Import New Datasets</span>
            <button
              onClick={() => openUploadModal('ONGC')}
              className="px-3 py-1.5 bg-surface-container-high hover:bg-surface-container-highest border border-outline-variant/60 text-xs font-medium rounded-lg text-on-surface transition-colors flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[15px] text-primary">upload_file</span>
              Upload XLS/CSV
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Grid: Priority Review Items & CPSE Status Table */}
      <div className="grid grid-cols-12 gap-5">
        {/* Priority Duplicates (Span 7) */}
        <div className="col-span-12 lg:col-span-7 bg-surface-container rounded-xl border border-outline-variant/60 p-5">
          <div className="flex justify-between items-center mb-1">
            <h3 className="text-xs font-semibold text-on-surface uppercase tracking-wide">
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
                  <tr key={idx} className="hover:bg-surface-container-high/40 transition-colors duration-140">
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
              <h3 className="text-xs font-semibold text-on-surface uppercase tracking-wide">
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
