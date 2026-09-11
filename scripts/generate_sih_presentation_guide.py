import os
import sys
import docx
from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_ALIGN_VERTICAL
from docx.oxml import OxmlElement, parse_xml
from docx.oxml.ns import nsdecls, qn

def set_cell_background(cell, hex_color):
    """Sets background color of a table cell."""
    tc_pr = cell._element.get_or_add_tcPr()
    shd = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{hex_color}"/>')
    tc_pr.append(shd)

def set_cell_margins(cell, top=120, bottom=120, left=160, right=160):
    """Sets inner padding for table cell (in twips, 20 twips = 1 pt)."""
    tc_pr = cell._element.get_or_add_tcPr()
    tcMar = parse_xml(
        f'<w:tcMar {nsdecls("w")}>'
        f'<w:top w:w="{top}" w:type="dxa"/>'
        f'<w:bottom w:w="{bottom}" w:type="dxa"/>'
        f'<w:left w:w="{left}" w:type="dxa"/>'
        f'<w:right w:w="{right}" w:type="dxa"/>'
        f'</w:tcMar>'
    )
    tc_pr.append(tcMar)

def set_cell_border(cell, **kwargs):
    """Sets specific cell borders."""
    tcPr = cell._element.get_or_add_tcPr()
    tcBorders = tcPr.first_child_found_in("w:tcBorders")
    if tcBorders is None:
        tcBorders = OxmlElement('w:tcBorders')
        tcPr.append(tcBorders)
    
    for edge in ('top', 'left', 'bottom', 'right', 'insideH', 'insideV'):
        edge_data = kwargs.get(edge)
        if edge_data:
            tag = f'w:{edge}'
            element = tcBorders.find(qn(tag))
            if element is None:
                element = OxmlElement(tag)
                tcBorders.append(element)
            for key, attr in [('val', 'w:val'), ('color', 'w:color'), ('sz', 'w:sz'), ('space', 'w:space')]:
                if key in edge_data:
                    element.set(qn(attr), str(edge_data[key]))

def add_callout_box(doc, title, body_paragraphs, theme="navy"):
    """Creates an executive shaded callout box with a prominent left accent border."""
    color_map = {
        "navy": {"bg": "F8FAFC", "border": "0F172A", "title_color": RGBColor(15, 23, 42)},
        "emerald": {"bg": "F0FDF4", "border": "10B981", "title_color": RGBColor(6, 95, 70)},
        "amber": {"bg": "FFFBEB", "border": "F59E0B", "title_color": RGBColor(146, 64, 14)},
        "cyan": {"bg": "ECFEFF", "border": "06B6D4", "title_color": RGBColor(14, 116, 144)},
        "purple": {"bg": "FAF5FF", "border": "8B5CF6", "title_color": RGBColor(107, 33, 168)}
    }
    cfg = color_map.get(theme, color_map["navy"])
    
    table = doc.add_table(rows=1, cols=1)
    table.alignment = WD_TABLE_ALIGNMENT.CENTER
    cell = table.cell(0, 0)
    cell.width = Inches(6.8)
    
    set_cell_background(cell, cfg["bg"])
    set_cell_margins(cell, top=140, bottom=140, left=200, right=160)
    set_cell_border(cell, 
                    left={"val": "single", "sz": "28", "color": cfg["border"]},
                    top={"val": "none"}, right={"val": "none"}, bottom={"val": "none"})
    
    p_title = cell.paragraphs[0]
    p_title.paragraph_format.space_before = Pt(0)
    p_title.paragraph_format.space_after = Pt(4)
    run_title = p_title.add_run(f"■  {title}")
    run_title.bold = True
    run_title.font.size = Pt(11)
    run_title.font.color.rgb = cfg["title_color"]
    run_title.font.name = "Calibri"
    
    for text in body_paragraphs:
        p_body = cell.add_paragraph()
        p_body.paragraph_format.space_before = Pt(2)
        p_body.paragraph_format.space_after = Pt(4)
        run_body = p_body.add_run(text)
        run_body.font.size = Pt(9.5)
        run_body.font.color.rgb = RGBColor(51, 65, 85)
        run_body.font.name = "Calibri"
        
    p_spacer = doc.add_paragraph()
    p_spacer.paragraph_format.space_before = Pt(0)
    p_spacer.paragraph_format.space_after = Pt(6)

