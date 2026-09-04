import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { RelationshipBadge } from '../common/RelationshipBadge';
import { StatusBadge } from '../common/StatusBadge';

export const MaterialDetailScreen: React.FC = () => {
  const { currentMaterial, setActiveScreen, openEvidence, theme, toggleTheme, addToast } = useApp();
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
    addToast('success', `Copied JSON specifications for ${currentMaterial.cnmc}`);
    setTimeout(() => setCopied(false), 2000);
  };

  const specs = currentMaterial.attributes || currentMaterial.specifications || {};
  const status = currentMaterial.status || currentMaterial.lifecycleStatus || 'Active';
  const uom = currentMaterial.standardUOM || specs.baseUOM || 'NOS';
  const leadCataloger = currentMaterial.leadCataloger || 'National Material Master Team';

  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto" style={{ background: 'var(--bg)' }}>
      {/* Detail Header Bar */}
      <header
        className="sticky top-0 z-40 px-6 h-14 flex items-center justify-between shrink-0"
        style={{ background: 'var(--bg-surface)', borderBottom: '1px solid var(--border)' }}
      >
        <div className="flex items-center gap-4">
          <button
            onClick={() => setActiveScreen('master')}
            className="flex items-center gap-1.5 transition-colors hover:opacity-80"
            style={{ color: 'var(--text-secondary)' }}
          >
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            <span className="text-xs font-semibold">Back to Catalog</span>
          </button>

          <div className="h-4 w-px" style={{ background: 'var(--border)' }} />

          <div className="font-mono text-xs flex items-center gap-1.5" style={{ color: 'var(--text-muted)' }}>
            <span className="font-bold" style={{ color: 'var(--blue)' }}>{currentMaterial.cnmc}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
            className="p-2 rounded-lg transition-colors hover:opacity-80"
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}
          >
            <span className="material-symbols-outlined text-[18px]">
              {theme === 'dark' ? 'light_mode' : 'dark_mode'}
            </span>
          </button>

          <button
            onClick={() => openEvidence(currentMaterial)}
            className="px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 hover:opacity-80"
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
          >
            <span className="material-symbols-outlined text-[16px]">visibility</span>
            View Evidence
          </button>

          <button
            onClick={() => addToast('info', `Profile Editor: Specifications for ${currentMaterial.cnmc} are governed under MoPNG Taxonomy.`)}
            className="px-4 py-1.5 rounded-lg font-semibold text-xs transition-all flex items-center gap-1.5 hover:brightness-110"
            style={{ background: 'var(--blue)', color: '#fff' }}
          >
            <span className="material-symbols-outlined text-[16px]">edit</span>
            Edit Profile
          </button>
        </div>
      </header>

      {/* Main Content Canvas */}
      <main className="flex-1 w-full max-w-[1600px] mx-auto p-6 grid grid-cols-12 gap-6 items-start">
        {/* Left Column: Primary Data (9 columns) */}
        <div className="col-span-12 xl:col-span-9 flex flex-col gap-6">
          {/* Entity Header Card */}
          <section
            className="rounded-xl p-6 relative"
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
          >
            <div className="flex flex-col md:flex-row justify-between items-start gap-4">
              <div className="space-y-2.5">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="font-mono text-2xl font-bold tracking-tight" style={{ color: 'var(--blue)' }}>
                    {currentMaterial.cnmc}
                  </span>
                  <StatusBadge status={status} size="sm" />
                  <span
                    className="font-mono text-xs px-2.5 py-0.5 rounded font-semibold"
                    style={{ background: 'var(--bg-hover)', color: 'var(--text-secondary)', border: '1px solid var(--border)' }}
                  >
                    Version {currentMaterial.version}
                  </span>
                </div>

                <h1 className="text-lg font-semibold leading-snug" style={{ color: 'var(--text-primary)' }}>
                  {currentMaterial.canonicalDescription}
                </h1>

                <div className="flex flex-wrap items-center gap-3 text-xs" style={{ color: 'var(--text-secondary)' }}>
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[15px]">category</span>
                    Group: <strong style={{ color: 'var(--text-primary)' }}>{currentMaterial.materialGroupName}</strong>
                  </span>
                  <span>•</span>
                  <span>Category Code: <strong className="font-mono" style={{ color: 'var(--text-primary)' }}>{currentMaterial.materialGroup}</strong></span>
                  <span>•</span>
                  <span>Base UOM: <strong className="font-mono" style={{ color: 'var(--text-primary)' }}>{uom}</strong></span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row md:flex-col gap-2 shrink-0 w-full sm:w-auto">
                <button
                  onClick={handleCopyRaw}
                  className="px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all hover:opacity-80"
                  style={{ background: 'var(--bg-hover)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
                >
                  <span className="material-symbols-outlined text-[16px]">
                    {copied ? 'check' : 'content_copy'}
                  </span>
                  {copied ? 'Copied JSON' : 'Copy JSON'}
                </button>
              </div>
            </div>
          </section>

          {/* Technical Specifications Grid */}
          <section
            className="rounded-xl p-6 space-y-4"
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
          >
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider" style={{ color: 'var(--text-primary)' }}>
                  Technical Specifications &amp; Attributes
                </h3>
                <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                  Normalized attribute values synthesized from enterprise standards
                </p>
              </div>
              <span
                className="font-mono text-xs px-2.5 py-1 rounded"
                style={{ background: 'var(--blue-dim)', color: 'var(--blue)' }}
              >
                {Object.keys(specs).length} Attributes
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {Object.entries(specs).map(([key, value]) => (
                <div
                  key={key}
                  className="p-3.5 rounded-lg"
                  style={{ background: 'var(--bg-hover)', border: '1px solid var(--border-subtle)' }}
                >
                  <span className="text-xs uppercase font-semibold block mb-1" style={{ color: 'var(--text-muted)' }}>
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </span>
                  <span className="font-mono text-sm font-bold block" style={{ color: 'var(--text-primary)' }}>
                    {String(value) || '—'}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* Mapped CPSE Enterprise Codes */}
          <section
            className="rounded-xl overflow-hidden"
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
          >
            <div
              className="p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3"
              style={{ borderBottom: '1px solid var(--border)' }}
            >
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider" style={{ color: 'var(--text-primary)' }}>
                  Enterprise Cross-Reference Aliases ({currentMaterial.mappings.length})
                </h3>
                <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                  Legacy item codes mapped to this Common National Material Code
                </p>
              </div>

              <div
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg w-full sm:w-64"
                style={{ background: 'var(--bg-input)', border: '1px solid var(--border)' }}
              >
                <span className="material-symbols-outlined text-[16px]" style={{ color: 'var(--text-muted)' }}>search</span>
                <input
                  type="text"
                  value={filterQuery}
                  onChange={(e) => setFilterQuery(e.target.value)}
                  placeholder="Filter by CPSE or Code..."
                  className="bg-transparent border-none text-xs w-full outline-none"
                  style={{ color: 'var(--text-primary)' }}
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead style={{ background: 'var(--bg-hover)', borderBottom: '1px solid var(--border)' }}>
                  <tr>
                    {['CPSE Entity', 'Local Item Code', 'Local Description', 'Relation', 'Confidence', 'Mapped Date'].map(h => (
                      <th key={h} className="p-3.5 font-semibold uppercase tracking-wider text-xs" style={{ color: 'var(--text-muted)' }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y font-mono" style={{ borderColor: 'var(--border-subtle)' }}>
                  {filteredMappings.map((m, idx) => (
                    <tr key={idx} className="hover:opacity-90 transition-opacity">
                      <td className="p-3.5 font-sans font-bold" style={{ color: 'var(--text-primary)' }}>
                        <span
                          className="px-2 py-0.5 rounded text-xs mr-2 font-mono"
                          style={{ background: 'var(--blue-dim)', color: 'var(--blue)' }}
                        >
                          {m.cpse}
                        </span>
                      </td>
                      <td className="p-3.5 font-bold" style={{ color: 'var(--blue)' }}>
                        {m.localCode}
                      </td>
                      <td className="p-3.5 font-sans max-w-xs truncate" style={{ color: 'var(--text-secondary)' }}>
                        {m.localDescription}
                      </td>
                      <td className="p-3.5">
                        <RelationshipBadge type={m.relationship || 'IDENTICAL'} size="sm" />
                      </td>
                      <td className="p-3.5 font-bold" style={{ color: 'var(--success)' }}>
                        {currentMaterial.confidenceScore || 98}%
                      </td>
                      <td className="p-3.5 font-sans" style={{ color: 'var(--text-muted)' }}>
                        {m.lastUpdated || '2024-03-15'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>

        {/* Right Column: Metadata & Governance (3 columns) */}
        <div className="col-span-12 xl:col-span-3 flex flex-col gap-6">
          {/* Metadata Card */}
          <section
            className="rounded-xl p-5 space-y-4"
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
          >
            <h3 className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-primary)' }}>
              Catalog Metadata
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <span className="block text-xs mb-1" style={{ color: 'var(--text-muted)' }}>Lead Steward</span>
                <span className="font-semibold block" style={{ color: 'var(--text-primary)' }}>{leadCataloger}</span>
              </div>
              <div className="pt-2.5" style={{ borderTop: '1px solid var(--border-subtle)' }}>
                <span className="block text-xs mb-1" style={{ color: 'var(--text-muted)' }}>Last Audit Verification</span>
                <span className="font-mono font-medium block" style={{ color: 'var(--text-primary)' }}>{currentMaterial.lastUpdated || '2024-04-12'}</span>
              </div>
              <div className="pt-2.5" style={{ borderTop: '1px solid var(--border-subtle)' }}>
                <span className="block text-xs mb-1" style={{ color: 'var(--text-muted)' }}>Created Date</span>
                <span className="font-mono font-medium block" style={{ color: 'var(--text-primary)' }}>{currentMaterial.createdDate || '2023-09-18'}</span>
              </div>
              <div className="pt-2.5" style={{ borderTop: '1px solid var(--border-subtle)' }}>
                <span className="block text-xs mb-1" style={{ color: 'var(--text-muted)' }}>Cryptographic Hash</span>
                <span className="font-mono text-[11px] block truncate" style={{ color: 'var(--text-muted)' }}>
                  sha256:4a8b29c98ef01d...
                </span>
              </div>
            </div>
          </section>

          {/* Quick Actions Card */}
          <section
            className="rounded-xl p-5 space-y-3"
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
          >
            <h3 className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-primary)' }}>
              Governance Actions
            </h3>
            <div className="space-y-2 text-xs">
              <button
                onClick={() => addToast('info', `Export initiated for ${currentMaterial.cnmc}`)}
                className="w-full py-2 px-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all hover:opacity-80"
                style={{ background: 'var(--bg-hover)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
              >
                <span className="material-symbols-outlined text-[16px]">file_download</span>
                Export Spec Sheet (PDF)
              </button>
              <button
                onClick={() => addToast('warning', `Item flagged for committee re-inspection`)}
                className="w-full py-2 px-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all hover:opacity-80"
                style={{ background: 'var(--warn-dim)', border: '1px solid rgba(245,158,11,0.3)', color: 'var(--warning)' }}
              >
                <span className="material-symbols-outlined text-[16px]">flag</span>
                Flag for Committee Audit
              </button>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};
