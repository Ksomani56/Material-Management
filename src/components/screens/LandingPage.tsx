import React, { useRef, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AnimatedNumber } from '../core/animated-number';
import { TextEffect } from '../core/text-effect';
import { TextShimmer } from '../core/text-shimmer';
import { GridPattern } from '../core/grid-pattern';

/* ── Intersection observer for scroll-triggered animations ── */
function useInView(threshold = 0.2) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, inView };
}

/* ── Stat counter card ── */
function StatCard({ prefix = '', suffix = '', target, decimals = 0, label, sublabel }: {
  prefix?: string; suffix?: string; target: number; decimals?: number; label: string; sublabel: string;
}) {
  const { ref, inView } = useInView();
  return (
    <div ref={ref} className="text-center px-8 py-6">
      <div className="text-3xl sm:text-4xl font-extrabold mb-1" style={{ color: '#10B981' }}>
        {inView ? (
          <AnimatedNumber value={target} decimals={decimals} duration={1800} prefix={prefix} suffix={suffix} />
        ) : (
          `${prefix}0${suffix}`
        )}
      </div>
      <div className="text-sm font-semibold mb-0.5 text-white">{label}</div>
      <div className="text-xs text-[#71717a]">{sublabel}</div>
    </div>
  );
}

export const LandingPage: React.FC = () => {
  const { setActiveScreen } = useApp();
  const [activeTab, setActiveTab] = useState<'fastener' | 'valve' | 'pump'>('fastener');

  const sandboxItems = {
    fastener: {
      name: 'Hex Head Bolt (M10 x 50mm)',
      category: 'Fasteners & Hardware',
      cnmc: '3116.1504.8920',
      canonical: 'Bolt, Hex Head, M10 x 50mm, Stainless Steel 304, Fully Threaded (DIN 933)',
      sources: [
        { cpse: 'ONGC', code: 'MAT-10482', desc: 'HEX BOLT M10 X 50 SS304', price: '₹48 / EA' },
        { cpse: 'IOCL', code: 'IOCL-FST-902', desc: 'BOLT HEX SS304 M10X50MM FULL THD', price: '₹55 / EA' },
        { cpse: 'NTPC', code: 'NGC-BLT-004', desc: 'FASTENER HEX HEAD M10*50 AISI-304', price: '₹52 / EA' },
      ],
      chips: ['SS 304', 'M10 x 1.5mm', 'Length 50mm', 'DIN 933 / ISO 4017'],
      savings: '14% bulk purchase discount across 3 CPSEs (Saves ₹12.4 Lakhs annually)',
    },
    valve: {
      name: 'Ball Valve (2 IN Class 150)',
      category: 'Valves & Flow Control',
      cnmc: '4014.1607.1842',
      canonical: 'Valve, Ball: 2 IN, ASME Class 150, Flanged RF, ASTM A216 WCB Body, SS316 Trim, PTFE Seat',
      sources: [
        { cpse: 'ONGC', code: 'MAT-VLV-0928', desc: 'BALL VALVE 50MM 150LBS CS FLANGED A216 WCB', price: '₹14,200 / EA' },
        { cpse: 'IOCL', code: '10049281', desc: 'VLV BALL 2IN 150# FLG WCB/316 PTFE', price: '₹16,500 / EA' },
        { cpse: 'GAIL', code: 'G-201-9482', desc: 'VALVE BALL FLGD 2 INCH CLASS 150 CS BODY SS TRIM', price: '₹15,100 / EA' },
      ],
      chips: ['ASTM A216 WCB', 'ASME Class 150', '2 Inch (DN 50)', 'PTFE Seat'],
      savings: 'Emergency spare part interchangeable between GAIL and IOCL, reducing lead-time from 8 weeks to 24 hours',
    },
    pump: {
      name: 'Centrifugal Impeller (210mm OD)',
      category: 'Rotating Equipment',
      cnmc: '4320.1009.4412',
      canonical: 'Impeller, Pump: Centrifugal, Enclosed, 210mm OD, 32mm Bore, Phosphor Bronze ASTM B584 C90500',
      sources: [
        { cpse: 'ONGC', code: 'ONGC-PMP-9102', desc: 'IMPELLER CENTRIFUGAL PUMP BRONZE DIA 210MM', price: '₹38,000 / EA' },
        { cpse: 'IOCL', code: 'IOCL-ROT-449', desc: 'BRONZE IMPELLER FOR WATER PUMP OD210 BORE32', price: '₹41,500 / EA' },
        { cpse: 'GAIL', code: 'GAIL-PMP-009', desc: 'IMPELLER ENCLOSED PHOS BRONZE 210MM', price: '₹39,200 / EA' },
      ],
      chips: ['Bronze C90500', 'OD: 210mm', 'Bore: 32mm', 'API 610 11th Ed'],
      savings: 'Cross-CPSE maintenance pool eliminates duplicate safety buffer inventory of ₹1.8 Crore',
    },
  };

  const currentItem = sandboxItems[activeTab];

  return (
    <div className="min-h-screen overflow-y-auto" style={{ background: '#000000', color: '#ffffff' }}>
      {/* ── TOP NAV ── */}
      <header
        className="sticky top-0 z-50 flex items-center justify-between px-6 sm:px-10 h-16"
        style={{
          background: 'rgba(0, 0, 0, 0.85)',
          backdropFilter: 'blur(16px)',
          borderBottom: '1px solid #232825',
        }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center text-[#000000] shadow-sm"
            style={{ background: '#10B981' }}
          >
            <span className="material-symbols-outlined icon-fill text-[18px]">
              inventory_2
            </span>
          </div>
          <div>
            <p className="text-sm font-bold text-white tracking-tight leading-tight">National Material Master</p>
            <p className="text-[10px] text-[#A7ADA9] font-mono">MoPNG · SIH26099</p>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-8 text-sm text-[#A7ADA9]">
          <a href="#showcase" className="hover:text-white transition-colors">Platform Showcase</a>
          <a href="#demo" className="hover:text-white transition-colors">Interactive Demo</a>
          <a href="#bento" className="hover:text-white transition-colors">Capabilities</a>
          <a href="#impact" className="hover:text-white transition-colors">Fiscal Impact</a>
        </nav>

        <button
          onClick={() => setActiveScreen('dashboard')}
          className="px-4 py-2 rounded-lg text-xs font-bold hover:brightness-110 transition-all text-[#000000] shadow-sm"
          style={{ background: '#10B981' }}
        >
          Launch Dashboard →
        </button>
      </header>

      {/* ── HERO SECTION ── */}
      <section className="relative flex flex-col items-center text-center pt-20 pb-16 px-6 overflow-hidden">
        {/* Prominently Defined Mathematical Grid Pattern */}
        <GridPattern
          width={44}
          height={44}
          strokeDasharray="4 2"
          squares={[
            [3, 1],
            [2, 3],
            [8, 2],
            [12, 3],
            [15, 2],
            [5, 4],
            [10, 5],
            [14, 4],
            [1, 5],
          ]}
          className="[mask-image:radial-gradient(ellipse_at_center,white_35%,transparent_85%)]"
        />

        <div className="relative z-10 max-w-4xl mx-auto">
          {/* Shimmer Pill Badge */}
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium mb-6"
            style={{
              background: 'rgba(16, 185, 129, 0.12)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
            }}
          >
            <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#10B981' }} />
            <TextShimmer duration={2.2} className="font-semibold text-xs text-white">
              Smart India Hackathon 2024 · Problem Statement SIH26099
            </TextShimmer>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight mb-6 text-white tracking-tight">
            One Platform to <span className="text-[#10B981]">Unify 14.2 Million</span> CPSE Material Records
          </h1>

          <p className="text-base sm:text-lg leading-relaxed mb-8 max-w-2xl mx-auto text-[#A7ADA9]">
            India's energy giants — ONGC, IOCL, GAIL, NTPC, SAIL, BHEL — each maintain fragmented, incompatible ERP catalogs.
            Our AI standardization engine eliminates redundancy, harmonizes procurement, and unlocks <strong className="text-white">₹4,820 Crore</strong> in annual fiscal savings.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3.5 justify-center mb-16">
            <button
              onClick={() => setActiveScreen('dashboard')}
              className="px-7 py-3 rounded-lg text-sm font-bold hover:brightness-110 transition-all text-[#000000] shadow-xl flex items-center justify-center gap-2"
              style={{ background: '#10B981' }}
            >
              Start Now — Enter Dashboard
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </button>
            <a
              href="#demo"
              className="px-6 py-3 rounded-lg text-sm font-semibold transition-all hover:bg-white/5 text-white flex items-center justify-center gap-2"
              style={{
                background: '#070908',
                border: '1px solid #232825',
              }}
            >
              <span className="material-symbols-outlined text-[18px]">play_circle</span>
              Interactive Sandbox Demo
            </a>
          </div>

          {/* ── FLOATING PRODUCT CENTERPIECE (HERO SHOWCASE) ── */}
          <div
            id="showcase"
            className="relative z-20 rounded-2xl overflow-hidden text-left mx-auto transition-all"
            style={{
              background: '#0C0E0D',
              border: '1px solid #232825',
              boxShadow: '0 25px 80px -15px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(255, 255, 255, 0.04)',
            }}
          >
            {/* Window Titlebar */}
            <div
              className="px-4 py-3 flex items-center justify-between border-b border-white/10"
              style={{ background: '#070908' }}
            >
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
                <span className="ml-3 text-xs font-semibold text-[#a1a1aa] font-mono">
                  Harmonization Workbench · Cross-CPSE Parity Inspector
                </span>
              </div>

              <span
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-[#10b981]"
                style={{
                  background: 'rgba(16, 185, 129, 0.12)',
                  border: '1px solid rgba(16, 185, 129, 0.25)',
                }}
              >
                <span className="material-symbols-outlined text-[13px]">verified</span>
                98.4% AI Match
              </span>
            </div>

            {/* Showcase Visual Content: Tri-Pane Transformation */}
            <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
              {/* Left Column: Disparate CPSE Legacy Records */}
              <div className="lg:col-span-5 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold uppercase tracking-wider text-[#71717a]">
                    Legacy Disparate ERP Records
                  </span>
                  <span className="text-[10px] text-rose-400 font-mono">3 Redundant Codes</span>
                </div>

                <div className="space-y-2">
                  <div
                    className="p-3 rounded-xl border border-white/5 hover:border-white/10 transition-colors"
                    style={{ background: 'rgba(255, 255, 255, 0.02)' }}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-white flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full" style={{ background: '#10B981' }} /> ONGC Hazira
                      </span>
                      <span className="text-xs font-mono text-[#A7ADA9]">MAT-VLV-0928</span>
                    </div>
                    <p className="text-xs text-[#71717a] font-mono">BALL VALVE 50MM 150LBS CS FLANGED A216 WCB</p>
                  </div>

                  <div
                    className="p-3 rounded-xl border border-white/5 hover:border-white/10 transition-colors"
                    style={{ background: 'rgba(255, 255, 255, 0.02)' }}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-white flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full" style={{ background: '#3B82F6' }} /> IOCL Panipat
                      </span>
                      <span className="text-xs font-mono text-[#A7ADA9]">10049281</span>
                    </div>
                    <p className="text-xs text-[#71717a] font-mono">VLV BALL 2IN 150# FLG WCB/316 PTFE</p>
                  </div>

                  <div
                    className="p-3 rounded-xl border border-white/5 hover:border-white/10 transition-colors"
                    style={{ background: 'rgba(255, 255, 255, 0.02)' }}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-white flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full" style={{ background: '#A7ADA9' }} /> GAIL Vijaipur
                      </span>
                      <span className="text-xs font-mono text-[#A7ADA9]">G-201-9482</span>
                    </div>
                    <p className="text-xs text-[#71717a] font-mono">VALVE BALL FLGD 2 INCH CLASS 150 CS BODY SS TRIM</p>
                  </div>
                </div>
              </div>

              {/* Center Column: Engine Connector */}
              <div className="lg:col-span-2 flex flex-col items-center justify-center py-2 text-center">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-[#10B981] shadow-lg mb-2"
                  style={{
                    background: 'rgba(16, 185, 129, 0.15)',
                    border: '1px solid rgba(16, 185, 129, 0.3)',
                  }}
                >
                  <span className="material-symbols-outlined text-[20px] animate-pulse">
                    compare_arrows
                  </span>
                </div>
                <span className="text-[11px] font-semibold text-[#A7ADA9]">AI Parity Engine</span>
                <span className="text-[10px] text-emerald-400 font-mono">100% Agreement</span>
              </div>

              {/* Right Column: Unified National Material Master (CNMC) */}
              <div
                className="lg:col-span-5 p-4 rounded-xl space-y-3"
                style={{
                  background: 'rgba(16, 185, 129, 0.05)',
                  border: '1px solid rgba(16, 185, 129, 0.25)',
                }}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#10B981]">
                    Common National Material Code (CNMC)
                  </span>
                  <span className="text-xs font-mono font-bold text-white bg-white/10 px-2 py-0.5 rounded">
                    4014.1607.1842
                  </span>
                </div>

                <p className="text-sm font-semibold text-white leading-snug">
                  Valve, Ball: 2 IN, ASME Class 150, Flanged RF, ASTM A216 WCB Body, SS316 Trim, PTFE Seat
                </p>

                {/* Normalized Attribute Chips */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {['ASTM A216 WCB', 'ASME Class 150', '2 Inch (DN 50)', 'Flanged RF', 'PTFE Seat'].map((tag) => (
                    <span
                      key={tag}
                      className="text-[11px] px-2 py-0.5 rounded font-mono font-medium text-[#c4b5fd]"
                      style={{
                        background: 'rgba(139, 92, 246, 0.12)',
                        border: '1px solid rgba(139, 92, 246, 0.2)',
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Savings Banner */}
                <div
                  className="pt-2 border-t border-white/10 flex items-center justify-between text-xs"
                >
                  <span className="text-[#a1a1aa]">Procurement Optimization:</span>
                  <span className="font-bold text-[#10b981]">14% Inter-CPSE Bulk Discount</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── ENTERPRISE CPSE TICKER ── */}
      <section
        className="py-10 border-y border-white/5"
        style={{ background: '#09090b' }}
      >
        <div className="max-w-6xl mx-auto px-6">
          <p className="text-center text-xs font-semibold uppercase tracking-wider text-[#71717a] mb-6">
            Trusted by Major Public Sector Energy Enterprises
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 text-center">
            {[
              { name: 'ONGC', records: 4200000, label: 'Offshore & Onshore' },
              { name: 'IOCL', records: 3800000, label: 'Refineries & Pipelines' },
              { name: 'GAIL', records: 2100000, label: 'Natural Gas Grid' },
              { name: 'NTPC', records: 2400000, label: 'Thermal & Hydro Power' },
              { name: 'SAIL', records: 1700000, label: 'Steel Manufacturing' },
              { name: 'BHEL', records: 1200000, label: 'Heavy Engineering' },
            ].map((cpse) => (
              <div
                key={cpse.name}
                className="p-3.5 rounded-xl border border-white/5 hover:border-white/10 transition-colors"
                style={{ background: 'rgba(255, 255, 255, 0.02)' }}
              >
                <div className="text-base font-bold text-white">{cpse.name}</div>
                <div className="text-xs font-mono font-bold text-[#10B981] mt-0.5">
                  <AnimatedNumber value={cpse.records} duration={1600} /> records
                </div>
                <div className="text-[10px] text-[#A7ADA9] mt-0.5 truncate">{cpse.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── INTERACTIVE SANDBOX DEMO ── */}
      <section id="demo" className="py-20 px-6 max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-[#10B981]">
            Interactive Demonstration
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold mt-1 text-white tracking-tight">
            See How Disparate Legacy ERP Records Are Unified
          </h2>
          <p className="text-sm max-w-xl mx-auto text-[#A7ADA9] mt-2">
            Click across real engineering categories below to witness automated attribute extraction and CNMC assignment.
          </p>

          {/* Category Tabs */}
          <div className="flex justify-center gap-2 mt-6">
            {(['fastener', 'valve', 'pump'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className="px-4 py-2 rounded-lg text-xs font-semibold transition-all"
                style={{
                  background: activeTab === tab ? '#10B981' : '#0C0E0D',
                  color: activeTab === tab ? '#000000' : '#A7ADA9',
                  border: `1px solid ${activeTab === tab ? '#10B981' : '#232825'}`,
                }}
              >
                {sandboxItems[tab].name}
              </button>
            ))}
          </div>
        </div>

        {/* Sandbox Content Card */}
        <div
          className="rounded-2xl p-6 sm:p-8 space-y-6"
          style={{
            background: '#0C0E0D',
            border: '1px solid #232825',
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Raw Ingestion Side */}
            <div className="space-y-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#A7ADA9]">
                Raw Source Records in CPSE ERPs
              </span>
              <div className="space-y-2.5">
                {currentItem.sources.map((s) => (
                  <div
                    key={s.code}
                    className="p-3.5 rounded-xl border border-white/5 space-y-1"
                    style={{ background: 'rgba(255, 255, 255, 0.02)' }}
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-white">{s.cpse}</span>
                      <span className="font-mono text-[#A7ADA9]">{s.code}</span>
                      <span className="font-mono text-xs font-semibold text-white">{s.price}</span>
                    </div>
                    <p className="text-xs text-[#A7ADA9] font-mono leading-relaxed">{s.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Standardized CNMC Output Side */}
            <div
              className="p-5 rounded-xl flex flex-col justify-between"
              style={{
                background: 'rgba(16, 185, 129, 0.04)',
                border: '1px solid rgba(16, 185, 129, 0.25)',
              }}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#10B981]">
                    Normalized National Master
                  </span>
                  <span className="text-xs font-mono font-bold text-white bg-white/10 px-2 py-0.5 rounded">
                    {currentItem.cnmc}
                  </span>
                </div>

                <p className="text-sm font-bold text-white leading-snug">
                  {currentItem.canonical}
                </p>

                <div className="space-y-1.5 pt-2">
                  <span className="text-xs font-semibold text-[#71717a]">Extracted Technical Attributes:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {currentItem.chips.map((c) => (
                      <span
                        key={c}
                        className="text-xs font-mono px-2.5 py-0.5 rounded text-[#c4b5fd]"
                        style={{
                          background: 'rgba(139, 92, 246, 0.12)',
                          border: '1px solid rgba(139, 92, 246, 0.2)',
                        }}
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-white/10 text-xs text-[#10b981] font-semibold flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px]">trending_up</span>
                {currentItem.savings}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── BENTO GRID PLATFORM CAPABILITIES ── */}
      <section id="bento" className="py-20 px-6 max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-[#10B981]">
            Architectural Pillars
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold mt-1 text-white tracking-tight">
            Built for National-Scale Enterprise Governance
          </h2>
          <p className="text-sm max-w-xl mx-auto text-[#A7ADA9] mt-2">
            Fully compliant with MoPNG taxonomy guidelines, RTI auditability, and ERP interoperability standards.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Bento Card 1: Semantic Engine */}
          <div
            className="p-6 rounded-2xl flex flex-col justify-between card-hover"
            style={{
              background: '#0C0E0D',
              border: '1px solid #232825',
            }}
          >
            <div>
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-[#10B981] mb-4"
                style={{ background: 'rgba(16, 185, 129, 0.12)' }}
              >
                <span className="material-symbols-outlined text-[22px]">psychology</span>
              </div>
              <h3 className="text-base font-bold text-white mb-2">Semantic AI Engine</h3>
              <p className="text-xs text-[#A7ADA9] leading-relaxed">
                Domain-tuned NLP resolves abbreviations, metric-imperial units, and spelling typos across legacy records.
              </p>
            </div>
            <div className="mt-6 pt-3 border-t border-white/5 text-xs text-[#10B981] font-semibold">
              98.4% Confidence Precision →
            </div>
          </div>

          {/* Bento Card 2: Spend Pooling */}
          <div
            className="p-6 rounded-2xl flex flex-col justify-between card-hover"
            style={{
              background: '#0C0E0D',
              border: '1px solid #232825',
            }}
          >
            <div>
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-[#10B981] mb-4"
                style={{ background: 'rgba(16, 185, 129, 0.12)' }}
              >
                <span className="material-symbols-outlined text-[22px]">monitoring</span>
              </div>
              <h3 className="text-base font-bold text-white mb-2">Inter-CPSE Spend Pooling</h3>
              <p className="text-xs text-[#A7ADA9] leading-relaxed">
                Aggregates demand across public sector buyers to unlock volume bulk purchase tier pricing.
              </p>
            </div>
            <div className="mt-6 pt-3 border-t border-white/5 text-xs text-[#10B981] font-semibold">
              ₹4,820 Cr Realized Savings →
            </div>
          </div>

          {/* Bento Card 3: 6-Stage Rationalization */}
          <div
            className="p-6 rounded-2xl flex flex-col justify-between card-hover"
            style={{
              background: '#0C0E0D',
              border: '1px solid #232825',
            }}
          >
            <div>
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-[#EAB308] mb-4"
                style={{ background: 'rgba(234, 179, 8, 0.12)' }}
              >
                <span className="material-symbols-outlined text-[22px]">call_merge</span>
              </div>
              <h3 className="text-base font-bold text-white mb-2">Rationalization Workflows</h3>
              <p className="text-xs text-[#A7ADA9] leading-relaxed">
                Six staged operations (MAP, MERGE, RETAIN, RETIRE, SPLIT, REVIEW) with full downstream impact previews.
              </p>
            </div>
            <div className="mt-6 pt-3 border-t border-white/5 text-xs text-[#EAB308] font-semibold">
              68.2% Duplicate Reduction →
            </div>
          </div>

          {/* Bento Card 4: Immutable Audit Trail */}
          <div
            className="p-6 rounded-2xl flex flex-col justify-between card-hover"
            style={{
              background: '#0C0E0D',
              border: '1px solid #232825',
            }}
          >
            <div>
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-[#3B82F6] mb-4"
                style={{ background: 'rgba(59, 130, 246, 0.12)' }}
              >
                <span className="material-symbols-outlined text-[22px]">gavel</span>
              </div>
              <h3 className="text-base font-bold text-white mb-2">Immutable Audit Trail</h3>
              <p className="text-xs text-[#A7ADA9] leading-relaxed">
                Cryptographically logged records with state-before and state-after tracking for compliance and RTI readiness.
              </p>
            </div>
            <div className="mt-6 pt-3 border-t border-white/5 text-xs text-[#3B82F6] font-semibold">
              100% Traceability Guaranteed →
            </div>
          </div>
        </div>
      </section>

      {/* ── IMPACT STATS ── */}
      <section
        id="impact"
        className="py-16 border-y border-white/5"
        style={{ background: '#0C0E0D' }}
      >
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-white">Measurable National Fiscal Impact</h2>
        </div>
        <div className="flex flex-wrap justify-center divide-x divide-white/5">
          <StatCard prefix="₹" suffix=" Cr" target={4820} label="Annual Procurement Savings" sublabel="Via cross-CPSE demand pooling" />
          <StatCard target={14200000} suffix="+" label="Source Records Ingested" sublabel="Across 6 CPSE enterprise systems" />
          <StatCard target={3100000} label="Approved CNMC Masters" sublabel="Governed under MoPNG taxonomy" />
          <StatCard suffix="%" target={91.4} decimals={1} label="Interoperability Parity Score" sublabel="Standard taxonomy alignment score" />
        </div>
      </section>

      {/* ── FINAL CALL TO ACTION ── */}
      <section className="py-24 px-6 text-center">
        <div className="max-w-2xl mx-auto space-y-6">
          <h2 className="text-3xl font-bold text-white tracking-tight">
            Ready to Explore the Platform?
          </h2>
          <p className="text-sm text-[#A7ADA9] leading-relaxed">
            Enter the executive dashboard to monitor live harmonization metrics, inspect duplicate candidates, 
            and experience India's national material management standard.
          </p>
          <button
            onClick={() => setActiveScreen('dashboard')}
            className="px-8 py-3.5 rounded-lg text-sm font-bold hover:brightness-110 transition-all text-[#000000] shadow-2xl"
            style={{ background: '#10B981' }}
          >
            Launch Executive Dashboard →
          </button>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer
        className="py-6 px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs border-t border-white/10"
        style={{ background: '#000000', color: '#A7ADA9' }}
      >
        <span>© 2024 National Unified Material Master · SIH26099 · Ministry of Petroleum &amp; Natural Gas</span>
        <div className="flex items-center gap-5">
          <button onClick={() => setActiveScreen('governance')} className="hover:text-white transition-colors">
            Audit Trail
          </button>
          <button onClick={() => setActiveScreen('settings')} className="hover:text-white transition-colors">
            Settings
          </button>
          <button onClick={() => setActiveScreen('support')} className="hover:text-white transition-colors">
            Documentation
          </button>
        </div>
      </footer>
    </div>
  );
};
