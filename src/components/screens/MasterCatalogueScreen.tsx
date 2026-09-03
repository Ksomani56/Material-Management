import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../common/StatusBadge';

export const MasterCatalogueScreen: React.FC = () => {
  const { catalogueMaterials, navigateToMaterial, openEvidence, openUploadModal } = useApp();
  const [search, setSearch] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('ALL');

  const filteredMaterials = useMemo(() => {
    return catalogueMaterials.filter(m => {
      const matchSearch = !search.trim() ||
        m.cnmc.toLowerCase().includes(search.toLowerCase()) ||
        m.canonicalDescription.toLowerCase().includes(search.toLowerCase()) ||
        m.materialGroupName.toLowerCase().includes(search.toLowerCase());

      const matchGroup = selectedGroup === 'ALL' || m.materialGroupName === selectedGroup;

      return matchSearch && matchGroup;
    });
  }, [catalogueMaterials, search, selectedGroup]);

  return (
    <main className="flex-1 flex flex-col overflow-hidden p-6 gap-4 bg-background">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 shrink-0">
        <div>
          <h1 className="text-base font-bold text-on-surface tracking-tight">
            National Unified Material Master
          </h1>
          <p className="font-mono text-xs text-on-surface-variant mt-0.5">
            Central repository of approved Common National Material Codes (CNMC)
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => openUploadModal('ONGC')}
            className="px-3 py-1.5 bg-surface-container hover:bg-surface-container-high border border-outline-variant/60 text-on-surface text-xs font-medium rounded-lg flex items-center gap-1.5 transition-colors"
          >
            <span className="material-symbols-outlined text-[15px] text-primary">upload_file</span>
            Import Catalog
          </button>

          <span className="font-mono text-xs text-on-surface-variant bg-surface-container px-3 py-1.5 rounded-lg border border-outline-variant/60">
            {catalogueMaterials.length > 5 ? '3,102,445' : '3,102,440'} Masters Active
          </span>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-wrap gap-2.5 items-center bg-surface-container p-3 rounded-xl border border-outline-variant/60 shrink-0">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-surface-container-low rounded-lg border border-outline-variant/60 flex-1 min-w-[240px] max-w-sm focus-within:ring-1 focus-within:ring-primary">
          <span className="material-symbols-outlined text-on-surface-variant text-[16px]">search</span>
          <input 
            type="text" 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search CNMC, description or specs..."
            className="bg-transparent border-none p-0 text-xs focus:ring-0 w-full text-on-surface placeholder-on-surface-variant font-mono outline-none"
          />
          {search && (
            <button onClick={() => setSearch('')} className="text-xs text-on-surface-variant hover:text-on-surface">✕</button>
          )}
        </div>

        <select 
          value={selectedGroup}
          onChange={(e) => setSelectedGroup(e.target.value)}
          className="bg-surface-container-low border border-outline-variant/60 rounded-lg px-3 py-1.5 text-xs text-on-surface focus:ring-1 focus:ring-primary focus:border-primary font-mono outline-none"
        >
          <option value="ALL">All Material Groups</option>
          <option value="Valves & Actuators">Valves & Actuators</option>
          <option value="Pumps & Compressors">Pumps & Compressors</option>
          <option value="Electric Motors">Electric Motors</option>
          <option value="Fasteners & Flanges">Fasteners & Flanges</option>
          <option value="Instrumentation">Instrumentation</option>
        </select>
      </div>

      {/* Catalogue Table */}
      <div className="flex-1 overflow-hidden bg-surface-container rounded-xl border border-outline-variant/60 flex flex-col relative">
        <div className="overflow-auto flex-1">
          <table className="w-full text-left whitespace-nowrap border-collapse">
            <thead className="sticky top-0 bg-surface-container-high z-10 border-b border-outline-variant/60">
              <tr>
                <th className="px-4 py-2.5 text-[11px] text-on-surface-variant font-medium uppercase">CNMC Code</th>
                <th className="px-4 py-2.5 text-[11px] text-on-surface-variant font-medium uppercase">Canonical Description & Specifications</th>
                <th className="px-4 py-2.5 text-[11px] text-on-surface-variant font-medium uppercase">Material Group</th>
                <th className="px-4 py-2.5 text-[11px] text-on-surface-variant font-medium uppercase text-center">UOM</th>
                <th className="px-4 py-2.5 text-[11px] text-on-surface-variant font-medium uppercase text-center">Mapped CPSEs</th>
                <th className="px-4 py-2.5 text-[11px] text-on-surface-variant font-medium uppercase text-center">Status</th>
                <th className="px-4 py-2.5 text-[11px] text-on-surface-variant font-medium uppercase text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/30 font-mono text-xs">
              {filteredMaterials.map((material) => {
                const specs = material.attributes || material.specifications || {};
                const uom = material.standardUOM || specs.baseUOM || 'NOS';
                const status = material.status || material.lifecycleStatus || 'Active';

                return (
                  <tr 
                    key={material.cnmc}
                    className="hover:bg-surface-container-high/40 transition-colors duration-140 cursor-pointer"
                    onClick={() => navigateToMaterial(material.cnmc)}
                  >
                    <td className="px-4 py-3">
                      <span className="font-bold text-primary flex items-center gap-1">
                        {material.cnmc}
                        <span className="material-symbols-outlined text-[13px] text-primary/70">chevron_right</span>
                      </span>
                      <span className="text-[10px] text-on-surface-variant block">v{material.version}</span>
                    </td>

                    <td className="px-4 py-3">
                      <p className="font-sans font-medium text-on-surface truncate max-w-md">
                        {material.canonicalDescription}
                      </p>
                      <div className="flex gap-2 text-[11px] text-on-surface-variant mt-0.5 font-mono">
                        <span>Mat: {specs.baseMaterial || 'Standard'}</span>
                        <span>•</span>
                        <span>Size: {specs.nominalSize || 'Standard'}</span>
                        <span>•</span>
                        <span>Press: {specs.pressureClass || 'Standard'}</span>
                      </div>
                    </td>

                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded bg-surface-container-high text-on-surface text-xs font-sans">
                        {material.materialGroupName}
                      </span>
                    </td>

                    <td className="px-4 py-3 text-center">
                      <span className="px-2 py-0.5 rounded bg-surface-container-high text-on-surface font-semibold text-xs font-mono">
                        {uom}
                      </span>
                    </td>

                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center -space-x-1">
                        {material.mappings.map((m, i) => (
                          <div 
                            key={i} 
                            title={`${m.cpse}: ${m.localCode}`}
                            className="w-5 h-5 rounded-full bg-surface-container-highest border border-outline-variant/60 flex items-center justify-center text-[9px] font-bold text-on-surface"
                          >
                            {m.cpse[0]}
                          </div>
                        ))}
                      </div>
                      <span className="text-[10px] text-on-surface-variant block mt-0.5 font-sans">
                        {material.mappings.length} entities
                      </span>
                    </td>

                    <td className="px-4 py-3 text-center">
                      <StatusBadge status={status} size="sm" />
                    </td>

                    <td className="px-4 py-3 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openEvidence(material)}
                          title="View Evidence Dossier"
                          className="p-1.5 rounded-lg border border-outline-variant/60 hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface transition-colors"
                        >
                          <span className="material-symbols-outlined text-[15px]">visibility</span>
                        </button>

                        <button
                          onClick={() => navigateToMaterial(material.cnmc)}
                          className="px-2.5 py-1 bg-surface-container-high hover:bg-surface-container-highest text-primary border border-outline-variant/60 rounded-lg text-xs font-medium transition-colors"
                        >
                          Profile
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="h-10 border-t border-outline-variant/50 bg-surface-container-high flex items-center justify-between px-4 shrink-0 text-on-surface-variant font-mono text-xs">
          <span>Showing <strong>{filteredMaterials.length}</strong> master profiles</span>
          <span className="text-status-success font-medium flex items-center gap-1 font-sans">
            <span className="material-symbols-outlined text-[14px]">verified</span>
            Validated under National Taxonomy Standards
          </span>
        </div>
      </div>
    </main>
  );
};
