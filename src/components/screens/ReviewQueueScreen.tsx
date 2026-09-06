import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { RelationshipBadge } from '../common/RelationshipBadge';
import { ConfidenceBar } from '../common/ConfidenceBar';
import { ScreenFooter } from '../common/FooterLegalModal';

export const ReviewQueueScreen: React.FC = () => {
  const {
    reviewQueue, selectedReviewIds, toggleSelectReviewItem,
    toggleSelectAllReviewItems, approveReviewItem, bulkApproveReviewItems,
    flagReviewItem, openEvidence, openUploadModal, setActiveScreen,
    reviewCpseFilter, setReviewCpseFilter, auditLogs
  } = useApp();

  const approvedCount = useMemo(() => {
    return auditLogs.filter(l => l.action.toLowerCase().includes('approve') || l.action.toLowerCase().includes('merge')).length;
  }, [auditLogs]);

  const avgConfidence = useMemo(() => {
    if (!reviewQueue || reviewQueue.length === 0) return 0;
    return Math.round(reviewQueue.reduce((acc, item) => acc + item.confidence, 0) / reviewQueue.length);
  }, [reviewQueue]);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCpse, setSelectedCpse] = useState(() => reviewCpseFilter || 'ALL');
  const [selectedRelationship, setSelectedRelationship] = useState('ALL');
  const [minConfidence, setMinConfidence] = useState(70);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  React.useEffect(() => {
    if (reviewCpseFilter) {
      setSelectedCpse(reviewCpseFilter);
    }
  }, [reviewCpseFilter]);

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

  return (
    <main className="flex-1 overflow-y-auto px-8 py-6 space-y-6 bg-[#070908] text-[#F3F4F6]">
      {/* 1. Breadcrumbs & Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-medium text-[#9CA3AF]">
          <span 
            onClick={() => setActiveScreen('dashboard')} 
            className="cursor-pointer hover:text-[#F3F4F6] transition-colors"
          >
            Home
          </span>
          <span className="text-[#6B7280]">›</span>
          <span className="text-[#F3F4F6]">Review Queue</span>
        </div>

        <div className="flex items-center gap-3">
          {selectedReviewIds.length > 0 && (
            <button
              onClick={() => bulkApproveReviewItems(selectedReviewIds)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#10B981] text-[#000000] hover:brightness-110 transition-all shadow-sm"
            >
              <span className="material-symbols-outlined text-[15px]">done_all</span>
              <span>Approve Selected ({selectedReviewIds.length})</span>
            </button>
          )}
          <button
            onClick={() => openUploadModal('ONGC')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#0C0E0D] border border-[#232825] text-[#F3F4F6] hover:border-[#38423C] transition-all"
          >
            <span className="material-symbols-outlined text-[15px] text-[#9CA3AF]">upload_file</span>
            <span>Import CSV/XLS</span>
          </button>
        </div>
      </div>

      {/* 2. Page Title Block */}
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-white font-sans">
          Harmonization Review Queue
        </h1>
        <p className="text-xs md:text-sm text-[#9CA3AF] leading-relaxed max-w-4xl">
          Suspected duplicate materials and borderline similarity recommendations requiring human-in-the-loop validation.
        </p>
      </div>

      {/* 3. Hero Split Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-1">
        <div className="lg:col-span-7 space-y-2">
          <h2 className="text-sm font-semibold text-[#F3F4F6] tracking-normal font-sans">
            Cataloger Verification Queue
          </h2>
          <p className="text-xs text-[#9CA3AF] leading-relaxed font-sans">
            Automated machine learning algorithms flag records when differences in unit of measurement, thread pitch, or alloy grade fall between 70% and 95% confidence. Approved matches are immediately indexed into the National Master.
          </p>
        </div>

        <div className="lg:col-span-5 grid grid-cols-3 gap-4 pt-1">
          <div>
            <div className="text-2xl lg:text-3xl font-bold font-sans text-[#EAB308] tracking-tight">
              {reviewQueue.length}
            </div>
            <div className="text-xs font-semibold text-[#F3F4F6] mt-1 leading-tight">
              Pending Items
            </div>
            <div className="text-[11px] text-[#6B7280] leading-snug">
              Awaiting review
            </div>
          </div>

          <div>
            <div className="text-2xl lg:text-3xl font-bold font-sans text-[#10B981] tracking-tight">
              {approvedCount}
            </div>
            <div className="text-xs font-semibold text-[#F3F4F6] mt-1 leading-tight">
              Approved Records
            </div>
            <div className="text-[11px] text-[#6B7280] leading-snug">
              Audited in ledger
            </div>
          </div>

          <div>
            <div className="text-2xl lg:text-3xl font-bold font-sans text-[#22D3EE] tracking-tight">
              {avgConfidence}%
            </div>
            <div className="text-xs font-semibold text-[#F3F4F6] mt-1 leading-tight">
              Avg Confidence
            </div>
            <div className="text-[11px] text-[#6B7280] leading-snug">
              Semantic match
            </div>
          </div>
        </div>
      </div>

      {/* 4. Filter Toolbar */}
      <div className="flex flex-wrap gap-3 items-center p-3 rounded-xl bg-[#0C0E0D] border border-[#232825]">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#070908] border border-[#232825] flex-1 min-w-[200px] max-w-sm">
          <span className="material-symbols-outlined text-[16px] text-[#9CA3AF]">search</span>
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search code or description..."
            className="bg-transparent border-none text-xs text-[#F3F4F6] placeholder-[#9CA3AF] outline-none w-full"
          />
        </div>

        <select
          value={selectedCpse}
          onChange={e => setSelectedCpse(e.target.value)}
          className="px-3 py-1.5 rounded-lg text-xs bg-[#070908] border border-[#232825] text-[#F3F4F6] outline-none"
        >
          <option value="ALL">All CPSEs</option>
          <option value="ONGC">ONGC</option>
          <option value="IOCL">IOCL</option>
          <option value="GAIL">GAIL</option>
          <option value="NTPC">NTPC</option>
        </select>

        <select
          value={selectedRelationship}
          onChange={e => setSelectedRelationship(e.target.value)}
          className="px-3 py-1.5 rounded-lg text-xs bg-[#070908] border border-[#232825] text-[#F3F4F6] outline-none"
        >
          <option value="ALL">All Relationships</option>
          <option value="IDENTICAL">Identical</option>
          <option value="INTERCHANGEABLE">Interchangeable</option>
          <option value="NEAR_DUPLICATE">Near-Duplicate</option>
        </select>

        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#070908] border border-[#232825] text-xs">
          <span className="text-[#6B7280]">Confidence:</span>
          <select
            value={minConfidence}
            onChange={e => setMinConfidence(Number(e.target.value))}
            className="bg-transparent text-[#10B981] font-mono font-semibold outline-none cursor-pointer"
          >
            <option value="50" className="bg-[#0C0E0D] text-white">All (&ge;50%)</option>
            <option value="70" className="bg-[#0C0E0D] text-white">&ge;70% (Default)</option>
            <option value="80" className="bg-[#0C0E0D] text-white">&ge;80% (High)</option>
            <option value="90" className="bg-[#0C0E0D] text-white">&ge;90% (Strict)</option>
            <option value="95" className="bg-[#0C0E0D] text-white">&ge;95% (Near-Certain)</option>
          </select>
        </div>
      </div>

      {/* 5. Queue Table */}
      <div className="bg-[#0C0E0D] border border-[#232825] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#232825] text-[10px] uppercase font-semibold text-[#6B7280]">
                <th className="px-5 py-3 w-10">
                  <input
                    type="checkbox"
                    checked={allSelectedOnPage}
                    onChange={(e) => toggleSelectAllReviewItems(e.target.checked)}
                    className="rounded bg-[#070908] border-[#232825] text-[#10B981] focus:ring-0 cursor-pointer"
                  />
                </th>
                <th className="px-5 py-3 font-medium">Source Record (CPSE)</th>
                <th className="px-5 py-3 font-medium">Target Candidate (CNMC)</th>
                <th className="px-5 py-3 font-medium text-center">Relationship</th>
                <th className="px-5 py-3 font-medium text-center">Confidence</th>
                <th className="px-5 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1B201D]">
              {paginatedItems.map(item => {
                const isSelected = selectedReviewIds.includes(item.id);
                return (
                  <tr
                    key={item.id}
                    className={`hover:bg-white/[0.02] transition-colors ${
                      isSelected ? 'bg-white/[0.03]' : ''
                    }`}
                  >
                    <td className="px-5 py-4">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelectReviewItem(item.id)}
                        className="rounded bg-[#070908] border-[#232825] text-[#10B981] focus:ring-0 cursor-pointer"
                      />
                    </td>

                    <td className="px-5 py-4 max-w-xs">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono text-xs font-bold text-[#10B981]">
                          {item.sourceCode}
                        </span>
                        <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-[#161B18] text-[#9CA3AF] border border-[#232825]">
                          {item.sourceCpse}
                        </span>
                      </div>
                      <p className="text-xs text-[#F3F4F6] truncate">{item.sourceDescription}</p>
                    </td>

                    <td className="px-5 py-4 max-w-xs">
                      <div className="font-mono text-xs font-bold text-[#22D3EE] mb-1">
                        {item.candidateCnmc}
                      </div>
                      <p className="text-xs text-[#9CA3AF] truncate">{item.candidateDescription}</p>
                    </td>

                    <td className="px-5 py-4 text-center">
                      <RelationshipBadge type={item.relationship} size="sm" />
                    </td>

                    <td className="px-5 py-4 text-center">
                      <div className="w-24 mx-auto">
                        <ConfidenceBar confidence={item.confidence} />
                      </div>
                    </td>

                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => flagReviewItem(item.id)}
                          className="p-1.5 rounded-lg border border-[#232825] text-[#EAB308] hover:bg-[#EAB308]/10 transition-all"
                          title="Flag Discrepancy"
                        >
                          <span className="material-symbols-outlined text-[15px]">flag</span>
                        </button>
                        <button
                          onClick={() => approveReviewItem(item.id)}
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#10B981] text-[#000000] hover:brightness-110 transition-all shadow-sm"
                        >
                          Approve
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="px-5 py-3 border-t border-[#232825] bg-[#070908] flex items-center justify-between text-xs text-[#9CA3AF]">
          <div>
            Showing Page <strong className="text-white font-mono">{currentPage}</strong> of <strong className="text-white font-mono">{totalPages}</strong>
          </div>
          <div className="flex items-center gap-2">
            <button
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage(p => p - 1)}
              className="p-1 rounded border border-[#232825] hover:border-[#38423C] disabled:opacity-30"
            >
              <span className="material-symbols-outlined text-[16px]">chevron_left</span>
            </button>
            <button
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage(p => p + 1)}
              className="p-1 rounded border border-[#232825] hover:border-[#38423C] disabled:opacity-30"
            >
              <span className="material-symbols-outlined text-[16px]">chevron_right</span>
            </button>
          </div>
        </div>
      </div>

      {/* 6. Footer */}
      <ScreenFooter />
    </main>
  );
};
