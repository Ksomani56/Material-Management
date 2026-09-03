import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  mockDashboardKPIs,
  mockDuplicateCandidatesTable
} from '../../data/mockData';

/* -----------------------------------------------------------------------
   Mini Sparkline Component for KPI Cards
   ----------------------------------------------------------------------- */
const Sparkline: React.FC<{ data: number[]; color: string }> = ({ data, color }) => {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const W = 80;
  const H = 28;
  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * W;
    const y = H - ((v - min) / range) * (H - 4) - 2;
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg width={W} height={H} className="overflow-visible shrink-0 opacity-80">
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

/* -----------------------------------------------------------------------
   SVG Area Chart — Blue (#3b82f6) & Indigo (#4144f4)
   ----------------------------------------------------------------------- */
const AreaChart: React.FC = () => {
  const [tooltip, setTooltip] = useState<{ x: number; y: number; label: string; v1: string; v2: string } | null>(null);

  const weeks = [
    { label: 'W1', approved: 18, dupes: 82 },
    { label: 'W2', approved: 22, dupes: 76 },
    { label: 'W3', approved: 19, dupes: 78 },
    { label: 'W4', approved: 28, dupes: 70 },
    { label: 'W5', approved: 35, dupes: 60 },
    { label: 'W6', approved: 40, dupes: 52 },
    { label: 'W7', approved: 55, dupes: 44 },
    { label: 'W8', approved: 65, dupes: 38 },
    { label: 'W9', approved: 72, dupes: 30 },
    { label: 'W10', approved: 80, dupes: 22 },
    { label: 'W11', approved: 90, dupes: 14 },
    { label: 'W12', approved: 94, dupes: 10 },
  ];

  const W = 650;
  const H = 220;
  const padL = 44;
  const padR = 12;
  const padT = 12;
  const padB = 32;
  const innerW = W - padL - padR;
  const innerH = H - padT - padB;

  const toX = (i: number) => padL + (i / (weeks.length - 1)) * innerW;
  const toY = (v: number) => padT + innerH - (v / 100) * innerH;

  const polyApproved = weeks.map((w, i) => `${toX(i)},${toY(w.approved)}`).join(' ');
  const polyDupes = weeks.map((w, i) => `${toX(i)},${toY(w.dupes)}`).join(' ');

  const areaApproved = `${padL},${padT + innerH} ${polyApproved} ${toX(weeks.length - 1)},${padT + innerH}`;
  const areaDupes = `${padL},${padT + innerH} ${polyDupes} ${toX(weeks.length - 1)},${padT + innerH}`;

  const gridLines = [0, 25, 50, 75, 100];

  return (
    <div className="relative w-full" style={{ height: `${H}px` }}>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="none"
        className="w-full h-full"
      >
        <defs>
          {/* Primary Blue gradient */}
          <linearGradient id="gradApproved" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.02" />
          </linearGradient>
          {/* Secondary Indigo gradient */}
          <linearGradient id="gradDupes" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#4144f4" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#4144f4" stopOpacity="0.02" />
          </linearGradient>
        </defs>

        {/* Horizontal grid lines */}
        {gridLines.map(g => (
          <g key={g}>
            <line
              x1={padL} y1={toY(g)} x2={W - padR} y2={toY(g)}
              stroke="rgba(255,255,255,0.07)" strokeWidth="1"
            />
            <text
              x={padL - 6} y={toY(g) + 4}
              textAnchor="end"
              fontSize="10"
              fill="rgba(255,255,255,0.35)"
              fontFamily="JetBrains Mono, monospace"
            >
              {g}%
            </text>
          </g>
        ))}

        {/* X-axis labels */}
        {weeks.map((w, i) => (
          i % 2 === 0 && (
            <text
              key={w.label}
              x={toX(i)}
              y={H - 8}
              textAnchor="middle"
              fontSize="10"
              fill="rgba(255,255,255,0.4)"
              fontFamily="JetBrains Mono, monospace"
            >
              {w.label}
            </text>
          )
        ))}

        {/* Approved CNMC area fill (blue) */}
        <polygon points={areaApproved} fill="url(#gradApproved)" />

        {/* Dupes/backlog area fill (indigo) */}
        <polygon points={areaDupes} fill="url(#gradDupes)" />

        {/* Approved line (blue) */}
        <polyline
          points={polyApproved}
          fill="none"
          stroke="#3b82f6"
          strokeWidth="2.5"
          strokeLinejoin="round"
          strokeLinecap="round"
        />

        {/* Dupes line (indigo) */}
        <polyline
          points={polyDupes}
          fill="none"
          stroke="#4144f4"
          strokeWidth="2.5"
          strokeLinejoin="round"
          strokeLinecap="round"
        />

        {/* Invisible hit areas for tooltip */}
        {weeks.map((w, i) => (
          <rect
            key={i}
            x={toX(i) - 20}
            y={padT}
            width={40}
            height={innerH}
            fill="transparent"
            onMouseEnter={() => setTooltip({
              x: toX(i),
              y: Math.min(toY(w.approved), toY(w.dupes)) - 8,
              label: w.label,
              v1: `${w.approved}%`,
              v2: `${w.dupes}%`,
            })}
            onMouseLeave={() => setTooltip(null)}
            style={{ cursor: 'crosshair' }}
          />
        ))}

        {/* Tooltip marker dots */}
        {tooltip && weeks.map((w, i) => {
          if (weeks[i].label !== tooltip.label) return null;
          return (
            <g key="dot">
              <circle cx={toX(i)} cy={toY(w.approved)} r="5" fill="#3b82f6" stroke="#fff" strokeWidth="1.5" />
              <circle cx={toX(i)} cy={toY(w.dupes)} r="5" fill="#4144f4" stroke="#fff" strokeWidth="1.5" />
            </g>
          );
        })}
      </svg>

      {/* Floating Tooltip */}
      {tooltip && (
        <div
          className="absolute pointer-events-none z-10 text-xs rounded-lg shadow-xl px-3 py-2 mono"
          style={{
            left: `${(tooltip.x / W) * 100}%`,
            top: `${(Math.max(0, tooltip.y - 45) / H) * 100}%`,
            transform: 'translateX(-50%)',
            background: 'rgba(17,17,23,0.96)',
            border: '1px solid rgba(59,130,246,0.3)',
            color: 'var(--text-primary)',
            backdropFilter: 'blur(8px)',
          }}
        >
          <div className="font-bold mb-1.5" style={{ color: 'var(--text-primary)' }}>{tooltip.label} Overview</div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: '#3b82f6' }} />
            <span>Approved: <strong style={{ color: '#3b82f6' }}>{tooltip.v1}</strong></span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: '#4144f4' }} />
            <span>Backlog: <strong style={{ color: '#818cf8' }}>{tooltip.v2}</strong></span>
          </div>
        </div>
      )}
    </div>
  );
};

