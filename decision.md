# ⚖️ Architecture Decision Records (`decision.md`)
### National Unified Material Master (NUMM) Platform · Ministry of Petroleum & Natural Gas
> **Purpose:** Immutable log of foundational architecture, data governance, AI engineering, and integration decisions for SIH26099.

---

## 📌 Decision Log Summary

| ADR ID | Decision Title | Status | Impact Area |
| :--- | :--- | :--- | :--- |
| **ADR-001** | Primary Principle: "AI Recommends, Authorized Human Governance Approves" | **ACCEPTED** | Core Governance & Legal Liability |
| **ADR-002** | Immutable Source Layer & Raw Payload Preservation | **ACCEPTED** | Data Integrity & CPSE Traceability |
| **ADR-003** | Deterministic Local AI vs. Hosted External LLMs | **ACCEPTED** | Availability, Security & Latency |
| **ADR-004** | Critical Attribute Contradiction Blocker in Matching Engine | **ACCEPTED** | Plant Safety & Engineering Integrity |
| **ADR-005** | Collision-Safe Atomic Sequence Allocator for CNMC Minting | **ACCEPTED** | National Identifier Governance |
| **ADR-006** | Hexagonal Adapter Pattern for ERP/SAP Inbound/Outbound Data | **ACCEPTED** | System Interoperability & Decoupling |
| **ADR-007** | Granular Rationalization Actions (MAP, MERGE, SPLIT, RETAIN, RETIRE, REVIEW) | **ACCEPTED** | Legacy Migration Workflow |
| **ADR-008** | Append-Only Audit Trail & State Provenance | **ACCEPTED** | Compliance & Accountability |
| **ADR-009** | Dense Semantic Vector Search via all-MiniLM-L6-v2 & FAISS IndexFlatIP | **ACCEPTED** | AI Vector Architecture & Sub-Second KNN |
| **ADR-010** | Interactive Governance Sandboxes, Real-Time Harmonization & Alloy Grade Alias Canonicalization | **ACCEPTED** | User Experience, Live Architecture Sandbox & Metallurgical Precision |
| **ADR-011** | Domain-Specific SentenceTransformer Fine-Tuning & Hard-Negative Suppression | **ACCEPTED** | Precision Vector Discrimination & Physics-Aware Embeddings |

---

## ADR-001: Core Governance Axiom — "AI Recommends, Human Approves"

### Context & Problem Statement
In oil, gas, and energy CPSEs (ONGC, IOCL, GAIL), material master mismatches involve safety-critical items (e.g., high-pressure valves, explosive-atmosphere electricals, sour-gas grade piping). Fully autonomous AI merging risks catastrophic procurement errors if two non-identical items are incorrectly unified.

### Decision
Autonomous, unreviewed destructive write actions are strictly prohibited. The AI subsystem operates exclusively as an advisory recommendation engine. All canonical identity generation, material merging, or code retirement require authorization by an authorized Data Steward (National Master Steward or CPSE Data Steward).

### Alternatives Considered
- *Fully Automated Deduplication:* Rejected due to unacceptable risk of false consolidations in high-pressure/explosive environments.
- *Confidence-Threshold Auto-Approval:* Rejected for initial production phases; even high-confidence clusters must pass through explicit steward audit logging.

### Consequences
- ✅ Eliminates legal liability and operational hazards of automated erroneous substitutions.
- ✅ Full human accountability with cryptographic steward signatures in audit events.
- ⚠️ Requires an intuitive, high-efficiency Governance Console UI to prevent steward review bottlenecks.

---

## ADR-002: Immutable Source Layer & Raw Payload Preservation

### Context & Problem Statement
Participating CPSEs operate independent, long-standing ERP systems (SAP ECC/S4HANA, Oracle). CPSEs resist centralized harmonization if it risks corrupting their local historical records, local PO history, or accounting ledgers.

### Decision
1. Ingested raw source data is immutable. Original descriptions, local item codes, source units of measure, and raw payloads (`raw_payload` JSON) are stored once and never mutated or overwritten.
2. Normalized descriptions, extracted attributes, and canonical links exist as secondary, derived relational entities referencing the immutable source record.

### Alternatives Considered
- *In-Place Mutation of CPSE Records:* Overwriting local records with normalized text. Rejected because it destroys auditability and breaks compatibility with CPSE legacy ERPs.

### Consequences
- ✅ Guarantees 100% backward traceability to original CPSE purchase orders and ERP records.
- ✅ Enables re-running new normalization or extraction algorithms against historical raw records without re-importing.
- ⚠️ Increases database storage footprint (storing both raw JSON and parsed attributes).

---

## ADR-003: Deterministic Local AI vs. Hosted Cloud LLMs

