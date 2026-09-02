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
        { name: 'Thread Size', value: 'M10 (Coarse Pitch 1.5mm)' },
        { name: 'Length', value: '50 mm' },
        { name: 'Material Grade', value: 'Stainless Steel AISI 304' },
        { name: 'Standard', value: 'DIN 933 / ISO 4017' }
      ],
      procurementImpact: 'Identical fastener currently procured under 3 distinct purchase orders. Consolidation enables 14% bulk purchase discount across participating units.'
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
        { name: 'Body Material', value: 'Carbon Steel (ASTM A216 WCB)' },
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
        { name: 'Component', value: 'Centrifugal Impeller (Enclosed)' },
        { name: 'Outer Diameter', value: '210 mm' },
        { name: 'Bore Diameter', value: '32 mm with Standard Keyway' },
        { name: 'Alloy', value: 'Phosphor Bronze C90500' },
        { name: 'Design Standard', value: 'API 610 11th Edition' }
      ],
      procurementImpact: 'Standardized spare code allows pooled inventory maintenance across 3 regional depots, reducing total spare holding costs by 32%.'
    }
  };

  const activeDemo = examples[selectedExampleTab];

  return (
    <main className="flex-1 overflow-y-auto p-margin-page bg-background transition-colors duration-200 space-y-8 max-w-6xl mx-auto">
      {/* 1. Header & Problem Context */}
      <section className="bg-surface-container rounded-2xl border border-outline-variant/40 p-8 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <span className="font-label-caps text-label-caps text-primary uppercase font-bold tracking-wider">
              National Unified Material Master | SIH-26099
            </span>
            <h1 className="font-headline-section text-2xl font-bold text-on-surface mt-1">
              Cross-Enterprise Catalog Harmonization Platform
            </h1>
          </div>
          <button
            onClick={() => setActiveScreen('dashboard')}
            className="px-5 py-2.5 bg-primary text-on-primary font-bold text-xs rounded-xl hover:brightness-110 transition-all flex items-center gap-2 shadow-sm shrink-0"
          >
            Enter Executive Dashboard
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </button>
        </div>

        <div className="p-5 bg-surface-container-low rounded-xl border border-outline-variant/30 space-y-2">
          <h2 className="font-headline-section text-sm font-bold text-on-surface uppercase">
            The Public Sector Challenge
          </h2>
          <p className="text-xs text-on-surface-variant leading-relaxed">
            Central Public Sector Enterprises (CPSEs) such as ONGC, IOCL, GAIL, and NTPC manage millions of inventory items in disconnected legacy ERP systems. Because each organization records descriptions using different internal conventions, identical physical materials are cataloged under disparate item codes. This leads to duplicate inventory holding, procurement fragmentation, and lack of inter-enterprise spare sharing.
          </p>
          <p className="text-xs text-on-surface leading-relaxed font-medium">
            This platform ingests raw ERP records, extracts normalized technical attributes via domain-trained semantic analysis, and unifies duplicate items under an authoritative Common National Material Code (CNMC).
          </p>
        </div>
      </section>

      {/* 2. Interactive Live Example (The Resolution Mechanism) */}
      <section className="bg-surface-container rounded-2xl border border-outline-variant/40 p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <h2 className="font-headline-section text-base font-bold text-on-surface">
              Live Harmonization Demonstration
            </h2>
            <p className="text-xs text-on-surface-variant mt-0.5">
              Select an item category to observe how divergent ERP descriptions converge into a single national standard.
            </p>
          </div>

          {/* Example Selector Tabs */}
          <div className="flex gap-1.5 p-1 bg-surface-container-low rounded-xl border border-outline-variant/40 text-xs font-semibold">
            <button
              onClick={() => setSelectedExampleTab('fastener')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                selectedExampleTab === 'fastener'
                  ? 'bg-surface-container text-primary font-bold border border-outline-variant/40 shadow-xs'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Fasteners
            </button>
            <button
              onClick={() => setSelectedExampleTab('valve')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                selectedExampleTab === 'valve'
                  ? 'bg-surface-container text-primary font-bold border border-outline-variant/40 shadow-xs'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Valves
            </button>
            <button
              onClick={() => setSelectedExampleTab('pump')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                selectedExampleTab === 'pump'
                  ? 'bg-surface-container text-primary font-bold border border-outline-variant/40 shadow-xs'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Pumps & Impellers
            </button>
          </div>
        </div>

        {/* The 3-Step Convergence Visualizer */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
          {/* Step 1: Disparate CPSE Inputs (5 Columns) */}
          <div className="lg:col-span-5 bg-surface-container-low p-5 rounded-xl border border-outline-variant/30 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex justify-between items-center mb-3">
                <span className="font-label-caps text-[11px] text-on-surface-variant uppercase font-bold">
                  Step 1: Input Records (3 Isolated ERPs)
                </span>
                <span className="text-[10px] font-data-mono text-status-warning font-semibold">
                  Fragmented Codes
                </span>
              </div>

              <div className="space-y-2.5">
                {activeDemo.sources.map((src, idx) => (
                  <div key={idx} className="p-3 bg-surface-container rounded-lg border border-outline-variant/40 space-y-1">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-on-surface font-sans">{src.cpse}</span>
                      <span className="font-data-mono text-primary text-[11px] font-semibold">{src.localCode}</span>
                    </div>
                    <p className="font-data-mono text-xs text-on-surface-variant">
                      "{src.rawDesc}"
                    </p>
                    <div className="text-[10px] text-on-surface-variant pt-1 border-t border-outline-variant/20 flex justify-between">
                      <span>ERP Purchase Unit Cost:</span>
                      <span className="font-data-mono font-semibold text-on-surface">{src.price}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <p className="text-[11px] text-on-surface-variant font-data-mono">
              Result of uncoordinated cataloging: 3 separate RFQs, differing pricing, zero visibility.
            </p>
          </div>

          {/* Convergence Arrow Indicator (Center Column) */}
          <div className="hidden lg:flex lg:col-span-2 flex-col items-center justify-center gap-2 text-primary">
            <span className="material-symbols-outlined text-3xl">rebase_edit</span>
            <span className="font-label-caps text-[10px] uppercase font-bold text-center">
              AI Technical Extraction & Parity Scoring
            </span>
            <span className="material-symbols-outlined text-2xl">arrow_forward</span>
          </div>

          {/* Step 2: Harmonized National Output (5 Columns) */}
          <div className="lg:col-span-5 bg-surface-container-low p-5 rounded-xl border border-primary/40 flex flex-col justify-between space-y-4 relative">
            <div>
              <div className="flex justify-between items-center mb-3">
                <span className="font-label-caps text-[11px] text-primary uppercase font-bold">
                  Step 2: Unified National Specification
                </span>
                <span className="text-[10px] font-data-mono text-status-success font-semibold flex items-center gap-0.5">
                  <span className="material-symbols-outlined text-xs">verified</span>
                  100% Normalized
                </span>
              </div>

              <div className="p-3.5 bg-surface-container rounded-lg border border-primary/30 space-y-2">
                <span className="font-label-caps text-[10px] text-on-surface-variant uppercase">
                  Assigned National Code (CNMC)
                </span>
                <div className="font-display-cnmc text-lg font-bold text-primary">
                  {activeDemo.unifiedCnmc}
                </div>
                <p className="font-body-standard text-xs text-on-surface font-semibold leading-relaxed">
                  {activeDemo.canonicalTitle}
                </p>
              </div>

              <div className="mt-3 space-y-1.5">
                <span className="font-label-caps text-[10px] text-on-surface-variant uppercase block">
                  Extracted Technical Parameters:
                </span>
                <div className="grid grid-cols-2 gap-1.5 font-data-mono text-[11px]">
                  {activeDemo.extractedAttributes.map((attr, idx) => (
                    <div key={idx} className="p-1.5 bg-surface-container rounded border border-outline-variant/20">
                      <span className="text-on-surface-variant block text-[10px]">{attr.name}</span>
                      <span className="text-on-surface font-semibold">{attr.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-3 bg-primary/10 rounded-lg border border-primary/20 text-xs text-on-surface space-y-1">
              <span className="font-semibold text-primary block text-[11px] uppercase">Direct Financial Impact:</span>
              <p className="text-on-surface-variant leading-relaxed text-[11px]">
                {activeDemo.procurementImpact}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Three-Phase Enterprise Workflow */}
      <section className="bg-surface-container rounded-2xl border border-outline-variant/40 p-8 shadow-sm space-y-5">
        <div>
          <h2 className="font-headline-section text-base font-bold text-on-surface">
            System Workflow Architecture
          </h2>
          <p className="text-xs text-on-surface-variant mt-0.5">
            The core lifecycle converting unstandardized records into approved national master records.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Workflow 1 */}
          <div className="p-5 bg-surface-container-low rounded-xl border border-outline-variant/30 space-y-3 flex flex-col justify-between">
            <div>
              <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center font-data-mono font-bold text-sm text-primary mb-2 border border-outline-variant/40">
                01
              </div>
              <h3 className="font-headline-section text-sm font-bold text-on-surface">
                Catalog Ingestion
              </h3>
              <p className="text-xs text-on-surface-variant leading-relaxed mt-1">
                Legacy items are onboarded via direct database connectors (SAP S/4HANA, Oracle ERP Cloud, IBM Maximo) or uploaded using Excel and CSV spreadsheets.
              </p>
            </div>
            <button
              onClick={() => openUploadModal('ONGC')}
              className="text-xs text-primary font-semibold hover:underline flex items-center gap-1 pt-2 border-t border-outline-variant/20"
            >
              Upload Sample Spreadsheet <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </button>
          </div>

          {/* Workflow 2 */}
          <div className="p-5 bg-surface-container-low rounded-xl border border-outline-variant/30 space-y-3 flex flex-col justify-between">
            <div>
              <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center font-data-mono font-bold text-sm text-primary mb-2 border border-outline-variant/40">
                02
              </div>
              <h3 className="font-headline-section text-sm font-bold text-on-surface">
                Semantic Deduplication
              </h3>
              <p className="text-xs text-on-surface-variant leading-relaxed mt-1">
                The NLP engine parses raw description strings, decomposes noun-modifier syntax, resolves unit variances, and scores attribute parity against existing national codes.
              </p>
            </div>
            <button
              onClick={() => setActiveScreen('harmonization')}
              className="text-xs text-primary font-semibold hover:underline flex items-center gap-1 pt-2 border-t border-outline-variant/20"
            >
              Inspect Matching Workbench <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </button>
          </div>

          {/* Workflow 3 */}
          <div className="p-5 bg-surface-container-low rounded-xl border border-outline-variant/30 space-y-3 flex flex-col justify-between">
            <div>
              <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center font-data-mono font-bold text-sm text-primary mb-2 border border-outline-variant/40">
                03
              </div>
              <h3 className="font-headline-section text-sm font-bold text-on-surface">
                Governance & Aliasing
              </h3>
              <p className="text-xs text-on-surface-variant leading-relaxed mt-1">
                Approved matches create immutable cross-references. CPSE ERPs receive forward aliases without altering internal warehouse configurations.
              </p>
            </div>
            <button
              onClick={() => setActiveScreen('governance')}
              className="text-xs text-primary font-semibold hover:underline flex items-center gap-1 pt-2 border-t border-outline-variant/20"
            >
              View Audit Ledger <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </button>
          </div>
        </div>
      </section>

      {/* 4. Bottom Gateway to Modules */}
      <section className="p-6 bg-surface-container rounded-2xl border border-outline-variant/40 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div>
          <h3 className="font-headline-section text-sm font-bold text-on-surface">
            Ready to explore operational records?
          </h3>
          <p className="text-xs text-on-surface-variant mt-0.5">
            Proceed to the Executive Dashboard for nationwide metrics, or open the Central Catalog to inspect 3.1 million master records.
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setActiveScreen('master')}
            className="px-4 py-2 border border-outline-variant/50 hover:bg-surface-container-high text-on-surface text-xs font-semibold rounded-xl transition"
          >
            Central Catalog
          </button>
          <button
            onClick={() => setActiveScreen('dashboard')}
            className="px-4 py-2 bg-primary text-on-primary text-xs font-bold rounded-xl hover:brightness-110 transition shadow-sm"
          >
            Executive Dashboard
          </button>
        </div>
      </section>
    </main>
  );
};
