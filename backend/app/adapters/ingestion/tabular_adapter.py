import io
import json
from typing import List, Dict, Any, Tuple
import pandas as pd
from app.adapters.ingestion.base import CatalogIngestionPort
from app.schemas.cpse_material import RowValidationError

class TabularCatalogIngestionAdapter(CatalogIngestionPort):
    REQUIRED_COLUMNS = ["source_material_code", "description", "uom"]

    COLUMN_MAPPINGS = {
        "material_code": "source_material_code",
        "mat_code": "source_material_code",
        "item_code": "source_material_code",
        "material_number": "source_material_code",
        "source_code": "source_material_code",
        "source_material_code": "source_material_code",
        "material_description": "description",
        "item_description": "description",
        "desc": "description",
        "source_description": "description",
        "description": "description",
        "unit": "uom",
        "unit_of_measure": "uom",
        "base_uom": "uom",
        "source_uom": "uom",
        "uom": "uom",
        "specifications": "specifications",
        "specs": "specifications",
        "technical_specs": "specifications",
        "source_system": "source_system",
    }

    def parse_and_validate(
        self, file_content: bytes, filename: str
    ) -> Tuple[List[Dict[str, Any]], List[RowValidationError]]:
        buffer = io.BytesIO(file_content)
        lower_name = filename.lower()
        if lower_name.endswith(".csv"):
            try:
                df = pd.read_csv(buffer, dtype=str)
            except Exception as e:
                raise ValueError(f"Failed to parse CSV file: {str(e)}")
        elif lower_name.endswith((".xlsx", ".xls")):
            try:
                df = pd.read_excel(buffer, dtype=str, engine="openpyxl")
            except Exception as e:
                raise ValueError(f"Failed to parse Excel file: {str(e)}")
        else:
            raise ValueError("Unsupported catalog file format. Please upload CSV or Excel (.xlsx, .xls).")

        df.columns = [
            str(col).strip().lower().replace(" ", "_").replace("-", "_")
            for col in df.columns
        ]

        normalized_rename = {}
        for col in df.columns:
            if col in self.COLUMN_MAPPINGS:
                normalized_rename[col] = self.COLUMN_MAPPINGS[col]
        df = df.rename(columns=normalized_rename)

        errors: List[RowValidationError] = []
        valid_records: List[Dict[str, Any]] = []

        for idx, row in df.iterrows():
            row_num = int(idx) + 2
            row_has_error = False
            record: Dict[str, Any] = {}

            for req_field in self.REQUIRED_COLUMNS:
                val = row.get(req_field)
                if val is None or pd.isna(val) or str(val).strip() == "":
                    errors.append(
                        RowValidationError(
                            row_number=row_num,
                            field=req_field,
                            message=f"Missing required field: {req_field}",
                        )
                    )
                    row_has_error = True

            if not row_has_error:
                raw_dict = {
                    str(k): (None if pd.isna(v) else str(v).strip())
                    for k, v in row.items()
                }
                record["source_material_code"] = str(row["source_material_code"]).strip()
                record["source_description"] = str(row["description"]).strip()
                record["source_uom"] = str(row["uom"]).strip()
                record["source_specifications"] = (
                    str(row.get("specifications")).strip()
                    if "specifications" in row and not pd.isna(row["specifications"])
                    else None
                )
                record["source_system"] = (
                    str(row.get("source_system")).strip()
                    if "source_system" in row and not pd.isna(row["source_system"])
                    else "SAP_DEFAULT"
                )
                record["raw_payload"] = json.dumps(raw_dict)
                record["row_number"] = row_num
                valid_records.append(record)

        return valid_records, errors
