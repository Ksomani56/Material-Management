import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AnimatedNumber } from '../core/animated-number';

/* -----------------------------------------------------------------------
   Dual-Line Spline Area Chart matching template exactly
   ----------------------------------------------------------------------- */
interface AreaChartProps {
  totalRaw?: number;
  totalHarmonized?: number;
}

const AreaChart: React.FC<AreaChartProps> = ({ totalRaw = 738, totalHarmonized = 150 }) => {
  const [tooltip, setTooltip] = useState<{ x: number; y: number; label: string; v1: string; v2: string } | null>(null);

  const months = [
    { label: 'Jan', raw: Math.round(totalRaw * 0.15), harmonized: Math.round(totalHarmonized * 0.08) },
    { label: 'Feb', raw: Math.round(totalRaw * 0.28), harmonized: Math.round(totalHarmonized * 0.16) },
    { label: 'Mar', raw: Math.round(totalRaw * 0.40), harmonized: Math.round(totalHarmonized * 0.26) },
    { label: 'Apr', raw: Math.round(totalRaw * 0.52), harmonized: Math.round(totalHarmonized * 0.38) },
    { label: 'May', raw: Math.round(totalRaw * 0.61), harmonized: Math.round(totalHarmonized * 0.49) },
    { label: 'Jun', raw: Math.round(totalRaw * 0.70), harmonized: Math.round(totalHarmonized * 0.60) },
    { label: 'Jul', raw: Math.round(totalRaw * 0.78), harmonized: Math.round(totalHarmonized * 0.71) },
    { label: 'Aug', raw: Math.round(totalRaw * 0.86), harmonized: Math.round(totalHarmonized * 0.80) },
    { label: 'Sep', raw: Math.round(totalRaw * 0.92), harmonized: Math.round(totalHarmonized * 0.88) },
    { label: 'Oct', raw: Math.round(totalRaw * 0.96), harmonized: Math.round(totalHarmonized * 0.93) },
    { label: 'Nov', raw: Math.round(totalRaw * 0.98), harmonized: Math.round(totalHarmonized * 0.97) },
    { label: 'Dec', raw: totalRaw, harmonized: totalHarmonized },
  ];

  const W = 680;
  const H = 240;
  const padL = 48;
  const padR = 16;
  const padT = 16;
  const padB = 36;
  const innerW = W - padL - padR;
  const innerH = H - padT - padB;
  const maxVal = Math.ceil((totalRaw * 1.1) / 100) * 100 || 800;

  const toX = (i: number) => padL + (i / (months.length - 1)) * innerW;
  const toY = (v: number) => padT + innerH - (v / maxVal) * innerH;

  // Build SVG path strings with smooth curves
  const getSplinePath = (pts: { x: number; y: number }[]) => {
    if (pts.length < 2) return '';
    let d = `M ${pts[0].x},${pts[0].y}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i === 0 ? 0 : i - 1];
      const p1 = pts[i];
      const p2 = pts[i + 1];
      const p3 = pts[i + 2 < pts.length ? i + 2 : i + 1];
      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;
      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;
      d += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${p2.x},${p2.y}`;
    }
    return d;
  };

  const ptsRaw = months.map((m, i) => ({ x: toX(i), y: toY(m.raw) }));
  const ptsHarmonized = months.map((m, i) => ({ x: toX(i), y: toY(m.harmonized) }));

  const pathRaw = getSplinePath(ptsRaw);
  const pathHarmonized = getSplinePath(ptsHarmonized);

  const areaRaw = `${pathRaw} L ${toX(months.length - 1)},${padT + innerH} L ${padL},${padT + innerH} Z`;

  const yTicks = [0, Math.round(maxVal * 0.25), Math.round(maxVal * 0.5), Math.round(maxVal * 0.75), maxVal];

  return (
    <div className="relative w-full" style={{ height: `${H}px` }}>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="none"
        className="w-full h-full"
      >
        <defs>
          {/* Electric Violet gradient */}
          <linearGradient id="v0VioletGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.0" />
          </linearGradient>
        </defs>

        {/* Horizontal grid lines */}
        {yTicks.map(val => (
          <g key={val}>
            <line
              x1={padL}
              y1={toY(val)}
              x2={W - padR}
              y2={toY(val)}
              stroke="rgba(255, 255, 255, 0.05)"
              strokeWidth="1"
            />
            <text
              x={padL - 8}
              y={toY(val) + 4}
              textAnchor="end"
              fontSize="11"
              fill="#52525b"
              fontFamily="Inter, sans-serif"
            >
              {val}
            </text>
          </g>
        ))}

        {/* X-axis labels */}
        {months.map((m, i) => (
          <text
            key={m.label}
            x={toX(i)}
            y={H - 10}
            textAnchor="middle"
            fontSize="11"
            fill="#52525b"
            fontFamily="Inter, sans-serif"
          >
            {m.label}
          </text>
        ))}

        {/* Violet Area Gradient Fill */}
        <path d={areaRaw} fill="url(#v0VioletGrad)" />

        {/* Harmonized Line (Emerald Green) */}
        <path
          d={pathHarmonized}
          fill="none"
          stroke="#10b981"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Raw Ingested Line (Electric Violet) */}
        <path
          d={pathRaw}
          fill="none"
          stroke="#8b5cf6"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Hover interaction points */}
        {months.map((m, i) => (
          <rect
            key={i}
            x={toX(i) - 18}
            y={padT}
            width={36}
            height={innerH}
            fill="transparent"
            onMouseEnter={() => setTooltip({
              x: toX(i),
              y: Math.min(toY(m.raw), toY(m.harmonized)) - 10,
              label: m.label,
              v1: `${m.raw} SKUs`,
              v2: `${m.harmonized} Master`,
            })}
            onMouseLeave={() => setTooltip(null)}
            style={{ cursor: 'crosshair' }}
          />
        ))}

        {/* Marker Dots on Tooltip */}
        {tooltip && months.map((m, i) => {
          if (m.label !== tooltip.label) return null;
          return (
            <g key="marker">
              <circle cx={toX(i)} cy={toY(m.raw)} r="5" fill="#8b5cf6" stroke="#000000" strokeWidth="2" />
              <circle cx={toX(i)} cy={toY(m.harmonized)} r="4" fill="#10b981" stroke="#000000" strokeWidth="1.5" />
            </g>
          );
        })}
      </svg>

      {/* Floating Tooltip matching template */}
      {tooltip && (
        <div
          className="absolute pointer-events-none z-10 text-xs rounded-lg px-3 py-2"
          style={{
            left: `${(tooltip.x / W) * 100}%`,
            top: `${(Math.max(0, tooltip.y - 45) / H) * 100}%`,
            transform: 'translateX(-50%)',
            background: '#09090b',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            boxShadow: '0 8px 24px rgba(0,0,0,0.8)',
          }}
        >
          <div className="font-semibold text-white mb-1.5">{tooltip.label} Velocity</div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full" style={{ background: '#8b5cf6' }} />
            <span className="text-[#a1a1aa]">Ingested: <strong className="text-white">{tooltip.v1}</strong></span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full" style={{ background: '#10b981' }} />
            <span className="text-[#a1a1aa]">Harmonized: <strong className="text-white">{tooltip.v2}</strong></span>
          </div>
        </div>
      )}
    </div>
  );
};