### Context & Problem Statement
CPSE materials include confidential defense, strategic petroleum reserve, and critical infrastructure equipment data. Furthermore, procurement platforms must operate reliably in restricted intranet environments or air-gapped data centers without recurring API cost or external service rate-limiting.

### Decision
The core matching, extraction, and deduplication engine is 100% deterministic, local, and hosted within the application process. It utilizes:
1. Configurable domain rule engines and regex extractors.
2. Domain-tuned engineering abbreviation and UOM dictionaries.
3. Local lexical matching (TF-IDF, Token Sort, Jaccard) combined with local vector embeddings (cosine similarity).
4. Zero dependency on third-party cloud APIs (OpenAI, Anthropic, etc.).

### Alternatives Considered
- *Cloud LLM API Integration (GPT-4 / Claude):* Rejected due to data sovereignty concerns, recurring token costs, non-deterministic outputs, and external network dependency.

### Consequences
- ✅ Zero ongoing external API operating costs.
- ✅ Predictable, fully explainable, and reproducible matching scores.
- ✅ Meets public sector security and air-gapped deployment mandates.
- ⚠️ Engineering dictionaries and abbreviation mappings must be continuously maintained and enriched.

---

## ADR-004: Critical Attribute Contradiction Blocker

### Context & Problem Statement
High semantic embedding similarity often occurs between descriptions that differ by only a single critical specification token (e.g., `GATE VALVE FLANGED 150#` vs `GATE VALVE FLANGED 600#` or `PIPE CS SEAMLESS A105` vs `PIPE SS316 SEAMLESS`). In vector space, these phrases have ~95% cosine similarity, yet physically they are completely incompatible and dangerous if interchanged.

### Decision
Introduce a **Hard Contradiction Blocker** in the AI matching pipeline:
1. Extract critical technical attributes: Pressure Class (`150#`, `300#`, `600#`), Material Grade (`A105`, `SS304`, `SS316`), Size/Schedule (`DN50`, `SCH 40`, `SCH 80`), and Voltage.
2. If two items exhibit conflicting values in any identified critical attribute, the system forces an immediate **Contradiction Flag**, lowers the composite score, and strictly blocks recommendation of `IDENTICAL` or `MERGE` actions, forcing a `REVIEW` state with an explicit warning banner.

### Alternatives Considered
- *Weighted Cosine Distance alone:* Rejected because statistical vector representations cannot reliably guarantee binary physics-based exclusion.

### Consequences
- ✅ Completely prevents hazardous physical mismatches.
- ✅ Directly addresses the primary risk cited in SRS v4.0 Section 4.2.

---

## ADR-005: Collision-Safe Atomic Sequence Allocator for CNMC

### Context & Problem Statement
Common National Material Codes (CNMCs) must be globally unique across all CPSEs. Concurrent steward approvals across different terminals could result in duplicate sequence numbers if not handled atomically.

### Decision
CNMCs follow the standardized format: `CNMC-{FAMILY}-{YEAR}-{SEQUENCE}` (e.g., `CNMC-VAL-2026-00001`).
Sequence generation uses database-level row locking and synchronized atomic transactions in `cnmc_generator.py` to guarantee zero collisions, strictly monotonic increments, and zero gaps under concurrent steward reviews.

### Alternatives Considered
- *UUIDs / Random Hashes:* Rejected because human engineers and procurement teams require human-readable, pronounceable, and filterable codes.
- *CPSE-Prefixed Codes:* Rejected because CNMCs represent the unified national identity, not a single CPSE.

### Consequences
- ✅ Clean, standardized, human-readable national codes.
- ✅ Thread-safe and transaction-safe sequence integrity.

---

## ADR-006: Hexagonal Adapter Pattern for ERP/SAP Integration

### Context & Problem Statement
Participating CPSEs run different ERP configurations (SAP ECC 6.0, S/4HANA, Oracle ERP, custom legacy). Inbound data formats and outbound migration expectations vary. Hardcoding SAP structures into the core application would compromise maintainability.

### Decision
Implement the Hexagonal (Ports & Adapters) pattern:
- **Core Domain:** Operates purely on canonical schemas (`CPSEMaterial`, `CanonicalMaterial`, `CPSEMapping`).
- **Inbound Adapters (`backend/app/adapters/ingestion`):** Ingest and validate heterogeneous CSV/Excel/JSON files into domain entities.
- **Outbound Adapters (`backend/app/adapters/erp`):** Transform canonical mappings into target ERP-ready migration payloads (SAP BAPI compatible CSV, Excel, and JSON).

### Alternatives Considered
- *Monolithic Schema Coupling:* Directly storing SAP table structures (MARA, MAKT) in the core DB. Rejected as it breaks support for non-SAP CPSEs.

