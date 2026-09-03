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
    setNotification('Approved match and linked to National Material Master.');
    setTimeout(() => setNotification(null), 3000);
  };

  const handleSkip = () => {
    skipHarmonization();
    setNotification('Skipped to next item.');
    setTimeout(() => setNotification(null), 2000);
  };

  const handleFlag = () => {
    flagHarmonization();
    setNotification('Flagged for technical review committee.');
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

  // Build Attribute comparison table rows
  const comparisonRows = [
    { 
      attribute: 'Material Type', 
      sourceVal: sourceSpecs.type || 'Hex Bolt', 
      cnmcVal: normalizedSpecs.noun || 'Bolt, Hexagon', 
      parity: 'match' 
    },
    { 
      attribute: 'Material Grade', 
      sourceVal: sourceSpecs.material || 'SS304', 
      cnmcVal: normalizedSpecs.material || 'Stainless Steel 304', 
      parity: 'match' 
    },
    { 
      attribute: 'Dimensions / Size', 
      sourceVal: sourceSpecs.size || 'M10 x 50', 
      cnmcVal: normalizedSpecs.size || 'M10 x 50mm', 
      parity: 'match' 
    },
    { 
      attribute: 'Standard / Spec', 
      sourceVal: sourceSpecs.standard || 'DIN 933', 
      cnmcVal: 'ISO 4017 / DIN 933 Equivalent', 
      parity: currentTask.aiAnalysis.conflict ? 'review' : 'match' 
    },
    { 
      attribute: 'Unit of Measure', 
      sourceVal: currentTask.source.uom || 'NOS', 
      cnmcVal: currentTask.source.uom || 'NOS', 
      parity: 'match' 
    }
  ];

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-background">
      {/* Workspace Controls Header */}
      <div className="px-6 py-3 bg-surface border-b border-outline-variant/60 flex items-center justify-between shrink-0">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-sm font-bold text-on-surface">
              Material Harmonization Workbench
            </h1>
            <span className="font-mono text-xs text-primary bg-primary/10 px-2 py-0.5 rounded font-medium">
              Task {currentTask.taskId}
            </span>
          </div>
          <p className="text-[11px] text-on-surface-variant mt-0.5">
            Review the source item and approve or adjust the recommended National Material Code (CNMC).
          </p>
        </div>
        
        <div className="flex space-x-2 items-center">
          {notification && (
            <span className="px-3 py-1 bg-primary/10 border border-primary/30 text-primary text-xs rounded-md font-mono flex items-center">
              <span className="material-symbols-outlined text-sm mr-1">check</span> {notification}
            </span>
          )}
          <button 
            onClick={handleSkip}
            className="px-3 py-1.5 border border-outline-variant/60 text-on-surface font-medium rounded-lg hover:bg-surface-container transition-colors flex items-center text-xs"
          >
            <span className="material-symbols-outlined mr-1 text-[15px]">redo</span>
            Skip
          </button>
          <button 
            onClick={handleFlag}
            className="px-3 py-1.5 border border-outline-variant/60 text-status-warning font-medium rounded-lg hover:bg-surface-container transition-colors flex items-center text-xs"
          >
            <span className="material-symbols-outlined mr-1 text-[15px]">flag</span>
            Reject / Flag
          </button>
          <button 
            onClick={handleCommit}
            className="px-4 py-1.5 bg-primary text-on-primary font-semibold rounded-lg hover:brightness-110 transition-all flex items-center text-xs shadow-xs"
          >
            <span className="material-symbols-outlined mr-1 text-[15px]">check</span>
            Approve Match
          </button>
        </div>
      </div>

      {/* 3-Column Tri-Pane Workspace */}
      <div className="flex-1 flex overflow-hidden p-6 gap-4">
        {/* Pane 1: Source CPSE Material (28% Width) */}
        <div className="w-[28%] bg-surface-container rounded-xl border border-outline-variant/60 flex flex-col overflow-hidden shrink-0">
          <div className="p-3.5 border-b border-outline-variant/50 bg-surface-container flex justify-between items-center">
            <div>
              <h3 className="text-xs font-semibold text-on-surface uppercase">
                1. Source Record
              </h3>
              <p className="text-[10px] text-on-surface-variant">Incoming legacy ERP catalog data</p>
            </div>
            <span className="px-2 py-0.5 rounded bg-surface-container-high text-on-surface-variant font-mono text-[10px] font-medium">
              {currentTask.source.cpse}
            </span>
          </div>

          <div className="p-4 flex-1 overflow-y-auto space-y-4">
            <div>
              <label className="text-[10px] text-on-surface-variant uppercase font-medium block mb-1">
                Local ERP Code
              </label>
              <div className="font-mono text-xs text-on-surface font-semibold p-2.5 bg-surface-container-low rounded-lg border border-outline-variant/50">
                {currentTask.source.localCode}
              </div>
            </div>

            <div>
              <label className="text-[10px] text-on-surface-variant uppercase font-medium block mb-1">
                Original Description
              </label>
              <div className="text-xs text-on-surface p-3 bg-surface-container-low rounded-lg border border-outline-variant/50 leading-relaxed font-normal">
                {currentTask.source.rawDescription}
              </div>
            </div>

            <div className="pt-2 border-t border-outline-variant/40">
              <label className="text-[10px] text-on-surface-variant uppercase font-medium block mb-2">
                Extracted Parameters
              </label>
              <div className="space-y-1 font-mono text-xs">
                {Object.entries(sourceSpecs).map(([key, value]) => (
                  <div key={key} className="flex justify-between py-1 px-2 rounded bg-surface-container-low">
                    <span className="text-on-surface-variant capitalize font-sans">{key}:</span>
                    <span className="text-on-surface font-medium">{String(value)}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2 border-t border-outline-variant/40 text-[11px] font-mono text-on-surface-variant space-y-1">
              <div className="flex justify-between">
                <span>Unit of Measure:</span>
                <span className="text-on-surface font-medium">{currentTask.source.uom}</span>
              </div>
              <div className="flex justify-between">
                <span>Originating CPSE:</span>
                <span className="text-on-surface font-medium">{currentTask.source.cpse}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Pane 2: Proposed Canonical Master (Center - 44% Width) */}
        <div className="flex-1 bg-surface-container rounded-xl border border-primary/50 flex flex-col overflow-hidden relative">
          <div className="p-3.5 border-b border-outline-variant/50 bg-primary/5 flex justify-between items-center">
            <div>
              <h3 className="text-xs font-semibold text-primary uppercase flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[15px]">verified</span>
                2. Recommended National Match
              </h3>
              <p className="text-[10px] text-on-surface-variant">Common National Material Code (CNMC) Recommendation</p>
            </div>
            <span className="px-2 py-0.5 rounded bg-primary text-on-primary font-mono text-xs font-bold">
              {currentTask.aiAnalysis.confidence}% Match
            </span>
          </div>

          <div className="p-4 flex-1 overflow-y-auto space-y-4">
            {/* Recommended Code & Title */}
            <div className="p-3 bg-surface-container-low rounded-lg border border-outline-variant/50 space-y-1.5">
              <div className="flex justify-between items-center">
                <span className="text-[10px] text-on-surface-variant uppercase font-medium">
                  National Material Code (CNMC)
                </span>
                <span className="px-1.5 py-0.5 rounded bg-primary/15 text-primary text-[10px] font-semibold font-mono">
                  {currentTask.candidate.matchType}
                </span>
              </div>
              <div className="font-mono text-lg text-primary font-bold">
                {currentTask.candidate.proposedCnmc}
              </div>
              <p className="text-xs text-on-surface leading-relaxed font-medium">
                {currentTask.candidate.canonicalDescription}
              </p>
            </div>

            {/* Why this match? Clear Specification Comparison */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <h4 className="text-[11px] text-on-surface-variant uppercase font-semibold">
                  Specification Comparison
                </h4>
                <span className="text-[10px] text-on-surface-variant font-mono">Source vs CNMC Standard</span>
              </div>

              <div className="border border-outline-variant/50 rounded-lg overflow-hidden">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-surface-container-high text-on-surface-variant font-medium text-[11px] border-b border-outline-variant/40">
                    <tr>
                      <th className="p-2.5">Attribute</th>
                      <th className="p-2.5">Source Record</th>
                      <th className="p-2.5">CNMC Standard</th>
                      <th className="p-2.5 text-center">Result</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/30 font-mono text-[11px]">
                    {comparisonRows.map((row, idx) => (
                      <tr key={idx} className="hover:bg-surface-container-high/40 transition-colors">
                        <td className="p-2.5 text-on-surface-variant font-sans font-medium">{row.attribute}</td>
                        <td className="p-2.5 text-on-surface">{row.sourceVal}</td>
                        <td className="p-2.5 text-primary font-medium">{row.cnmcVal}</td>
                        <td className="p-2.5 text-center">
                          {row.parity === 'match' ? (
                            <span className="text-status-success font-medium flex items-center justify-center gap-1 font-sans">
                              <span className="material-symbols-outlined text-[13px]">check</span>
                              Match
                            </span>
                          ) : (
                            <span className="text-status-warning font-medium flex items-center justify-center gap-1 font-sans">
                              <span className="material-symbols-outlined text-[13px]">info</span>
                              Review
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* AI Decision Rationale in Plain Language */}
            <div className="p-3 bg-surface-container-low rounded-lg border border-outline-variant/40 space-y-1.5">
              <span className="text-[10px] text-primary uppercase flex items-center gap-1 font-semibold">
                <span className="material-symbols-outlined text-[13px]">insights</span>
                Standardization Evidence
              </span>
              <ul className="text-xs text-on-surface-variant space-y-1 list-disc pl-4">
                {currentTask.aiAnalysis.evidenceNotes.map((note, idx) => (
                  <li key={idx}>{note}</li>
                ))}
              </ul>
              {currentTask.aiAnalysis.conflict && (
                <div className="mt-2 p-2 rounded bg-status-warning/10 border border-status-warning/30 text-xs text-status-warning">
                  <strong>Notice:</strong> {currentTask.aiAnalysis.conflict.description}
                </div>
              )}
            </div>
          </div>

          <div className="p-3 border-t border-outline-variant/50 bg-surface-container flex justify-between items-center">
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
              className="text-xs text-primary font-medium hover:underline flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[14px]">visibility</span>
              View Full Evidence Dossier
            </button>
            <span className="text-[11px] font-mono text-on-surface-variant">
              Queue: {currentTaskIndex + 1} of {tasksQueue.length}
            </span>
          </div>
        </div>

        {/* Pane 3: Other CPSEs Using This Material (28% Width) */}
        <div className="w-[28%] bg-surface-container rounded-xl border border-outline-variant/60 flex flex-col overflow-hidden shrink-0">
          <div className="p-3.5 border-b border-outline-variant/50 bg-surface-container flex justify-between items-center">
            <div>
              <h3 className="text-xs font-semibold text-on-surface uppercase">
                3. Related CPSE Materials
              </h3>
              <p className="text-[10px] text-on-surface-variant">Existing mapped enterprise records</p>
            </div>
            <span className="font-mono text-[10px] text-on-surface-variant bg-surface-container-high px-2 py-0.5 rounded font-medium">
              {currentTask.candidate.mappingImpact.linkedCpseCodesCount} Linked
            </span>
          </div>

          <div className="p-4 flex-1 overflow-y-auto space-y-3">
            <p className="text-xs text-on-surface-variant">
              Approving this match links your record to these enterprise materials:
            </p>

            <div className="space-y-2">
              {currentTask.candidate.mappingImpact.sampleCodes.map((code, idx) => (
                <div 
                  key={idx}
                  className="p-2.5 bg-surface-container-low rounded-lg border border-outline-variant/50 hover:border-outline transition-colors"
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-mono text-xs text-primary font-semibold">{code}</span>
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-surface-container text-on-surface font-mono">
                      Standardized
                    </span>
                  </div>
                  <p className="text-xs text-on-surface-variant truncate">
                    {currentTask.candidate.canonicalDescription}
                  </p>
                  <div className="flex justify-between items-center mt-2 text-[10px] font-mono text-on-surface-variant">
                    <span>UOM: {currentTask.source.uom}</span>
                    <span className="text-status-success flex items-center gap-0.5 font-medium">
                      <span className="material-symbols-outlined text-[12px]">link</span>
                      IDENTICAL
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-outline-variant/40">
              <h4 className="text-[10px] text-on-surface-variant uppercase font-medium mb-1.5">
                Expected System Impact
              </h4>
              <ul className="space-y-1 text-xs text-on-surface-variant font-mono">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-status-success" />
                  <span className="font-sans">Cross-company spare parts sharing enabled</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-status-success" />
                  <span className="font-sans">Immediate joint procurement pooling</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
