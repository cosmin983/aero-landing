# The "more than premium" playbook

Everything that took the Aero landing page from a good template to something that feels "more than premium": the design decisions, every effect with its exact values, the code patterns, and the mistakes made along the way. Use it as the starting point for the next landing page.

Live example: https://aero-zeta-three.vercel.app · Code: https://github.com/cosmin983/aero-landing · Main files: `index.html` (markup and page CSS), `assets/app.js` (all motion).

---

## 1. What the user liked, and what they rejected

**Liked:**
- Smooth, slow, clearly visible motion, especially a slow up-and-down float.
- The page acting out what the product does (the lamp switching the page on, a day running from morning to evening).
- One strong accent colour used rarely, with a huge product in the hero.
- Sharp editorial typography in motion: headlines rising line by line.

**Rejected:**
- **Pinned or scroll-holding sections.** A section that stops the page while images wipe over each other felt broken, and nav jumps through it flashed. Never pin; scrub without holding instead.
- **Motion that is too fast or too small to notice.** A 24px drift over a screen read as nothing; a 16px bob over 2.6s each way was right.
- **Motion that starts before the thing is fully on screen.** Hold still until the whole object is visible, then move.
- **Plain step lists.** "How it works" has to show the steps, not just list them.
- **Cramped space before a section change.** At least 120px (96px on phones) of breathing room under the last item before a new ground.

---

## 2. The visual system

### Three-colour accent (from the user's `three-color-accent` skill)
- **Two neutrals plus one accent, nothing else:** paper `#edeae4` (background), charcoal `#1c1c1e` (text), electric blue `#2b4fe8` (accent).
- **Pick the accent at least 120° from the dominant hue.** The warm paper and desk photos sit near 25°; blue is 228°, about 203° away. State both angles.
- **The accent appears on one or two things only:** two words in the hero headline ("long days") and the primary "Pre-order" buttons. Focus rings, the logo mark, selected options, swatches and hover states use charcoal.
- **Check contrast:** paper on blue is 5.15:1 (button labels pass 4.5:1); blue on paper is 5.15:1.
- **Dark bands swap the neutrals** (charcoal ground, paper text). Muted text and surfaces are mixes of the two neutrals (`color-mix`), never new hues.
- **The product's own colourways are not page accents** (Graphite, Chalk, Ember). Default the order picker to the neutral one so it doesn't compete with the blue CTA.

### Physical texture instead of flat fills
A fractal-noise grain as an SVG data URI, applied to every ground (body, nav, each section, footer):

```css
--grain: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 .45 0 0 0 0 .44 0 0 0 0 .42 0 0 0 .55 -.12'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23g)'/%3E%3C/svg%3E");
body, .nav, main > section:is(.section, .hero), footer.closing { background-image: var(--grain); background-size: 180px 180px; }
```

The selector needs class-level specificity (`main > section:is(.section, .hero)`), or a kit rule such as `.ground-inverse { background: ... }` resets the image and the dark band goes flat.

### Huge subject
- The product render is about 96% of the viewport height, mirrored so its light bar reaches over the headline, bleeding off the bottom (and the right on phones).
- Desktop: `height: 96svh; right: -4.8vw; bottom: -9.5svh`. Tablet: `56svh`. Phone: `44svh; right: -24vw`.
- Put the mirror in the CSS `scale: -1 1` property, never in `transform`. GSAP owns `transform`; a `transform: scaleX(-1)` gets lost the moment GSAP animates the element.
- The headline is huge too (`clamp(44px, 7.2vw, 108px)`, line height .98, tracking -0.04em), with buttons in a row on desktop.

