/* ==========================================================================
   Dream Detail — site behaviour
   No framework. GSAP (+ ScrollTrigger) is optional: if it fails to load,
   everything still works and nothing is left hidden.
   ========================================================================== */

/* --------------------------------------------------------------------------
   1. BUSINESS SETTINGS — edit these, the page updates everywhere.
   Values marked CONFIRM still need checking by the owner.
   -------------------------------------------------------------------------- */
const BUSINESS = {
  name: "Dream Detail",
  owner: "Will",
  instagram: "dreamdetail.au",
  phoneDisplay: "0424 184 697",
  phoneHref: "+61424184697",
  email: "",                             // add a business email to show it on the site
  region: "Perth",
  workshop: "Floreat",
  timeZone: "Australia/Perth",
  // Opening hours, 24h. null = closed. Index 0 = Sunday.  CONFIRM
  hours: [null, ["07:00", "17:00"], ["07:00", "17:00"], ["07:00", "17:00"], ["07:00", "17:00"], ["07:00", "17:00"], ["08:00", "15:00"]],
  // Postcode coverage for mobile work (rough Perth metro ranges).  CONFIRM
  serviceArea: {
    standard: [[6000, 6199]],            // Perth metro
    extended: [[6200, 6215]],            // Mandurah side: ask
  },
  // Live map: workshop position and the radius we treat as "mobile, no question".
  workshopLatLng: [-31.9385, 115.7845],  // Floreat (approximate, not the street address)
  mobileRadiusKm: 40,                    // drawn on the map; postcode rules above still decide
  askRadiusKm: 75,                       // used only when a place has no postcode
  // Stylised fallback map labels: [name, x, y] around the Floreat base at 250,250
  suburbsOnMap: [["Perth CBD", 298, 266], ["Scarborough", 226, 212], ["Fremantle", 214, 334], ["Joondalup", 234, 108], ["Midland", 400, 226], ["Cannington", 336, 322], ["Rockingham", 232, 452]],
  // Where the booking form posts. Leave empty and the form opens a pre-filled
  // text message to Will instead (photos can't be attached that way). Works with Formspree, Getform, a Supabase edge
  // function, or any endpoint that accepts multipart/form-data.
  formEndpoint: "",
};

/* Pricing, from Dream Detail's own price list. All indicative: final price
   is confirmed after seeing the car. Size keys:
   hatch = small hatch/coupe, sedan = medium sedan/wagon,
   suv = medium SUV/crossover, ute = large SUV/4WD (key name kept for old links). */
const SIZE_KEYS = ["hatch", "sedan", "suv", "ute"];
const PRICING = {
  packages: {
    complete:    { label: "Complete Detail", base: 200, from: true, mode: "mobile", hours: "Same day" },
    interior:    { label: "Interior Detail", base: 100, from: true, mode: "mobile", hours: "Same day" },
    exterior:    { label: "Exterior Detail", base: 100, from: true, mode: "mobile", hours: "Same day" },
    leather:     { label: "Leather Care", base: 50, seats7: 70, mode: "mobile", hours: "1–2 hrs" },
    headlights:  { label: "Headlight restoration (pair)", base: 80, mode: "mobile", hours: "1–2 hrs" },
    single:      { label: "Single Stage Enhancement", table: [400, 450, 500, 550], mode: "workshop", hours: "≈ 2 days" },
    two:         { label: "Two Stage Correction", table: [550, 600, 650, 750], mode: "workshop", hours: "≈ 2 days" },
    three:       { label: "Three Stage Correction", table: [700, 800, 900, 1000], mode: "workshop", hours: "2–3 days" },
    restoration: { label: "Restoration / classic", base: null, mode: "workshop", hours: "3+ days" },
  },
  size: { hatch: { label: "Hatch / Coupe" }, sedan: { label: "Sedan / Wagon" }, suv: { label: "Medium SUV" }, ute: { label: "Large SUV / 4WD" } },
  extras: {
    ceramic:    { label: "Ceramic coating", price: null, workshopOnly: true },
    interior:   { label: "Full interior detail", price: 100, from: true },
    leather:    { label: "Leather care", price: 50, seats7: 70 },
    headlights: { label: "Headlight restoration (pair)", price: 80 },
    taillights: { label: "Taillight restoration (pair)", price: 40 },
    trim:       { label: "Plastic trim restoration", price: 50 },
    chrome:     { label: "Chrome polishing", price: null },
  },
  condition: { swirls: "Swirls / scratches", faded: "Faded / oxidised paint", stains: "Interior stains", pet: "Pet hair", leather: "Worn leather" },
};

/* Before/after jobs, all from @dreamdetail.au. ratio = width / height of the
   slider frame for that pair (portrait phone shots get a taller frame). */
const PROJECTS = [
  { id: 1, type: "lights", tag: "Headlights", title: "Yellowed headlights restored to clear", vehicle: "Lexus IS200", service: "Headlight restoration, $40 per light", where: "Mobile", outcome: "Oxidised, hazy lenses restored to clear, with a 1-year warranty.", book: "headlights", before: "assets/ig/headlight-before.jpg", after: "assets/ig/headlight-after.jpg", ratio: 1.6 },
  { id: 2, type: "interior", tag: "Interior", title: "Front cabin, back from the bush", vehicle: "Mitsubishi Pajero (grey)", service: "Interior detail", where: "Mobile", outcome: "Dust, mud and grime cleared from the dash, seats, door trims and floor mats.", book: "interior", before: "assets/img/ba/pajero-front-before.jpg", after: "assets/img/ba/pajero-front-after.jpg", ratio: 0.8 },
  { id: 3, type: "lights", tag: "Headlights", title: "Fogged MX-5 lens made clear again", vehicle: "Mazda MX-5", service: "Headlight restoration", where: "Mobile", outcome: "Heavy oxidation cut back in stages and polished, restoring full light output.", book: "headlights", before: "assets/img/ba/mx5-headlight-before.jpg", after: "assets/img/ba/mx5-headlight-after.jpg", ratio: 1 },
  { id: 4, type: "interior", tag: "Interior", title: "Rear seats and cargo area", vehicle: "Mitsubishi Pajero (grey)", service: "Interior detail", where: "Mobile", outcome: "Seats vacuumed and shampooed, with rubbish and dirt cleared from the rear floor.", book: "interior", before: "assets/img/ba/pajero-rear-before.jpg", after: "assets/img/ba/pajero-rear-after.jpg", ratio: 0.8 },
  { id: 5, type: "paint", tag: "Paint repair", title: "Scuffed rear bumper polished out", vehicle: "Black hatch", service: "Machine polish", where: "Floreat workshop", outcome: "Paint transfer and scuffs on the rear bumper corner polished out.", book: "single", before: "assets/img/ba/paint-rear-before.jpg", after: "assets/img/ba/paint-rear-after.jpg", ratio: 0.8 },
  { id: 9, type: "wheels", tag: "Wheels", title: "Wheels and tyres refreshed", vehicle: "Volvo XC90", service: "Exterior detail", where: "Mobile", outcome: "Grimy alloys and faded tyres cleaned and dressed.", book: "complete", before: "assets/img/ba/volvo-wheel-before.jpg", after: "assets/img/ba/volvo-wheel-after.jpg", ratio: 0.8 },
  { id: 6, type: "wheels", tag: "Wheels", title: "Brake dust off with iron remover", vehicle: "VW Polo", service: "Wheel deep clean", where: "Mobile", outcome: "Iron fallout dissolved and every spoke brushed clean, then tyres dressed.", book: "complete", before: "assets/img/ba/wheel-polo-before.jpg", after: "assets/img/ba/wheel-polo-after.jpg", ratio: 0.8 },
  { id: 7, type: "interior", tag: "Interior", title: "Door card and trims", vehicle: "Mitsubishi Pajero (grey)", service: "Interior detail", where: "Mobile", outcome: "Muddy door card and storage pocket cleaned and dressed.", book: "interior", before: "assets/img/ba/pajero-door-before.jpg", after: "assets/img/ba/pajero-door-after.jpg", ratio: 0.8 },
  { id: 8, type: "paint", tag: "Paint repair", title: "Front bumper scuff corrected", vehicle: "Black hatch", service: "Machine polish", where: "Floreat workshop", outcome: "Scrapes on the front bumper corner polished back to a clean finish.", book: "single", before: "assets/img/ba/paint-front-before.jpg", after: "assets/img/ba/paint-front-after.jpg", ratio: 0.8 },
  { id: 10, type: "wheels", tag: "Wheels", title: "Commodore alloys deep cleaned", vehicle: "Holden Commodore", service: "Complete Detail", where: "Mobile", outcome: "Wheel faces and barrels cleaned, tyres dressed for a deep black finish.", book: "complete", before: "assets/img/ba/commodore-wheel-before.jpg", after: "assets/img/ba/commodore-wheel-after.jpg", ratio: 1 },
  { id: 11, type: "interior", tag: "Interior", title: "Dash and console", vehicle: "Mitsubishi Pajero (grey)", service: "Interior detail", where: "Mobile", outcome: "Dash, console and seats cleaned and the mats vacuumed.", book: "interior", before: "assets/img/ba/pajero-dash-before.jpg", after: "assets/img/ba/pajero-dash-after.jpg", ratio: 0.8 },
];

