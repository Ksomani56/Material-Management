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
    <main className="flex-1 overflow-y-auto p-6 bg-background space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-base font-bold text-on-surface tracking-tight">
            CPSE Data Hub & Connectors
          </h1>
          <p className="font-mono text-xs text-on-surface-variant mt-0.5">
            Real-time integration status with enterprise ERP systems and file ingestion pipelines
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {message && (
            <div className="px-3 py-1.5 bg-primary/10 border border-primary/30 text-primary text-xs rounded-lg font-mono flex items-center">
              <span className="material-symbols-outlined text-[15px] mr-1.5">check_circle</span>
              {message}
            </div>
          )}

          <button
            onClick={() => openUploadModal('ONGC')}
            className="px-3.5 py-1.5 bg-primary text-on-primary rounded-lg font-semibold text-xs hover:brightness-110 transition-all flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[15px]">upload_file</span>
            Upload Dataset (CSV/XLS)
          </button>
        </div>
      </div>

      {/* Grid of CPSE Connected Systems */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {cpseList.map((cpse) => (
          <div 
            key={cpse.id}
            className="bg-surface-container border border-outline-variant/60 rounded-xl p-5 flex flex-col justify-between card-interactive"
          >
            <div>
              <div className="flex justify-between items-start mb-3">
                <div>
                  <span className="font-mono text-base font-bold text-on-surface">{cpse.name}</span>
                  <p className="text-xs text-on-surface-variant line-clamp-1">{cpse.fullName}</p>
                </div>
                <span className={`px-2 py-0.5 rounded text-[10px] font-medium uppercase ${
                  cpse.status === 'HEALTHY' 
                    ? 'bg-status-success/10 text-status-success' 
                    : 'bg-status-warning/10 text-status-warning'
                }`}>
                  {cpse.status}
                </span>
              </div>

              <div className="bg-surface-container-low p-3 rounded-lg border border-outline-variant/40 space-y-1.5 mb-4 font-mono text-xs">
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
                  <span className="text-status-warning font-medium">{cpse.pendingRecords.toLocaleString()}</span>
                </div>
              </div>

              {/* Progress */}
              <div className="mb-4">
                <div className="flex justify-between text-xs font-mono mb-1">
                  <span className="text-on-surface-variant">Harmonization Progress</span>
                  <span className="text-primary font-bold">{cpse.coveragePercentage}%</span>
                </div>
                <div className="w-full bg-surface-container-high h-1.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-primary h-full transition-all duration-300 rounded-full"
                    style={{ width: `${cpse.coveragePercentage}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-outline-variant/40 flex justify-between items-center text-xs font-mono gap-2">
              <span className="text-on-surface-variant text-[11px] truncate">Synced: {cpse.lastSync}</span>
              
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={() => openUploadModal(cpse.name)}
                  title={`Upload CSV/XLS for ${cpse.name}`}
                  className="px-2.5 py-1 bg-surface-container-high hover:bg-surface-container-highest text-primary border border-outline-variant/60 rounded-md text-[11px] font-medium flex items-center gap-1 transition-colors"
                >
                  <span className="material-symbols-outlined text-[13px]">upload</span>
                  Upload
                </button>

                <button
                  disabled={syncingId === cpse.id}
                  onClick={() => handleTriggerSync(cpse.id, cpse.name)}
                  className="px-2.5 py-1 bg-surface-container-high hover:bg-surface-container-highest text-on-surface border border-outline-variant/60 rounded-md text-[11px] font-medium flex items-center gap-1 transition-colors"
                >
                  <span className={`material-symbols-outlined text-[13px] ${syncingId === cpse.id ? 'animate-spin' : ''}`}>
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
