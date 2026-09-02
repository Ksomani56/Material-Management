import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

export const DataHubScreen: React.FC = () => {
  const { cpseList, addAuditLog, openUploadModal } = useApp();
  const [syncingId, setSyncingId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const handleTriggerSync = (cpseId: string, name: string) => {
    setSyncingId(cpseId);
    setTimeout(() => {
      setSyncingId(null);
      setMessage(`Successfully synchronized catalog delta for ${name}. 1,240 records updated.`);
      addAuditLog({
        action: 'Manual Ingestion Triggered',
        description: `Triggered delta ingestion connector for ${name} ERP system. Pipeline executed successfully.`,
        user: {
          name: 'A. Kumar',
          role: 'Administrator',
          initials: 'AK'
        },
        targetEntity: cpseId
      });
      setTimeout(() => setMessage(null), 4000);
    }, 1500);
  };

  return (
    <main className="flex-1 overflow-y-auto p-margin-page bg-background transition-colors duration-200 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-headline-section text-headline-section text-on-surface font-bold">
            CPSE Data Hub & Connectors
          </h1>
          <p className="font-data-mono text-xs text-on-surface-variant mt-0.5">
            Real-time integration status with enterprise ERP systems and file ingestion pipelines
          </p>
        </div>

        <div className="flex items-center gap-3">
          {message && (
            <div className="px-3 py-1.5 bg-primary/10 border border-primary/30 text-primary text-xs rounded-lg font-data-mono flex items-center animate-in fade-in">
              <span className="material-symbols-outlined text-sm mr-1.5">check_circle</span>
              {message}
            </div>
          )}

          <button
            onClick={() => openUploadModal('ONGC')}
            className="px-4 py-2 bg-primary text-on-primary rounded-xl font-body-bold text-xs hover:brightness-110 transition-all flex items-center gap-2 shadow-sm"
          >
            <span className="material-symbols-outlined text-[16px]">upload_file</span>
            Upload Dataset (CSV/XLS)
          </button>
        </div>
      </div>

      {/* Grid of CPSE Connected Systems */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
        {cpseList.map((cpse) => (
          <div 
            key={cpse.id}
            className="bg-surface-container border border-outline-variant/40 rounded-2xl p-5 shadow-sm flex flex-col justify-between relative overflow-hidden card-interactive"
          >
            <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-primary to-transparent opacity-50" />

            <div>
              <div className="flex justify-between items-start mb-3">
                <div>
                  <span className="font-display-cnmc text-lg font-bold text-on-surface">{cpse.name}</span>
                  <p className="font-body-standard text-xs text-on-surface-variant line-clamp-1">{cpse.fullName}</p>
                </div>
                <span className={`px-2.5 py-0.5 rounded-full font-label-caps text-[10px] font-bold uppercase ${
                  cpse.status === 'HEALTHY' 
                    ? 'bg-status-success/15 text-status-success border border-status-success/30' 
                    : 'bg-status-warning/15 text-status-warning border border-status-warning/30'
                }`}>
                  {cpse.status}
                </span>
              </div>

              <div className="bg-surface-container-low p-3.5 rounded-xl border border-outline-variant/30 space-y-2 mb-4 font-data-mono text-xs">
                <div className="flex justify-between text-on-surface-variant">
                  <span>ERP System:</span>
                  <span className="text-on-surface font-medium">{cpse.sourceSystem}</span>
                </div>
                <div className="flex justify-between text-on-surface-variant">
                  <span>Total Local Codes:</span>
                  <span className="text-on-surface font-medium">{cpse.totalRecords.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-on-surface-variant">
                  <span>Harmonized Mapped:</span>
                  <span className="text-primary font-medium">{cpse.mappedRecords.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-on-surface-variant">
                  <span>Pending Backlog:</span>
                  <span className="text-relationship-near font-medium">{cpse.pendingRecords.toLocaleString()}</span>
                </div>
              </div>

              {/* Progress */}
              <div className="mb-4">
                <div className="flex justify-between text-xs font-data-mono mb-1">
                  <span className="text-on-surface-variant">Harmonization Progress</span>
                  <span className="text-primary font-bold">{cpse.coveragePercentage}%</span>
                </div>
                <div className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-relationship-identical h-full transition-all duration-500 rounded-full"
                    style={{ width: `${cpse.coveragePercentage}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-outline-variant/30 flex justify-between items-center text-xs font-data-mono gap-2">
              <span className="text-on-surface-variant text-[11px] truncate">Synced: {cpse.lastSync}</span>
              
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={() => openUploadModal(cpse.name)}
                  title={`Upload CSV/XLS for ${cpse.name}`}
                  className="px-2.5 py-1.5 bg-surface-container-high hover:bg-surface-container-highest text-primary border border-outline-variant/40 rounded-lg font-body-bold text-[11px] flex items-center gap-1 transition-colors"
                >
                  <span className="material-symbols-outlined text-[14px]">upload</span>
                  Upload
                </button>

                <button
                  disabled={syncingId === cpse.id}
                  onClick={() => handleTriggerSync(cpse.id, cpse.name)}
                  className="px-2.5 py-1.5 bg-surface-container-high hover:bg-surface-container-highest text-on-surface border border-outline-variant/40 rounded-lg font-body-bold text-[11px] flex items-center gap-1 transition-colors"
                >
                  <span className={`material-symbols-outlined text-[14px] ${syncingId === cpse.id ? 'animate-spin' : ''}`}>
                    sync
                  </span>
                  {syncingId === cpse.id ? 'Syncing...' : 'Sync'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
};