/* Car galleries (Gallery section). Photos live in assets/img/cars/<slug>/. */
const CARS = [{"slug":"black-pajero","make":"Mitsubishi Pajero","colour":"Black","service":"Complete detail, inside and out","cover":"assets/img/cars/black-pajero/cover.jpg","photos":[{"src":"assets/img/cars/black-pajero/01.jpg","w":1080,"h":1080},{"src":"assets/img/cars/black-pajero/02.jpg","w":1080,"h":1080},{"src":"assets/img/cars/black-pajero/03.jpg","w":1080,"h":1080},{"src":"assets/img/cars/black-pajero/04.jpg","w":1080,"h":1080},{"src":"assets/img/cars/black-pajero/05.jpg","w":1080,"h":1080},{"src":"assets/img/cars/black-pajero/06.jpg","w":1080,"h":1080},{"src":"assets/img/cars/black-pajero/07.jpg","w":1080,"h":1080},{"src":"assets/img/cars/black-pajero/08.jpg","w":1080,"h":1079},{"src":"assets/img/cars/black-pajero/09.jpg","w":1080,"h":1080},{"src":"assets/img/cars/black-pajero/10.jpg","w":1080,"h":1080},{"src":"assets/img/cars/black-pajero/11.jpg","w":1080,"h":1284},{"src":"assets/img/cars/black-pajero/12.jpg","w":1080,"h":1277},{"src":"assets/img/cars/black-pajero/13.jpg","w":1080,"h":1277},{"src":"assets/img/cars/black-pajero/14.jpg","w":1080,"h":1284},{"src":"assets/img/cars/black-pajero/15.jpg","w":1080,"h":1278},{"src":"assets/img/cars/black-pajero/16.jpg","w":1080,"h":1277},{"src":"assets/img/cars/black-pajero/17.jpg","w":1080,"h":1284},{"src":"assets/img/cars/black-pajero/18.jpg","w":1080,"h":1277},{"src":"assets/img/cars/black-pajero/19.jpg","w":1080,"h":1284}]},{"slug":"grey-pajero","make":"Mitsubishi Pajero","colour":"Grey","service":"Interior deep clean","cover":"assets/img/cars/grey-pajero/04.jpg","photos":[{"src":"assets/img/cars/grey-pajero/04.jpg","w":1080,"h":1080},{"src":"assets/img/cars/grey-pajero/01.jpg","w":1080,"h":1080},{"src":"assets/img/cars/grey-pajero/02.jpg","w":1080,"h":1080},{"src":"assets/img/cars/grey-pajero/03.jpg","w":1080,"h":1080},{"src":"assets/img/cars/grey-pajero/05.jpg","w":1080,"h":1080},{"src":"assets/img/cars/grey-pajero/06.jpg","w":1080,"h":1080},{"src":"assets/img/cars/grey-pajero/07.jpg","w":1080,"h":1080},{"src":"assets/img/cars/grey-pajero/08.jpg","w":1080,"h":1080}]},{"slug":"commodore","make":"Holden Commodore","colour":"Blue","service":"Clay bar, wash and interior","cover":"assets/img/cars/commodore/cover.jpg","photos":[{"src":"assets/img/cars/commodore/01.jpg","w":1080,"h":1080},{"src":"assets/img/cars/commodore/02.jpg","w":1080,"h":1080},{"src":"assets/img/cars/commodore/03.jpg","w":1080,"h":1080},{"src":"assets/img/cars/commodore/04.jpg","w":1080,"h":1080},{"src":"assets/img/cars/commodore/05.jpg","w":1080,"h":1080},{"src":"assets/img/cars/commodore/06.jpg","w":1080,"h":1080},{"src":"assets/img/cars/commodore/07.jpg","w":1080,"h":1080},{"src":"assets/img/cars/commodore/08.jpg","w":1080,"h":1080},{"src":"assets/img/cars/commodore/09.jpg","w":1080,"h":1131},{"src":"assets/img/cars/commodore/10.jpg","w":1080,"h":1131},{"src":"assets/img/cars/commodore/11.jpg","w":1080,"h":1128}]},{"slug":"mx5","make":"Mazda MX-5","colour":"Bronze","service":"Wash and headlight restoration","cover":"assets/img/cars/mx5/cover.jpg","photos":[{"src":"assets/img/cars/mx5/01.jpg","w":1080,"h":1085},{"src":"assets/img/cars/mx5/02.jpg","w":891,"h":705},{"src":"assets/img/cars/mx5/03.jpg","w":1080,"h":855},{"src":"assets/img/cars/mx5/04.jpg","w":1080,"h":1083},{"src":"assets/img/cars/mx5/05.jpg","w":1080,"h":1080},{"src":"assets/img/cars/mx5/06.jpg","w":1080,"h":1080},{"src":"assets/img/cars/mx5/07.jpg","w":950,"h":752},{"src":"assets/img/cars/mx5/08.jpg","w":1080,"h":1083},{"src":"assets/img/cars/mx5/09.jpg","w":1080,"h":1085},{"src":"assets/img/cars/mx5/10.jpg","w":1080,"h":1083},{"src":"assets/img/cars/mx5/11.jpg","w":1080,"h":1080},{"src":"assets/img/cars/mx5/12.jpg","w":1080,"h":1080},{"src":"assets/img/cars/mx5/13.jpg","w":1080,"h":1079}]},{"slug":"passat","make":"VW Passat Alltrack","colour":"White","service":"Complete detail + leather treatment","cover":"assets/img/cars/passat/cover.jpg","photos":[{"src":"assets/img/cars/passat/01.jpg","w":1080,"h":1085},{"src":"assets/img/cars/passat/02.jpg","w":1080,"h":1086},{"src":"assets/img/cars/passat/03.jpg","w":1080,"h":1085},{"src":"assets/img/cars/passat/04.jpg","w":1080,"h":1086},{"src":"assets/img/cars/passat/05.jpg","w":1080,"h":1086},{"src":"assets/img/cars/passat/06.jpg","w":1080,"h":1086}]},{"slug":"prado","make":"Toyota Prado","colour":"White","service":"Complete detail","cover":"assets/img/cars/prado/cover.jpg","photos":[{"src":"assets/img/cars/prado/01.jpg","w":1080,"h":1079},{"src":"assets/img/cars/prado/02.jpg","w":1080,"h":1080},{"src":"assets/img/cars/prado/03.jpg","w":1080,"h":1080},{"src":"assets/img/cars/prado/04.jpg","w":1080,"h":1080},{"src":"assets/img/cars/prado/05.jpg","w":1080,"h":1080},{"src":"assets/img/cars/prado/06.jpg","w":1080,"h":1080},{"src":"assets/img/cars/prado/07.jpg","w":1080,"h":1080},{"src":"assets/img/cars/prado/08.jpg","w":1080,"h":1079},{"src":"assets/img/cars/prado/09.jpg","w":1080,"h":1080}]},{"slug":"rav4","make":"Toyota RAV4","colour":"Grey","service":"Complete detail + headlight restoration","cover":"assets/img/cars/rav4/cover.jpg","photos":[{"src":"assets/img/cars/rav4/01.jpg","w":1080,"h":1181},{"src":"assets/img/cars/rav4/02.jpg","w":1080,"h":1181},{"src":"assets/img/cars/rav4/03.jpg","w":1080,"h":1181},{"src":"assets/img/cars/rav4/04.jpg","w":1080,"h":1181},{"src":"assets/img/cars/rav4/05.jpg","w":1080,"h":1181},{"src":"assets/img/cars/rav4/06.jpg","w":1080,"h":1181},{"src":"assets/img/cars/rav4/07.jpg","w":1080,"h":1181},{"src":"assets/img/cars/rav4/08.jpg","w":1080,"h":1181},{"src":"assets/img/cars/rav4/09.jpg","w":1080,"h":1182}]},{"slug":"tiguan","make":"VW Tiguan","colour":"White","service":"Exterior detail","cover":"assets/img/cars/tiguan/cover.jpg","photos":[{"src":"assets/img/cars/tiguan/01.jpg","w":1080,"h":1350},{"src":"assets/img/cars/tiguan/02.jpg","w":1080,"h":1350},{"src":"assets/img/cars/tiguan/03.jpg","w":1080,"h":1350},{"src":"assets/img/cars/tiguan/04.jpg","w":1080,"h":1350},{"src":"assets/img/cars/tiguan/05.jpg","w":1080,"h":1346},{"src":"assets/img/cars/tiguan/06.jpg","w":1080,"h":1346},{"src":"assets/img/cars/tiguan/07.jpg","w":1080,"h":1346},{"src":"assets/img/cars/tiguan/08.jpg","w":1080,"h":1350},{"src":"assets/img/cars/tiguan/09.jpg","w":1080,"h":1346}]},{"slug":"forester","make":"Subaru Forester","colour":"White","service":"Complete detail","cover":"assets/img/cars/forester/cover.jpg","photos":[{"src":"assets/img/cars/forester/01.jpg","w":1080,"h":1079},{"src":"assets/img/cars/forester/02.jpg","w":1080,"h":1080},{"src":"assets/img/cars/forester/03.jpg","w":1080,"h":1080},{"src":"assets/img/cars/forester/04.jpg","w":1080,"h":1080},{"src":"assets/img/cars/forester/05.jpg","w":1080,"h":1080},{"src":"assets/img/cars/forester/06.jpg","w":1080,"h":1080},{"src":"assets/img/cars/forester/07.jpg","w":1080,"h":1080},{"src":"assets/img/cars/forester/08.jpg","w":1080,"h":1079},{"src":"assets/img/cars/forester/09.jpg","w":1080,"h":1080}]},{"slug":"crv","make":"Honda CR-V","colour":"White","service":"Complete detail","cover":"assets/img/cars/crv/cover.jpg","photos":[{"src":"assets/img/cars/crv/01.jpg","w":1080,"h":1344},{"src":"assets/img/cars/crv/02.jpg","w":1080,"h":1343},{"src":"assets/img/cars/crv/03.jpg","w":1080,"h":1339},{"src":"assets/img/cars/crv/04.jpg","w":1080,"h":1339},{"src":"assets/img/cars/crv/05.jpg","w":1080,"h":1343},{"src":"assets/img/cars/crv/06.jpg","w":1080,"h":1339},{"src":"assets/img/cars/crv/07.jpg","w":1080,"h":1339},{"src":"assets/img/cars/crv/08.jpg","w":1080,"h":1339}]},{"slug":"xc90","make":"Volvo XC90","colour":"Black","service":"Exterior detail","cover":"assets/img/cars/xc90/cover.jpg","photos":[{"src":"assets/img/cars/xc90/01.jpg","w":1080,"h":1080},{"src":"assets/img/cars/xc90/02.jpg","w":1080,"h":1080},{"src":"assets/img/cars/xc90/03.jpg","w":1080,"h":1080},{"src":"assets/img/cars/xc90/04.jpg","w":1080,"h":1080}]},{"slug":"corolla","make":"Toyota Corolla","colour":"Silver","service":"Exterior detail","cover":"assets/img/cars/corolla/cover.jpg","photos":[{"src":"assets/img/cars/corolla/01.jpg","w":1080,"h":1080},{"src":"assets/img/cars/corolla/02.jpg","w":1080,"h":1080},{"src":"assets/img/cars/corolla/03.jpg","w":1080,"h":1079},{"src":"assets/img/cars/corolla/04.jpg","w":1080,"h":1080},{"src":"assets/img/cars/corolla/05.jpg","w":1080,"h":1079},{"src":"assets/img/cars/corolla/06.jpg","w":1080,"h":1080},{"src":"assets/img/cars/corolla/07.jpg","w":1080,"h":1079}]}];

