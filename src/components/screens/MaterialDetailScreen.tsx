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
    <div className="flex-1 flex flex-col h-full overflow-y-auto bg-background relative">
      {/* Task-Focused Detail Header */}
      <header className="sticky top-0 z-40 bg-surface border-b border-outline-variant/60 px-6 h-13 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setActiveScreen('master')}
            className="flex items-center gap-1.5 text-on-surface-variant hover:text-on-surface transition-colors"
          >
            <span className="material-symbols-outlined text-[17px]">
              arrow_back
            </span>
            <span className="text-xs font-semibold">Catalogue</span>
          </button>
          
          <div className="h-4 w-px bg-outline-variant" />
          
          <div className="font-mono text-xs text-on-surface-variant flex items-center gap-1.5">
            <span className="text-on-surface font-semibold">{currentMaterial.cnmc}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
            className="p-1.5 rounded-lg text-on-surface-variant hover:text-on-surface bg-surface-container hover:bg-surface-container-high transition-colors flex items-center justify-center border border-outline-variant/60"
          >
            <span className="material-symbols-outlined text-[17px]">
              {theme === 'dark' ? 'light_mode' : 'dark_mode'}
            </span>
          </button>

          <button 
            onClick={() => openEvidence(currentMaterial)}
            className="px-3 py-1.5 border border-outline-variant/60 rounded-lg text-on-surface font-medium text-xs hover:bg-surface-container transition-colors flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[15px]">visibility</span>
            View Evidence
          </button>
          
          <button 
            onClick={() => alert(`Profile Editor: Canonical specification for ${currentMaterial.cnmc} is governed under MoPNG Unified Master specifications.`)}
            className="px-3.5 py-1.5 bg-primary text-on-primary rounded-lg font-semibold text-xs hover:brightness-110 transition-all flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[15px]">edit</span>
            Edit Profile
          </button>
        </div>
      </header>

      {/* Main Content Canvas */}
      <main className="flex-1 w-full max-w-[1600px] mx-auto p-6 grid grid-cols-12 gap-5 items-start">
        {/* Left Column: Primary Data (9 columns) */}
        <div className="col-span-12 xl:col-span-9 flex flex-col gap-5">
          {/* Entity Header Card */}
          <section className="bg-surface-container rounded-xl border border-outline-variant/60 p-5 relative">
            <div className="flex flex-col md:flex-row justify-between items-start gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <span className="font-mono text-xl font-bold text-primary tracking-tight">
                    {currentMaterial.cnmc}
                  </span>
                  <StatusBadge status={status} size="sm" />
                  <span className="font-mono text-[11px] text-on-surface-variant bg-surface-container-high px-2 py-0.5 rounded border border-outline-variant/40">
                    Version {currentMaterial.version}
                  </span>
                </div>
                
                <h2 className="text-base text-on-surface font-semibold leading-snug">
                  {currentMaterial.canonicalDescription}
                </h2>
                
                <div className="flex items-center gap-3 text-xs font-mono text-on-surface-variant pt-0.5">
                  <span>Group: <strong className="text-on-surface font-sans">{currentMaterial.materialGroupName}</strong></span>
                  <span>•</span>
                  <span>Standard UOM: <strong className="text-primary font-bold">{uom}</strong></span>
                  <span>•</span>
                  <span>Lead Authority: <strong className="text-on-surface font-sans">{leadCataloger}</strong></span>
                </div>
              </div>

              {/* Confidence Meter Pill */}
              <div className="bg-surface-container-low p-3.5 rounded-lg border border-outline-variant/50 text-right shrink-0">
                <span className="text-[10px] text-on-surface-variant uppercase font-medium block">
                  Harmonization Confidence
                </span>
                <div className="font-mono text-xl font-bold text-status-success flex items-center justify-end gap-1 mt-0.5">
                  <span className="material-symbols-outlined text-base">verified</span>
                  {currentMaterial.confidenceScore}%
                </div>
                <span className="font-mono text-[10px] text-on-surface-variant block mt-0.5">
                  Validated across {currentMaterial.mappings.length} CPSEs
                </span>
              </div>
            </div>
          </section>

          {/* Section: Standardized Technical Specifications Matrix */}
          <section className="bg-surface-container rounded-xl border border-outline-variant/60 p-5">
            <h3 className="text-xs font-semibold text-on-surface uppercase tracking-wide mb-3 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[17px]">tune</span>
              Standardized Technical Attributes
            </h3>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 font-mono text-xs">
              <div className="bg-surface-container-low p-3 rounded-lg border border-outline-variant/40">
                <span className="text-on-surface-variant text-[10px] block uppercase font-sans">Base Material</span>
                <span className="text-on-surface font-medium mt-1 block">{specs.baseMaterial || 'A105 Forged'}</span>
              </div>
              <div className="bg-surface-container-low p-3 rounded-lg border border-outline-variant/40">
                <span className="text-on-surface-variant text-[10px] block uppercase font-sans">Nominal Size</span>
                <span className="text-on-surface font-medium mt-1 block">{specs.nominalSize || '6 IN (150 mm)'}</span>
              </div>
              <div className="bg-surface-container-low p-3 rounded-lg border border-outline-variant/40">
                <span className="text-on-surface-variant text-[10px] block uppercase font-sans">Pressure Class</span>
                <span className="text-on-surface font-medium mt-1 block">{specs.pressureClass || 'Class 300'}</span>
              </div>
              <div className="bg-surface-container-low p-3 rounded-lg border border-outline-variant/40">
                <span className="text-on-surface-variant text-[10px] block uppercase font-sans">End Connection</span>
                <span className="text-on-surface font-medium mt-1 block">{specs.endConnection || 'RF Flanged'}</span>
              </div>
              <div className="bg-surface-container-low p-3 rounded-lg border border-outline-variant/40">
                <span className="text-on-surface-variant text-[10px] block uppercase font-sans">Design Standard</span>
                <span className="text-on-surface font-medium mt-1 block">{specs.standard || 'API 6D / ASME B16.34'}</span>
              </div>
              <div className="bg-surface-container-low p-3 rounded-lg border border-outline-variant/40">
                <span className="text-on-surface-variant text-[10px] block uppercase font-sans">Seat / Trim</span>
                <span className="text-on-surface font-medium mt-1 block">{specs.seatMaterial || 'PTFE / R-PTFE'}</span>
              </div>
              <div className="bg-surface-container-low p-3 rounded-lg border border-outline-variant/40">
                <span className="text-on-surface-variant text-[10px] block uppercase font-sans">Temp Range</span>
                <span className="text-on-surface font-medium mt-1 block">{specs.temperatureRange || '-29°C to 200°C'}</span>
              </div>
              <div className="bg-surface-container-low p-3 rounded-lg border border-outline-variant/40">
                <span className="text-on-surface-variant text-[10px] block uppercase font-sans">Standard UOM</span>
                <span className="text-primary font-bold mt-1 block">{uom}</span>
              </div>
            </div>
          </section>

          {/* Section: Linked CPSE Local Material Mappings Table */}
          <section className="bg-surface-container rounded-xl border border-outline-variant/60 overflow-hidden">
            <div className="p-4 border-b border-outline-variant/50 bg-surface-container flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div>
                <h3 className="text-xs font-semibold text-on-surface uppercase tracking-wide flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-[17px]">hub</span>
                  Linked CPSE Material Mappings ({currentMaterial.mappings.length})
                </h3>
                <p className="font-mono text-[11px] text-on-surface-variant mt-0.5">
                  Source records from CPSE ERPs resolved and mapped to this national master
                </p>
              </div>

              {/* In-table search filter */}
              <div className="flex items-center gap-2 px-2.5 py-1 bg-surface-container-low rounded-lg border border-outline-variant/60 text-xs w-full sm:w-60">
                <span className="material-symbols-outlined text-on-surface-variant text-sm">search</span>
                <input 
                  type="text" 
                  value={filterQuery}
                  onChange={(e) => setFilterQuery(e.target.value)}
                  placeholder="Filter local records..."
                  className="bg-transparent border-none p-0 text-xs focus:ring-0 w-full text-on-surface font-mono outline-none"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse font-mono">
                <thead className="bg-surface-container-high border-b border-outline-variant/50 text-on-surface-variant text-[11px] font-medium">
                  <tr>
                    <th className="p-3">CPSE Entity</th>
                    <th className="p-3">Local Material Code</th>
                    <th className="p-3">Raw Legacy Description</th>
                    <th className="p-3 text-center">Relationship</th>
                    <th className="p-3 text-center">Status</th>
                    <th className="p-3 text-right">Mapped By</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/30">
                  {filteredMappings.map((mapping, idx) => (
                    <tr key={idx} className="hover:bg-surface-container-high/40 transition-colors">
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded bg-surface-container-high font-semibold text-on-surface border border-outline-variant/40">
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
                      <td className="p-3 text-right text-on-surface-variant text-[11px] font-sans">
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
        <div className="col-span-12 xl:col-span-3 flex flex-col gap-5">
          {/* Quick Actions Panel */}
          <div className="bg-surface-container rounded-xl border border-outline-variant/60 p-4 space-y-2.5">
            <h4 className="text-xs font-semibold text-on-surface uppercase tracking-wide">
              Catalogue Actions
            </h4>
            <button 
              onClick={handleCopyRaw}
              className="w-full py-2 px-3 rounded-lg border border-outline-variant/60 hover:bg-surface-container-high text-xs font-medium text-on-surface flex items-center justify-center gap-2 transition-colors"
            >
              <span className="material-symbols-outlined text-[15px]">content_copy</span>
              {copied ? 'Copied Canonical JSON!' : 'Copy Master JSON'}
            </button>
            <button 
              onClick={() => openEvidence(currentMaterial)}
              className="w-full py-2 px-3 rounded-lg bg-primary/10 hover:bg-primary/15 text-primary border border-primary/30 text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
            >
              <span className="material-symbols-outlined text-[15px]">verified</span>
              Inspect Evidence Dossier
            </button>
          </div>

          {/* Governance & Audit Trail */}
          <div className="bg-surface-container rounded-xl border border-outline-variant/60 p-4 space-y-3">
            <h4 className="text-xs font-semibold text-on-surface uppercase tracking-wide flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[17px]">history</span>
              Governance Trail
            </h4>

            <div className="relative border-l border-outline-variant/60 ml-2 space-y-3.5 pl-3.5 text-xs font-mono">
              {currentMaterial.governanceTrail.map((log) => (
                <div key={log.id} className="relative">
                  <div className="absolute w-2 h-2 rounded-full bg-primary -left-[18px] top-1" />
                  <span className="text-[10px] text-on-surface-variant">{log.timestamp}</span>
                  <p className="font-semibold text-on-surface mt-0.5">{log.action}</p>
                  <p className="text-[11px] text-on-surface-variant font-sans leading-relaxed">{log.description}</p>
                  <span className="text-[10px] text-primary block mt-0.5">By: {log.user.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
