from typing import List, Optional
from fastapi import APIRouter, Depends, Query, Response
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.mapping import CPSEMapping
from app.models.enums import MappingStatus
from app.adapters.erp.sap_adapter import SAPMigrationAdapter
from app.schemas.erp_export import SAPMigrationRow

router = APIRouter(prefix="/erp", tags=["ERP / SAP Integration Adapter"])

@router.get("/export/migration")
def export_sap_migration(
    format: str = Query("json", pattern="^(json|csv|excel)$"),
    db: Session = Depends(get_db)
):
    mappings = db.query(CPSEMapping).filter(
        CPSEMapping.mapping_status == MappingStatus.APPROVED
    ).all()

    payload_data = []
    for m in mappings:
        cpse_mat = m.cpse_material
        canonical = m.canonical_material
        if cpse_mat and canonical:
            payload_data.append({
                "cpse_id": cpse_mat.cpse_id,
                "source_system": cpse_mat.source_system,
                "source_material_code": cpse_mat.source_material_code,
                "cnmc": canonical.cnmc,
                "canonical_description": canonical.canonical_description,
                "attributes": {
                    "noun": cpse_mat.material_noun,
                    "dimensions": cpse_mat.dimensions,
                    "grade": cpse_mat.material_grade,
                    "rating": cpse_mat.pressure_rating
                },
                "classification": canonical.unspsc_code or "40141600",
                "mapping_status": m.mapping_status.value,
                "rationalization_action": m.rationalization_action.value,
                "version": canonical.version,
                "effective_date": m.effective_from.strftime("%Y-%m-%d")
            })

    adapter = SAPMigrationAdapter()
    rows = adapter.format_migration_payload(payload_data)

    if format == "csv":
        csv_str = adapter.export_to_csv(rows)
        return Response(
            content=csv_str,
            media_type="text/csv",
            headers={"Content-Disposition": "attachment; filename=sap_migration_export.csv"}
        )
    elif format == "excel":
        excel_bytes = adapter.export_to_excel_bytes(rows)
        return Response(
            content=excel_bytes,
            media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            headers={"Content-Disposition": "attachment; filename=sap_migration_export.xlsx"}
        )
    else:
        return [r.model_dump() for r in rows]
