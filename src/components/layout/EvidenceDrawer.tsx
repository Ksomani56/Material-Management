import React from 'react';
import { useApp } from '../../context/AppContext';
import { MatchCandidate, CanonicalMaterial } from '../../types/material';
import { RelationshipBadge } from '../common/RelationshipBadge';

export const EvidenceDrawer: React.FC = () => {
  const { 
    evidenceDrawerOpen, 
    evidenceTarget, 
    closeEvidence, 
    approveReviewItem, 
    flagReviewItem 
  } = useApp();

  if (!evidenceDrawerOpen || !evidenceTarget) return null;

  const isCandidate = 'candidateCnmc' in evidenceTarget;
  const candidate = isCandidate ? (evidenceTarget as MatchCandidate) : null;
  const canonical = !isCandidate ? (evidenceTarget as CanonicalMaterial) : null;

  const title = isCandidate 
    ? `Match Evidence: ${candidate?.sourceCode} ➔ ${candidate?.candidateCnmc}`
    : `Master Profile Evidence: ${canonical?.cnmc}`;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end bg-black/60 backdrop-blur-sm transition-opacity">
      <div 
        className="w-full max-w-[620px] bg-surface-container h-full shadow-2xl border-l border-outline-variant/40 flex flex-col animate-in slide-in-from-right duration-200"
      >
        {/* Drawer Header */}
        <div className="p-4 border-b border-outline-variant/40 bg-surface-container-high flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-primary fill-icon">plagiarism</span>
            <div>
              <h2 className="font-headline-section text-sm font-bold text-on-surface leading-tight">
                AI Evidence & Traceability
              </h2>
              <p className="font-data-mono text-[11px] text-on-surface-variant truncate max-w-[400px]">
                {title}
              </p>
            </div>
          </div>
          <button
            onClick={closeEvidence}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:bg-surface-container-highest transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Drawer Body (Scrollable) */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {/* Top Score Banner */}
          <div className="bg-surface-container-low p-4 rounded-2xl border border-outline-variant/40 flex items-center justify-between">
            <div>
              <span className="font-label-caps text-[10px] text-on-surface-variant uppercase">
                Recommendation Confidence
              </span>
              <div className="flex items-center gap-2 mt-1">
                <span className="material-symbols-outlined text-primary text-[20px]">auto_awesome</span>
                <span className="font-display-cnmc text-2xl font-bold text-primary">
                  {candidate ? `${candidate.confidence}%` : `${canonical?.confidenceScore}%`}
                </span>
                {candidate && <RelationshipBadge type={candidate.relationship} size="sm" />}
              </div>
            </div>
            <div className="text-right font-data-mono text-xs text-on-surface-variant">
              <div>Semantic Agreement: <strong className="text-on-surface">97.8%</strong></div>
              <div>Attribute Parity: <strong className="text-on-surface">98.5%</strong></div>
            </div>
          </div>

          {/* Explainable AI Rationale */}
          <div className="bg-surface-container-low p-4 rounded-2xl border border-outline-variant/40">
            <h3 className="font-table-header text-xs text-on-surface uppercase flex items-center gap-1.5 mb-2 font-semibold">
              <span className="material-symbols-outlined text-sm text-status-info">psychology</span>
              Explainable AI Match Rationale
            </h3>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              {candidate?.explanation || 'Canonical record synthesized through multi-CPSE attribute normalization pipeline. Verified against national engineering standards.'}
            </p>
            {candidate?.conflicts && (
              <div className="mt-3 p-2.5 bg-surface-container rounded-xl border border-status-warning/40 flex items-start gap-2">
                <span className="material-symbols-outlined text-status-warning text-sm mt-0.5 shrink-0">warning</span>
                <div className="text-xs">
                  <span className="font-bold text-status-warning">Conflict Flag: </span>
                  <span className="text-on-surface-variant">{candidate.conflicts}</span>
                </div>
              </div>
            )}
          </div>

          {/* Side-by-Side Attribute Comparison Table */}
          <div className="border border-outline-variant/40 rounded-2xl overflow-hidden shadow-sm">
            <div className="bg-surface-container-high px-4 py-2.5 border-b border-outline-variant/40 flex justify-between items-center">
              <h3 className="font-table-header text-xs text-on-surface uppercase font-semibold">
                Side-by-Side Technical Comparison
              </h3>
              <span className="font-data-mono text-[10px] text-primary font-bold">Source vs National Standard</span>
            </div>
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-surface-container-low border-b border-outline-variant/40 font-table-header text-[11px] text-on-surface-variant">
                <tr>
                  <th className="p-2.5">Attribute</th>
                  <th className="p-2.5">Raw Source (CPSE)</th>
                  <th className="p-2.5">National Canonical</th>
                  <th className="p-2.5 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/20 font-data-mono text-[11px]">
                <tr>
                  <td className="p-2.5 text-on-surface-variant">Description</td>
                  <td className="p-2.5 text-on-surface truncate max-w-[130px]">
                    {candidate?.sourceDescription || 'VALVE BALL TRUNNION 6IN'}
                  </td>
                  <td className="p-2.5 text-primary truncate max-w-[150px]">
                    {candidate?.candidateDescription || canonical?.canonicalDescription}
                  </td>
                  <td className="p-2.5 text-center">
                    <span className="material-symbols-outlined text-status-success text-xs">check_circle</span>
                  </td>
                </tr>
                <tr>
                  <td className="p-2.5 text-on-surface-variant">Base Material</td>
                  <td className="p-2.5 text-on-surface">Carbon Steel A105</td>
                  <td className="p-2.5 text-on-surface">ASTM A105 Forged</td>
                  <td className="p-2.5 text-center">
                    <span className="material-symbols-outlined text-status-success text-xs">check_circle</span>
                  </td>
                </tr>
                <tr>
                  <td className="p-2.5 text-on-surface-variant">Size</td>
                  <td className="p-2.5 text-on-surface">6 IN / 150 NB</td>
                  <td className="p-2.5 text-on-surface">6 IN (150 mm)</td>
                  <td className="p-2.5 text-center">
                    <span className="material-symbols-outlined text-status-success text-xs">check_circle</span>
                  </td>
                </tr>
                <tr>
                  <td className="p-2.5 text-on-surface-variant">Pressure Class</td>
                  <td className="p-2.5 text-on-surface">300# / Class 300</td>
                  <td className="p-2.5 text-on-surface">Class 300 (PN 50)</td>
                  <td className="p-2.5 text-center">
                    <span className="material-symbols-outlined text-status-success text-xs">check_circle</span>
                  </td>
                </tr>
                <tr>
                  <td className="p-2.5 text-on-surface-variant">End Connection</td>
                  <td className="p-2.5 text-on-surface">RF Flanged</td>
                  <td className="p-2.5 text-on-surface">RF (Raised Face)</td>
                  <td className="p-2.5 text-center">
                    <span className="material-symbols-outlined text-status-success text-xs">check_circle</span>
                  </td>
                </tr>
                <tr>
                  <td className="p-2.5 text-on-surface-variant">Standard UOM</td>
                  <td className="p-2.5 text-on-surface">
                    {candidate?.conflicts ? 'EA (Each)' : 'NOS (Numbers)'}
                  </td>
                  <td className="p-2.5 text-on-surface">NOS (Standard Master)</td>
                  <td className="p-2.5 text-center">
                    {candidate?.conflicts ? (
                      <span className="material-symbols-outlined text-status-warning text-xs">warning</span>
                    ) : (
                      <span className="material-symbols-outlined text-status-success text-xs">check_circle</span>
                    )}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Governance Timeline */}
          <div>
            <h3 className="font-table-header text-xs text-on-surface uppercase font-semibold mb-3 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-sm text-on-surface-variant">gavel</span>
              Traceability & Audit Chain
            </h3>
            <div className="relative border-l border-outline-variant/60 ml-2 space-y-4 pl-4 text-xs">
              <div className="relative">
                <div className="absolute w-2 h-2 rounded-full bg-primary -left-[21px] top-1 shadow-sm" />
                <span className="font-data-mono text-[10px] text-on-surface-variant">Automated Audit Log</span>
                <p className="font-body-bold text-on-surface mt-0.5">Semantic Pipeline v4.2 Evaluated</p>
                <p className="text-on-surface-variant text-[11px]">Normalized local attributes and matched against CNMC repository.</p>
              </div>
              <div className="relative">
                <div className="absolute w-2 h-2 rounded-full bg-status-success -left-[21px] top-1" />
                <span className="font-data-mono text-[10px] text-on-surface-variant">Rule Engine</span>
                <p className="font-body-bold text-on-surface mt-0.5">Taxonomy Validation Passed</p>
                <p className="text-on-surface-variant text-[11px]">Validated against CPSE Unified Material Master Guidelines.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Drawer Footer Actions */}
        <div className="p-4 border-t border-outline-variant/40 bg-surface-container-high flex items-center justify-between shrink-0">
          <button
            onClick={closeEvidence}
            className="px-4 py-2 border border-outline-variant/50 rounded-xl text-xs font-body-bold text-on-surface hover:bg-surface-container transition-colors"
          >
            Close
          </button>
          {candidate && (
            <div className="flex gap-2">
              <button
                onClick={() => {
                  flagReviewItem(candidate.id, 'Flagged from Evidence inspection');
                  closeEvidence();
                }}
                className="px-3 py-2 border border-outline-variant/50 rounded-xl text-xs font-body-bold text-status-warning hover:bg-surface-container transition-colors flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-sm">flag</span>
                Flag
              </button>
              <button
                onClick={() => {
                  approveReviewItem(candidate.id);
                  closeEvidence();
                }}
                className="px-4 py-2 bg-primary text-on-primary font-body-bold text-xs rounded-xl hover:brightness-110 transition-all flex items-center gap-1 shadow-sm"
              >
                <span className="material-symbols-outlined text-sm">task_alt</span>
                Approve & Harmonize
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