/* Instagram grid tiles: real posts, all linking to the profile. */
const IG_POSTS = [
  { src: "assets/img/ig-1.jpg", alt: "Black Mitsubishi Pajero after a Complete Detail" },
  { src: "assets/ig/post-headlights.jpg", alt: "Headlight restoration: $40 each light, mobile service, 1-year warranty" },
  { src: "assets/img/ig-2.jpg", alt: "Blue Holden Commodore, freshly detailed at dusk" },
  { src: "assets/img/ig-3.jpg", alt: "Bronze Mazda MX-5 after wash and headlight restoration" },
  { src: "assets/img/ig-4.jpg", alt: "White VW Passat Alltrack after a Complete Detail" },
  { src: "assets/ig/post-leather.jpg", alt: "Leather Care Package: clean, condition and protect" },
  { src: "assets/img/ig-5.jpg", alt: "White Toyota Prado after a Complete Detail" },
  { src: "assets/img/ig-6.jpg", alt: "White VW Tiguan after an exterior detail" },
];

/* --------------------------------------------------------------------------
   2. Helpers
   -------------------------------------------------------------------------- */
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const money = (n) => "$" + Math.round(n).toLocaleString("en-AU");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const store = {
  get(k) { try { return localStorage.getItem(k); } catch { return null; } },
  set(k, v) { try { localStorage.setItem(k, v); } catch { /* storage unavailable */ } },
};

/** Analytics hook (GA4 event names from blueprint section 10). */
function track(event, params = {}) {
  if (typeof window.gtag === "function") window.gtag("event", event, params);
}

function toast(msg) {
  const t = $("#toast");
  t.textContent = msg;
  t.classList.add("is-on");
  clearTimeout(toast._t);
  toast._t = setTimeout(() => t.classList.remove("is-on"), 2600);
}

/** Photo frame: real <img> on top, drawn placeholder underneath. */
function frame({ src, alt, art = "car", tone = "after", interior = false, cap = true }) {
  const color = tone === "before" ? "#8a8f96" : "#d9c39c";
  const vb = art === "seat" ? "0 0 400 400" : "0 0 1200 400";
  const width = art === "seat" ? "46%" : "78%";
  return `
    <div class="ph ph--${tone}${interior ? " ph--interior" : ""}">
      <img src="${src}" alt="${alt}" loading="lazy" data-fallback>
      <div class="ph__art"><svg viewBox="${vb}" style="color:${color};width:${width}" aria-hidden="true"><use href="#${art}"/></svg></div>
      ${cap ? `<span class="ph__cap">${src.split("/").pop()}</span>` : ""}
    </div>`;
}

/** Any image that fails to load hides itself so the placeholder shows. */
function wireFallbacks(root = document) {
  $$("img[data-fallback]", root).forEach((img) => {
    const hide = () => { img.style.display = "none"; };
    if (img.complete && img.naturalWidth === 0) hide();
    img.addEventListener("error", hide, { once: true });
  });
}

/* --------------------------------------------------------------------------
   3. Business details into the page
   -------------------------------------------------------------------------- */
function applyBusiness() {
  $$("[data-region-label]").forEach((el) => (el.textContent = BUSINESS.region));
  $$("[data-phone]").forEach((el) => (el.textContent = BUSINESS.phoneDisplay));
  $$("[data-email]").forEach((el) => (el.textContent = BUSINESS.email));
  $$('[data-contact="phone"]').forEach((a) => (a.href = "sms:" + BUSINESS.phoneHref));
  $$('[data-contact="email"]').forEach((a) => { if (BUSINESS.email) a.href = "mailto:" + BUSINESS.email; else a.hidden = true; });
  $$("[data-ig-handle]").forEach((el) => (el.textContent = "@" + BUSINESS.instagram));
  $("#year").textContent = new Date().getFullYear();

  // Map suburb labels
  const g = $("#map-suburbs");
  if (g) g.innerHTML = BUSINESS.suburbsOnMap.map(([n, x, y]) =>
    `<circle cx="${x}" cy="${y}" r="2.5" fill="#d9c39c"/><text x="${x + 7}" y="${y + 4}">${n}</text>`).join("");

  // Analytics on tracked links
  $$("[data-track]").forEach((el) => el.addEventListener("click", () => track(el.dataset.track)));
}

/* --------------------------------------------------------------------------
   4. Header: scrolled state, mobile menu, active section, sticky mobile CTA
   -------------------------------------------------------------------------- */
