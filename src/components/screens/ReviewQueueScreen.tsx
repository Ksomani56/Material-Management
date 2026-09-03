import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { RelationshipBadge } from '../common/RelationshipBadge';
import { ConfidenceBar } from '../common/ConfidenceBar';

export const ReviewQueueScreen: React.FC = () => {
  const {
    reviewQueue, selectedReviewIds, toggleSelectReviewItem,
    toggleSelectAllReviewItems, approveReviewItem, bulkApproveReviewItems,
    flagReviewItem, openEvidence, openUploadModal,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCpse, setSelectedCpse] = useState('ALL');
  const [selectedRelationship, setSelectedRelationship] = useState('ALL');
  const [minConfidence, setMinConfidence] = useState(70);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const filteredItems = useMemo(() => reviewQueue.filter(item => {
    const q = searchQuery.toLowerCase();
    const matchesSearch = !q ||
      item.sourceCode.toLowerCase().includes(q) ||
      item.candidateCnmc.toLowerCase().includes(q) ||
      item.candidateDescription.toLowerCase().includes(q) ||
      item.sourceDescription.toLowerCase().includes(q);
    const matchesCpse = selectedCpse === 'ALL' || item.sourceCpse === selectedCpse;
    const matchesRel = selectedRelationship === 'ALL' || item.relationship === selectedRelationship;
    return matchesSearch && matchesCpse && matchesRel && item.confidence >= minConfidence;
  }), [reviewQueue, searchQuery, selectedCpse, selectedRelationship, minConfidence]);

  const totalPages = Math.max(1, Math.ceil(filteredItems.length / pageSize));
  const paginatedItems = filteredItems.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const allSelectedOnPage = paginatedItems.length > 0 && paginatedItems.every(i => selectedReviewIds.includes(i.id));

  const selectStyle = {
    background: 'var(--bg-input)',
    border: '1px solid var(--border)',
    color: 'var(--text-primary)',
  };

  return (
    <main className="flex-1 flex flex-col overflow-hidden p-6 gap-4" style={{ background: 'var(--bg)' }}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 shrink-0">
        <div>
          <h2 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
            Harmonization Review Queue
          </h2>
          <p className="text-sm mt-0.5" style={{ color: 'var(--text-secondary)' }}>
            Suspected duplicates and material matches requiring cataloger approval.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {selectedReviewIds.length > 0 && (
            <button
              onClick={() => bulkApproveReviewItems(selectedReviewIds)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold hover:brightness-110 transition-all"
              style={{ background: 'var(--success)', color: '#fff' }}
            >
              <span className="material-symbols-outlined text-[16px]">done_all</span>
              Approve Selected ({selectedReviewIds.length})
            </button>
          )}
          <button
            onClick={() => openUploadModal('ONGC')}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium hover:brightness-110 transition-all"
            style={{ background: 'var(--bg-card)', color: 'var(--blue)', border: '1px solid var(--border)' }}
          >
            <span className="material-symbols-outlined text-[16px]">upload_file</span>
            Import CSV/XLS
          </button>
        </div>
      </div>

      {/* Filter toolbar */}
      <div className="flex flex-wrap gap-2.5 items-center p-3 rounded-xl shrink-0"
        style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg flex-1 min-w-[200px] max-w-sm"
          style={{ background: 'var(--bg-input)', border: '1px solid var(--border)' }}>
          <span className="material-symbols-outlined text-[16px]" style={{ color: 'var(--text-muted)' }}>search</span>
          <input
            type="text" value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search code, description or CNMC..."
            className="bg-transparent border-none text-sm focus:ring-0 w-full outline-none"
            style={{ color: 'var(--text-primary)' }}
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} style={{ color: 'var(--text-muted)' }} className="hover:opacity-80">
              <span className="material-symbols-outlined text-[14px]">close</span>
            </button>
          )}
        </div>

        {[
          { value: selectedCpse, onChange: (v: string) => setSelectedCpse(v), options: [
            { value: 'ALL', label: 'All Enterprises' },
            { value: 'ONGC', label: 'ONGC' },
            { value: 'IOCL', label: 'IOCL' },
            { value: 'GAIL', label: 'GAIL' },
            { value: 'BPCL', label: 'BPCL' },
            { value: 'NTPC', label: 'NTPC' },
            { value: 'BHEL', label: 'BHEL' },
          ]},
          { value: selectedRelationship, onChange: (v: string) => setSelectedRelationship(v), options: [
            { value: 'ALL', label: 'All Match Types' },
            { value: 'IDENTICAL', label: 'Identical' },
            { value: 'DUPLICATE', label: 'Duplicate' },
            { value: 'NEAR-DUPLICATE', label: 'Near-Duplicate' },
            { value: 'FUNCTIONALLY EQUIVALENT', label: 'Functionally Equivalent' },
          ]},
        ].map((sel, i) => (
          <select key={i} value={sel.value} onChange={e => sel.onChange(e.target.value)}
            className="px-3 py-2 rounded-lg text-sm outline-none"
            style={selectStyle}>
            {sel.options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        ))}

        <div className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm"
          style={{ background: 'var(--bg-input)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}>
          <span>Min: {minConfidence}%</span>
          <input type="range" min="50" max="95" step="5" value={minConfidence}
            onChange={e => setMinConfidence(Number(e.target.value))}
            className="w-16 cursor-pointer accent-blue-500" />
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-hidden flex flex-col rounded-xl"
        style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
        <div className="overflow-auto flex-1">
          <table className="w-full text-left whitespace-nowrap">
            <thead className="sticky top-0 z-10" style={{ background: 'var(--bg-card)', borderBottom: '1px solid var(--border)' }}>
              <tr>
                <th className="px-3 py-3 w-10">
                  <input type="checkbox" checked={allSelectedOnPage}
                    onChange={() => toggleSelectAllReviewItems(!allSelectedOnPage)}
                    className="rounded" style={{ accentColor: 'var(--blue)' }} />
                </th>
                {['Enterprise', 'Source Material', 'Recommended CNMC', 'Match Type', 'Confidence', ''].map(h => (
                  <th key={h} className="px-3 py-3 text-xs font-semibold uppercase tracking-wide"
                    style={{ color: 'var(--text-muted)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginatedItems.map(item => (
                <tr key={item.id} className="transition-colors hover:opacity-90"
                  style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                  <td className="px-3 py-4" onClick={e => e.stopPropagation()}>
                    <input type="checkbox" checked={selectedReviewIds.includes(item.id)}
                      onChange={() => toggleSelectReviewItem(item.id)}
                      className="rounded" style={{ accentColor: 'var(--blue)' }} />
                  </td>
                  <td className="px-3 py-4">
                    <span className="px-2.5 py-1 rounded text-sm font-bold font-mono"
                      style={{ background: 'var(--blue-dim)', color: 'var(--blue)' }}>
                      {item.sourceCpse}
                    </span>
                  </td>
                  <td className="px-3 py-4">
                    <div className="text-sm font-bold font-mono flex items-center gap-1.5" style={{ color: 'var(--blue)' }}>
                      {item.sourceCode}
                      <span className="text-xs font-normal" style={{ color: 'var(--text-muted)' }}>
                        ({item.sourceUom || item.sourceAttributes?.baseUOM || 'NOS'})
                      </span>
                    </div>
                    <p className="text-sm truncate max-w-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}
                      title={item.sourceDescription}>
                      {item.sourceDescription}
                    </p>
                  </td>
                  <td className="px-3 py-4">
                    <span className="text-sm font-semibold font-mono" style={{ color: 'var(--text-primary)' }}>
                      {item.candidateCnmc}
                    </span>
                    <p className="text-sm truncate max-w-xs mt-0.5" style={{ color: 'var(--text-muted)' }}
                      title={item.candidateDescription}>
                      {item.candidateDescription}
                    </p>
                  </td>
                  <td className="px-3 py-4 text-center">
                    <RelationshipBadge type={item.relationship} size="sm" />
                  </td>
                  <td className="px-3 py-4">
                    <div className="w-24">
                      <ConfidenceBar confidence={item.confidence} />
                    </div>
                  </td>
                  <td className="px-3 py-4 text-right" onClick={e => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-1.5">
                      <button onClick={() => openEvidence(item)}
                        className="p-1.5 rounded hover:opacity-80 transition-opacity"
                        style={{ color: 'var(--text-muted)', border: '1px solid var(--border)' }}
                        title="View Evidence">
                        <span className="material-symbols-outlined text-[15px]">visibility</span>
                      </button>
                      <button onClick={() => flagReviewItem(item.id)}
                        className="p-1.5 rounded hover:opacity-80 transition-opacity"
                        style={{ color: 'var(--warning)', border: '1px solid var(--border)' }}
                        title="Flag">
                        <span className="material-symbols-outlined text-[15px]">flag</span>
                      </button>
                      <button onClick={() => approveReviewItem(item.id)}
                        className="flex items-center gap-1 px-3 py-1.5 rounded text-sm font-semibold hover:brightness-110 transition-all"
                        style={{ background: 'var(--blue)', color: '#fff' }}>
                        <span className="material-symbols-outlined text-[14px]">check</span>
                        Approve
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination footer */}
        <div className="h-11 shrink-0 flex items-center justify-between px-4 text-sm"
          style={{ borderTop: '1px solid var(--border)', background: 'var(--bg-hover)', color: 'var(--text-muted)' }}>
          <span>
            Showing <strong style={{ color: 'var(--text-primary)' }}>
              {filteredItems.length === 0 ? 0 : (currentPage - 1) * pageSize + 1}
            </strong>–<strong style={{ color: 'var(--text-primary)' }}>
              {Math.min(currentPage * pageSize, filteredItems.length)}
            </strong> of <strong style={{ color: 'var(--text-primary)' }}>{filteredItems.length}</strong> items
          </span>
          <div className="flex items-center gap-2">
            <button disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              className="px-3 py-1 rounded text-sm disabled:opacity-40 hover:opacity-80 transition-opacity"
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}>
              ← Previous
            </button>
            <span className="font-mono text-sm">Page {currentPage} of {totalPages}</span>
            <button disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              className="px-3 py-1 rounded text-sm disabled:opacity-40 hover:opacity-80 transition-opacity"
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}>
              Next →
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};
