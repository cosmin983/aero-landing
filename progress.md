# Progress log

Everything done since this work started, in order. The site is live at https://aero-zeta-three.vercel.app, with its code at https://github.com/cosmin983/aero-landing.

---

## 1. Installing the skills

- Installed these into `~/.claude/skills/`, where they work in every project:
  - **impeccable** (pbakaus)
  - **taste-skill** (Leonxlnx)
  - **web-design-guidelines** (vercel-labs), on its own rather than the whole repo
  - **all 20 of Emil Kowalski's skills**, among them `animate`, `choreograph`, `emil-design-eng`, `animation-performance`, `apple-design`, `gestures`, `mobile-native`, `break-ui`, `improve-animations`, `find-animation-opportunities`, `remove-animations` and `animation-vocabulary`
  - **all 8 GSAP skills**: `gsap-core`, `gsap-timeline`, `gsap-scrolltrigger`, `gsap-plugins`, `gsap-utils`, `gsap-react`, `gsap-frameworks` and `gsap-performance`
- **UI/UX Pro Max** was already installed as a user-level plugin (v2.15.0), so it was left alone.
- **Lenis** is a JavaScript library, not a skill or plugin. It is installed per project with `npm i lenis`.
- Removed a stray `llms.txt` that came along with Emil's skills.

## 2. Writing a Lenis skill

Created `~/.claude/skills/lenis/SKILL.md` from Lenis 1.3.27's own documentation. It covers:
- when to add Lenis (landing pages, portfolios, scroll animation) and when not to (dashboards, docs);
- setups for plain HTML, a bundler, React/Next.js, React with GSAP, Framer Motion, and Vue/Nuxt;
- a gotchas checklist: modals, anchor links, reduced motion, never two smooth-scroll libraries.

## 3. Setting up the project

- Created `~/Desktop/websites/` and the project at `~/Desktop/websites/aero`.
- Loaded every installed skill in groups. Five of Emil's (`review-animations`, `pick-ui-library`, `prototype`, `ask-emil`, `learn-taste`) only run when the user types them.
- Settled who leads: taste-skill runs the build pipeline (layout picks, kit, browser checks); impeccable provides the product brief and quality floor; Emil's skills set the motion rules; GSAP and Lenis carry the motion; UI/UX Pro Max and the web guidelines handle UX review.
- **Product brief (Impeccable):** answered two questions, the buyer (remote and home-office workers) and pricing (about $149, $199 and $279), then wrote `PRODUCT.md`.

## 4. First build: the Aero landing page

- **Stack:** a static site (HTML, CSS, JavaScript) on taste-skill's kit, with no build step. GSAP 3.15 and Lenis 1.3.27 come from npm and are copied into `assets/vendor/`.
- **taste-skill picks:**
  - the product hero layout;
  - the steel-orange palette, later replaced (see section 8);
  - Bricolage Grotesque and Figtree fonts;
  - menu with picture cards, dark footer, a large closing button, one dark band, solid buttons, the "stack" logo mark;
  - a pinned "photo-chapters" moment, later removed (see section 10).
- **The product:** stock lamp photos showed a different lamp in every section, so I designed Aero as a consistent 3D render. It is an 11-part spec: round base with a dial and status ring, slim upright, hinge, flat light bar. It comes in three colours: Graphite, Chalk and Ember. Front and head close-up views were dropped because they rendered poorly.
- **Photos:** CC0 context photos from Wikimedia Commons (its mirrors of Unsplash images), converted to WebP and credited in `credits.html`.
- **Sections:**
  1. Hero
  2. Benefits (3 cards)
  3. How it works (3 steps)
  4. Specifications (dark band)
  5. Beta-tester quotes
  6. Prices and colours (a mailto order form with a colour picker that swaps the render)
  7. FAQ
  8. Footer
- **Copy:** every heading names the product, and the footer says plainly that Aero is a concept product and its specs, prices and quotes aren't real.
- **Checks:** ran taste-skill's gate (three rounds), its layout, performance and copy checks, Impeccable's detector, and Vercel's web interface guidelines. Fixed the problems they found: heading wording, hero overflow, contrast, image sizes, spacing on phones, lazy loading. The user-driven exceptions are recorded in `.taste-skill/waivers.json`.
- **Cleanup:** cut 28MB of unused kit files.

## 5. Publishing

- Created the public GitHub repo `cosmin983/aero-landing` and pushed.
- Deployed to Vercel at https://aero-zeta-three.vercel.app. `vercel.json` serves the folder as-is; `.vercelignore` leaves out dev files.
- Vercel is not connected to GitHub. Redeploy with `vercel deploy --prod`, or run `vercel git connect` once.

## 6. Impeccable doctor and the design hook

- Fixed a wrong path in `DESIGN.md` and rewrote it in the standard DESIGN.md format.
- Turned on Impeccable's design hook for the project.
- Skipped doctor's suggestion to compact `DESIGN.md`: it would have deleted most of the notes to save very little.
- **Triaging hook findings:**
  - Deleted unused kit demo pages: `assets/effects/lab.html`, `assets/effects/gallery.html` and `assets/starter.html`.
  - Recorded narrow ignores, with reasons, in `.impeccable/config.json` for kit CSS this page never renders and for intentional hairline rows.

## 7. Three-colour accent palette (the user's `three-color-accent` skill)

