import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../common/StatusBadge';

export const MasterCatalogueScreen: React.FC = () => {
  const { catalogueMaterials, navigateToMaterial, openEvidence, openUploadModal } = useApp();
  const [search, setSearch] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('ALL');

  const filteredMaterials = useMemo(() => catalogueMaterials.filter(m => {
    const q = search.toLowerCase();
    const matchSearch = !search.trim() ||
      m.cnmc.toLowerCase().includes(q) ||
      m.canonicalDescription.toLowerCase().includes(q) ||
      m.materialGroupName.toLowerCase().includes(q);
    const matchGroup = selectedGroup === 'ALL' || m.materialGroupName === selectedGroup;
    return matchSearch && matchGroup;
  }), [catalogueMaterials, search, selectedGroup]);

  return (
    <main className="flex-1 flex flex-col overflow-hidden p-6 gap-4" style={{ background: 'var(--bg)' }}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 shrink-0">
        <div>
          <h2 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
            National Unified Material Master
          </h2>
          <p className="text-sm mt-0.5" style={{ color: 'var(--text-secondary)' }}>
            Central repository of approved Common National Material Codes (CNMC)
          </p>
        </div>
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={() => openUploadModal('ONGC')}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium hover:brightness-110 transition-all"
            style={{ background: 'var(--bg-card)', color: 'var(--blue)', border: '1px solid var(--border)' }}
          >
            <span className="material-symbols-outlined text-[16px]">upload_file</span>
            Import Catalog
          </button>
          <span className="font-mono text-sm px-3 py-2 rounded-lg"
            style={{ background: 'var(--blue-dim)', color: 'var(--blue)', border: '1px solid rgba(59,130,246,0.2)' }}>
            {catalogueMaterials.length > 5 ? '3,102,445' : '3,102,440'} Masters Active
          </span>
        </div>
      </div>

      {/* Filter toolbar */}
      <div className="flex flex-wrap gap-2.5 items-center p-3 rounded-xl shrink-0"
        style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg flex-1 min-w-[200px] max-w-sm"
          style={{ background: 'var(--bg-input)', border: '1px solid var(--border)' }}>
          <span className="material-symbols-outlined text-[16px]" style={{ color: 'var(--text-muted)' }}>search</span>
          <input
            type="text" value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search CNMC, description or specs..."
            className="bg-transparent border-none text-sm focus:ring-0 w-full outline-none"
            style={{ color: 'var(--text-primary)' }}
          />
          {search && (
            <button onClick={() => setSearch('')} style={{ color: 'var(--text-muted)' }} className="hover:opacity-80">
              <span className="material-symbols-outlined text-[14px]">close</span>
            </button>
          )}
        </div>
        <select
          value={selectedGroup}
          onChange={e => setSelectedGroup(e.target.value)}
          className="px-3 py-2 rounded-lg text-sm outline-none"
          style={{ background: 'var(--bg-input)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
        >
          <option value="ALL">All Material Groups</option>
          <option value="Valves & Actuators">Valves &amp; Actuators</option>
          <option value="Pumps & Compressors">Pumps &amp; Compressors</option>
          <option value="Electric Motors">Electric Motors</option>
          <option value="Fasteners & Flanges">Fasteners &amp; Flanges</option>
          <option value="Instrumentation">Instrumentation</option>
        </select>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-hidden flex flex-col rounded-xl"
        style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
        <div className="overflow-auto flex-1">
          <table className="w-full text-left whitespace-nowrap">
            <thead className="sticky top-0 z-10" style={{ background: 'var(--bg-card)', borderBottom: '1px solid var(--border)' }}>
              <tr>
                {['CNMC Code', 'Canonical Description & Specs', 'Material Group', 'UOM', 'Mapped CPSEs', 'Status', ''].map(h => (
                  <th key={h} className="px-4 py-3 text-xs font-semibold uppercase tracking-wide"
                    style={{ color: 'var(--text-muted)' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredMaterials.map(material => {
                const specs = material.attributes || material.specifications || {};
                const uom = material.standardUOM || specs.baseUOM || 'NOS';
                const status = material.status || material.lifecycleStatus || 'Active';
                return (
                  <tr key={material.cnmc}
                    className="cursor-pointer transition-colors hover:opacity-90"
                    style={{ borderBottom: '1px solid var(--border-subtle)' }}
                    onClick={() => navigateToMaterial(material.cnmc)}>
                    <td className="px-4 py-4">
                      <span className="font-bold text-sm font-mono flex items-center gap-1" style={{ color: 'var(--blue)' }}>
                        {material.cnmc}
                        <span className="material-symbols-outlined text-[13px]">chevron_right</span>
                      </span>
                      <span className="text-xs block mt-0.5" style={{ color: 'var(--text-muted)' }}>v{material.version}</span>
                    </td>
                    <td className="px-4 py-4">
                      <p className="text-sm font-medium truncate max-w-sm" style={{ color: 'var(--text-primary)' }}>
                        {material.canonicalDescription}
                      </p>
                      <div className="flex gap-2 text-xs font-mono mt-0.5" style={{ color: 'var(--text-muted)' }}>
                        <span>Mat: {specs.baseMaterial || 'Standard'}</span>
                        <span>•</span>
                        <span>Size: {specs.nominalSize || 'Std'}</span>
                        <span>•</span>
                        <span>Press: {specs.pressureClass || 'Std'}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className="px-2.5 py-1 rounded text-xs"
                        style={{ background: 'var(--bg-hover)', color: 'var(--text-secondary)' }}>
                        {material.materialGroupName}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <span className="px-2.5 py-1 rounded text-xs font-mono font-semibold"
                        style={{ background: 'var(--bg-hover)', color: 'var(--text-primary)' }}>
                        {uom}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <div className="flex items-center justify-center -space-x-1">
                        {material.mappings.map((m, i) => (
                          <div key={i} title={`${m.cpse}: ${m.localCode}`}
                            className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold"
                            style={{ background: 'var(--blue-dim)', color: 'var(--blue)', border: '2px solid var(--bg-card)' }}>
                            {m.cpse[0]}
                          </div>
                        ))}
                      </div>
                      <span className="text-xs block mt-0.5" style={{ color: 'var(--text-muted)' }}>
                        {material.mappings.length} entities
                      </span>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <StatusBadge status={status} size="sm" />
                    </td>
                    <td className="px-4 py-4 text-right" onClick={e => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openEvidence(material)}
                          className="p-1.5 rounded hover:opacity-80 transition-opacity"
                          style={{ color: 'var(--text-muted)', border: '1px solid var(--border)' }}
                          title="View Evidence">
                          <span className="material-symbols-outlined text-[15px]">visibility</span>
                        </button>
                        <button
                          onClick={() => navigateToMaterial(material.cnmc)}
                          className="px-3 py-1.5 rounded text-xs font-semibold hover:brightness-110 transition-all"
                          style={{ background: 'var(--blue)', color: '#fff' }}>
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
        <div className="h-10 shrink-0 flex items-center justify-between px-4 text-sm"
          style={{ borderTop: '1px solid var(--border)', background: 'var(--bg-hover)', color: 'var(--text-muted)' }}>
          <span>Showing <strong style={{ color: 'var(--text-primary)' }}>{filteredMaterials.length}</strong> master profiles</span>
          <span className="flex items-center gap-1" style={{ color: 'var(--success)' }}>
            <span className="material-symbols-outlined text-[14px]">verified</span>
            Validated under National Taxonomy Standards
          </span>
        </div>
      </div>
    </main>
  );
};
