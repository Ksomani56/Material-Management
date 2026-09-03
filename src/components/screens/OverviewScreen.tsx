import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  mockDashboardKPIs,
  mockMappingHealthTrend,
  mockDuplicateCandidatesTable
} from '../../data/mockData';

/* -----------------------------------------------------------------------
   SVG Area Chart — matches the SalesOps reference screenshot exactly
   ----------------------------------------------------------------------- */
const AreaChart: React.FC = () => {
  const [tooltip, setTooltip] = useState<{ x: number; y: number; label: string; v1: string; v2: string } | null>(null);

  // Extended weekly data for a fuller chart (12 weeks)
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

  const W = 600;
  const H = 200;
  const padL = 40;
  const padR = 10;
  const padT = 10;
  const padB = 30;
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
          {/* Cyan (approved CNMC) gradient — reference line 1 */}
          <linearGradient id="gradApproved" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.02" />
          </linearGradient>
          {/* Green (target/harmonization) gradient — reference line 2 */}
          <linearGradient id="gradDupes" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#10b981" stopOpacity="0.02" />
          </linearGradient>
        </defs>

        {/* Horizontal grid lines */}
        {gridLines.map(g => (
          <g key={g}>
            <line
              x1={padL} y1={toY(g)} x2={W - padR} y2={toY(g)}
              stroke="rgba(255,255,255,0.06)" strokeWidth="1"
            />
            <text
              x={padL - 5} y={toY(g) + 4}
              textAnchor="end"
              fontSize="9"
              fill="rgba(255,255,255,0.3)"
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
              y={H - 6}
              textAnchor="middle"
              fontSize="9"
              fill="rgba(255,255,255,0.3)"
              fontFamily="JetBrains Mono, monospace"
            >
              {w.label}
            </text>
          )
        ))}

        {/* Approved CNMC area fill (cyan) */}
        <polygon points={areaApproved} fill="url(#gradApproved)" />

        {/* Dupes/backlog area fill (green) */}
        <polygon points={areaDupes} fill="url(#gradDupes)" />

        {/* Approved line (cyan) */}
        <polyline
          points={polyApproved}
          fill="none"
          stroke="#06b6d4"
          strokeWidth="2"
          strokeLinejoin="round"
          strokeLinecap="round"
        />

        {/* Dupes line (green) */}
        <polyline
          points={polyDupes}
          fill="none"
          stroke="#10b981"
          strokeWidth="2"
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
              <circle cx={toX(i)} cy={toY(w.approved)} r="4" fill="#06b6d4" />
              <circle cx={toX(i)} cy={toY(w.dupes)} r="4" fill="#10b981" />
            </g>
          );
        })}
      </svg>

      {/* Floating Tooltip */}
      {tooltip && (
        <div
          className="absolute pointer-events-none z-10 text-[11px] rounded shadow-xl px-2.5 py-1.5 mono"
          style={{
            left: `${(tooltip.x / 600) * 100}%`,
            top: `${(Math.max(0, tooltip.y - 40) / 200) * 100}%`,
            transform: 'translateX(-50%)',
            background: 'rgba(20,20,26,0.96)',
            border: '1px solid rgba(255,255,255,0.12)',
            color: 'var(--text-primary)',
            backdropFilter: 'blur(4px)',
          }}
        >
          <div className="font-semibold mb-1" style={{ color: 'var(--text-secondary)' }}>{tooltip.label}</div>
          <div className="flex items-center gap-1.5 mb-0.5">
            <span className="w-2 h-2 rounded-sm" style={{ background: '#06b6d4' }} />
            <span>Approved: <strong style={{ color: '#06b6d4' }}>{tooltip.v1}</strong></span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-sm" style={{ background: '#10b981' }} />
            <span>Backlog: <strong style={{ color: '#10b981' }}>{tooltip.v2}</strong></span>
          </div>
        </div>
      )}
    </div>
  );
};

/* -----------------------------------------------------------------------
   KPI Card — matches the SalesOps reference exactly
   ----------------------------------------------------------------------- */
interface KpiCardProps {
  label: string;
  value: string;
  delta?: string;
  deltaUp?: boolean;
  icon?: string;
  accent?: boolean;
}

