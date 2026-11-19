---
name: Aero
description: Landing page for Aero, a smart desk lamp that follows the time of day
colors:
  ground: "#eeeeeb"
  surface: "#e1e1dd"
  ink: "#1c1d1f"
  muted: "#5c5e62"
  ember: "#c2501b"
  ember-ink: "#ffffff"
  inverse-ground: "#1c1d1f"
  inverse-surface: "#28292b"
  inverse-ink: "#eeeeeb"
  inverse-muted: "#969796"
  lamp-graphite: "#2b2c2f"
  lamp-chalk: "#dcd9d2"
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
    backgroundColor: "{colors.ember}"
    textColor: "{colors.ember-ink}"
    rounded: "{rounded.sm}"
    padding: "0 24px"
    height: "44px"
  button-secondary:
    backgroundColor: "{colors.ground}"
    textColor: "{colors.ink}"
    rounded: "{rounded.sm}"
    padding: "0 24px"
    height: "44px"
  order-option:
    backgroundColor: "{colors.ground}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "16px 24px"
  colour-swatch:
    backgroundColor: "{colors.ground}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    height: "44px"
---

# Design

## Overview

A calm, product-first landing page. Stone ground, near-black ink, and one ember accent that stands for the warm evening light Aero turns to. Every section shows the lamp or a desk it lives on, one section per screen at 1440x900.

## Colors

- 90 to 95% neutral: `ground`, `surface`, `ink`, `muted`.
- `ember` is the only accent: the primary button, the focus ring, the selected order option and the Ember colourway. Never as a background band.
- One dark band (`inverse-*`): the Specifications section, plus the footer.
- Lamp colourways: Graphite (`lamp-graphite`), Chalk (`lamp-chalk`), Ember (`ember`).

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
- **Photo-chapters (`#how`):** the pinned three-step setup story.
- **Motion:** the hero enters once on load; Lenis smooth scroll is driven by GSAP's ticker; each other section reveals once (16px rise, 70ms stagger, power3.out, about 0.6s). Nothing moves under `prefers-reduced-motion`.

## Do's and Don'ts

- Do show the lamp itself big; context photographs are CC0 stand-ins (see `credits.html`).
- Don't add a second accent colour, gradients, or glass effects.
- Don't present the specs, prices or quotes as real: Aero is a concept product, and the footer says so.
