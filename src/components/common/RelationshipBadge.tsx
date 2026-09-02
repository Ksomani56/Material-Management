import React from 'react';
import { RelationshipType } from '../../types/material';

interface Props {
  type: RelationshipType;
  showIcon?: boolean;
  size?: 'sm' | 'md';
}

export const RelationshipBadge: React.FC<Props> = ({ type, showIcon = true, size = 'sm' }) => {
  switch (type) {
    case 'IDENTICAL':
      return (
        <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded border border-relationship-identical/30 bg-relationship-identical/10 text-relationship-identical ${size === 'sm' ? 'text-[11px]' : 'text-xs'}`}>
          {showIcon && <span className="material-symbols-outlined text-[13px] fill-icon">check_circle</span>}
          <span className="font-label-caps uppercase tracking-wider font-bold">IDENTICAL</span>
        </div>
      );
    case 'DUPLICATE':
      return (
        <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded border border-relationship-duplicate/30 bg-relationship-duplicate/10 text-relationship-duplicate ${size === 'sm' ? 'text-[11px]' : 'text-xs'}`}>
          {showIcon && <span className="material-symbols-outlined text-[13px] fill-icon">content_copy</span>}
          <span className="font-label-caps uppercase tracking-wider font-bold">DUPLICATE</span>
        </div>
      );
    case 'NEAR-DUPLICATE':
      return (
        <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded border border-relationship-near/30 bg-relationship-near/10 text-relationship-near ${size === 'sm' ? 'text-[11px]' : 'text-xs'}`}>
          {showIcon && <span className="material-symbols-outlined text-[13px] fill-icon">warning</span>}
          <span className="font-label-caps uppercase tracking-wider font-bold">NEAR-DUP</span>
        </div>
      );
    case 'FUNCTIONALLY EQUIVALENT':
      return (
        <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded border border-purple-500/30 bg-purple-500/10 text-purple-400 ${size === 'sm' ? 'text-[11px]' : 'text-xs'}`}>
          {showIcon && <span className="material-symbols-outlined text-[13px] fill-icon">swap_horiz</span>}
          <span className="font-label-caps uppercase tracking-wider font-bold">FUNC EQUIV</span>
        </div>
      );
    default:
      return (
        <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded border border-outline-variant/30 bg-surface-container text-on-surface-variant text-[11px]">
          {showIcon && <span className="material-symbols-outlined text-[13px]">link</span>}
          <span className="font-label-caps uppercase tracking-wider font-bold">{type}</span>
        </div>
      );
  }
};
