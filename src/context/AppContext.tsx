import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  MatchCandidate, 
  CanonicalMaterial, 
  HarmonizationTask, 
  AuditLog, 
  CPSE, 
  RationalizationAction 
} from '../types/material';
import { 
  mockCPSEs, 
  mockReviewQueueItems, 
  mockHarmonizationTasks, 
  mockCanonicalDetail, 
  mockCatalogueMaterials, 
  mockRationalizationActions 
} from '../data/mockData';
import { ParsedMaterialRecord } from '../utils/fileParser';

export type ScreenType = 
  | 'home'
  | 'dashboard' 
  | 'datahub' 
  | 'harmonization' 
  | 'master' 
  | 'detail' 
  | 'review' 
  | 'rationalization' 
  | 'analytics' 
  | 'governance'
  | 'settings'
  | 'support';

interface ImpactModalConfig {
  isOpen: boolean;
  action: string;
  title: string;
  sourceCode: string;
  targetCnmc?: string;
  impactedCount: number;
  onConfirm: () => void;
}

interface AppContextType {
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  activeScreen: ScreenType;
  setActiveScreen: (screen: ScreenType) => void;
  
  // Material Details
  selectedCnmcId: string;
  currentMaterial: CanonicalMaterial;
  catalogueMaterials: CanonicalMaterial[];
  navigateToMaterial: (cnmc: string) => void;
  
  // Review Queue
  reviewQueue: MatchCandidate[];
  selectedReviewIds: string[];
  toggleSelectReviewItem: (id: string) => void;
  toggleSelectAllReviewItems: (selectAll: boolean) => void;
  approveReviewItem: (id: string) => void;
  bulkApproveReviewItems: (ids: string[]) => void;
  flagReviewItem: (id: string, reason?: string) => void;
  
  // Harmonization
  currentTaskIndex: number;
  currentTask: HarmonizationTask;
  tasksQueue: HarmonizationTask[];
  commitHarmonization: () => void;
  skipHarmonization: () => void;
  flagHarmonization: () => void;
  
  // Rationalization & Entities
  rationalizationActions: RationalizationAction[];
  cpseList: CPSE[];
  
  // Governance & Audit
  auditLogs: AuditLog[];
  addAuditLog: (entry: Omit<AuditLog, 'id' | 'timestamp'>) => void;
  
  // Evidence Drawer
  evidenceDrawerOpen: boolean;
  evidenceTarget: MatchCandidate | CanonicalMaterial | null;
  openEvidence: (target: MatchCandidate | CanonicalMaterial) => void;
  closeEvidence: () => void;
  
  // Impact Modal
  impactModal: ImpactModalConfig;
  openImpactModal: (config: Omit<ImpactModalConfig, 'isOpen'>) => void;
  closeImpactModal: () => void;
  
  // File Upload & Data Import
  uploadModalOpen: boolean;
  uploadTargetCpse: string;
  openUploadModal: (targetCpse?: string) => void;
  closeUploadModal: () => void;
  importParsedRecords: (records: ParsedMaterialRecord[], targetCpse: string, destination: 'review' | 'master') => void;

