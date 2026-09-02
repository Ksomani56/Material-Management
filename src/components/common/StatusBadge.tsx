import React from 'react';
import { HarmonizationStatus } from '../../types/material';

interface Props {
  status: HarmonizationStatus | 'Active' | 'Under Review' | 'Deprecated';
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<Props> = ({ status, size = 'sm' }) => {
  switch (status) {
    case 'Harmonized':
    case 'Active':
      return (
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-status-success/10 border border-status-success/20 text-status-success font-label-caps font-bold uppercase tracking-wider ${size === 'sm' ? 'text-[10px]' : 'text-xs'}`}>
          <span className="material-symbols-outlined text-[12px] fill-icon">check_circle</span>
          {status}
        </span>
      );
    case 'Pending Review':
    case 'Under Review':
      return (
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-status-warning/10 border border-status-warning/20 text-status-warning font-label-caps font-bold uppercase tracking-wider ${size === 'sm' ? 'text-[10px]' : 'text-xs'}`}>
          <span className="material-symbols-outlined text-[12px] fill-icon">pending</span>
          {status}
        </span>
      );
    case 'Archived':
    case 'Deprecated':
      return (
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-outline-variant/30 border border-outline-variant text-on-surface-variant font-label-caps font-bold uppercase tracking-wider ${size === 'sm' ? 'text-[10px]' : 'text-xs'}`}>
          <span className="material-symbols-outlined text-[12px]">archive</span>
          {status}
        </span>
      );
    case 'Flagged':
      return (
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-status-error/10 border border-status-error/20 text-status-error font-label-caps font-bold uppercase tracking-wider ${size === 'sm' ? 'text-[10px]' : 'text-xs'}`}>
          <span className="material-symbols-outlined text-[12px] fill-icon">flag</span>
          Flagged
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-surface-container-high text-on-surface-variant font-label-caps text-[10px]">
          {status}
        </span>
      );
  }
};
