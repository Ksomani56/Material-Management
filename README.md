# National Unified Material Master (NUMM) | 
An AI-driven National Unified Material Master Cataloging & Harmonization Platform built for Indian Central Public Sector Enterprises (CPSEs) under the Ministry of Petroleum and Natural Gas (MoPNG) and broader public sector organizations.

---

## 🌟 Overview

Large public sector enterprises (such as **ONGC, IOCL, GAIL, BPCL, HPCL, NTPC, BHEL, and SAIL**) often manage hundreds of thousands of material codes across legacy ERP systems (SAP S/4HANA, Oracle Cloud, Maximo, etc.). Variations in legacy naming conventions, abbreviations, language, and lack of standard taxonomy create massive duplicate inventory, procurement redundancies, and supply chain inefficiencies.

The **National Unified Material Master** solves this challenge by:
1. **Normalizing & Harmonizing** diverse legacy ERP item records into standardized **Common National Material Codes (CNMC)**.
2. Providing an **Explainable AI (XAI) Tri-Pane Workbench** for real-time duplicate detection, attribute parity comparison, and confidence-scored resolution.
3. Enabling seamless **Spreadsheet (XLS, XLSX, CSV) Ingestion** for batch onboarding of legacy CPSE catalogs.
4. Facilitating cross-CPSE **Inventory Rationalization & Migration** with complete immutable audit and governance trails.
5. Offering high-contrast, dual-theme support strictly aligned with **Foundry Light Master** and **National Unified Material Master** design systems.

---

## 🚀 Key Features

### 1. Dual-Theme Support (Light & Dark Mode)
- **Foundry Light Palette**: Crisp, high-readability light mode with `#f8fafb` base, clean white card containers, deep teal `#00513f` accents, and subtle borders.
- **National Unified Dark Palette**: Sleek dark aesthetic with `#131314` base, `#1f2020` elevated surfaces, and mint green `#c2ffe8` primary highlights.
- **One-Click Toggle**: Accessible from both the top navigation header and System Settings.

### 2. XLS / XLSX / CSV Batch Ingestion & Reader
- Drag-and-drop file upload with real-time spreadsheet parsing powered by `xlsx`.
- Automatically normalizes legacy column headers (`local_code`, `description`, `uom`, `specs`, `category`).
- Pre-ingestion preview modal allowing verification of row counts and sample records before importing.
- Target destination routing: Send unverified items to the **Review Queue** for AI deduplication, or commit verified records directly to the **National Master Catalogue**.
- One-click **Download Sample CSV** template for standard formatting.

### 3. AI-Powered Tri-Pane Harmonization Workbench
- **Source Record Pane (Left)**: Inspects legacy ERP descriptions, raw metadata, and extracted technical parameters.
- **Proposed CNMC Master (Center)**: Displays AI-inferred canonical descriptions, standardized attributes, confidence ratings, and explainable AI rationale.
- **Cross-CPSE Entity Network (Right)**: Visualizes identical, duplicate, and substitute materials across participating CPSEs.

### 4. Interactive Review Queue & Rationalization
- Priority-ranked backlog of suspected duplicates and near-duplicates.
- In-line action triggers (`APPROVE`, `FLAG`, `MERGE`, `RETIRE`).
- Interactive **Evidence Drawer** providing provenance trails, MESC/UNSPSC taxonomy classifications, and Downstream Migration Impact analysis.

### 5. CPSE Data Hub & Health Analytics
- Real-time synchronization monitor across 6 major CPSE pipelines (ONGC, IOCL, GAIL, BPCL, NTPC, BHEL).
- KPI metrics tracking total source codes, approved masters, mapping coverage, and review backlog.

---

## 🛠️ Tech Stack

- **Frontend Framework**: [React 18](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Styling**: [TailwindCSS](https://tailwindcss.com/) with semantic CSS custom properties
- **Spreadsheet Engine**: [SheetJS (xlsx)](https://docs.sheetjs.com/)
- **Iconography**: Google Material Symbols Outlined
- **Typography**: IBM Plex Sans & JetBrains Mono

---

## 📦 Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or yarn

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Ksomani56/Material-Management.git
   cd Material-Management
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the local development server**:
   ```bash
   npm run dev
   ```
   The application will be accessible at `http://127.0.0.1:3000/`.

4. **Build for production**:
   ```bash
   npm run build
   ```

---

## 📂 Project Structure

```
├── docs/                        # PRD and SRS specification documents
├── src/
│   ├── components/
│   │   ├── common/              # Reusable UI badges, modals & bars
│   │   │   ├── ConfidenceBar.tsx
│   │   │   ├── DataUploadModal.tsx
│   │   │   ├── RelationshipBadge.tsx
│   │   │   └── StatusBadge.tsx
│   │   ├── layout/              # TopAppBar, AppShell, EvidenceDrawer, ImpactModal
│   │   └── screens/             # Core functional screens
│   │       ├── OverviewScreen.tsx
│   │       ├── HarmonizationScreen.tsx
│   │       ├── ReviewQueueScreen.tsx
│   │       ├── MasterCatalogueScreen.tsx
│   │       ├── MaterialDetailScreen.tsx
│   │       ├── RationalizationScreen.tsx
│   │       ├── DataHubScreen.tsx
│   │       ├── AnalyticsScreen.tsx
│   │       ├── GovernanceScreen.tsx
│   │       └── SettingsScreen.tsx
│   ├── context/
│   │   └── AppContext.tsx       # Global application state & theme provider
│   ├── data/
│   │   └── mockData.ts          # Curated CPSE catalog mock data
│   ├── types/
│   │   └── material.ts          # Complete TypeScript domain schemas
│   ├── utils/
│   │   └── fileParser.ts        # Excel / CSV file parsing utility
│   ├── App.tsx                  # Root layout & screen router
│   ├── index.css                # CSS variables & Tailwind directives
│   └── main.tsx                 # React DOM mount point
├── index.html                   # HTML template
├── tailwind.config.js           # Tailwind theme configuration
├── tsconfig.json                # TypeScript compiler config
└── vite.config.ts               # Vite configuration (port 3000)
```

---

## 📜 License

This project is licensed under the MIT License - see the LICENSE file for details.
