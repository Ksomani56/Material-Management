import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

from app.core.config import settings
from app.core.database import engine, Base
import app.models

from app.api.routers import (
    cpse,
    matching,
    governance,
    canonical,
    erp_export,
    analytics,
    dataset
)

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.RULE_VERSION,
    description="AI-Driven National Unified Material Master Platform for CPSEs (One Nation - One Material Code)"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(cpse.router, prefix=settings.API_V1_STR)
app.include_router(matching.router, prefix=settings.API_V1_STR)
app.include_router(governance.router, prefix=settings.API_V1_STR)
app.include_router(canonical.router, prefix=settings.API_V1_STR)
app.include_router(erp_export.router, prefix=settings.API_V1_STR)
app.include_router(analytics.router, prefix=settings.API_V1_STR)
app.include_router(dataset.router, prefix=settings.API_V1_STR)

@app.get("/api/health", tags=["Health"])
def health_check():
    return {
        "status": "HEALTHY",
        "rule_version": settings.RULE_VERSION,
        "model_version": settings.MODEL_VERSION,
        "project": settings.PROJECT_NAME
    }

dist_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "dist"))
frontend_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "frontend"))

if os.path.exists(dist_dir):
    dist_assets = os.path.join(dist_dir, "assets")
    if os.path.exists(dist_assets):
        app.mount("/assets", StaticFiles(directory=dist_assets), name="assets")

    theme_previews = os.path.join(dist_dir, "theme-previews")
    if os.path.exists(theme_previews):
        app.mount("/theme-previews", StaticFiles(directory=theme_previews), name="theme_previews")

    @app.get("/{full_path:path}", include_in_schema=False)
    def serve_react_spa(full_path: str):
        if full_path.startswith("api") or full_path.startswith("docs") or full_path.startswith("openapi.json") or full_path.startswith("redoc"):
            raise HTTPException(status_code=404, detail="Endpoint not found")
        # Check if requesting a direct file in dist
        file_candidate = os.path.join(dist_dir, full_path)
        if full_path and os.path.exists(file_candidate) and os.path.isfile(file_candidate):
            return FileResponse(file_candidate)
        index_file = os.path.join(dist_dir, "index.html")
        if os.path.exists(index_file):
            return FileResponse(index_file)
        return {"message": "Vite dist/index.html not found"}

elif os.path.exists(frontend_dir):
    app.mount("/static", StaticFiles(directory=frontend_dir), name="static")

    @app.get("/", include_in_schema=False)
    def serve_frontend_root():
        index_path = os.path.join(frontend_dir, "index.html")
        if os.path.exists(index_path):
            return FileResponse(index_path)
        return {"message": "Frontend index.html not found"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