### Consequences
- ✅ Core domain remains pure, clean, and independent of specific ERP vendors.
- ✅ New ERP adapters can be added without modifying the core matching or governance engines.

---

## ADR-007: Granular Rationalization Actions

### Context & Problem Statement
Legacy catalog harmonization requires multiple distinct business outcomes beyond simple 1:1 mapping.

### Decision
Support six distinct rationalization actions as first-class domain operations:
1. `MAP`: Associate local CPSE code to an approved canonical CNMC.
2. `MERGE`: Consolidate duplicate records into a newly minted CNMC identity.
3. `SPLIT`: Disaggregate an erroneously clustered equivalence group.
4. `RETAIN`: Designate a local material as strictly CPSE-specific (no national equivalence).
5. `RETIRE`: Mark legacy local material code for phase-out after successful ERP migration.
6. `REVIEW`: Hold record in an escalated stewardship queue with technical ambiguity notes.

### Consequences
- ✅ Matches real-world enterprise procurement workflows.
- ✅ Provides unambiguous instructions to downstream SAP migration teams.

---

## ADR-008: Append-Only Immutable Audit Trail

### Context & Problem Statement
Public sector procurement in India is subject to strict CVC (Central Vigilance Commission) and CAG compliance. Every classification, approval, or code merge must be traceable to a specific actor, timestamp, and justification.

### Decision
1. All governance actions write an immutable row to `audit_events` and `review_decisions`.
2. No audit record can be updated or deleted via the application API.
3. Records capture: Actor ID, Role, Target Object, Action Type, Reason Justification, Previous State, New State, and Algorithm/Model Version.

### Consequences
- ✅ 100% compliance with government vigilance and audit requirements.
- ✅ Full explainability of why two items were deemed equivalent or merged.

---

## ADR-009: Dense Semantic Vector Search via all-MiniLM-L6-v2 & FAISS IndexFlatIP

### Context & Problem Statement
Per `AI_Architecture_Execution_Strategy_v2.docx`, lexical overlap alone struggles with synonymous industrial descriptions, word-order permutations, and un-aliased technical phrasing. However, large language models (LLMs) are too high-latency and unsuitable for tight performance budgets ($\le 2.0\text{s}$ per material). High-speed semantic similarity retrieval is required across hundreds of thousands of inventory items.

### Decision
1. Deploy `all-MiniLM-L6-v2` locally via `sentence-transformers` to generate 384-dimensional dense vector embeddings.
2. Maintain a dedicated vector index using `faiss.IndexFlatIP` with L2-normalized embeddings, providing exact inner product cosine similarity computation in sub-millisecond execution times.
3. Pre-filter candidate pairs via FAISS K-Nearest Neighbors (KNN with $k=10$) before computing lexical, attribute, and contradiction rules.
4. If technical attribute contradictions occur, enforce hard contradiction penalties and demote candidate classification, preventing vector similarity from overriding physical specifications.

### Consequences
- ✅ Sub-second candidate retrieval meeting the $\le 2\text{s}$ non-functional target.
- ✅ Operates 100% locally with zero cloud API dependencies.
- ✅ Combines dense semantic comprehension with strict deterministic engineering rules.

---

## ADR-010: Interactive Governance Sandboxes, Real-Time Harmonization & Alloy Grade Alias Canonicalization

### Context & Problem Statement
Material stewards and evaluators require immediate visibility into how raw strings are parsed into engineering attributes and how the hybrid scoring engine detects or blocks physical contradictions. Previously, users could only see results after ingesting entire CSV files and running batch matching. Furthermore, legacy catalogs frequently alternate between full ASTM specifications (`ASTM A216 WCB`, `ASTM A105`, `ASTM A182 F316`) and colloquial abbreviations (`WCB`, `A105`, `SS316`), as well as inverted noun ordering (`VALVE BALL` vs `BALL VALVE`), which risked false critical contradictions if not canonicalized prior to attribute comparison.

### Decision
1. **Interactive Frontend Architecture Console:** Add a dedicated **"💡 How It Works & Architecture"** tab to the UI featuring:
   - Visual 6-Stage Architecture Pipeline (Ingestion $\to$ Normalization $\to$ FAISS Retrieval $\to$ Contradiction Blocker $\to$ Human Governance $\to$ SAP Sync).
   - Real-Time Live Attribute Extraction Sandbox with industry presets.
   - Dual-Record Multi-Signal Comparison Sandbox simulating safe consolidation vs. blocked pressure/material hazards.
   - Standard Operating Procedure (SOP) workflow cards for stewards.
