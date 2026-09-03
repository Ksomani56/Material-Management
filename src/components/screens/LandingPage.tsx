import React, { useEffect, useRef, useState } from 'react';
import { useApp } from '../../context/AppContext';

/* ── Animated counter hook ── */
function useCounter(target: number, duration = 1800, active = false) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!active) return;
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start = Math.min(start + step, target);
      setValue(Math.floor(start));
      if (start >= target) clearInterval(timer);
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration, active]);
  return value;
}

/* ── Intersection observer for scroll-triggered animations ── */
function useInView(threshold = 0.3) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, inView };
}

/* ── Stat counter card ── */
function StatCard({ prefix = '', suffix = '', target, label, sublabel }: {
  prefix?: string; suffix?: string; target: number; label: string; sublabel: string;
}) {
  const { ref, inView } = useInView();
  const value = useCounter(target, 2000, inView);
  return (
    <div ref={ref} className="text-center px-8 py-6">
      <div className="text-3xl font-bold mb-1" style={{ color: 'var(--blue)' }}>
        {prefix}{inView ? value.toLocaleString() : '0'}{suffix}
      </div>
      <div className="text-sm font-semibold mb-0.5" style={{ color: 'var(--text-primary)' }}>{label}</div>
      <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>{sublabel}</div>
    </div>
  );
}

const FEATURES = [
  {
    icon: 'rebase_edit',
    title: 'Harmonization Workbench',
    desc: 'AI-powered tri-pane interface that compares source records, recommends national matches, and lets catalogers approve or reject with a single click.',
  },
  {
    icon: 'inventory_2',
    title: 'National Material Master',
    desc: 'Searchable, filterable central repository of 3.1M approved Common National Material Codes (CNMCs) governed under MoPNG taxonomy.',
  },
  {
    icon: 'fact_check',
    title: 'Human Review Queue',
    desc: 'Prioritized queue for borderline duplicate candidates. Batch approve, flag, or reject with full explainability reports on each decision.',
  },
  {
    icon: 'call_merge',
    title: 'Catalog Rationalization',
    desc: 'MAP, MERGE, RETIRE, SPLIT, RETAIN — six staged workflow operations that safely consolidate legacy codes with full downstream impact preview.',
  },
  {
    icon: 'monitoring',
    title: 'Analytics & Savings',
    desc: 'Real-time procurement savings dashboard — ₹4,820 Cr potential, 68.2% catalog reduction, and 91.4% cross-CPSE interoperability metrics.',
  },
  {
    icon: 'gavel',
    title: 'Immutable Audit Trail',
    desc: 'Every action — human or AI — is cryptographically logged. Full state-before/after records for compliance, RTI, and audit committee review.',
  },
];

const STEPS = [
  {
    num: '01',
    title: 'Ingest',
    icon: 'upload_file',
    desc: 'Connect enterprise ERP systems (SAP S/4HANA, Oracle, IBM Maximo) or upload Excel/CSV files containing raw legacy material records.',
  },
  {
    num: '02',
    title: 'Deduplicate',
    icon: 'rebase_edit',
    desc: 'Our NLP engine parses descriptions, resolves unit variances, extracts technical attributes, and scores parity against national standards.',
  },
  {
    num: '03',
    title: 'Govern',
    icon: 'gavel',
    desc: 'Cataloger committee reviews and approves matches. Approved records are assigned a CNMC and forward-alias cross-references are created.',
  },
];

const CPSES = ['ONGC', 'IOCL', 'GAIL', 'NTPC', 'SAIL', 'BHEL'];

