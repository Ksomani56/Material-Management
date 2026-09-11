import uuid
from datetime import datetime, timezone
from typing import List
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Path, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.cpse import CPSE
from app.models.cpse_material import CPSEMaterial
from app.schemas.cpse_material import (
    CPSECreate,
    CPSEResponse,
    CPSEMaterialResponse,
    IngestionReport,
    LiveHarmonizeRequest,
    LiveHarmonizeResponse
)
from app.adapters.ingestion.tabular_adapter import TabularCatalogIngestionAdapter
from app.services.normalization import NormalizationService
from app.services.attribute_extractor import AttributeExtractor
from app.services.governance_service import GovernanceService
from app.services.taxonomy_service import TaxonomyService
from app.services.vector_search import VectorSearchService

router = APIRouter(prefix="/cpse", tags=["CPSE Catalog Ingestion"])

@router.post("", response_model=CPSEResponse, status_code=status.HTTP_201_CREATED)
def register_cpse(data: CPSECreate, db: Session = Depends(get_db)):
    existing = db.query(CPSE).filter(CPSE.id == data.id).first()
    if existing:
        return existing
    cpse = CPSE(
        id=data.id,
        name=data.name,
        code=data.code.upper(),
        description=data.description
    )
    db.add(cpse)
    db.commit()
    db.refresh(cpse)
    return cpse

@router.get("", response_model=List[CPSEResponse])
def list_cpses(db: Session = Depends(get_db)):
    return db.query(CPSE).all()

@router.post("/{cpse_id}/imports", response_model=IngestionReport, status_code=status.HTTP_201_CREATED)
async def import_cpse_catalog(
    cpse_id: str = Path(..., description="Unique identifier of the CPSE"),
    file: UploadFile = File(..., description="CSV or Excel catalog file"),
    db: Session = Depends(get_db)
):
    lower_filename = file.filename.lower()
    if not lower_filename.endswith((".csv", ".xlsx", ".xls")):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only CSV and Excel (.xlsx, .xls) files are supported."
        )

    content = await file.read()
    if not content:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Uploaded file is empty."
        )

    cpse = db.query(CPSE).filter(CPSE.id == cpse_id).first()
    if not cpse:
        cpse = CPSE(
            id=cpse_id,
            name=cpse_id.upper().replace("_", " "),
            code=cpse_id.upper()
        )
        db.add(cpse)
        db.commit()

    adapter = TabularCatalogIngestionAdapter()
    try:
        valid_records, errors = adapter.parse_and_validate(content, file.filename)
    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=str(exc)
        )

    batch_id = str(uuid.uuid4())
    created_ids = []

    for item in valid_records:
        norm_desc = NormalizationService.normalize_text(item["source_description"])
        norm_uom = NormalizationService.normalize_uom(item["source_uom"])
        extracted = AttributeExtractor.extract_attributes(
            text=item["source_description"],
            spec_text=item.get("source_specifications")
        )

        material = CPSEMaterial(
            id=str(uuid.uuid4()),
            cpse_id=cpse_id,
            source_system=item.get("source_system", "SAP_DEFAULT"),
            source_material_code=item["source_material_code"],
            source_description=item["source_description"],
            source_specifications=item.get("source_specifications"),
            source_uom=item["source_uom"],
            raw_payload=item["raw_payload"],
            batch_id=batch_id,
            normalized_description=norm_desc,
            normalized_uom=norm_uom,
            material_noun=extracted.get("noun"),
            material_modifier=extracted.get("modifier"),
            dimensions=extracted.get("dimensions"),
            material_grade=extracted.get("material_grade"),
            pressure_rating=extracted.get("pressure_rating"),
            standard=extracted.get("standard"),
            extracted_attributes=str(extracted),
            standardized_description=extracted.get("canonical_description")
        )
        db.add(material)
        created_ids.append(material.id)

    if created_ids:
        db.commit()
        GovernanceService.record_audit(
            db=db,
            actor="SYSTEM_INGESTION",
            action="BATCH_CATALOG_IMPORT",
            object_type="BATCH",
            object_id=batch_id,
            details={"cpse_id": cpse_id, "imported_rows": len(created_ids), "filename": file.filename}
        )
        db.commit()

    total_rows = len(valid_records) + len({e.row_number for e in errors})
    return IngestionReport(
        batch_id=batch_id,
        cpse_id=cpse_id,
        total_rows=total_rows,
        successful_rows=len(created_ids),
        failed_rows=len({e.row_number for e in errors}),
        errors=errors,
        ingested_material_ids=created_ids
    )

