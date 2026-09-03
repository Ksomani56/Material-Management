import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

export const HomeScreen: React.FC = () => {
  const { setActiveScreen, openUploadModal } = useApp();
  const [selectedExampleTab, setSelectedExampleTab] = useState<'fastener' | 'valve' | 'pump'>('fastener');

  const examples = {
    fastener: {
      category: 'Fasteners & Hardware',
      unifiedCnmc: '3116.1504.8920',
      canonicalTitle: 'Bolt, Hex Head, M10 x 50mm, Stainless Steel 304, Fully Threaded (DIN 933)',
      sources: [
        { cpse: 'ONGC (Western Offshore)', localCode: 'MAT-10482', rawDesc: 'HEX BOLT M10 X 50 SS304', price: '₹48 / EA' },
        { cpse: 'IOCL (Panipat Refinery)', localCode: 'IOCL-FST-902', rawDesc: 'BOLT HEX SS304 M10X50MM FULL THD', price: '₹55 / EA' },
        { cpse: 'NTPC (Singrauli STPS)', localCode: 'NGC-BLT-004', rawDesc: 'FASTENER HEX HEAD M10*50 AISI-304', price: '₹52 / EA' }
      ],
      extractedAttributes: [
        { name: 'Item Type', value: 'Hex Head Bolt' },
        { name: 'Thread Size', value: 'M10 (Pitch 1.5mm)' },
        { name: 'Length', value: '50 mm' },
        { name: 'Material Grade', value: 'SS 304' },
        { name: 'Standard', value: 'DIN 933 / ISO 4017' }
      ],
      procurementImpact: 'Identical fastener currently procured under 3 distinct purchase orders. Consolidation enables 14% bulk purchase discount across participating CPSEs.'
    },
    valve: {
      category: 'Valves & Flow Control',
      unifiedCnmc: '4014.1607.1842',
      canonicalTitle: 'Valve, Ball: 2 IN, ASME Class 150, Flanged RF, ASTM A216 WCB Body, SS316 Trim, PTFE Seat',
      sources: [
        { cpse: 'ONGC (Hazira Plant)', localCode: 'MAT-VLV-0928', rawDesc: 'BALL VALVE 50MM 150LBS CS FLANGED A216 WCB', price: '₹14,200 / EA' },
        { cpse: 'IOCL (Paradip)', localCode: '10049281', rawDesc: 'VLV BALL 2IN 150# FLG WCB/316 PTFE', price: '₹16,500 / EA' },
        { cpse: 'GAIL (Vijaipur)', localCode: 'G-201-9482', rawDesc: 'VALVE BALL FLGD 2 INCH CLASS 150 CS BODY SS TRIM', price: '₹15,100 / EA' }
      ],
      extractedAttributes: [
        { name: 'Valve Type', value: 'Floating Ball Valve' },
        { name: 'Nominal Size', value: '2 Inch (DN 50)' },
        { name: 'Pressure Class', value: 'ASME Class 150' },
        { name: 'Body Material', value: 'ASTM A216 WCB' },
        { name: 'Seat Material', value: 'Virgin PTFE' }
      ],
      procurementImpact: 'Emergency shutdown spare part interchangeable between GAIL pipeline station and IOCL refinery, cutting downtime procurement lead-time from 8 weeks to 24 hours.'
    },
    pump: {
      category: 'Rotating Equipment',
      unifiedCnmc: '4320.1009.4412',
      canonicalTitle: 'Impeller, Pump: Centrifugal, Enclosed, 210mm OD, 32mm Bore, Phosphor Bronze ASTM B584 C90500',
      sources: [
        { cpse: 'ONGC (Offshore)', localCode: 'ONGC-PMP-9102', rawDesc: 'IMPELLER CENTRIFUGAL PUMP BRONZE DIA 210MM', price: '₹38,000 / EA' },
        { cpse: 'IOCL (Mathura)', localCode: 'IOCL-ROT-449', rawDesc: 'BRONZE IMPELLER FOR WATER PUMP OD210 BORE32', price: '₹41,500 / EA' },
        { cpse: 'GAIL (Pata)', localCode: 'GAIL-PMP-009', rawDesc: 'IMPELLER ENCLOSED PHOS BRONZE 210MM', price: '₹39,200 / EA' }
      ],
      extractedAttributes: [
        { name: 'Component', value: 'Centrifugal Impeller' },
        { name: 'Outer Diameter', value: '210 mm' },
        { name: 'Bore Diameter', value: '32 mm Standard' },
        { name: 'Alloy', value: 'Bronze C90500' },
        { name: 'Design Standard', value: 'API 610 11th Ed' }
      ],
      procurementImpact: 'Standardized spare code allows pooled inventory maintenance across 3 regional depots, reducing total spare holding costs by 32%.'
    }
  };

  const activeDemo = examples[selectedExampleTab];

  return (
    <main className="flex-1 overflow-y-auto p-6 space-y-6 max-w-6xl mx-auto" style={{ background: 'var(--bg)' }}>
      {/* 1. Header & Problem Context */}
      <section 
        className="rounded-xl p-6 space-y-4"
        style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
      >
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <span 
              className="text-xs uppercase font-bold tracking-wider px-2.5 py-1 rounded"
              style={{ background: 'var(--blue-dim)', color: 'var(--blue)' }}
            >
              National Unified Material Master · SIH26099
            </span>
            <h1 className="text-xl font-bold tracking-tight mt-2.5" style={{ color: 'var(--text-primary)' }}>
              Cross-Enterprise Catalog Harmonization Platform
            </h1>
          </div>
          <button
            onClick={() => setActiveScreen('dashboard')}
            className="px-4 py-2 font-semibold text-xs rounded-lg transition-all flex items-center gap-2 shrink-0 hover:brightness-110"
            style={{ background: 'var(--blue)', color: '#fff' }}
          >
            Enter Dashboard
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </button>
        </div>

        <div 
          className="p-4 rounded-xl space-y-2 text-xs leading-relaxed"
          style={{ background: 'var(--bg-hover)', border: '1px solid var(--border-subtle)' }}
        >
          <h2 className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-primary)' }}>
            The Public Sector Challenge
          </h2>
          <p style={{ color: 'var(--text-secondary)' }}>
            Central Public Sector Enterprises (CPSEs) such as ONGC, IOCL, GAIL, and NTPC manage millions of inventory items in disconnected legacy ERP systems. Because each organization records descriptions using different internal conventions, identical physical materials are cataloged under disparate item codes. This leads to duplicate inventory holding, procurement fragmentation, and lack of inter-enterprise spare sharing.
          </p>
          <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>
            This platform ingests raw ERP records, extracts normalized technical attributes via domain-trained semantic analysis, and unifies duplicate items under an authoritative Common National Material Code (CNMC).
          </p>
        </div>
      </section>

      {/* 2. Interactive Live Example */}
      <section 
        className="rounded-xl p-6 space-y-5"
        style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
      >
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <h2 className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>
              Live Harmonization Demonstration
            </h2>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>
              Select an item category to observe how divergent ERP descriptions converge into a single national standard.
            </p>
          </div>

          {/* Example Selector Tabs */}
          <div 
            className="flex gap-1 p-1 rounded-lg text-xs font-medium"
            style={{ background: 'var(--bg-hover)', border: '1px solid var(--border)' }}
          >
            {(['fastener', 'valve', 'pump'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setSelectedExampleTab(tab)}
                className="px-3.5 py-1.5 rounded-md transition-all font-semibold capitalize"
                style={{
                  background: selectedExampleTab === tab ? 'var(--blue)' : 'transparent',
                  color: selectedExampleTab === tab ? '#fff' : 'var(--text-secondary)',
                }}
              >
                {tab === 'fastener' ? 'Fasteners' : tab === 'valve' ? 'Valves' : 'Pumps & Impellers'}
              </button>
            ))}
          </div>
        </div>

        {/* The 3-Step Convergence Visualizer */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
          {/* Step 1: Disparate Inputs */}
          <div 
            className="lg:col-span-5 p-4 rounded-xl flex flex-col justify-between space-y-3"
            style={{ background: 'var(--bg-hover)', border: '1px solid var(--border)' }}
          >
            <div>
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs uppercase font-bold tracking-wider" style={{ color: 'var(--text-muted)' }}>
                  Step 1: Input Records (3 Isolated ERPs)
                </span>
                <span className="text-xs font-mono font-bold" style={{ color: 'var(--warning)' }}>
                  Fragmented Codes
                </span>
              </div>

              <div className="space-y-2.5">
                {activeDemo.sources.map((src, idx) => (
                  <div 
                    key={idx} 
                    className="p-3 rounded-lg space-y-1.5"
                    style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}
                  >
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold" style={{ color: 'var(--text-primary)' }}>{src.cpse}</span>
                      <span className="font-mono text-xs font-bold" style={{ color: 'var(--blue)' }}>{src.localCode}</span>
                    </div>
                    <p className="font-mono text-xs" style={{ color: 'var(--text-secondary)' }}>
                      "{src.rawDesc}"
                    </p>
                    <div 
                      className="text-xs pt-1.5 flex justify-between"
                      style={{ borderTop: '1px solid var(--border-subtle)', color: 'var(--text-muted)' }}
                    >
                      <span>ERP Purchase Unit Cost:</span>
                      <span className="font-mono font-bold" style={{ color: 'var(--text-primary)' }}>{src.price}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <p className="text-xs font-mono pt-2" style={{ color: 'var(--text-muted)' }}>
              Result of uncoordinated cataloging: 3 separate RFQs, differing pricing, zero visibility.
            </p>
          </div>

          {/* Convergence Arrow Indicator */}
          <div className="hidden lg:flex lg:col-span-2 flex-col items-center justify-center gap-2 text-center px-2">
            <span className="material-symbols-outlined text-3xl" style={{ color: 'var(--blue)' }}>compare_arrows</span>
            <span className="text-xs uppercase font-bold leading-tight" style={{ color: 'var(--blue)' }}>
              Standardization Engine
            </span>
            <span className="material-symbols-outlined text-xl" style={{ color: 'var(--blue)' }}>arrow_forward</span>
          </div>

          {/* Step 2: Harmonized Output */}
          <div 
            className="lg:col-span-5 p-4 rounded-xl flex flex-col justify-between space-y-3 relative"
            style={{ background: 'var(--bg-hover)', border: '1px solid rgba(59,130,246,0.3)' }}
          >
            <div>
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs uppercase font-bold tracking-wider" style={{ color: 'var(--blue)' }}>
                  Step 2: Unified Specification
                </span>
                <span className="text-xs font-mono font-bold flex items-center gap-1" style={{ color: 'var(--success)' }}>
                  <span className="material-symbols-outlined text-sm">verified</span>
                  100% Normalized
                </span>
              </div>

              <div 
                className="p-3.5 rounded-lg space-y-1.5"
                style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
              >
                <span className="text-xs uppercase font-semibold" style={{ color: 'var(--text-muted)' }}>
                  Assigned National Code (CNMC)
                </span>
                <div className="font-mono text-lg font-bold" style={{ color: 'var(--blue)' }}>
                  {activeDemo.unifiedCnmc}
                </div>
                <p className="text-xs font-medium leading-relaxed" style={{ color: 'var(--text-primary)' }}>
                  {activeDemo.canonicalTitle}
                </p>
              </div>

              <div className="mt-3 space-y-1.5">
                <span className="text-xs uppercase font-semibold block" style={{ color: 'var(--text-muted)' }}>
                  Extracted Technical Parameters:
                </span>
                <div className="grid grid-cols-2 gap-2 font-mono text-xs">
                  {activeDemo.extractedAttributes.map((attr, idx) => (
                    <div 
                      key={idx} 
                      className="p-2 rounded"
                      style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}
                    >
                      <span className="block text-[10px] font-sans" style={{ color: 'var(--text-muted)' }}>{attr.name}</span>
                      <span className="font-bold" style={{ color: 'var(--text-primary)' }}>{attr.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div 
              className="p-3 rounded-lg text-xs space-y-1"
              style={{ background: 'var(--blue-dim)', border: '1px solid rgba(59,130,246,0.2)' }}
            >
              <span className="font-bold block uppercase text-xs" style={{ color: 'var(--blue)' }}>Direct Financial Impact:</span>
              <p className="leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                {activeDemo.procurementImpact}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Three-Phase Enterprise Workflow */}
      <section 
        className="rounded-xl p-6 space-y-4"
        style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
      >
        <div>
          <h2 className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>
            System Workflow Architecture
          </h2>
          <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>
            The core lifecycle converting unstandardized records into approved national master records.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              step: '01',
              title: 'Catalog Ingestion',
              desc: 'Legacy items are onboarded via direct database connectors (SAP S/4HANA, Oracle ERP Cloud, IBM Maximo) or uploaded using Excel and CSV spreadsheets.',
              action: 'Upload Spreadsheet',
              onClick: () => openUploadModal('ONGC'),
            },
            {
              step: '02',
              title: 'Semantic Deduplication',
              desc: 'The NLP engine parses raw description strings, decomposes noun-modifier syntax, resolves unit variances, and scores attribute parity against existing national codes.',
              action: 'Inspect Workbench',
              onClick: () => setActiveScreen('harmonization'),
            },
            {
              step: '03',
              title: 'Governance & Aliasing',
              desc: 'Approved matches create immutable cross-references. CPSE ERPs receive forward aliases without altering internal warehouse configurations.',
              action: 'View Audit Ledger',
              onClick: () => setActiveScreen('governance'),
            },
          ].map(wf => (
            <div 
              key={wf.step}
              className="p-5 rounded-xl flex flex-col justify-between space-y-3 card-hover"
              style={{ background: 'var(--bg-hover)', border: '1px solid var(--border)' }}
            >
              <div>
                <div 
                  className="w-8 h-8 rounded-lg flex items-center justify-center font-mono font-bold text-xs mb-3"
                  style={{ background: 'var(--blue-dim)', color: 'var(--blue)', border: '1px solid rgba(59,130,246,0.3)' }}
                >
                  {wf.step}
                </div>
                <h3 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
                  {wf.title}
                </h3>
                <p className="text-xs leading-relaxed mt-1.5" style={{ color: 'var(--text-secondary)' }}>
                  {wf.desc}
                </p>
              </div>
              <button
                onClick={wf.onClick}
                className="text-xs font-semibold hover:underline flex items-center gap-1 pt-3"
                style={{ color: 'var(--blue)', borderTop: '1px solid var(--border-subtle)' }}
              >
                {wf.action} <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Bottom Gateway */}
      <section 
        className="p-6 rounded-xl flex flex-col sm:flex-row justify-between items-center gap-4"
        style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
      >
        <div>
          <h3 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
            Ready to explore operational records?
          </h3>
          <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>
            Proceed to the Executive Dashboard for nationwide metrics, or open the Central Catalog to inspect 3.1 million master records.
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setActiveScreen('master')}
            className="px-4 py-2 rounded-lg text-xs font-semibold transition-all hover:opacity-80"
            style={{ background: 'var(--bg-hover)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
          >
            Central Catalog
          </button>
          <button
            onClick={() => setActiveScreen('dashboard')}
            className="px-4 py-2 rounded-lg text-xs font-semibold transition-all hover:brightness-110"
            style={{ background: 'var(--blue)', color: '#fff' }}
          >
            Executive Dashboard
          </button>
        </div>
      </section>
    </main>
  );
};
