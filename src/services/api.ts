/**
 * National Unified Material Master (NUMM) - Frontend API Service Layer
 * Connects the React application directly to the offline FastAPI backend.
 */

const API_BASE = '/api';

export interface NationalAnalyticsData {
  total_cpse_count: number;
  total_source_materials: number;
  total_canonical_cnmcs: number;
  deduplication_ratio_pct: number;
  total_equivalence_groups: number;
  pending_reviews_count: number;
  approved_mappings_count: number;
  actions_breakdown: Record<string, number>;
  cpse_breakdown: Record<string, number>;
  total_spend_aggregated: number;
  spend_coverage_currency: string;
  estimated_synergy_savings: number;
  confidence_bands_breakdown: Record<string, number>;
}

export interface LiveHarmonizeResult {
  source_description: string;
  normalized_description: string;
  source_uom: string;
  normalized_uom: string;
  extracted_attributes: Record<string, any>;
  standardized_description: string;
  unspsc_code: string;
  category_name: string;
  vector_dimension: number;
  vector_sample: number[];
}

export interface LiveCompareResult {
  text1: string;
  text2: string;
  tokens1: string[];
  tokens2: string[];
  lexical_jaccard_score: number;
  semantic_vector_cosine_score: number;
  attribute_match_score: number;
  composite_confidence_score: number;
  relationship_type: string;
  has_critical_conflict: boolean;
  agreed_attributes: string[];
  conflicts: string[];
  explanation: string;
}

// 1. Analytics & Executive KPIs
export async function getNationalAnalytics(): Promise<NationalAnalyticsData | null> {
  try {
    const res = await fetch(`${API_BASE}/analytics/national`);
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.warn('Backend unavailable, using fallback metrics:', err);
    return null;
  }
}

// 2. CPSE Connectors
export async function getCPSEList(): Promise<any[] | null> {
  try {
    const res = await fetch(`${API_BASE}/cpse`);
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.warn('Backend unavailable, using mock CPSEs:', err);
    return null;
  }
}

export async function syncCPSE(cpseId: string): Promise<any> {
  const res = await fetch(`${API_BASE}/cpse/${cpseId}/sync`, { method: 'POST' });
  if (!res.ok) throw new Error(`Sync failed for ${cpseId}`);
  return await res.json();
}

export async function uploadCPSEFile(cpseId: string, file: File): Promise<any> {
  const formData = new FormData();
  formData.append('file', file);
  const res = await fetch(`${API_BASE}/cpse/${cpseId}/imports`, {
    method: 'POST',
    body: formData
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: 'Upload failed' }));
    throw new Error(err.detail || 'Catalog upload failed');
  }
  return await res.json();
}

// 3. National Canonical Master
export async function getCanonicalMaterials(search?: string, limit = 100): Promise<any[] | null> {
  try {
    const url = new URL(`${window.location.origin}${API_BASE}/canonical`);
    if (search) url.searchParams.set('q', search);
    url.searchParams.set('limit', String(limit));
    const res = await fetch(url.toString());
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.warn('Backend unavailable, using mock catalogue:', err);
    return null;
  }
}

export async function getCanonicalDetail(cnmc: string): Promise<any | null> {
  try {
    const res = await fetch(`${API_BASE}/canonical/${encodeURIComponent(cnmc)}`);
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.warn(`Backend unavailable for CNMC ${cnmc}:`, err);
    return null;
  }
}

// 4. Review Queue & Matching Groups
export async function getEquivalenceGroups(status?: string): Promise<any[] | null> {
  try {
    const url = new URL(`${window.location.origin}${API_BASE}/matching/groups`);
    if (status) url.searchParams.set('status_filter', status);
    const res = await fetch(url.toString());
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.warn('Backend unavailable, using mock review queue:', err);
    return null;
  }
}

export async function reviewEquivalenceGroup(
  groupId: string,
  action: string,
  reason: string,
  customCnmc?: string
): Promise<any> {
  const res = await fetch(`${API_BASE}/governance/equivalence-groups/${groupId}/review`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      actor: 'NATIONAL_MASTER_STEWARD',
      action,
      reason,
      custom_cnmc: customCnmc
    })
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: 'Review failed' }));
    throw new Error(err.detail || 'Review submission failed');
  }
  return await res.json();
}

export async function bulkReviewEquivalenceGroups(
  groupIds: string[],
  action = 'MERGE',
  reason = 'Bulk approved via Review Queue'
): Promise<any> {
  const res = await fetch(`${API_BASE}/governance/equivalence-groups/bulk-review`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      group_ids: groupIds,
      actor: 'NATIONAL_MASTER_STEWARD',
      action,
      reason
    })
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: 'Bulk review failed' }));
    throw new Error(err.detail || 'Bulk review submission failed');
  }
  return await res.json();
}

// 5. Governance & Audit Trail
export async function getAuditLogs(limit = 100): Promise<any[] | null> {
  try {
    const res = await fetch(`${API_BASE}/governance/audit-logs?limit=${limit}`);
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.warn('Backend unavailable, using mock audit logs:', err);
    return null;
  }
}

// 6. Live Sandboxes
export async function runLiveHarmonize(description: string, uom = 'EA'): Promise<LiveHarmonizeResult> {
  const res = await fetch(`${API_BASE}/cpse/materials/harmonize-live`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ description, uom })
  });
  if (!res.ok) throw new Error('Live harmonization failed');
  return await res.json();
}

export async function runLiveCompare(
  text1: string,
  text2: string,
  uom1 = 'EA',
  uom2 = 'EA'
): Promise<LiveCompareResult> {
  const res = await fetch(`${API_BASE}/matching/compare-live`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text1, text2, uom1, uom2 })
  });
  if (!res.ok) throw new Error('Live compare failed');
  return await res.json();
}

// 7. Benchmark & ERP Migration
export async function loadIndustrialBenchmark500(): Promise<any> {
  const res = await fetch(`${API_BASE}/dataset/benchmark/load-500`, { method: 'POST' });
  if (!res.ok) throw new Error('Benchmark load failed');
  return await res.json();
}

export function getSAPMigrationExportUrl(format = 'csv', cpseId?: string): string {
  const url = new URL(`${window.location.origin}${API_BASE}/erp/export/migration`);
  url.searchParams.set('format', format);
  if (cpseId) url.searchParams.set('cpse_id', cpseId);
  return url.toString();
}