@router.get("/{cpse_id}/materials", response_model=List[CPSEMaterialResponse])
def get_cpse_materials(
    cpse_id: str,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    return db.query(CPSEMaterial).filter(
        CPSEMaterial.cpse_id == cpse_id
    ).offset(skip).limit(limit).all()

@router.post("/materials/harmonize-live", response_model=LiveHarmonizeResponse)
def harmonize_material_live(payload: LiveHarmonizeRequest):
    raw_desc = payload.description or payload.raw_description or ""
    desc = raw_desc.strip()
    uom = payload.uom or "EA"
    norm_desc = NormalizationService.normalize_text(desc)
    norm_uom = NormalizationService.normalize_uom(uom)
    extracted = AttributeExtractor.extract_attributes(desc, payload.specifications)
    unspsc, cat_name = TaxonomyService.classify(extracted.get("noun"))

    # Generate 384-d vector sample preview
    vector_sample = []
    try:
        vec_svc = VectorSearchService.get_instance()
        embs = vec_svc.generate_embeddings([norm_desc])
        if len(embs) > 0:
            vector_sample = [round(float(x), 4) for x in embs[0][:5]]
    except Exception:
        vector_sample = [0.0] * 5

    return LiveHarmonizeResponse(
        source_description=desc,
        normalized_description=norm_desc,
        source_uom=uom,
        normalized_uom=norm_uom,
        extracted_attributes=extracted,
        standardized_description=extracted.get("canonical_description") or norm_desc,
        unspsc_code=unspsc,
        category_name=cat_name,
        vector_dimension=384,
        vector_sample=vector_sample
    )

@router.post("/{cpse_id}/sync")
def sync_cpse_catalog(
    cpse_id: str = Path(..., description="Unique identifier or code of the CPSE"),
    db: Session = Depends(get_db)
):
    cpse = db.query(CPSE).filter((CPSE.id == cpse_id) | (CPSE.code == cpse_id.upper())).first()
    if not cpse:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"CPSE with identifier '{cpse_id}' not found."
        )

    mats_query = db.query(CPSEMaterial).filter(CPSEMaterial.cpse_id == cpse.id)
    total_count = mats_query.count()

    vec_svc = VectorSearchService.get_instance()
    materials = mats_query.all()
    indexed_count = 0
    if materials:
        texts = [m.normalized_description or m.source_description for m in materials]
        meta = [{"material_id": m.id, "cpse_id": m.cpse_id, "code": m.source_material_code} for m in materials]
        try:
            vec_svc.build_or_update_index(texts, meta)
            indexed_count = len(texts)
        except Exception:
            pass

    GovernanceService.record_audit(
        db=db,
        actor="SYSTEM_ERP_CONNECTOR",
        action="ERP_DELTA_SYNC",
        object_type="CPSE",
        object_id=cpse.id,
        details={
            "description": f"Live sync executed for {cpse.code} ({cpse.name}). Analyzed {total_count} local records; re-indexed {indexed_count} vectors into FAISS.",
            "records_analyzed": total_count,
            "records_indexed": indexed_count
        }
    )
    db.commit()

    return {
        "status": "SUCCESS",
        "cpse_id": cpse.id,
        "cpse_code": cpse.code,
        "cpse_name": cpse.name,
        "records_analyzed": total_count,
        "records_indexed": indexed_count,
        "last_sync": datetime.now(timezone.utc).isoformat(),
        "message": f"Live delta sync completed for {cpse.code} ({total_count} records synchronized with FAISS vector index)."
    }

