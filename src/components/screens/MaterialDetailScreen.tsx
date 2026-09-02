import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { RelationshipBadge } from '../common/RelationshipBadge';
import { StatusBadge } from '../common/StatusBadge';

export const MaterialDetailScreen: React.FC = () => {
  const { currentMaterial, setActiveScreen, openEvidence, theme, toggleTheme } = useApp();
  const [filterQuery, setFilterQuery] = useState('');
  const [copied, setCopied] = useState(false);

  const filteredMappings = currentMaterial.mappings.filter(m => 
    !filterQuery.trim() ||
    m.cpse.toLowerCase().includes(filterQuery.toLowerCase()) ||
    m.localCode.toLowerCase().includes(filterQuery.toLowerCase()) ||
    m.localDescription.toLowerCase().includes(filterQuery.toLowerCase())
  );

  const handleCopyRaw = () => {
    const data = JSON.stringify(currentMaterial, null, 2);
    navigator.clipboard.writeText(data);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const specs = currentMaterial.attributes || currentMaterial.specifications || {};
  const status = currentMaterial.status || currentMaterial.lifecycleStatus || 'Active';
  const uom = currentMaterial.standardUOM || specs.baseUOM || 'NOS';
  const leadCataloger = currentMaterial.leadCataloger || 'National Material Master Team';

  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto bg-background relative transition-colors duration-200">
      {/* Subtle background tech grid */}
      <div className="absolute inset-0 bg-grid-pattern opacity-20 pointer-events-none z-0" />

      {/* Task-Focused Detail Header */}
      <header className="sticky top-0 z-40 bg-surface/90 backdrop-blur-md border-b border-outline-variant/40 px-margin-page h-[64px] flex items-center justify-between shadow-sm shrink-0">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setActiveScreen('master')}
            className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors group"
          >
            <span className="material-symbols-outlined text-[18px] transition-transform group-hover:-translate-x-1">
              arrow_back
            </span>
            <span className="font-body-bold text-body-bold text-sm">National Material Master</span>
          </button>
          
          <div className="h-4 w-px bg-outline-variant" />
          
          <div className="font-data-mono text-data-mono text-on-surface-variant flex items-center gap-2 text-xs">
            <span className="cursor-pointer hover:underline" onClick={() => setActiveScreen('master')}>Catalogue</span>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <span className="text-on-surface font-semibold">{currentMaterial.cnmc}</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
            className="p-1.5 rounded-xl text-on-surface-variant hover:text-on-surface bg-surface-container hover:bg-surface-container-high transition-colors flex items-center justify-center border border-outline-variant/40 shadow-sm"
          >
            <span className="material-symbols-outlined text-[18px]">
              {theme === 'dark' ? 'light_mode' : 'dark_mode'}
            </span>
          </button>

          <button 
            onClick={() => openEvidence(currentMaterial)}
            className="px-4 py-1.5 border border-outline-variant/50 rounded-xl text-on-surface font-body-bold text-xs hover:bg-surface-container-high transition-colors flex items-center gap-2 shadow-sm"
          >
            <span className="material-symbols-outlined text-[16px]">history</span>
            View Evidence
          </button>
          
          <button 
            onClick={() => alert(`Profile Editor: Canonical specification for ${currentMaterial.cnmc} is governed under MoPNG Unified Master specifications.`)}
            className="px-4 py-1.5 bg-primary text-on-primary rounded-xl font-body-bold text-xs hover:brightness-110 transition-all flex items-center gap-2 shadow-sm"
          >
            <span className="material-symbols-outlined text-[16px] fill-icon">edit</span>
            Edit Profile
          </button>
        </div>
      </header>

      {/* Main Content Canvas */}
      <main className="flex-1 relative z-10 w-full max-w-[1600px] mx-auto p-margin-page grid grid-cols-12 gap-6 items-start">
        {/* Left Column: Primary Data (9 columns) */}
        <div className="col-span-12 xl:col-span-9 flex flex-col gap-6">
          {/* Entity Header Card */}
          <section className="bg-surface-container rounded-2xl border border-outline-variant/40 p-6 shadow-sm relative overflow-hidden">
            {/* AI Glow Top Edge */}
            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent opacity-60" />
            
            <div className="flex flex-col md:flex-row justify-between items-start gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="font-display-cnmc text-2xl font-bold text-primary tracking-tight">
                    {currentMaterial.cnmc}
                  </span>
                  <StatusBadge status={status} size="md" />
                  <span className="font-data-mono text-xs text-on-surface-variant bg-surface-container-high px-2.5 py-0.5 rounded-full border border-outline-variant/30">
                    Version {currentMaterial.version}
                  </span>
                </div>
                
                <h2 className="font-headline-section text-lg text-on-surface font-bold leading-snug">
                  {currentMaterial.canonicalDescription}
                </h2>
                
                <div className="flex items-center gap-4 text-xs font-data-mono text-on-surface-variant pt-1">
                  <span>Group: <strong className="text-on-surface">{currentMaterial.materialGroupName}</strong></span>
                  <span>•</span>
                  <span>Standard UOM: <strong className="text-primary font-bold">{uom}</strong></span>
                  <span>•</span>
                  <span>Lead Cataloger: <strong className="text-on-surface">{leadCataloger}</strong></span>
                </div>
              </div>

              {/* Confidence Meter Pill */}
              <div className="bg-surface-container-low p-4 rounded-xl border border-outline-variant/40 text-right shrink-0">
                <span className="font-label-caps text-[10px] text-on-surface-variant uppercase block">
                  Harmonization Confidence
                </span>
                <div className="font-display-cnmc text-2xl font-bold text-status-success flex items-center justify-end gap-1 mt-0.5">
                  <span className="material-symbols-outlined text-lg">auto_awesome</span>
                  {currentMaterial.confidenceScore}%
                </div>
                <span className="font-data-mono text-[10px] text-on-surface-variant block mt-1">
                  Cross-validated across {currentMaterial.mappings.length} CPSEs
                </span>
              </div>
            </div>
          </section>

          {/* Section: Standardized Technical Specifications Matrix */}
          <section className="bg-surface-container rounded-2xl border border-outline-variant/40 p-6 shadow-sm">
            <h3 className="font-headline-section text-sm font-bold text-on-surface uppercase tracking-wide mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[18px]">tune</span>
              Standardized Technical Attributes
            </h3>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 font-data-mono text-xs">
              <div className="bg-surface-container-low p-3.5 rounded-xl border border-outline-variant/30">
                <span className="text-on-surface-variant text-[11px] block uppercase">Base Material</span>
                <span className="text-on-surface font-bold mt-1 block">{specs.baseMaterial || 'A105 Forged'}</span>
              </div>
              <div className="bg-surface-container-low p-3.5 rounded-xl border border-outline-variant/30">
                <span className="text-on-surface-variant text-[11px] block uppercase">Nominal Size</span>
                <span className="text-on-surface font-bold mt-1 block">{specs.nominalSize || '6 IN (150 mm)'}</span>
              </div>
              <div className="bg-surface-container-low p-3.5 rounded-xl border border-outline-variant/30">
                <span className="text-on-surface-variant text-[11px] block uppercase">Pressure Class</span>
                <span className="text-on-surface font-bold mt-1 block">{specs.pressureClass || 'Class 300'}</span>
              </div>
              <div className="bg-surface-container-low p-3.5 rounded-xl border border-outline-variant/30">
                <span className="text-on-surface-variant text-[11px] block uppercase">End Connection</span>
                <span className="text-on-surface font-bold mt-1 block">{specs.endConnection || 'RF Flanged'}</span>
              </div>
              <div className="bg-surface-container-low p-3.5 rounded-xl border border-outline-variant/30">
                <span className="text-on-surface-variant text-[11px] block uppercase">Design Standard</span>
                <span className="text-on-surface font-bold mt-1 block">{specs.standard || 'API 6D / ASME B16.34'}</span>
              </div>
              <div className="bg-surface-container-low p-3.5 rounded-xl border border-outline-variant/30">
                <span className="text-on-surface-variant text-[11px] block uppercase">Seat / Trim</span>
                <span className="text-on-surface font-bold mt-1 block">{specs.seatMaterial || 'PTFE / R-PTFE'}</span>
              </div>
              <div className="bg-surface-container-low p-3.5 rounded-xl border border-outline-variant/30">
                <span className="text-on-surface-variant text-[11px] block uppercase">Temp Range</span>
                <span className="text-on-surface font-bold mt-1 block">{specs.temperatureRange || '-29°C to 200°C'}</span>
              </div>
              <div className="bg-surface-container-low p-3.5 rounded-xl border border-outline-variant/30">
                <span className="text-on-surface-variant text-[11px] block uppercase">Standard UOM</span>
                <span className="text-primary font-bold mt-1 block">{uom}</span>
              </div>
            </div>
          </section>

          {/* Section: Linked CPSE Local Material Mappings Table */}
          <section className="bg-surface-container rounded-2xl border border-outline-variant/40 overflow-hidden shadow-sm">
            <div className="p-4 border-b border-outline-variant/40 bg-surface-container-high/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div>
                <h3 className="font-headline-section text-sm font-bold text-on-surface uppercase tracking-wide flex items-center gap-2">
                  <span className="material-symbols-outlined text-relationship-duplicate text-[18px]">share</span>
                  Linked CPSE Material Mappings ({currentMaterial.mappings.length})
                </h3>
                <p className="font-data-mono text-[11px] text-on-surface-variant">
                  Source records from CPSE ERPs resolved and mapped to this national canonical master
                </p>
              </div>

              {/* In-table search filter */}
              <div className="flex items-center gap-2 px-3 py-1.5 bg-surface-container-low rounded-xl border border-outline-variant/40 text-xs w-full sm:w-64">
                <span className="material-symbols-outlined text-on-surface-variant text-sm">search</span>
                <input 
                  type="text" 
                  value={filterQuery}
                  onChange={(e) => setFilterQuery(e.target.value)}
                  placeholder="Filter local records..."
                  className="bg-transparent border-none p-0 text-xs focus:ring-0 w-full text-on-surface font-data-mono outline-none"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse font-data-mono">
                <thead className="bg-surface-container-high border-b border-outline-variant/40 text-on-surface-variant text-[11px] font-table-header">
                  <tr>
                    <th className="p-3">CPSE Entity</th>
                    <th className="p-3">Local Material Code</th>
                    <th className="p-3">Raw Legacy Description</th>
                    <th className="p-3 text-center">Relationship</th>
                    <th className="p-3 text-center">Status</th>
                    <th className="p-3 text-right">Mapped By</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/20">
                  {filteredMappings.map((mapping, idx) => (
                    <tr key={idx} className="hover:bg-surface-container-high/60 transition-colors">
                      <td className="p-3">
                        <span className="px-2.5 py-0.5 rounded-md bg-surface-container-highest font-bold text-on-surface border border-outline-variant/30">
                          {mapping.cpse}
                        </span>
                      </td>
                      <td className="p-3 text-primary font-semibold">
                        {mapping.localCode}
                      </td>
                      <td className="p-3 text-on-surface font-sans max-w-sm truncate" title={mapping.localDescription}>
                        {mapping.localDescription}
                      </td>
                      <td className="p-3 text-center">
                        <RelationshipBadge type={mapping.relationship} size="sm" />
                      </td>
                      <td className="p-3 text-center">
                        <StatusBadge status={mapping.status} size="sm" />
                      </td>
                      <td className="p-3 text-right text-on-surface-variant text-[11px]">
                        {mapping.mappedBy || 'National Cataloger'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>

        {/* Right Column: Governance Trail & Actions (3 columns) */}
        <div className="col-span-12 xl:col-span-3 flex flex-col gap-6">
          {/* Quick Actions Panel */}
          <div className="bg-surface-container rounded-2xl border border-outline-variant/40 p-5 space-y-3 shadow-sm">
            <h4 className="font-headline-section text-xs font-bold text-on-surface uppercase tracking-wide">
              Catalogue Actions
            </h4>
            <button 
              onClick={handleCopyRaw}
              className="w-full py-2 px-3 rounded-xl border border-outline-variant/50 hover:bg-surface-container-high text-xs font-body-bold text-on-surface flex items-center justify-center gap-2 transition-colors"
            >
              <span className="material-symbols-outlined text-sm">content_copy</span>
              {copied ? 'Copied Canonical JSON!' : 'Copy Master JSON'}
            </button>
            <button 
              onClick={() => openEvidence(currentMaterial)}
              className="w-full py-2 px-3 rounded-xl bg-primary/10 hover:bg-primary/20 text-primary border border-primary/30 text-xs font-body-bold flex items-center justify-center gap-2 transition-colors"
            >
              <span className="material-symbols-outlined text-sm">verified_user</span>
              Inspect Traceability Chain
            </button>
          </div>

          {/* Governance & Audit Trail */}
          <div className="bg-surface-container rounded-2xl border border-outline-variant/40 p-5 shadow-sm space-y-4">
            <h4 className="font-headline-section text-xs font-bold text-on-surface uppercase tracking-wide flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[18px]">history</span>
              Governance Trail
            </h4>

            <div className="relative border-l border-outline-variant/60 ml-2 space-y-4 pl-4 text-xs font-data-mono">
              {currentMaterial.governanceTrail.map((log) => (
                <div key={log.id} className="relative">
                  <div className="absolute w-2.5 h-2.5 rounded-full bg-primary -left-[21px] top-1 shadow-sm" />
                  <span className="text-[10px] text-on-surface-variant">{log.timestamp}</span>
                  <p className="font-semibold text-on-surface mt-0.5">{log.action}</p>
                  <p className="text-[11px] text-on-surface-variant font-sans leading-relaxed">{log.description}</p>
                  <span className="text-[10px] text-primary/80 block mt-1">By: {log.user.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
