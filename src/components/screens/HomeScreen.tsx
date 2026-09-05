import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { DateRangePicker } from '../common/DateRangePicker';
import { ScreenFooter } from '../common/FooterLegalModal';

type CategoryKey = 'fasteners' | 'valves' | 'pumps';
type TabKey = 'demo' | 'architecture' | 'dataflow' | 'cpses';

export const HomeScreen: React.FC = () => {
  const { setActiveScreen, openUploadModal } = useApp();
  const [activeTab, setActiveTab] = useState<TabKey>('demo');
  const [selectedCategory, setSelectedCategory] = useState<CategoryKey>('fasteners');
  const [copiedCode, setCopiedCode] = useState(false);

  const categoryData = {
    fasteners: {
      label: 'Fasteners',
      cnmc: '3116.1504.8920',
      title: 'Bolt, Hex Head, M10 × 50mm, Stainless Steel 304, Fully Threaded (DIN 933)',
      confidence: '98% Match Confidence',
      sources: [
        {
          cpse: 'ONGC',
          division: 'Western Offshore',
          logoBg: '#991B1B',
          localCode: 'MAT-10482',
          desc: 'HEX BOLT M10 X 50 SS304',
          price: '₹48 / EA',
        },
        {
          cpse: 'IOCL',
          division: 'Panipat Refinery',
          logoBg: '#EA580C',
          localCode: 'IOCL-FST-902',
          desc: 'BOLT HEX SS304 M10X50MM FULL THD',
          price: '₹55 / EA',
        },
        {
          cpse: 'NTPC',
          division: 'Singrauli STPS',
          logoBg: '#2563EB',
          localCode: 'NGC-BLT-004',
          desc: 'HEXAGON BOLT M10 50MM S.S. 304',
          price: '₹52 / EA',
        },
      ],
      attributes: [
        { attr: 'Item Type', val: 'Hex Bolt' },
        { attr: 'Size', val: 'M10 × 50mm' },
        { attr: 'Material', val: 'Stainless Steel 304' },
        { attr: 'Thread', val: 'Metric, 1.5mm' },
        { attr: 'Standard', val: 'DIN 933' },
        { attr: 'Unit of Measure', val: 'EA' },
        { attr: 'Category', val: 'Fasteners > Bolts > Hex Head' },
      ],
    },
    valves: {
      label: 'Valves',
      cnmc: '4014.1607.1842',
      title: 'Valve, Ball: 2 IN, ASME Class 150, Flanged RF, ASTM A216 WCB Body, SS316 Trim',
      confidence: '99% Match Confidence',
      sources: [
        {
          cpse: 'ONGC',
          division: 'Hazira Plant',
          logoBg: '#991B1B',
          localCode: 'MAT-VLV-0928',
          desc: 'BALL VALVE 50MM 150LBS CS FLANGED A216 WCB',
          price: '₹14,200 / EA',
        },
        {
          cpse: 'IOCL',
          division: 'Paradip',
          logoBg: '#EA580C',
          localCode: 'IOCL-VLV-492',
          desc: 'VLV BALL 2IN 150# FLG WCB/316 PTFE',
          price: '₹16,500 / EA',
        },
        {
          cpse: 'GAIL',
          division: 'Vijaipur',
          logoBg: '#059669',
          localCode: 'G-201-9482',
          desc: 'VALVE BALL FLGD 2 INCH CLASS 150 CS BODY',
          price: '₹15,100 / EA',
        },
      ],
      attributes: [
        { attr: 'Item Type', val: 'Floating Ball Valve' },
        { attr: 'Size', val: '2 Inch (DN 50)' },
        { attr: 'Pressure Class', val: 'ASME Class 150' },
        { attr: 'Body Material', val: 'ASTM A216 WCB' },
        { attr: 'Trim Material', val: 'SS 316' },
        { attr: 'Unit of Measure', val: 'EA' },
        { attr: 'Category', val: 'Piping > Valves > Ball Valves' },
      ],
    },
    pumps: {
      label: 'Pumps & Spares',
      cnmc: '4320.1009.4412',
      title: 'Impeller, Pump: Centrifugal, Enclosed, 210mm OD, Phosphor Bronze ASTM B584',
      confidence: '96% Match Confidence',
      sources: [
        {
          cpse: 'ONGC',
          division: 'Offshore Base',
          logoBg: '#991B1B',
          localCode: 'ONGC-PMP-9102',
          desc: 'IMPELLER CENTRIFUGAL PUMP BRONZE DIA 210MM',
          price: '₹38,000 / EA',
        },
        {
          cpse: 'IOCL',
          division: 'Mathura',
          logoBg: '#EA580C',
          localCode: 'IOCL-ROT-449',
          desc: 'BRONZE IMPELLER FOR WATER PUMP OD210 BORE32',
          price: '₹41,500 / EA',
        },
        {
          cpse: 'NTPC',
          division: 'Ramagundam',
          logoBg: '#2563EB',
          localCode: 'NTPC-ROT-018',
          desc: 'IMPELLER ENCLOSED PHOS BRONZE 210MM',
          price: '₹39,200 / EA',
        },
      ],
      attributes: [
        { attr: 'Component', val: 'Centrifugal Impeller' },
        { attr: 'Outer Diameter', val: '210 mm' },
        { attr: 'Bore Diameter', val: '32 mm Standard' },
        { attr: 'Alloy Spec', val: 'Bronze ASTM B584 C90500' },
        { attr: 'Design Standard', val: 'API 610 11th Ed' },
        { attr: 'Unit of Measure', val: 'EA' },
        { attr: 'Category', val: 'Rotating Equipment > Pumps > Spares' },
      ],
    },
  };

  const current = categoryData[selectedCategory];

  const handleCopyCode = () => {
    navigator.clipboard.writeText(current.cnmc);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="flex-1 overflow-y-auto bg-[#070908] text-[#F3F4F6] px-8 py-6 space-y-6">
      {/* 1. Breadcrumbs & Time Selector */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-medium text-[#9CA3AF]">
          <span 
            onClick={() => setActiveScreen('dashboard')} 
            className="cursor-pointer hover:text-[#F3F4F6] transition-colors"
          >
            Home
          </span>
          <span className="text-[#6B7280]">›</span>
          <span className="text-[#F3F4F6]">Problem & Architecture</span>
        </div>

        <DateRangePicker />
      </div>

      {/* 2. Main Page Header */}
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-white font-sans">
          Problem & Architecture
        </h1>
        <p className="text-xs md:text-sm text-[#9CA3AF] leading-relaxed max-w-4xl">
          Understanding the need, approach and system architecture for a unified national material master.
        </p>
      </div>

      {/* 3. Hero Split Row: Context vs Key Performance Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-2">
        {/* Left Column: Context Paragraph */}
        <div className="lg:col-span-7 space-y-2">
          <h2 className="text-sm font-semibold text-[#F3F4F6] tracking-normal font-sans">
            Cross-Enterprise Material Harmonization
          </h2>
          <p className="text-xs text-[#9CA3AF] leading-relaxed font-sans">
            CPSEs maintain material records across independent ERP systems. Different naming conventions,
            specifications and item codes for the same physical material lead to duplicate records, fragmented
            procurement and lack of visibility. This platform unifies duplicate items under a single authoritative
            Common National Material Code (CNMC).
          </p>
        </div>

        {/* Right Column: 3 Metric Counters */}
        <div className="lg:col-span-5 grid grid-cols-3 gap-4 pt-1">
          <div>
            <div className="text-2xl lg:text-3xl font-bold font-sans text-[#22D3EE] tracking-tight">
              14.2M
            </div>
            <div className="text-xs font-semibold text-[#F3F4F6] mt-1 leading-tight">
              Source records
            </div>
            <div className="text-[11px] text-[#6B7280] leading-snug">
              (across 5 CPSEs)
            </div>
          </div>

          <div>
            <div className="text-2xl lg:text-3xl font-bold font-sans text-white tracking-tight">
              6
            </div>
            <div className="text-xs font-semibold text-[#F3F4F6] mt-1 leading-tight">
              CPSEs
            </div>
            <div className="text-[11px] text-[#6B7280] leading-snug">
              Connected
            </div>
          </div>

          <div>
            <div className="text-2xl lg:text-3xl font-bold font-sans text-[#22D3EE] tracking-tight">
              3.1M
            </div>
            <div className="text-xs font-semibold text-[#F3F4F6] mt-1 leading-tight">
              Canonical materials
            </div>
            <div className="text-[11px] text-[#6B7280] leading-snug">
              (after harmonization)
            </div>
          </div>
        </div>
      </div>

      {/* 4. Sub-Navigation Tabs & Category Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#232825] pt-4 gap-4">
        {/* Tabs */}
        <div className="flex items-center gap-6">
          <button
            onClick={() => setActiveTab('demo')}
            className={`pb-3 text-xs font-semibold transition-all relative ${
              activeTab === 'demo'
                ? 'text-[#F3F4F6]'
                : 'text-[#9CA3AF] hover:text-[#F3F4F6]'
            }`}
          >
            Live Harmonization Demo
            {activeTab === 'demo' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#10B981] rounded-full" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('architecture')}
            className={`pb-3 text-xs font-semibold transition-all relative ${
              activeTab === 'architecture'
                ? 'text-[#F3F4F6]'
                : 'text-[#9CA3AF] hover:text-[#F3F4F6]'
            }`}
          >
            System Architecture
            {activeTab === 'architecture' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#10B981] rounded-full" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('dataflow')}
            className={`pb-3 text-xs font-semibold transition-all relative ${
              activeTab === 'dataflow'
                ? 'text-[#F3F4F6]'
                : 'text-[#9CA3AF] hover:text-[#F3F4F6]'
            }`}
          >
            Data Flow
            {activeTab === 'dataflow' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#10B981] rounded-full" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('cpses')}
            className={`pb-3 text-xs font-semibold transition-all relative ${
              activeTab === 'cpses'
                ? 'text-[#F3F4F6]'
                : 'text-[#9CA3AF] hover:text-[#F3F4F6]'
            }`}
          >
            Supported CPSEs
            {activeTab === 'cpses' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#10B981] rounded-full" />
            )}
          </button>
        </div>

        {/* Right Category Select */}
        <div className="flex items-center gap-2 pb-3">
          <span className="text-xs text-[#9CA3AF]">Select a category</span>
          <div className="relative">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value as CategoryKey)}
              className="appearance-none bg-[#0C0E0D] border border-[#232825] text-xs font-medium text-[#F3F4F6] pl-3 pr-8 py-1.5 rounded-lg outline-none cursor-pointer hover:border-[#38423C] transition-colors"
            >
              <option value="fasteners">Fasteners</option>
              <option value="valves">Valves</option>
              <option value="pumps">Pumps & Spares</option>
            </select>
            <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-[16px] text-[#9CA3AF] pointer-events-none">
              expand_more
            </span>
          </div>
        </div>
      </div>

      {/* 5. Core Live Harmonization Demo Card */}
      {activeTab === 'demo' && (
        <div className="bg-[#0C0E0D] border border-[#232825] rounded-xl p-6 relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* Left: Source Material Records (~55%) */}
            <div className="lg:col-span-6 space-y-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold text-[#F3F4F6]">
                    Source Material Records
                  </h3>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#161B18] text-[#9CA3AF] border border-[#232825]">
                    3 records (example)
                  </span>
                </div>
                <p className="text-xs text-[#9CA3AF] mt-0.5">
                  Different ERP systems, different descriptions — same material.
                </p>
              </div>

              {/* Source Records Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="text-[10px] uppercase font-semibold text-[#6B7280] border-b border-[#232825]">
                      <th className="pb-2.5 font-medium">CPSE</th>
                      <th className="pb-2.5 font-medium">MATERIAL CODE</th>
                      <th className="pb-2.5 font-medium">DESCRIPTION</th>
                      <th className="pb-2.5 font-medium text-right">UNIT COST</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1B201D]">
                    {current.sources.map((item, idx) => (
                      <tr key={idx} className="hover:bg-white/[0.02] transition-colors">
                        {/* CPSE Column */}
                        <td className="py-3.5 pr-3">
                          <div className="flex items-center gap-2">
                            <div 
                              className="w-6 h-6 rounded flex items-center justify-center text-[10px] font-bold text-white shrink-0"
                              style={{ background: item.logoBg }}
                            >
                              {item.cpse.substring(0, 4)}
                            </div>
                            <div className="leading-tight">
                              <div className="font-semibold text-white">{item.cpse}</div>
                              <div className="text-[10px] text-[#6B7280]">({item.division})</div>
                            </div>
                          </div>
                        </td>

                        {/* Material Code */}
                        <td className="py-3.5 pr-3 font-mono text-xs text-[#9CA3AF]">
                          {item.localCode}
                        </td>

                        {/* Description */}
                        <td className="py-3.5 pr-3 font-mono text-[11px] text-[#F3F4F6] max-w-xs">
                          {item.desc}
                        </td>

                        {/* Unit Cost */}
                        <td className="py-3.5 text-right font-mono font-medium text-white whitespace-nowrap">
                          {item.price}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Center Transition Element (~10%) */}
            <div className="lg:col-span-1 flex flex-col items-center justify-center text-center py-4 lg:py-0">
              <span className="material-symbols-outlined text-2xl text-[#10B981] font-bold">
                arrow_forward
              </span>
              <p className="text-[10px] font-medium text-[#9CA3AF] mt-2 max-w-[80px] leading-tight">
                Multiple records converge to one standard
              </p>
            </div>

            {/* Right: Unified National Material Record (~45%) */}
            <div className="lg:col-span-5 bg-[#070908] border border-[#232825] rounded-lg p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-semibold text-[#F3F4F6]">
                  Unified National Material Record
                </h3>
                <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30">
                  <span className="material-symbols-outlined text-[13px]">verified</span>
                  {current.confidence}
                </span>
              </div>

              {/* National Material Code (CNMC) */}
              <div className="space-y-1">
                <div className="text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wider">
                  National Material Code (CNMC)
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-bold font-mono text-[#10B981] tracking-wider">
                    {current.cnmc}
                  </span>
                  <button
                    onClick={handleCopyCode}
                    className="p-1 rounded text-[#9CA3AF] hover:text-white transition-colors"
                    title="Copy CNMC Code"
                  >
                    <span className="material-symbols-outlined text-[16px]">
                      {copiedCode ? 'check' : 'content_copy'}
                    </span>
                  </button>
                </div>
                <p className="text-xs font-medium text-[#F3F4F6] leading-snug">
                  {current.title}
                </p>
              </div>

              {/* Standardized Attributes Table */}
              <div className="pt-2 border-t border-[#1B201D]">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="text-[10px] uppercase font-semibold text-[#6B7280]">
                      <th className="pb-1.5 text-left font-medium">Attribute</th>
                      <th className="pb-1.5 text-right font-medium">Standardized Value</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#161B18]">
                    {current.attributes.map((row, i) => (
                      <tr key={i} className="py-1">
                        <td className="py-1.5 text-left text-[#9CA3AF]">{row.attr}</td>
                        <td className="py-1.5 text-right font-mono font-medium text-[#F3F4F6]">
                          {row.val}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Alternative Tabs View */}
      {activeTab === 'architecture' && (
        <div className="bg-[#0C0E0D] border border-[#232825] rounded-xl p-6 space-y-4">
          <h3 className="text-sm font-semibold text-white">Full Microservices Topology</h3>
          <p className="text-xs text-[#9CA3AF] leading-relaxed">
            The national architecture uses asynchronous message brokers (Apache Kafka) to ingest delta extracts from CPSE ERP staging tables (SAP S/4HANA, Oracle ERP Cloud). A distributed inference pipeline applies specialized domain NLP and cosine vector embedding matching to cluster identical items.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <div className="p-4 rounded-lg bg-[#070908] border border-[#232825] space-y-1.5">
              <span className="text-xs font-semibold text-[#10B981]">Ingestion Microservice</span>
              <p className="text-xs text-[#9CA3AF]">Handles schema transformation and automated deduplication across participating CPSEs.</p>
            </div>
            <div className="p-4 rounded-lg bg-[#070908] border border-[#232825] space-y-1.5">
              <span className="text-xs font-semibold text-[#22D3EE]">Matching Engine</span>
              <p className="text-xs text-[#9CA3AF]">Domain BERT + Vector Embeddings yielding 98%+ automated confidence scores.</p>
            </div>
            <div className="p-4 rounded-lg bg-[#070908] border border-[#232825] space-y-1.5">
              <span className="text-xs font-semibold text-[#EAB308]">National Master Registry</span>
              <p className="text-xs text-[#9CA3AF]">Immutable audit-logged registry with bi-directional syncing to CPSE procurements.</p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'dataflow' && (
        <div className="bg-[#0C0E0D] border border-[#232825] rounded-xl p-6 space-y-3">
          <h3 className="text-sm font-semibold text-white">Bi-Directional Data Synchronization Flow</h3>
          <p className="text-xs text-[#9CA3AF] leading-relaxed">
            1. Raw CPSE Material Master POs ingested via secure REST/SFTP endpoints.
            <br />
            2. Ingestion pipeline strips proprietary syntax and extracts physical properties (diameter, material, pressure rating).
            <br />
            3. Standardized CNMC generated and indexed in the national directory.
            <br />
            4. Local CPSE ERP updated with authoritative CNMC cross-reference mapping.
          </p>
        </div>
      )}

      {activeTab === 'cpses' && (
        <div className="bg-[#0C0E0D] border border-[#232825] rounded-xl p-6 space-y-4">
          <h3 className="text-sm font-semibold text-white">Connected Central Public Sector Enterprises</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 pt-2">
            {[
              { name: 'ONGC', items: '4.2M Records', status: 'Live' },
              { name: 'IOCL', items: '3.8M Records', status: 'Live' },
              { name: 'NTPC', items: '2.4M Records', status: 'Live' },
              { name: 'GAIL', items: '1.9M Records', status: 'Live' },
              { name: 'BPCL', items: '1.2M Records', status: 'Live' },
              { name: 'HPCL', items: '0.7M Records', status: 'Syncing' },
            ].map((c, idx) => (
              <div key={idx} className="p-3 rounded-lg bg-[#070908] border border-[#232825] text-center space-y-1">
                <div className="text-xs font-bold text-white">{c.name}</div>
                <div className="text-[11px] font-mono text-[#9CA3AF]">{c.items}</div>
                <span className="inline-block text-[10px] font-medium text-[#10B981] px-1.5 py-0.5 rounded bg-[#10B981]/10">
                  {c.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 6. System Architecture (High Level) Process Pipeline */}
      <div className="bg-[#0C0E0D] border border-[#232825] rounded-xl p-6 space-y-5">
        <h2 className="text-sm font-semibold text-[#F3F4F6] tracking-normal font-sans">
          System Architecture (High Level)
        </h2>

        {/* 6 Sequential Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-3 items-stretch">
          {[
            {
              step: '1',
              title: 'Data Ingestion',
              desc: 'Collect material data from CPSE ERP systems',
              icon: 'database',
            },
            {
              step: '2',
              title: 'Attribute Extraction',
              desc: 'Extract and normalize technical attributes',
              icon: 'description',
            },
            {
              step: '3',
              title: 'Semantic Matching',
              desc: 'Identify similar items using domain rules + ML',
              icon: 'hub',
            },
            {
              step: '4',
              title: 'CNMC Assignment',
              desc: 'Assign common national material code',
              icon: 'label',
            },
            {
              step: '5',
              title: 'Human Review',
              desc: 'Validate and approve matches',
              icon: 'person_check',
            },
            {
              step: '6',
              title: 'Publish to Master',
              desc: 'Update National Material Master',
              icon: 'cloud_upload',
            },
          ].map((s, idx, arr) => (
            <div
              key={s.step}
              className="relative p-4 rounded-lg bg-[#070908] border border-[#232825] flex flex-col justify-between space-y-3 group hover:border-[#38423C] transition-all"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-[#10B981] font-mono">
                      {s.step}
                    </span>
                    <span className="text-xs font-semibold text-white">
                      {s.title}
                    </span>
                  </div>
                </div>

                <span className="material-symbols-outlined text-[20px] text-[#9CA3AF] group-hover:text-[#10B981] transition-colors">
                  {s.icon}
                </span>

                <p className="text-[11px] text-[#9CA3AF] leading-relaxed mt-2 font-sans">
                  {s.desc}
                </p>
              </div>

              {/* Arrow on right for desktop if not last */}
              {idx < arr.length - 1 && (
                <div className="hidden lg:block absolute -right-2.5 top-1/2 -translate-y-1/2 z-10">
                  <span className="material-symbols-outlined text-[14px] text-[#6B7280]">
                    chevron_right
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 7. Footer */}
      <ScreenFooter />
    </div>
  );
};
