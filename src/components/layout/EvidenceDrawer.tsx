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
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end bg-black/50 backdrop-blur-[2px] transition-opacity duration-200">
      <div 
        className="w-full max-w-[620px] bg-surface h-full shadow-xl border-l border-outline-variant/60 flex flex-col transition-transform duration-250 ease-out"
      >
        {/* Drawer Header */}
        <div className="px-5 py-4 border-b border-outline-variant/60 bg-surface-container flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-primary text-[20px]">fact_check</span>
            <div>
              <h2 className="text-xs font-semibold text-on-surface leading-tight">
                Traceability & Harmonization Evidence
              </h2>
              <p className="font-mono text-[11px] text-on-surface-variant truncate max-w-[420px] mt-0.5">
                {title}
              </p>
            </div>
          </div>
          <button
            onClick={closeEvidence}
            className="w-7 h-7 rounded-md flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Drawer Body (Scrollable) */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* Top Score Banner */}
          <div className="bg-surface-container p-4 rounded-xl border border-outline-variant/60 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-on-surface-variant uppercase font-medium">
                Recommendation Confidence
              </span>
              <div className="flex items-center gap-2.5 mt-1">
                <span className="font-mono text-2xl font-bold text-primary">
                  {candidate ? `${candidate.confidence}%` : `${canonical?.confidenceScore}%`}
                </span>
                {candidate && <RelationshipBadge type={candidate.relationship} size="sm" />}
              </div>
            </div>
            <div className="text-right font-mono text-xs text-on-surface-variant space-y-0.5">
              <div>Semantic Agreement: <strong className="text-on-surface font-semibold">97.8%</strong></div>
              <div>Attribute Parity: <strong className="text-on-surface font-semibold">98.5%</strong></div>
            </div>
          </div>

          {/* Explainable AI Rationale */}
          <div className="bg-surface-container p-4 rounded-xl border border-outline-variant/60">
            <h3 className="text-xs text-on-surface uppercase flex items-center gap-1.5 mb-2 font-semibold">
              <span className="material-symbols-outlined text-[15px] text-primary">description</span>
              Matching Rationale & Standardization Logic
            </h3>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              {candidate?.explanation || 'Canonical record synthesized through multi-CPSE attribute normalization pipeline. Verified against national engineering standards.'}
            </p>
            {candidate?.conflicts && (
              <div className="mt-3 p-2.5 bg-surface-container-low rounded-lg border border-status-warning/30 flex items-start gap-2">
                <span className="material-symbols-outlined text-status-warning text-sm mt-0.5 shrink-0">warning</span>
                <div className="text-xs">
                  <span className="font-semibold text-status-warning">Conflict Flag: </span>
                  <span className="text-on-surface-variant">{candidate.conflicts}</span>
                </div>
              </div>
            )}
          </div>

          {/* Side-by-Side Attribute Comparison Table */}
          <div className="border border-outline-variant/60 rounded-xl overflow-hidden">
            <div className="bg-surface-container-high px-4 py-2.5 border-b border-outline-variant/60 flex justify-between items-center">
              <h3 className="text-xs text-on-surface uppercase font-semibold">
                Side-by-Side Technical Comparison
              </h3>
              <span className="font-mono text-[10px] text-primary font-semibold">Source vs National Standard</span>
            </div>

            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-surface-container text-on-surface-variant font-medium text-[11px] border-b border-outline-variant/40">
                <tr>
                  <th className="p-3">Attribute</th>
                  <th className="p-3">Source Item Value</th>
                  <th className="p-3">CNMC Standard Value</th>
                  <th className="p-3 text-center">Parity</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/30 font-mono text-[11px]">
                <tr className="hover:bg-surface-container-high/40 transition-colors">
                  <td className="p-3 text-on-surface font-medium font-sans">Item Type</td>
                  <td className="p-3 text-on-surface-variant">Hex Bolt</td>
                  <td className="p-3 text-primary font-semibold">Bolt, Hexagon</td>
                  <td className="p-3 text-center text-status-success font-medium">Match</td>
                </tr>
                <tr className="hover:bg-surface-container-high/40 transition-colors">
                  <td className="p-3 text-on-surface font-medium font-sans">Material Grade</td>
                  <td className="p-3 text-on-surface-variant">SS304</td>
                  <td className="p-3 text-primary font-semibold">Stainless Steel 304</td>
                  <td className="p-3 text-center text-status-success font-medium">Match</td>
                </tr>
                <tr className="hover:bg-surface-container-high/40 transition-colors">
                  <td className="p-3 text-on-surface font-medium font-sans">Thread / Size</td>
                  <td className="p-3 text-on-surface-variant">M10 x 50</td>
                  <td className="p-3 text-primary font-semibold">M10 x 50mm</td>
                  <td className="p-3 text-center text-status-success font-medium">Match</td>
                </tr>
                <tr className="hover:bg-surface-container-high/40 transition-colors">
                  <td className="p-3 text-on-surface font-medium font-sans">Standard Spec</td>
                  <td className="p-3 text-on-surface-variant">DIN 933</td>
                  <td className="p-3 text-primary font-semibold">ISO 4017 / DIN 933</td>
                  <td className="p-3 text-center text-status-warning font-medium">Review</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Audit Verification Trail */}
          <div className="p-4 bg-surface-container rounded-xl border border-outline-variant/60 space-y-3">
            <h3 className="text-xs text-on-surface uppercase font-semibold flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[15px] text-primary">verified</span>
              Traceability & Verification Metadata
            </h3>
            <div className="grid grid-cols-2 gap-3 text-xs font-mono">
              <div className="p-2.5 bg-surface-container-low rounded-lg border border-outline-variant/40">
                <span className="text-on-surface-variant text-[10px] uppercase block font-sans">Model Engine</span>
                <span className="text-on-surface font-medium">Technical-RoBERTa v4.2</span>
              </div>
              <div className="p-2.5 bg-surface-container-low rounded-lg border border-outline-variant/40">
                <span className="text-on-surface-variant text-[10px] uppercase block font-sans">Timestamp</span>
                <span className="text-on-surface font-medium">2026-09-02 14:22 UTC</span>
              </div>
              <div className="p-2.5 bg-surface-container-low rounded-lg border border-outline-variant/40">
                <span className="text-on-surface-variant text-[10px] uppercase block font-sans">Hash Signature</span>
                <span className="text-on-surface font-medium truncate block">SHA256: 7d9a...4821</span>
              </div>
              <div className="p-2.5 bg-surface-container-low rounded-lg border border-outline-variant/40">
                <span className="text-on-surface-variant text-[10px] uppercase block font-sans">Steward Authority</span>
                <span className="text-on-surface font-medium">MoPNG Master Committee</span>
              </div>
            </div>
          </div>
        </div>

        {/* Drawer Footer Actions */}
        {candidate && (
          <div className="p-4 border-t border-outline-variant/60 bg-surface-container flex items-center justify-between shrink-0">
            <button
              onClick={() => {
                flagReviewItem(candidate.id, 'Steward requested parameter reconciliation');
                closeEvidence();
              }}
              className="px-3.5 py-2 border border-outline-variant/60 text-status-warning rounded-lg text-xs font-medium hover:bg-surface-container-high transition-colors flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[16px]">flag</span>
              Flag for Committee
            </button>
            <button
              onClick={() => {
                approveReviewItem(candidate.id);
                closeEvidence();
              }}
              className="px-4 py-2 bg-primary text-on-primary rounded-lg text-xs font-semibold hover:brightness-110 transition-all flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[16px]">check</span>
              Approve Harmonization
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
