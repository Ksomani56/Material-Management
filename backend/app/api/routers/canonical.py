import json
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.canonical_material import CanonicalMaterial
from app.schemas.canonical_material import CanonicalMaterialResponse

router = APIRouter(prefix="/canonical", tags=["National Canonical Material Master (CNMC)"])

@router.get("", response_model=List[CanonicalMaterialResponse])
def list_canonical_materials(
    q: Optional[str] = None,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    query = db.query(CanonicalMaterial)
    if q:
        query = query.filter(
            (CanonicalMaterial.cnmc.ilike(f"%{q}%")) |
            (CanonicalMaterial.canonical_description.ilike(f"%{q}%"))
        )
    records = query.order_by(CanonicalMaterial.created_at.desc()).limit(limit).all()
    
    results = []
    for r in records:
        attr_dict = None
        if r.canonical_attributes:
            try:
                attr_dict = json.loads(r.canonical_attributes) if r.canonical_attributes.startswith("{") else None
            except Exception:
                attr_dict = None
        results.append(
            CanonicalMaterialResponse(
                id=r.id,
                cnmc=r.cnmc,
                canonical_description=r.canonical_description,
                canonical_attributes=attr_dict,
                category_code=r.category_code,
                unspsc_code=r.unspsc_code,
                status=r.status,
                version=r.version,
                approved_by=r.approved_by,
                approved_at=r.approved_at,
                created_at=r.created_at,
                updated_at=r.updated_at
            )
        )
    return results

@router.get("/{cnmc}", response_model=CanonicalMaterialResponse)
def get_canonical_by_cnmc(cnmc: str, db: Session = Depends(get_db)):
    r = db.query(CanonicalMaterial).filter(CanonicalMaterial.cnmc == cnmc).first()
    if not r:
        raise HTTPException(status_code=404, detail=f"Canonical Material {cnmc} not found")
    
    attr_dict = None
    if r.canonical_attributes:
        try:
            attr_dict = json.loads(r.canonical_attributes)
        except Exception:
            attr_dict = None

    return CanonicalMaterialResponse(
        id=r.id,
        cnmc=r.cnmc,
        canonical_description=r.canonical_description,
        canonical_attributes=attr_dict,
        category_code=r.category_code,
        unspsc_code=r.unspsc_code,
        status=r.status,
        version=r.version,
        approved_by=r.approved_by,
        approved_at=r.approved_at,
        created_at=r.created_at,
        updated_at=r.updated_at
    )
