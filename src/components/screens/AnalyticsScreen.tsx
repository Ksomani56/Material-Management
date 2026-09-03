import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

/* ── Shared card wrapper ── */
const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div
    className={`rounded-xl card-hover ${className}`}
    style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
  >
    {children}
  </div>
);

/* ── Simple SVG horizontal bar chart ── */
const HBarChart: React.FC<{ data: { label: string; value: number; max: number; color: string }[] }> = ({ data }) => (
  <div className="space-y-3 w-full">
    {data.map(d => (
      <div key={d.label}>
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{d.label}</span>
          <span className="text-sm font-bold font-mono" style={{ color: d.color }}>{d.value.toLocaleString()}</span>
        </div>
        <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: 'var(--bg-hover)' }}>
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{ width: `${(d.value / d.max) * 100}%`, background: d.color }}
          />
        </div>
      </div>
    ))}
  </div>
);

/* ── SVG Donut chart ── */
const DonutChart: React.FC<{ pct: number; color: string; label: string; sublabel: string }> = ({ pct, color, label, sublabel }) => {
  const r = 52, cx = 64, cy = 64;
  const circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;
  return (
    <div className="flex items-center gap-6">
      <svg width="128" height="128" viewBox="0 0 128 128">
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="var(--bg-hover)" strokeWidth="12" />
        <circle
          cx={cx} cy={cy} r={r} fill="none"
          stroke={color} strokeWidth="12"
          strokeDasharray={`${dash} ${circ - dash}`}
          strokeDashoffset={circ / 4}
          strokeLinecap="round"
          style={{ transition: 'stroke-dasharray 1s ease' }}
        />
        <text x={cx} y={cy - 6} textAnchor="middle" fontSize="18" fontWeight="700" fill="var(--text-primary)" fontFamily="JetBrains Mono, monospace">
          {pct}%
        </text>
        <text x={cx} y={cy + 12} textAnchor="middle" fontSize="10" fill="var(--text-muted)" fontFamily="Inter, sans-serif">
          of target
        </text>
      </svg>
      <div>
        <p className="text-xl font-bold" style={{ color }}>{label}</p>
        <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>{sublabel}</p>
      </div>
    </div>
  );
};

/* ── Savings trend sparkline ── */
const SavingsTrend: React.FC = () => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'];
  const savings = [120, 240, 380, 520, 720, 980, 1240, 1680, 2100]; // cumulative Cr
  const W = 500, H = 120, padL = 40, padR = 10, padT = 10, padB = 28;
  const iW = W - padL - padR, iH = H - padT - padB;
  const maxV = Math.max(...savings);
  const toX = (i: number) => padL + (i / (savings.length - 1)) * iW;
  const toY = (v: number) => padT + iH - (v / maxV) * iH;
  const poly = savings.map((v, i) => `${toX(i)},${toY(v)}`).join(' ');
  const area = `${padL},${padT + iH} ${poly} ${toX(savings.length - 1)},${padT + iH}`;

  return (
    <div className="w-full" style={{ height: `${H}px` }}>
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="w-full h-full">
        <defs>
          <linearGradient id="savGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--blue)" stopOpacity="0.3" />
            <stop offset="100%" stopColor="var(--blue)" stopOpacity="0.02" />
          </linearGradient>
        </defs>
        {[0, 25, 50, 75, 100].map(g => (
          <line key={g} x1={padL} y1={toY(maxV * g / 100)} x2={W - padR} y2={toY(maxV * g / 100)}
            stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
        ))}
        {months.map((m, i) => (
          <text key={m} x={toX(i)} y={H - 6} textAnchor="middle" fontSize="9"
            fill="rgba(255,255,255,0.3)" fontFamily="JetBrains Mono, monospace">{m}</text>
        ))}
        <polygon points={area} fill="url(#savGrad)" />
        <polyline points={poly} fill="none" stroke="var(--blue)" strokeWidth="2"
          strokeLinejoin="round" strokeLinecap="round" />
      </svg>
    </div>
  );
};

