import React from 'react';
import { HarmonizationStatus } from '../../types/material';

interface Props {
  status: HarmonizationStatus | 'Active' | 'Under Review' | 'Deprecated' | 'Approved' | 'Retired' | string;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<Props> = ({ status, size = 'sm' }) => {
  switch (status) {
    case 'Harmonized':
    case 'Active':
    case 'Approved':
      return (
        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-status-success/10 text-status-success font-medium ${size === 'sm' ? 'text-[11px]' : 'text-xs'}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-status-success shrink-0" />
          {status}
        </span>
      );
    case 'Pending Review':
    case 'Under Review':
      return (
        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-status-warning/10 text-status-warning font-medium ${size === 'sm' ? 'text-[11px]' : 'text-xs'}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-status-warning shrink-0" />
          {status}
        </span>
      );
    case 'Archived':
    case 'Deprecated':
    case 'Retired':
      return (
        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-surface-container-highest text-on-surface-variant font-medium ${size === 'sm' ? 'text-[11px]' : 'text-xs'}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-outline shrink-0" />
          {status}
        </span>
      );
    case 'Flagged':
      return (
        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-status-error/10 text-status-error font-medium ${size === 'sm' ? 'text-[11px]' : 'text-xs'}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-status-error shrink-0" />
          Flagged
        </span>
      );
    default:
      return (
        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-surface-container-high text-on-surface-variant font-medium ${size === 'sm' ? 'text-[11px]' : 'text-xs'}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-outline shrink-0" />
          {status}
        </span>
      );
  }
};