/* -----------------------------------------------------------------------
   KPI Card Component with Sparkline
   ----------------------------------------------------------------------- */
interface KpiCardProps {
  label: string;
  value: string;
  delta?: string;
  deltaUp?: boolean;
  icon?: string;
  sparklineData?: number[];
  sparklineColor?: string;
}

const KpiCard: React.FC<KpiCardProps> = ({ 
  label, 
  value, 
  delta, 
  deltaUp, 
  icon,
  sparklineData = [10, 15, 12, 18, 24, 28, 35],
  sparklineColor = '#3b82f6'
}) => (
  <div
    style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
    className="rounded-xl p-5 flex flex-col justify-between card-hover transition-all"
  >
    <div className="flex items-start justify-between mb-3">
      <span style={{ color: 'var(--text-secondary)' }} className="text-sm font-medium">{label}</span>
      {icon && (
        <div
          style={{ background: 'var(--bg-hover)', color: 'var(--text-muted)' }}
          className="w-8 h-8 rounded-lg flex items-center justify-center"
        >
          <span className="material-symbols-outlined text-[18px]">{icon}</span>
        </div>
      )}
    </div>
    
    <div className="flex items-end justify-between gap-2 mt-2">
      <div>
        <span
          style={{ color: 'var(--text-primary)' }}
          className="text-2xl sm:text-3xl font-bold tracking-tight leading-none block font-mono"
        >
          {value}
        </span>
        {delta && (
          <span
            className="text-xs font-semibold mt-2 flex items-center gap-1"
            style={{ color: deltaUp ? 'var(--success)' : 'var(--error)' }}
          >
            <span className="material-symbols-outlined text-[14px]">
              {deltaUp ? 'arrow_upward' : 'arrow_downward'}
            </span>
            {delta} vs last month
          </span>
        )}
      </div>

      <Sparkline data={sparklineData} color={sparklineColor} />
    </div>
  </div>
);

/* -----------------------------------------------------------------------
   Main Overview Screen
   ----------------------------------------------------------------------- */