export const AnalyticsScreen: React.FC = () => {
  const { cpseList } = useApp();
  const [activeTab, setActiveTab] = useState<'overview' | 'cpse'>('overview');
  const maxRecords = Math.max(...cpseList.map(c => c.totalRecords));

  return (
    <main className="flex-1 overflow-y-auto p-6 space-y-5" style={{ background: 'var(--bg)' }}>
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
            Analytics &amp; Savings
          </h2>
          <p className="text-sm mt-0.5" style={{ color: 'var(--text-secondary)' }}>
            Measurable procurement impact, catalog reduction metrics, and CPSE harmonization performance.
          </p>
        </div>
        <div className="flex items-center gap-1 p-1 rounded-lg" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
          {(['overview', 'cpse'] as const).map(t => (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              className="px-3 py-1.5 rounded text-sm font-medium capitalize transition-all"
              style={{
                background: activeTab === t ? 'var(--blue)' : 'transparent',
                color: activeTab === t ? '#fff' : 'var(--text-secondary)',
              }}
            >
              {t === 'overview' ? 'Overview' : 'CPSE Breakdown'}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'overview' && (
        <>
          {/* 3 KPI cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { label: 'Annual Savings Potential', value: '₹4,820 Cr', sub: 'Via cross-CPSE procurement pooling', color: 'var(--blue)', icon: 'savings' },
              { label: 'Catalog Redundancy Reduced', value: '68.2%', sub: '14.2M → 3.1M canonical masters', color: 'var(--indigo)', icon: 'compress' },
              { label: 'Cross-CPSE Interoperability', value: '91.4%', sub: 'Standard taxonomy alignment score', color: 'var(--success)', icon: 'hub' },
            ].map(k => (
              <Card key={k.label} className="p-5">
                <div className="flex justify-between items-start mb-3">
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{k.label}</p>
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                    style={{ background: 'var(--bg-hover)' }}>
                    <span className="material-symbols-outlined text-[20px]" style={{ color: k.color }}>{k.icon}</span>
                  </div>
                </div>
                <p className="text-3xl font-bold font-mono" style={{ color: k.color }}>{k.value}</p>
                <p className="text-sm mt-1.5" style={{ color: 'var(--text-muted)' }}>{k.sub}</p>
              </Card>
            ))}
          </div>

          {/* Savings trend chart */}
          <Card className="p-5">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>
                  Cumulative Savings Trajectory
                </h3>
                <p className="text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>
                  Realized procurement savings across 2024 (₹ Crore)
                </p>
              </div>
              <span className="text-sm font-bold font-mono" style={{ color: 'var(--blue)' }}>₹2,100 Cr YTD</span>
            </div>
            <SavingsTrend />
          </Card>

          {/* Two-col: donut + bar */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="p-5">
              <h3 className="text-base font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
                Catalog Reduction Progress
              </h3>
              <DonutChart pct={68} color="var(--indigo)" label="68.2% Reduced" sublabel="11.1M codes eliminated" />
              <div className="mt-4 pt-4 space-y-2 text-sm" style={{ borderTop: '1px solid var(--border)' }}>
                <div className="flex justify-between">
                  <span style={{ color: 'var(--text-secondary)' }}>Source records</span>
                  <span className="font-mono font-semibold" style={{ color: 'var(--text-primary)' }}>14,285,902</span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: 'var(--text-secondary)' }}>Approved CNMCs</span>
                  <span className="font-mono font-semibold" style={{ color: 'var(--indigo)' }}>3,102,445</span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: 'var(--text-secondary)' }}>Pending review</span>
                  <span className="font-mono font-semibold" style={{ color: 'var(--warning)' }}>12,405</span>
                </div>
              </div>
            </Card>

            <Card className="p-5">
              <h3 className="text-base font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
                CPSE Coverage Index
              </h3>
              <HBarChart
                data={cpseList.map((c, i) => ({
                  label: c.name,
                  value: c.coveragePercentage,
                  max: 100,
                  color: ['var(--blue)', 'var(--indigo)', 'var(--success)', 'var(--warning)', '#a78bfa', '#f87171'][i % 6],
                }))}
              />
            </Card>
          </div>
        </>
      )}

      {activeTab === 'cpse' && (
        <Card>
          <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid var(--border)' }}>
            <div>
              <h3 className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>
                CPSE Harmonization &amp; Interoperability Index
              </h3>
              <p className="text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>
                Breakdown per enterprise — live pipeline status
              </p>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                  {['CPSE Entity', 'Sector', 'Source Records', 'Harmonized CNMC', 'Pending', 'Coverage', 'Status'].map(h => (
                    <th key={h} className="px-5 py-3 text-xs font-semibold uppercase tracking-wide"
                      style={{ color: 'var(--text-muted)' }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {cpseList.map(cpse => (
                  <tr key={cpse.id} className="transition-colors hover:opacity-90"
                    style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold font-mono shrink-0"
                          style={{ background: 'var(--blue-dim)', color: 'var(--blue)', border: '1px solid rgba(59,130,246,0.2)' }}>
                          {cpse.name[0]}
                        </div>
                        <div>
                          <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{cpse.name}</p>
                          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{cpse.fullName}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-sm" style={{ color: 'var(--text-secondary)' }}>{cpse.sector}</td>
                    <td className="px-5 py-3.5 text-sm text-right font-mono" style={{ color: 'var(--text-primary)' }}>
                      {cpse.totalRecords.toLocaleString()}
                    </td>
                    <td className="px-5 py-3.5 text-sm text-right font-mono font-semibold" style={{ color: 'var(--blue)' }}>
                      {cpse.mappedRecords.toLocaleString()}
                    </td>
                    <td className="px-5 py-3.5 text-sm text-right font-mono" style={{ color: 'var(--warning)' }}>
                      {cpse.pendingRecords.toLocaleString()}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2.5 justify-end">
                        <div className="w-20 h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--bg-hover)' }}>
                          <div className="h-full rounded-full" style={{ width: `${cpse.coveragePercentage}%`, background: 'var(--blue)' }} />
                        </div>
                        <span className="text-sm font-bold font-mono w-10 text-right" style={{ color: 'var(--text-primary)' }}>
                          {cpse.coveragePercentage}%
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-center">
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium"
                        style={{ background: 'var(--success-dim)', color: 'var(--success)' }}>
                        <span className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--success)' }} />
                        Active
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </main>
  );
};
