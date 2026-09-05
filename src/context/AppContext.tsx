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
import {
  getCPSEList,
  getCanonicalMaterials,
  getCanonicalDetail,
  getEquivalenceGroups,
  reviewEquivalenceGroup,
  bulkReviewEquivalenceGroups,
  getAuditLogs,
  getNationalAnalytics,
  NationalAnalyticsData
} from '../services/api';

export type ScreenType =
  | 'landing'
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

export interface Toast {
  id: string;
  type: 'success' | 'warning' | 'error' | 'info';
  message: string;
}

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

  // Analytics & KPIs
  nationalAnalytics: NationalAnalyticsData | null;
  refreshData: () => Promise<void>;

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

  // Sidebar state
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (v: boolean) => void;
  sidebarOpenGroups: string[];
  toggleSidebarGroup: (group: string) => void;

  // Search spotlight
  searchOpen: boolean;
  setSearchOpen: (v: boolean) => void;

  // Toast
  toasts: Toast[];
  addToast: (type: Toast['type'], message: string) => void;
  removeToast: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [activeScreen, setActiveScreen] = useState<ScreenType>('landing');

  // Sidebar
  const [sidebarCollapsed, setSidebarCollapsedState] = useState<boolean>(() => {
    try { return localStorage.getItem('sidebar-collapsed') === 'true'; } catch { return false; }
  });
  const [sidebarOpenGroups, setSidebarOpenGroups] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('sidebar-open-groups');
      return saved ? JSON.parse(saved) : ['overview', 'catalog'];
    } catch { return ['overview', 'catalog']; }
  });
  const setSidebarCollapsed = (v: boolean) => {
    setSidebarCollapsedState(v);
    try { localStorage.setItem('sidebar-collapsed', String(v)); } catch { /* noop */ }
  };
  const toggleSidebarGroup = (group: string) => {
    setSidebarOpenGroups(prev => {
      const next = prev.includes(group) ? prev.filter(g => g !== group) : [...prev, group];
      try { localStorage.setItem('sidebar-open-groups', JSON.stringify(next)); } catch { /* noop */ }
      return next;
    });
  };

  // Search spotlight
  const [searchOpen, setSearchOpen] = useState<boolean>(false);

  // Toasts
  const [toasts, setToasts] = useState<Toast[]>([]);
  const addToast = (type: Toast['type'], message: string) => {
    const id = `toast-${Date.now()}`;
    setToasts(prev => [...prev.slice(-2), { id, type, message }]);
    setTimeout(() => removeToast(id), 3500);
  };
  const removeToast = (id: string) => setToasts(prev => prev.filter(t => t.id !== id));
  const [selectedCnmcId, setSelectedCnmcId] = useState<string>('CNMC-00018427');
  const [catalogueMaterials, setCatalogueMaterials] = useState<CanonicalMaterial[]>(mockCatalogueMaterials);

  // Review items state
  const [reviewQueue, setReviewQueue] = useState<MatchCandidate[]>(mockReviewQueueItems);
  const [selectedReviewIds, setSelectedReviewIds] = useState<string[]>([]);

  // Harmonization queue state
  const [tasksQueue, setTasksQueue] = useState<HarmonizationTask[]>(mockHarmonizationTasks);
  const [currentTaskIndex, setCurrentTaskIndex] = useState<number>(0);

  // Live National Analytics
  const [nationalAnalytics, setNationalAnalytics] = useState<NationalAnalyticsData | null>(null);

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
    onConfirm: () => { }
  });

  // Data Upload Modal
  const [uploadModalOpen, setUploadModalOpen] = useState<boolean>(false);
  const [uploadTargetCpse, setUploadTargetCpse] = useState<string>('ONGC');

  const [globalSearch, setGlobalSearch] = useState<string>('');

  // Live material detail fetched from backend
  const [liveDetail, setLiveDetail] = useState<CanonicalMaterial | null>(null);

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

  // Hydrate live data from FastAPI backend on mount and manual refresh
  const refreshData = async () => {
    try {
      const [liveAnalytics, liveCpses, liveMasters, liveLogs, liveGroups] = await Promise.all([
        getNationalAnalytics(),
        getCPSEList(),
        getCanonicalMaterials('', 100),
        getAuditLogs(50),
        getEquivalenceGroups('PROPOSED')
      ]);

      if (liveAnalytics) {
          setNationalAnalytics(liveAnalytics);
          if (liveAnalytics.actions_breakdown) {
            const totalAct = Object.values(liveAnalytics.actions_breakdown).reduce((a: number, b: any) => a + Number(b), 0) || 1;
            setRationalizationActions([
              {
                id: 'merge',
                actionType: 'MERGE',
                title: 'MERGE Duplicates',
                percentage: Math.round(((liveAnalytics.actions_breakdown['MERGE'] || 41) / totalAct) * 100),
                recordCount: `${liveAnalytics.actions_breakdown['MERGE'] || 41} items`,
                targetCount: liveAnalytics.actions_breakdown['MERGE'] || 41,
                description: 'Safely merges identical source records into a single CNMC with full traceability and alias forwarding.'
              },
              {
                id: 'map',
                actionType: 'MAP',
                title: 'MAP to Master',
                percentage: Math.round(((liveAnalytics.actions_breakdown['MAP'] || 12) / totalAct) * 100),
                recordCount: `${liveAnalytics.actions_breakdown['MAP'] || 12} items`,
                targetCount: liveAnalytics.actions_breakdown['MAP'] || 12,
                description: 'Establishes persistent bi-directional cross-references between CPSE codes and national master specifications.'
              },
              {
                id: 'retire',
                actionType: 'RETIRE',
                title: 'RETIRE Obsolete',
                percentage: Math.round(((liveAnalytics.actions_breakdown['RETIRE'] || 5) / totalAct) * 100),
                recordCount: `${liveAnalytics.actions_breakdown['RETIRE'] || 5} items`,
                targetCount: liveAnalytics.actions_breakdown['RETIRE'] || 5,
                description: 'Deprecates discontinued equipment parts, redundant specifications, and zero-inventory legacy master items.'
              },
              {
                id: 'review',
                actionType: 'REVIEW',
                title: 'REVIEW Flagged',
                percentage: Math.round(((liveAnalytics.actions_breakdown['REVIEW'] || 15) / totalAct) * 100),
                recordCount: `${liveAnalytics.actions_breakdown['REVIEW'] || 15} items`,
                targetCount: liveAnalytics.actions_breakdown['REVIEW'] || 15,
                description: 'Routes attribute discrepancies and physical contradictions to technical committees for physical inspection.'
              }
            ]);
          }
        }

        if (liveCpses && liveCpses.length > 0) {
          setCpseList(liveCpses);
        }

        if (liveMasters && liveMasters.length > 0) {
          const mappedMasters: CanonicalMaterial[] = liveMasters.map((m: any) => ({
            cnmc: m.cnmc,
            canonicalDescription: m.canonical_description,
            materialGroup: m.category_code || 'MG-001',
            materialGroupName: m.category_code || 'Mechanical & Piping',
            version: String(m.version || '1.0'),
            lifecycleStatus: m.status || 'Active',
            status: m.status || 'Active',
            confidenceScore: 98,
            attributes: m.canonical_attributes || {},
            specifications: m.canonical_attributes || {},
            standardUOM: 'NOS',
            mappings: (m.mappings || []).map((mapItem: any) => ({
              cpse: mapItem.cpse,
              localCode: mapItem.localCode,
              localDescription: mapItem.localDescription,
              relationship: mapItem.relationship || 'IDENTICAL',
              status: mapItem.status || 'Harmonized',
              lastUpdated: mapItem.lastUpdated || 'Today',
              mappedBy: mapItem.mappedBy || 'National Master Steward'
            })),
            functionalEquivalents: [],
            governanceTrail: [],
            createdDate: m.created_at ? m.created_at.slice(0, 10) : '2024-01-10',
            lastUpdated: m.updated_at ? m.updated_at.slice(0, 10) : 'Today'
          }));
          setCatalogueMaterials(mappedMasters);
          if (mappedMasters[0]) {
            setSelectedCnmcId(mappedMasters[0].cnmc);
          }
        }

        if (liveLogs && liveLogs.length > 0) {
          const mappedLogs: AuditLog[] = liveLogs.map((l: any) => {
            let desc = l.details || `${l.action} on ${l.object_type}`;
            try {
              if (typeof l.details === 'string' && l.details.startsWith('{')) {
                const parsed = JSON.parse(l.details);
                if (parsed.reason) desc = parsed.reason;
                else if (parsed.message) desc = parsed.message;
              }
            } catch {
              // fallback
            }
            return {
              id: l.id,
              timestamp: l.timestamp ? l.timestamp.replace('T', ' ').slice(0, 16) : 'Just now',
              action: l.action.replace(/_/g, ' '),
              description: desc,
              user: {
                name: l.actor === 'NATIONAL_MASTER_STEWARD' ? 'A. Kumar' : (l.actor === 'CPSE_GATEWAY_SYNC_AGENT' ? 'Sync Gateway' : l.actor),
                role: l.actor.includes('STEWARD') ? 'National Master Steward' : 'AI Engine',
                isAi: !l.actor.includes('STEWARD'),
                initials: l.actor.includes('STEWARD') ? 'AK' : 'AI'
              },
              targetEntity: l.object_id
            };
          });
          setAuditLogs(mappedLogs);
        }

        if (liveGroups && liveGroups.length > 0) {
          const mappedReviewQueue: MatchCandidate[] = liveGroups.map((g: any) => {
            const anchor = g.members?.find((m: any) => m.is_anchor === 1) || g.members?.[0];
            const candidate = g.members?.find((m: any) => m.is_anchor === 0) || g.members?.[1] || anchor;
            const evidence = g.evidence_payload || {};
            const conflicts = evidence.conflicts || [];
            
            return {
              id: g.id,
              priority: conflicts.length > 0 ? 'CRITICAL' : (g.confidence_score >= 0.85 ? 'HIGH' : 'MEDIUM'),
              sourceCpse: candidate?.cpse_id || 'ONGC',
              sourceCode: candidate?.source_material_code || 'MAT-001',
              sourceDescription: candidate?.source_description || '',
              sourceUom: candidate?.source_uom || 'NOS',
              candidateCnmc: g.proposed_cnmc || 'CNMC-PENDING',
              candidateDescription: anchor?.source_description || candidate?.source_description || '',
              relationship: g.relationship_type || 'NEAR-DUPLICATE',
              confidence: Math.round((g.confidence_score || 0.8) * 100),
              conflicts: conflicts.join(', '),
              age: '1h',
              status: 'PENDING',
              attributeAgreement: Math.round((g.attribute_score || 0.85) * 100),
              sourceAttributes: {
                nominalSize: candidate?.dimensions,
                pressureClass: candidate?.pressure_rating,
                grade: candidate?.material_grade,
                standard: candidate?.standard,
                baseUOM: candidate?.source_uom
              },
              candidateAttributes: {
                nominalSize: anchor?.dimensions,
                pressureClass: anchor?.pressure_rating,
                grade: anchor?.material_grade,
                standard: anchor?.standard,
                baseUOM: anchor?.source_uom
              },
              explanation: conflicts.length > 0
                ? `Critical contradiction detected: ${conflicts.join('; ')}. Physical parameter conflict requires steward review.`
                : `AI Equivalence detected between ${candidate?.source_material_code} and ${anchor?.source_material_code} with high semantic agreement.`,
              ingestedAt: 'Today'
            };
          });
          setReviewQueue(mappedReviewQueue);

          // Map live groups to Harmonization tasks
          const mappedTasks: HarmonizationTask[] = liveGroups.map((g: any, idx: number) => {
            const anchor = g.members?.find((m: any) => m.is_anchor === 1) || g.members?.[0];
            const candidate = g.members?.find((m: any) => m.is_anchor === 0) || g.members?.[1] || anchor;
            const evidence = g.evidence_payload || {};
            const conflicts = evidence.conflicts || [];

            return {
              taskId: g.id || `TASK-${idx + 1}`,
              queueName: conflicts.length > 0 ? 'Safety Contradiction Queue' : 'Fast-Track Harmonization',
              remainingCount: liveGroups.length - idx,
              totalCount: liveGroups.length,
              source: {
                cpse: candidate?.cpse_id || 'ONGC',
                localCode: candidate?.source_material_code || `MAT-00${idx + 1}`,
                rawDescription: candidate?.source_description || '',
                extractedSpecs: {
                  material: candidate?.material_grade || 'ASTM A105',
                  size: candidate?.dimensions || '2 INCH',
                  type: candidate?.material_noun || 'BALL VALVE',
                  grade: candidate?.material_grade || 'A105',
                  standard: candidate?.standard || 'API 6D'
                },
                systemMetadata: {
                  legacySystemId: `SAP-${candidate?.cpse_id || 'ONGC'}`,
                  plantLocation: `${candidate?.cpse_id || 'ONGC'} Plant Asset`,
                  lastModified: 'Today'
                },
                uom: candidate?.source_uom || 'NOS'
              },
              candidate: {
                proposedCnmc: g.proposed_cnmc || `CNMC-000${18400 + idx}`,
                canonicalDescription: anchor?.source_description || candidate?.source_description || '',
                matchType: (g.relationship_type === 'IDENTICAL' ? 'Exact Match' : 'Near-Duplicate') as any,
                confidenceScore: Math.round((g.confidence_score || 0.85) * 100),
                mappingImpact: {
                  linkedCpseCodesCount: (g.members || []).length,
                  sampleCodes: (g.members || []).map((m: any) => m.source_material_code || '')
                }
              },
              aiAnalysis: {
                confidence: Math.round((g.confidence_score || 0.85) * 100),
                normalizedMapping: {
                  noun: anchor?.material_noun || candidate?.material_noun || 'VALVE',
                  modifier: anchor?.material_modifier || candidate?.material_modifier || 'BALL',
                  size: anchor?.dimensions || candidate?.dimensions || '2"',
                  material: anchor?.material_grade || candidate?.material_grade || 'ASTM A105'
                },
                conflict: conflicts.length > 0 ? {
                  title: 'Deterministic Safety Hazard',
                  description: `Contradiction detected: ${conflicts.join('; ')}`,
                  inferredField: conflicts[0]?.includes('pressure') ? 'pressure_rating' : 'material_grade',
                  inferredValue: conflicts[0] || ''
                } : undefined,
                evidenceNotes: conflicts.length > 0
                  ? [`Safety Blocker Active: Contradiction in ${conflicts.join(', ')}`, `Auto-merging blocked. Requires manual steward review.`]
                  : [`Deterministic attribute parity verified across dimensions and standards`, `Semantic cosine agreement: ${(g.semantic_score || 0.92).toFixed(2)}`]
              }
            };
          });
          setTasksQueue(mappedTasks);
        }
      } catch (err) {
        console.warn('Live backend hydration encountered an issue, using default data:', err);
      }
    };

    useEffect(() => {
      refreshData();
    }, []);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const currentMaterial = (liveDetail && liveDetail.cnmc === selectedCnmcId)
    ? liveDetail
    : (catalogueMaterials.find(m => m.cnmc === selectedCnmcId) || mockCanonicalDetail);

  const currentTask = tasksQueue[currentTaskIndex] || tasksQueue[0];

  const navigateToMaterial = async (cnmc: string) => {
    setSelectedCnmcId(cnmc);
    setActiveScreen('detail');
    try {
      const detail = await getCanonicalDetail(cnmc);
      if (detail) {
        setLiveDetail({
          cnmc: detail.cnmc,
          canonicalDescription: detail.canonical_description,
          materialGroup: detail.category_code || 'MG-001',
          materialGroupName: detail.category_code || 'General Mechanical & Piping',
          version: String(detail.version || '1.0.0'),
          lifecycleStatus: detail.status || 'Active',
          confidenceScore: 98,
          attributes: detail.canonical_attributes || {},
          specifications: detail.canonical_attributes || {},
          standardUOM: 'NOS',
          mappings: (detail.mappings || []).map((m: any) => ({
            cpse: m.cpse,
            localCode: m.localCode,
            localDescription: m.localDescription,
            relationship: m.relationship || 'IDENTICAL',
            status: m.status || 'Harmonized',
            lastUpdated: m.lastUpdated || 'Today',
            mappedBy: m.mappedBy || 'National Master Steward'
          })),
          functionalEquivalents: [],
          governanceTrail: [],
          createdDate: detail.created_at ? detail.created_at.slice(0, 10) : '2024-01-10',
          lastUpdated: detail.updated_at ? detail.updated_at.slice(0, 10) : 'Today'
        });
      }
    } catch (err) {
      console.warn('Could not load live canonical detail:', err);
    }
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

    // Async sync with backend
    reviewEquivalenceGroup(id, 'MERGE', `Approved candidate ${item.sourceCode} for canonical ${item.candidateCnmc}`)
      .then(() => {
        addToast('success', `Candidate ${item.sourceCode} approved & harmonized.`);
      })
      .catch((err) => {
        console.warn('Backend sync for review item approval:', err);
      });

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

    // Async sync with backend
    bulkReviewEquivalenceGroups(ids, 'MERGE', `Bulk approved ${ids.length} candidates via Review Queue`)
      .then((res) => {
        addToast('success', res?.message || `Bulk approved ${ids.length} items successfully.`);
      })
      .catch((err) => {
        console.warn('Backend sync for bulk approval:', err);
      });

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

    // Async sync with backend
    reviewEquivalenceGroup(id, 'REVIEW', reason || 'Technical attribute discrepancy flagged')
      .then(() => {
        addToast('warning', `Item ${item.sourceCode} flagged for specialist review.`);
      })
      .catch((err) => {
        console.warn('Backend sync for flagging review item:', err);
      });

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
        nationalAnalytics,
        refreshData,
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
        setGlobalSearch,
        sidebarCollapsed,
        setSidebarCollapsed,
        sidebarOpenGroups,
        toggleSidebarGroup,
        searchOpen,
        setSearchOpen,
        toasts,
        addToast,
        removeToast
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
