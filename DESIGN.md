---
name: Aero
description: Landing page for Aero, a smart desk lamp that follows the time of day
colors:
  paper: "#edeae4"
  charcoal: "#1c1c1e"
  blue: "#2b4fe8"
  lamp-graphite: "#2b2c2f"
  lamp-chalk: "#dcd9d2"
  lamp-ember: "#c2501b"
typography:
  display:
    fontFamily: "Bricolage Grotesque, system-ui, sans-serif"
    fontSize: "72px"
    fontWeight: 400
    lineHeight: 1.02
    letterSpacing: "-0.04em"
  heading:
    fontFamily: "Bricolage Grotesque, system-ui, sans-serif"
    fontSize: "48px"
    fontWeight: 400
    lineHeight: 1.1
    letterSpacing: "-0.03em"
  card-title:
    fontFamily: "Figtree, system-ui, sans-serif"
    fontSize: "20px"
    fontWeight: 500
    lineHeight: 1.3
  body:
    fontFamily: "Figtree, system-ui, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "Figtree, system-ui, sans-serif"
    fontSize: "13px"
    fontWeight: 500
    lineHeight: 1.3
rounded:
  sm: "8px"
  md: "12px"
  lg: "20px"
  pill: "999px"
spacing:
  xs: "8px"
  sm: "16px"
  md: "24px"
  lg: "48px"
  xl: "96px"
components:
  button-primary:
    backgroundColor: "{colors.blue}"
    textColor: "{colors.paper}"
    rounded: "{rounded.sm}"
    padding: "0 24px"
    height: "44px"
  button-secondary:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.charcoal}"
    rounded: "{rounded.sm}"
    padding: "0 24px"
    height: "44px"
  order-option:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.charcoal}"
    rounded: "{rounded.md}"
    padding: "16px 24px"
  colour-swatch:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.charcoal}"
    rounded: "{rounded.pill}"
    height: "44px"
---

# Design

## Overview

A three-colour accent page: warm paper, charcoal and one electric blue. The lamp is huge in the hero, mirrored so its light bar reaches over the headline, bleeding off the right and bottom edges. Every ground carries a paper grain instead of a flat fill.

## Colors

- Exactly three page colours: `paper` (background), `charcoal` (text), `blue` (accent, hue 228°; the warm ground and photographs sit near 25°, so the gap is about 203°).
- Blue appears on two things only: the words "long days" in the hero headline, and the primary "Pre-order Aero" buttons. Focus rings, the logo mark, selected options, swatches and hover states use charcoal.
- Paper on blue is 5.15:1 (button labels); blue on paper is 5.15:1 (the headline words).
- Dark bands (Specifications, footer) swap the neutrals: charcoal ground, paper text.
- Lamp colourways (`lamp-*`) are the product's own colours, not page accents; the order card defaults to Graphite.
- Texture: an SVG fractal-noise grain (neutral grey with alpha) as `--grain` on the body, nav, every section and the footer.

## Typography

- Display and headings: Bricolage Grotesque 400, width 96%, tight tracking. Never bold.
- Text, labels and buttons: Figtree 400/500. Sentence case everywhere.
- Prices and spec values use tabular numerals.

## Layout

- 1280px wrap with 80px gutters (24px on phones), 12 columns, 24px gap; split line at column 7.
- Every section is exactly one or two screens; the hero fills the first screen alone.
- Phones: one column, specs two per row, full-width buttons.

## Shapes

Radius family "soft": 8px controls, 12px panels and options, 20px cards and photo frames; swatches are pills.

## Components

- **Product render:** `assets/objects/product-render/specs/aero.json`, stills in `assets/objects/product-render/specs/stills/`. Re-render with `node assets/objects/product-render/make-posters.mjs <spec> --profile <dir>`. Each section shows a different view or colour.
- **Order card:** three radio options (Aero $149, Aero Charge $199, Aero Pair $279) and three colour swatches that swap the render.
- **How it works (`#how`):** a track of three steps joined by a 1px charcoal line through numbered nodes (horizontal on desktop, down the left on phones). Step 1 a desk photo, step 2 a small HTML drawing of the Aero app's day schedule, step 3 the warm desk render. Entrance plays once: the line draws (0.9s), each step arrives as the line reaches it, then the app's time marker walks morning to evening, lighting each schedule row in turn.
- **Lights on (hero):** on the first visit of a session the page opens under a charcoal layer (94%) that fades out over 1s as Aero "switches on"; the headline rises line by line from SplitText masks, then the lead and buttons. A soft pool of light (a 560px radial of warm white) trails the pointer across the hero on fine pointers.
- **A day with Aero (`#day`):** a 164px clock, Kelvin and mode readout run 07:00 / 6,500 K / Daylight to 21:30 / 2,700 K / Warm while the clock crosses the middle of the screen; the desk render's room tint moves cool to warm (multiply layer) and the section's paper dims toward evening. No pinning.
- **Editorial reveals:** every section heading rises line by line from its masks (then the split is undone); photographs are uncovered by a top-to-bottom clip wipe; the Specifications band opens from an inset rounded card to full width as it scrolls in; pre-order buttons lean up to 8px toward the pointer.
- **Motion:** the hero enters once on load. Lenis (lerp 0.085, touch native) is driven by GSAP's ticker; in-page links glide 0.9s on an exponential ease-out, and a trip longer than 1.2 screens cuts to half a screen before the target and glides the rest; the page holds still while the phone menu is open. Each section reveals once (16px rise, 70ms stagger, power3.out, about 0.6s). Scrubbed depth: the hero lamp rises 9% and the headline fades as the hero scrolls out; the spec and order lamps bob up and down 16px (2.6s each way, sine) while fully on screen, pausing off screen; the benefit pictures settle from 1.06 scale. Nothing moves under `prefers-reduced-motion`.

## Do's and Don'ts

- Do show the lamp itself big; context photographs are CC0 stand-ins (see `credits.html`).
- Don't add a second accent colour, gradients, glass effects or flat untextured grounds.
- Don't present the specs, prices or quotes as real: Aero is a concept product, and the footer says so.
