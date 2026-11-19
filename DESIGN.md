# Design

The visual system of the Aero landing page, as built.

## Palette (steel-orange)
- Ground `#eeeeeb` (stone, like a home-office wall), surface `#e1e1dd`, ink `#1c1d1f`, muted `#5c5e62`.
- Accent and action `#c2501b` (ember): the warm evening light Aero turns to. Used for the primary button, focus ring, the selected option and the Ember colourway only.
- Inverse ground `#1c1d1f` for one dark band (Specifications) and the footer.

## Type
- Display: Bricolage Grotesque, weight 400, tracking -3% (-4% at hero size), width 96%.
- Text: Figtree 400/500. Sentence case everywhere; tabular numerals for prices and specs.

## Shape and layout
- Radius family "soft" (8/12/20). Buttons "solid", 44px.
- One section per screen at 1440x900; 1280px wrap with 80px gutters (24px on phones); 12-column grid, split line at column 7.

## Product imagery
- Aero is a studio render from `assets/objects/product-render/specs/aero.json` (11 parts: round base with dial and status ring, slim upright, hinge, flat light bar). Stills in `specs/stills/`; re-render with `node assets/objects/product-render/make-posters.mjs <spec> --profile <dir>`.
- Colourways: Graphite `#2b2c2f`, Chalk `#dcd9d2`, Ember `#c2501b`. Each section shows a different view or colour.
- Context photographs are CC0 stand-ins from Wikimedia Commons (see `credits.html`).

## Motion
- Hero enters once on load (kit motion layer). Hover lifts and button presses from the kit.
- `#how` is the pinned photo-chapters moment (3 steps).
- Lenis smooth scroll driven by GSAP's ticker; each other section reveals once (heading 16px rise, group staggered 70ms, power3.out, ~0.6s). Nothing moves under `prefers-reduced-motion`.
