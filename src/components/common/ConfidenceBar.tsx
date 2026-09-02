import React from 'react';

interface Props {
  confidence: number;
  showBar?: boolean;
}

export const ConfidenceBar: React.FC<Props> = ({ confidence, showBar = true }) => {
  const getBarColor = (score: number) => {
    if (score >= 90) return 'bg-status-success';
    if (score >= 80) return 'bg-relationship-duplicate';
    if (score >= 70) return 'bg-status-warning';
    return 'bg-status-error';
  };

  const getTextColor = (score: number) => {
    if (score >= 90) return 'text-status-success';
    if (score >= 80) return 'text-relationship-duplicate';
    if (score >= 70) return 'text-status-warning';
    return 'text-status-error';
  };

  return (
    <div className="flex items-center gap-2">
      <span className={`font-data-mono text-data-mono font-medium ${getTextColor(confidence)}`}>
        {confidence}%
      </span>
      {showBar && (
        <div className="w-16 h-1.5 bg-surface-container-highest rounded-full overflow-hidden">
          <div 
            className={`h-full ${getBarColor(confidence)} transition-all duration-300`} 
            style={{ width: `${Math.min(100, Math.max(0, confidence))}%` }}
          />
        </div>
      )}
    </div>
  );
};