export const OverviewScreen: React.FC = () => {
  const { setActiveScreen, reviewQueue, cpseList, rationalizationActions } = useApp();

  return (
    <main
      style={{ background: 'var(--bg)' }}
      className="flex-1 overflow-y-auto p-6 space-y-6"
    >
      {/* 4 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          label="Total Source Records"
          value={mockDashboardKPIs.totalSourceCodes}
          delta="+12.4%"
          deltaUp={true}
          icon="dataset"
          sparklineData={[12, 14, 13, 16, 18, 22, 25]}
          sparklineColor="#3b82f6"
        />
        <KpiCard
          label="Approved Masters (CNMC)"
          value={mockDashboardKPIs.canonicalMaterialsCount}
          delta="+14.2k"
          deltaUp={true}
          icon="inventory_2"
          sparklineData={[8, 11, 15, 20, 24, 29, 34]}
          sparklineColor="#3b82f6"
        />
        <KpiCard
          label="Harmonization Coverage"
          value={`${mockDashboardKPIs.mappingCoveragePct}%`}
          delta="+3.1%"
          deltaUp={true}
          icon="pie_chart"
          sparklineData={[50, 55, 62, 68, 71, 75, 78.4]}
          sparklineColor="#4144f4"
        />
        <KpiCard
          label="Review Backlog"
          value={reviewQueue.length > 0 ? (12400 + reviewQueue.length).toLocaleString() : '12,405'}
          delta="-5"
          deltaUp={false}
          icon="fact_check"
          sparklineData={[40, 38, 35, 30, 26, 20, 15]}
          sparklineColor="#f59e0b"
        />
      </div>

      {/* Main Two-Column Row: Area Chart + Pipeline Stages */}
      <div className="grid grid-cols-12 gap-5">
        {/* Area Chart (span 8) */}
        <div
          style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
          className="col-span-12 lg:col-span-8 rounded-xl p-6"
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 style={{ color: 'var(--text-primary)' }} className="text-base font-bold">
                Standardization Velocity
              </h3>
              <p style={{ color: 'var(--text-secondary)' }} className="text-xs mt-0.5">
                Weekly harmonization progress vs duplicate backlog resolution
              </p>
            </div>
            {/* Legend */}
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-1 rounded-full" style={{ background: '#3b82f6', display: 'inline-block' }} />
                <span style={{ color: 'var(--text-secondary)' }}>Approved CNMC</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-1 rounded-full" style={{ background: '#4144f4', display: 'inline-block' }} />
                <span style={{ color: 'var(--text-secondary)' }}>Backlog</span>
              </div>
            </div>
          </div>

          <AreaChart />

          <div
            className="flex justify-between text-xs pt-4 mt-2"
            style={{ borderTop: '1px solid var(--border)', color: 'var(--text-muted)' }}
          >
            <span>12-Week Period View</span>
            <span style={{ color: 'var(--success)' }} className="font-semibold flex items-center gap-1">
              <span className="material-symbols-outlined text-[15px]">trending_up</span>
              Steady upward standardization rate across CPSEs
            </span>
          </div>
        </div>

        {/* Pipeline / Rationalization Stages (span 4) */}
        <div
          style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
          className="col-span-12 lg:col-span-4 rounded-xl p-6 flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-2">
              <div>
                <h3 style={{ color: 'var(--text-primary)' }} className="text-base font-bold">
                  Rationalization Pipeline
                </h3>
                <p style={{ color: 'var(--text-secondary)' }} className="text-xs mt-0.5">
                  Distribution by staged action type
                </p>
              </div>
            </div>

            <div className="space-y-4 mt-5">
              {rationalizationActions.map((act, idx) => {
                const colors = ['#3b82f6', '#4144f4', '#f59e0b', '#22c55e'];
                const c = colors[idx % colors.length];
                return (
                  <div key={act.id}>
                    <div className="flex justify-between items-center mb-1.5">
                      <span style={{ color: 'var(--text-primary)' }} className="text-xs font-semibold">
                        {act.title}
                      </span>
                      <div className="flex items-center gap-2">
                        <span style={{ color: 'var(--text-muted)' }} className="text-xs mono">
                          {act.recordCount.split(' ')[0]}
                        </span>
                        <span className="text-xs font-bold font-mono" style={{ color: c }}>{act.percentage}%</span>
                      </div>
                    </div>
                    <div style={{ background: 'var(--bg-hover)' }} className="w-full h-2 rounded-full overflow-hidden">
                      <div
                        style={{ width: `${act.percentage}%`, background: c }}
                        className="h-full rounded-full transition-all duration-500"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div style={{ borderTop: '1px solid var(--border)' }} className="pt-4 mt-6 flex justify-between items-center">
            <div>
              <span style={{ color: 'var(--text-muted)' }} className="text-xs block">Total Pipeline Value</span>
              <span style={{ color: 'var(--text-secondary)' }} className="text-[11px]">Procurement pool potential</span>
            </div>
            <span style={{ color: 'var(--blue)' }} className="text-xl font-bold mono">₹4,820 Cr</span>
          </div>
        </div>
      </div>

      {/* Bottom Row: Pending Duplicates + CPSE Status */}
      <div className="grid grid-cols-12 gap-5">
        {/* Pending Duplicate Candidates (span 7) */}
        <div
          style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
          className="col-span-12 lg:col-span-7 rounded-xl overflow-hidden"
        >
          <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid var(--border)' }}>
            <div>
              <h3 style={{ color: 'var(--text-primary)' }} className="text-sm font-bold">
                Recent Duplicate Candidates
              </h3>
              <p style={{ color: 'var(--text-muted)' }} className="text-xs">Latest activity requiring review</p>
            </div>
            <button
              onClick={() => setActiveScreen('review')}
              className="text-xs font-semibold flex items-center gap-1 hover:underline"
              style={{ color: 'var(--blue)' }}
            >
              View all <span className="material-symbols-outlined text-[15px]">arrow_outward</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-subtle)', background: 'var(--bg-hover)' }}>
                  {['Group', 'Description', 'Candidates', 'Confidence', ''].map(h => (
                    <th
                      key={h}
                      style={{ color: 'var(--text-muted)' }}
                      className="px-5 py-3 text-xs font-semibold uppercase tracking-wide"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {mockDuplicateCandidatesTable.slice(0, 5).map((item, idx) => (
                  <tr
                    key={idx}
                    style={{ borderBottom: '1px solid var(--border-subtle)' }}
                    className="hover:opacity-90 transition-opacity"
                  >
                    <td style={{ color: 'var(--blue)' }} className="px-5 py-3.5 mono text-xs font-bold">
                      {item.groupCode}
                    </td>
                    <td style={{ color: 'var(--text-primary)' }} className="px-5 py-3.5 max-w-[240px] truncate font-medium" title={item.description}>
                      {item.description}
                    </td>
                    <td style={{ color: 'var(--text-secondary)' }} className="px-5 py-3.5 text-center mono">
                      {item.candidates}
                    </td>
                    <td className="px-5 py-3.5 text-center mono font-bold" style={{ color: item.confidence >= 90 ? 'var(--success)' : 'var(--warning)' }}>
                      {item.confidence}%
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <button
                        onClick={() => setActiveScreen('review')}
                        style={{ color: 'var(--blue)' }}
                        className="text-xs font-semibold hover:underline"
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

        {/* Top CPSE Performers (span 5) */}
        <div
          style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
          className="col-span-12 lg:col-span-5 rounded-xl"
        >
          <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid var(--border)' }}>
            <div>
              <h3 style={{ color: 'var(--text-primary)' }} className="text-sm font-bold">Top CPSE Coverage</h3>
              <p style={{ color: 'var(--text-muted)' }} className="text-xs">This month's leaders in harmonization</p>
            </div>
            <span className="material-symbols-outlined text-[20px]" style={{ color: 'var(--warning)' }}>
              emoji_events
            </span>
          </div>
          <div className="p-5 space-y-4">
            {cpseList
              .slice()
              .sort((a, b) => b.coveragePercentage - a.coveragePercentage)
              .slice(0, 4)
              .map((cpse, idx) => {
                const medals = ['🥇', '🥈', '🥉', '🏅'];
                return (
                  <div key={cpse.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-lg w-6">{medals[idx]}</span>
                      <div>
                        <p style={{ color: 'var(--text-primary)' }} className="text-sm font-bold leading-tight">{cpse.name}</p>
                        <p style={{ color: 'var(--text-muted)' }} className="text-xs truncate max-w-[140px] mt-0.5">{cpse.sector}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p style={{ color: 'var(--blue)' }} className="text-base font-bold mono leading-tight">
                        {cpse.coveragePercentage}%
                      </p>
                      <p style={{ color: 'var(--text-muted)' }} className="text-xs mono mt-0.5">
                        {cpse.mappedRecords.toLocaleString()} CNMC
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
