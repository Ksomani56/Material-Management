import React from 'react';
import { useApp } from '../../context/AppContext';

const Section: React.FC<{ title: string; desc: string; children: React.ReactNode }> = ({ title, desc, children }) => (
  <div className="pt-5" style={{ borderTop: '1px solid var(--border)' }}>
    <h3 className="text-sm font-semibold mb-0.5" style={{ color: 'var(--text-primary)' }}>{title}</h3>
    <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>{desc}</p>
    {children}
  </div>
);

const Row: React.FC<{ label: string; desc: string; action: React.ReactNode }> = ({ label, desc, action }) => (
  <div className="flex items-center justify-between p-4 rounded-lg"
    style={{ background: 'var(--bg-hover)', border: '1px solid var(--border-subtle)' }}>
    <div>
      <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{label}</p>
      <p className="text-sm mt-0.5" style={{ color: 'var(--text-secondary)' }}>{desc}</p>
    </div>
    {action}
  </div>
);

export const SettingsScreen: React.FC = () => {
  const { theme, toggleTheme, openUploadModal } = useApp();

  return (
    <main className="flex-1 overflow-y-auto p-6 space-y-5 max-w-3xl" style={{ background: 'var(--bg)' }}>
      <div>
        <h2 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
          Settings
        </h2>
        <p className="text-sm mt-0.5" style={{ color: 'var(--text-secondary)' }}>
          Manage application appearance, ingestion pipelines, and AI matching rules.
        </p>
      </div>

      <div className="rounded-xl p-5 space-y-5"
        style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>

        {/* Theme */}
        <div>
          <h3 className="text-sm font-semibold mb-0.5" style={{ color: 'var(--text-primary)' }}>Application Theme</h3>
          <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
            Choose between dark and light mode. Both share identical layout and structure.
          </p>
          <Row
            label="Current Active Theme"
            desc={`Currently running in ${theme === 'dark' ? 'Dark' : 'Light'} Mode.`}
            action={
              <button onClick={toggleTheme}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium hover:brightness-110 transition-all"
                style={{ background: 'var(--bg-hover)', color: 'var(--text-primary)', border: '1px solid var(--border)' }}>
                <span className="material-symbols-outlined text-[18px]">
                  {theme === 'dark' ? 'light_mode' : 'dark_mode'}
                </span>
                Switch to {theme === 'dark' ? 'Light' : 'Dark'} Mode
              </button>
            }
          />
        </div>

        <Section title="Data Ingestion" desc="Upload and process legacy CPSE catalog spreadsheets into the national database.">
          <Row
            label="Spreadsheet Importer (CSV, XLS, XLSX)"
            desc="Batch imports legacy material codes and attributes into the Review Queue."
            action={
              <button onClick={() => openUploadModal('ONGC')}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold hover:brightness-110 transition-all"
                style={{ background: 'var(--blue)', color: '#fff' }}>
                <span className="material-symbols-outlined text-[16px]">upload_file</span>
                Upload File
              </button>
            }
          />
        </Section>

        <Section title="AI Matching Rules" desc="Control automated approval thresholds and standard unit conversions.">
          <div className="space-y-2.5">
            <Row
              label="Auto-Approval Threshold"
              desc="Matches at or above this confidence score are automatically approved."
              action={<span className="text-sm font-mono font-bold px-3 py-1.5 rounded"
                style={{ background: 'var(--blue-dim)', color: 'var(--blue)' }}>≥ 98.0%</span>}
            />
            <Row
              label="Active Matching Model"
              desc="Domain-tuned semantic taxonomy engine for material description parsing."
              action={<span className="text-sm px-3 py-1.5 rounded"
                style={{ background: 'var(--bg-hover)', color: 'var(--text-primary)', border: '1px solid var(--border)' }}>
                Technical-RoBERTa v4.2
              </span>}
            />
            <Row
              label="Automatic UOM Normalization"
              desc="Converts imperial and legacy units (In, Lbs) to SI standards automatically."
              action={<span className="text-sm font-semibold px-3 py-1.5 rounded"
                style={{ background: 'var(--success-dim)', color: 'var(--success)' }}>Enabled</span>}
            />
          </div>
        </Section>
      </div>
    </main>
  );
};

export const SupportScreen: React.FC = () => (
  <main className="flex-1 overflow-y-auto p-6 space-y-5 max-w-3xl" style={{ background: 'var(--bg)' }}>
    <div>
      <h2 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
        Documentation &amp; Support
      </h2>
      <p className="text-sm mt-0.5" style={{ color: 'var(--text-secondary)' }}>
        Cataloging taxonomy manuals, governance guidelines, and operational contacts.
      </p>
    </div>

    <div className="rounded-xl p-5 space-y-3"
      style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
      <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>Cataloging Governance Manuals</h3>
      <ul className="space-y-2">
        {[
          { title: 'MoPNG National Taxonomy Guideline v3.0', desc: 'Fastener, Valve & Pump Standard Syntax' },
          { title: 'MESC & UNSPSC Cross-Reference Matrix', desc: 'Version 2024.1 Mapping Schema' },
          { title: 'CPSE ERP Connector Integration Guide', desc: 'SAP S/4HANA, Oracle, IBM Maximo' },
        ].map(doc => (
          <li key={doc.title}
            className="flex items-center gap-3 p-4 rounded-lg hover:opacity-90 transition-opacity cursor-pointer"
            style={{ background: 'var(--bg-hover)', border: '1px solid var(--border-subtle)' }}>
            <span className="material-symbols-outlined icon-fill text-[22px]" style={{ color: 'var(--blue)' }}>description</span>
            <div>
              <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{doc.title}</p>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{doc.desc}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  </main>
);