const KpiCard: React.FC<KpiCardProps> = ({ label, value, delta, deltaUp, icon, accent }) => (
  <div
    style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
    className="rounded-lg p-4 flex flex-col justify-between"
  >
    <div className="flex items-start justify-between mb-2">
      <span style={{ color: 'var(--text-secondary)' }} className="text-xs">{label}</span>
      {icon && (
        <div
          style={{ background: 'var(--bg-hover)', color: 'var(--text-muted)' }}
          className="w-7 h-7 rounded flex items-center justify-center"
        >
          <span className="material-symbols-outlined text-[16px]">{icon}</span>
        </div>
      )}
    </div>
    <div className="flex items-end gap-2">
      <span
        style={{ color: accent ? 'var(--accent)' : 'var(--text-primary)' }}
        className="text-2xl font-bold tracking-tight leading-none"
      >
        {value}
      </span>
      {delta && (
        <span
          className="text-xs font-medium mb-0.5 flex items-center gap-0.5"
          style={{ color: deltaUp ? 'var(--success)' : 'var(--error)' }}
        >
          <span className="material-symbols-outlined text-[13px]">{deltaUp ? 'arrow_upward' : 'arrow_downward'}</span>
          {delta}
        </span>
      )}
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
      className="flex-1 overflow-y-auto p-5 space-y-4"
    >
      {/* 4 KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <KpiCard
          label="Total Source Records"
          value={mockDashboardKPIs.totalSourceCodes}
          delta="+12.4%"
          deltaUp={true}
          icon="dataset"
        />
        <KpiCard
          label="Approved Masters (CNMC)"
          value={mockDashboardKPIs.canonicalMaterialsCount}
          delta="+14.2k"
          deltaUp={true}
          icon="inventory_2"
          accent={true}
        />
        <KpiCard
          label="Harmonization Coverage"
          value={`${mockDashboardKPIs.mappingCoveragePct}%`}
          delta="+3.1%"
          deltaUp={true}
          icon="pie_chart"
        />
        <KpiCard
          label="Review Backlog"
          value={reviewQueue.length > 0 ? (12400 + reviewQueue.length).toLocaleString() : '12,405'}
          delta="-5"
          deltaUp={false}
          icon="fact_check"
        />
      </div>

      {/* Main Two-Column Row: Area Chart + Pipeline Stages */}
      <div className="grid grid-cols-12 gap-3">
        {/* Area Chart (span 8) */}
        <div
          style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
          className="col-span-12 lg:col-span-8 rounded-lg p-4"
        >
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 style={{ color: 'var(--text-primary)' }} className="text-sm font-semibold">
                Standardization Velocity
              </h3>
              <p style={{ color: 'var(--text-muted)' }} className="text-xs mt-0.5">
                Weekly harmonization progress vs duplicate backlog resolution
              </p>
            </div>
            {/* Legend */}
            <div className="flex items-center gap-3 text-[11px]">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-0.5 rounded" style={{ background: '#06b6d4', display: 'inline-block' }} />
                <span style={{ color: 'var(--text-secondary)' }}>Approved CNMC</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-0.5 rounded" style={{ background: '#10b981', display: 'inline-block' }} />
                <span style={{ color: 'var(--text-secondary)' }}>Backlog</span>
              </div>
            </div>
          </div>

          <AreaChart />

          <div
            className="flex justify-between text-[11px] pt-3 mt-1"
            style={{ borderTop: '1px solid var(--border)', color: 'var(--text-muted)' }}
          >
            <span>12-Week period view</span>
            <span style={{ color: 'var(--success)' }} className="font-medium">Steady upward trend across all CPSEs</span>
          </div>
        </div>

        {/* Pipeline / Rationalization Stages (span 4) */}
        <div
          style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
          className="col-span-12 lg:col-span-4 rounded-lg p-4 flex flex-col"
        >
          <div className="flex items-center justify-between mb-1">
            <div>
              <h3 style={{ color: 'var(--text-primary)' }} className="text-sm font-semibold">
                Rationalization Pipeline
              </h3>
              <p style={{ color: 'var(--text-muted)' }} className="text-xs mt-0.5">
                Distribution by action type
              </p>
            </div>
          </div>

          <div className="flex-1 space-y-4 mt-4">
            {rationalizationActions.map((act, idx) => {
              const colors = ['#06b6d4', '#10b981', '#f59e0b', '#a78bfa'];
              const c = colors[idx % colors.length];
              return (
                <div key={act.id}>
                  <div className="flex justify-between items-center mb-1.5">
                    <span style={{ color: 'var(--text-primary)' }} className="text-xs font-medium">
                      {act.title}
                    </span>
                    <div className="flex items-center gap-2">
                      <span style={{ color: 'var(--text-secondary)' }} className="text-xs mono">
                        {act.recordCount.split(' ')[0]}
                      </span>
                      <span className="text-xs font-semibold" style={{ color: c }}>{act.percentage}%</span>
                    </div>
                  </div>
                  <div style={{ background: 'var(--bg-hover)' }} className="w-full h-1.5 rounded-full overflow-hidden">
                    <div
                      style={{ width: `${act.percentage}%`, background: c }}
                      className="h-full rounded-full transition-all duration-500"
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ borderTop: '1px solid var(--border)' }} className="pt-3 mt-4 flex justify-between items-center">
            <span style={{ color: 'var(--text-muted)' }} className="text-xs">Total Pipeline Value</span>
            <span style={{ color: 'var(--text-primary)' }} className="text-lg font-bold mono">₹4,820 Cr</span>
          </div>
        </div>
      </div>

      {/* Bottom Row: Pending Duplicates + CPSE Status */}
      <div className="grid grid-cols-12 gap-3">
        {/* Pending Duplicate Candidates (span 7) */}
        <div
          style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
          className="col-span-12 lg:col-span-7 rounded-lg"
        >
          <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: '1px solid var(--border)' }}>
            <div>
              <h3 style={{ color: 'var(--text-primary)' }} className="text-xs font-semibold">
                Recent Duplicate Candidates
              </h3>
              <p style={{ color: 'var(--text-muted)' }} className="text-[11px]">Latest activity</p>
            </div>
            <button
              onClick={() => setActiveScreen('review')}
              className="text-xs font-medium flex items-center gap-1"
              style={{ color: 'var(--accent)' }}
            >
              View all <span className="material-symbols-outlined text-[13px]">arrow_outward</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                  {['Group', 'Description', 'Candidates', 'Confidence', ''].map(h => (
                    <th
                      key={h}
                      style={{ color: 'var(--text-muted)' }}
                      className="px-4 py-2 text-[11px] font-medium uppercase tracking-wide"
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
                    <td style={{ color: 'var(--text-secondary)' }} className="px-4 py-2.5 mono text-[11px]">
                      {item.groupCode}
                    </td>
                    <td style={{ color: 'var(--text-primary)' }} className="px-4 py-2.5 max-w-[220px] truncate" title={item.description}>
                      {item.description}
                    </td>
                    <td style={{ color: 'var(--text-secondary)' }} className="px-4 py-2.5 text-center mono">
                      {item.candidates}
                    </td>
                    <td className="px-4 py-2.5 text-center mono font-semibold" style={{ color: item.confidence >= 90 ? 'var(--success)' : 'var(--warning)' }}>
                      {item.confidence}%
                    </td>
                    <td className="px-4 py-2.5 text-right">
                      <button
                        onClick={() => setActiveScreen('review')}
                        style={{ color: 'var(--accent)' }}
                        className="text-[11px] font-medium hover:underline"
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
          className="col-span-12 lg:col-span-5 rounded-lg"
        >
          <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: '1px solid var(--border)' }}>
            <div>
              <h3 style={{ color: 'var(--text-primary)' }} className="text-xs font-semibold">Top CPSE Coverage</h3>
              <p style={{ color: 'var(--text-muted)' }} className="text-[11px]">This month's leaders</p>
            </div>
            <span className="material-symbols-outlined text-[18px]" style={{ color: 'var(--warning)' }}>
              emoji_events
            </span>
          </div>
          <div className="p-4 space-y-3">
            {cpseList
              .slice()
              .sort((a, b) => b.coveragePercentage - a.coveragePercentage)
              .slice(0, 4)
              .map((cpse, idx) => {
                const medals = ['🥇', '🥈', '🥉', ''];
                return (
                  <div key={cpse.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className="text-base w-5">{medals[idx]}</span>
                      <div>
                        <p style={{ color: 'var(--text-primary)' }} className="text-xs font-medium leading-tight">{cpse.name}</p>
                        <p style={{ color: 'var(--text-muted)' }} className="text-[10px] truncate max-w-[120px]">{cpse.sector}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p style={{ color: 'var(--accent)' }} className="text-sm font-bold mono leading-tight">
                        {cpse.coveragePercentage}%
                      </p>
                      <p style={{ color: 'var(--text-muted)' }} className="text-[10px] mono">
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
