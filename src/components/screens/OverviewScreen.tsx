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
      {/* KPI Row (4 Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter">
        {/* KPI 1 */}
        <div className="bg-surface-container rounded-2xl p-5 border border-outline-variant/40 relative overflow-hidden shadow-sm card-interactive">
          <div className="absolute -right-4 -top-4 text-surface-container-high opacity-20 pointer-events-none">
            <span className="material-symbols-outlined text-[100px]">dataset</span>
          </div>
          <div className="relative z-10">
            <p className="font-label-caps text-label-caps text-on-surface-variant mb-1">
              TOTAL SOURCE CODES
            </p>
            <h2 className="font-display-cnmc text-display-cnmc text-on-surface">
              {mockDashboardKPIs.totalSourceCodes}
            </h2>
            <div className="flex items-center mt-2 text-status-success font-data-mono text-data-mono">
              <span className="material-symbols-outlined text-[14px] mr-1">trending_up</span>
              {mockDashboardKPIs.totalSourceChange}
            </div>
          </div>
        </div>

        {/* KPI 2 */}
        <div 
          onClick={() => setActiveScreen('master')}
          className="bg-surface-container rounded-2xl p-5 border border-outline-variant/40 relative overflow-hidden shadow-sm cursor-pointer hover:border-primary/50 card-interactive"
        >
          <div className="absolute -right-4 -top-4 text-surface-container-high opacity-20 pointer-events-none">
            <span className="material-symbols-outlined text-[100px]">inventory_2</span>
          </div>
          <div className="relative z-10">
            <p className="font-label-caps text-label-caps text-on-surface-variant mb-1">
              CANONICAL MATERIALS (CNMC)
            </p>
            <h2 className="font-display-cnmc text-display-cnmc text-primary">
              {mockDashboardKPIs.canonicalMaterialsCount}
            </h2>
            <div className="flex items-center mt-2 text-on-surface-variant font-data-mono text-data-mono">
              <span className="material-symbols-outlined text-[14px] mr-1 text-primary">check_circle</span>
              {mockDashboardKPIs.canonicalSubtitle}
            </div>
          </div>
        </div>

        {/* KPI 3 */}
        <div 
          onClick={() => setActiveScreen('datahub')}
          className="bg-surface-container rounded-2xl p-5 border border-outline-variant/40 relative overflow-hidden shadow-sm cursor-pointer hover:border-relationship-identical/50 card-interactive"
        >
          <div className="absolute -right-4 -top-4 text-surface-container-high opacity-20 pointer-events-none">
            <span className="material-symbols-outlined text-[100px]">donut_large</span>
          </div>
          <div className="relative z-10">
            <p className="font-label-caps text-label-caps text-on-surface-variant mb-1">
              MAPPING COVERAGE
            </p>
            <h2 className="font-display-cnmc text-display-cnmc text-on-surface">
              {mockDashboardKPIs.mappingCoveragePct}%
            </h2>
            <div className="w-full bg-surface-container-high h-2 mt-3 rounded-full overflow-hidden">
              <div 
                className="bg-relationship-identical h-full transition-all duration-500 rounded-full" 
                style={{ width: `${mockDashboardKPIs.mappingCoveragePct}%` }}
              />
            </div>
          </div>
        </div>

        {/* KPI 4 */}
        <div 
          onClick={() => setActiveScreen('review')}
          className="bg-surface-container rounded-2xl p-5 border border-primary/40 relative overflow-hidden shadow-sm cursor-pointer hover:border-primary card-interactive"
        >
          <div className="absolute -right-4 -top-4 text-surface-container-high opacity-20 pointer-events-none">
            <span className="material-symbols-outlined text-[100px]">fact_check</span>
          </div>
          <div className="relative z-10 flex justify-between items-start">
            <div>
              <p className="font-label-caps text-label-caps text-on-surface-variant mb-1">
                REVIEW BACKLOG
              </p>
              <h2 className="font-display-cnmc text-display-cnmc text-relationship-near">
                {reviewQueue.length > 0 ? (12400 + reviewQueue.length).toLocaleString() : '12,450'}
              </h2>
            </div>
            <span className="material-symbols-outlined text-relationship-near text-2xl">warning</span>
          </div>
          <div className="flex items-center mt-2 text-relationship-near font-data-mono text-data-mono">
            {mockDashboardKPIs.backlogStatus} (Click to inspect)
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-12 gap-gutter">
        {/* Mapping Health Chart (Span 8) */}
        <div className="col-span-12 lg:col-span-8 bg-surface-container rounded-2xl border border-outline-variant/40 flex flex-col shadow-sm overflow-hidden">
          <div className="p-4 border-b border-outline-variant/30 flex justify-between items-center bg-surface-container-high/50">
            <h3 className="font-headline-section text-headline-section text-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined text-status-info text-sm">auto_graph</span>
              Mapping Health Trend
            </h3>
            <div className="flex gap-2">
              <span className="px-2.5 py-1 rounded-full bg-surface-container-high text-on-surface-variant font-data-mono text-[10px]">
                Duplicates Detected
              </span>
              <span className="px-2.5 py-1 rounded-full bg-primary-container/20 text-primary font-data-mono text-[10px] font-bold">
                Approved CNMCs
              </span>
            </div>
          </div>
          
          <div className="p-5 flex-1 min-h-[250px] relative flex items-end gap-2">
            {/* Grid Lines */}
            <div className="absolute inset-0 p-5 flex flex-col justify-between pointer-events-none opacity-20 border-l border-b border-outline-variant/50 ml-4 mb-4">
              <div className="w-full border-b border-outline-variant/50 border-dashed" />
              <div className="w-full border-b border-outline-variant/50 border-dashed" />
              <div className="w-full border-b border-outline-variant/50 border-dashed" />
            </div>
            
            {/* Chart Bars */}
            <div className="w-full h-full flex items-end justify-around pb-4 pl-4 z-10 pt-4">
              {mockMappingHealthTrend.map((item) => (
                <div key={item.label} className="flex flex-col items-center gap-1.5 w-12 group cursor-pointer">
                  <div className="flex items-end gap-1.5 w-full h-[180px] bg-transparent">
                    <div 
                      className="w-1/2 bg-relationship-duplicate/40 hover:bg-relationship-duplicate/70 rounded-t-md transition-all relative"
                      style={{ height: `${item.duplicateCandidatesPct}%` }}
                      title={`Duplicates: ${item.duplicateVal}`}
                    />
                    <div 
                      className="w-1/2 bg-relationship-identical hover:brightness-110 rounded-t-md transition-all relative shadow-sm"
                      style={{ height: `${item.approvedCnmcsPct}%` }}
                      title={`Approved CNMCs: ${item.approvedVal}`}
                    />
                  </div>
                  <span className="font-data-mono text-[10px] text-on-surface-variant group-hover:text-primary transition-colors">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Rationalization Progress (Span 4) */}
        <div className="col-span-12 lg:col-span-4 bg-surface-container rounded-2xl border border-outline-variant/40 flex flex-col shadow-sm overflow-hidden">
          <div className="p-4 border-b border-outline-variant/30 flex justify-between items-center bg-surface-container-high/50">
            <h3 className="font-headline-section text-headline-section text-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined text-sm text-on-surface-variant">move_up</span>
              Action Progress
            </h3>
            <button 
              onClick={() => setActiveScreen('rationalization')}
              className="text-primary text-xs font-body-bold hover:underline"
            >
              EXPLORE
            </button>
          </div>
          
          <div className="p-5 flex flex-col justify-center gap-5 flex-1">
            {rationalizationActions.map((action) => {
              const color = action.actionType === 'MAP' 
                ? 'bg-status-info' 
                : action.actionType === 'MERGE' 
                  ? 'bg-relationship-near' 
                  : 'bg-outline';

              return (
                <div key={action.id} className="cursor-pointer group" onClick={() => setActiveScreen('rationalization')}>
                  <div className="flex justify-between mb-1.5">
                    <span className="font-body-bold text-xs text-on-surface group-hover:text-primary transition-colors">
                      {action.title}
                    </span>
                    <span className="font-data-mono text-xs text-on-surface-variant">
                      {action.percentage}%
                    </span>
                  </div>
                  <div className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden">
                    <div 
                      className={`${color} h-full transition-all duration-500 rounded-full`}
                      style={{ width: `${action.percentage}%` }}
                    />
                  </div>
                  <p className="font-data-mono text-[10px] text-on-surface-variant mt-1 text-right">
                    {action.recordCount}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Duplicate Candidates Table (Span 6) */}
        <div className="col-span-12 lg:col-span-6 bg-surface-container rounded-2xl border border-outline-variant/40 flex flex-col overflow-hidden shadow-sm">
          <div className="p-4 border-b border-outline-variant/30 flex justify-between items-center bg-surface-container-high/50">
            <h3 className="font-table-header text-table-header text-on-surface uppercase">
              TOP DUPLICATE CANDIDATES
            </h3>
            <button 
              onClick={() => setActiveScreen('review')}
              className="text-primary text-xs font-body-bold hover:underline"
            >
              VIEW ALL
            </button>
          </div>
          <div className="flex-1 overflow-auto">
            <table className="w-full text-left border-collapse">
              <thead className="sticky top-0 bg-surface-container-high border-b border-outline-variant/40 z-10">
                <tr>
                  <th className="p-2.5 font-table-header text-[10px] text-on-surface-variant tracking-wider">MAT. GROUP</th>
                  <th className="p-2.5 font-table-header text-[10px] text-on-surface-variant tracking-wider">DESCRIPTION</th>
                  <th className="p-2.5 font-table-header text-[10px] text-on-surface-variant tracking-wider text-right">CANDIDATES</th>
                  <th className="p-2.5 font-table-header text-[10px] text-on-surface-variant tracking-wider text-center">AI CONFIDENCE</th>
                </tr>
              </thead>
              <tbody className="font-data-mono text-data-mono divide-y divide-outline-variant/20">
                {mockDuplicateCandidatesTable.map((row) => (
                  <tr 
                    key={row.groupCode}
                    onClick={() => setActiveScreen('harmonization')}
                    className="h-row-height-dense hover:bg-surface-container-high/60 transition-colors cursor-pointer"
                  >
                    <td className="p-2.5 text-primary">{row.groupCode}</td>
                    <td className="p-2.5 text-on-surface truncate max-w-[160px]">{row.description}</td>
                    <td className="p-2.5 text-right text-relationship-duplicate font-semibold">{row.candidates}</td>
                    <td className="p-2.5 text-center">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        row.status === 'success' 
                          ? 'bg-status-success/15 text-status-success' 
                          : 'bg-status-warning/15 text-status-warning'
                      }`}>
                        <span className="material-symbols-outlined text-[10px]">auto_awesome</span> 
                        {row.confidence}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* CPSE Coverage Matrix (Span 6) */}
        <div className="col-span-12 lg:col-span-6 bg-surface-container rounded-2xl border border-outline-variant/40 flex flex-col overflow-hidden shadow-sm">
          <div className="p-4 border-b border-outline-variant/30 flex justify-between items-center bg-surface-container-high/50">
            <h3 className="font-table-header text-table-header text-on-surface uppercase">
              CPSE HARMONIZATION STATUS
            </h3>
            <div className="flex gap-2">
              <button 
                onClick={() => openUploadModal('ONGC')}
                className="text-xs text-primary font-body-bold hover:underline flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-[14px]">upload_file</span>
                INGEST
              </button>
              <span className="text-outline-variant">|</span>
              <button 
                onClick={() => setActiveScreen('datahub')}
                className="text-primary text-xs font-body-bold hover:underline"
              >
                DATA HUB
              </button>
            </div>
          </div>
          <div className="p-5 flex-1">
            <div className="grid grid-cols-5 gap-y-3.5 gap-x-2 items-center">
              {/* Header Row */}
              <div className="col-span-2 font-table-header text-[10px] text-on-surface-variant uppercase">ENTITY</div>
              <div className="font-table-header text-[10px] text-on-surface-variant text-center uppercase">MAPPED</div>
              <div className="font-table-header text-[10px] text-on-surface-variant text-center uppercase">PENDING</div>
              <div className="font-table-header text-[10px] text-on-surface-variant text-center uppercase">STATUS</div>

              {/* Rows */}
              {cpseList.map((cpse) => {
                const pendingPct = (100 - cpse.coveragePercentage).toFixed(0);
                return (
                  <React.Fragment key={cpse.id}>
                    <div 
                      onClick={() => setActiveScreen('datahub')}
                      className="col-span-2 font-data-mono text-xs text-on-surface flex items-center cursor-pointer hover:text-primary transition-colors"
                    >
                      <span className="w-2 h-2 rounded-full bg-primary mr-2" />
                      <span className="font-semibold">{cpse.name}</span>
                      <span className="text-[10px] text-on-surface-variant ml-1.5 hidden sm:inline">({cpse.sourceSystem.split(' ')[0]})</span>
                    </div>
                    
                    <div className="text-center font-data-mono text-xs text-on-surface-variant flex flex-col justify-center">
                      <div className="w-full bg-surface-container-high h-1.5 mb-1 rounded-full overflow-hidden">
                        <div 
                          className="bg-relationship-identical h-full rounded-full" 
                          style={{ width: `${cpse.coveragePercentage}%` }}
                        />
                      </div>
                      {cpse.coveragePercentage}%
                    </div>
                    
                    <div className="text-center font-data-mono text-xs text-on-surface-variant flex flex-col justify-center">
                      <div className="w-full bg-surface-container-high h-1.5 mb-1 rounded-full overflow-hidden">
                        <div 
                          className="bg-status-warning h-full rounded-full" 
                          style={{ width: `${pendingPct}%` }}
                        />
                      </div>
                      {pendingPct}%
                    </div>
                    
                    <div className="text-center flex justify-center items-center">
                      {cpse.status === 'HEALTHY' ? (
                        <span className="material-symbols-outlined text-status-success text-base fill-icon" title="Healthy Sync">
                          check_circle
                        </span>
                      ) : (
                        <span className="material-symbols-outlined text-status-warning text-base fill-icon" title="Requires Attention">
                          pending
                        </span>
                      )}
                    </div>
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};