function initHeader() {
  const header = $(".site-header");
  const toggle = $(".menu-toggle");
  const mnav = $("#mobile-nav");
  const mbar = $("#mobile-book");
  const book = $("#book");

  // Logo always lands on the top of the home page: smooth scroll if already there, otherwise load it
  $$(".logo").forEach((logo) => logo.addEventListener("click", (e) => {
    if (!/(^|\/)(index\.html)?$/.test(location.pathname)) return;
    e.preventDefault();
    history.replaceState(null, "", location.pathname);
    window.scrollTo({ top: 0, behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  }));

  // Links to the page you're already on: a plain page link goes to the top, a #section link glides to it
  $$(".site-header a[href], #mobile-nav a[href], .footer a[href]").forEach((a) => a.addEventListener("click", (e) => {
    const url = new URL(a.href, location.href);
    if (url.pathname !== location.pathname || a.classList.contains("logo")) return;
    const target = url.hash ? document.getElementById(url.hash.slice(1)) : null;
    if (url.hash && !target) return;
    e.preventDefault();
    history.replaceState(null, "", url.pathname + url.hash);
    const smooth = matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";
    if (target) target.scrollIntoView({ behavior: smooth });
    else window.scrollTo({ top: 0, behavior: smooth });
  }));


  const setMenu = (open) => {
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    mnav.hidden = !open;
  };
  toggle.addEventListener("click", () => setMenu(toggle.getAttribute("aria-expanded") !== "true"));
  $$("a", mnav).forEach((a) => a.addEventListener("click", () => setMenu(false)));
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") setMenu(false); });

  let bookVisible = false;
  const onScroll = () => {
    const y = window.scrollY;
    header.classList.toggle("is-scrolled", y > 8);
    mbar.classList.toggle("is-visible", y > 520 && !bookVisible);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // Hide the mobile bar while the booking form itself is on screen
  if (book) new IntersectionObserver(([e]) => { bookVisible = e.isIntersecting; onScroll(); }, { threshold: 0.05 }).observe(book);

  // The menu underlines the page you're on (and Book Now turns gold on the booking page)
  const page = location.pathname.split("/").pop() || "index.html";
  $$(".nav a, .mobile-nav li a").forEach((a) => a.setAttribute("aria-current", String(a.getAttribute("href").split("#")[0] === page)));
}

/* --------------------------------------------------------------------------
   5. Packages: size switch updates prices, spotlight hover, deep-link to form
   -------------------------------------------------------------------------- */
function priceFor(pkg, size, seats = "5") {
  const p = PRICING.packages[pkg];
  if (!p) return null;
  if (p.table) return p.table[SIZE_KEYS.indexOf(size)];
  if (p.seats7 && seats === "7") return p.seats7;
  return p.base;
}

// Paint correction photo sets shown under the Paint correction heading. A set with only "single" is a before/after collage.
const PAINT_SHOTS = [
  { label: "Front bumper", caption: "Scrapes on a black front bumper machine polished back to a clean gloss.", before: "assets/img/ba/paint-front-before.jpg", after: "assets/img/ba/paint-front-after.jpg" },
  { label: "Rear bumper", caption: "Paint transfer and scuffs on the rear bumper corner polished out.", before: "assets/img/ba/paint-rear-before.jpg", after: "assets/img/ba/paint-rear-after.jpg" },
  { label: "Pajero bonnet", caption: "Dull, spotted bonnet on a black Pajero corrected to a deep, wet-look shine.", before: "assets/img/ba/pajero-bonnet-before.jpg", after: "assets/img/cars/black-pajero/05.jpg" },
  { label: "Pajero side", caption: "Swirled, faded side panels brought back to a mirror finish.", before: "assets/img/ba/pajero-side-before.jpg", after: "assets/img/cars/black-pajero/10.jpg" },
];

function initPaintShots() {
  const fig = $("#pc-photo"), tabs = $("#pc-tabs");
  const [b, a] = [$("#pc-before"), $("#pc-after")];
  const show = (i) => {
    const s = PAINT_SHOTS[i];
    fig.classList.toggle("is-single", !!s.single);
    b.src = s.single || s.before; b.alt = s.single ? `Before and after: ${s.caption}` : `Before: ${s.caption}`;
    if (!s.single) { a.src = s.after; a.alt = `After: ${s.caption}`; }
    $("#pc-caption").textContent = s.caption;
    $$("button", tabs).forEach((t, j) => t.setAttribute("aria-pressed", String(j === i)));
  };
  tabs.innerHTML = PAINT_SHOTS.map((s, i) => `<button type="button" aria-pressed="${i === 0}" aria-label="Show ${s.label}">
      <img src="${s.single || s.after}" alt="" loading="lazy"><span>${s.label}<small>View job <svg><use href="#i-arrow"/></svg></small></span></button>`).join("");
  $$("button", tabs).forEach((t, i) => t.addEventListener("click", () => {
    show(i);
    // On a phone the photos sit above the tiles, so bring them back into view
    if (fig.getBoundingClientRect().top < 0) fig.scrollIntoView({ behavior: "smooth", block: "start" });
    fig.classList.remove("is-swap"); void fig.offsetWidth; fig.classList.add("is-swap");
  }));
  show(0);
}

// Clicking a package card makes it the highlighted one; the others drop back to plain cards
function initPackagePick() {
  $$(".packages").forEach((group) => {
    const cards = $$(".pkg", group);
    const pick = (card) => cards.forEach((c) => {
      const on = c === card;
      c.classList.toggle("pkg--feature", on);
      const btn = $("a.btn", c);
      if (btn) { btn.classList.toggle("btn--primary", on); btn.classList.toggle("btn--outline-dark", !on); }
    });
    cards.forEach((c) => c.addEventListener("click", (e) => { if (!e.target.closest("a, button")) pick(c); }));
  });
}

// Paint correction table: tap a row to set the vehicle size, tap a price to pick the stage as well
function initPriceTable(setSize) {
  const table = $(".price-table table");
  if (!table) return;
  const STAGES = ["single", "two", "three"], NAMES = ["Single stage", "Two stage", "Three stage"];
  const summary = $("#pt-summary"), book = $("#pt-book");
  let col = 1;
  const paint = () => {
    const row = $("tr.is-active", table);
    $$("td, thead th", table).forEach((c) => c.classList.remove("is-pick", "is-col"));
    $$("thead th", table)[col + 1].classList.add("is-col");
    if (!row) return;
    const cell = $$("td", row)[col];
    cell.classList.add("is-pick");
    const what = $("th", row).textContent;
    if (row.dataset.row === "xl") {
      summary.innerHTML = `<b>${what}</b>: priced on inspection.`;
      book.innerHTML = 'Get a quote <svg><use href="#i-arrow"/></svg>';
      book.href = bookUrl(STAGES[col]);
    } else {
      summary.innerHTML = `<b>${NAMES[col]}</b> · ${what} · <strong>${cell.textContent}</strong>`;
      book.innerHTML = `Book ${NAMES[col].toLowerCase()} <svg><use href="#i-arrow"/></svg>`;
      book.href = bookUrl(STAGES[col]);
    }
  };
  const choose = (tr, td) => {
    if (td) {
      col = $$("td", tr).indexOf(td);
      const card = $(`.pkg[data-pkg="${STAGES[col]}"]`);
      if (card && !card.classList.contains("pkg--feature")) card.click();
    }
    if (tr.dataset.row === "xl") {
      $$("tr[data-row]", table).forEach((r) => r.classList.toggle("is-active", r === tr));
    } else setSize(tr.dataset.row);
    paint();
  };
  $$("tbody tr", table).forEach((tr) => {
    tr.tabIndex = 0;
    tr.addEventListener("click", () => choose(tr, null));
    tr.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); choose(tr, null); } });
  });
  // Picking a stage card or a size above keeps the table in step
  STAGES.forEach((s, i) => { const c = $(`.pkg[data-pkg="${s}"]`); if (c) c.addEventListener("click", (e) => { if (!e.target.closest("a, button")) { col = i; paint(); } }); });
  $$(".size-switch button").forEach((b) => b.addEventListener("click", () => setTimeout(paint)));
  paint();
}

function initPackages() {
  const buttons = $$(".size-switch button");
  const setSize = (size, sync = true) => {
    buttons.forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.size === size)));
    $$(".pkg").forEach((card) => {
      const el = $("[data-price]", card); // only size-priced cards carry data-price
      const price = priceFor(card.dataset.pkg, size);
      if (el && price != null) animateNumber(el, price);
    });
    $$("[data-choice-price]").forEach((el) => (el.textContent = "from " + money(priceFor(el.dataset.choicePrice, size))));
    $$(".price-table tr[data-row]").forEach((tr) => tr.classList.toggle("is-active", tr.dataset.row === size));
    if (sync) { const r = $(`input[name="size"][value="${size}"]`); if (r) { r.checked = true; updateEstimate(); } }
    store.set("dd-size", size);
  };
  buttons.forEach((b) => b.addEventListener("click", () => setSize(b.dataset.size)));
  setSize(store.get("dd-size") || "sedan");

  initPriceTable(setSize);

  // Spotlight follows the cursor (React Bits "spotlight card" pattern)
  $$(".pkg").forEach((card) => {
    card.addEventListener("pointermove", (e) => {
      const r = card.getBoundingClientRect();
      card.style.setProperty("--mx", `${e.clientX - r.left}px`);
      card.style.setProperty("--my", `${e.clientY - r.top}px`);
    });
  });

  // "Book X" buttons preselect the package in the form (on book.html, via the link's query string)
  $$("[data-book]").forEach((a) => {
    if (!form()) a.href = bookUrl(a.dataset.book, a.dataset.extra);
    a.addEventListener("click", (e) => {
      track("view_service", { package: a.dataset.book });
      if (form()) { e.preventDefault(); selectPackage(a.dataset.book, a.dataset.extra); }
    });
  });
}

