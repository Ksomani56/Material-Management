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
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-status-success/10 text-status-success font-medium ${size === 'sm' ? 'text-[11px]' : 'text-xs'}`}>
          {showIcon && <span className="material-symbols-outlined text-[12px]">check_circle</span>}
          <span>Identical</span>
        </span>
      );
    case 'DUPLICATE':
      return (
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-relationship-duplicate/10 text-relationship-duplicate font-medium ${size === 'sm' ? 'text-[11px]' : 'text-xs'}`}>
          {showIcon && <span className="material-symbols-outlined text-[12px]">content_copy</span>}
          <span>Duplicate</span>
        </span>
      );
    case 'NEAR-DUPLICATE':
      return (
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-relationship-near/10 text-relationship-near font-medium ${size === 'sm' ? 'text-[11px]' : 'text-xs'}`}>
          {showIcon && <span className="material-symbols-outlined text-[12px]">compare_arrows</span>}
          <span>Near Duplicate</span>
        </span>
      );
    case 'FUNCTIONALLY EQUIVALENT':
      return (
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-purple-500/10 text-purple-400 font-medium ${size === 'sm' ? 'text-[11px]' : 'text-xs'}`}>
          {showIcon && <span className="material-symbols-outlined text-[12px]">swap_horiz</span>}
          <span>Func Equiv</span>
        </span>
      );
    default:
      return (
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-surface-container-high text-on-surface-variant font-medium ${size === 'sm' ? 'text-[11px]' : 'text-xs'}`}>
          {showIcon && <span className="material-symbols-outlined text-[12px]">link</span>}
          <span>{type}</span>
        </span>
      );
  }
};