def format_table(table, header_bg="0F172A", alt_bg="F8FAFC"):
    """Applies modern executive styling to a table."""
    table.alignment = WD_TABLE_ALIGNMENT.CENTER
    for idx, row in enumerate(table.rows):
        is_header = (idx == 0)
        for cell in row.cells:
            cell.vertical_alignment = WD_ALIGN_VERTICAL.CENTER
            set_cell_margins(cell, top=100, bottom=100, left=140, right=140)
            if is_header:
                set_cell_background(cell, header_bg)
                set_cell_border(cell, 
                                top={"val": "single", "sz": "6", "color": "334155"},
                                bottom={"val": "single", "sz": "16", "color": "10B981"},
                                left={"val": "none"}, right={"val": "none"})
                for p in cell.paragraphs:
                    p.alignment = WD_ALIGN_PARAGRAPH.LEFT
                    for run in p.runs:
                        run.font.bold = True
                        run.font.size = Pt(9.5)
                        run.font.color.rgb = RGBColor(255, 255, 255)
                        run.font.name = "Calibri"
            else:
                bg = alt_bg if idx % 2 == 1 else "FFFFFF"
                set_cell_background(cell, bg)
                set_cell_border(cell, 
                                bottom={"val": "single", "sz": "4", "color": "E2E8F0"},
                                top={"val": "none"}, left={"val": "none"}, right={"val": "none"})
                for p in cell.paragraphs:
                    for run in p.runs:
                        run.font.size = Pt(9)
                        run.font.color.rgb = RGBColor(30, 41, 59)
                        run.font.name = "Calibri"

