import React from 'react';
import { useApp } from '../../context/AppContext';

export const SettingsScreen: React.FC = () => {
  const { theme, toggleTheme, openUploadModal } = useApp();

  return (
    <main className="flex-1 overflow-y-auto p-6 bg-background space-y-6 max-w-4xl">
      <div>
        <h1 className="text-base font-bold text-on-surface tracking-tight">
          System & Harmonization Settings
        </h1>
        <p className="text-xs text-on-surface-variant mt-0.5">
          Manage application appearance, spreadsheet onboarding pipelines, and AI matching rules.
        </p>
      </div>

      <div className="bg-surface-container border border-outline-variant/60 rounded-xl p-5 space-y-6">
        {/* Section: Application Theme */}
        <div>
          <h3 className="text-xs font-semibold text-on-surface mb-1">Application Theme</h3>
          <p className="text-xs text-on-surface-variant mb-3">
            Choose between National Unified dark mode and high-contrast light mode. Both modes share the exact same structural layout.
          </p>
          <div className="flex items-center justify-between p-3.5 bg-surface-container-low rounded-lg border border-outline-variant/50">
            <div>
              <p className="font-medium text-xs text-on-surface">Current Active Theme</p>
              <p className="text-xs text-on-surface-variant">
                Currently running in <strong className="text-primary capitalize">{theme} Mode</strong>.
              </p>
            </div>
            <button
              onClick={toggleTheme}
              className="px-3.5 py-1.5 bg-surface-container hover:bg-surface-container-high border border-outline-variant/60 rounded-lg text-xs font-medium text-on-surface transition-colors flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-[16px]">
                {theme === 'dark' ? 'light_mode' : 'dark_mode'}
              </span>
              Switch to {theme === 'dark' ? 'Light' : 'Dark'} Mode
            </button>
          </div>
        </div>

        {/* Section: Data Ingestion */}
        <div className="pt-4 border-t border-outline-variant/40">
          <h3 className="text-xs font-semibold text-on-surface mb-1">Data Ingestion</h3>
          <p className="text-xs text-on-surface-variant mb-3">
            Upload and process legacy CPSE catalog spreadsheets into the national database.
          </p>
          <div className="flex items-center justify-between p-3.5 bg-surface-container-low rounded-lg border border-outline-variant/50">
            <div>
              <p className="font-medium text-xs text-on-surface">Spreadsheet Importer (CSV, XLS, XLSX)</p>
              <p className="text-xs text-on-surface-variant">Batch imports legacy material codes and attributes into the Review Queue.</p>
            </div>
            <button
              onClick={() => openUploadModal('ONGC')}
              className="px-3.5 py-1.5 bg-primary text-on-primary rounded-lg text-xs font-semibold hover:brightness-110 transition-colors flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[16px]">upload_file</span>
              Upload File
            </button>
          </div>
        </div>

        {/* Section: AI Matching Configuration */}
        <div className="pt-4 border-t border-outline-variant/40">
          <h3 className="text-xs font-semibold text-on-surface mb-1">AI Matching Rules</h3>
          <p className="text-xs text-on-surface-variant mb-3">
            Control automated approval thresholds and standard unit conversions.
          </p>
          <div className="space-y-2.5 text-xs font-mono">
            <div className="flex justify-between items-center p-3 bg-surface-container-low rounded-lg border border-outline-variant/40">
              <div>
                <p className="font-medium text-on-surface font-sans">Auto-Approval Threshold</p>
                <p className="text-[11px] text-on-surface-variant font-sans">
                  Matches scoring at or above this confidence rating are automatically approved.
                </p>
              </div>
              <span className="px-2.5 py-1 bg-surface-container-high rounded text-primary font-bold border border-outline-variant/40">
                &ge; 98.0%
              </span>
            </div>

            <div className="flex justify-between items-center p-3 bg-surface-container-low rounded-lg border border-outline-variant/40">
              <div>
                <p className="font-medium text-on-surface font-sans">Active Matching Model</p>
                <p className="text-[11px] text-on-surface-variant font-sans">
                  Domain-tuned semantic taxonomy engine.
                </p>
              </div>
              <span className="px-2.5 py-1 bg-surface-container-high rounded text-on-surface border border-outline-variant/40 font-sans text-xs">
                Technical-RoBERTa v4.2
              </span>
            </div>

            <div className="flex justify-between items-center p-3 bg-surface-container-low rounded-lg border border-outline-variant/40">
              <div>
                <p className="font-medium text-on-surface font-sans">Automatic UOM Normalization</p>
                <p className="text-[11px] text-on-surface-variant font-sans">
                  Converts imperial and legacy units (e.g. In, Lbs) to SI standards.
                </p>
              </div>
              <span className="px-2.5 py-1 bg-status-success/10 text-status-success rounded font-medium font-sans text-xs">
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
    <main className="flex-1 overflow-y-auto p-6 bg-background space-y-6 max-w-4xl">
      <div>
        <h1 className="text-base font-bold text-on-surface tracking-tight">
          National Material Master Support & Guidelines
        </h1>
        <p className="text-xs text-on-surface-variant mt-0.5">
          Documentation, cataloging taxonomy manuals, and operational contacts.
        </p>
      </div>

      <div className="bg-surface-container border border-outline-variant/60 rounded-xl p-5 space-y-3">
        <h3 className="text-xs font-semibold text-on-surface">Cataloging Governance Manuals</h3>
        <ul className="space-y-2 text-xs text-on-surface-variant">
          <li className="flex items-center gap-2 p-3 bg-surface-container-low rounded-lg border border-outline-variant/40">
            <span className="material-symbols-outlined text-primary text-base">description</span>
            <span className="font-medium text-on-surface">MoPNG National Taxonomy Guideline v3.0:</span>
            <span>Fastener, Valve & Pump Standard Syntax</span>
          </li>
          <li className="flex items-center gap-2 p-3 bg-surface-container-low rounded-lg border border-outline-variant/40">
            <span className="material-symbols-outlined text-primary text-base">description</span>
            <span className="font-medium text-on-surface">MESC & UNSPSC Cross-Reference Matrix:</span>
            <span>Version 2024.1 Mapping Schema</span>
          </li>
        </ul>
      </div>
    </main>
  );
};
