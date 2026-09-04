import io
import json
from typing import List, Dict, Any
import pandas as pd
from app.adapters.erp.base import ERPIntegrationPort
from app.schemas.erp_export import SAPMigrationRow

class SAPMigrationAdapter(ERPIntegrationPort):
    def format_migration_payload(self, approved_mappings: List[Dict[str, Any]]) -> List[SAPMigrationRow]:
        rows: List[SAPMigrationRow] = []
        for item in approved_mappings:
            row = SAPMigrationRow(
                CPSE_ID=item.get("cpse_id", ""),
                SOURCE_SYSTEM=item.get("source_system", "SAP_ECC"),
                SOURCE_MATERIAL_CODE=item.get("source_material_code", ""),
                CNMC=item.get("cnmc", ""),
                CANONICAL_DESCRIPTION=item.get("canonical_description", ""),
                ATTRIBUTES=json.dumps(item.get("attributes", {})),
                CLASSIFICATION=item.get("classification", "40141600"),
                MAPPING_STATUS=item.get("mapping_status", "APPROVED"),
                RATIONALIZATION_ACTION=item.get("rationalization_action", "MAP"),
                VERSION=item.get("version", 1),
                EFFECTIVE_DATE=item.get("effective_date", "")
            )
            rows.append(row)
        return rows

    def export_to_csv(self, rows: List[SAPMigrationRow]) -> str:
        data = [r.model_dump() for r in rows]
        df = pd.DataFrame(data)
        return df.to_csv(index=False)

    def export_to_excel_bytes(self, rows: List[SAPMigrationRow]) -> bytes:
        data = [r.model_dump() for r in rows]
        df = pd.DataFrame(data)
        buffer = io.BytesIO()
        df.to_excel(buffer, index=False, engine="openpyxl")
        return buffer.getvalue()
