import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { RelationshipBadge } from '../common/RelationshipBadge';
import { ConfidenceBar } from '../common/ConfidenceBar';
import { RelationshipType } from '../../types/material';

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
    navigateToMaterial,
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

  const getPriorityDot = (pri: string) => {
    switch (pri) {
      case 'CRITICAL':
        return <div className="w-2 h-2 rounded-full bg-status-error mx-auto" title="Critical Priority" />;
      case 'HIGH':
        return <div className="w-2 h-2 rounded-full bg-status-warning mx-auto" title="High Priority" />;
      case 'MEDIUM':
        return <div className="w-2 h-2 rounded-full bg-primary mx-auto" title="Medium Priority" />;
      default:
        return <div className="w-2 h-2 rounded-full bg-outline mx-auto" title="Low Priority" />;
    }
  };

  return (
    <main className="flex-1 flex flex-col overflow-hidden p-margin-page gap-4 bg-background transition-colors duration-200">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 shrink-0">
        <div>
          <h1 className="font-headline-section text-headline-section text-on-surface font-bold">
            Harmonization Review Queue
          </h1>
          <p className="font-data-mono text-xs text-on-surface-variant mt-0.5">
            Validate high-confidence AI material matches requiring human-in-the-loop stewardship
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => openUploadModal('ONGC')}
            className="px-3.5 py-1.5 bg-surface-container hover:bg-surface-container-high border border-outline-variant/50 text-on-surface text-xs font-body-bold rounded-xl flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <span className="material-symbols-outlined text-sm text-primary">upload_file</span>
            Import CSV/XLS
          </button>

          {selectedReviewIds.length > 0 && (
            <button
              onClick={() => bulkApproveReviewItems(selectedReviewIds)}
              className="px-4 py-1.5 bg-primary text-on-primary font-body-bold text-xs rounded-xl hover:brightness-110 transition-all flex items-center gap-1.5 shadow-sm"
            >
              <span className="material-symbols-outlined text-sm">task_alt</span>
              Approve Selected ({selectedReviewIds.length})
            </button>
          )}

          <div className="font-data-mono text-xs text-on-surface-variant bg-surface-container px-3 py-1.5 rounded-xl border border-outline-variant/40">
            {reviewQueue.length} Pending Actions
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-surface-container p-3 rounded-2xl border border-outline-variant/40 flex flex-wrap gap-3 items-center justify-between shrink-0 shadow-sm">
        <div className="flex flex-wrap items-center gap-3 flex-1 min-w-[300px]">
          {/* Search Box */}
          <div className="flex items-center gap-2 px-3 py-1.5 bg-surface-container-low rounded-xl border border-outline-variant/40 flex-1 min-w-[200px] max-w-sm focus-within:ring-1 focus-within:ring-primary">
            <span className="material-symbols-outlined text-on-surface-variant text-[18px]">search</span>
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              placeholder="Search code or description..."
              className="bg-transparent border-none p-0 text-xs focus:ring-0 w-full text-on-surface placeholder-on-surface-variant font-data-mono outline-none"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="text-xs text-on-surface-variant hover:text-on-surface">✕</button>
            )}
          </div>

          {/* CPSE Filter */}
          <select 
            value={selectedCpse}
            onChange={(e) => { setSelectedCpse(e.target.value); setCurrentPage(1); }}
            className="bg-surface-container-low border border-outline-variant/40 rounded-xl px-3 py-1.5 text-xs text-on-surface focus:ring-1 focus:ring-primary focus:border-primary font-data-mono outline-none"
          >
            <option value="ALL">All CPSEs</option>
            <option value="ONGC">ONGC</option>
            <option value="IOCL">IOCL</option>
            <option value="NTPC">NTPC</option>
            <option value="SAIL">SAIL</option>
            <option value="GAIL">GAIL</option>
            <option value="BHEL">BHEL</option>
          </select>

          {/* Relationship Filter */}
          <select 
            value={selectedRelationship}
            onChange={(e) => { setSelectedRelationship(e.target.value); setCurrentPage(1); }}
            className="bg-surface-container-low border border-outline-variant/40 rounded-xl px-3 py-1.5 text-xs text-on-surface focus:ring-1 focus:ring-primary focus:border-primary font-data-mono outline-none"
          >
            <option value="ALL">All Match Types</option>
            <option value="IDENTICAL">Identical</option>
            <option value="DUPLICATE">Duplicate</option>
            <option value="NEAR-DUPLICATE">Near-Duplicate</option>
            <option value="FUNCTIONALLY EQUIVALENT">Func Equivalent</option>
          </select>
        </div>

        {/* Confidence Slider */}
        <div className="flex items-center gap-2 text-xs font-data-mono text-on-surface-variant bg-surface-container-low px-3 py-1.5 rounded-xl border border-outline-variant/40">
          <span>Min Confidence:</span>
          <input 
            type="range" 
            min="50" 
            max="95" 
            step="5"
            value={minConfidence} 
            onChange={(e) => setMinConfidence(Number(e.target.value))}
            className="w-20 accent-primary cursor-pointer"
          />
          <span className="text-primary font-bold min-w-[32px]">{minConfidence}%</span>
        </div>
      </div>

      {/* Main Review Queue Table */}
      <div className="flex-1 overflow-hidden bg-surface-container rounded-2xl border border-outline-variant/40 flex flex-col relative shadow-sm">
        <div className="overflow-auto flex-1">
          <table className="w-full text-left whitespace-nowrap border-collapse">
            <thead className="sticky top-0 bg-surface-container-high z-10 border-b border-outline-variant/40">
              <tr>
                <th className="w-10 px-3 py-2.5 text-center">
                  <input 
                    type="checkbox" 
                    checked={allSelectedOnPage}
                    onChange={(e) => toggleSelectAllReviewItems(e.target.checked)}
                    className="rounded border-outline-variant text-primary focus:ring-primary accent-primary cursor-pointer"
                  />
                </th>
                <th className="w-10 px-2 py-2.5 text-center font-table-header text-[10px] text-on-surface-variant uppercase">PRI</th>
                <th className="px-3 py-2.5 font-table-header text-[11px] text-on-surface-variant uppercase">CPSE</th>
                <th className="px-3 py-2.5 font-table-header text-[11px] text-on-surface-variant uppercase">Local Material Code & Specs</th>
                <th className="px-3 py-2.5 font-table-header text-[11px] text-on-surface-variant uppercase">Proposed National CNMC</th>
                <th className="px-3 py-2.5 font-table-header text-[11px] text-on-surface-variant uppercase text-center">Match Type</th>
                <th className="px-3 py-2.5 font-table-header text-[11px] text-on-surface-variant uppercase">Confidence</th>
                <th className="px-3 py-2.5 font-table-header text-[11px] text-on-surface-variant uppercase text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/20 font-data-mono text-xs">
              {paginatedItems.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-on-surface-variant">
                    <span className="material-symbols-outlined text-4xl block mb-2 text-outline">done_all</span>
                    No pending items match the selected filter criteria.
                  </td>
                </tr>
              ) : (
                paginatedItems.map((item) => {
                  const isSelected = selectedReviewIds.includes(item.id);
                  return (
                    <tr 
                      key={item.id}
                      className={`hover:bg-surface-container-high/60 transition-colors ${isSelected ? 'bg-primary/5' : ''}`}
                    >
                      <td className="px-3 py-2 text-center">
                        <input 
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelectReviewItem(item.id)}
                          className="rounded border-outline-variant text-primary focus:ring-primary accent-primary cursor-pointer"
                        />
                      </td>

                      <td className="px-2 py-2 text-center">
                        {getPriorityDot(item.priority)}
                      </td>

                      <td className="px-3 py-2">
                        <span className="px-2 py-0.5 rounded-md bg-surface-container-highest text-on-surface text-[10px] font-bold border border-outline-variant/30">
                          {item.sourceCpse}
                        </span>
                      </td>

                      <td className="px-3 py-2">
                        <div className="font-semibold text-primary flex items-center gap-1.5">
                          <span>{item.sourceCode}</span>
                          <span className="text-[10px] text-on-surface-variant font-normal">({item.sourceUom || item.sourceAttributes?.baseUOM || 'NOS'})</span>
                        </div>
                        <p className="font-sans text-[11px] text-on-surface truncate max-w-sm" title={item.sourceDescription}>
                          {item.sourceDescription}
                        </p>
                      </td>

                      <td className="px-3 py-2">
                        <button
                          onClick={() => navigateToMaterial(item.candidateCnmc)}
                          className="font-semibold text-relationship-identical hover:underline flex items-center gap-1"
                        >
                          {item.candidateCnmc}
                          <span className="material-symbols-outlined text-[12px]">open_in_new</span>
                        </button>
                        <p className="font-sans text-[11px] text-on-surface-variant truncate max-w-xs" title={item.candidateDescription}>
                          {item.candidateDescription}
                        </p>
                      </td>

                      <td className="px-3 py-2 text-center">
                        <RelationshipBadge type={item.relationship as RelationshipType} size="sm" />
                      </td>

                      <td className="px-3 py-2">
                        <ConfidenceBar confidence={item.confidence} />
                      </td>

                      <td className="px-3 py-2 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => openEvidence(item)}
                            title="View AI Evidence & Analysis"
                            className="p-1.5 rounded-lg border border-outline-variant/40 hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface transition-colors"
                          >
                            <span className="material-symbols-outlined text-[16px]">visibility</span>
                          </button>

                          <button
                            onClick={() => flagReviewItem(item.id)}
                            title="Flag for domain expert review"
                            className="p-1.5 rounded-lg border border-outline-variant/40 hover:bg-surface-container-high text-status-warning transition-colors"
                          >
                            <span className="material-symbols-outlined text-[16px]">flag</span>
                          </button>

                          <button
                            onClick={() => approveReviewItem(item.id)}
                            title="Approve & Harmonize"
                            className="px-2.5 py-1 rounded-lg bg-primary text-on-primary font-body-bold text-[11px] hover:brightness-110 transition-all flex items-center gap-1 shadow-sm"
                          >
                            <span className="material-symbols-outlined text-[14px]">check</span>
                            Approve
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer / Pagination */}
        <div className="h-11 border-t border-outline-variant/40 bg-surface-container-high flex items-center justify-between px-4 shrink-0 text-on-surface-variant font-data-mono text-xs">
          <span>
            Showing <strong>{paginatedItems.length}</strong> of <strong>{filteredItems.length}</strong> filtered items
          </span>

          <div className="flex items-center gap-2">
            <button
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              className="p-1 rounded border border-outline-variant/40 hover:bg-surface-container disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <span className="material-symbols-outlined text-sm">chevron_left</span>
            </button>
            <span>Page {currentPage} of {totalPages}</span>
            <button
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              className="p-1 rounded border border-outline-variant/40 hover:bg-surface-container disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <span className="material-symbols-outlined text-sm">chevron_right</span>
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};
