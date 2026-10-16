#!/usr/bin/env python3
"""Convert pulsefit/components-more.md bsx blocks into Bootstrap 6 markup for the standalone gallery."""
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
MD = ROOT / "pulsefit" / "components-more.md"
OUT = ROOT / "public" / "pulsefit-template" / "components.html"

BTN_MAP = {
    "pri": "btn-solid theme-primary",
    "sec": "btn-solid theme-secondary",
    "ok": "btn-solid theme-success",
    "warn": "btn-solid theme-warning",
    "bad": "btn-solid theme-danger",
    "info": "btn-solid theme-info",
    "o-pri": "btn-outline theme-primary",
    "o-ok": "btn-outline theme-success",
    "o-warn": "btn-outline theme-warning",
    "o-bad": "btn-outline theme-danger",
    "o-info": "btn-outline theme-info",
    "link": "btn-link",
}

ALERT_MAP = {
    "pri": "theme-primary",
    "ok": "theme-success",
    "warn": "theme-warning",
    "bad": "theme-danger",
    "info": "theme-info",
    "neu": "theme-secondary",
}


def convert_btn(span_html: str) -> str:
    m = re.match(r'<span class="btn\s+([^"]*)"([^>]*)>(.*)</span>\s*$', span_html.strip(), re.S)
    if not m:
        return span_html
    classes, extra, inner = m.group(1).strip(), m.group(2), m.group(3)
    parts = classes.split()
    dis = "dis" in parts
    sm = "sm" in parts
    lg = "lg" in parts
    pill = "pill" in parts
    blk = "blk" in parts
    act = "act" in parts
    theme = "btn-solid theme-light"
    for key, val in BTN_MAP.items():
        if key in parts:
            theme = val
            break
    if "link" in parts:
        theme = "btn-link"
    cls = [theme]
    if sm:
        cls.append("btn-sm")
    if lg:
        cls.append("btn-lg")
    if pill:
        cls.append("rounded-pill")
    if blk:
        cls.append("w-100")
    if act:
        cls.append("active")
    if dis:
        cls.append("disabled")
    return f'<button type="button" class="{" ".join(cls)}"{extra}>{inner}</button>'


def convert_block(html: str) -> str:
    html = html.replace('<div class="bsx bsx-pf">', '<div class="pf-bs6-block mb-4 p-3 border rounded-4 bg-1">')
    html = html.replace('<div class="bsx-pf">', '<div class="pf-bs6-block mb-4 p-3 border rounded-4 bg-1">')
    html = re.sub(r'<div class="row">', '<div class="d-flex flex-wrap gap-2 align-items-center mb-2">', html)
    html = re.sub(r'<div class="col"([^>]*)>', r'<div class="d-flex flex-column gap-2"\1>', html)
    html = re.sub(r'<div class="grid2">', '<div class="row g-3">', html)
    html = re.sub(
        r'<div class="alert (\w+)">(.*?)</div>',
        lambda m: f'<div class="alert {ALERT_MAP.get(m.group(1), "theme-secondary")}">{m.group(2)}</div>',
        html,
        flags=re.S,
    )
    html = html.replace('class="card"', 'class="card h-100"')
    html = html.replace('<div class="bd">', '<div class="card-body">')
    html = html.replace('<div class="hd">', '<div class="card-header">')
    html = html.replace('<div class="ft">', '<div class="card-footer fg-3 small">')
    html = re.sub(r'<label class="l">', '<label class="form-label">', html)
    html = re.sub(r'<input class="inp([^"]*)"', r'<input class="form-control\1"', html)
    html = re.sub(r'<textarea class="inp', '<textarea class="form-control', html)
    html = re.sub(r'<select class="inp([^"]*)"', r'<select class="form-select\1"', html)
    html = re.sub(
        r'<span class="badge (\w+)"([^>]*)>(.*?)</span>',
        lambda m: f'<span class="badge theme-{m.group(1) if m.group(1) not in ("o", "") else "secondary"}"{m.group(2)}>{m.group(3)}</span>',
        html,
        flags=re.S,
    )
    # buttons
    html = re.sub(r'<span class="btn[^"]*"[^>]*>.*?</span>', lambda m: convert_btn(m.group(0)), html, flags=re.S)
    return html


def main() -> None:
    text = MD.read_text(encoding="utf-8")
    sections: list[tuple[str, str]] = []
    for chunk in re.split(r"\n## ", text):
        if not chunk.strip() or chunk.startswith("---"):
            continue
        lines = chunk.split("\n", 1)
        title = lines[0].strip()
        body = lines[1] if len(lines) > 1 else ""
        blocks = re.findall(r"<div class=\"bsx[^\"]*\"[^>]*>.*?</div>\s*</div>", body, flags=re.S)
        if not blocks:
            blocks = re.findall(r"<div class=\"bsx[^\"]*\"[^>]*>.*?</div>", body, flags=re.S)
        if blocks:
            sections.append((title, "\n".join(convert_block(b) for b in blocks)))

    head = """<!doctype html>
<html lang="en" data-bs-theme="light">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>PulseFit Bootstrap 6 component gallery</title>
<link rel="icon" href="data:,">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@6.0.0-alpha.1/dist/css/bootstrap.min.css" integrity="sha384-B/GM4XqrwHnWXNOWMbloTmrYXZg10cakYGmpfsR/bbzQ6JAJI4ihuyADKLnBgrCe" crossorigin="anonymous">
<link rel="stylesheet" href="/pulsefit-template/pulsefit-theme.css">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Montserrat:wght@600;700&family=Rubik:wght@400;500;600;700&display=swap">
<style>
  body { background: var(--pf-page); min-height: 100vh; }
  .pf-bs6-block { border-color: var(--bs-border-color) !important; }
  .pf-bs6-block h5 { font-family: Montserrat, Rubik, sans-serif; }
  @media (prefers-reduced-motion: reduce) { * { scroll-behavior: auto !important; } }
</style>
</head>
<body class="p-3 p-md-4">
<header class="mb-4">
  <h1 class="pf-display fs-1 mb-1">PulseFit · Bootstrap 6 gallery</h1>
  <p class="fg-3 mb-0">Bootstrap 6.0.0-alpha.1 with PulseFit tokens. Fictitious data; actions stay local.</p>
</header>
<main>
"""
    foot = """
</main>
<script type="module" src="https://cdn.jsdelivr.net/npm/bootstrap@6.0.0-alpha.1/dist/js/bootstrap.bundle.min.js" integrity="sha384-1a/pXj49ZQ1aHEmrJ+gMw1otqoVsYwlEnlD8mIfY2TV03r20Y0CN7uqx1tQogjPL" crossorigin="anonymous"></script>
</body>
</html>
"""
    parts = [head]
    for title, blocks in sections:
        parts.append(f'<section class="mb-5" id="{re.sub(r"[^a-z0-9]+", "-", title.lower()).strip("-")}">')
        parts.append(f'<h2 class="pf-section-title h4 mb-3">{title}</h2>')
        parts.append(blocks)
        parts.append("</section>")
    parts.append(foot)
    OUT.write_text("\n".join(parts), encoding="utf-8")
    print(f"Wrote {OUT} ({len(sections)} sections)")


if __name__ == "__main__":
    main()
