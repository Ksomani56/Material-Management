import React from 'react';
import { useApp } from '../../context/AppContext';

export const SettingsScreen: React.FC = () => {
  const { theme, toggleTheme, openUploadModal } = useApp();

  return (
    <main className="flex-1 overflow-y-auto p-margin-page bg-background transition-colors duration-200 space-y-6 max-w-4xl">
      <div>
        <h1 className="font-headline-section text-headline-section text-on-surface font-bold">
          System & Algorithm Settings
        </h1>
        <p className="font-data-mono text-xs text-on-surface-variant mt-0.5">
          Configure AI match thresholds, taxonomy dictionaries, and interface preferences
        </p>
      </div>

      <div className="bg-surface-container border border-outline-variant/40 rounded-2xl p-6 shadow-sm space-y-6">
        <div>
          <h3 className="font-body-bold text-sm text-on-surface mb-3">Theme & Visual Appearance</h3>
          <div className="flex items-center justify-between p-4 bg-surface-container-low rounded-xl border border-outline-variant/40">
            <div>
              <p className="font-semibold text-xs text-on-surface">Application Theme Mode</p>
              <p className="text-xs text-on-surface-variant">Switch between National Unified Dark Theme and Foundry Light Theme.</p>
            </div>
            <button
              onClick={toggleTheme}
              className="px-4 py-2 bg-surface-container hover:bg-surface-container-high border border-outline-variant/50 rounded-xl text-xs font-body-bold text-on-surface transition-colors flex items-center gap-2 shadow-sm"
            >
              <span className="material-symbols-outlined text-[18px]">
                {theme === 'dark' ? 'light_mode' : 'dark_mode'}
              </span>
              Switch to {theme === 'dark' ? 'Light' : 'Dark'} Mode
            </button>
          </div>
        </div>

        <div>
          <h3 className="font-body-bold text-sm text-on-surface mb-3">Data Ingestion Pipelines</h3>
          <div className="flex items-center justify-between p-4 bg-surface-container-low rounded-xl border border-outline-variant/40">
            <div>
              <p className="font-semibold text-xs text-on-surface">Spreadsheet Ingestion (CSV / XLS / XLSX)</p>
              <p className="text-xs text-on-surface-variant">Batch upload and parse legacy ERP materials into the national system.</p>
            </div>
            <button
              onClick={() => openUploadModal('ONGC')}
              className="px-4 py-2 bg-primary text-on-primary rounded-xl text-xs font-body-bold hover:brightness-110 transition-colors flex items-center gap-2 shadow-sm"
            >
              <span className="material-symbols-outlined text-[18px]">upload_file</span>
              Open File Ingestion
            </button>
          </div>
        </div>

        <div>
          <h3 className="font-body-bold text-sm text-on-surface mb-3">AI Model & Pipeline Hyperparameters</h3>
          <div className="space-y-3 font-data-mono text-xs">
            <div className="flex justify-between items-center p-3.5 bg-surface-container-low rounded-xl border border-outline-variant/40">
              <div>
                <p className="font-semibold text-on-surface">Auto-Approval Threshold</p>
                <p className="text-on-surface-variant text-[11px] font-sans">Minimum semantic & attribute score required for zero-touch auto harmonization.</p>
              </div>
              <span className="text-primary font-bold px-3 py-1 bg-primary/10 rounded-lg border border-primary/20">98.0%</span>
            </div>
            
            <div className="flex justify-between items-center p-3.5 bg-surface-container-low rounded-xl border border-outline-variant/40">
              <div>
                <p className="font-semibold text-on-surface">Active Embedding Model</p>
                <p className="text-on-surface-variant text-[11px] font-sans">Specialized multilingual technical transformer tuned on CPSE engineering catalogs.</p>
              </div>
              <span className="text-on-surface px-3 py-1 bg-surface-container rounded-lg border border-outline-variant/40">Technical-RoBERTa-v4.2</span>
            </div>

            <div className="flex justify-between items-center p-3.5 bg-surface-container-low rounded-xl border border-outline-variant/40">
              <div>
                <p className="font-semibold text-on-surface">UOM Conversion Dictionary</p>
                <p className="text-on-surface-variant text-[11px] font-sans">ISO 80000-1 / SI unit normalization rules.</p>
              </div>
              <span className="text-status-success font-bold px-3 py-1 bg-status-success/15 rounded-lg border border-status-success/30">Active & Enforced</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export const SupportScreen: React.FC = () => {
  return (
    <main className="flex-1 overflow-y-auto p-margin-page bg-background transition-colors duration-200 space-y-6 max-w-4xl">
      <div>
        <h1 className="font-headline-section text-headline-section text-on-surface font-bold">
          Technical Support & Documentation
        </h1>
        <p className="font-data-mono text-xs text-on-surface-variant mt-0.5">
          SIH26099 National Unified Material Master Reference Architecture
        </p>
      </div>

      <div className="bg-surface-container border border-outline-variant/40 rounded-2xl p-6 shadow-sm space-y-4">
        <h3 className="font-body-bold text-sm text-on-surface">System Guidelines</h3>
        <p className="text-xs text-on-surface-variant leading-relaxed font-body-standard">
          This system operates under the guidelines for Central Public Sector Enterprises (CPSEs) to harmonize material masters, reduce redundant inventory, and facilitate cross-organization bulk procurement.
        </p>
        <div className="p-4 bg-surface-container-low rounded-xl border border-outline-variant/40 space-y-2 text-xs font-data-mono">
          <p className="text-primary font-bold">System Status: Operational</p>
          <p className="text-on-surface-variant">Version: 2.4.0 (Enterprise Release)</p>
          <p className="text-on-surface-variant">Governance Authority: Ministry of Petroleum & Natural Gas (MoPNG)</p>
        </div>
      </div>
    </main>
  );
};
