"""Build the public academic CV from content.json. Requires ReportLab and Python 3.9+."""

import json
from pathlib import Path
from xml.sax.saxutils import escape

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_RIGHT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.platypus import HRFlowable, PageBreak, Paragraph, SimpleDocTemplate, Spacer, Table, TableStyle

ROOT = Path(__file__).resolve().parents[1]
DATA = json.loads((ROOT / "content.json").read_text())
OUTPUT = ROOT / "assets" / "Fang-Xu-CV.pdf"
INK = colors.HexColor("#202534")
MUTED = colors.HexColor("#5F6675")
ACCENT = colors.HexColor("#44488B")
LINE = colors.HexColor("#D9DDE7")
# SimpleDocTemplate's frame has 6 pt of inner padding on each side.
WIDTH = A4[0] - 84 - 12


def text(value):
    value = str(value).replace("–", "-").replace("—", "-").replace("‑", "-")
    return escape(value).replace("µ", "&#181;")


def hyperlink(label, url):
    return '<link href="%s" color="#44488B">%s</link>' % (escape(url, {'"': '&quot;'}), text(label))


STYLES = {
    "name": ParagraphStyle("Name", fontName="Times-Bold", fontSize=24, leading=27, textColor=INK, alignment=TA_CENTER, spaceAfter=4),
    "contact": ParagraphStyle("Contact", fontName="Helvetica", fontSize=9, leading=12, textColor=MUTED, alignment=TA_CENTER, spaceAfter=4),
    "section": ParagraphStyle("Section", fontName="Helvetica-Bold", fontSize=9.7, leading=12, textColor=ACCENT, spaceBefore=9, spaceAfter=4, keepWithNext=True),
    "title": ParagraphStyle("Title", fontName="Times-Bold", fontSize=10.3, leading=12.7, textColor=INK, keepWithNext=True),
    "date": ParagraphStyle("Date", fontName="Times-Roman", fontSize=9, leading=12, textColor=MUTED, alignment=TA_RIGHT),
    "role": ParagraphStyle("Role", fontName="Times-Italic", fontSize=9.6, leading=12, textColor=MUTED, spaceAfter=3, keepWithNext=True),
    "body": ParagraphStyle("BodyCV", fontName="Times-Roman", fontSize=10, leading=12.5, textColor=INK, spaceAfter=3),
    "small": ParagraphStyle("SmallCV", fontName="Times-Roman", fontSize=9.3, leading=11.5, textColor=MUTED, spaceAfter=3),
    "bullet": ParagraphStyle("BulletCV", fontName="Times-Roman", fontSize=9.7, leading=12.1, textColor=INK, leftIndent=10, firstLineIndent=-7, spaceAfter=2),
    "project": ParagraphStyle("ProjectCV", fontName="Times-Bold", fontSize=10, leading=12.4, textColor=INK, spaceBefore=4, spaceAfter=2, keepWithNext=True),
}
story = []


def paragraph(value, style="body"):
    story.append(Paragraph(text(value), STYLES[style]))


def section(label):
    paragraph(label.upper(), "section")
    story.append(HRFlowable(width="100%", thickness=.5, color=LINE, spaceAfter=5))


def heading(item):
    left = Paragraph(text(item["title"]), STYLES["title"])
    right = Paragraph(text(item.get("period", "")), STYLES["date"])
    table = Table([[left, right]], colWidths=[WIDTH - 140, 140], hAlign="LEFT")
    table.setStyle(TableStyle([
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("LEFTPADDING", (0, 0), (-1, -1), 0),
        ("RIGHTPADDING", (0, 0), (-1, -1), 0),
        ("TOPPADDING", (0, 0), (-1, -1), 0),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 1),
    ]))
    table.keepWithNext = True
    story.append(table)
    if item.get("role"):
        paragraph(item["role"], "role")


def project(item, research=False):
    if research:
        paragraph(item["title"], "project")
    else:
        heading(item)
    if item.get("highlight"):
        paragraph(item["highlight"], "small")
    for bullet in item.get("bullets", []):
        paragraph("- " + bullet, "bullet")
    story.append(Spacer(1, 2))


profile = DATA["profile"]
paragraph(profile["name"], "name")
paragraph(profile["tagline"], "contact")
contact_parts = []
for item in profile["links"]:
    if item["label"] == "Email":
        contact_parts.append(hyperlink(item["url"].removeprefix("mailto:"), item["url"]))
    elif item["label"] == "GitHub":
        contact_parts.append(hyperlink("GitHub", item["url"]))
contact_parts.append(hyperlink("Homepage", "https://freddy-hexas.github.io/"))
story.append(Paragraph(" &nbsp;|&nbsp; ".join(contact_parts), STYLES["contact"]))

section("Education")
for item in DATA["education"]:
    heading(item)
    paragraph(item.get("description", ""), "small")

section("Publications")
for item in DATA["publications"]:
    authors = text(item["authors"]).replace(text(profile["name"]), "<b>" + text(profile["name"]) + "</b>")
    story.append(Paragraph(authors + ". <b>" + text(item["title"]) + ".</b> <i>" + text(item["venue"]) + ".</i>", STYLES["body"]))
    if item.get("url"):
        paper_url = next((entry["url"] for entry in item.get("links", []) if entry.get("label") == "Paper"), item["url"])
        paper_label = "doi:" + paper_url.split("doi.org/", 1)[1] if "doi.org/" in paper_url else "Paper"
        story.append(Paragraph(hyperlink(paper_label, paper_url), STYLES["small"]))
    story.append(Spacer(1, 3))

projects = {item["id"]: item for item in DATA["projects"]}
research_ids = set()
section("Research Experience")
for item in DATA["experience"]:
    if not item.get("projectIds"):
        continue
    heading(item)
    advisor = item.get("description", "").split(". Research")[0].split(". Worked")[0]
    paragraph(advisor, "small")
    for project_id in item["projectIds"]:
        research_ids.add(project_id)
        project(projects[project_id], research=True)
    story.append(Spacer(1, 4))

story.append(PageBreak())
section("Selected Academic Projects")
for item in DATA["projects"]:
    if item["id"] not in research_ids:
        project(item)
        story.append(Spacer(1, 3))

section("Internship Experience")
for item in DATA["experience"]:
    if item.get("projectIds"):
        continue
    heading(item)
    paragraph(item.get("description", ""))

section("Technical Skills")
for item in DATA["skills"]:
    story.append(Paragraph("<b>" + text(item["title"]) + ":</b> " + text(", ".join(item["items"])), STYLES["body"]))

section("Teaching & Service")
for item in DATA["service"]:
    heading(item)
    if item.get("description"):
        paragraph(item["description"], "small")
    story.append(Spacer(1, 3))


def footer(canvas, document):
    canvas.saveState()
    canvas.setFont("Helvetica", 8)
    canvas.setFillColor(MUTED)
    canvas.drawString(42, 22, profile["name"] + " | Academic CV | Updated " + DATA["contentUpdated"])
    canvas.drawRightString(A4[0] - 42, 22, str(document.page))
    canvas.restoreState()


OUTPUT.parent.mkdir(parents=True, exist_ok=True)
doc = SimpleDocTemplate(str(OUTPUT), pagesize=A4, leftMargin=42, rightMargin=42, topMargin=34, bottomMargin=36,
                        title="Fang Xu - Academic CV", author="Fang Xu", subject="Biomedical engineering, neural interfaces, and machine learning")
doc.build(story, onFirstPage=footer, onLaterPages=footer)
print(OUTPUT)
