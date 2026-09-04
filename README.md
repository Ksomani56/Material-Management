# AI-Driven National Unified Material Master Platform (SIH26099)
### Ministry of Petroleum & Natural Gas · "One Nation – One Material Code"

---

## 📌 Executive Architecture & Core Principle

The **National Unified Material Master (NUMM)** platform enables cross-CPSE material harmonization, equivalence detection, and standardized national code allocation while preserving strict CPSE-level local traceability.

> **Core Axiom (SRS v4.0): AI Recommends; Authorized Human Governance Approves.**
> - **Immutable CPSE Source Data:** Raw source records (`raw_payload`, original local codes, descriptions, units) are preserved without mutation.
> - **Canonical National Records:** Common National Material Codes (CNMCs) and Equivalence Groups follow strict governed lifecycles (`PROPOSED`, `UNDER_REVIEW`, `APPROVED`, `DEPRECATED`, `RETIRED`).
> - **Deterministic Local AI:** Runs 100% locally without external hosted LLM dependencies.
> - **Critical Contradiction Blocker:** High vector similarity cannot bypass critical technical attribute checks (e.g. pressure class `150#` vs `600#` or grade `SS316` vs `SS304` directly blocks identical classification and flags for human review).
> - **SAP / ERP Integration:** Outbound export adapter generates production-ready migration artifacts.

---

## 🏛️ Directory Structure

```
├── backend/
│   ├── app/
│   │   ├── main.py                     # FastAPI application, CORS, static mounting
│   │   ├── core/
│   │   │   ├── config.py               # Settings (weights, thresholds, prefixing)
│   │   │   └── database.py             # SQLAlchemy session and engine
│   │   ├── models/                     # Relational domain models
│   │   │   ├── enums.py                # RelationshipType, CNMCStatus, ReviewAction
│   │   │   ├── cpse.py                 # CPSE entity
│   │   │   ├── cpse_material.py        # Immutable source records & extracted attributes
│   │   │   ├── canonical_material.py   # Governed CNMC master
│   │   │   ├── equivalence_group.py    # AI equivalence grouping & evidence scores
│   │   │   ├── mapping.py              # CPSEMapping & MigrationRecord
│   │   │   ├── audit.py                # AuditEvent & ReviewDecision
│   │   │   └── procurement.py          # Historical spend & volume records
│   │   ├── schemas/                    # Pydantic request/response contracts
│   │   ├── adapters/                   # Hexagonal / Adapter layer
│   │   │   ├── ingestion/              # Tabular CSV/Excel parser & row-level validator
│   │   │   └── erp/                    # SAP / ERP migration export adapter
│   │   ├── services/                   # Business domain services
│   │   │   ├── vector_search.py        # all-MiniLM-L6-v2 embeddings + FAISS IndexFlatIP
│   │   │   ├── normalization.py        # Engineering abbreviation & UOM normalizer
│   │   │   ├── attribute_extractor.py  # Regex/rule-based parameter extraction
│   │   │   ├── matching_engine.py      # Hybrid lexical + FAISS KNN vector matcher
│   │   │   ├── dataset_generator.py    # 500-row industrial MRO proxy generator
│   │   │   ├── cnmc_generator.py       # Collision-safe atomic sequence allocator
│   │   │   ├── taxonomy_service.py     # UNSPSC classification recommender
│   │   │   ├── governance_service.py   # Human review decisions (MAP, MERGE, SPLIT, etc.)
│   │   │   └── analytics_service.py    # National & CPSE KPIs & spend aggregation
│   │   └── api/routers/                # REST API routers (cpse, matching, governance, canonical, erp, analytics, dataset)
│   ├── sample_data/                    # Benchmark catalogs (ONGC, IOCL, GAIL + 500-row industrial_mro_500.csv)
│   ├── tests/                          # 20 automated pytest test cases (100% passing)
│   │   ├── test_benchmark_dataset.py
│   │   ├── test_e2e.py
│   │   ├── test_erp_export.py
│   │   ├── test_governance.py
│   │   ├── test_ingestion.py
│   │   ├── test_live_endpoints.py      # Live harmonize & compare sandbox test cases
│   │   ├── test_matching.py            # Contradiction, alias, and UOM tests
│   │   └── test_vector_search.py       # all-MiniLM-L6-v2 + FAISS KNN tests
│   └── requirements.txt
├── frontend/                           # Responsive Governance Console
│   ├── index.html                      # UI with responsive Grid, "How It Works" & Live Sandboxes
│   ├── css/style.css                   # Enterprise theme, side-by-side cards, conflict alerts
│   └── js/app.js                       # Reactive state, live upload, interactive review & sandboxes
├── run.py                              # Unified zero-config application launcher
└── README.md
```

---

## 🚀 Quick Start

### 1. Requirements
- Python 3.10+
- Installed packages: `fastapi`, `uvicorn`, `sqlalchemy`, `pydantic`, `pandas`, `openpyxl`, `sentence-transformers`, `faiss-cpu`, `pytest`

### 2. Launch the Platform
```bash
python run.py
```
Open your browser at:
- **Responsive Governance Console:** [http://127.0.0.1:8000/](http://127.0.0.1:8000/)
- **Interactive Swagger API Docs:** [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)

### 3. Run Automated Tests
```bash
python -m pytest backend/tests -v
```
*(All 20 test cases passing)*

---

## 🛠️ End-to-End Workflow Verification

1. **Explore "How It Works" & Interactive Sandboxes:**
   - In the sidebar, click **"💡 How It Works & Architecture"**.
   - Test **Sandbox 1: Real-Time Attribute Extraction & UNSPSC Classification** using presets or custom text.
   - Test **Sandbox 2: Multi-Signal Matching & Contradiction Blocker** to simulate safe consolidation vs. blocked pressure/material hazards (`150#` vs `600#`).
2. **Ingest Catalogs:**
   - In the **Catalog Ingestion** tab, click **"⚡ Load 500-Row Industrial Benchmark (v2 Strategy)"** to ingest realistic proxy data for ONGC, IOCL, GAIL, BPCL, and HPCL.
   - Or upload custom CSV/Excel files. Valid rows are ingested while malformed rows are isolated into the error report.
3. **Execute AI Matching:**
   - In the **AI Equivalence Workbench** tab, click **"🚀 Run Cross-CPSE AI Matching"**.
   - The engine computes lexical overlap, FAISS dense vector cosine similarity, and attribute agreement.
   - Filter groups dynamically using the **Search Bar** and **Confidence Band Filter** (`High`, `Medium`, `Low`).
4. **Perform Human Governance Decision:**
   - Click **"✓ Approve & Mint CNMC"** on an equivalence group.
   - Enter a stewardship justification (e.g., *"Technical parameters confirmed identical across catalogs"*).
   - A collision-safe CNMC (e.g. `CNMC-VAL-2026-00001`) is atomically minted and mappings are approved.
5. **Inspect National Registry & Audit Trail:**
   - In the **National CNMC Registry**, view the newly minted national materials.
   - In the **Governance & Audit Trail**, inspect the immutable chronological record of the decision.
6. **Download SAP Migration Payload:**
   - In the **SAP / ERP Migration Export** tab, export approved mappings in CSV, Excel, or JSON ready for SAP BAPI / RFC ingestion.