- **New palette:** paper `#edeae4`, charcoal `#1c1c1e`, electric blue `#2b4fe8`. The blue's hue is 228°, about 203° from the warm ground and photos at around 25°.
- **Blue only on:** "long days" in the headline and the "Pre-order Aero" buttons. Everything else that used the old accent now uses charcoal.
- **Huge subject:** re-rendered the side view at 1600px. The lamp is mirrored, about 96% of the screen height, reaches over the headline and bleeds off the bottom and right edges.
- **Texture:** a paper-grain noise on every background, the dark band and footer included.
- The order picker now defaults to Graphite so the orange colourway doesn't compete with the blue button.

## 8. Smoother motion with the Lenis skill

- Tuned Lenis (`lerp` 0.085) and drove it from GSAP's ticker; touch scrolling stays native.
- Paused Lenis while the phone menu is open.
- **First scroll-linked depth:**
  - the hero lamp rises and the headline fades as you scroll out;
  - the benefit pictures settle from a slight zoom;
  - the spec and pricing lamps drift (replaced later, see section 11).
- Fixed the hero lamp losing its mirror once GSAP animated it: the mirror moved to the CSS `scale` property.

## 9. Removing the scroll-holding section

- **The user's complaint:** "How Aero works" pinned the page while three photos wiped over each other. Scrolling stopped, and menu jumps from Setup to Specs flashed through all three images.
- **Fix:** removed the pinned moment and made the section a plain list of three steps.
- **Menu links now cut, then glide:** short trips glide 0.9s; trips longer than 1.2 screens cut to half a screen before the target and glide the rest.
- **Phone menu links** wait for the sheet to close before travelling. Before, they stopped about 150px short.

## 10. Space under the specs and a slower float

- Specifications now leaves at least 120px (96px on phones) under the last row and grows past one screen instead of cramping. Spec rows were tightened.
- The floating lamps wait until they're fully on screen before moving.
- The section fade-in no longer moves the floating lamps, which caused a 12px jump.

## 11. Up-and-down float and a new "How it works"

- **Float:** the spec and pricing lamps now bob 16px up and down, 2.6s each way. It plays only while the whole lamp is visible and pauses off screen.
- **How it works,** rebuilt with UI/UX Pro Max ("show, don't tell") and Emil's `choreograph` and `animate`:
  - a track of three numbered steps joined by a line;
  - step 2 shows a small HTML drawing of the Aero app's day schedule;
  - the line draws once and each step arrives as the line reaches it;
  - the app's time marker then walks from morning to evening, lighting each row.
- **Phones:** a vertical line, ending at the last step. The cut-off app drawing was fixed.

## 12. "More than premium" (Impeccable `overdrive`, the user picked "Lights on + editorial cinema")

- **Lights on:** on the first visit of a session the page opens dark and Aero "switches it on" while the headline rises line by line. The dim layer covers the menu bar too.
- **Cursor lamp-light:** a soft pool of light trails the pointer across the hero (mouse and trackpad only).
- **New section, "A day with Aero":**
  - a huge clock, Kelvin and mode readout runs 07:00 / 6,500 K / Daylight → 21:30 / 2,700 K / Warm;
  - it runs while the clock crosses the middle of the screen, with no pinning;
  - the room in the desk render warms and the section dims toward evening;
  - phones and tablets show the picture above the clock.
- **Editorial reveals:** headings rise from line masks (GSAP SplitText, now vendored), photos are uncovered by wipes, the Specs band opens from an inset rounded card to full width, and the pre-order buttons lean toward the pointer.
- **Tablets** got the vertical step track, with each step's words beside its picture.
- **Fixed:** a stylesheet ordering bug that had stopped some tablet and phone rules from applying; the day bar marker poking out of its column; a step photo too small on tablets.
- **Results:** no long tasks, 0ms blocking time, layout shift 0, no errors, nothing left hidden. Everything turns off under reduced motion.

## 13. Documentation

- `PREMIUM-PLAYBOOK.md`: the full "more than premium" playbook, covering preferences, the visual system, every effect with its values, the process, the bugs, and a checklist.
- A memory note at `~/.claude/projects/-Users-cosminpascale/memory/premium-landing-playbook.md`, indexed in `MEMORY.md`, so future sessions find the playbook.
- `DESIGN.md` is kept up to date with every change; `PRODUCT.md` holds the product brief.
- This file.

---

## Files at a glance

| File | What it is |
|---|---|
| `index.html` | The page: markup and page CSS |
| `assets/app.js` | All motion: Lenis, ScrollTrigger, SplitText effects, the day readout, the order colour field |
| `assets/vendor/` | GSAP, ScrollTrigger, SplitText, Lenis (`npm run vendor` refreshes them) |
| `assets/objects/product-render/specs/aero.json` | The Aero 3D spec; its stills are in `specs/stills/` |
| `assets/img/` | The stock photos (WebP) |
| `credits.html` | Photo credits |
| `PRODUCT.md`, `DESIGN.md` | The product brief and design system |
| `PREMIUM-PLAYBOOK.md` | How the site became "more than premium" |
| `.taste-skill/waivers.json` | Deliberate exceptions to taste-skill's checks |
| `.impeccable/config.json` | Impeccable's design hook settings and recorded ignores |
| `vercel.json`, `.vercelignore` | Static deploy settings |

## Open notes

- Vercel isn't linked to GitHub, so changes need `vercel deploy --prod`.
- The context photos are stand-ins. A real product would need its own photography.
- Everything is waived on purpose; nothing is broken. taste-skill's checker still flags: the hero lamp bleeding past the page edges, the scroll animations, the concept-product note, and the bordered pricing options.
