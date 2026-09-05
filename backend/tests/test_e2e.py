import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_full_platform_lifecycle():
    # 1. Health check
    res = client.get("/api/health")
    assert res.status_code == 200
    assert res.json()["status"] == "HEALTHY"

    # 2. Ingest ONGC catalog
    with open("backend/sample_data/cpse_ongc_catalog.csv", "rb") as f:
        res = client.post("/api/cpse/ONGC/imports", files={"file": ("ongc.csv", f, "text/csv")})
    assert res.status_code == 201
    assert res.json()["successful_rows"] > 0

    # 3. Ingest IOCL catalog
    with open("backend/sample_data/cpse_iocl_catalog.csv", "rb") as f:
        res = client.post("/api/cpse/IOCL/imports", files={"file": ("iocl.csv", f, "text/csv")})
    assert res.status_code == 201
    assert res.json()["successful_rows"] > 0

    # 4. Ingest GAIL catalog
    with open("backend/sample_data/cpse_gail_catalog.csv", "rb") as f:
        res = client.post("/api/cpse/GAIL/imports", files={"file": ("gail.csv", f, "text/csv")})
    assert res.status_code == 201
    assert res.json()["successful_rows"] > 0

    # 5. Run matching
    res = client.post("/api/matching/run")
    assert res.status_code == 200

    # 6. Fetch equivalence groups
    res = client.get("/api/matching/groups")
    assert res.status_code == 200
    groups = res.json()
    assert len(groups) > 0

    # 7. Execute human review decision
    group_id = groups[0]["id"]
    res = client.post(f"/api/governance/equivalence-groups/{group_id}/review", json={
        "actor": "NATIONAL_MASTER_STEWARD",
        "action": "MERGE",
        "reason": "Verified ASME B16.5 technical specs agree across CPSEs"
    })
    assert res.status_code == 200
    assert res.json()["status"] == "APPROVED"
    assert "CNMC-" in res.json()["cnmc"]

    # 8. Check Canonical Materials
    res = client.get("/api/canonical")
    assert res.status_code == 200
    cnmcs = res.json()
    assert len(cnmcs) > 0

    # 9. Check Audit Logs
    res = client.get("/api/governance/audit-logs")
    assert res.status_code == 200
    logs = res.json()
    assert len(logs) > 0

    # 10. Check ERP Export
    res = client.get("/api/erp/export/migration?format=json")
    assert res.status_code == 200
    erp_rows = res.json()
    assert len(erp_rows) > 0
    assert "CNMC" in erp_rows[0]
    assert "SOURCE_MATERIAL_CODE" in erp_rows[0]

    # 11. National Analytics
    res = client.get("/api/analytics/national")
    assert res.status_code == 200
    summary = res.json()
    assert summary["total_cpse_count"] >= 3
    assert summary["total_source_materials"] >= 10
    assert summary["total_canonical_cnmcs"] >= 1
