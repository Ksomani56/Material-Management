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
    <main className="flex-1 flex flex-col overflow-hidden p-margin-page gap-4 bg-background transition-colors duration-200">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 shrink-0">
        <div>
          <h1 className="font-headline-section text-headline-section text-on-surface font-bold">
            National Unified Material Master
          </h1>
          <p className="font-data-mono text-xs text-on-surface-variant mt-0.5">
            Central repository of approved Common National Material Codes (CNMC)
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => openUploadModal('ONGC')}
            className="px-3.5 py-1.5 bg-surface-container hover:bg-surface-container-high border border-outline-variant/50 text-on-surface text-xs font-body-bold rounded-xl flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <span className="material-symbols-outlined text-sm text-primary">upload_file</span>
            Import Catalog
          </button>

          <span className="font-data-mono text-xs text-on-surface-variant bg-surface-container px-3 py-1.5 rounded-xl border border-outline-variant/40">
            {catalogueMaterials.length > 5 ? '3,102,445' : '3,102,440'} Canonical Masters Active
          </span>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-wrap gap-3 items-center bg-surface-container p-3 rounded-2xl border border-outline-variant/40 shrink-0 shadow-sm">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-surface-container-low rounded-xl border border-outline-variant/40 flex-1 min-w-[240px] max-w-sm focus-within:ring-1 focus-within:ring-primary">
          <span className="material-symbols-outlined text-on-surface-variant text-[18px]">search</span>
          <input 
            type="text" 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search CNMC, description or specs..."
            className="bg-transparent border-none p-0 text-xs focus:ring-0 w-full text-on-surface placeholder-on-surface-variant font-data-mono outline-none"
          />
          {search && (
            <button onClick={() => setSearch('')} className="text-xs text-on-surface-variant hover:text-on-surface">✕</button>
          )}
        </div>

        <select 
          value={selectedGroup}
          onChange={(e) => setSelectedGroup(e.target.value)}
          className="bg-surface-container-low border border-outline-variant/40 rounded-xl px-3 py-1.5 text-xs text-on-surface focus:ring-1 focus:ring-primary focus:border-primary font-data-mono outline-none"
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
      <div className="flex-1 overflow-hidden bg-surface-container rounded-2xl border border-outline-variant/40 flex flex-col relative shadow-sm">
        <div className="overflow-auto flex-1">
          <table className="w-full text-left whitespace-nowrap border-collapse">
            <thead className="sticky top-0 bg-surface-container-high z-10 border-b border-outline-variant/40">
              <tr>
                <th className="px-4 py-2.5 font-table-header text-[11px] text-on-surface-variant uppercase">CNMC Code</th>
                <th className="px-4 py-2.5 font-table-header text-[11px] text-on-surface-variant uppercase">Canonical Description & Specifications</th>
                <th className="px-4 py-2.5 font-table-header text-[11px] text-on-surface-variant uppercase">Material Group</th>
                <th className="px-4 py-2.5 font-table-header text-[11px] text-on-surface-variant uppercase text-center">UOM</th>
                <th className="px-4 py-2.5 font-table-header text-[11px] text-on-surface-variant uppercase text-center">Mapped CPSEs</th>
                <th className="px-4 py-2.5 font-table-header text-[11px] text-on-surface-variant uppercase text-center">Status</th>
                <th className="px-4 py-2.5 font-table-header text-[11px] text-on-surface-variant uppercase text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/20 font-data-mono text-xs">
              {filteredMaterials.map((material) => {
                const specs = material.attributes || material.specifications || {};
                const uom = material.standardUOM || specs.baseUOM || 'NOS';
                const status = material.status || material.lifecycleStatus || 'Active';

                return (
                  <tr 
                    key={material.cnmc}
                    className="hover:bg-surface-container-high/60 transition-colors cursor-pointer"
                    onClick={() => navigateToMaterial(material.cnmc)}
                  >
                    <td className="px-4 py-3">
                      <span className="font-bold text-primary flex items-center gap-1.5">
                        {material.cnmc}
                        <span className="material-symbols-outlined text-xs text-primary/60">open_in_new</span>
                      </span>
                      <span className="text-[10px] text-on-surface-variant block">v{material.version}</span>
                    </td>

                    <td className="px-4 py-3">
                      <p className="font-sans font-semibold text-on-surface truncate max-w-md">
                        {material.canonicalDescription}
                      </p>
                      <div className="flex gap-3 text-[11px] text-on-surface-variant mt-0.5 font-data-mono">
                        <span>Mat: {specs.baseMaterial || 'Standard'}</span>
                        <span>•</span>
                        <span>Size: {specs.nominalSize || 'Standard'}</span>
                        <span>•</span>
                        <span>Press: {specs.pressureClass || 'Standard'}</span>
                      </div>
                    </td>

                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded-md bg-surface-container-high text-on-surface text-xs border border-outline-variant/30">
                        {material.materialGroupName}
                      </span>
                    </td>

                    <td className="px-4 py-3 text-center">
                      <span className="px-2 py-0.5 rounded bg-surface-container text-primary font-bold text-xs">
                        {uom}
                      </span>
                    </td>

                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center -space-x-1">
                        {material.mappings.map((m, i) => (
                          <div 
                            key={i} 
                            title={`${m.cpse}: ${m.localCode}`}
                            className="w-5 h-5 rounded-full bg-surface-container-highest border border-outline-variant flex items-center justify-center text-[9px] font-bold text-on-surface shadow-xs"
                          >
                            {m.cpse[0]}
                          </div>
                        ))}
                      </div>
                      <span className="text-[10px] text-on-surface-variant block mt-0.5">
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
                          className="p-1.5 rounded-lg border border-outline-variant/40 hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface transition-colors"
                        >
                          <span className="material-symbols-outlined text-[16px]">visibility</span>
                        </button>

                        <button
                          onClick={() => navigateToMaterial(material.cnmc)}
                          className="px-3 py-1 bg-surface-container-high hover:bg-surface-container-highest text-primary border border-outline-variant/40 rounded-lg text-xs font-body-bold transition-colors"
                        >
                          View Profile
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
        <div className="h-11 border-t border-outline-variant/40 bg-surface-container-high flex items-center justify-between px-4 shrink-0 text-on-surface-variant font-data-mono text-xs">
          <span>Showing <strong>{filteredMaterials.length}</strong> master profiles</span>
          <span className="text-status-success font-medium flex items-center gap-1">
            <span className="material-symbols-outlined text-sm fill-icon">verified</span>
            Validated under National Taxonomy Standards
          </span>
        </div>
      </div>
    </main>
  );
};
