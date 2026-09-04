from collections import defaultdict
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.models.cpse import CPSE
from app.models.cpse_material import CPSEMaterial
from app.models.canonical_material import CanonicalMaterial
from app.models.equivalence_group import EquivalenceGroup
from app.models.mapping import CPSEMapping
from app.models.procurement import ProcurementRecord
from app.models.enums import GroupStatus, MappingStatus
from app.schemas.analytics import NationalAnalyticsSummary

class AnalyticsService:
    @classmethod
    def get_national_summary(cls, db: Session) -> NationalAnalyticsSummary:
        total_cpse = db.query(func.count(CPSE.id)).scalar() or 0
        total_mats = db.query(func.count(CPSEMaterial.id)).scalar() or 0
        total_cnmcs = db.query(func.count(CanonicalMaterial.id)).scalar() or 0
        total_groups = db.query(func.count(EquivalenceGroup.id)).scalar() or 0
        
        pending_reviews = db.query(func.count(EquivalenceGroup.id)).filter(
            EquivalenceGroup.status.in_([GroupStatus.PROPOSED, GroupStatus.UNDER_REVIEW])
        ).scalar() or 0
        
        approved_mappings = db.query(func.count(CPSEMapping.id)).filter(
            CPSEMapping.mapping_status == MappingStatus.APPROVED
        ).scalar() or 0

        dedup_ratio = 0.0
        if total_mats > 0 and total_cnmcs > 0:
            dedup_ratio = round(((total_mats - total_cnmcs) / total_mats) * 100, 2)

        mappings = db.query(CPSEMapping.rationalization_action).all()
        actions_breakdown = defaultdict(int)
        for (action,) in mappings:
            actions_breakdown[action.value] += 1

        cpse_mats = db.query(CPSEMaterial.cpse_id, func.count(CPSEMaterial.id)).group_by(CPSEMaterial.cpse_id).all()
        cpse_breakdown = {c_id: count for c_id, count in cpse_mats}

        total_spend = db.query(func.sum(ProcurementRecord.total_spend)).scalar() or 0.0

        # Confidence Bands Breakdown (SRS Table 4)
        all_groups = db.query(EquivalenceGroup.confidence_score).all()
        bands = {"HIGH (>=85%)": 0, "MEDIUM (65-85%)": 0, "LOW (<65%)": 0}
        for (score,) in all_groups:
            if score >= 0.85:
                bands["HIGH (>=85%)"] += 1
            elif score >= 0.65:
                bands["MEDIUM (65-85%)"] += 1
            else:
                bands["LOW (<65%)"] += 1

        # Estimated Synergy Savings: 8.5% bulk synergy on deduplicated volume or base proxy
        estimated_synergy = 0.0
        if total_spend > 0:
            estimated_synergy = round(float(total_spend) * (dedup_ratio / 100.0) * 0.085, 2)
        elif total_mats > 0 and total_cnmcs > 0:
            # Baseline proxy: Rs 45,000 avg inventory carrying cost per redundant duplicate SKU
            redundant_skus = max(0, total_mats - total_cnmcs)
            estimated_synergy = float(redundant_skus * 45000.0)

        return NationalAnalyticsSummary(
            total_cpse_count=total_cpse,
            total_source_materials=total_mats,
            total_canonical_cnmcs=total_cnmcs,
            deduplication_ratio_pct=max(0.0, dedup_ratio),
            total_equivalence_groups=total_groups,
            pending_reviews_count=pending_reviews,
            approved_mappings_count=approved_mappings,
            actions_breakdown=dict(actions_breakdown),
            cpse_breakdown=cpse_breakdown,
            total_spend_aggregated=float(total_spend),
            spend_coverage_currency="INR",
            estimated_synergy_savings=estimated_synergy,
            confidence_bands_breakdown=bands
        )