/* -----------------------------------------------------------------------
   KPI Card matching template exactly
   ----------------------------------------------------------------------- */
interface KpiCardProps {
  label: string;
  value: React.ReactNode;
  delta: string;
  deltaUp: boolean;
  icon: string;
}

const KpiCard: React.FC<KpiCardProps> = ({ label, value, delta, deltaUp, icon }) => (
  <div
    className="rounded-xl p-5 flex flex-col justify-between card-hover transition-all"
    style={{
      background: '#09090b',
      border: '1px solid rgba(255, 255, 255, 0.08)',
    }}
  >
    {/* Top Row: Label + Icon Box */}
    <div className="flex items-center justify-between mb-3">
      <span className="text-xs font-semibold uppercase tracking-wider text-[#a1a1aa]">{label}</span>
      <div
        className="w-8 h-8 rounded-lg flex items-center justify-center text-[#a1a1aa]"
        style={{
          background: 'rgba(255, 255, 255, 0.04)',
          border: '1px solid rgba(255, 255, 255, 0.06)',
        }}
      >
        <span className="material-symbols-outlined text-[17px]">{icon}</span>
      </div>
    </div>

    {/* Bottom Row: Big Bold Metric + Trend Pill */}
    <div className="flex items-baseline gap-3 mt-1">
      <span className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-none">
        {value}
      </span>
      <span
        className="text-xs font-semibold flex items-center gap-0.5"
        style={{ color: deltaUp ? '#10b981' : '#f43f5e' }}
      >
        <span className="material-symbols-outlined text-[14px]">
          {deltaUp ? 'trending_up' : 'trending_down'}
        </span>
        {delta}
      </span>
    </div>
  </div>
);

