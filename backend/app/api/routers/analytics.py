from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.analytics import NationalAnalyticsSummary
from app.services.analytics_service import AnalyticsService

router = APIRouter(prefix="/analytics", tags=["National Analytics & Spend KPIs"])

@router.get("/national", response_model=NationalAnalyticsSummary)
def get_national_analytics(db: Session = Depends(get_db)):
    return AnalyticsService.get_national_summary(db)
