import json
import uuid
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.cpse_material import CPSEMaterial
from app.models.equivalence_group import EquivalenceGroup, EquivalenceGroupMember
from app.models.enums import GroupStatus, RelationshipType
from app.schemas.equivalence import EquivalenceGroupResponse, MemberDetailResponse
from app.schemas.cpse_material import LiveCompareRequest, LiveCompareResponse
from app.services.matching_engine import MatchingEngine
from app.services.cnmc_generator import CNMCGenerator
from app.services.vector_search import VectorSearchService
from app.core.config import settings

router = APIRouter(prefix="/matching", tags=["AI Matching & Equivalence"])

@router.get("/vector-index-status")
def get_vector_index_status():
    return VectorSearchService.get_instance().get_status()

@router.post("/compare-live", response_model=LiveCompareResponse)
def compare_materials_live(payload: LiveCompareRequest):
    raw1 = payload.text1 or (payload.record_a.get("source_description") if payload.record_a else "") or ""
    raw2 = payload.text2 or (payload.record_b.get("source_description") if payload.record_b else "") or ""
    text1 = raw1.strip()
    text2 = raw2.strip()
    uom1 = payload.uom1 or (payload.record_a.get("source_uom") if payload.record_a else "EA") or "EA"
    uom2 = payload.uom2 or (payload.record_b.get("source_uom") if payload.record_b else "EA") or "EA"
    
    from app.services.normalization import NormalizationService
    from app.services.attribute_extractor import AttributeExtractor

    norm1 = NormalizationService.normalize_text(text1)
    norm2 = NormalizationService.normalize_text(text2)
    attr1 = AttributeExtractor.extract_attributes(text1)
    attr2 = AttributeExtractor.extract_attributes(text2)

    rec1 = {
        "source_description": text1,
        "normalized_description": norm1,
        "source_uom": uom1,
        "attributes": attr1,
        "cpse_id": "CPSE_A"
    }
    rec2 = {
        "source_description": text2,
        "normalized_description": norm2,
        "source_uom": uom2,
        "attributes": attr2,
        "cpse_id": "CPSE_B"
    }

    match_result = MatchingEngine.match_records(rec1, rec2)
    tokens1 = MatchingEngine.tokenize(norm1)
    tokens2 = MatchingEngine.tokenize(norm2)

    explanation = []
    if match_result["has_critical_conflict"]:
        explanation.append("CRITICAL CONFLICT DETECTED: Discrepancy in safety-critical attributes (pressure rating, material grade, or dimensions) automatically blocked identical grouping and applied a contradiction score penalty.")
    elif match_result["confidence_score"] >= settings.IDENTICAL_THRESHOLD:
        explanation.append("IDENTICAL / DUPLICATE: High semantic vector cosine and verified agreement across all critical technical attributes.")
    elif match_result["confidence_score"] >= settings.NEAR_DUPLICATE_THRESHOLD:
        explanation.append("NEAR-DUPLICATE: High overall similarity with minor variation in non-critical specifications or formatting; routed to human steward review.")
    else:
        explanation.append("RELATED: Low to moderate similarity; items cannot be grouped under a single national identity.")

    return LiveCompareResponse(
        text1=text1,
        text2=text2,
        tokens1=tokens1,
        tokens2=tokens2,
        lexical_jaccard_score=match_result["lexical_score"],
        semantic_vector_cosine_score=match_result["semantic_score"],
        attribute_match_score=match_result["attribute_score"],
        composite_confidence_score=match_result["confidence_score"],
        relationship_type=match_result["relationship_type"],
        has_critical_conflict=match_result["has_critical_conflict"],
        agreed_attributes=match_result["matches"],
        conflicts=match_result["conflicts"],
        explanation=" ".join(explanation)
    )


@router.post("/run", status_code=status.HTTP_200_OK)
def run_candidate_matching(
    db: Session = Depends(get_db)
):
    materials = db.query(CPSEMaterial).all()
    if len(materials) < 2:
        return {"message": "Need at least 2 materials to perform cross-catalog matching", "groups_created": 0}

    mat_dicts = []
    index_payload = []
    for m in materials:
        desc_text = m.normalized_description or m.source_description or ""
        mat_dicts.append({
            "id": m.id,
            "cpse_id": m.cpse_id,
            "source_material_code": m.source_material_code,
            "source_description": m.source_description,
            "normalized_description": m.normalized_description,
            "source_uom": m.source_uom,
            "attributes": {
                "noun": m.material_noun,
                "modifier": m.material_modifier,
                "dimensions": m.dimensions,
                "material_grade": m.material_grade,
                "pressure_rating": m.pressure_rating,
                "standard": m.standard
            }
        })
        index_payload.append({"id": m.id, "text": desc_text})

    # Ensure FAISS index has all materials
    vector_svc = VectorSearchService.get_instance()
    vector_svc.index_materials(index_payload)

    existing_members = db.query(EquivalenceGroupMember.cpse_material_id).all()
    grouped_ids = {m_id for (m_id,) in existing_members}
    mat_by_id = {m["id"]: m for m in mat_dicts}

    created_groups_count = 0
    top_k = settings.FAISS_TOP_K_CANDIDATES

    for rec_i in mat_dicts:
        if rec_i["id"] in grouped_ids:
            continue

        matched_members = [rec_i]
        highest_score = 0.0
        best_rel_type = RelationshipType.NEAR_DUPLICATE
        all_conflicts = []
        all_matches = []

        query_text = rec_i["normalized_description"] or rec_i["source_description"]
        candidates = vector_svc.retrieve_candidates(query_text, k=top_k)

        for c_id, sim in candidates:
            if c_id == rec_i["id"] or c_id in grouped_ids:
                continue

            rec_j = mat_by_id.get(c_id)
            if not rec_j:
                continue

            match_result = MatchingEngine.match_records(rec_i, rec_j)
            score = match_result["confidence_score"]

            if score >= 0.50:
                matched_members.append(rec_j)
                if score > highest_score:
                    highest_score = score
                    best_rel_type = match_result["relationship_type"]
                all_conflicts.extend(match_result["conflicts"])
                all_matches.extend(match_result["matches"])

        if len(matched_members) > 1:
            proposed_cnmc = CNMCGenerator.allocate_cnmc(
                db, noun=rec_i["attributes"].get("noun")
            )

            evidence_payload = {
                "highest_confidence": highest_score,
                "agreed_attributes": list(set(all_matches)),
                "conflicts": list(set(all_conflicts)),
                "comparison_count": len(matched_members) - 1
            }

            group = EquivalenceGroup(
                id=str(uuid.uuid4()),
                relationship_type=best_rel_type,
                confidence_score=highest_score,
                lexical_score=0.8,
                semantic_score=highest_score,
                attribute_score=0.85,
                evidence_payload=json.dumps(evidence_payload),
                status=GroupStatus.PROPOSED,
                proposed_cnmc=proposed_cnmc
            )
            db.add(group)
            db.flush()

            for idx, m_rec in enumerate(matched_members):
                member = EquivalenceGroupMember(
                    id=str(uuid.uuid4()),
                    equivalence_group_id=group.id,
                    cpse_material_id=m_rec["id"],
                    is_anchor=1 if idx == 0 else 0
                )
                db.add(member)
                grouped_ids.add(m_rec["id"])

            created_groups_count += 1

    db.commit()
    return {
        "message": f"Matching completed. Created {created_groups_count} equivalence groups.",
        "groups_created": created_groups_count
    }