export const LandingPage: React.FC = () => {
  const { setActiveScreen, theme } = useApp();

  return (
    <div
      className="h-screen overflow-y-auto"
      style={{ background: 'var(--bg)', color: 'var(--text-primary)' }}
    >
      {/* ── TOP NAV ── */}
      <header
        className="sticky top-0 z-50 flex items-center justify-between px-8 h-14"
        style={{
          background: 'var(--bg-surface)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid var(--border)',
        }}
      >
        <div className="flex items-center gap-2.5">
          <div
            className="w-7 h-7 rounded flex items-center justify-center"
            style={{ background: 'var(--blue-dim)', border: '1px solid rgba(59,130,246,0.3)' }}
          >
            <span className="material-symbols-outlined icon-fill text-[16px]" style={{ color: 'var(--blue)' }}>
              inventory_2
            </span>
          </div>
          <div>
            <p className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>National Material Master</p>
            <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>MoPNG · SIH26099</p>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-6 text-sm" style={{ color: 'var(--text-secondary)' }}>
          <a href="#problem" className="hover:opacity-80 transition-opacity">The Problem</a>
          <a href="#how" className="hover:opacity-80 transition-opacity">How It Works</a>
          <a href="#features" className="hover:opacity-80 transition-opacity">Features</a>
          <a href="#impact" className="hover:opacity-80 transition-opacity">Impact</a>
        </nav>

        <button
          onClick={() => setActiveScreen('dashboard')}
          className="px-4 py-2 rounded text-sm font-semibold hover:brightness-110 transition-all"
          style={{ background: 'var(--blue)', color: '#fff' }}
        >
          Start Now →
        </button>
      </header>

      {/* ── HERO ── */}
      <section className="relative flex flex-col items-center text-center py-28 px-6 overflow-hidden">
        {/* Background grid */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `
              linear-gradient(var(--border-subtle) 1px, transparent 1px),
              linear-gradient(90deg, var(--border-subtle) 1px, transparent 1px)
            `,
            backgroundSize: '48px 48px',
            opacity: 0.6,
          }}
        />
        {/* Clean background without blue cast */}

        <div className="relative z-10 max-w-3xl animate-slide-in-up">
          <span
            className="inline-block px-3 py-1 rounded-full text-xs font-medium mb-6"
            style={{ background: 'var(--blue-dim)', color: 'var(--blue)', border: '1px solid rgba(59,130,246,0.2)' }}
          >
            Smart India Hackathon 2024 · Problem Statement SIH26099
          </span>

          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-5" style={{ color: 'var(--text-primary)' }}>
            One Platform to Unify{' '}
            <span style={{ color: 'var(--blue)' }}>14.2 Million</span>
            <br />
            CPSE Material Records
          </h1>

          <p className="text-base leading-relaxed mb-8 max-w-2xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
            India's public sector enterprises — ONGC, IOCL, GAIL, NTPC, SAIL, BHEL — each maintain separate, 
            incompatible material catalogs. The National Unified Material Master eliminates fragmentation, 
            standardizes procurement, and saves ₹4,820 Crore annually.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => setActiveScreen('dashboard')}
              className="px-6 py-3 rounded-lg text-sm font-semibold hover:brightness-110 transition-all"
              style={{ background: 'var(--blue)', color: '#fff' }}
            >
              Start Now →
            </button>
            <a
              href="#how"
              className="px-6 py-3 rounded-lg text-sm font-semibold transition-all hover:opacity-80"
              style={{ background: 'var(--bg-card)', color: 'var(--text-primary)', border: '1px solid var(--border)' }}
            >
              See How It Works
            </a>
          </div>
        </div>

        {/* CPSE Trust Strip */}
        <div className="relative z-10 mt-16 flex flex-wrap justify-center gap-3">
          {CPSES.map(c => (
            <span
              key={c}
              className="px-4 py-2 rounded-lg text-sm font-semibold"
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                color: 'var(--text-secondary)',
              }}
            >
              {c}
            </span>
          ))}
        </div>
      </section>

      {/* ── PROBLEM ── */}
      <section id="problem" className="py-20 px-6 max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>
            The Problem We're Solving
          </h2>
          <p className="text-sm max-w-xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
            India's public sector enterprises spend billions more than necessary due to catalog fragmentation.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {[
            { icon: 'warning', title: 'Duplicate Inventory', val: '68.2%', desc: 'Of all CPSE material codes are identical items cataloged under different names, descriptions, and units.' },
            { icon: 'currency_rupee', title: 'Procurement Waste', val: '₹4,820 Cr', desc: 'Annual savings foregone because identical items are purchased separately without cross-enterprise pooling.' },
            { icon: 'schedule', title: 'Emergency Delays', val: '8 Weeks', desc: 'Average procurement lead-time for a spare part that an adjacent CPSE already stocks but cannot locate due to catalog mismatch.' },
          ].map(p => (
            <div
              key={p.title}
              className="p-6 rounded-xl card-hover"
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
            >
              <span
                className="material-symbols-outlined icon-fill text-[28px] mb-3 block"
                style={{ color: 'var(--blue)' }}
              >
                {p.icon}
              </span>
              <div className="text-2xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>{p.val}</div>
              <div className="text-sm font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>{p.title}</div>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{p.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section
        id="how"
        className="py-20 px-6"
        style={{ background: 'var(--bg-surface)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}
      >
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>
              How It Works
            </h2>
            <p className="text-sm max-w-xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
              A three-phase automated pipeline that transforms messy legacy data into a clean national standard.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {STEPS.map((step, idx) => (
              <div key={step.num} className="relative">
                {idx < STEPS.length - 1 && (
                  <div
                    className="hidden md:block absolute top-8 left-full w-full h-px z-10"
                    style={{ background: 'linear-gradient(90deg, var(--blue), transparent)', marginLeft: '-24px', width: '100%' }}
                  />
                )}
                <div
                  className="p-6 rounded-xl card-hover h-full"
                  style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center font-mono font-bold text-sm"
                      style={{ background: 'var(--blue-dim)', color: 'var(--blue)', border: '1px solid rgba(59,130,246,0.2)' }}
                    >
                      {step.num}
                    </div>
                    <div>
                      <span className="material-symbols-outlined icon-fill text-[22px]" style={{ color: 'var(--blue)' }}>
                        {step.icon}
                      </span>
                    </div>
                  </div>
                  <h3 className="text-sm font-bold mb-2" style={{ color: 'var(--text-primary)' }}>{step.title}</h3>
                  <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" className="py-20 px-6 max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>
            Platform Capabilities
          </h2>
          <p className="text-sm max-w-xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
            Built for the rigors of public sector procurement, compliance, and governance.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURES.map(f => (
            <div
              key={f.title}
              className="p-5 rounded-xl card-hover"
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
            >
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center mb-4"
                style={{ background: 'var(--blue-dim)' }}
              >
                <span className="material-symbols-outlined icon-fill text-[20px]" style={{ color: 'var(--blue)' }}>
                  {f.icon}
                </span>
              </div>
              <h3 className="text-xs font-semibold mb-1.5" style={{ color: 'var(--text-primary)' }}>{f.title}</h3>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── IMPACT / COUNTERS ── */}
      <section
        id="impact"
        className="py-16"
        style={{ background: 'var(--bg-surface)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}
      >
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Measurable Impact</h2>
        </div>
        <div className="flex flex-wrap justify-center divide-x" style={{ borderColor: 'var(--border)' }}>
          <StatCard prefix="₹" suffix=" Cr" target={4820} label="Annual Savings Potential" sublabel="Via cross-CPSE procurement pooling" />
          <StatCard target={14200000} suffix="+" label="Source Records Ingested" sublabel="Across 6 CPSE enterprise systems" />
          <StatCard target={3100000} label="Approved CNMC Masters" sublabel="Governed under MoPNG taxonomy" />
          <StatCard suffix="%" target={91} label="Cross-CPSE Interoperability" sublabel="Standard taxonomy alignment score" />
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="py-24 px-6 text-center">
        <h2 className="text-2xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>
          Ready to Explore the Platform?
        </h2>
        <p className="text-sm mb-8 max-w-lg mx-auto" style={{ color: 'var(--text-secondary)' }}>
          Enter the executive dashboard to see real-time metrics, review duplicate candidates, 
          and start harmonizing India's national material catalog.
        </p>
        <button
          onClick={() => setActiveScreen('dashboard')}
          className="px-8 py-3.5 rounded-lg text-sm font-semibold hover:brightness-110 transition-all shadow-elevated"
          style={{ background: 'var(--blue)', color: '#fff' }}
        >
          Launch Dashboard →
        </button>
      </section>

      {/* ── FOOTER ── */}
      <footer
        className="py-6 px-8 flex items-center justify-between text-xs"
        style={{ borderTop: '1px solid var(--border)', color: 'var(--text-muted)' }}
      >
        <span>© 2024 National Material Master · SIH26099 · Ministry of Petroleum & Natural Gas</span>
        <div className="flex items-center gap-4">
          <button onClick={() => setActiveScreen('governance')} className="hover:opacity-80 transition-opacity">Audit Trail</button>
          <button onClick={() => setActiveScreen('settings')} className="hover:opacity-80 transition-opacity">Settings</button>
          <button onClick={() => setActiveScreen('support')} className="hover:opacity-80 transition-opacity">Documentation</button>
        </div>
      </footer>
    </div>
  );
};