  // Global search
  globalSearch: string;
  setGlobalSearch: (q: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [activeScreen, setActiveScreen] = useState<ScreenType>('home');
  const [selectedCnmcId, setSelectedCnmcId] = useState<string>('CNMC-00018427');
  const [catalogueMaterials, setCatalogueMaterials] = useState<CanonicalMaterial[]>(mockCatalogueMaterials);
  
  // Review items state
  const [reviewQueue, setReviewQueue] = useState<MatchCandidate[]>(mockReviewQueueItems);
  const [selectedReviewIds, setSelectedReviewIds] = useState<string[]>([]);
  
  // Harmonization queue state
  const [tasksQueue] = useState<HarmonizationTask[]>(mockHarmonizationTasks);
  const [currentTaskIndex, setCurrentTaskIndex] = useState<number>(0);
  
  // Entities & actions
  const [cpseList, setCpseList] = useState<CPSE[]>(mockCPSEs);
  const [rationalizationActions, setRationalizationActions] = useState<RationalizationAction[]>(mockRationalizationActions);
  
  // Audit trail
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([
    ...mockCanonicalDetail.governanceTrail,
    {
      id: 'AUD-005',
      timestamp: 'Today, 10:15',
      action: 'Batch Ingestion Synced',
      description: 'ONGC Western Offshore ERP synchronized 4,200 updated technical master records.',
      user: {
        name: 'Automated Sync Agent',
        role: 'Gateway Connector',
        isAi: true
      },
      targetEntity: 'ONGC-SAP-01'
    }
  ]);
  
  // Evidence Drawer
  const [evidenceDrawerOpen, setEvidenceDrawerOpen] = useState<boolean>(false);
  const [evidenceTarget, setEvidenceTarget] = useState<MatchCandidate | CanonicalMaterial | null>(null);
  
  // Impact Modal
  const [impactModal, setImpactModal] = useState<ImpactModalConfig>({
    isOpen: false,
    action: 'MERGE',
    title: 'Confirm Operation',
    sourceCode: '',
    impactedCount: 0,
    onConfirm: () => {}
  });

  // Data Upload Modal
  const [uploadModalOpen, setUploadModalOpen] = useState<boolean>(false);
  const [uploadTargetCpse, setUploadTargetCpse] = useState<string>('ONGC');
  
  const [globalSearch, setGlobalSearch] = useState<string>('');

  // Sync theme to DOM
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const currentMaterial = catalogueMaterials.find(m => m.cnmc === selectedCnmcId) || mockCanonicalDetail;
  const currentTask = tasksQueue[currentTaskIndex] || tasksQueue[0];

  const navigateToMaterial = (cnmc: string) => {
    setSelectedCnmcId(cnmc);
    setActiveScreen('detail');
  };

  const addAuditLog = (entry: Omit<AuditLog, 'id' | 'timestamp'>) => {
    const newLog: AuditLog = {
      id: `AUD-${Date.now().toString().slice(-4)}`,
      timestamp: 'Just now',
      ...entry
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  // Upload modal handlers
  const openUploadModal = (targetCpse = 'ONGC') => {
    setUploadTargetCpse(targetCpse);
    setUploadModalOpen(true);
  };

  const closeUploadModal = () => {
    setUploadModalOpen(false);
  };

  const importParsedRecords = (records: ParsedMaterialRecord[], targetCpse: string, destination: 'review' | 'master') => {
    if (records.length === 0) return;

    if (destination === 'review') {
      const newReviewItems: MatchCandidate[] = records.map((rec, i) => ({
        id: `REV-IMP-${Date.now()}-${i}`,
        sourceCode: rec.localCode,
        sourceCpse: rec.cpse || targetCpse,
        sourceDescription: rec.description,
        sourceUom: rec.uom || 'NOS',
        candidateCnmc: rec.candidateCnmc || `CNMC-000${Math.floor(10000 + Math.random() * 89999)}`,
        candidateDescription: rec.description,
        confidence: rec.confidence || 92,
        relationship: (rec.confidence && rec.confidence > 95) ? 'IDENTICAL' : 'DUPLICATE',
        explanation: `Synthesized via batch ingestion from uploaded file (${rec.cpse || targetCpse}). Automatic attribute alignment calculated with high semantic fidelity.`,
        priority: (rec.confidence && rec.confidence > 92) ? 'HIGH' : 'MEDIUM',
        age: 'Just now',
        status: 'PENDING',
        attributeAgreement: rec.confidence || 92,
        sourceAttributes: {
          baseUOM: rec.uom || 'NOS',
          ...rec.specifications
        },
        candidateAttributes: {
          baseUOM: rec.uom || 'NOS',
          ...rec.specifications
        },
        ingestedAt: 'Just now'
      }));

      setReviewQueue(prev => [...newReviewItems, ...prev]);
      setActiveScreen('review');
    } else {
      // Add to Master Catalogue
      const newMasters: CanonicalMaterial[] = records.map((rec, i) => ({
        cnmc: rec.candidateCnmc || `CNMC-000${Math.floor(10000 + Math.random() * 89999)}`,
        canonicalDescription: rec.description,
        materialGroup: 'MG-001',
        materialGroupName: rec.category || 'Mechanical & Piping',
        version: '1.0.0',
        standardUOM: rec.uom || 'NOS',
        lifecycleStatus: 'Active',
        status: 'Active',
        confidenceScore: rec.confidence || 95,
        createdDate: 'Today',
        lastUpdated: 'Just now',
        leadCataloger: 'System Batch Ingestion',
        attributes: {
          materialGroup: rec.category || 'Mechanical & Piping',
          baseMaterial: rec.specifications['basematerial'] || 'Standard Engineering Grade',
          nominalSize: rec.specifications['nominalsize'] || 'Standard Size',
          pressureClass: rec.specifications['pressureclass'] || 'Class 150',
          baseUOM: rec.uom || 'NOS'
        },
        specifications: {
          materialGroup: rec.category || 'Mechanical & Piping',
          baseMaterial: rec.specifications['basematerial'] || 'Standard Engineering Grade',
          nominalSize: rec.specifications['nominalsize'] || 'Standard Size',
          pressureClass: rec.specifications['pressureclass'] || 'Class 150',
          baseUOM: rec.uom || 'NOS'
        },
        mappings: [
          {
            cpse: rec.cpse || targetCpse,
            localCode: rec.localCode,
            localDescription: rec.description,
            relationship: 'IDENTICAL',
            status: 'Harmonized',
            lastUpdated: 'Just now',
            mappedBy: 'Batch Importer'
          }
        ],
        functionalEquivalents: [],
        governanceTrail: [
          {
            id: `AUD-IMP-${i}`,
            timestamp: 'Just now',
            action: 'File Ingestion Registered',
            description: `Imported via spreadsheet batch dataset into National Canonical Master.`,
            user: { name: 'Batch Ingestion Agent', role: 'Data Steward', isAi: true },
            targetEntity: rec.localCode
          }
        ]
      }));

      setCatalogueMaterials(prev => [...newMasters, ...prev]);
      setActiveScreen('master');
    }

    // Update CPSE record stats
    setCpseList(prev => prev.map(c => {
      if (c.id === targetCpse || c.name === targetCpse) {
        const total = c.totalRecords + records.length;
        const mapped = c.mappedRecords + Math.round(records.length * 0.85);
        return {
          ...c,
          totalRecords: total,
          mappedRecords: mapped,
          pendingRecords: c.pendingRecords + Math.round(records.length * 0.15),
          coveragePercentage: Number(((mapped / total) * 100).toFixed(1)),
          lastSync: 'Just now'
        };
      }
      return c;
    }));

    addAuditLog({
      action: 'Batch Dataset Uploaded & Ingested',
      description: `Uploaded and processed ${records.length} records for ${targetCpse}. Integrated into ${destination === 'review' ? 'Review Backlog Queue' : 'National Master Catalogue'}.`,
      user: {
        name: 'A. Kumar',
        role: 'National Master Administrator',
        initials: 'AK'
      },
      targetEntity: `${records.length} Records (${targetCpse})`
    });

    closeUploadModal();
  };

  // Selection handlers
  const toggleSelectReviewItem = (id: string) => {
    setSelectedReviewIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const toggleSelectAllReviewItems = (selectAll: boolean) => {
    if (selectAll) {
      setSelectedReviewIds(reviewQueue.map(i => i.id));
    } else {
      setSelectedReviewIds([]);
    }
  };

  // Review actions
  const approveReviewItem = (id: string) => {
    const item = reviewQueue.find(i => i.id === id);
    if (!item) return;

    setReviewQueue(prev => prev.filter(i => i.id !== id));
    setSelectedReviewIds(prev => prev.filter(itemId => itemId !== id));

    addAuditLog({
      action: 'Candidate Approved & Harmonized',
      description: `${item.sourceCpse} local material ${item.sourceCode} successfully approved and linked to canonical ${item.candidateCnmc} (${item.relationship}).`,
      user: {
        name: 'A. Kumar',
        role: 'National Master Administrator',
        initials: 'AK'
      },
      targetEntity: item.sourceCode
    });

    // Update CPSE stats
    setCpseList(prev => prev.map(c => {
      if (c.id === item.sourceCpse) {
        const mapped = c.mappedRecords + 1;
        const pending = Math.max(0, c.pendingRecords - 1);
        return {
          ...c,
          mappedRecords: mapped,
          pendingRecords: pending,
          coveragePercentage: Number(((mapped / c.totalRecords) * 100).toFixed(1))
        };
      }
      return c;
    }));
  };

  const bulkApproveReviewItems = (ids: string[]) => {
    if (ids.length === 0) return;
    
    setReviewQueue(prev => prev.filter(i => !ids.includes(i.id)));
    setSelectedReviewIds([]);

    addAuditLog({
      action: 'Bulk Approval Executed',
      description: `Bulk approved and harmonized ${ids.length} material candidates across CPSEs into National Master.`,
      user: {
        name: 'A. Kumar',
        role: 'National Master Administrator',
        initials: 'AK'
      },
      targetEntity: `${ids.length} Records`
    });
  };

  const flagReviewItem = (id: string, reason?: string) => {
    const item = reviewQueue.find(i => i.id === id);
    if (!item) return;

    setReviewQueue(prev => prev.map(i => i.id === id ? { ...i, status: 'FLAGGED' } : i));

    addAuditLog({
      action: 'Item Flagged for Technical Review',
      description: `${item.sourceCpse} code ${item.sourceCode} flagged for specialist review: ${reason || 'Technical attribute discrepancy'}.`,
      user: {
        name: 'S. Gupta',
        role: 'Senior Data Steward',
        initials: 'SG'
      },
      targetEntity: item.sourceCode
    });
  };

  // Harmonization actions
  const commitHarmonization = () => {
    const task = currentTask;
    
    addAuditLog({
      action: 'Harmonization Committed',
      description: `${task.source.cpse} code ${task.source.localCode} approved and committed to CNMC ${task.candidate.proposedCnmc} (${task.candidate.matchType}).`,
      user: {
        name: 'A. Kumar',
        role: 'Lead Cataloger',
        initials: 'AK'
      },
      targetEntity: task.candidate.proposedCnmc
    });

    // Advance task
    setCurrentTaskIndex(prev => (prev + 1) % tasksQueue.length);
  };

  const skipHarmonization = () => {
    setCurrentTaskIndex(prev => (prev + 1) % tasksQueue.length);
  };

  const flagHarmonization = () => {
    addAuditLog({
      action: 'Task Flagged for Review',
      description: `Harmonization task ${currentTask.taskId} flagged for domain expert committee validation.`,
      user: {
        name: 'A. Kumar',
        role: 'Lead Cataloger',
        initials: 'AK'
      },
      targetEntity: currentTask.taskId
    });
    setCurrentTaskIndex(prev => (prev + 1) % tasksQueue.length);
  };

  // Evidence Drawer handlers
  const openEvidence = (target: MatchCandidate | CanonicalMaterial) => {
    setEvidenceTarget(target);
    setEvidenceDrawerOpen(true);
  };

  const closeEvidence = () => {
    setEvidenceDrawerOpen(false);
    setEvidenceTarget(null);
  };

  // Impact modal handlers
  const openImpactModal = (config: Omit<ImpactModalConfig, 'isOpen'>) => {
    setImpactModal({ ...config, isOpen: true });
  };

  const closeImpactModal = () => {
    setImpactModal(prev => ({ ...prev, isOpen: false }));
  };

  return (
    <AppContext.Provider
      value={{
        theme,
        toggleTheme,
        activeScreen,
        setActiveScreen,
        selectedCnmcId,
        currentMaterial,
        catalogueMaterials,
        navigateToMaterial,
        reviewQueue,
        selectedReviewIds,
        toggleSelectReviewItem,
        toggleSelectAllReviewItems,
        approveReviewItem,
        bulkApproveReviewItems,
        flagReviewItem,
        currentTaskIndex,
        currentTask,
        tasksQueue,
        commitHarmonization,
        skipHarmonization,
        flagHarmonization,
        rationalizationActions,
        cpseList,
        auditLogs,
        addAuditLog,
        evidenceDrawerOpen,
        evidenceTarget,
        openEvidence,
        closeEvidence,
        impactModal,
        openImpactModal,
        closeImpactModal,
        uploadModalOpen,
        uploadTargetCpse,
        openUploadModal,
        closeUploadModal,
        importParsedRecords,
        globalSearch,
        setGlobalSearch
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
