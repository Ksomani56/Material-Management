import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

export const HarmonizationScreen: React.FC = () => {
  const { 
    currentTask, 
    tasksQueue, 
    currentTaskIndex, 
    commitHarmonization, 
    skipHarmonization, 
    flagHarmonization, 
    openEvidence 
  } = useApp();

  const [notification, setNotification] = useState<string | null>(null);

  const handleCommit = () => {
    commitHarmonization();
    setNotification('Successfully harmonized and committed to National Material Master!');
    setTimeout(() => setNotification(null), 3000);
  };

  const handleSkip = () => {
    skipHarmonization();
    setNotification('Skipped to next item in queue.');
    setTimeout(() => setNotification(null), 2000);
  };

  const handleFlag = () => {
    flagHarmonization();
    setNotification('Flagged for technical governance committee review.');
    setTimeout(() => setNotification(null), 3000);
  };

  // Safe attribute extraction
  const sourceSpecs = currentTask?.source?.extractedSpecs || {};
  const normalizedSpecs = currentTask?.aiAnalysis?.normalizedMapping || {
    noun: 'Standard Item',
    modifier: 'Industrial Spec',
    size: 'Standard Size',
    material: 'Standard Material'
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-background transition-colors duration-200">
      {/* Workspace Controls Header */}
      <div className="px-margin-page py-3 bg-surface-container border-b border-outline-variant/40 flex items-center justify-between shrink-0 shadow-sm">
        <div className="flex items-center space-x-4">
          <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">
            Current Task:
          </span>
          <span className="font-data-mono text-data-mono text-primary bg-primary/10 px-2.5 py-1 rounded-lg border border-primary/30 font-semibold">
            {currentTask.taskId}
          </span>
          <div className="h-4 w-px bg-outline-variant" />
          <span className="font-body-standard text-on-surface text-xs">
            Queue: <strong>{currentTask.queueName}</strong> ({currentTaskIndex + 1}/{tasksQueue.length} loaded, {currentTask.remainingCount} remaining)
          </span>
        </div>
        
        <div className="flex space-x-2 items-center">
          {notification && (
            <span className="px-3 py-1 bg-primary/10 border border-primary/30 text-primary text-xs rounded-lg font-data-mono flex items-center animate-in fade-in">
              <span className="material-symbols-outlined text-sm mr-1">check</span> {notification}
            </span>
          )}
          <button 
            onClick={handleSkip}
            className="px-3 py-1.5 border border-outline-variant/50 text-on-surface font-body-standard rounded-xl hover:bg-surface-container-high transition flex items-center text-xs"
          >
            <span className="material-symbols-outlined mr-1 text-[16px]">redo</span>
            Skip
          </button>
          <button 
            onClick={handleFlag}
            className="px-3 py-1.5 border border-outline-variant/50 text-status-warning font-body-standard rounded-xl hover:bg-surface-container-high transition flex items-center text-xs"
          >
            <span className="material-symbols-outlined mr-1 text-[16px]">flag</span>
            Flag Discrepancy
          </button>
          <button 
            onClick={handleCommit}
            className="px-4 py-1.5 bg-primary text-on-primary font-body-bold rounded-xl hover:brightness-110 transition flex items-center text-xs shadow-sm"
          >
            <span className="material-symbols-outlined mr-1 text-[16px]">check</span>
            Commit Harmonization
          </button>
        </div>
      </div>

      {/* 3-Column Tri-Pane Workspace */}
      <div className="flex-1 flex overflow-hidden p-margin-page gap-4">
        {/* Pane 1: Source CPSE Material (25% Width) */}
        <div className="w-1/4 bg-surface-container rounded-2xl border border-outline-variant/40 flex flex-col overflow-hidden shrink-0 shadow-sm">
          <div className="p-3 border-b border-outline-variant/30 bg-surface-container-high/50 flex justify-between items-center">
            <h3 className="font-table-header text-table-header text-on-surface uppercase tracking-wide">
              Source Record
            </h3>
            <span className="px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant font-data-mono text-[10px] border border-outline-variant/40">
              {currentTask.source.cpse}
            </span>
          </div>

          <div className="p-4 flex-1 overflow-y-auto space-y-4">
            <div>
              <label className="font-label-caps text-label-caps text-on-surface-variant uppercase block mb-1">
                Local Material Code
              </label>
              <div className="font-data-mono text-sm text-primary font-semibold p-2.5 bg-surface-container-low rounded-xl border border-outline-variant/40">
                {currentTask.source.localCode}
              </div>
            </div>

            <div>
              <label className="font-label-caps text-label-caps text-on-surface-variant uppercase block mb-1">
                Raw Description (Legacy ERP)
              </label>
              <div className="font-body-standard text-xs text-on-surface p-3 bg-surface-container-low rounded-xl border border-outline-variant/40 leading-relaxed">
                {currentTask.source.rawDescription}
              </div>
            </div>

            <div className="pt-2 border-t border-outline-variant/30">
              <label className="font-label-caps text-label-caps text-on-surface-variant uppercase block mb-2">
                Parsed Technical Attributes
              </label>
              <div className="space-y-1.5 font-data-mono text-xs">
                {Object.entries(sourceSpecs).map(([key, value]) => (
                  <div key={key} className="flex justify-between py-1 px-2 rounded-lg hover:bg-surface-container-high/50">
                    <span className="text-on-surface-variant capitalize">{key}:</span>
                    <span className="text-on-surface font-medium">{String(value)}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2 border-t border-outline-variant/30">
              <label className="font-label-caps text-label-caps text-on-surface-variant uppercase block mb-1">
                Source System Metadata
              </label>
              <div className="text-[11px] font-data-mono text-on-surface-variant space-y-1">
                <div>UOM: <span className="text-on-surface font-bold">{currentTask.source.uom}</span></div>
                <div>Origin: <span className="text-on-surface">{currentTask.source.cpse}</span></div>
                <div>Pipeline: <span className="text-on-surface">Auto-Harmonizer v4.2</span></div>
              </div>
            </div>
          </div>
        </div>

        {/* Pane 2: Proposed Canonical Master (Center - 40% Width) */}
        <div className="flex-1 bg-surface-container rounded-2xl border border-primary/40 flex flex-col overflow-hidden shadow-md relative">
          <div className="p-3 border-b border-outline-variant/30 bg-primary/10 flex justify-between items-center">
            <h3 className="font-table-header text-table-header text-primary uppercase tracking-wide flex items-center gap-1.5">
              <span className="material-symbols-outlined text-sm">auto_awesome</span>
              Proposed National CNMC Match
            </h3>
            <span className="px-2 py-0.5 rounded-full bg-primary/20 text-primary font-data-mono text-[10px] font-bold">
              {currentTask.candidate.matchType}
            </span>
          </div>

          <div className="p-5 flex-1 overflow-y-auto space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <label className="font-label-caps text-label-caps text-on-surface-variant uppercase block mb-1">
                  Canonical Code (CNMC)
                </label>
                <div className="font-display-cnmc text-xl text-primary font-bold">
                  {currentTask.candidate.proposedCnmc}
                </div>
              </div>

              <div className="text-right">
                <span className="font-label-caps text-label-caps text-on-surface-variant uppercase block mb-1">
                  Match Score
                </span>
                <span className="font-display-cnmc text-2xl font-bold text-status-success">
                  {currentTask.aiAnalysis.confidence}%
                </span>
              </div>
            </div>

            <div>
              <label className="font-label-caps text-label-caps text-on-surface-variant uppercase block mb-1">
                Standard Canonical Description
              </label>
              <div className="font-body-standard text-xs text-on-surface p-3 bg-surface-container-low rounded-xl border border-outline-variant/40 leading-relaxed font-semibold">
                {currentTask.candidate.canonicalDescription}
              </div>
            </div>

            {/* Normalized Comparison Specs */}
            <div className="space-y-2">
              <label className="font-label-caps text-label-caps text-on-surface-variant uppercase block">
                Standardized Specifications Alignment
              </label>
              <div className="border border-outline-variant/40 rounded-xl overflow-hidden">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-surface-container-high text-on-surface-variant font-table-header text-[10px]">
                    <tr>
                      <th className="p-2">Attribute</th>
                      <th className="p-2">Standardized Value</th>
                      <th className="p-2 text-center">Parity</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/20 font-data-mono text-[11px]">
                    {Object.entries(normalizedSpecs).map(([key, val]) => (
                      <tr key={key} className="hover:bg-surface-container-low">
                        <td className="p-2 text-on-surface-variant capitalize">{key}</td>
                        <td className="p-2 text-on-surface font-medium">{String(val)}</td>
                        <td className="p-2 text-center text-status-success">
                          <span className="material-symbols-outlined text-xs fill-icon">check_circle</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* AI Explanation Box */}
            <div className="p-3.5 bg-surface-container-low rounded-xl border border-outline-variant/30 space-y-1">
              <span className="font-label-caps text-[10px] text-primary uppercase flex items-center gap-1 font-bold">
                <span className="material-symbols-outlined text-xs">psychology</span>
                Explainable AI Rationale
              </span>
              <ul className="text-xs text-on-surface-variant space-y-1 list-disc pl-4">
                {currentTask.aiAnalysis.evidenceNotes.map((note, idx) => (
                  <li key={idx}>{note}</li>
                ))}
              </ul>
              {currentTask.aiAnalysis.conflict && (
                <div className="mt-2 p-2 rounded bg-status-warning/10 border border-status-warning/30 text-xs text-status-warning">
                  <strong>{currentTask.aiAnalysis.conflict.title}:</strong> {currentTask.aiAnalysis.conflict.description}
                </div>
              )}
            </div>
          </div>

          <div className="p-3 border-t border-outline-variant/30 bg-surface-container-high/50 flex justify-between items-center">
            <button 
              onClick={() => openEvidence({
                id: currentTask.taskId,
                priority: 'HIGH',
                sourceCpse: currentTask.source.cpse,
                sourceCode: currentTask.source.localCode,
                sourceDescription: currentTask.source.rawDescription,
                candidateCnmc: currentTask.candidate.proposedCnmc,
                candidateDescription: currentTask.candidate.canonicalDescription,
                relationship: 'IDENTICAL',
                confidence: currentTask.aiAnalysis.confidence,
                age: '1h',
                status: 'PENDING',
                attributeAgreement: currentTask.aiAnalysis.confidence,
                sourceAttributes: {},
                candidateAttributes: {},
                explanation: currentTask.aiAnalysis.evidenceNotes.join(' ')
              })}
              className="text-xs text-primary font-body-bold hover:underline flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-sm">visibility</span>
              View Full Evidence Trail
            </button>
            <span className="text-[10px] font-data-mono text-on-surface-variant">
              Taxonomy Model: Multi-Transformer v4.2
            </span>
          </div>
        </div>

        {/* Pane 3: Existing CPSE Mappings & Equivalents (35% Width) */}
        <div className="w-[35%] bg-surface-container rounded-2xl border border-outline-variant/40 flex flex-col overflow-hidden shrink-0 shadow-sm">
          <div className="p-3 border-b border-outline-variant/30 bg-surface-container-high/50 flex justify-between items-center">
            <h3 className="font-table-header text-table-header text-on-surface uppercase tracking-wide">
              Cross-CPSE Entity Network
            </h3>
            <span className="font-data-mono text-[10px] text-on-surface-variant">
              {currentTask.candidate.mappingImpact.linkedCpseCodesCount} Linked Codes
            </span>
          </div>

          <div className="p-4 flex-1 overflow-y-auto space-y-3">
            <p className="text-xs text-on-surface-variant">
              Harmonizing this record will establish unified cross-referencing with these existing CPSE local codes:
            </p>

            <div className="space-y-2">
              {currentTask.candidate.mappingImpact.sampleCodes.map((code, idx) => (
                <div 
                  key={idx}
                  className="p-3 bg-surface-container-low rounded-xl border border-outline-variant/40 hover:border-primary/40 transition-colors"
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-data-mono text-xs text-primary font-semibold">{code}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-surface-container text-on-surface font-data-mono border border-outline-variant/30">
                      Harmonized
                    </span>
                  </div>
                  <p className="font-body-standard text-xs text-on-surface-variant truncate">
                    {currentTask.candidate.canonicalDescription}
                  </p>
                  <div className="flex justify-between items-center mt-2 text-[10px] font-data-mono text-on-surface-variant">
                    <span>UOM: {currentTask.source.uom}</span>
                    <span className="text-relationship-identical flex items-center gap-0.5 font-semibold">
                      <span className="material-symbols-outlined text-[12px] fill-icon">link</span>
                      IDENTICAL
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-outline-variant/30">
              <h4 className="font-label-caps text-label-caps text-on-surface-variant uppercase mb-2">
                Downstream CPSE Migration Impact
              </h4>
              <ul className="space-y-1 text-xs text-on-surface-variant font-data-mono">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-status-success" />
                  <span>ONGC SAP S/4HANA: Ready for alias write-back</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-status-success" />
                  <span>IOCL Oracle Cloud: Synchronized mapping</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
