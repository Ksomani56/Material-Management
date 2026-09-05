import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AnimatedNumber } from '../core/animated-number';
import { DateRangePicker } from '../common/DateRangePicker';
import { ScreenFooter } from '../common/FooterLegalModal';

/* -----------------------------------------------------------------------
   Mini Sparkline Component
   ----------------------------------------------------------------------- */
const Sparkline: React.FC<{ data: number[]; color: string }> = ({ data, color }) => {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const W = 100;
  const H = 32;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * W;
    const y = H - ((v - min) / range) * (H - 6) - 3;
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg width={W} height={H} className="overflow-visible shrink-0 opacity-90">
      <polyline
        points={pts}
        fill="none"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

/* -----------------------------------------------------------------------
   KPI Metric Card
   ----------------------------------------------------------------------- */
interface KpiCardProps {
  label: string;
  value: React.ReactNode;
  badge: string;
  badgeType: 'success' | 'violet';
  sparklineData: number[];
}

const KpiCard: React.FC<KpiCardProps> = ({ label, value, badge, badgeType, sparklineData }) => (
  <div
    className="rounded-xl p-5 flex flex-col justify-between card-hover transition-all"
    style={{
      background: '#0C0E0D',
      border: '1px solid #232825',
    }}
  >
    <div className="flex items-center justify-between mb-2">
      <span className="text-xs font-semibold uppercase tracking-wider text-[#A7ADA9]">{label}</span>
      <span
        className="text-xs font-bold px-2.5 py-0.5 rounded-full font-mono flex items-center gap-0.5"
        style={{
          background: badgeType === 'success' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(59, 130, 246, 0.15)',
          color: badgeType === 'success' ? '#10B981' : '#3B82F6',
          border: `1px solid ${badgeType === 'success' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(59, 130, 246, 0.3)'}`,
        }}
      >
        <span className="material-symbols-outlined text-[12px]">trending_up</span>
        {badge}
      </span>
    </div>

    <div className="flex items-baseline justify-between gap-3 mt-2">
      <span className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-none">
        {value}
      </span>
      <Sparkline data={sparklineData} color="#10B981" />
    </div>
  </div>
);

/* -----------------------------------------------------------------------
   Multi-Series Procurement Spend & Savings Chart
   ----------------------------------------------------------------------- */
const ProcurementMultiSeriesChart: React.FC = () => {
  const [hoveredQuarter, setHoveredQuarter] = useState<number | null>(2); // Default show Q3

  const quarters = [
    {
      name: 'Q1',
      ongc: 32,
      iocl: 22,
      gail: 12,
      totalSpend: 66,
      totalSavings: 18,
      spendLabel: '$660M',
      ongcLabel: '$320M',
      ioclLabel: '$220M',
      gailLabel: '$120M',
      savingsLabel: '$180M',
    },
    {
      name: 'Q2',
      ongc: 38,
      iocl: 28,
      gail: 15,
      totalSpend: 81,
      totalSavings: 24,
      spendLabel: '$810M',
      ongcLabel: '$380M',
      ioclLabel: '$280M',
      gailLabel: '$150M',
      savingsLabel: '$240M',
    },
    {
      name: 'Q3',
      ongc: 58,
      iocl: 40,
      gail: 24,
      totalSpend: 122,
      totalSavings: 42,
      spendLabel: '$1,220M',
      ongcLabel: '$580M',
      ioclLabel: '$400M',
      gailLabel: '$240M',
      savingsLabel: '$420M',
    },
    {
      name: 'Q4',
      ongc: 44,
      iocl: 33,
      gail: 20,
      totalSpend: 97,
      totalSavings: 31,
      spendLabel: '$970M',
      ongcLabel: '$440M',
      ioclLabel: '$330M',
      gailLabel: '$200M',
      savingsLabel: '$310M',
    },
  ];

  const W = 780;
  const H = 280;
  const padL = 48;
  const padR = 20;
  const padT = 20;
  const padB = 40;
  const innerW = W - padL - padR;
  const innerH = H - padT - padB;
  const maxSpend = 70; // Max per bar

  const quarterWidth = innerW / quarters.length;
  const barW = 26;
  const barGap = 6;

  // Trendline coordinates
  const spendPts = quarters.map((q, i) => {
    const cx = padL + i * quarterWidth + quarterWidth / 2;
    const cy = padT + innerH - (q.totalSpend / 140) * innerH;
    return { x: cx, y: cy };
  });

  const savingsPts = quarters.map((q, i) => {
    const cx = padL + i * quarterWidth + quarterWidth / 2;
    const cy = padT + innerH - (q.totalSavings / 60) * innerH;
    return { x: cx, y: cy };
  });

  const getSpline = (pts: { x: number; y: number }[]) => {
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

  const spendPath = getSpline(spendPts);
  const savingsPath = getSpline(savingsPts);

  const activeQ = hoveredQuarter !== null ? quarters[hoveredQuarter] : quarters[2];
  const activePt = spendPts[hoveredQuarter !== null ? hoveredQuarter : 2];

  return (
    <div className="relative w-full" style={{ height: `${H}px` }}>
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="w-full h-full">
        {/* Horizontal grid lines */}
        {[0, 15, 30, 45, 60].map((val) => {
          const y = padT + innerH - (val / maxSpend) * innerH;
          return (
            <g key={val}>
              <line
                x1={padL}
                y1={y}
                x2={W - padR}
                y2={y}
                stroke="rgba(255, 255, 255, 0.05)"
                strokeWidth="1"
              />
              <text
                x={padL - 8}
                y={y + 4}
                textAnchor="end"
                fontSize="11"
                fill="#71717a"
                fontFamily="Inter, sans-serif"
              >
                ${val}M
              </text>
            </g>
          );
        })}

        {/* Grouped Bars per Quarter */}
        {quarters.map((q, i) => {
          const groupCenter = padL + i * quarterWidth + quarterWidth / 2;
          const startX = groupCenter - (barW * 3 + barGap * 2) / 2;

          const ongcH = (q.ongc / maxSpend) * innerH;
          const ioclH = (q.iocl / maxSpend) * innerH;
          const gailH = (q.gail / maxSpend) * innerH;

          return (
            <g key={q.name} onMouseEnter={() => setHoveredQuarter(i)} className="cursor-pointer">
              {/* Highlight background column on hover */}
              {hoveredQuarter === i && (
                <rect
                  x={padL + i * quarterWidth + 6}
                  y={padT}
                  width={quarterWidth - 12}
                  height={innerH}
                  fill="rgba(139, 92, 246, 0.06)"
                  rx="6"
                />
              )}

              {/* Bar 1: ONGC (Emerald Teal #10B981) */}
              <rect
                x={startX}
                y={padT + innerH - ongcH}
                width={barW}
                height={ongcH}
                fill="#10B981"
                rx="4"
              />

              {/* Bar 2: IOCL (Info Blue #3B82F6) */}
              <rect
                x={startX + barW + barGap}
                y={padT + innerH - ioclH}
                width={barW}
                height={ioclH}
                fill="#3B82F6"
                rx="4"
              />

              {/* Bar 3: GAIL (Muted Sage #A7ADA9) */}
              <rect
                x={startX + (barW + barGap) * 2}
                y={padT + innerH - gailH}
                width={barW}
                height={gailH}
                fill="#A7ADA9"
                rx="4"
              />

              {/* X-axis Quarter Label */}
              <text
                x={groupCenter}
                y={H - 12}
                textAnchor="middle"
                fontSize="12"
                fontWeight="600"
                fill={hoveredQuarter === i ? '#F3F4F6' : '#A7ADA9'}
                fontFamily="Inter, sans-serif"
              >
                {q.name}
              </text>
            </g>
          );
        })}

        {/* Trendline 1: White Curve (Total Spend) */}
        <path
          d={spendPath}
          fill="none"
          stroke="#ffffff"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Trendline 2: Teal Curve (Realized Savings) */}
        <path
          d={savingsPath}
          fill="none"
          stroke="#10B981"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Indicator marker dots on selected quarter */}
        {activePt && (
          <g>
            <circle cx={activePt.x} cy={activePt.y} r="5" fill="#ffffff" stroke="#000000" strokeWidth="2" />
            <circle
              cx={savingsPts[hoveredQuarter !== null ? hoveredQuarter : 2].x}
              cy={savingsPts[hoveredQuarter !== null ? hoveredQuarter : 2].y}
              r="5"
              fill="#10B981"
              stroke="#000000"
              strokeWidth="2"
            />
          </g>
        )}
      </svg>

      {/* Floating Detailed Popover Card matching Charcoal Mockup */}
      {activeQ && (
        <div
          className="absolute z-20 rounded-xl p-3 shadow-2xl transition-all duration-150 pointer-events-none"
          style={{
            left: `${((padL + (hoveredQuarter !== null ? hoveredQuarter : 2) * quarterWidth + quarterWidth / 2) / W) * 100}%`,
            top: '8%',
            transform: 'translateX(-50%)',
            background: '#0C0E0D',
            border: '1px solid #232825',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.8)',
            minWidth: '170px',
          }}
        >
          <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-white/10">
            <span className="text-xs font-bold text-white">{activeQ.name} Procurement Detail</span>
            <span
              className="text-[10px] font-mono font-bold px-2 py-0.5 rounded"
              style={{
                background: 'rgba(16, 185, 129, 0.12)',
                color: '#10B981',
                border: '1px solid rgba(16, 185, 129, 0.25)',
              }}
            >
              POOLED
            </span>
          </div>

          <div className="space-y-1.5 text-xs font-mono">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-[#A7ADA9]">
                <span className="w-2 h-2 rounded-sm" style={{ background: '#10B981' }} /> ONGC:
              </span>
              <span className="font-bold text-white">{activeQ.ongcLabel}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-[#A7ADA9]">
                <span className="w-2 h-2 rounded-sm" style={{ background: '#3B82F6' }} /> IOCL:
              </span>
              <span className="font-bold text-white">{activeQ.ioclLabel}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-[#A7ADA9]">
                <span className="w-2 h-2 rounded-sm" style={{ background: '#A7ADA9' }} /> GAIL:
              </span>
              <span className="font-bold text-white">{activeQ.gailLabel}</span>
            </div>
          </div>

          <div className="mt-2.5 pt-1.5 border-t border-white/10 flex items-center justify-between text-xs">
            <span className="text-[#A7ADA9]">Total Savings:</span>
            <span className="font-bold text-[#10B981] font-mono">{activeQ.savingsLabel}</span>
          </div>
        </div>
      )}
    </div>
  );
};

/* -----------------------------------------------------------------------
   Main Analytics Screen
   ----------------------------------------------------------------------- */
export const AnalyticsScreen: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'quarters'>('all');

  const catalogItems = [
    {
      name: 'Pipe, Seamless Carbon Steel 6 IN SCH 40',
      category: 'Pipes & Tubulars',
      status: 'ACTIVE',
      vendor: 'ONGC (Western)',
      lastPrice: '₹18,400 / M',
      variance: '+3.2%',
      varianceUp: true,
    },
    {
      name: 'Valve, Floating Ball 2 IN Class 150 RF A216 WCB',
      category: 'Valves & Actuators',
      status: 'ACTIVE',
      vendor: 'BHEL Haridwar',
      lastPrice: '₹14,200 / EA',
      variance: '-1.1%',
      varianceUp: false,
    },
    {
      name: 'Flange, Weld Neck 4 IN Class 300 RF A105',
      category: 'Fasteners & Flanges',
      status: 'PENDING',
      vendor: 'IOCL Panipat',
      lastPrice: '₹4,850 / EA',
      variance: '-1.9%',
      varianceUp: false,
    },
    {
      name: 'Gasket, Spiral Wound 316SS with Graphite Filler',
      category: 'Seals & Packing',
      status: 'ACTIVE',
      vendor: 'GAIL Vijaipur',
      lastPrice: '₹1,250 / EA',
      variance: '-0.3%',
      varianceUp: false,
    },
    {
      name: 'Cable, Armored Power 4-Core 16 SQMM XLPE',
      category: 'Electrical & Cables',
      status: 'ON HOLD',
      vendor: 'NTPC Singrauli',
      lastPrice: '₹920 / M',
      variance: '+2.2%',
      varianceUp: true,
    },
  ];

  const { setActiveScreen } = useApp();

  return (
    <main className="flex-1 overflow-y-auto px-8 py-6 space-y-6 bg-[#070908] text-[#F3F4F6]">
      {/* 1. Breadcrumbs & Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-medium text-[#9CA3AF]">
          <span 
            onClick={() => setActiveScreen('dashboard')} 
            className="cursor-pointer hover:text-[#F3F4F6] transition-colors"
          >
            Home
          </span>
          <span className="text-[#6B7280]">›</span>
          <span className="text-[#F3F4F6]">Analytics & Savings</span>
        </div>

        <DateRangePicker />
      </div>

      {/* 2. Page Title Block */}
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-white font-sans">
          Analytics & Savings
        </h1>
        <p className="text-xs md:text-sm text-[#9CA3AF] leading-relaxed max-w-4xl">
          Inter-enterprise procurement pooling, volume discounts, price disparity analysis, and harmonization dividends across participating CPSEs.
        </p>
      </div>

      {/* 3. Hero Split Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-1">
        <div className="lg:col-span-7 space-y-2">
          <h2 className="text-sm font-semibold text-[#F3F4F6] tracking-normal font-sans">
            Cross-Enterprise Spend Dispersion
          </h2>
          <p className="text-xs text-[#9CA3AF] leading-relaxed font-sans">
            By aggregating identical physical items across multiple CPSE enterprise purchase orders, pricing discrepancies between facilities are exposed. Consolidated RFQs unlock tier-1 volume discounts from manufacturers.
          </p>
        </div>

        <div className="lg:col-span-5 grid grid-cols-3 gap-4 pt-1">
          <div>
            <div className="text-2xl lg:text-3xl font-bold font-sans text-white tracking-tight">
              ₹7.45B
            </div>
            <div className="text-xs font-semibold text-[#F3F4F6] mt-1 leading-tight">
              Total Spend
            </div>
            <div className="text-[11px] text-[#6B7280] leading-snug">
              Catalog coverage
            </div>
          </div>

          <div>
            <div className="text-2xl lg:text-3xl font-bold font-sans text-[#10B981] tracking-tight">
              ₹1.84B
            </div>
            <div className="text-xs font-semibold text-[#F3F4F6] mt-1 leading-tight">
              Realized Savings
            </div>
            <div className="text-[11px] text-[#6B7280] leading-snug">
              Bulk consolidation
            </div>
          </div>

          <div>
            <div className="text-2xl lg:text-3xl font-bold font-sans text-[#22D3EE] tracking-tight">
              14.5%
            </div>
            <div className="text-xs font-semibold text-[#F3F4F6] mt-1 leading-tight">
              Rate Variance
            </div>
            <div className="text-[11px] text-[#6B7280] leading-snug">
              Arbitrage captured
            </div>
          </div>
        </div>
      </div>

      {/* 2. Top Row of 4 KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          label="Total Spend"
          value={<AnimatedNumber value={7.45} decimals={2} prefix="₹" suffix="B" duration={1600} />}
          badge="+12.3%"
          badgeType="success"
          sparklineData={[12, 15, 14, 18, 22, 26, 32]}
        />
        <KpiCard
          label="Identified Savings"
          value={<AnimatedNumber value={892} prefix="₹" suffix="M" duration={1600} />}
          badge="+18.5%"
          badgeType="violet"
          sparklineData={[8, 12, 15, 19, 25, 29, 36]}
        />
        <KpiCard
          label="Active Contracts"
          value={<AnimatedNumber value={1850} duration={1600} />}
          badge="+4.1%"
          badgeType="violet"
          sparklineData={[20, 22, 21, 25, 28, 30, 34]}
        />
        <KpiCard
          label="Vendor Compliance"
          value={<AnimatedNumber value={94.2} decimals={1} suffix="%" duration={1600} />}
          badge="+2.9%"
          badgeType="success"
          sparklineData={[88, 89, 91, 92, 93, 94, 94.2]}
        />
      </div>

      {/* 3. Center Multi-Series Spend & Savings Chart Card */}
      <div
        className="rounded-xl p-6 space-y-4"
        style={{
          background: '#0C0E0D',
          border: '1px solid #232825',
        }}
      >
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <h2 className="text-base font-bold text-white tracking-tight">
              Multi-Series Procurement Analytics
            </h2>
            <p className="text-xs text-[#A7ADA9] mt-0.5">
              Quarterly spend pooling breakdown across public sector energy enterprises
            </p>
          </div>

          {/* Legend Items matching Charcoal Concept */}
          <div className="flex flex-wrap items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm" style={{ background: '#10B981' }} />
              <span className="text-[#A7ADA9]">ONGC</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm" style={{ background: '#3B82F6' }} />
              <span className="text-[#A7ADA9]">IOCL</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm" style={{ background: '#A7ADA9' }} />
              <span className="text-[#A7ADA9]">GAIL</span>
            </div>
            <div className="flex items-center gap-1.5 pl-2 border-l border-white/10">
              <span className="w-4 h-0.5" style={{ background: '#ffffff' }} />
              <span className="text-white font-medium">Total Spend</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-4 h-0.5" style={{ background: '#10B981' }} />
              <span className="text-[#10B981] font-medium">Total Savings</span>
            </div>
          </div>
        </div>

        {/* Render Chart */}
        <ProcurementMultiSeriesChart />
      </div>

      {/* 4. Bottom Data Table: Material Catalog & Price Variance */}
      <div
        className="rounded-xl overflow-hidden"
        style={{
          background: '#0C0E0D',
          border: '1px solid #232825',
        }}
      >
        <div className="p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-white/10">
          <div>
            <h2 className="text-base font-bold text-white tracking-tight">
              Material Catalog &amp; Price Variance
            </h2>
            <p className="text-xs text-[#A7ADA9] mt-0.5">
              Consolidated items with inter-enterprise price differences and active status
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white hover:bg-white/10 transition-colors"
              style={{ background: '#070908', border: '1px solid #232825' }}
            >
              Export CSV
            </button>
            <button
              className="px-3 py-1.5 rounded-lg text-xs font-bold text-[#000000] hover:brightness-110 transition-all shadow-sm"
              style={{ background: '#10B981' }}
            >
              Add Material
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead style={{ background: '#070908', borderBottom: '1px solid #232825' }}>
              <tr>
                {['Material Name', 'Category', 'Status', 'Lead CPSE Vendor', 'Last Unit Price', 'Variance'].map((h) => (
                  <th key={h} className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-[#71717a]">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {catalogItems.map((item, idx) => {
                const statusColor = {
                  ACTIVE: { text: '#10b981', bg: 'rgba(16, 185, 129, 0.12)', border: 'rgba(16, 185, 129, 0.25)' },
                  PENDING: { text: '#f59e0b', bg: 'rgba(245, 158, 11, 0.12)', border: 'rgba(245, 158, 11, 0.25)' },
                  'ON HOLD': { text: '#a855f7', bg: 'rgba(168, 85, 247, 0.12)', border: 'rgba(168, 85, 247, 0.25)' },
                }[item.status] || { text: '#a1a1aa', bg: 'rgba(255, 255, 255, 0.05)', border: 'transparent' };

                return (
                  <tr key={idx} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-5 py-4 font-semibold text-white max-w-sm truncate">
                      {item.name}
                    </td>
                    <td className="px-5 py-4 text-xs font-medium text-[#a1a1aa]">
                      {item.category}
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full"
                        style={{
                          background: statusColor.bg,
                          color: statusColor.text,
                          border: `1px solid ${statusColor.border}`,
                        }}
                      >
                        {item.status === 'ACTIVE' && <span className="material-symbols-outlined text-[12px]">check</span>}
                        {item.status === 'PENDING' && <span className="material-symbols-outlined text-[12px]">schedule</span>}
                        {item.status === 'ON HOLD' && <span className="material-symbols-outlined text-[12px]">pause</span>}
                        {item.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-sm font-medium text-[#e4e4e7]">
                      {item.vendor}
                    </td>
                    <td className="px-5 py-4 font-mono font-bold text-sm text-white">
                      {item.lastPrice}
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className="inline-flex items-center gap-0.5 font-mono text-xs font-bold"
                        style={{ color: item.varianceUp ? '#10b981' : '#f43f5e' }}
                      >
                        <span className="material-symbols-outlined text-[14px]">
                          {item.varianceUp ? 'trending_up' : 'trending_down'}
                        </span>
                        {item.variance}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer */}
      <ScreenFooter />
    </main>
  );
};
