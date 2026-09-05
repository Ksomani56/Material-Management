from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.audit import AuditEvent
from app.schemas.governance import (
    EquivalenceReviewRequest,
    AuditEventResponse,
    BulkEquivalenceReviewRequest,
    BulkEquivalenceReviewResponse
)
from app.services.governance_service import GovernanceService

router = APIRouter(prefix="/governance", tags=["Human Governance & Audit Trail"])

@router.post("/equivalence-groups/{group_id}/review", status_code=status.HTTP_200_OK)
def review_group(
    group_id: str,
    payload: EquivalenceReviewRequest,
    db: Session = Depends(get_db)
):
    try:
        res = GovernanceService.review_equivalence_group(
            db=db,
            group_id=group_id,
            actor=payload.actor,
            action=payload.action,
            reason=payload.reason,
            custom_cnmc=payload.custom_cnmc
        )
        return res
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

@router.post("/equivalence-groups/bulk-review", response_model=BulkEquivalenceReviewResponse, status_code=status.HTTP_200_OK)
def bulk_review_groups(
    payload: BulkEquivalenceReviewRequest,
    db: Session = Depends(get_db)
):
    processed = []
    for g_id in payload.group_ids:
        try:
            GovernanceService.review_equivalence_group(
                db=db,
                group_id=g_id,
                actor=payload.actor,
                action=payload.action,
                reason=payload.reason
            )
            processed.append(g_id)
        except Exception:
            continue
    return BulkEquivalenceReviewResponse(
        approved_count=len(processed),
        processed_group_ids=processed,
        message=f"Bulk {payload.action.value} completed for {len(processed)} equivalence groups."
    )

@router.get("/audit-logs", response_model=List[AuditEventResponse])
def get_audit_logs(
    limit: int = 100,
    db: Session = Depends(get_db)
):
    return db.query(AuditEvent).order_by(AuditEvent.timestamp.desc()).limit(limit).all()
