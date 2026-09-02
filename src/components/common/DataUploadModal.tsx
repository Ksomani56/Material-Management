import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { parseExcelOrCSVFile, downloadSampleCSVTemplate, ParsedMaterialRecord } from '../../utils/fileParser';

export const DataUploadModal: React.FC = () => {
  const { uploadModalOpen, uploadTargetCpse, closeUploadModal, importParsedRecords, cpseList } = useApp();
  
  const [selectedCpse, setSelectedCpse] = useState<string>(uploadTargetCpse || 'ONGC');
  const [destination, setDestination] = useState<'review' | 'master'>('review');
  const [file, setFile] = useState<File | null>(null);
  const [isParsing, setIsParsing] = useState<boolean>(false);
  const [parsedRecords, setParsedRecords] = useState<ParsedMaterialRecord[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!uploadModalOpen) return null;

  const handleFileProcess = async (selectedFile: File) => {
    setFile(selectedFile);
    setErrorMessage(null);
    setIsParsing(true);

    try {
      const records = await parseExcelOrCSVFile(selectedFile, selectedCpse);
      if (records.length === 0) {
        setErrorMessage('No valid material records could be parsed. Check that your file contains a header row with columns like material_code, description, and uom.');
        setParsedRecords([]);
      } else {
        setParsedRecords(records);
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Error processing spreadsheet file. Please verify the format (.csv, .xlsx, or .xls).');
      setParsedRecords([]);
    } finally {
      setIsParsing(false);
    }
  };

  const onFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileProcess(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileProcess(e.dataTransfer.files[0]);
    }
  };

  const handleConfirmImport = () => {
    if (parsedRecords.length === 0) return;
    importParsedRecords(parsedRecords, selectedCpse, destination);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-surface-container border border-outline-variant/60 rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl transition-all">
        {/* Header */}
        <div className="p-5 border-b border-outline-variant/40 bg-surface-container-high flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary-container text-on-primary-container flex items-center justify-center shadow-sm">
              <span className="material-symbols-outlined text-[20px]">upload_file</span>
            </div>
            <div>
              <h2 className="font-headline-section text-sm font-bold text-on-surface">
                Ingest Material Master Dataset
              </h2>
              <p className="font-data-mono text-[11px] text-on-surface-variant">
                Upload XLS, XLSX, or CSV spreadsheets to parse and synchronize catalog data
              </p>
            </div>
          </div>
          <button
            onClick={closeUploadModal}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:bg-surface-container-highest transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          {/* Target Parameters */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-label-caps text-on-surface-variant text-[10px] uppercase mb-1 block font-bold">
                Origin CPSE Entity
              </label>
              <select
                value={selectedCpse}
                onChange={(e) => setSelectedCpse(e.target.value)}
                className="w-full bg-surface-container-low border border-outline-variant/60 text-on-surface text-xs rounded-lg px-3 py-2 focus:ring-1 focus:ring-primary focus:border-primary font-data-mono outline-none"
              >
                {cpseList.map(c => (
                  <option key={c.id} value={c.name}>{c.name} - {c.fullName.split(' ')[0]}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-label-caps text-on-surface-variant text-[10px] uppercase mb-1 block font-bold">
                Target Ingestion Destination
              </label>
              <select
                value={destination}
                onChange={(e) => setDestination(e.target.value as 'review' | 'master')}
                className="w-full bg-surface-container-low border border-outline-variant/60 text-on-surface text-xs rounded-lg px-3 py-2 focus:ring-1 focus:ring-primary focus:border-primary font-data-mono outline-none"
              >
                <option value="review">Review Queue (Automated AI Matching)</option>
                <option value="master">National Master Catalogue (Direct Commit)</option>
              </select>
            </div>
          </div>

          {/* Drag & Drop Upload Zone */}
          <div
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all duration-200 flex flex-col items-center justify-center ${
              isDragging
                ? 'border-primary bg-primary/5'
                : 'border-outline-variant/50 hover:border-primary/60 bg-surface-container-lowest/50'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv, .xlsx, .xls, text/csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
              onChange={onFileInputChange}
              className="hidden"
            />

            <div className="w-12 h-12 rounded-full bg-surface-container-high border border-outline-variant/40 flex items-center justify-center text-primary mb-3">
              <span className="material-symbols-outlined text-[24px]">cloud_upload</span>
            </div>

            <p className="font-body-bold text-xs text-on-surface mb-1">
              {file ? file.name : 'Click to browse or drag & drop spreadsheet'}
            </p>
            <p className="font-data-mono text-[11px] text-on-surface-variant">
              Supports <span className="text-primary font-bold">.CSV</span>, <span className="text-primary font-bold">.XLSX</span>, and <span className="text-primary font-bold">.XLS</span> files (up to 50MB)
            </p>

            {isParsing && (
              <div className="mt-3 flex items-center gap-2 text-primary font-data-mono text-xs">
                <span className="material-symbols-outlined text-sm animate-spin">sync</span>
                Parsing and normalizing columns...
              </div>
            )}
          </div>

          {/* Error Banner */}
          {errorMessage && (
            <div className="p-3 bg-status-error/10 border border-status-error/30 rounded-lg text-status-error text-xs flex items-center gap-2 font-data-mono">
              <span className="material-symbols-outlined text-[18px]">error</span>
              {errorMessage}
            </div>
          )}

          {/* Parsed Preview Table */}
          {parsedRecords.length > 0 && (
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-body-bold text-on-surface flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-status-success text-sm fill-icon">check_circle</span>
                  Ready to Ingest: <strong className="text-primary font-data-mono">{parsedRecords.length} records parsed</strong>
                </span>
                <span className="font-data-mono text-on-surface-variant text-[11px]">Previewing first 3 rows</span>
              </div>

              <div className="border border-outline-variant/40 rounded-xl overflow-hidden max-h-40 overflow-y-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-surface-container-high border-b border-outline-variant/30 text-[11px] font-table-header text-on-surface-variant">
                    <tr>
                      <th className="p-2">Code</th>
                      <th className="p-2">CPSE</th>
                      <th className="p-2">Description</th>
                      <th className="p-2">UOM</th>
                      <th className="p-2">Proposed CNMC</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/20 font-data-mono text-[11px]">
                    {parsedRecords.slice(0, 3).map((r, i) => (
                      <tr key={i} className="hover:bg-surface-container-low">
                        <td className="p-2 text-primary">{r.localCode}</td>
                        <td className="p-2 text-on-surface">{r.cpse}</td>
                        <td className="p-2 text-on-surface-variant truncate max-w-[150px]">{r.description}</td>
                        <td className="p-2 text-on-surface">{r.uom}</td>
                        <td className="p-2 text-relationship-identical">{r.candidateCnmc}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Help & Sample Template Download */}
          <div className="p-3 bg-surface-container-low rounded-xl border border-outline-variant/30 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-on-surface-variant">
              <span className="material-symbols-outlined text-primary text-sm">description</span>
              <span>Need the required format structure?</span>
            </div>
            <button
              type="button"
              onClick={downloadSampleCSVTemplate}
              className="font-data-mono text-[11px] text-primary hover:underline font-semibold flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[14px]">download</span>
              Download Sample CSV
            </button>
          </div>
        </div>

        {/* Footer actions */}
        <div className="p-4 border-t border-outline-variant/40 bg-surface-container-high flex justify-end gap-3">
          <button
            type="button"
            onClick={closeUploadModal}
            className="px-4 py-2 border border-outline-variant/60 rounded-lg text-xs font-body-bold text-on-surface hover:bg-surface-container transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={parsedRecords.length === 0 || isParsing}
            onClick={handleConfirmImport}
            className="px-5 py-2 bg-primary text-on-primary font-body-bold text-xs rounded-lg hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-sm">add_task</span>
            Import {parsedRecords.length > 0 ? `${parsedRecords.length} Records` : 'Dataset'}
          </button>
        </div>
      </div>
    </div>
  );
};