@router.get("/groups", response_model=List[EquivalenceGroupResponse])
def list_equivalence_groups(
    status_filter: Optional[GroupStatus] = None,
    db: Session = Depends(get_db)
):
    query = db.query(EquivalenceGroup)
    if status_filter:
        query = query.filter(EquivalenceGroup.status == status_filter)
    
    groups = query.order_by(EquivalenceGroup.created_at.desc()).all()
    results = []
    
    for g in groups:
        member_details = []
        for m in g.members:
            cpse_mat = m.cpse_material
            if cpse_mat:
                member_details.append(
                    MemberDetailResponse(
                        id=m.id,
                        cpse_material_id=cpse_mat.id,
                        cpse_id=cpse_mat.cpse_id,
                        source_material_code=cpse_mat.source_material_code,
                        source_description=cpse_mat.source_description,
                        source_uom=cpse_mat.source_uom,
                        material_noun=cpse_mat.material_noun,
                        material_modifier=cpse_mat.material_modifier,
                        dimensions=cpse_mat.dimensions,
                        material_grade=cpse_mat.material_grade,
                        pressure_rating=cpse_mat.pressure_rating,
                        standard=cpse_mat.standard,
                        is_anchor=m.is_anchor
                    )
                )

        evidence_dict = None
        if g.evidence_payload:
            try:
                evidence_dict = json.loads(g.evidence_payload)
            except Exception:
                evidence_dict = {"raw": g.evidence_payload}

        results.append(
            EquivalenceGroupResponse(
                id=g.id,
                relationship_type=g.relationship_type,
                confidence_score=g.confidence_score,
                lexical_score=g.lexical_score,
                semantic_score=g.semantic_score,
                attribute_score=g.attribute_score,
                evidence_payload=evidence_dict,
                status=g.status,
                proposed_cnmc=g.proposed_cnmc,
                canonical_material_id=g.canonical_material_id,
                members=member_details,
                created_at=g.created_at,
                updated_at=g.updated_at
            )
        )
    return results

@router.get("/groups/{group_id}", response_model=EquivalenceGroupResponse)
def get_equivalence_group(group_id: str, db: Session = Depends(get_db)):
    g = db.query(EquivalenceGroup).filter(EquivalenceGroup.id == group_id).first()
    if not g:
        raise HTTPException(status_code=404, detail="Group not found")
    
    member_details = []
    for m in g.members:
        cpse_mat = m.cpse_material
        if cpse_mat:
            member_details.append(
                MemberDetailResponse(
                    id=m.id,
                    cpse_material_id=cpse_mat.id,
                    cpse_id=cpse_mat.cpse_id,
                    source_material_code=cpse_mat.source_material_code,
                    source_description=cpse_mat.source_description,
                    source_uom=cpse_mat.source_uom,
                    material_noun=cpse_mat.material_noun,
                    material_modifier=cpse_mat.material_modifier,
                    dimensions=cpse_mat.dimensions,
                    material_grade=cpse_mat.material_grade,
                    pressure_rating=cpse_mat.pressure_rating,
                    standard=cpse_mat.standard,
                    is_anchor=m.is_anchor
                )
            )

    evidence_dict = None
    if g.evidence_payload:
        try:
            evidence_dict = json.loads(g.evidence_payload)
        except Exception:
            evidence_dict = {}

    return EquivalenceGroupResponse(
        id=g.id,
        relationship_type=g.relationship_type,
        confidence_score=g.confidence_score,
        lexical_score=g.lexical_score,
        semantic_score=g.semantic_score,
        attribute_score=g.attribute_score,
        evidence_payload=evidence_dict,
        status=g.status,
        proposed_cnmc=g.proposed_cnmc,
        canonical_material_id=g.canonical_material_id,
        members=member_details,
        created_at=g.created_at,
        updated_at=g.updated_at
    )