function animateNumber(el, to) {
  const from = parseInt((el.textContent || "").replace(/\D/g, ""), 10) || to;
  if (reduceMotion || from === to) { el.textContent = money(to); return; }
  const t0 = performance.now(), dur = 450;
  const tick = (t) => {
    const k = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - k, 3);
    el.textContent = money(from + (to - from) * e);
    if (k < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

/* --------------------------------------------------------------------------
   6. Before / after gallery
   -------------------------------------------------------------------------- */
function initGallery() {
  const cmp = $("#compare");
  const range = $("#compare-range");
  const thumbs = $("#thumbs");
  const meta = $("#project-meta");
  let current = PROJECTS[0];

  const setPos = (v) => { cmp.style.setProperty("--pos", v + "%"); range.value = v; };
  range.addEventListener("input", () => setPos(range.value));

  // Pointer drag anywhere on the image (the range covers it for keyboard + touch)
  let dragging = false;
  const fromEvent = (e) => {
    const r = cmp.getBoundingClientRect();
    setPos(Math.max(0, Math.min(100, ((e.clientX - r.left) / r.width) * 100)).toFixed(1));
  };
  cmp.addEventListener("pointerdown", (e) => { dragging = true; fromEvent(e); });
  window.addEventListener("pointermove", (e) => dragging && fromEvent(e));
  window.addEventListener("pointerup", () => (dragging = false));

  // Slider position is tweened on a plain object so a new job (or a drag) cleanly replaces any running tween
  const slide = { v: 50 };
  let tween = null;
  const stopTween = () => { if (tween) { tween.kill(); tween = null; } };
  cmp.addEventListener("pointerdown", stopTween, { capture: true });
  range.addEventListener("input", stopTween);

  // Load both photos first, then swap them in together and re-centre the handle
  const preload = (src) => new Promise((res) => { const im = new Image(); im.onload = im.onerror = () => res(); im.src = src; });
  let token = 0;
  const show = async (p) => {
    current = p;
    const mine = ++token;
    $$("[data-meta]", meta).forEach((el) => (el.textContent = p[el.dataset.meta]));
    $$("button", thumbs).forEach((b) => b.setAttribute("aria-current", String(+b.dataset.id === p.id)));
    if (!form()) $("[data-meta-book]", meta).href = bookUrl(p.book);
    await Promise.all([preload(p.before), preload(p.after)]);
    if (mine !== token) return; // a newer job was picked while loading
    stopTween();
    cmp.style.setProperty("--ratio", p.ratio || 1.6);
    const set = (el, src, alt) => {
      const img = $("img", el);
      img.style.display = "";
      img.src = src; img.alt = alt;
    };
    set($("#cmp-before"), p.before, `Before: ${p.title}, ${p.vehicle}`);
    set($("#cmp-after"), p.after, `After: ${p.title}, ${p.vehicle}`);
    wireFallbacks(cmp);
    if (window.gsap && !reduceMotion) {
      slide.v = 15; setPos(15);
      tween = gsap.to(slide, { v: 50, duration: 0.9, ease: "power3.out", onUpdate: () => setPos(slide.v.toFixed(1)) });
    } else setPos(50);
  };

  $("[data-meta-book]", meta).addEventListener("click", () => { if (form()) selectPackage(current.book); });

  thumbs.innerHTML = PROJECTS.map((p) => `
    <button type="button" data-id="${p.id}" data-type="${p.type}" aria-label="Show ${p.title}">
      <img src="${p.after}" alt="" loading="lazy">
      <span>${p.tag}</span><b>${p.vehicle.replace(/ \(.*\)$/, "")}</b>
    </button>`).join("");
  wireFallbacks(thumbs);
  $$("button", thumbs).forEach((b) => b.addEventListener("click", () => {
    show(PROJECTS.find((p) => p.id === +b.dataset.id));
    // On a phone the slider sits above the thumbnails, so bring it back into view
    if (cmp.getBoundingClientRect().top < 0) cmp.scrollIntoView({ behavior: "smooth", block: "start" });
  }));

  // Filters
  $$(".filters button").forEach((f) => f.addEventListener("click", () => {
    $$(".filters button").forEach((x) => x.setAttribute("aria-pressed", String(x === f)));
    const type = f.dataset.filter;
    let first = null;
    $$("button", thumbs).forEach((b) => {
      const match = type === "all" || b.dataset.type === type;
      b.hidden = !match;
      if (match && !first) first = b;
    });
    // "All work" opens on a random job (never the one already showing), so it doesn't repeat the Headlights pick
    if (type === "all") showRandom();
    else if (first) show(PROJECTS.find((p) => p.id === +first.dataset.id));
  }));

  const showRandom = () => {
    const pool = PROJECTS.filter((p) => p.id !== current.id);
    const p = pool[Math.floor(Math.random() * pool.length)];
    show(p);
    const b = $(`button[data-id="${p.id}"]`, thumbs);
    if (b) thumbs.scrollTo({ left: b.offsetLeft - thumbs.clientWidth / 2 + b.clientWidth / 2, behavior: "smooth" });
  };

  // Step to the previous or next job among the ones the current filter shows
  const stepJob = (d) => {
    const visible = $$("button", thumbs).filter((b) => !b.hidden);
    if (!visible.length) return;
    const i = visible.findIndex((b) => +b.dataset.id === current.id);
    const b = visible[(i + d + visible.length) % visible.length];
    thumbs.scrollTo({ left: b.offsetLeft - thumbs.clientWidth / 2 + b.clientWidth / 2, behavior: "smooth" });
    show(PROJECTS.find((p) => p.id === +b.dataset.id));
  };
  $("#cmp-prev")?.addEventListener("click", () => stepJob(-1));
  $("#cmp-next")?.addEventListener("click", () => stepJob(1));

  current = PROJECTS[Math.floor(Math.random() * PROJECTS.length)];
  show(current);

  // Autoplay: step to the next job every 5 seconds while the slider is on screen.
  // Any touch, drag, key press, thumbnail or filter click hands control to the visitor for good.
  if (reduceMotion) return;
  const section = cmp.closest("section") || cmp;
  let onScreen = false, timer = null, userTookOver = false;
  const next = () => stepJob(1);
  const sync = () => {
    clearInterval(timer); timer = null;
    if (!userTookOver && onScreen && !document.hidden) timer = setInterval(next, 5000);
  };
  const takeOver = () => { userTookOver = true; sync(); };
  ["pointerdown", "keydown", "wheel"].forEach((ev) => section.addEventListener(ev, takeOver, { passive: true }));
  range.addEventListener("input", takeOver);
  new IntersectionObserver(([e]) => { onScreen = e.isIntersecting; sync(); }, { threshold: 0.35 }).observe(cmp);
  document.addEventListener("visibilitychange", sync);
}

/* --------------------------------------------------------------------------
   7. Instagram grid
   -------------------------------------------------------------------------- */
function initInstagram() {
  const url = `https://www.instagram.com/${BUSINESS.instagram}/`;
  $("#ig-grid").innerHTML = IG_POSTS.map((p) => `
    <a class="ig__tile" href="${url}" target="_blank" rel="noopener" data-track="instagram_click">
      <img src="${p.src}" alt="${p.alt}" loading="lazy">
      <span class="ig__overlay">${p.alt}</span>
    </a>`).join("");
  wireFallbacks($("#ig-grid"));
  $$("#ig-grid [data-track]").forEach((a) => a.addEventListener("click", () => track("instagram_click")));
}

/* --------------------------------------------------------------------------
   7b. Car galleries + lightbox
   -------------------------------------------------------------------------- */
/** Day / night mode. Night (the brand look) is the default; the choice is remembered. */
function initTheme() {
  const root = document.documentElement;
  const btn = $(".theme-toggle");
  const meta = $('meta[name="theme-color"]');
  const apply = (t) => {
    root.dataset.theme = t;
    if (btn) btn.setAttribute("aria-label", t === "light" ? "Switch to night mode" : "Switch to day mode");
    if (meta) meta.content = t === "light" ? "#ebe7ff" : "#09090d";
  };
  // Night mode is the default on every new visit; a day-mode pick only lasts for the current visit
  const session = {
    get() { try { return sessionStorage.getItem("dd-theme"); } catch { return null; } },
    set(v) { try { sessionStorage.setItem("dd-theme", v); } catch { /* storage unavailable */ } },
  };
  try { localStorage.removeItem("dd-theme"); } catch { /* storage unavailable */ }
  apply(session.get() === "light" ? "light" : "dark");
  btn?.addEventListener("click", () => {
    const next = root.dataset.theme === "light" ? "dark" : "light";
    apply(next);
    session.set(next);
  });
}

function initCars() {
  const grid = $("#cars"), lb = $("#lightbox"), img = $("#lb-img"), strip = $("#lb-strip");
  let car = null, ci = 0, idx = 0;

  grid.innerHTML = CARS.map((c, i) => `
    <button type="button" class="car" data-i="${i}" data-anim="rise" aria-label="Open ${c.photos.length} photos of the ${c.colour.toLowerCase()} ${c.make}">
      <img src="${c.cover}" alt="${c.colour} ${c.make}" loading="lazy">
      <span class="car__meta"><b>${c.make}</b><span>${c.service}</span></span>
      <span class="car__count">${c.photos.length} photos</span>
    </button>`).join("");

  const go = (n) => {
    idx = (n + car.photos.length) % car.photos.length;
    const p = car.photos[idx];
    img.src = p.src;
    img.alt = `${car.colour} ${car.make}, photo ${idx + 1} of ${car.photos.length}`;
    const last = idx === car.photos.length - 1, nx = CARS[(ci + 1) % CARS.length];
    const nextName = `${nx.colour.toLowerCase()} ${nx.make}`;
    $("#lb-count").textContent = `${idx + 1} / ${car.photos.length}` + (last ? ` · Next: ${nextName} →` : "");
    $("#lb-next").setAttribute("aria-label", last ? `Next car: ${nextName}` : "Next photo");
    $("#lb-nextname").textContent = `${nx.colour} ${nx.make}`;
    $$("button", strip).forEach((b, i) => b.setAttribute("aria-current", String(i === idx)));
    const active = strip.children[idx];
    if (active) active.scrollIntoView({ block: "nearest", inline: "center" });
  };
  const load = (i) => {
    ci = (i + CARS.length) % CARS.length;
    car = CARS[ci];
    $("#lb-title").textContent = car.make;
    $("#lb-sub").textContent = `${car.colour} · ${car.service}`;
    strip.innerHTML = car.photos.map((p, k) => `<button type="button" aria-label="Photo ${k + 1}"><img src="${p.src}" alt="" loading="lazy"></button>`).join("");
    $$("button", strip).forEach((b, k) => b.addEventListener("click", () => go(k)));
  };
  const open = (i) => {
    load(i);
    if (typeof lb.showModal === "function") lb.showModal(); else lb.setAttribute("open", "");
    document.documentElement.style.overflow = "hidden";
    go(0);
  };
  // Change car with a slide/sweep animation; going back lands on that car's last photo
  const switchCar = (d) => {
    load(ci + d);
    lb.classList.remove("is-switching", "is-back");
    void lb.offsetWidth;
    lb.classList.add("is-switching");
    if (d < 0) lb.classList.add("is-back");
    go(d < 0 ? car.photos.length - 1 : 0);
  };
  // Past the last photo, roll straight on to the next car (and back again the other way)
  const step = (d) => {
    const n = idx + d;
    if (n >= car.photos.length) switchCar(1);
    else if (n < 0) switchCar(-1);
    else go(n);
  };
  const close = () => { if (lb.open) lb.close(); };
  lb.addEventListener("close", () => (document.documentElement.style.overflow = ""));

  $$(".car", grid).forEach((b) => b.addEventListener("click", () => open(+b.dataset.i)));
  $("#lb-prev").addEventListener("click", () => step(-1));
  $("#lb-next").addEventListener("click", () => step(1));
  $("#lb-close").addEventListener("click", close);
  $("#lb-nextcar").addEventListener("click", () => switchCar(1));
  lb.addEventListener("animationend", (e) => { if (e.target === img) lb.classList.remove("is-switching", "is-back"); });
  lb.addEventListener("click", (e) => { if (e.target === lb) close(); });
  lb.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") step(1);
    if (e.key === "ArrowLeft") step(-1);
  });
  // Swipe on touch screens
  let x0 = null;
  img.addEventListener("touchstart", (e) => (x0 = e.touches[0].clientX), { passive: true });
  img.addEventListener("touchend", (e) => {
    if (x0 == null) return;
    const dx = e.changedTouches[0].clientX - x0;
    if (Math.abs(dx) > 40) step(dx < 0 ? 1 : -1);
    x0 = null;
  });
}

