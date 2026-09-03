import React from 'react';
import { useApp } from '../../context/AppContext';

export const ImpactModal: React.FC = () => {
  const { impactModal, closeImpactModal } = useApp();

  if (!impactModal.isOpen) return null;

  const isDestructive = impactModal.action === 'MERGE' || impactModal.action === 'RETIRE' || impactModal.action === 'SPLIT';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-black/50 backdrop-blur-[2px] transition-opacity duration-150">
      <div className="bg-surface border border-outline-variant/60 rounded-xl max-w-lg w-full overflow-hidden shadow-xl transition-all">
        {/* Header */}
        <div className={`p-4 border-b border-outline-variant/50 flex items-center justify-between ${
          isDestructive ? 'bg-status-error/10 text-status-error' : 'bg-surface-container text-on-surface'
        }`}>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px]">
              {isDestructive ? 'warning' : 'info'}
            </span>
            <h3 className="text-xs font-semibold text-on-surface">
              {impactModal.title}
            </h3>
          </div>
          <button
            onClick={closeImpactModal}
            className="w-7 h-7 rounded-md flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors"
          >
            <span className="material-symbols-outlined text-[17px]">close</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          <p className="text-xs text-on-surface leading-relaxed">
            You are about to execute action <strong className="text-primary font-mono">{impactModal.action}</strong> on source material record:
          </p>

          <div className="p-3 bg-surface-container rounded-lg border border-outline-variant/60 font-mono text-xs text-on-surface">
            <div>{impactModal.sourceCode}</div>
            {impactModal.targetCnmc && (
              <div className="text-primary mt-1 font-semibold flex items-center gap-1">
                <span>➔</span> Target Canonical: {impactModal.targetCnmc}
              </div>
            )}
          </div>

          {/* Staged Impact Preview */}
          <div className="bg-surface-container p-4 rounded-lg border border-outline-variant/60 space-y-2.5">
            <h4 className="text-[11px] text-on-surface uppercase font-semibold flex items-center gap-1.5">
              <span className="material-symbols-outlined text-sm text-status-warning">hub</span>
              Downstream Operational Impact Preview
            </h4>
            <ul className="space-y-1.5 text-xs text-on-surface-variant">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-status-success shrink-0" />
                <span>Impacts <strong className="text-on-surface font-mono">{impactModal.impactedCount || 4} CPSE ERP systems</strong> (SAP, Oracle, Maximo).</span>
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
        <div className="p-4 border-t border-outline-variant/50 bg-surface-container flex justify-end gap-2.5">
          <button
            onClick={closeImpactModal}
            className="px-3.5 py-1.5 border border-outline-variant/60 rounded-lg text-xs font-medium text-on-surface hover:bg-surface-container-high transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              impactModal.onConfirm();
              closeImpactModal();
            }}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              isDestructive
                ? 'bg-status-error text-white hover:brightness-110'
                : 'bg-primary text-on-primary hover:brightness-110'
            }`}
          >
            <span className="material-symbols-outlined text-[15px]">check</span>
            Confirm & Execute {impactModal.action}
          </button>
        </div>
      </div>
    </div>
  );
};
