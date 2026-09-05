import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

export const DataHubScreen: React.FC = () => {
  const { cpseList, addAuditLog, openUploadModal, addToast, setActiveScreen } = useApp();
  const [syncingId, setSyncingId] = useState<string | null>(null);

  const handleTriggerSync = (cpseId: string, name: string) => {
    setSyncingId(cpseId);
    setTimeout(() => {
      setSyncingId(null);
      addToast('success', `Delta ingestion complete for ${name} — 1,240 records updated.`);
      addAuditLog({
        action: 'Manual Ingestion Triggered',
        description: `Triggered delta ingestion connector for ${name} ERP. Pipeline executed successfully.`,
        user: { name: 'A. Kumar', role: 'Administrator', initials: 'AK' },
        targetEntity: cpseId,
      });
    }, 1500);
  };

  return (
    <main className="flex-1 overflow-y-auto px-8 py-6 space-y-6 bg-[#070908] text-[#F3F4F6]">
      {/* 1. Breadcrumbs & Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-medium text-[#9CA3AF]">
          <span 
            onClick={() => setActiveScreen('dashboard')} 
            className="cursor-pointer hover:text-[#F3F4F6] transition-colors"
          >
            Home
          </span>
          <span className="text-[#6B7280]">›</span>
          <span className="text-[#F3F4F6]">CPSE Data Hub</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => openUploadModal('ONGC')}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-[#10B981] text-[#000000] hover:brightness-110 transition-all shadow-sm"
          >
            <span className="material-symbols-outlined text-[16px]">upload_file</span>
            <span>Upload Dataset (CSV/XLS)</span>
          </button>
        </div>
      </div>

      {/* 2. Page Title Block */}
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-white font-sans">
          CPSE Data Hub & Connectors
        </h1>
        <p className="text-xs md:text-sm text-[#9CA3AF] leading-relaxed max-w-4xl">
          Real-time integration telemetry with enterprise ERP systems (SAP S/4HANA, Oracle ERP Cloud) and continuous ingestion pipelines.
        </p>
      </div>

      {/* 3. Hero Split Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-1">
        <div className="lg:col-span-7 space-y-2">
          <h2 className="text-sm font-semibold text-[#F3F4F6] tracking-normal font-sans">
            Enterprise Ingestion Pipeline
          </h2>
          <p className="text-xs text-[#9CA3AF] leading-relaxed font-sans">
            Connectors establish bi-directional sync with participating Central Public Sector Enterprises. Changes in local inventory, purchase requisitions, and specifications are automatically queued for semantic matching against the National Master.
          </p>
        </div>

        <div className="lg:col-span-5 grid grid-cols-3 gap-4 pt-1">
          <div>
            <div className="text-2xl lg:text-3xl font-bold font-sans text-white tracking-tight">
              6
            </div>
            <div className="text-xs font-semibold text-[#F3F4F6] mt-1 leading-tight">
              CPSEs Connected
            </div>
            <div className="text-[11px] text-[#6B7280] leading-snug">
              Active adapters
            </div>
          </div>

          <div>
            <div className="text-2xl lg:text-3xl font-bold font-sans text-[#10B981] tracking-tight">
              99.8%
            </div>
            <div className="text-xs font-semibold text-[#F3F4F6] mt-1 leading-tight">
              Pipeline Health
            </div>
            <div className="text-[11px] text-[#6B7280] leading-snug">
              Zero ingest lag
            </div>
          </div>

          <div>
            <div className="text-2xl lg:text-3xl font-bold font-sans text-[#22D3EE] tracking-tight">
              14.2M
            </div>
            <div className="text-xs font-semibold text-[#F3F4F6] mt-1 leading-tight">
              Total Ingested
            </div>
            <div className="text-[11px] text-[#6B7280] leading-snug">
              Catalog records
            </div>
          </div>
        </div>
      </div>

      {/* 4. CPSE Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {cpseList.map(cpse => (
          <div
            key={cpse.id}
            className="bg-[#0C0E0D] border border-[#232825] rounded-xl p-5 flex flex-col justify-between space-y-4 hover:border-[#38423C] transition-all"
          >
            <div>
              {/* Header: Avatar, Name, Status */}
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold font-mono shrink-0 shadow-sm text-white"
                    style={{
                      background: cpse.name.includes('ONGC') ? '#991B1B' : cpse.name.includes('IOCL') ? '#EA580C' : '#2563EB'
                    }}
                  >
                    {cpse.name[0]}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-white font-sans">{cpse.name}</h3>
                    <p className="text-xs text-[#9CA3AF] truncate max-w-[160px]">{cpse.fullName}</p>
                  </div>
                </div>

                <span
                  className={`px-2 py-0.5 rounded text-[11px] font-semibold font-mono ${
                    cpse.status === 'HEALTHY'
                      ? 'bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30'
                      : 'bg-[#EAB308]/15 text-[#EAB308] border border-[#EAB308]/30'
                  }`}
                >
                  {cpse.status}
                </span>
              </div>

              {/* Stats Grid */}
              <div className="rounded-lg p-3 bg-[#070908] border border-[#232825] space-y-2 text-xs font-mono">
                {[
                  { label: 'ERP System', val: cpse.sourceSystem, color: 'text-white' },
                  { label: 'Local Item Codes', val: cpse.totalRecords.toLocaleString(), color: 'text-[#9CA3AF]' },
                  { label: 'Harmonized CNMC', val: cpse.mappedRecords.toLocaleString(), color: 'text-[#10B981]' },
                  { label: 'Pending Queue', val: cpse.pendingRecords.toLocaleString(), color: 'text-[#EAB308]' },
                ].map(row => (
                  <div key={row.label} className="flex justify-between items-center">
                    <span className="text-[#6B7280] font-sans text-[11px]">{row.label}</span>
                    <span className={`font-semibold ${row.color}`}>{row.val}</span>
                  </div>
                ))}
              </div>

              {/* Progress Bar */}
              <div className="pt-3">
                <div className="flex justify-between text-xs mb-1.5 font-medium">
                  <span className="text-[#9CA3AF]">Harmonization Rate</span>
                  <span className="font-mono text-[#10B981] font-bold">{cpse.coveragePercentage}%</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-[#161B18] overflow-hidden">
                  <div
                    className="h-full bg-[#10B981] rounded-full transition-all duration-500"
                    style={{ width: `${cpse.coveragePercentage}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Sync Action Button */}
            <div className="pt-2 border-t border-[#1B201D] flex items-center justify-between">
              <span className="text-[11px] text-[#6B7280]">
                Last Sync: <strong className="text-[#9CA3AF] font-mono">{cpse.lastSync}</strong>
              </span>
              <button
                disabled={syncingId === cpse.id}
                onClick={() => handleTriggerSync(cpse.id, cpse.name)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-[#F3F4F6] bg-[#070908] border border-[#232825] hover:border-[#38423C] transition-all disabled:opacity-50"
              >
                <span className={`material-symbols-outlined text-[14px] ${syncingId === cpse.id ? 'animate-spin' : ''}`}>
                  sync
                </span>
                <span>{syncingId === cpse.id ? 'Syncing...' : 'Trigger Sync'}</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* 5. Footer */}
      <footer className="flex flex-col sm:flex-row items-center justify-between text-xs text-[#6B7280] pt-4 pb-2 border-t border-[#1B201D] gap-2">
        <div>
          National Material Master &nbsp;|&nbsp; Government of India &nbsp;|&nbsp; SIH26099
        </div>
        <div className="flex items-center gap-4">
          <a href="#privacy" className="hover:text-[#9CA3AF] transition-colors">Privacy</a>
          <a href="#terms" className="hover:text-[#9CA3AF] transition-colors">Terms</a>
          <a href="#contact" className="hover:text-[#9CA3AF] transition-colors">Contact</a>
        </div>
      </footer>
    </main>
  );
};