/* --------------------------------------------------------------------------
   8. Service area: postcode checker + live open/closed status
   -------------------------------------------------------------------------- */
function areaFor(pc) {
  const n = parseInt(pc, 10);
  const inAny = (ranges) => ranges.some(([a, b]) => n >= a && n <= b);
  if (inAny(BUSINESS.serviceArea.standard)) return "standard";
  if (inAny(BUSINESS.serviceArea.extended)) return "extended";
  return "outside";
}

// Straight-line distance in km between two [lat, lng] points
function distanceKm([a1, o1], [a2, o2]) {
  const r = (d) => (d * Math.PI) / 180;
  const h = Math.sin(r(a2 - a1) / 2) ** 2 + Math.cos(r(a1)) * Math.cos(r(a2)) * Math.sin(r(o2 - o1) / 2) ** 2;
  return 6371 * 2 * Math.asin(Math.sqrt(h));
}

// Look up a postcode or suburb in Western Australia (OpenStreetMap Nominatim, results cached in this browser)
async function geocode(query) {
  const key = "dd-geo-" + query.toLowerCase();
  const hit = store.get(key);
  if (hit) return JSON.parse(hit);
  const params = /^\d{4}$/.test(query)
    ? { postalcode: query, state: "Western Australia", country: "Australia" }
    : { q: `${query}, Western Australia, Australia` };
  const url = "https://nominatim.openstreetmap.org/search?" + new URLSearchParams({ ...params, format: "jsonv2", addressdetails: "1", limit: "1" });
  const res = await fetch(url, { headers: { Accept: "application/json" } });
  if (!res.ok) throw new Error("Lookup failed " + res.status);
  const [r] = await res.json();
  if (!r) return null;
  const a = r.address || {};
  const place = { lat: +r.lat, lng: +r.lon, postcode: a.postcode || (/^\d{4}$/.test(query) ? query : ""),
    name: a.suburb || a.town || a.city_district || a.village || a.city || query };
  store.set(key, JSON.stringify(place));
  return place;
}

// Google Map: starts on the workshop, then shows the drive from Floreat to the place checked
function initMap() {
  const frame = $("#gmap");
  if (!frame) return null;
  const home = `${BUSINESS.workshop} WA 6014`;
  const open = $("#gmap-open"), title = $("#gmap-badge-title"), sub = $("#gmap-badge-sub"), badge = $("#gmap-badge");
  const embed = (params) => "https://maps.google.com/maps?" + new URLSearchParams({ ...params, output: "embed" });
  return {
    show(place, tone, km) {
      const dest = `${place.name} WA ${place.postcode || ""}`.trim() + ", Australia";
      frame.src = embed({ saddr: home, daddr: dest });
      open.href = "https://www.google.com/maps/dir/?" + new URLSearchParams({ api: "1", origin: home, destination: dest });
      open.firstChild.textContent = "Directions in Google Maps ";
      title.textContent = place.name;
      sub.textContent = (km != null ? `About ${Math.round(km)} km from ${BUSINESS.workshop} · ` : "") + (tone === "ok" ? "We come to you" : "Ask us, or use workshop pick-up");
      badge.dataset.tone = tone;
    },
  };
}

function initArea() {
  const input = $("#postcode"), out = $("#postcode-result"), btn = $("#postcode-btn");
  const live = initMap();
  const say = (msg, cls) => { out.className = "checker__result" + (cls ? " " + cls : ""); out.textContent = msg; };
  const verdict = (pc, km) => {
    if (pc) return areaFor(pc);
    if (km == null) return "outside";
    return km <= BUSINESS.mobileRadiusKm ? "standard" : km <= BUSINESS.askRadiusKm ? "extended" : "outside";
  };

  const check = async () => {
    const q = input.value.trim();
    if (!q) return say("Enter a postcode or suburb.");
    if (/^\d+$/.test(q) && !/^\d{4}$/.test(q)) return say("Postcodes have 4 digits.");
    btn.disabled = true; say("Checking…");
    let place = null;
    try { place = await geocode(q); } catch { /* offline or blocked: fall back to postcode ranges */ }
    btn.disabled = false;

    if (!place && !/^\d{4}$/.test(q)) return say(`We couldn't find "${q}". Try the postcode instead.`, "is-maybe");
    const pc = place?.postcode || (/^\d{4}$/.test(q) ? q : "");
    const km = place ? distanceKm(BUSINESS.workshopLatLng, [place.lat, place.lng]) : null;
    const a = verdict(pc, km);
    const where = place ? `${place.name}${pc ? " (" + pc + ")" : ""}` : pc;
    const dist = km != null ? `, about ${Math.round(km)} km from our ${BUSINESS.workshop} workshop` : "";

    if (a === "standard") say(`Yes, we come to ${where}${dist}. Mobile detailing is available at your place.`, "is-ok");
    else if (a === "extended") say(`${where} is a bit further out${dist}. Send a request and we'll confirm, or use workshop pick-up.`, "is-maybe");
    else say(`${where} is outside our mobile area${dist}, but you can still bring the car to our ${BUSINESS.workshop} workshop.`, "is-maybe");

    if (live) live.show(place || { name: pc }, a === "standard" ? "ok" : "maybe", km);
    if (pc) {
      store.set("dd-postcode", pc);
      const b = $("#bpostcode");
      if (b) { b.value = pc; updateEstimate(); }
    }
    const cta = $("#area-book");
    if (cta) cta.hidden = false;
    track("postcode_check", { result: a });
  };
  btn.addEventListener("click", check);
  $$(".gmap__chips button").forEach((c) => c.addEventListener("click", () => {
    input.value = c.dataset.suburb;
    $$(".gmap__chips button").forEach((o) => o.setAttribute("aria-pressed", String(o === c)));
    check();
  }));
  input.addEventListener("keydown", (e) => { if (e.key === "Enter") { e.preventDefault(); check(); } });

  // Hours table + open-now, computed in the business's own time zone
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const fmt = (hm) => { const [h, m] = hm.split(":").map(Number); const ap = h >= 12 ? "pm" : "am"; return `${((h + 11) % 12) + 1}${m ? ":" + String(m).padStart(2, "0") : ""}${ap}`; };
  const parts = Object.fromEntries(new Intl.DateTimeFormat("en-AU", { timeZone: BUSINESS.timeZone, weekday: "long", hour: "2-digit", minute: "2-digit", hourCycle: "h23" })
    .formatToParts(new Date()).map((p) => [p.type, p.value]));
  const today = days.indexOf(parts.weekday);
  const nowMin = +parts.hour * 60 + +parts.minute;
  const order = [1, 2, 3, 4, 5, 6, 0];
  $("#hours-table").innerHTML = "<tbody>" + order.map((d) => {
    const h = BUSINESS.hours[d];
    return `<tr class="${d === today ? "is-today" : ""}"><td>${days[d]}</td><td>${h ? `${fmt(h[0])} – ${fmt(h[1])}` : "Closed"}</td></tr>`;
  }).join("") + "</tbody>";

  const h = BUSINESS.hours[today];
  const toMin = (hm) => { const [a, b] = hm.split(":").map(Number); return a * 60 + b; };
  const open = h && nowMin >= toMin(h[0]) && nowMin < toMin(h[1]);
  $("#open-dot").classList.toggle("is-open", !!open);
  $("#open-text").textContent = open
    ? `Open now, until ${fmt(h[1])} (${BUSINESS.region} time)`
    : `Closed now. Requests are answered from the next opening (${BUSINESS.region} time)`;
}

