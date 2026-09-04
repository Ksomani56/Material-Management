import io
import pytest
from app.adapters.ingestion.tabular_adapter import TabularCatalogIngestionAdapter

def test_valid_csv_parsing():
    csv_data = b'''source_material_code,description,uom,specifications
VAL-01,BALL VALVE 2IN 150# WCB,NOS,API 6D
FLG-02,WELD NECK FLANGE 2IN 150# A105,EA,ASME B16.5
'''
    adapter = TabularCatalogIngestionAdapter()
    records, errors = adapter.parse_and_validate(csv_data, "test.csv")
    assert len(errors) == 0
    assert len(records) == 2
    assert records[0]["source_material_code"] == "VAL-01"
    assert records[0]["source_uom"] == "NOS"

def test_missing_required_field():
    csv_data = b'''source_material_code,description,uom
,BALL VALVE 2IN 150# WCB,NOS
VAL-02,,EA
VAL-03,GATE VALVE 2IN,
'''
    adapter = TabularCatalogIngestionAdapter()
    records, errors = adapter.parse_and_validate(csv_data, "test_malformed.csv")
    assert len(errors) == 3
    assert len(records) == 0
    err_fields = [e.field for e in errors]
    assert "source_material_code" in err_fields
    assert "description" in err_fields
    assert "uom" in err_fields
