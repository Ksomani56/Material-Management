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
│   │   │   ├── config.py               # Settings (auto-detects custom-material-embedder, weights, thresholds)
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
│   │   │   ├── vector_search.py        # Custom fine-tuned material embedder + FAISS IndexFlatIP
│   │   │   ├── normalization.py        # Engineering abbreviation & UOM normalizer
│   │   │   ├── attribute_extractor.py  # Regex/rule-based parameter extraction
│   │   │   ├── matching_engine.py      # Hybrid lexical + FAISS KNN vector matcher
│   │   │   ├── dataset_generator.py    # 500-row industrial MRO proxy generator
│   │   │   ├── cnmc_generator.py       # Collision-safe atomic sequence allocator
│   │   │   ├── taxonomy_service.py     # UNSPSC classification recommender
│   │   │   ├── governance_service.py   # Human review decisions (MAP, MERGE, SPLIT, etc.)
│   │   │   └── analytics_service.py    # National & CPSE KPIs & spend aggregation
│   │   └── api/routers/                # REST API routers (cpse, matching, governance, canonical, erp, analytics, dataset)
│   ├── models/
│   │   └── custom-material-embedder/   # Fine-tuned domain SentenceTransformer (model.safetensors, tokenizer, config)
│   ├── sample_data/                    # Benchmark catalogs (ONGC, IOCL, GAIL + 500-row industrial_mro_500.csv)
│   ├── tests/                          # 20 automated pytest test cases (100% passing)
│   └── requirements.txt
├── data/
│   └── training/                       # 10,019 pairs (material_pairs.csv) and triplets (material_triplets.jsonl)
├── frontend/                           # Responsive Governance Console (HTML5 + Vanilla CSS + JS)
├── scripts/
│   ├── generate_training_dataset.py    # Generates 10k+ labeled domain pairs from governance + industrial templates
│   ├── train_material_embeddings.py    # Fine-tunes SentenceTransformer with CosineSimilarityLoss
│   ├── test_trained_model.py           # Verification script for equivalent vs hard-negative pairs
│   └── context_summarizer.py           # Synchronizes live database metrics into context.md
├── run.py                              # Unified zero-config application launcher
└── README.md
```

---

## 🧠 Custom Domain Embeddings & Model Training

The platform incorporates a domain-fine-tuned **SentenceTransformer** model (`custom-material-embedder`) trained to overcome generic embedding weaknesses on industrial MRO specifications.

### Why Fine-Tuning was Necessary
Generic models (e.g. baseline `all-MiniLM-L6-v2`) assign high cosine similarity (>0.85) to items that share 90% of tokens even if they have hazardous physical discrepancies (e.g., `150#` vs `600#` pressure rating).

Our fine-tuned model sharply discriminates these specifications while recognizing synonymous phrasing:

| Test Case | Material Pair | Fine-Tuned Cosine Sim | Target | Result |
| :--- | :--- | :--- | :--- | :--- |
| **Equivalent Positive** | `BALL VALVE 2 INCH 150# ASTM A105 RF`<br>vs `VALVE BALL 2IN 150 LB CS A105 RAISED FACE API 6D` | **0.8922** | $> 0.85$ | ✅ **Matched** |
| **Pressure Conflict** | `BALL VALVE 2 INCH 150# ASTM A105 RF`<br>vs `BALL VALVE 2 INCH 600# ASTM A105 RF` | **0.2292** | $< 0.70$ | 🚫 **Suppressed** |
| **Commodity Conflict** | `BALL VALVE 2 INCH 150# ASTM A105 RF`<br>vs `GATE VALVE 6 INCH 300# ASTM A216 WCB` | **-0.2933** | $< 0.40$ | 🚫 **Suppressed** |

### Retraining & Evaluation Commands

```bash
# 1. Generate 10,019 labeled training pairs from governance and synthetic triplets
python scripts/generate_training_dataset.py

# 2. Fine-tune the SentenceTransformer model (2 epochs, batch size 32)
python scripts/train_material_embeddings.py --data data/training/material_pairs.csv --epochs 2 --batch-size 32

# 3. Verify discrimination against benchmark pairs
python scripts/test_trained_model.py
```

---

## 🚀 Quick Start

### 1. Requirements
- Python 3.10+
- Installed packages: `fastapi`, `uvicorn`, `sqlalchemy`, `pydantic`, `pandas`, `openpyxl`, `sentence-transformers`, `faiss-cpu`, `pytest`, `accelerate`, `datasets`

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
*(All 20 test cases passing across all 8 modules)*

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
   - The engine computes lexical overlap, custom FAISS dense vector cosine similarity, and attribute agreement.
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
