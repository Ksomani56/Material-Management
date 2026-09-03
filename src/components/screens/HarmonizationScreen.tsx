import React from 'react';
import { useApp } from '../../context/AppContext';

export const HarmonizationScreen: React.FC = () => {
  const { 
    currentTask, 
    tasksQueue, 
    currentTaskIndex, 
    commitHarmonization, 
    skipHarmonization, 
    flagHarmonization, 
    openEvidence,
    addToast 
  } = useApp();

  const handleCommit = () => {
    commitHarmonization();
    addToast('success', `Approved match for ${currentTask.source.localCode} linked to ${currentTask.candidate.proposedCnmc}`);
  };

  const handleSkip = () => {
    skipHarmonization();
    addToast('info', 'Skipped to next harmonization item.');
  };

  const handleFlag = () => {
    flagHarmonization();
    addToast('warning', `Item ${currentTask.source.localCode} flagged for technical committee.`);
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
    <div className="flex-1 flex flex-col h-full overflow-hidden" style={{ background: 'var(--bg)' }}>
      {/* Workspace Controls Header */}
      <div 
        className="px-6 py-4 flex items-center justify-between shrink-0"
        style={{ background: 'var(--bg-surface)', borderBottom: '1px solid var(--border)' }}
      >
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>
              Material Harmonization Workbench
            </h2>
            <span 
              className="font-mono text-xs px-2.5 py-0.5 rounded font-semibold"
              style={{ background: 'var(--blue-dim)', color: 'var(--blue)', border: '1px solid rgba(59,130,246,0.3)' }}
            >
              Task {currentTask.taskId}
            </span>
          </div>
          <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>
            Review source material attributes and confirm recommendation for Common National Material Code (CNMC).
          </p>
        </div>
        
        <div className="flex items-center gap-2.5">
          <button 
            onClick={handleSkip}
            className="px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all hover:opacity-80"
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}
          >
            <span className="material-symbols-outlined text-[16px]">redo</span>
            Skip
          </button>
          <button 
            onClick={handleFlag}
            className="px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all hover:opacity-80"
            style={{ background: 'var(--warn-dim)', border: '1px solid rgba(245,158,11,0.3)', color: 'var(--warning)' }}
          >
            <span className="material-symbols-outlined text-[16px]">flag</span>
            Flag for Review
          </button>
          <button 
            onClick={handleCommit}
            className="px-4 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all hover:brightness-110 shadow-sm"
            style={{ background: 'var(--blue)', color: '#fff' }}
          >
            <span className="material-symbols-outlined text-[16px]">check</span>
            Approve Match
          </button>
        </div>
      </div>

      {/* 3-Column Tri-Pane Workspace */}
      <div className="flex-1 flex overflow-hidden p-6 gap-5">
        {/* Pane 1: Source Record (28%) */}
        <div 
          className="w-[28%] rounded-xl flex flex-col overflow-hidden shrink-0"
          style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
        >
          <div 
            className="p-4 flex justify-between items-center"
            style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg-hover)' }}
          >
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-primary)' }}>
                1. Source Record
              </h3>
              <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>Incoming legacy ERP data</p>
            </div>
            <span 
              className="px-2 py-0.5 rounded text-xs font-mono font-bold"
              style={{ background: 'var(--blue-dim)', color: 'var(--blue)' }}
            >
              {currentTask.source.cpse}
            </span>
          </div>

          <div className="p-4 flex-1 overflow-y-auto space-y-4">
            <div>
              <label className="text-xs uppercase font-semibold block mb-1.5" style={{ color: 'var(--text-muted)' }}>
                Local ERP Item Code
              </label>
              <div 
                className="font-mono text-sm font-bold p-3 rounded-lg"
                style={{ background: 'var(--bg-input)', border: '1px solid var(--border)', color: 'var(--blue)' }}
              >
                {currentTask.source.localCode}
              </div>
            </div>

            <div>
              <label className="text-xs uppercase font-semibold block mb-1.5" style={{ color: 'var(--text-muted)' }}>
                Raw Description
              </label>
              <div 
                className="text-sm p-3 rounded-lg leading-relaxed font-normal"
                style={{ background: 'var(--bg-input)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
              >
                {currentTask.source.rawDescription}
              </div>
            </div>

            <div className="pt-2" style={{ borderTop: '1px solid var(--border-subtle)' }}>
              <label className="text-xs uppercase font-semibold block mb-2" style={{ color: 'var(--text-muted)' }}>
                Extracted Parameters
              </label>
              <div className="space-y-1.5 font-mono text-xs">
                {Object.entries(sourceSpecs).map(([key, value]) => (
                  <div 
                    key={key} 
                    className="flex justify-between py-1.5 px-2.5 rounded"
                    style={{ background: 'var(--bg-hover)' }}
                  >
                    <span className="capitalize font-sans" style={{ color: 'var(--text-secondary)' }}>{key}:</span>
                    <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>{String(value)}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2 text-xs font-mono space-y-1.5" style={{ borderTop: '1px solid var(--border-subtle)', color: 'var(--text-secondary)' }}>
              <div className="flex justify-between">
                <span>Unit of Measure:</span>
                <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>{currentTask.source.uom}</span>
              </div>
              <div className="flex justify-between">
                <span>Originating CPSE:</span>
                <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>{currentTask.source.cpse}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Pane 2: Proposed Canonical Master (Center - 44%) */}
        <div 
          className="flex-1 rounded-xl flex flex-col overflow-hidden relative"
          style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
        >
          <div 
            className="p-4 flex justify-between items-center"
            style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg-hover)' }}
          >
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5" style={{ color: 'var(--blue)' }}>
                <span className="material-symbols-outlined text-[16px]">verified</span>
                2. Recommended National Match
              </h3>
              <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>
                Common National Material Code (CNMC) recommendation
              </p>
            </div>
            <span 
              className="px-2.5 py-1 rounded text-xs font-mono font-bold"
              style={{ background: 'var(--blue)', color: '#fff' }}
            >
              {currentTask.aiAnalysis.confidence}% Match
            </span>
          </div>

          <div className="p-5 flex-1 overflow-y-auto space-y-4">
            {/* Recommended Code Box */}
            <div 
              className="p-4 rounded-xl space-y-2"
              style={{ background: 'var(--bg-hover)', border: '1px solid var(--border)' }}
            >
              <div className="flex justify-between items-center">
                <span className="text-xs uppercase font-semibold" style={{ color: 'var(--text-muted)' }}>
                  National Master CNMC
                </span>
                <span 
                  className="px-2 py-0.5 rounded text-xs font-semibold font-mono"
                  style={{ background: 'var(--blue-dim)', color: 'var(--blue)' }}
                >
                  {currentTask.candidate.matchType}
                </span>
              </div>
              <div className="font-mono text-xl font-bold" style={{ color: 'var(--blue)' }}>
                {currentTask.candidate.proposedCnmc}
              </div>
              <p className="text-sm font-medium leading-relaxed" style={{ color: 'var(--text-primary)' }}>
                {currentTask.candidate.canonicalDescription}
              </p>
            </div>

            {/* Attribute Alignment Comparison */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <h4 className="text-xs uppercase font-bold tracking-wider" style={{ color: 'var(--text-secondary)' }}>
                  Specification Comparison
                </h4>
                <span className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>Source vs CNMC Standard</span>
              </div>

              <div className="rounded-lg overflow-hidden" style={{ border: '1px solid var(--border)' }}>
                <table className="w-full text-left text-xs">
                  <thead style={{ background: 'var(--bg-hover)', borderBottom: '1px solid var(--border)' }}>
                    <tr>
                      <th className="p-3 font-semibold" style={{ color: 'var(--text-muted)' }}>Attribute</th>
                      <th className="p-3 font-semibold" style={{ color: 'var(--text-muted)' }}>Source Record</th>
                      <th className="p-3 font-semibold" style={{ color: 'var(--text-muted)' }}>CNMC Standard</th>
                      <th className="p-3 text-center font-semibold" style={{ color: 'var(--text-muted)' }}>Result</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y font-mono text-xs" style={{ borderColor: 'var(--border-subtle)' }}>
                    {comparisonRows.map((row, idx) => (
                      <tr key={idx} className="hover:opacity-90 transition-opacity">
                        <td className="p-3 font-sans font-medium" style={{ color: 'var(--text-secondary)' }}>{row.attribute}</td>
                        <td className="p-3" style={{ color: 'var(--text-primary)' }}>{row.sourceVal}</td>
                        <td className="p-3 font-semibold" style={{ color: 'var(--blue)' }}>{row.cnmcVal}</td>
                        <td className="p-3 text-center">
                          {row.parity === 'match' ? (
                            <span 
                              className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded"
                              style={{ background: 'var(--success-dim)', color: 'var(--success)' }}
                            >
                              <span className="material-symbols-outlined text-[14px]">check</span>
                              Match
                            </span>
                          ) : (
                            <span 
                              className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded"
                              style={{ background: 'var(--warn-dim)', color: 'var(--warning)' }}
                            >
                              <span className="material-symbols-outlined text-[14px]">info</span>
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

            {/* Standardization Evidence */}
            <div 
              className="p-4 rounded-xl space-y-2"
              style={{ background: 'var(--bg-hover)', border: '1px solid var(--border)' }}
            >
              <span className="text-xs uppercase flex items-center gap-1.5 font-bold" style={{ color: 'var(--blue)' }}>
                <span className="material-symbols-outlined text-[16px]">insights</span>
                Standardization Evidence
              </span>
              <ul className="text-xs space-y-1 list-disc pl-4" style={{ color: 'var(--text-secondary)' }}>
                {currentTask.aiAnalysis.evidenceNotes.map((note, idx) => (
                  <li key={idx}>{note}</li>
                ))}
              </ul>
              {currentTask.aiAnalysis.conflict && (
                <div 
                  className="mt-2 p-2.5 rounded-lg text-xs"
                  style={{ background: 'var(--warn-dim)', border: '1px solid rgba(245,158,11,0.3)', color: 'var(--warning)' }}
                >
                  <strong>Conflict Note:</strong> {currentTask.aiAnalysis.conflict.description}
                </div>
              )}
            </div>
          </div>

          <div 
            className="p-4 flex justify-between items-center"
            style={{ borderTop: '1px solid var(--border)', background: 'var(--bg-hover)' }}
          >
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
              className="text-xs font-semibold hover:underline flex items-center gap-1"
              style={{ color: 'var(--blue)' }}
            >
              <span className="material-symbols-outlined text-[16px]">visibility</span>
              View Full Evidence Dossier
            </button>
            <span className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>
              Queue: {currentTaskIndex + 1} of {tasksQueue.length}
            </span>
          </div>
        </div>

        {/* Pane 3: Other CPSEs Using This Material (28%) */}
        <div 
          className="w-[28%] rounded-xl flex flex-col overflow-hidden shrink-0"
          style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
        >
          <div 
            className="p-4 flex justify-between items-center"
            style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg-hover)' }}
          >
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-primary)' }}>
                3. Related CPSE Codes
              </h3>
              <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>Cross-enterprise links</p>
            </div>
            <span 
              className="font-mono text-xs px-2 py-0.5 rounded font-bold"
              style={{ background: 'var(--blue-dim)', color: 'var(--blue)' }}
            >
              {currentTask.candidate.mappingImpact.linkedCpseCodesCount} Linked
            </span>
          </div>

          <div className="p-4 flex-1 overflow-y-auto space-y-3.5">
            <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
              Approving this match links your record to these enterprise materials:
            </p>

            <div className="space-y-2.5">
              {currentTask.candidate.mappingImpact.sampleCodes.map((code, idx) => (
                <div 
                  key={idx}
                  className="p-3 rounded-lg card-hover transition-colors"
                  style={{ background: 'var(--bg-hover)', border: '1px solid var(--border-subtle)' }}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-mono text-xs font-bold" style={{ color: 'var(--blue)' }}>{code}</span>
                    <span 
                      className="px-2 py-0.5 rounded text-[10px] font-semibold uppercase"
                      style={{ background: 'var(--bg-card)', color: 'var(--text-secondary)' }}
                    >
                      Mapped
                    </span>
                  </div>
                  <p className="text-xs truncate" style={{ color: 'var(--text-secondary)' }}>
                    {currentTask.candidate.canonicalDescription}
                  </p>
                  <div className="flex justify-between items-center mt-2.5 text-xs font-mono" style={{ color: 'var(--text-muted)' }}>
                    <span>UOM: {currentTask.source.uom}</span>
                    <span className="flex items-center gap-1 font-semibold" style={{ color: 'var(--success)' }}>
                      <span className="material-symbols-outlined text-[13px]">link</span>
                      IDENTICAL
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-3" style={{ borderTop: '1px solid var(--border-subtle)' }}>
              <h4 className="text-xs uppercase font-semibold mb-2" style={{ color: 'var(--text-muted)' }}>
                System Impact
              </h4>
              <ul className="space-y-1.5 text-xs font-mono" style={{ color: 'var(--text-secondary)' }}>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ background: 'var(--success)' }} />
                  <span className="font-sans">Cross-company spare parts sharing enabled</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ background: 'var(--success)' }} />
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
