import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AnimatedNumber } from '../core/animated-number';

/* -----------------------------------------------------------------------
   Dual-Line Spline Area Chart matching template exactly
   ----------------------------------------------------------------------- */
const AreaChart: React.FC = () => {
  const [tooltip, setTooltip] = useState<{ x: number; y: number; label: string; v1: string; v2: string } | null>(null);

  const months = [
    { label: 'Jan', revenue: 160, target: 175 },
    { label: 'Feb', revenue: 190, target: 205 },
    { label: 'Mar', revenue: 235, target: 225 },
    { label: 'Apr', revenue: 280, target: 245 },
    { label: 'May', revenue: 200, target: 260 },
    { label: 'Jun', revenue: 320, target: 280 },
    { label: 'Jul', revenue: 350, target: 305 },
    { label: 'Aug', revenue: 385, target: 330 },
    { label: 'Sep', revenue: 430, target: 355 },
    { label: 'Oct', revenue: 475, target: 380 },
    { label: 'Nov', revenue: 520, target: 410 },
    { label: 'Dec', revenue: 590, target: 440 },
  ];

  const W = 680;
  const H = 240;
  const padL = 48;
  const padR = 16;
  const padT = 16;
  const padB = 36;
  const innerW = W - padL - padR;
  const innerH = H - padT - padB;
  const maxVal = 650;

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

  const ptsRevenue = months.map((m, i) => ({ x: toX(i), y: toY(m.revenue) }));
  const ptsTarget = months.map((m, i) => ({ x: toX(i), y: toY(m.target) }));

  const pathRevenue = getSplinePath(ptsRevenue);
  const pathTarget = getSplinePath(ptsTarget);

  const areaRevenue = `${pathRevenue} L ${toX(months.length - 1)},${padT + innerH} L ${padL},${padT + innerH} Z`;

  const yTicks = [0, 150, 300, 450, 600];

  return (
    <div className="relative w-full" style={{ height: `${H}px` }}>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="none"
        className="w-full h-full"
      >
        <defs>
          {/* Emerald Teal gradient */}
          <linearGradient id="v0VioletGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#10B981" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#10B981" stopOpacity="0.0" />
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
              strokeDasharray="4 4"
            />
            <text
              x={padL - 8}
              y={toY(val) + 4}
              fill="#71717a"
              fontSize="11"
              fontFamily="monospace"
              textAnchor="end"
            >
              ${val}k
            </text>
          </g>
        ))}

        {/* X Axis Labels */}
        {months.map((m, i) => (
          <text
            key={m.label}
            x={toX(i)}
            y={H - 8}
            fill="#71717a"
            fontSize="11"
            fontFamily="monospace"
            textAnchor="middle"
          >
            {m.label}
          </text>
        ))}

        {/* Area fill */}
        <path
          d={areaRevenue}
          fill="url(#v0VioletGrad)"
        />

        {/* Target Line (Muted Gray) */}
        <path
          d={pathTarget}
          fill="none"
          stroke="rgba(255, 255, 255, 0.2)"
          strokeWidth="2"
          strokeDasharray="4 4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Revenue Line (Emerald Teal) */}
        <path
          d={pathRevenue}
          fill="none"
          stroke="#10B981"
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
              y: Math.min(toY(m.revenue), toY(m.target)) - 10,
              label: m.label,
              v1: `$${m.revenue}k`,
              v2: `$${m.target}k`,
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
              <circle cx={toX(i)} cy={toY(m.revenue)} r="5" fill="#10B981" stroke="#0F1110" strokeWidth="2" />
              <circle cx={toX(i)} cy={toY(m.target)} r="4" fill="#10b981" stroke="#0F1110" strokeWidth="1.5" />
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
            background: '#171A18',
            border: '1px solid #303532',
            boxShadow: '0 8px 24px rgba(0,0,0,0.8)',
          }}
        >
          <div className="font-semibold text-white mb-1.5">{tooltip.label}</div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full" style={{ background: '#10B981' }} />
            <span className="text-[#A7ADA9]">Revenue: <strong className="text-white">{tooltip.v1}</strong></span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full" style={{ background: '#10B981' }} />
            <span className="text-[#A7ADA9]">Target: <strong className="text-white">{tooltip.v2}</strong></span>
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
  const { setActiveScreen, reviewQueue, cpseList } = useApp();

  const recentDeals = [
    { initial: 'A', name: 'Acme Corp', sub: 'Sarah Chen • 2 hours ago', amount: '$125,000', status: 'Won' },
    { initial: 'T', name: 'TechStart Inc', sub: 'Mike Johnson • 5 hours ago', amount: '$89,500', status: 'Pending' },
    { initial: 'G', name: 'GlobalFin', sub: 'Emily Davis • 1 day ago', amount: '$245,000', status: 'Pending' },
    { initial: 'D', name: 'DataSync Solutions', sub: 'James Wilson • 2 days ago', amount: '$67,800', status: 'Lost' },
    { initial: 'C', name: 'CloudBase Ltd', sub: 'Sarah Chen • 3 days ago', amount: '$178,000', status: 'Won' },
  ];

  const topPerformers = [
    { rank: 1, initial: 'SC', name: 'Sarah Chen', deals: '24 deals closed', amount: '$487,500', growth: '+15%' },
    { rank: 2, initial: 'MJ', name: 'Mike Johnson', deals: '19 deals closed', amount: '$356,200', growth: '+8%' },
    { rank: 3, initial: 'ED', name: 'Emily Davis', deals: '17 deals closed', amount: '$312,800', growth: '+12%' },
    { rank: 4, initial: 'JW', name: 'James Wilson', deals: '15 deals closed', amount: '$289,400', growth: '+5%' },
    { rank: 5, initial: 'LP', name: 'Lisa Park', deals: '14 deals closed', amount: '$267,100', growth: '+9%' },
  ];

  const pipelineStages = [
    { name: 'Lead', count: 892, pct: 45, color: '#10B981' },
    { name: 'Qualified', count: 556, pct: 28, color: '#10b981' },
    { name: 'Proposal', count: 357, pct: 18, color: '#EAB308' },
    { name: 'Negotiation', count: 179, pct: 9, color: '#34d399' },
  ];

  return (
    <main
      className="flex-1 overflow-y-auto p-6 space-y-6"
      style={{ background: '#0F1110' }}
    >
      {/* 1. Top Row of 4 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          label="Total Revenue"
          value={<AnimatedNumber value={2.4} decimals={1} prefix="$" suffix="M" duration={1600} />}
          delta="+12.5%"
          deltaUp={true}
          icon="attach_money"
        />
        <KpiCard
          label="Conversion Rate"
          value={<AnimatedNumber value={24.8} decimals={1} suffix="%" duration={1600} />}
          delta="+3.2%"
          deltaUp={true}
          icon="trending_up"
        />
        <KpiCard
          label="Active Deals"
          value={<AnimatedNumber value={147} duration={1500} />}
          delta="-5"
          deltaUp={false}
          icon="track_changes"
        />
        <KpiCard
          label="New Leads"
          value={<AnimatedNumber value={892} duration={1600} />}
          delta="+18.3%"
          deltaUp={true}
          icon="group"
        />
      </div>

      {/* 2. Middle Row: Revenue Trend Area Chart + Pipeline Stages */}
      <div className="grid grid-cols-12 gap-5">
        {/* Revenue Trend Area Chart (2/3 width) */}
        <div
          className="col-span-12 lg:col-span-8 rounded-xl p-6"
          style={{
            background: '#171A18',
            border: '1px solid #303532',
          }}
        >
          {/* Header & Legend matching template */}
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-base font-semibold text-white tracking-tight">
                Revenue Trend
              </h2>
              <p className="text-xs text-[#A7ADA9] mt-0.5">
                Monthly performance vs target
              </p>
            </div>

            {/* Legend */}
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ background: '#10B981' }} />
                <span className="text-[#A7ADA9]">Revenue</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ background: '#10B981' }} />
                <span className="text-[#A7ADA9]">Target</span>
              </div>
            </div>
          </div>

          <AreaChart />
        </div>

        {/* Pipeline Stages (1/3 width) */}
        <div
          className="col-span-12 lg:col-span-4 rounded-xl p-6 flex flex-col justify-between"
          style={{
            background: '#171A18',
            border: '1px solid #303532',
          }}
        >
          <div>
            <h2 className="text-base font-semibold text-white tracking-tight">
              Pipeline Stages
            </h2>
            <p className="text-xs text-[#71717a] mt-0.5 mb-5">
              Distribution by stage
            </p>

            {/* Stage Progress Bars matching template */}
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

          {/* Bottom Total Value matching template */}
          <div
            className="pt-4 mt-6 flex justify-between items-baseline"
            style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}
          >
            <span className="text-xs text-[#71717a]">Total Pipeline Value</span>
            <span className="text-2xl font-bold text-white tracking-tight">
              <AnimatedNumber value={4.8} decimals={1} prefix="$" suffix="M" duration={1600} />
            </span>
          </div>
        </div>
      </div>

      {/* 3. Bottom Row: Recent Deals + Top Performers */}
      <div className="grid grid-cols-12 gap-5">
        {/* Recent Deals (Left 7 cols) */}
        <div
          className="col-span-12 lg:col-span-7 rounded-xl p-6"
          style={{
            background: '#171A18',
            border: '1px solid #303532',
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-semibold text-[#F3F4F6] tracking-tight">
                Recent Deals
              </h2>
              <p className="text-xs text-[#A7ADA9] mt-0.5">Latest activity</p>
            </div>
            <button
              onClick={() => setActiveScreen('review')}
              className="text-xs font-semibold flex items-center gap-1 hover:underline"
              style={{ color: '#10B981' }}
            >
              View all <span className="material-symbols-outlined text-[14px]">arrow_outward</span>
            </button>
          </div>

          <div className="space-y-3">
            {recentDeals.map((deal, idx) => {
              const statusCfg = {
                Won: { border: 'rgba(16, 185, 129, 0.25)', color: '#10B981', icon: 'check_circle' },
                Pending: { border: 'rgba(234, 179, 8, 0.25)', color: '#EAB308', icon: 'schedule' },
                Lost: { border: 'rgba(239, 68, 68, 0.25)', color: '#EF4444', icon: 'cancel' },
              }[deal.status] || { border: 'transparent', color: '#A7ADA9', icon: 'info' };

              return (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-white/[0.02] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    {/* Square Dark Initial Box */}
                    <div
                      className="w-9 h-9 rounded-lg flex items-center justify-center font-bold text-xs text-white"
                      style={{
                        background: 'rgba(255, 255, 255, 0.04)',
                        border: '1px solid #303532',
                      }}
                    >
                      {deal.initial}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[#F3F4F6]">{deal.name}</p>
                      <p className="text-xs text-[#A7ADA9]">{deal.sub}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="text-sm font-bold text-[#F3F4F6] font-mono">
                      {deal.amount}
                    </span>
                    <span
                      className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold"
                      style={{
                        border: `1px solid ${statusCfg.border}`,
                        color: statusCfg.color,
                        background: 'transparent',
                      }}
                    >
                      <span className="material-symbols-outlined text-[12px]">
                        {statusCfg.icon}
                      </span>
                      {deal.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Performers (Right 5 cols) */}
        <div
          className="col-span-12 lg:col-span-5 rounded-xl p-6"
          style={{
            background: '#171A18',
            border: '1px solid #303532',
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-semibold text-[#F3F4F6] tracking-tight">
                Top Performers
              </h2>
              <p className="text-xs text-[#A7ADA9] mt-0.5">This month's leaders</p>
            </div>
            <span className="material-symbols-outlined text-[20px] text-[#EAB308]">
              emoji_events
            </span>
          </div>

          <div className="space-y-3.5">
            {topPerformers.map((p) => {
              const rankBg = {
                1: '#ea580c', // Orange for 1st
                2: '#d97706', // Yellow-orange for 2nd
                3: '#b45309', // Darker orange for 3rd
              }[p.rank] || '#3f3f46';

              return (
                <div key={p.rank} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {/* Circular Teal Avatar with Rank Badge */}
                    <div className="relative">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold text-[#0F1110] shadow-sm"
                        style={{ background: '#10B981' }}
                      >
                        {p.initial}
                      </div>
                      <span
                        className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold text-white"
                        style={{ background: rankBg }}
                      >
                        {p.rank}
                      </span>
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-white leading-tight">
                        {p.name}
                      </p>
                      <p className="text-xs text-[#71717a] mt-0.5">{p.deals}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-sm font-bold text-white font-mono leading-tight">
                      {p.amount}
                    </p>
                    <p className="text-xs font-semibold mt-0.5 flex items-center justify-end gap-0.5 text-[#10b981]">
                      <span className="material-symbols-outlined text-[12px]">trending_up</span>
                      {p.growth}
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