/* --------------------------------------------------------------------------
   9. Booking form: steps, validation, live estimate, submit
   -------------------------------------------------------------------------- */
const form = () => $("#booking-form");
let step = 1;
const TOTAL_STEPS = 4;

const bookUrl = (pkg, extra) => "book.html?" + new URLSearchParams(Object.fromEntries(Object.entries({ pkg, extra }).filter(([, v]) => v))) + "#book";

function selectPackage(pkg, extra) {
  if (!form()) { location.href = bookUrl(pkg, extra); return; }
  // Leather care and headlights are add-ons now: tick the add-on and keep the chosen detail
  if (pkg === "leather" || pkg === "headlights") { extra = pkg; pkg = null; }
  const r = pkg && $(`input[name="package"][value="${pkg}"]`);
  if (r) r.checked = true;
  if (extra) { const x = $(`input[name="extras"][value="${extra}"]`); if (x) x.checked = true; }
  updateEstimate();
  goStep(1);
  // On the booking page the service cards sit below the form, so bring the form back into view
  const book = $("#book");
  if (book && book.getBoundingClientRect().top < -40) book.scrollIntoView({ behavior: "smooth" });
}

function values() {
  const f = form();
  const fd = new FormData(f);
  return {
    package: fd.get("package"),
    size: fd.get("size") || "sedan",
    extras: fd.getAll("extras"),
    condition: fd.getAll("condition"),
    make: (fd.get("make") || "").trim(),
    model: (fd.get("model") || "").trim(),
    date: fd.get("date"),
    window: fd.get("window"),
    location: fd.get("location") || "mobile",
    seats: fd.get("seats") || "5",
    suburb: (fd.get("suburb") || "").trim(),
    postcode: (fd.get("postcode") || "").trim(),
    address: (fd.get("address") || "").trim(),
    name: (fd.get("name") || "").trim(),
    mobile: (fd.get("mobile") || "").trim(),
    email: (fd.get("email") || "").trim(),
    notes: (fd.get("notes") || "").trim(),
  };
}

/** Builds the estimate from the pricing model. Returns { total, lines, quote, from }. */
function estimate(v) {
  const lines = [];
  let total = 0, quote = false, from = false;
  const pkg = PRICING.packages[v.package];
  if (!pkg) return { total: 0, lines, quote: true };
  const price = priceFor(v.package, v.size, v.seats);
  if (price == null) { quote = true; lines.push([pkg.label, "Quote"]); }
  else {
    total += price;
    if (pkg.from || pkg.upto) from = true;
    const label = pkg.table ? `${pkg.label} · ${PRICING.size[v.size].label}` : pkg.seats7 ? `${pkg.label} · ${v.seats} seats` : pkg.label;
    lines.push([label, pkg.upto ? `${money(price)}–${money(pkg.upto)}` : money(price)]);
  }
  v.extras.forEach((k) => {
    if (k === v.package) return; // same service picked twice
    const x = PRICING.extras[k];
    if (x.price == null) { quote = true; lines.push([x.label, "Quote"]); }
    else {
      const xp = x.seats7 && v.seats === "7" ? x.seats7 : x.price;
      total += xp; if (x.from) from = true;
      lines.push([x.seats7 ? `${x.label} · ${v.seats} seats` : x.label, "+" + money(xp)]);
    }
  });
  if (v.condition.length) lines.push(["Condition noted", "Checked on inspection"]);
  return { total, lines, quote, from, hours: pkg.hours, workshop: pkg.mode === "workshop" || v.extras.includes("ceramic") };
}

function updateEstimate() {
  if (!form()) return;
  const v = values();
  const e = estimate(v);
  const totalEl = $("#est-total");
  if (e.total === 0 && e.quote) totalEl.innerHTML = `Quote <small>after we see it</small>`;
  else totalEl.innerHTML = `${money(e.total)}${e.quote || e.from ? "+" : ""} <small>${e.quote ? "plus quoted items" : "rough estimate"}</small>`;
  $("#est-lines").innerHTML = e.lines.map(([l, p]) => `<li><span>${l}</span><b>${p}</b></li>`).join("")
    + (e.hours ? `<li><span>Typical time</span><b>${e.hours}</b></li>` : "")
    + `<li><span>Where</span><b>${e.workshop ? BUSINESS.workshop + " workshop" : "Mobile, at your place"}</b></li>`;
  $("#est-fine").textContent = e.workshop
    ? "Rough estimate from size alone. Exact price confirmed after a 10-minute inspection or when the car arrives. Pick-up and return at no extra cost."
    : "Rough estimate. Final price depends on size and condition and is confirmed before we start.";
  // Contextual hints
  const ceramicOnMobile = v.extras.includes("ceramic") && PRICING.packages[v.package]?.mode === "mobile";
  $("#extras-hint").textContent = ceramicOnMobile ? `Ceramic coating is applied after paint correction at our ${BUSINESS.workshop} workshop. We'll include it in your quote.` : "";
  const loc = $("#location");
  if (e.workshop && loc.value === "mobile" && !loc.dataset.touched) loc.value = "pickup";
  $("#location-hint").textContent = e.workshop ? `Paint correction and coatings are done at our ${BUSINESS.workshop} workshop.` : "";
}

const RULES = {
  1: { package: (v) => (v.package ? "" : "Choose a package.") },
  2: {
    make: (v) => (v.make.length >= 2 ? "" : "Enter the vehicle make."),
    model: (v) => (v.model.length >= 1 ? "" : "Enter the model."),
  },
  3: {
    date: (v) => {
      if (!v.date) return "Pick a preferred date.";
      const d = new Date(v.date + "T00:00"), t = new Date(); t.setHours(0, 0, 0, 0);
      if (d < t) return "Choose today or a future date.";
      if (BUSINESS.hours[d.getDay()] == null) return "We're closed that day. Please pick another.";
      return "";
    },
    suburb: (v) => (v.suburb.length >= 2 ? "" : "Enter your suburb."),
    postcode: (v) => (/^\d{4}$/.test(v.postcode) ? "" : "Enter a 4-digit postcode."),
    address: (v) => (v.location === "dropoff" || v.address.length >= 4 ? "" : "Enter the address where the car will be."),
  },
  4: {
    name: (v) => (v.name.length >= 2 ? "" : "Enter your name."),
    mobile: (v) => (/^(\+?61|0)4\d{8}$/.test(v.mobile.replace(/[\s()-]/g, "")) ? "" : "Enter an Australian mobile, e.g. 0412 345 678."),
    email: (v) => (!v.email || /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.email) ? "" : "Check the email address, or leave it blank."),
    consent: () => ($("#consent").checked ? "" : "Please tick to confirm."),
  },
};

function validate(n) {
  const v = values();
  let firstBad = null;
  Object.entries(RULES[n]).forEach(([key, rule]) => {
    const msg = rule(v);
    const err = $(`[data-err="${key}"]`);
    if (err) err.textContent = msg;
    const input = form().querySelector(`[name="${key}"]`);
    if (input && input.type !== "radio") input.setAttribute("aria-invalid", String(!!msg));
    if (msg && !firstBad) firstBad = input;
  });
  if (firstBad) firstBad.focus();
  return !firstBad;
}

function renderReview() {
  const v = values();
  const e = estimate(v);
  const win = { morning: "Morning", midday: "Midday", afternoon: "Afternoon", any: "Any time" }[v.window];
  const date = v.date ? new Date(v.date + "T00:00").toLocaleDateString("en-AU", { weekday: "short", day: "numeric", month: "short" }) : "–";
  const rows = [
    ["Service", PRICING.packages[v.package]?.label || "–"],
    ["Extras", v.extras.map((k) => PRICING.extras[k].label).join(", ") || "None"],
    ["Vehicle", `${v.make} ${v.model} · ${PRICING.size[v.size].label}`],
    ["Condition", v.condition.map((k) => PRICING.condition[k]).join(", ") || "Nothing noted"],
    ["Location", { mobile: "Mobile, at my place", dropoff: `Drop-off at ${BUSINESS.workshop}`, pickup: "Pick-up and return" }[v.location]],
    ["When", `${date}, ${win}`],
    ["Where", [v.address, v.suburb, v.postcode].filter(Boolean).join(", ")],
    ["Estimate", e.total ? money(e.total) + (e.quote ? " + quoted items" : e.from ? "+" : "") : "Quote"],
  ];
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  $("#review-list").innerHTML = rows.map(([k, val]) => `<dt>${k}</dt><dd>${esc(val)}</dd>`).join("");
}

function goStep(n) {
  step = Math.max(1, Math.min(TOTAL_STEPS, n));
  $$(".fstep").forEach((fs) => (fs.hidden = +fs.dataset.step !== step));
  $$("#stepper li").forEach((li, i) => {
    li.classList.toggle("is-done", i + 1 < step);
    li.classList.toggle("is-current", i + 1 === step);
    li.setAttribute("aria-current", i + 1 === step ? "step" : "false");
  });
  $("#prev-btn").hidden = step === 1;
  $("#next-btn").hidden = step === TOTAL_STEPS;
  $("#submit-btn").hidden = step !== TOTAL_STEPS;
  if (step === TOTAL_STEPS) renderReview();
  const fs = $(`.fstep[data-step="${step}"]`);
  if (window.gsap && !reduceMotion) gsap.fromTo(fs, { autoAlpha: 0, x: 16 }, { autoAlpha: 1, x: 0, duration: 0.4, ease: "power2.out" });
}