### Product imagery for a product that doesn't exist
- Don't use stock photos of other makers' lamps: the product changes shape in every section. Build one consistent render instead (taste-skill's `product-render`, an 11-part JSON spec at `assets/objects/product-render/specs/aero.json`).
- Use stock photos only for context (desks, phones), CC0 from Wikimedia Commons (search "… (Unsplash)" for the CC0 Unsplash mirrors).
- Render stills at `--px 1600` at most. `2200` came out broken: cropped and tiled by the software renderer.

---

## 3. The motion stack

- **Lenis 1.3** smooth scroll, **GSAP 3** with **ScrollTrigger** and **SplitText**, all installed from npm and vendored into `assets/vendor/` (`npm run vendor` copies them). No build step.
- **Lenis is driven by GSAP's ticker,** so every scroll effect reads the same smoothed position:

```js
const lenis = new Lenis({ lerp: 0.085, wheelMultiplier: 0.95, smoothWheel: true, stopInertiaOnNavigate: true });
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => lenis.raf(time * 1000));
gsap.ticker.lagSmoothing(0);
```

- **Touch stays native** (Lenis default); only the wheel and trackpad are smoothed.
- **Everything decorative lives inside** `gsap.matchMedia().add('(prefers-reduced-motion: no-preference)', …)`. Content is visible without JavaScript; nothing is hidden by CSS waiting for a script.
- **Split headlines only after fonts load** (`document.fonts.ready`, plus a 1.5s fallback) so lines break where the reader sees them.
- **Ease vocabulary** (Emil Kowalski's rules): `power3.out` for entrances, `power4.out` for line reveals, `power2.inOut` / `power3.inOut` for things moving on screen and wipes, `sine.inOut` for the idle float, `none` for scrubbed motion (Lenis already smooths it). A custom exponential ease-out for anchor glides: `t => t === 1 ? 1 : 1 - Math.pow(2, -10 * t)`.

---

## 4. Every effect, with its values

### 4.1 Lights on (hero entrance, once per session)
- **Idea:** the page behaves like the lamp. It opens dark, then Aero "switches on".
- **Before first paint,** an inline script adds `html.lights-pending` only if reduced motion is off and `sessionStorage` has no `aero-lit` flag; it sets the flag, and a 2.6s safety timeout always lifts the class.
- **Markup:** a fixed `.lights` layer, charcoal at 94% opacity, `z-index: 1000` so it also covers the nav bar (at 30 it didn't).
- **Timeline:** hold dark 0.3s → fade the layer out over 1.0s (`power2.out`) → the headline rises line by line from SplitText masks at 0.5s → lead and buttons follow at +0.35s (y 14, 0.7s, 0.08 stagger) → the lamp settles in (y 24, 1.2s).
- **Repeat visits** in the same session skip the dark and play only the quick headline reveal (Emil's frequency rule: delight for first-time moments only).
- **Remove the kit's own `data-enter`** from the hero so two entrances don't fight.

### 4.2 Cursor lamp-light (hero, fine pointers only)
- A `.hero__glow` layer: `radial-gradient(560px circle at var(--gx) var(--gy), rgb(255 253 248 / .85), transparent 62%)`, fading in on the first pointer move.
- The position trails the pointer with a lerp in GSAP's ticker (`current += (target - current) * 0.12`), writing CSS variables on the glow element itself.
- Gate it behind `(hover: hover) and (pointer: fine)`.
- Give the hero ground a hair darker than paper (`color-mix(paper 97%, charcoal)`) so the light pool reads.

### 4.3 Hero scroll-out depth
Scrubbed between hero top and bottom: the lamp rises 9% (`yPercent: -9`); the headline block rises 70px and fades to 0.15 by 80% of the way.

### 4.4 "A day with Aero" (the signature section)
- **Shows the product's mechanism.** Left: heading, a 164px clock, Kelvin and mode readout, a day bar with marker. Right: the desk render with a `mix-blend-mode: multiply` tint layer.
- **No pin:** a `ScrollTrigger` on the clock element itself, `start: 'top 80%', end: 'top 20%'`. The day runs while the numbers are in clear view. (First tried the whole section's range: the day finished before the clock was even visible.)
- **Mapping for progress p (0–1):**
  - Time: 07:00 + p × 14.5h, rounded to 5 minutes.
  - Kelvin: 6,500 → 5,000 (to p .4) → 4,000 (to .7) → 2,700, rounded to 50.
  - Mode: Daylight / Focus / Warm at p .4 and .7.
  - Tint: `#dfe7fb` (cool) → `#f3f1ec` (neutral) → `#f2bf86` (warm), opacity 0.5 → 0.75.
  - The section paper dims to `#d9d5ce` after p .55.
- **Marker range** is `bar width − marker width`, so it never pokes out of the column.
- **Phones and tablets:** make the copy column `display: contents` and reorder (heading, picture, clock, line) so the picture and the clock are on screen together.

### 4.5 Masked line reveals on every section heading
`SplitText.create(h2, { type: 'lines', mask: 'lines' })` → `from(lines, { yPercent: 110, duration: 0.95, ease: 'power4.out', stagger: 0.085 })` → `split.revert()` when done, so headings reflow normally on resize. Then the rest of the head and the content group follow (y 12, 0.6s, uneven stagger `{ each: 0.07, ease: 'power1.in' }`). One entrance per section, triggered at `top 78%`, `once: true`.

### 4.6 Photo wipes
Photographs are uncovered top to bottom the first time they appear: `clipPath: inset(0 0 100% 0)` → `inset(0 0 0% 0)`, 1.15s, `power3.inOut`, `clearProps`, trigger `top 85%`, once.

### 4.7 The dark band opens
The Specifications section starts as an inset rounded card and grows to full width as it scrolls in: `clipPath: inset(0% 3.5% 0% 3.5% round 28px)` → `inset(0% 0% 0% 0% round 0px)`, scrubbed from `top bottom` to `top 25%`.

### 4.8 Floating lamps (idle bob)
- `gsap.to(frame, { y: -16, duration: 2.6, ease: 'sine.inOut', yoyo: true, repeat: -1, paused: true })`.
- Plays only while the whole lamp is on screen (`ScrollTrigger` `start: 'bottom bottom', end: 'top top'`, `onToggle` play/pause).
- **The section reveal must not tween `y` on the same element** (it fades it only), or the two fight and the lamp jumps.

### 4.9 How it works: a drawn step track
- **Shows, doesn't list.** Three numbered nodes on a 1px charcoal line. Step 1 is a desk photo; step 2 is a small HTML drawing of the app's day schedule (switch, day bar, three rows); step 3 is the warm desk render.
- **Choreography (once):** the line draws (CSS variable `--line` 0→1 on `scaleX`, 0.9s `power2.inOut`); each node pops in as the line reaches it (every 0.36s, scale 0.9→1); each step's text and picture rise 12px. Then the app's time marker walks morning to evening over 1.6s, lighting each schedule row in turn (the others dim to 45%).
- **Phones and tablets:** the line runs down the left as one segment per step, ending at the last node. Tablets put each step's words beside its picture.

### 4.10 Magnetic pre-order buttons
- On fine pointers, the button leans toward the pointer: up to ±8px horizontally and ±5px vertically, lerped at 0.18 per frame.
- Written to the CSS `translate` property, so the kit's own `transform` hover and press effects still work.
- The ticker callback removes itself once the button has settled.

### 4.11 Scroll and navigation
- **In-page links:** a trip up to 1.2 screens glides 0.9s; a longer one cuts to half a screen before the target, then glides the rest. The page never races past the sections in between. Focus moves to the target section (`tabindex="-1"`, `preventScroll`).
- **Phone menu:** `lenis.stop()` while the sheet is open (watch `aria-expanded` with a `MutationObserver`). A link tapped in the sheet waits 80ms for the sheet to close, then travels; without the wait it stopped about 150px short.

---

## 5. Process that worked

1. **Load the skills, then decide.** Impeccable `overdrive` insists on proposing 2–3 directions and asking before building. The chosen one was "Lights on + editorial cinema": product-true motion plus sharp typography, no 3D (a live WebGL lamp was offered and declined because it stutters on weaker devices).
2. **Choreograph on paper first** (Emil's `choreograph`): give each element a role (lead, support, decoration), a start time and a motion, before writing code.
3. **Verify in a real browser, not from code.** A headless Chrome driven over the DevTools protocol (`--remote-debugging-port`, Node's built-in `WebSocket`):
   - capture frames at set times (0.15s, 0.7s, 2s) to judge entrances;
   - sample values over time (the bob's `y` every 0.5s, the wheel glide's `scrollY` every 80ms, the day readout at three scroll positions);
   - after scrolling the whole page, assert that nothing is left hidden and no split lines remain;
   - collect `Runtime.exceptionThrown`.
4. **Use a fresh Chrome profile for each test run,** or cached HTML and CSS give false results.
5. **Run taste-skill's checks** (`consistency.mjs --quick --widths 1440,820,768,390`, `perf.mjs`) after every batch. The exceptions the user chose (the hero lamp bleeding past the edges, scroll animations, the concept-product note, the bordered pricing options) are recorded in `.taste-skill/waivers.json`.

---

## 6. Bugs worth remembering

| Symptom | Cause | Fix |
|---|---|---|
| Phone and tablet rules did nothing | The media queries sat above the base rules in the stylesheet, so the later base rules won | Put responsive blocks after the rules they override |
| The hero lamp lost its mirror when it started moving | GSAP replaced the `transform` holding `scaleX(-1)` | Mirror with the CSS `scale` property |
| The float lamp jumped 12px on phones | The section fade-in and the float both tweened `y` | The fade-in only fades floating elements |
| The dark band showed no grain | `.ground-inverse { background: … }` reset the image | Higher-specificity grain selector |
| The dim layer left the nav bright | `z-index` 30 was below the nav | `z-index: 1000` |
| Nav jumps flashed through a pinned section | Pinning (scroll holding) | Removed the pin; cut-then-glide for long jumps |
| The `npm init` package broke the kit's ES modules | `"type": "commonjs"` | Set `"type": "module"` |
| Wikimedia downloads failed | HTTP 429 rate limit | Wait about 25s and retry; ask for `?width=1920` |
| `#how` left an empty gap on tablets | The section `min-height` was 100svh and the content was shorter | `min-height: 0` below 1024px, with the vertical track |

---

## 7. Checklist for the next page

- [ ] Two neutrals plus one accent at least 120° away, used on one or two things only; contrast checked.
- [ ] Grain texture on every ground, dark bands included.
- [ ] The product huge in the hero, bleeding past an edge; mirror with CSS `scale`, not `transform`.
- [ ] One first-visit "product moment" entrance (once per session, under 1.5s, never under reduced motion).
- [ ] One signature section that acts out what the product does, scrubbed, never pinned.
- [ ] Masked line reveals on headings (split after fonts load, revert afterwards).
- [ ] Photo wipes, one dark band that opens, magnetic primary buttons on fine pointers.
- [ ] Idle motion slow and visible (about 16px, about 2.6s each way), only while fully on screen.
- [ ] Lenis on GSAP's ticker; cut-then-glide anchors; Lenis stopped while the phone menu is open.
- [ ] At least 120px of space before every ground change (96px on phones).
- [ ] Responsive rules after base rules; test 1440, 1280, 820, 768, 390 and 320.
- [ ] Headless-Chrome frame captures and value sampling; no errors; nothing left hidden.
- [ ] Everything inside `prefers-reduced-motion: no-preference`; the page reads fine with JavaScript off.
