import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.core.database import Base
from app.models.cpse import CPSE
from app.models.cpse_material import CPSEMaterial
from app.models.equivalence_group import EquivalenceGroup, EquivalenceGroupMember
from app.models.enums import RationalizationAction, GroupStatus, MappingStatus
from app.services.governance_service import GovernanceService

def test_governance_merge_action():
    engine = create_engine("sqlite:///:memory:")
    TestingSession = sessionmaker(bind=engine)
    Base.metadata.create_all(bind=engine)
    db = TestingSession()

    cpse = CPSE(id="CPSE_TEST", name="Test CPSE", code="TEST")
    db.add(cpse)
    
    mat1 = CPSEMaterial(
        id="mat-1",
        cpse_id="CPSE_TEST",
        source_system="SAP",
        source_material_code="CODE-01",
        source_description="BALL VALVE 2IN 150#",
        source_uom="EA",
        raw_payload="{}",
        batch_id="batch-1",
        material_noun="VALVE"
    )
    db.add(mat1)
    
    group = EquivalenceGroup(
        id="grp-1",
        confidence_score=0.95,
        status=GroupStatus.PROPOSED
    )
    db.add(group)
    db.flush()

    member = EquivalenceGroupMember(
        id="mem-1",
        equivalence_group_id="grp-1",
        cpse_material_id="mat-1",
        is_anchor=1
    )
    db.add(member)
    db.commit()

    result = GovernanceService.review_equivalence_group(
        db=db,
        group_id="grp-1",
        actor="NATIONAL_STEWARD_1",
        action=RationalizationAction.MERGE,
        reason="Approved unified national valve standard"
    )

    assert result["status"] == "APPROVED"
    assert result["action"] == "MERGE"
    assert "CNMC-VAL-" in result["cnmc"]