def generate_sih_guide():
    doc = Document()
    
    # Page setup
    for section in doc.sections:
        section.top_margin = Inches(0.8)
        section.bottom_margin = Inches(0.8)
        section.left_margin = Inches(0.8)
        section.right_margin = Inches(0.8)
        section.header.is_linked_to_previous = False
        p_hdr = section.header.paragraphs[0]
        p_hdr.alignment = WD_ALIGN_PARAGRAPH.RIGHT
        r_hdr = p_hdr.add_run("SMART INDIA HACKATHON (SIH) — OFFICIAL PRESENTATION & DEFENSE DOSSIER")
        r_hdr.font.size = Pt(8)
        r_hdr.font.color.rgb = RGBColor(148, 163, 184)
        
        p_ftr = section.footer.paragraphs[0]
        p_ftr.alignment = WD_ALIGN_PARAGRAPH.CENTER
        r_ftr = p_ftr.add_run("NUMM: National Unified Material Master | Problem ID: SIH26099 | Simple Language Defense Guide")
        r_ftr.font.size = Pt(8)
        r_ftr.font.color.rgb = RGBColor(148, 163, 184)

    navy = RGBColor(15, 23, 42)
    emerald = RGBColor(16, 185, 129)
    slate = RGBColor(71, 85, 105)
    
    # Title Block
    title_p = doc.add_paragraph()
    title_p.paragraph_format.space_before = Pt(20)
    title_p.paragraph_format.space_after = Pt(2)
    run_org = title_p.add_run("SMART INDIA HACKATHON | MINISTRY OF PETROLEUM & NATURAL GAS")
    run_org.bold = True
    run_org.font.size = Pt(11)
    run_org.font.color.rgb = emerald
    
    h1 = doc.add_paragraph()
    h1.paragraph_format.space_before = Pt(0)
    h1.paragraph_format.space_after = Pt(6)
    run_h1 = h1.add_run("SIH Presentation, Pitch Script & Judges Q&A Defense Guide")
    run_h1.bold = True
    run_h1.font.size = Pt(22)
    run_h1.font.color.rgb = navy
    
    sub_p = doc.add_paragraph()
    sub_p.paragraph_format.space_before = Pt(0)
    sub_p.paragraph_format.space_after = Pt(14)
    run_sub = sub_p.add_run("Project: National Unified Material Master (NUMM) — Simplified English Guide with Real-World Analogies and Memory Keywords for High-Scoring Defense")
    run_sub.font.size = Pt(10.5)
    run_sub.font.color.rgb = slate
    
    # Quick Badges
    meta_table = doc.add_table(rows=2, cols=4)
    meta_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    m_headers = ["Problem ID", "Target Sector", "Core Innovation", "System Status"]
    m_values = ["SIH26099", "Energy & Oil CPSEs", "Neuro-Symbolic AI + 7D Physics", "100% Tested (62/62 Passed)"]
    for i in range(4):
        meta_table.cell(0, i).paragraphs[0].add_run(m_headers[i])
        meta_table.cell(1, i).paragraphs[0].add_run(m_values[i])
    format_table(meta_table, header_bg="0F172A", alt_bg="F1F5F9")
    
    doc.add_paragraph().paragraph_format.space_after = Pt(10)
    
    # Notice Box
    add_callout_box(doc, "GOLDEN ADVICE FOR THE PRESENTATION", [
        "1. Speak simply: Judges appreciate clear thinking and real-world clarity over confusing jargon.",
        "2. Use analogies: For example, explain the 7D Physics Matrix as 'blood group matching'—you never mix blood groups just because two people look similar.",
        "3. Emphasize safety: In oil and gas, a wrong material merge causes explosions, not just software bugs.",
        "4. Emphasize non-invasive adoption: We don't replace ONGC's SAP; we give them a cross-reference bridge."
    ], theme="navy")
    
    # ------------------ SECTION 1 ------------------
    doc.add_heading("1. Pitch Scripts: Simple English & Ready to Speak", level=1).runs[0].font.color.rgb = navy
    
    doc.add_heading("1.1 The 30-Second Hook (Memorize This by Heart)", level=2).runs[0].font.color.rgb = emerald
    add_callout_box(doc, "EXACT WORDS TO SPEAK IN THE FIRST 30 SECONDS", [
        "\"Respected judges, across Indian PSUs like ONGC, IOCL, and GAIL, over 4,500 Crores of public money is locked in duplicate spare parts and idle warehouse inventory.\"",
        "\"Why? Because every PSU uses different names, short forms, and internal codes for the exact same physical item. A valve in ONGC cannot be recognized by IOCL.\"",
        "\"To solve this, we created NUMM: the National Unified Material Master. It is a 100% air-gapped, sovereign AI system that combines smart AI search with strict engineering physics rules. It finds duplicates in milliseconds, prevents catastrophic plant accidents, and enables PSUs to share inventory without changing their existing SAP systems. Let us show you live!\""
    ], theme="emerald")
    
    doc.add_heading("1.2 The 3-Minute Presentation Story (Three Easy Steps)", level=2).runs[0].font.color.rgb = navy
    
    p1 = doc.add_paragraph()
    p1.add_run("Step 1: The Problem — Why Ordinary AI Fails in Refineries (1 Minute)\n").bold = True
    p1.add_run(
        "\"Judges, this problem cannot be solved by simply asking ChatGPT or using basic string search. "
        "In a refinery, if you take a '150-pound valve' and a '300-pound valve', they share 95% of the same words. "
        "A standard AI will say: 'These two descriptions are 95% identical, let us merge them!' "
        "If an engineer installs that lower-rated valve in a high-pressure gas line, it will rupture and explode. "
        "Therefore, pure text AI is dangerous for heavy engineering. We needed an AI that actually understands engineering physics.\""
    )
    
    p2 = doc.add_paragraph()
    p2.add_run("Step 2: Our Innovation — Neuro-Symbolic AI + 7D Physics Matrix (1 Minute)\n").bold = True
    p2.add_run(
        "\"Our solution works in two smart steps: "
        "First, our AI scans through 100,000 messy PSU descriptions in under 20 milliseconds to find possible candidates. "
        "Second, before declaring a match, our 7-Dimension Physics Consistency Matrix checks 7 critical engineering facts: "
        "Pipe Size, Pressure Rating, Metallurgy, Wall Thickness, End Connection, International Standard, and Trim. "
        "If the pressure or size does not match, our system triggers a Hard Veto. The AI is overruled. Engineering safety wins 100% of the time.\""
    )
    
    p3 = doc.add_paragraph()
    p3.add_run("Step 3: Real Financial Impact & Non-Invasive ERP Integration (1 Minute)\n").bold = True
    p3.add_run(
        "\"NUMM does not just clean catalogs; it saves real government money. "
        "Our Arbitrage Agent notices when GAIL is about to float a tender for a valve that IOCL already has sitting idle 30 km away, and prescribes a zero-tender inter-PSU stock transfer. "
        "Best of all, ONGC and IOCL do not need to replace their existing SAP or Oracle systems. "
        "Our ERP Adapter exports ready-to-ingest mapping files directly into SAP BAPI_MATERIAL_SAVEDATA. "
        "PSUs can start saving capital from day one without disrupting active plant operations.\""
    )
    
    # ------------------ SECTION 2 ------------------
    doc.add_heading("2. Live Demonstration Flow: Exact Click Sequence", level=1).runs[0].font.color.rgb = navy
    doc.add_paragraph("Follow this step-by-step click order during your 5-minute live demo on your laptop:")
    
    demo_table = doc.add_table(rows=7, cols=4)
    d_heads = ["Step / Screen", "What You Click on Laptop", "What Appears on Screen", "Simple Explanation to Say"]
    d_data = [
        ("1. AI Sandbox (Home)", 
         "Click 'Interactive AI Sandbox'. Type 'VLV BALL 2IN 150# CS' and hit Compare.", 
         "Top matching national canonical materials, green physics checkmarks, and token percentages.", 
         "\"Watch our AI read messy short forms like 'VLV' and '150#' and map them to the correct national engineering record in 18 milliseconds.\""),
        
        ("2. Contradiction Blocker (Review)", 
         "Go to 'Review Queue'. Click on a candidate pair with differing pressure ratings.", 
         "Bright red 'Physics Contradiction Blocker' banner. Merge button is locked.", 
         "\"Here is our safety guardrail. The descriptions look similar, but because the pressure class differs, the system blocks accidental merging.\""),
        
        ("3. 3D Manifold Explorer", 
         "Click '3D Semantic Manifold'. Rotate the spatial 3D cluster with your mouse.", 
         "Smooth 3D point cloud colored by PSU (Gold=ONGC, Green=IOCL, Blue=GAIL).", 
         "\"This 3D view turns complex AI vectors into a spatial map, helping procurement officers visually discover overlapping spare parts across PSUs.\""),
        
        ("4. Working Capital Arbitrage", 
         "Click 'Working Capital Arbitrage' tab. Click 'Run Prescriptive Agent'.", 
         "AI thought process, price variance table (34% spread), and suggested stock transfers.", 
         "\"Here our AI agent finds that ONGC bought this valve for ₹12,000 while GAIL paid ₹18,000, and prescribes sharing idle stock instead of floating new tenders.\""),
        
        ("5. ERP Migration Ledger", 
         "Click 'Catalog Rationalization' → 'ERP Migration Ledger' tab.", 
         "Live table of 79 validated mappings with CSV, Excel, and JSON export buttons.", 
         "\"We don't force ONGC to rewrite their SAP codes. We export ready-to-use cross-reference files for SAP BAPI_MATERIAL_SAVEDATA with one click.\""),
        
        ("6. Cryptographic Audit Trail", 
         "Click 'Governance & Compliance'. Show audit events table.", 
         "Table showing SHA-256 digital hashes, timestamps, and user IDs for every decision.", 
         "\"Every single steward approval and override is permanently signed with a SHA-256 digital hash, ready for government CAG audits.\"")
    ]
    for c_idx, h in enumerate(d_heads):
        demo_table.cell(0, c_idx).paragraphs[0].add_run(h)
    for r_idx, row in enumerate(d_data):
        for c_idx, val in enumerate(row):
            demo_table.cell(r_idx + 1, c_idx).paragraphs[0].add_run(val)
    format_table(demo_table, header_bg="0F172A", alt_bg="F8FAFC")
    
    doc.add_paragraph().paragraph_format.space_after = Pt(10)
    
    # ------------------ SECTION 3 ------------------
    doc.add_heading("3. The Core Concepts in Everyday Language", level=1).runs[0].font.color.rgb = navy
    
    concepts = [
        ("The 7-Dimension Physics Consistency Matrix",
         "What it is: A digital rulebook that checks 7 essential mechanical dimensions: Pipe Size, Pressure Rating, Material Metal, Wall Thickness, Flange Connection, Engineering Standard (ASME/API), and Valve Trim.",
         "Simple Analogy: Think of it like checking blood groups before a blood transfusion. Even if two people have the exact same height and age, you cannot mix their blood if the type is incompatible. In the same way, we never merge two valves if their pressure rating is incompatible.",
         "navy"),
        
        ("Two-Stage Search (Bi-Encoder + Cross-Encoder)",
         "What it is: Stage 1 quickly scans 100,000 items in milliseconds using vector search to pick the top 50 candidates. Stage 2 reads those top 50 deeply word-by-word using a cross-attention transformer.",
         "Simple Analogy: Like searching for a book in a huge library. First, the librarian quickly walks to the right shelf in 5 seconds (Stage 1). Then, she opens the top 5 books and reads the exact table of contents to give you the perfect answer (Stage 2).",
         "emerald"),
         
        ("Active Learning with Triplet Loss",
         "What it is: The model automatically learns from human engineers whenever they click 'Approve' or 'Reject' on borderline cases.",
         "Simple Analogy: Like a junior apprentice working next to a senior master engineer. Whenever the senior engineer says 'Yes, these two are identical' or 'No, these cannot be swapped', the apprentice takes notes and never repeats that mistake again.",
         "amber"),
         
        ("Local ERP Immutability (Non-Invasive Adoption)",
         "What it is: PSUs keep their internal material codes and 20 years of purchase history unchanged. NUMM only links their existing code to the national standard as an alias.",
         "Simple Analogy: Just like your Aadhaar card links to your existing bank account. You do not have to close your SBI or HDFC bank account to get an Aadhaar card; Aadhaar simply links them together.",
         "cyan"),
         
        ("Autonomous Working Capital Arbitrage Agent",
         "What it is: An autonomous AI software agent that finds unused inventory in one PSU and alerts another PSU to use it instead of buying new.",
         "Simple Analogy: Like a neighborhood sharing tool. If your brother already has an expensive lawnmower sitting in his garage next door, the app tells you to borrow his instead of buying a new one from the market.",
         "purple")
    ]
    
    for title, what_is, analogy, theme in concepts:
        add_callout_box(doc, title, [what_is, analogy], theme=theme)
        
    # ------------------ SECTION 4 ------------------
    doc.add_heading("4. How to Win the Judges Q&A Defense", level=1).runs[0].font.color.rgb = navy
    doc.add_paragraph("Here are the top 7 hardest questions judges ask, with simple, confident answers:")
    
    qas = [
        ("Judge asks: \"Why didn't you just use ChatGPT or Gemini API?\"",
         "Answer: \"Sir, two major reasons: First is Engineering Safety. ChatGPT is a language model; it does not understand that a 150# valve will burst under 300# pressure. It frequently merges them because the words look 95% identical. Second is National Data Sovereignty. PSU refinery pipelines and turbine spare parts are classified critical national assets. Under Indian IT security laws, we cannot send sensitive defense and oil telemetry to American cloud servers. NUMM is 100% air-gapped and runs locally.\""),
        
        ("Judge asks: \"Will ONGC have to change its existing SAP system?\"",
         "Answer: \"No, sir. We follow the 'Local Immutability Principle'. ONGC keeps their internal material codes, plant maintenance history, and accounting ledgers 100% untouched. NUMM works as a translation bridge. We export clean mapping files that feed directly into SAP BAPI_MATERIAL_SAVEDATA. An ONGC engineer can search either their old number or the new National code inside SAP.\""),
         
        ("Judge asks: \"What if your AI makes a mistake on a high-pressure valve?\"",
         "Answer: \"We have three layers of defense: 1. Our 7D Physics Matrix strictly blocks merges if physical ratings conflict. 2. Any borderline match below 90% confidence is sent to the Human Steward Verification Queue. 3. If an engineer tries to force an override, our system demands a written justification and cryptographically logs the action with SHA-256 for CAG government audits.\""),
         
        ("Judge asks: \"How does your model learn without expensive retraining?\"",
         "Answer: \"We use Active Learning with Triplet Margin Loss. When a human engineer approves a match, our system forms an 'Anchor-Positive-Negative' triplet. It gently pulls true equivalents closer in vector space and pushes false equivalents farther apart. The model learns in the background without needing a supercomputer or days of retraining.\""),
         
        ("Judge asks: \"What is the tangible financial benefit for the Government?\"",
         "Answer: \"Three direct savings: 1. Unlocked Capital: Over ₹4,500 Crores is currently sitting idle as duplicate safety stock; sharing stock reduces this by up to 30%. 2. Zero-Tender Transfers: PSUs can transfer idle parts to neighboring plants at book value in days instead of months. 3. Volume Discounts: By seeing that ONGC pays ₹12,000 while GAIL pays ₹18,000 for the same valve, the Ministry can issue single national rate contracts at the lowest price.\""),
         
        ("Judge asks: \"How do you handle Indian PSU short forms like 'VLV', 'FLGD', 'CS'?\"",
         "Answer: \"Our normalization engine contains a domain-specific CPSE dictionary of over 250 oil and gas engineering abbreviations. It automatically expands 'VLV' into 'Valve', 'FLGD' into 'Flanged End', 'CS' into 'Carbon Steel ASTM A105', and converts inches into millimeters before matching.\""),
         
        ("Judge asks: \"How did you test this system? Is it working right now?\"",
         "Answer: \"Yes, sir! We tested our platform against a rigorous 1,000-material benchmark across ONGC, IOCL, GAIL, HPCL, and BPCL. Our system achieved 98.4% precision and 100% rejection on adversarial near-duplicates. Our codebase has 62 automated unit and integration tests, and all 62 are passing with zero errors right now on this laptop.\"")
    ]
    
    for q, a in qas:
        doc.add_heading(q, level=2).runs[0].font.color.rgb = navy
        p = doc.add_paragraph()
        p.paragraph_format.space_before = Pt(2)
        p.paragraph_format.space_after = Pt(8)
        r = p.add_run(a)
        r.font.size = Pt(10)
        r.font.color.rgb = RGBColor(30, 41, 59)
        
    # ------------------ SECTION 5 ------------------
    doc.add_heading("5. Keywords Cheat-Sheet to Remember & Say", level=1).runs[0].font.color.rgb = navy
    
    kw_table = doc.add_table(rows=6, cols=3)
    kw_heads = ["Feature / Pillar", "Key Words to Say to Judges", "Why Judges Love This"]
    kw_rows = [
        ("Physics Consistency", "7D Physics Matrix, Hard Veto, No Explosions", "Proves you understand real-world engineering safety, not just toy software."),
        ("Search Architecture", "Two-Stage Retrieval, FAISS Dense Search, Cross-Encoder", "Shows modern, state-of-the-art AI design with sub-20ms speed."),
        ("ERP Integration", "Local Immutability, SAP BAPI_MATERIAL_SAVEDATA, Non-Invasive", "Proves government PSUs can adopt your software tomorrow without friction."),
        ("Active Learning", "Uncertainty Queue, Triplet Margin Loss, Continuous Learning", "Shows your system becomes smarter every day without manual model rebuilds."),
        ("Financial Impact", "Working Capital Arbitrage, Zero-Tender Stock Transfers, ₹4,500 Cr", "Directly answers the Ministry's business case and ROI question.")
    ]
    for c_idx, text in enumerate(kw_heads):
        kw_table.cell(0, c_idx).paragraphs[0].add_run(text)
    for r_idx, row_info in enumerate(kw_rows):
        for c_idx, val in enumerate(row_info):
            kw_table.cell(r_idx + 1, c_idx).paragraphs[0].add_run(val)
    format_table(kw_table, header_bg="0F172A", alt_bg="F1F5F9")
    
    doc.add_paragraph().paragraph_format.space_after = Pt(12)
    
    # Save documents
    os.makedirs("public", exist_ok=True)
    out_public = os.path.join("public", "SIH_Judges_Presentation_and_Defense_Guide.docx")
    out_root = "SIH_Judges_Presentation_and_Defense_Guide.docx"
    
    doc.save(out_public)
    doc.save(out_root)
    print(f"Regenerated enhanced, simple-language SIH Master Presentation Guide at:\n1. {out_public}\n2. {out_root}")

if __name__ == "__main__":
    generate_sih_guide()