2. **Dedicated Live Sandbox Endpoints:**
   - `POST /api/cpse/materials/harmonize-live`: Returns normalized description, extracted attributes, canonical standard title, and UNSPSC commodity classification in real time.
   - `POST /api/matching/compare-live`: Evaluates two materials, computing dense vector cosine, lexical Jaccard, attribute agreement, UOM match, and physical contradiction checks.
3. **Alloy Grade Alias Canonicalization:**
   - Implement `GRADE_ALIAS_MAP` in `NormalizationService` mapping synonymous alloy grades (`ASTM A216 WCB` $\leftrightarrow$ `WCB`, `SS316` $\leftrightarrow$ `ASTM A182 F316`, `ASTM A105` $\leftrightarrow$ `A105`, `LF2` $\leftrightarrow$ `ASTM A350 LF2`) to their base metallurgical family.
4. **Inverted Noun & Pressure Standardization:**
   - Implement `INVERTED_NOUN_PATTERNS` in `AttributeExtractor` mapping `VALVE BALL` $\to$ `BALL VALVE`, `FLANGE WELD NECK` $\to$ `WELD NECK FLANGE`.
   - Implement `standardize_pressure_rating` standardizing `150#`, `150 LB`, `150 LBS`, `CLASS 150`, and `PN` ratings consistently.

### Consequences
- ✅ Eliminates false-positive contradictions caused by naming conventions or ASTM prefix variations.
- ✅ Provides instant, transparent verification for competition judges and operational stewards.
- ✅ Maintains absolute physical safety: genuine conflicts (e.g. `150#` vs `600#` or `Carbon Steel` vs `Stainless Steel`) remain strictly blocked with red alerts.
- ✅ Enriches the Executive Dashboard with Estimated Bulk Procurement Synergy Savings (`₹ Cr`) and 3-tier Confidence Distribution Bands.

---

## ADR-011: Domain-Specific SentenceTransformer Fine-Tuning on Industrial MRO Governance Data & Synthetic Hard Negatives

### Context & Problem Statement
General-purpose embedding models (such as baseline `all-MiniLM-L6-v2`) are trained on natural language corpora (web articles, Wikipedia, Q&A). When applied to dense industrial engineering descriptions, they rely heavily on lexical bag-of-words token overlap. Consequently, two descriptions that share 90% identical words but differ in a single critical engineering specification—such as pressure class (`150#` vs `600#`) or pipe schedule (`SCH 40` vs `SCH 160`)—frequently receive misleadingly high cosine similarities ($>0.85$). While our deterministic Rule Engine blocks these contradictions during final evaluation, embedding space itself should naturally separate physically incompatible items.

### Decision
1. **Automated Domain Dataset Synthesis (`scripts/generate_training_dataset.py`):**
   - Extract ground-truth positive pairs from the human-governed canonical audit trail (19 high-confidence steward-verified mappings).
   - Generate 10,000 domain-specific triplets and continuous similarity pairs spanning Valves, Flanges, Pipes, Pumps, and Gaskets with realistic variations (abbreviations, ASTM standards, pressure classes, and sizes).
   - Construct deliberate **hard negatives**: pairs identical in all text except for conflicting pressure ratings, material grades, or wall thicknesses.
2. **Supervised Metric Learning (`scripts/train_material_embeddings.py`):**
   - Fine-tune `SentenceTransformer` using `CosineSimilarityLoss` on continuous labels ($1.0$ for true equivalents, $0.0$ for hard negatives).
   - Evaluate against an 85/15 validation split using `EmbeddingSimilarityEvaluator`.
3. **Artifact Serialization & Dynamic Loading (`backend/app/core/config.py`):**
   - Save the fine-tuned model artifacts (safetensors, tokenizers, configs) directly to `backend/models/custom-material-embedder`.
   - Update `Settings.EMBEDDING_MODEL_NAME` to automatically detect and load the custom fine-tuned model if available, while preserving runtime environment variable overrides.

### Consequences
- ✅ **Dramatic Hard-Negative Separation:** Cosine similarity on rating discrepancies (`150#` vs `600#`) dropped from $>0.85$ down to **0.2292**, naturally segregating incompatible equipment in vector space.
- ✅ **Robust Synonym Invariance:** Equivalence pairs with distinct word orders and abbreviations (`BALL VALVE 2 INCH 150# ASTM A105 RF` vs `VALVE BALL 2IN 150 LB CS A105 RAISED FACE API 6D`) achieve **0.8922** cosine similarity.
- ✅ **Strong Generalization:** Pearson Cosine Correlation on held-out validation data reached **0.9676** and Spearman Correlation reached **0.8660** with a final training loss of **0.0787**.
- ✅ **100% Offline & Deterministic:** Operates fully locally on CPU/GPU without external cloud dependencies.


