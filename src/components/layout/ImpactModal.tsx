import React from 'react';
import { useApp } from '../../context/AppContext';

export const ImpactModal: React.FC = () => {
  const { impactModal, closeImpactModal } = useApp();

  if (!impactModal.isOpen) return null;

  const isDestructive = impactModal.action === 'MERGE' || impactModal.action === 'RETIRE' || impactModal.action === 'SPLIT';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-surface-container border border-outline-variant/50 rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl">
        {/* Header */}
        <div className={`p-4 border-b border-outline-variant/40 flex items-center justify-between ${
          isDestructive ? 'bg-status-error/15 text-status-error' : 'bg-surface-container-high text-on-surface'
        }`}>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[22px]">
              {isDestructive ? 'warning' : 'info'}
            </span>
            <h3 className="font-headline-section text-sm font-bold text-on-surface">
              {impactModal.title}
            </h3>
          </div>
          <button
            onClick={closeImpactModal}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:bg-surface-container-highest transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <p className="text-xs text-on-surface leading-relaxed">
            You are about to execute action <strong className="text-primary font-data-mono">{impactModal.action}</strong> on source material record:
          </p>

          <div className="p-3.5 bg-surface-container-low rounded-xl border border-outline-variant/40 font-data-mono text-xs text-on-surface">
            {impactModal.sourceCode}
            {impactModal.targetCnmc && (
              <span className="text-primary block mt-1 font-semibold">
                ➔ Target Canonical: {impactModal.targetCnmc}
              </span>
            )}
          </div>

          {/* Impact Warning Card */}
          <div className="bg-surface-container-low p-4 rounded-xl border border-outline-variant/40 space-y-2">
            <h4 className="font-table-header text-xs text-on-surface uppercase font-semibold flex items-center gap-1.5">
              <span className="material-symbols-outlined text-sm text-relationship-near">hub</span>
              Downstream Operational Impact Preview
            </h4>
            <ul className="space-y-1.5 text-xs text-on-surface-variant font-body-standard">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-relationship-identical shrink-0" />
                <span>Impacts <strong className="text-on-surface font-data-mono">{impactModal.impactedCount || 4} CPSE ERP systems</strong> (SAP, Oracle, Maximo).</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-relationship-duplicate shrink-0" />
                <span>Creates forward-traceable alias pointers to prevent procurement interruption.</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-status-warning shrink-0" />
                <span>Generates signed immutable audit trail record under MoPNG National Governance.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer actions */}
        <div className="p-4 border-t border-outline-variant/40 bg-surface-container-high flex justify-end gap-3">
          <button
            onClick={closeImpactModal}
            className="px-4 py-2 border border-outline-variant/50 rounded-xl text-xs font-body-bold text-on-surface hover:bg-surface-container transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              impactModal.onConfirm();
              closeImpactModal();
            }}
            className={`px-4 py-2 rounded-xl text-xs font-body-bold transition-all shadow-sm flex items-center gap-1.5 ${
              isDestructive
                ? 'bg-status-error text-white hover:brightness-110'
                : 'bg-primary text-on-primary hover:brightness-110'
            }`}
          >
            <span className="material-symbols-outlined text-sm">check</span>
            Confirm & Execute {impactModal.action}
          </button>
        </div>
      </div>
    </div>
  );
};
