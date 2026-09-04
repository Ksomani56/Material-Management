import pytest
from app.adapters.erp.sap_adapter import SAPMigrationAdapter

def test_sap_migration_export():
    adapter = SAPMigrationAdapter()
    data = [{
        "cpse_id": "ONGC",
        "source_system": "SAP_ECC",
        "source_material_code": "ONGC-VAL-001",
        "cnmc": "CNMC-VAL-2026-00001",
        "canonical_description": "VALVE, BALL, 2 INCH (DN50), 150#",
        "attributes": {"noun": "VALVE"},
        "classification": "40141600",
        "mapping_status": "APPROVED",
        "rationalization_action": "MERGE",
        "version": 1,
        "effective_date": "2026-09-04"
    }]
    rows = adapter.format_migration_payload(data)
    assert len(rows) == 1
    assert rows[0].CNMC == "CNMC-VAL-2026-00001"
    
    csv_str = adapter.export_to_csv(rows)
    assert "CNMC-VAL-2026-00001" in csv_str
    assert "ONGC-VAL-001" in csv_str
