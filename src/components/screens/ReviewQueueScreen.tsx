import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { RelationshipBadge } from '../common/RelationshipBadge';
import { ConfidenceBar } from '../common/ConfidenceBar';

export const ReviewQueueScreen: React.FC = () => {
  const { 
    reviewQueue, 
    selectedReviewIds, 
    toggleSelectReviewItem, 
    toggleSelectAllReviewItems, 
    approveReviewItem, 
    bulkApproveReviewItems, 
    flagReviewItem, 
    openEvidence,
    openUploadModal
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCpse, setSelectedCpse] = useState('ALL');
  const [selectedRelationship, setSelectedRelationship] = useState<string>('ALL');
  const [minConfidence, setMinConfidence] = useState<number>(70);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 10;

  // Filtering
  const filteredItems = useMemo(() => {
    return reviewQueue.filter(item => {
      const matchesSearch = 
        !searchQuery.trim() ||
        item.sourceCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.candidateCnmc.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.candidateDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.sourceDescription.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCpse = selectedCpse === 'ALL' || item.sourceCpse === selectedCpse;
      const matchesRel = selectedRelationship === 'ALL' || item.relationship === selectedRelationship;
      const matchesConfidence = item.confidence >= minConfidence;

      return matchesSearch && matchesCpse && matchesRel && matchesConfidence;
    });
  }, [reviewQueue, searchQuery, selectedCpse, selectedRelationship, minConfidence]);

  const totalPages = Math.max(1, Math.ceil(filteredItems.length / pageSize));
  const paginatedItems = filteredItems.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const allSelectedOnPage = paginatedItems.length > 0 && paginatedItems.every(i => selectedReviewIds.includes(i.id));

  return (
    <main className="flex-1 flex flex-col overflow-hidden p-6 gap-4 bg-background">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 shrink-0">
        <div>
          <h1 className="text-base font-bold text-on-surface tracking-tight">
            Harmonization Review Queue
          </h1>
          <p className="text-xs text-on-surface-variant mt-0.5">
            Suspected duplicates and material matches requiring cataloger approval.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {selectedReviewIds.length > 0 && (
            <button 
              onClick={() => bulkApproveReviewItems(selectedReviewIds)}
              className="px-3 py-1.5 bg-primary text-on-primary text-xs font-semibold rounded-lg hover:brightness-110 transition-all flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[15px]">done_all</span>
              Approve Selected ({selectedReviewIds.length})
            </button>
          )}

          <button
            onClick={() => openUploadModal('ONGC')}
            className="px-3 py-1.5 bg-surface-container hover:bg-surface-container-high border border-outline-variant/60 text-on-surface text-xs font-medium rounded-lg flex items-center gap-1.5 transition-colors"
          >
            <span className="material-symbols-outlined text-[15px] text-primary">upload_file</span>
            Import CSV/XLS
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-wrap gap-2.5 items-center bg-surface-container p-3 rounded-xl border border-outline-variant/60 shrink-0">
        {/* Search */}
        <div className="flex items-center gap-2 px-3 py-1.5 bg-surface-container-low rounded-lg border border-outline-variant/60 flex-1 min-w-[220px] max-w-sm focus-within:ring-1 focus-within:ring-primary">
          <span className="material-symbols-outlined text-on-surface-variant text-[16px]">search</span>
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search code, description or CNMC..."
            className="bg-transparent border-none p-0 text-xs focus:ring-0 w-full text-on-surface placeholder-on-surface-variant font-mono outline-none"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="text-xs text-on-surface-variant hover:text-on-surface">✕</button>
          )}
        </div>

        {/* CPSE Filter */}
        <select 
          value={selectedCpse}
          onChange={(e) => setSelectedCpse(e.target.value)}
          className="bg-surface-container-low border border-outline-variant/60 rounded-lg px-2.5 py-1.5 text-xs text-on-surface focus:ring-1 focus:ring-primary font-mono outline-none"
        >
          <option value="ALL">All CPSE Enterprises</option>
          <option value="ONGC">ONGC</option>
          <option value="IOCL">IOCL</option>
          <option value="GAIL">GAIL</option>
          <option value="BPCL">BPCL</option>
          <option value="NTPC">NTPC</option>
          <option value="BHEL">BHEL</option>
        </select>

        {/* Relationship Filter */}
        <select 
          value={selectedRelationship}
          onChange={(e) => setSelectedRelationship(e.target.value)}
          className="bg-surface-container-low border border-outline-variant/60 rounded-lg px-2.5 py-1.5 text-xs text-on-surface focus:ring-1 focus:ring-primary font-mono outline-none"
        >
          <option value="ALL">All Match Types</option>
          <option value="IDENTICAL">Identical</option>
          <option value="DUPLICATE">Duplicate</option>
          <option value="NEAR-DUPLICATE">Near-Duplicate</option>
          <option value="FUNCTIONALLY EQUIVALENT">Functionally Equivalent</option>
        </select>

        {/* Confidence Filter */}
        <div className="flex items-center gap-2 px-2.5 py-1.5 bg-surface-container-low rounded-lg border border-outline-variant/60 text-xs text-on-surface-variant font-mono">
          <span>Min Match: {minConfidence}%</span>
          <input 
            type="range" 
            min="50" 
            max="95" 
            step="5" 
            value={minConfidence} 
            onChange={(e) => setMinConfidence(Number(e.target.value))}
            className="w-16 accent-primary cursor-pointer" 
          />
        </div>
      </div>

      {/* Review Queue Table */}
      <div className="flex-1 overflow-hidden bg-surface-container rounded-xl border border-outline-variant/60 flex flex-col relative">
        <div className="overflow-auto flex-1">
          <table className="w-full text-left whitespace-nowrap border-collapse">
            <thead className="sticky top-0 bg-surface-container-high z-10 border-b border-outline-variant/60">
              <tr>
                <th className="px-3 py-2.5 w-10 text-center">
                  <input 
                    type="checkbox"
                    checked={allSelectedOnPage}
                    onChange={() => toggleSelectAllReviewItems(!allSelectedOnPage)}
                    className="rounded border-outline-variant text-primary focus:ring-primary bg-surface-container"
                  />
                </th>
                <th className="px-3 py-2.5 text-[11px] text-on-surface-variant font-medium uppercase">Enterprise</th>
                <th className="px-3 py-2.5 text-[11px] text-on-surface-variant font-medium uppercase">Source Material</th>
                <th className="px-3 py-2.5 text-[11px] text-on-surface-variant font-medium uppercase">Recommended Master (CNMC)</th>
                <th className="px-3 py-2.5 text-[11px] text-on-surface-variant font-medium uppercase text-center">Match Type</th>
                <th className="px-3 py-2.5 text-[11px] text-on-surface-variant font-medium uppercase">Confidence</th>
                <th className="px-3 py-2.5 text-[11px] text-on-surface-variant font-medium uppercase text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/30 font-mono text-xs">
              {paginatedItems.map((item) => (
                <tr key={item.id} className="hover:bg-surface-container-high/40 transition-colors duration-140">
                  <td className="px-3 py-2.5 text-center" onClick={(e) => e.stopPropagation()}>
                    <input 
                      type="checkbox"
                      checked={selectedReviewIds.includes(item.id)}
                      onChange={() => toggleSelectReviewItem(item.id)}
                      className="rounded border-outline-variant text-primary focus:ring-primary bg-surface-container"
                    />
                  </td>

                  <td className="px-3 py-2.5">
                    <span className="px-2 py-0.5 rounded bg-surface-container-high font-semibold text-on-surface border border-outline-variant/40">
                      {item.sourceCpse}
                    </span>
                  </td>

                  <td className="px-3 py-2.5">
                    <div className="font-semibold text-primary flex items-center gap-1.5">
                      <span>{item.sourceCode}</span>
                      <span className="text-[10px] text-on-surface-variant font-normal">({item.sourceUom || item.sourceAttributes?.baseUOM || 'NOS'})</span>
                    </div>
                    <p className="font-sans text-xs text-on-surface truncate max-w-sm" title={item.sourceDescription}>
                      {item.sourceDescription}
                    </p>
                  </td>

                  <td className="px-3 py-2.5">
                    <span className="font-semibold text-on-surface">{item.candidateCnmc}</span>
                    <p className="font-sans text-xs text-on-surface-variant truncate max-w-sm" title={item.candidateDescription}>
                      {item.candidateDescription}
                    </p>
                  </td>

                  <td className="px-3 py-2.5 text-center">
                    <RelationshipBadge type={item.relationship} size="sm" />
                  </td>

                  <td className="px-3 py-2.5">
                    <div className="w-24">
                      <ConfidenceBar confidence={item.confidence} />
                    </div>
                  </td>

                  <td className="px-3 py-2.5 text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-1.5">
                      <button 
                        onClick={() => openEvidence(item)}
                        title="View Evidence & Attribute Comparison"
                        className="p-1 rounded-md border border-outline-variant/60 hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface transition-colors"
                      >
                        <span className="material-symbols-outlined text-[15px]">visibility</span>
                      </button>

                      <button 
                        onClick={() => flagReviewItem(item.id)}
                        title="Flag for Technical Inspection"
                        className="p-1 rounded-md border border-outline-variant/60 hover:bg-surface-container-high text-status-warning transition-colors"
                      >
                        <span className="material-symbols-outlined text-[15px]">flag</span>
                      </button>

                      <button 
                        onClick={() => approveReviewItem(item.id)}
                        className="px-2.5 py-1 bg-primary text-on-primary rounded-md text-xs font-semibold hover:brightness-110 transition flex items-center gap-1 font-sans"
                      >
                        <span className="material-symbols-outlined text-[13px]">check</span>
                        Approve
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer with pagination */}
        <div className="h-10 border-t border-outline-variant/50 bg-surface-container-high flex items-center justify-between px-4 shrink-0 text-on-surface-variant font-mono text-xs">
          <span>
            Showing <strong>{filteredItems.length === 0 ? 0 : (currentPage - 1) * pageSize + 1}</strong> - <strong>{Math.min(currentPage * pageSize, filteredItems.length)}</strong> of <strong>{filteredItems.length}</strong> items
          </span>

          <div className="flex items-center gap-1.5 font-sans">
            <button 
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              className="px-2 py-0.5 rounded bg-surface-container border border-outline-variant/50 disabled:opacity-40 hover:bg-surface-container-highest transition text-xs"
            >
              Previous
            </button>
            <span className="font-mono text-xs">Page {currentPage} of {totalPages}</span>
            <button 
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              className="px-2 py-0.5 rounded bg-surface-container border border-outline-variant/50 disabled:opacity-40 hover:bg-surface-container-highest transition text-xs"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};