function initBooking() {
  const f = form();
  let started = false;

  // Earliest date = tomorrow
  const tmr = new Date(); tmr.setDate(tmr.getDate() + 1);
  $("#date").min = tmr.toISOString().slice(0, 10);

  f.addEventListener("input", () => {
    if (!started) { started = true; track("start_booking"); }
    updateEstimate();
  });
  f.addEventListener("change", updateEstimate);
  $("#location").addEventListener("change", (e) => (e.target.dataset.touched = "1"));

  $("#next-btn").addEventListener("click", () => {
    if (validate(step)) goStep(step + 1);
    $("#book").scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
  });
  $("#prev-btn").addEventListener("click", () => goStep(step - 1));

  // Photo upload with previews (max 6, 10 MB each)
  const input = $("#photos"), drop = $("#dropzone"), prev = $("#previews");
  let files = [];
  const addFiles = (list) => {
    [...list].forEach((file) => {
      if (!file.type.startsWith("image/")) return toast(`${file.name} isn't an image.`);
      if (file.size > 10 * 1024 * 1024) return toast(`${file.name} is over 10 MB.`);
      if (files.length >= 6) return toast("Up to 6 photos.");
      files.push(file);
    });
    prev.innerHTML = "";
    files.forEach((file) => {
      const img = document.createElement("img");
      img.alt = file.name;
      img.src = URL.createObjectURL(file);
      prev.appendChild(img);
    });
  };
  input.addEventListener("change", () => addFiles(input.files));
  ["dragenter", "dragover"].forEach((t) => drop.addEventListener(t, (e) => { e.preventDefault(); drop.classList.add("is-over"); }));
  ["dragleave", "drop"].forEach((t) => drop.addEventListener(t, (e) => { e.preventDefault(); drop.classList.remove("is-over"); }));
  drop.addEventListener("drop", (e) => addFiles(e.dataTransfer.files));

  // Submit
  f.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!validate(4)) return;
    if (f.company.value) return; // honeypot tripped

    const v = values();
    // Duplicate guard: same person + date + vehicle within this browser
    const key = [v.mobile.replace(/\D/g, ""), v.date, v.make, v.model].join("|").toLowerCase();
    if (store.get("dd-last") === key) { toast("You've already sent this request. We'll be in touch."); return; }

    const btn = $("#submit-btn");
    btn.disabled = true; btn.textContent = "Sending…";
    const ref = "DD-" + Date.now().toString(36).slice(-5).toUpperCase();

    try {
      if (BUSINESS.formEndpoint) {
        const fd = new FormData(f);
        fd.delete("photos"); files.forEach((file) => fd.append("photos", file));
        fd.append("reference", ref);
        fd.append("estimate", JSON.stringify(estimate(v)));
        const res = await fetch(BUSINESS.formEndpoint, { method: "POST", body: fd, headers: { Accept: "application/json" } });
        if (!res.ok) throw new Error("Server responded " + res.status);
      } else {
        // No form endpoint yet: hand the request to the customer's messages app as a text to Will
        renderReview();
        const lines = $$("#review-list dt").map((dt) => `${dt.textContent}: ${dt.nextElementSibling.textContent}`);
        const body = [`Dream Detail request ${ref}`, `Name: ${v.name}`, `Mobile: ${v.mobile}`, ...lines].join("\n");
        const sep = /iPhone|iPad|Mac/.test(navigator.userAgent) ? "&" : "?";
        location.href = `sms:${BUSINESS.phoneHref}${sep}body=${encodeURIComponent(body)}`;
      }
      store.set("dd-last", key);
      track("submit_enquiry", { package: v.package, value: estimate(v).total, currency: "AUD" });
      f.hidden = true; $("#stepper").hidden = true;
      $("#success-name").textContent = v.name.split(" ")[0];
      $("#success-ref").textContent = ref;
      if (!BUSINESS.formEndpoint) $("#success-note").textContent = `Your messages app should open with the request filled in. Press send to get it to Will, or text ${BUSINESS.phoneDisplay} directly.`;
      const s = $("#success"); s.hidden = false; s.focus();
    } catch (err) {
      toast("That didn't send. Check your connection and try again, or text Will.");
      console.error(err);
    } finally {
      btn.disabled = false; btn.innerHTML = 'Send request <svg><use href="#i-arrow"/></svg>';
    }
  });

  // Clear everything and go back to step 1
  const resetForm = () => {
    f.reset(); files = []; prev.innerHTML = "";
    delete $("#location").dataset.touched;
    $$("[data-err]", f).forEach((e) => (e.textContent = ""));
    $$("[aria-invalid]", f).forEach((e) => e.removeAttribute("aria-invalid"));
    f.hidden = false; $("#stepper").hidden = false; $("#success").hidden = true;
    goStep(1); updateEstimate();
  };
  $("#new-request").addEventListener("click", resetForm);
  $("#reset-btn").addEventListener("click", () => {
    resetForm();
    toast("Form cleared.");
    $("#book").scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
  });

  goStep(1);
  // Arriving from a "Book X" button or the postcode checker on another page
  const q = new URLSearchParams(location.search);
  if (q.get("pkg")) selectPackage(q.get("pkg"), q.get("extra"));
  const pc = store.get("dd-postcode");
  if (pc && !$("#bpostcode").value) $("#bpostcode").value = pc;
  updateEstimate();
}

/* --------------------------------------------------------------------------
   10. Motion (GSAP). Content is fully visible before any of this runs.
   -------------------------------------------------------------------------- */
function initMotion() {
  // Magnetic buttons (desktop pointer only)
  if (window.matchMedia("(hover: hover) and (pointer: fine)").matches && !reduceMotion) {
    $$(".magnetic").forEach((btn) => {
      btn.addEventListener("pointermove", (e) => {
        const r = btn.getBoundingClientRect();
        btn.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.18}px, ${(e.clientY - r.top - r.height / 2) * 0.3}px)`;
      });
      btn.addEventListener("pointerleave", () => (btn.style.transform = ""));
    });
  }

  if (!window.gsap || reduceMotion) return;
  if (window.ScrollTrigger) gsap.registerPlugin(ScrollTrigger);

  // Hero entrance (home page only)
  if ($(".hero")) gsap.timeline({ defaults: { ease: "power4.out" } })
    .from(".hero [data-anim='fade']", { y: 18, autoAlpha: 0, duration: 0.8, stagger: 0.08 });


  // Scroll reveals: transform only, so content is never invisible at rest
  if (window.ScrollTrigger) {
    ScrollTrigger.batch("[data-anim='rise']", {
      start: "top 92%",
      once: true,
      onEnter: (els) => gsap.from(els, { y: 36, duration: 0.9, stagger: 0.08, ease: "power3.out", clearProps: "transform" }),
    });
    gsap.utils.toArray(".section-head h2, .ig__head h2").forEach((h) =>
      gsap.from(h, { y: 28, duration: 1, ease: "power3.out", scrollTrigger: { trigger: h, start: "top 90%", once: true } }));
  }
}

/* --------------------------------------------------------------------------
   Boot
   -------------------------------------------------------------------------- */
// Faint champagne glow under the cursor on clickable tiles only (the package cards have their own).
// Mouse and trackpad only, so phones and tablets are untouched.
function initCursor() {
  if (reduceMotion || !matchMedia("(hover: hover) and (pointer: fine)").matches) return;
  document.addEventListener("pointermove", (e) => {
    const tile = e.target instanceof Element ? e.target.closest(".car, .pc-tabs button, .choice") : null;
    if (!tile) return;
    tile.classList.add("has-spot");
    const r = tile.getBoundingClientRect();
    tile.style.setProperty("--sx", `${e.clientX - r.left}px`);
    tile.style.setProperty("--sy", `${e.clientY - r.top}px`);
  }, { passive: true });
}

// The booking page always opens on the quote form, never part-way down
function initBookLanding() {
  if (location.hash && location.hash !== "#book") return;
  if ("scrollRestoration" in history) history.scrollRestoration = "manual";
  const toForm = () => {
    const top = $("#book").getBoundingClientRect().top + scrollY - ($(".site-header")?.offsetHeight || 0);
    window.scrollTo({ top: Math.max(0, top), behavior: "instant" });
  };
  toForm();
  addEventListener("load", () => { toForm(); setTimeout(toForm, 200); }, { once: true });
  addEventListener("pageshow", (e) => { if (e.persisted) toForm(); });
}

function start() {
  // Each page carries only some sections, so each part runs only where its markup exists
  const run = (fn, sel) => { if (sel && !$(sel)) return; try { fn(); } catch (e) { console.error(fn.name, e); } };
  run(initTheme);
  run(initCursor);
  run(applyBusiness);
  run(initHeader);
  run(initPackages, ".pkg");
  run(initPackagePick, ".pkg");
  run(initPaintShots, "#pc-tabs");
  run(initGallery, "#compare");
  run(initInstagram, "#ig-grid");
  run(initCars, "#cars");
  run(initArea, "#area");
  run(initBooking, "#booking-form");
  run(initBookLanding, "#booking-form");
  run(initMotion);
}
if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start);
else start();
