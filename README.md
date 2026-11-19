# Aero landing page

Landing page for **Aero**, a fictional smart desk lamp that follows the time of day. Static site: no build step.

- `index.html` – the page; `assets/app.js` – Lenis + GSAP ScrollTrigger reveals.
- `assets/` – the taste-skill kit (system CSS/JS, motion, layout, moments, product renderer) plus `assets/vendor/` (GSAP 3, Lenis 1.3).
- `PRODUCT.md`, `DESIGN.md` – product and design records.

Run locally: `npx serve .` (or any static server). Update vendored libraries: `npm install && npm run vendor`.

Aero is a concept product: its specifications, prices and tester quotes are not real. Photographs are CC0 stand-ins from Wikimedia Commons, listed in `credits.html`.
