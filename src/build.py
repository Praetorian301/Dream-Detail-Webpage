"""Build the Dream Detail pages from src/body.html.

src/body.html holds every section once. This script cuts it at the
<!-- ================= NAME ================= --> markers and writes one
HTML file per page into the site folder, each with the shared header,
footer, styles and scripts.

    python src/build.py

Edit the copy in src/body.html, then run this again. Don't edit the
generated .html files directly; the next build overwrites them.
"""
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
# The live address, ending in "/". Set it once the site is on Render (for
# example "https://dream-detail.onrender.com/") or your own domain, then rebuild.
# Left empty, the pages skip the canonical and og:url tags.
SITE_URL = "https://dream-detail.onrender.com/"

PAGES = {
    "index.html": {
        "title": "Dream Detail | Mobile Car Detailing &amp; Paint Correction Perth",
        "h1": "Dream Detail: mobile car detailing and paint correction in Perth",
        "description": "Dream Detail: mobile car detailing across Perth, plus paint correction and ceramic coatings at our Floreat workshop. Get a quote online.",
        "sections": ["HERO", "DETAILING PACKAGES", "BEFORE / AFTER", "PAINT CORRECTION", "CERAMIC COATING", "PORTFOLIO", "FINAL CTA"],
    },
    "services.html": {
        "title": "Services &amp; Pricing | Dream Detail Perth",
        "h1": "Car detailing services and prices in Perth",
        "description": "Complete details from $200, interior, leather and headlight restoration at your place, plus paint correction and ceramic coatings at our Floreat workshop.",
        "sections": ["DETAILING PACKAGES", "PAINT CORRECTION", "CERAMIC COATING", "RESTORATION EXTRAS", "FINAL CTA"],
    },
    "gallery.html": {
        "title": "Our Work | Before &amp; After Gallery | Dream Detail Perth",
        "h1": "Dream Detail before and after gallery",
        "description": "Real before and after photos and customer reviews from Dream Detail jobs around Perth: interiors, paint, headlights and wheels.",
        "sections": ["BEFORE / AFTER", "PORTFOLIO", "DETAILING PACKAGES", "TESTIMONIALS", "FINAL CTA"],
    },
    "faq.html": {
        "title": "FAQ | Dream Detail Perth",
        "h1": "Dream Detail frequently asked questions",
        "description": "Answers before you book: service area, paint correction levels, timing, pricing and what we need on site for a mobile detail.",
        "sections": ["FAQ", "FINAL CTA"],
    },
    "area.html": {
        "title": "Locations | Dream Detail Perth",
        "h1": "Where Dream Detail works: Perth service area and hours",
        "description": "Check if we come to your postcode or suburb. Mobile detailing across Perth, with a workshop in Floreat and free pick-up and return.",
        "sections": ["SERVICE AREA", "HOW BOOKING WORKS", "FINAL CTA"],

    },
    "book.html": {
        "title": "Request a Detail | Get a Quote | Dream Detail Perth",
        "h1": "Request a car detail or quote from Dream Detail",
        "description": "Tell us about the car and when suits you. We'll reply with a price and a confirmed time. Nothing is charged online.",
        "sections": ["BOOKING / ENQUIRY", "DETAILING PACKAGES", "PAINT CORRECTION", "CERAMIC COATING"],
    },
}

JSON_LD = ('{"@context":"https://schema.org","@type":"AutoWash","name":"Dream Detail",'
           '"description":"Mobile car detailing, paint enhancement and ceramic coating.","areaServed":"Perth, WA",'
           '"telephone":"+61424184697","address":{"@type":"PostalAddress","addressLocality":"Floreat",'
           '"addressRegion":"WA","addressCountry":"AU"},"priceRange":"$$",'
           '"sameAs":["https://www.instagram.com/dreamdetail.au/"],'
           '"openingHours":["Mo-Fr 07:00-17:00","Sa 08:00-15:00"]}')

MARKER = re.compile(r"<!-- ================= (.+?) ================= -->")


def split_body(body):
    """Return (before_header, {name: block}) keyed by the marker text."""
    parts = MARKER.split(body)
    before, blocks = parts[0], {}
    for name, block in zip(parts[1::2], parts[2::2]):
        blocks[name] = f"<!-- ================= {name} ================= -->{block}"
    return before, blocks


def find(blocks, key):
    for name, block in blocks.items():
        if key in name:
            return block
    raise KeyError(key)


def head(file, page):
    extra = ""
    if page.get("preload"):
        extra += f'<link rel="preload" as="image" href="{page["preload"]}">\n'
    if page.get("map"):
        extra += '<link rel="stylesheet" href="assets/vendor/leaflet.css">\n'
    url = SITE_URL + ("" if file == "index.html" else file)
    canonical = f'<link rel="canonical" href="{url}">\n<meta property="og:url" content="{url}">\n' if SITE_URL else ""
    return f"""<!doctype html>
<html lang="en-AU" data-theme="dark">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>{page["title"]}</title>
<meta name="description" content="{page["description"]}">
<meta name="theme-color" content="#09090d">
<meta property="og:title" content="{page["title"]}">
<meta property="og:description" content="{page["description"]}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Dream Detail">
<meta property="og:image" content="{SITE_URL or ""}assets/brand/share.jpg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="Dream Detail: mobile car detailing and paint correction, Perth">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="favicon.ico?v=2" sizes="any">
<link rel="icon" href="assets/brand/favicon.svg?v=2" type="image/svg+xml">
<link rel="icon" href="assets/brand/icon-192.png?v=2" type="image/png" sizes="192x192">
<link rel="apple-touch-icon" href="apple-touch-icon.png?v=2">
{canonical}<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,400..900&family=Hanken+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap">
{extra}<link rel="stylesheet" href="styles.css?v=66">
<script type="application/ld+json">
{JSON_LD}
</script>
</head>
"""


def scripts(page):
    tags = ['<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>',
            '<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"></script>']
    if page.get("map"):
        tags.append('<script src="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js"></script>')
    tags.append('<script src="main.js?v=53"></script>')
    return "\n".join(tags)


def build():
    body = (ROOT / "src" / "body.html").read_text()
    before, blocks = split_body(body)
    header = find(blocks, "HEADER")                      # ends with <main id="main">
    footer = find(blocks, "FOOTER")                      # footer, mobile bar, toast
    for file, page in PAGES.items():
        sections = []
        for key in page["sections"]:
            block = find(blocks, key).replace("</main>", "").rstrip()
            if key == "HERO":                            # the hero carries the home page's own h1
                block = re.sub(r'<h1 id="hero-title" class="sr-only">.*?</h1>', f'<h1 id="hero-title" class="sr-only">{page["h1"]}</h1>', block)
            sections.append(block)
        h1 = "" if "HERO" in page["sections"] else f'<h1 class="sr-only">{page["h1"]}</h1>\n'
        name = file.removesuffix(".html")
        html = (head(file, page) + f'<body data-page="{name}">\n' + before + header + "\n" + h1
                + "\n\n".join(sections) + "\n\n</main>\n\n" + footer.rstrip() + "\n\n" + scripts(page) + "\n</body>\n</html>\n")
        (ROOT / file).write_text(html)
        print(f"wrote {file} ({len(html) // 1024} KB)")


if __name__ == "__main__":
    build()