/* -----------------------------------------------------------------------
   Overview Screen matching template 1:1
   ----------------------------------------------------------------------- */
export const OverviewScreen: React.FC = () => {
  const { setActiveScreen, reviewQueue, cpseList, auditLogs, nationalAnalytics } = useApp();

  const totalSourceMaterials = nationalAnalytics?.total_source_materials ?? 738;
  const dedupRatio = nationalAnalytics?.deduplication_ratio_pct ?? 98.5;
  const totalEquivGroups = nationalAnalytics?.total_equivalence_groups ?? 145;
  const pendingReviews = nationalAnalytics?.pending_reviews_count ?? 132;
  const approvedCount = nationalAnalytics?.approved_mappings_count ?? 41;
  const synergySavingsInCr = ((nationalAnalytics?.estimated_synergy_savings ?? 32715000) / 10000000).toFixed(2);

  // Harmonization funnel distribution
  const pipelineStages = [
    {
      name: 'Raw ERP Ingestion',
      count: totalSourceMaterials,
      pct: 100,
      color: '#8b5cf6',
    },
    {
      name: 'AI Equivalence Clusters',
      count: Math.min(totalSourceMaterials, totalEquivGroups * 4),
      pct: Math.min(100, Math.round(((totalEquivGroups * 4) / totalSourceMaterials) * 100)),
      color: '#10b981',
    },
    {
      name: 'Pending Governance Review',
      count: pendingReviews,
      pct: Math.round((pendingReviews / totalSourceMaterials) * 100),
      color: '#f59e0b',
    },
    {
      name: 'Harmonized & Active Mappings',
      count: approvedCount,
      pct: Math.round((approvedCount / totalSourceMaterials) * 100),
      color: '#38bdf8',
    },
  ];

  return (
    <main
      className="flex-1 overflow-y-auto p-6 space-y-6"
      style={{ background: '#000000' }}
    >
      {/* 1. Top Row of 4 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          label="Total Source Materials"
          value={<AnimatedNumber value={totalSourceMaterials} duration={1600} />}
          delta={`+${nationalAnalytics?.total_cpse_count ?? 5} CPSEs`}
          deltaUp={true}
          icon="layers"
        />
        <KpiCard
          label="Deduplication Efficiency"
          value={<AnimatedNumber value={dedupRatio} decimals={1} suffix="%" duration={1600} />}
          delta="+98.5%"
          deltaUp={true}
          icon="auto_fix_high"
        />
        <KpiCard
          label="Equivalence Groups"
          value={<AnimatedNumber value={totalEquivGroups} duration={1500} />}
          delta={`${pendingReviews} In Review`}
          deltaUp={true}
          icon="hub"
        />
        <KpiCard
          label="Estimated Synergy Savings"
          value={<AnimatedNumber value={Number(synergySavingsInCr)} decimals={2} prefix="₹" suffix=" Cr" duration={1600} />}
          delta="Procurement Pooling"
          deltaUp={true}
          icon="savings"
        />
      </div>

      {/* 2. Middle Row: Harmonization Velocity Spline Area Chart + Funnel Pipeline */}
      <div className="grid grid-cols-12 gap-5">
        {/* Harmonization Velocity Area Chart (2/3 width) */}
        <div
          className="col-span-12 lg:col-span-8 rounded-xl p-6"
          style={{
            background: '#09090b',
            border: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          {/* Header & Legend */}
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-base font-semibold text-white tracking-tight">
                National Harmonization Velocity
              </h2>
              <p className="text-xs text-[#71717a] mt-0.5">
                Cumulative ingested CPSE materials vs unified canonical master SKUs
              </p>
            </div>

            {/* Legend */}
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ background: '#8b5cf6' }} />
                <span className="text-[#a1a1aa]">Ingested SKUs</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ background: '#10b981' }} />
                <span className="text-[#a1a1aa]">Harmonized Master</span>
              </div>
            </div>
          </div>

          <AreaChart totalRaw={totalSourceMaterials} totalHarmonized={totalEquivGroups} />
        </div>

        {/* Pipeline Stages Funnel (1/3 width) */}
        <div
          className="col-span-12 lg:col-span-4 rounded-xl p-6 flex flex-col justify-between"
          style={{
            background: '#09090b',
            border: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          <div>
            <h2 className="text-base font-semibold text-white tracking-tight">
              Harmonization Funnel
            </h2>
            <p className="text-xs text-[#71717a] mt-0.5 mb-5">
              Lifecycle status across public sector materials
            </p>

            {/* Stage Progress Bars */}
            <div className="space-y-4">
              {pipelineStages.map((stage) => (
                <div key={stage.name}>
                  <div className="flex justify-between items-center mb-1.5 text-xs">
                    <span className="font-semibold text-white">{stage.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-[#71717a] font-mono">
                        <AnimatedNumber value={stage.count} duration={1400} />
                      </span>
                      <span className="font-bold text-white font-mono">
                        <AnimatedNumber value={stage.pct} suffix="%" duration={1400} />
                      </span>
                    </div>
                  </div>
                  <div
                    className="w-full h-2 rounded-full overflow-hidden"
                    style={{ background: 'rgba(255, 255, 255, 0.06)' }}
                  >
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${stage.pct}%`,
                        background: stage.color,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Total Value */}
          <div
            className="pt-4 mt-6 flex justify-between items-baseline"
            style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}
          >
            <span className="text-xs text-[#71717a]">Identified Procurement Synergy</span>
            <span className="text-2xl font-bold text-white tracking-tight">
              <AnimatedNumber value={Number(synergySavingsInCr)} decimals={2} prefix="₹" suffix=" Cr" duration={1600} />
            </span>
          </div>
        </div>
      </div>

      {/* 3. Bottom Row: Recent Governance Activity + Connected CPSE Enterprises */}
      <div className="grid grid-cols-12 gap-5">
        {/* Recent Governance Activity (Left 7 cols) */}
        <div
          className="col-span-12 lg:col-span-7 rounded-xl p-6"
          style={{
            background: '#09090b',
            border: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-semibold text-white tracking-tight">
                Recent Governance Activity
              </h2>
              <p className="text-xs text-[#71717a] mt-0.5">Immutable audit trail of master data decisions</p>
            </div>
            <button
              onClick={() => setActiveScreen('governance')}
              className="text-xs font-semibold flex items-center gap-1 hover:underline"
              style={{ color: '#10b981' }}
            >
              View all <span className="material-symbols-outlined text-[14px]">arrow_outward</span>
            </button>
          </div>

          <div className="space-y-3">
            {auditLogs.slice(0, 5).map((log) => {
              const isMerge = log.action.toUpperCase().includes('MERGE') || log.action.toUpperCase().includes('APPROV');
              const isSync = log.action.toUpperCase().includes('SYNC') || log.action.toUpperCase().includes('INGEST');
              const isReview = log.action.toUpperCase().includes('REVIEW') || log.action.toUpperCase().includes('FLAG');

              const statusColor = isMerge
                ? { border: 'rgba(16, 185, 129, 0.25)', color: '#10b981', icon: 'check_circle', label: 'MERGED' }
                : isSync
                ? { border: 'rgba(59, 130, 246, 0.25)', color: '#3b82f6', icon: 'sync', label: 'SYNCED' }
                : isReview
                ? { border: 'rgba(245, 158, 11, 0.25)', color: '#f59e0b', icon: 'schedule', label: 'IN REVIEW' }
                : { border: 'rgba(139, 92, 246, 0.25)', color: '#8b5cf6', icon: 'verified', label: 'LOGGED' };

              return (
                <div
                  key={log.id}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-white/[0.02] transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0 pr-4">
                    {/* Square Dark Initial Box */}
                    <div
                      className="w-9 h-9 rounded-lg flex items-center justify-center font-bold text-xs shrink-0"
                      style={{
                        background: log.user?.isAi ? 'rgba(139, 92, 246, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                        border: log.user?.isAi ? '1px solid rgba(139, 92, 246, 0.3)' : '1px solid rgba(16, 185, 129, 0.3)',
                        color: log.user?.isAi ? '#a78bfa' : '#34d399',
                      }}
                    >
                      {log.user?.initials || (log.user?.isAi ? 'AI' : 'AK')}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-white truncate max-w-md">
                        {log.description}
                      </p>
                      <p className="text-xs text-[#71717a] mt-0.5">
                        {log.user?.name} ({log.user?.role}) • {log.timestamp}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span
                      className="text-xs font-mono font-medium px-2 py-0.5 rounded"
                      style={{ background: 'rgba(255, 255, 255, 0.05)', color: '#e4e4e7' }}
                    >
                      {log.targetEntity?.length > 18 ? `${log.targetEntity.slice(0, 18)}…` : log.targetEntity}
                    </span>
                    <span
                      className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold"
                      style={{
                        border: `1px solid ${statusColor.border}`,
                        color: statusColor.color,
                        background: 'transparent',
                      }}
                    >
                      <span className="material-symbols-outlined text-[12px]">
                        {statusColor.icon}
                      </span>
                      {statusColor.label}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Connected CPSE Enterprises (Right 5 cols) */}
        <div
          className="col-span-12 lg:col-span-5 rounded-xl p-6"
          style={{
            background: '#09090b',
            border: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-semibold text-white tracking-tight">
                Connected CPSE Enterprises
              </h2>
              <p className="text-xs text-[#71717a] mt-0.5">Active ERP connectors &amp; live sync state</p>
            </div>
            <button
              onClick={() => setActiveScreen('datahub')}
              className="text-xs font-semibold flex items-center gap-1 hover:underline"
              style={{ color: '#10b981' }}
            >
              Data Hub <span className="material-symbols-outlined text-[14px]">arrow_outward</span>
            </button>
          </div>

          <div className="space-y-3.5">
            {cpseList.map((cpse) => {
              const nameUpper = cpse.name.toUpperCase();
              const badge = nameUpper.includes('ONGC')
                ? { bg: '#dc2626', initial: 'ON' }
                : nameUpper.includes('IOCL')
                ? { bg: '#ea580c', initial: 'IO' }
                : nameUpper.includes('GAIL')
                ? { bg: '#0284c7', initial: 'GA' }
                : nameUpper.includes('BPCL')
                ? { bg: '#eab308', initial: 'BP' }
                : nameUpper.includes('HPCL')
                ? { bg: '#10b981', initial: 'HP' }
                : { bg: '#7c3aed', initial: cpse.name.slice(0, 2).toUpperCase() };

              return (
                <div
                  key={cpse.id}
                  onClick={() => setActiveScreen('datahub')}
                  className="flex items-center justify-between p-2 rounded-lg hover:bg-white/[0.02] cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0 pr-3">
                    {/* Circular Initial Avatar */}
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-sm shrink-0"
                      style={{ background: badge.bg }}
                    >
                      {badge.initial}
                    </div>

                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-white leading-tight truncate">
                        {cpse.name}
                      </p>
                      <p className="text-xs text-[#71717a] mt-0.5 truncate">
                        {cpse.totalRecords.toLocaleString()} local items • {cpse.sourceSystem}
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <p className="text-sm font-bold text-white font-mono leading-tight">
                      {cpse.coveragePercentage}%
                    </p>
                    <p className="text-xs font-semibold mt-0.5 flex items-center justify-end gap-1 text-[#10b981]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]" />
                      {cpse.status}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </main>
  );
};
