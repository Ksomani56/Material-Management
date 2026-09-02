import React from 'react';
import { useApp } from '../../context/AppContext';

export const SettingsScreen: React.FC = () => {
  const { theme, toggleTheme, openUploadModal } = useApp();

  return (
    <main className="flex-1 overflow-y-auto p-margin-page bg-background transition-colors duration-200 space-y-6 max-w-4xl">
      <div>
        <h1 className="font-headline-section text-headline-section text-on-surface font-bold">
          System & Harmonization Settings
        </h1>
        <p className="text-xs text-on-surface-variant mt-0.5">
          Manage application appearance, spreadsheet onboarding pipelines, and AI matching rules.
        </p>
      </div>

      <div className="bg-surface-container border border-outline-variant/40 rounded-2xl p-6 shadow-sm space-y-6">
        {/* Section: Application Theme */}
        <div>
          <h3 className="font-body-bold text-sm text-on-surface mb-1 font-bold">Application Theme</h3>
          <p className="text-xs text-on-surface-variant mb-3">
            Choose between the National Unified dark mode and Foundry high-contrast light mode.
          </p>
          <div className="flex items-center justify-between p-4 bg-surface-container-low rounded-xl border border-outline-variant/40">
            <div>
              <p className="font-semibold text-xs text-on-surface">Current Active Theme</p>
              <p className="text-xs text-on-surface-variant">
                Currently running in <strong className="text-primary capitalize">{theme} Mode</strong>.
              </p>
            </div>
            <button
              onClick={toggleTheme}
              className="px-4 py-2 bg-surface-container hover:bg-surface-container-high border border-outline-variant/50 rounded-xl text-xs font-semibold text-on-surface transition-colors flex items-center gap-2 shadow-sm"
            >
              <span className="material-symbols-outlined text-[18px]">
                {theme === 'dark' ? 'light_mode' : 'dark_mode'}
              </span>
              Switch to {theme === 'dark' ? 'Light' : 'Dark'} Mode
            </button>
          </div>
        </div>

        {/* Section: Data Ingestion */}
        <div className="pt-4 border-t border-outline-variant/30">
          <h3 className="font-body-bold text-sm text-on-surface mb-1 font-bold">Data Ingestion</h3>
          <p className="text-xs text-on-surface-variant mb-3">
            Upload and process legacy CPSE catalog spreadsheets into the national database.
          </p>
          <div className="flex items-center justify-between p-4 bg-surface-container-low rounded-xl border border-outline-variant/40">
            <div>
              <p className="font-semibold text-xs text-on-surface">Spreadsheet Importer (CSV, XLS, XLSX)</p>
              <p className="text-xs text-on-surface-variant">Batch imports legacy material codes and attributes into the Review Queue.</p>
            </div>
            <button
              onClick={() => openUploadModal('ONGC')}
              className="px-4 py-2 bg-primary text-on-primary rounded-xl text-xs font-bold hover:brightness-110 transition-colors flex items-center gap-2 shadow-sm"
            >
              <span className="material-symbols-outlined text-[18px]">upload_file</span>
              Upload File
            </button>
          </div>
        </div>

        {/* Section: AI Matching Configuration */}
        <div className="pt-4 border-t border-outline-variant/30">
          <h3 className="font-body-bold text-sm text-on-surface mb-1 font-bold">AI Matching Rules</h3>
          <p className="text-xs text-on-surface-variant mb-3">
            Control automated approval thresholds and standard unit conversions.
          </p>
          <div className="space-y-3 font-data-mono text-xs">
            <div className="flex justify-between items-center p-3.5 bg-surface-container-low rounded-xl border border-outline-variant/40">
              <div>
                <p className="font-semibold text-on-surface font-sans">Auto-Approval Threshold</p>
                <p className="text-[11px] text-on-surface-variant font-sans">
                  Matches scoring at or above this confidence rating are automatically approved.
                </p>
              </div>
              <span className="px-3 py-1 bg-surface-container-high rounded-lg text-primary font-bold border border-outline-variant/30">
                &ge; 98.0%
              </span>
            </div>

            <div className="flex justify-between items-center p-3.5 bg-surface-container-low rounded-xl border border-outline-variant/40">
              <div>
                <p className="font-semibold text-on-surface font-sans">Active Matching Model</p>
                <p className="text-[11px] text-on-surface-variant font-sans">
                  Domain-tuned semantic taxonomy engine.
                </p>
              </div>
              <span className="px-3 py-1 bg-surface-container-high rounded-lg text-on-surface border border-outline-variant/30 font-sans">
                Technical-RoBERTa v4.2
              </span>
            </div>

            <div className="flex justify-between items-center p-3.5 bg-surface-container-low rounded-xl border border-outline-variant/40">
              <div>
                <p className="font-semibold text-on-surface font-sans">Automatic UOM Normalization</p>
                <p className="text-[11px] text-on-surface-variant font-sans">
                  Converts imperial and legacy units (e.g. In, Lbs) to SI standards.
                </p>
              </div>
              <span className="px-3 py-1 bg-status-success/15 text-status-success rounded-lg font-bold border border-status-success/30 font-sans">
                Enabled
              </span>
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
          National Material Master Support & Guidelines
        </h1>
        <p className="text-xs text-on-surface-variant mt-0.5">
          Documentation, cataloging taxonomy manuals, and operational contacts.
        </p>
      </div>

      <div className="bg-surface-container border border-outline-variant/40 rounded-2xl p-6 shadow-sm space-y-4">
        <h3 className="font-body-bold text-sm text-on-surface font-bold">Cataloging Governance Manuals</h3>
        <ul className="space-y-2 text-xs text-on-surface-variant">
          <li className="flex items-center gap-2 p-3 bg-surface-container-low rounded-xl border border-outline-variant/30">
            <span className="material-symbols-outlined text-primary text-sm">description</span>
            <span className="font-semibold text-on-surface">MoPNG National Taxonomy Guideline v3.0:</span>
            <span>Fastener, Valve & Pump Standard Syntax</span>
          </li>
          <li className="flex items-center gap-2 p-3 bg-surface-container-low rounded-xl border border-outline-variant/30">
            <span className="material-symbols-outlined text-primary text-sm">description</span>
            <span className="font-semibold text-on-surface">MESC & UNSPSC Cross-Reference Matrix:</span>
            <span>Version 2024.1 Mapping Schema</span>
          </li>
        </ul>
      </div>
    </main>
  );
};
