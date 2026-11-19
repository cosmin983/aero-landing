/* Aero page script: Lenis smooth scroll synced with GSAP ScrollTrigger; the lights-on entrance and
   the cursor light in the hero; masked line reveals; the day readout; the specs band opening; photo
   wipes; magnetic pre-order buttons; and the order form's colour field. Everything is visible without
   this file; under prefers-reduced-motion nothing moves (Lenis turns its smoothing off on its own). */
(() => {
  const { gsap, ScrollTrigger, SplitText, Lenis } = window;
  const html = document.documentElement;
  const lights = document.querySelector('.lights');
  const lift = () => html.classList.remove('lights-pending');

  // the order form: the chosen swatch is sent with the form (auto.js swaps the picture and aria-pressed)
  const field = document.querySelector('[data-colour-field]');
  document.addEventListener('click', (e) => {
    const s = e.target.closest('.swatch');
    if (s && field) field.value = s.textContent.trim();
  });

  if (!gsap || !ScrollTrigger || !Lenis) { lift(); return; }
  gsap.registerPlugin(ScrollTrigger);
  if (SplitText) gsap.registerPlugin(SplitText);

  // a strong ease-out: fast start, long soft landing (close to cubic-bezier(0.23, 1, 0.32, 1))
  const easeOutExpo = (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));

  // Lenis on native scroll. A lower lerp gives the wheel a longer, softer glide; touch stays native.
  // Anchor links glide to their section with the same ease. GSAP's ticker drives it, so
  // ScrollTrigger and the photo-chapters moment read the same position every frame.
  const lenis = new Lenis({
    lerp: 0.085,
    wheelMultiplier: 0.95,
    smoothWheel: true,
    stopInertiaOnNavigate: true,
  });
  lenis.on('scroll', ScrollTrigger.update);

  // the phone menu is a full-screen sheet: hold the page still behind it
  const toggle = document.querySelector('.nav__toggle');
  if (toggle) {
    new MutationObserver(() => {
      toggle.getAttribute('aria-expanded') === 'true' ? lenis.stop() : lenis.start();
    }).observe(toggle, { attributes: true, attributeFilter: ['aria-expanded'] });
  }

  // in-page links: a short trip glides all the way; a long one cuts to half a screen before the
  // target and glides only that last stretch, so the page never races past the sections between
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href^="#"]');
    if (!link || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const hash = link.getAttribute('href');
    const target = hash.length > 1 && document.querySelector(hash);
    if (!target) return;
    e.preventDefault();
    const go = () => {
      lenis.start();
      const top = Math.round(target.getBoundingClientRect().top + window.scrollY);
      const dist = top - window.scrollY;
      const vh = window.innerHeight;
      if (reduce.matches) lenis.scrollTo(top, { immediate: true, force: true });
      else {
        if (Math.abs(dist) > 1.2 * vh) lenis.scrollTo(top - Math.sign(dist) * 0.5 * vh, { immediate: true, force: true });
        lenis.scrollTo(top, { duration: 0.9, easing: easeOutExpo, force: true });
      }
      if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
    };
    // from the phone menu: let the sheet close and the page settle first, then travel
    if (toggle && toggle.getAttribute('aria-expanded') === 'true') setTimeout(go, 80);
    else go();
  });
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
  window.__lenis = lenis;


  const ease = 'power3.out';
  const fine = window.matchMedia('(hover: hover) and (pointer: fine)');

  // masked line reveal: the heading's lines rise from behind their own masks, then the split is undone
  // so the heading reflows normally afterwards
  const lineReveal = (el, tl, at = 0) => {
    if (!SplitText || !el) { tl.from(el, { autoAlpha: 0, y: 16, duration: 0.6, ease }, at); return; }
    const split = SplitText.create(el, { type: 'lines', mask: 'lines', linesClass: 'split-line' });
    tl.from(split.lines, { yPercent: 110, duration: 0.95, ease: 'power4.out', stagger: 0.085 }, at);
    tl.call(() => split.revert(), null, '>');
  };

  const setup = () => {
  const mm = gsap.matchMedia();
  mm.add('(prefers-reduced-motion: no-preference)', () => {
    // LIGHTS ON: the first visit of a session opens dim; Aero switches the page on, then the headline
    // rises line by line and the lead and buttons follow
    const hero = document.querySelector('.hero--huge');
    if (hero) {
      const pending = html.classList.contains('lights-pending');
      const intro = gsap.timeline({ defaults: { ease } });
      if (pending && lights) {
        gsap.set(lights, { opacity: 0.94, visibility: 'visible' });
        lift();
        intro.to(lights, { opacity: 0, duration: 1.0, ease: 'power2.out' }, 0.3).set(lights, { visibility: 'hidden' });
      }
      const t0 = pending ? 0.5 : 0.05;
      lineReveal(hero.querySelector('h1'), intro, t0);
      intro.from([hero.querySelector('.hero__lead'), hero.querySelector('.btn-row')], { autoAlpha: 0, y: 14, duration: 0.7, stagger: 0.08 }, t0 + 0.35);
      intro.from(hero.querySelector('.hero__subject'), { autoAlpha: 0, y: 24, duration: 1.2, ease: 'power3.out' }, pending ? 0.3 : 0);

      // the lamp's light follows the pointer: a soft pool that trails it a little
      if (fine.matches) {
        const glow = hero.querySelector('.hero__glow');
        const t = { x: 0, y: 0 }, c = { x: 0, y: 0 };
        let on = false;
        hero.addEventListener('pointermove', (e) => {
          const r = hero.getBoundingClientRect();
          t.x = e.clientX - r.left; t.y = e.clientY - r.top;
          if (!on) { on = true; c.x = t.x; c.y = t.y; hero.classList.add('is-lit'); }
        });
        hero.addEventListener('pointerleave', () => hero.classList.remove('is-lit'));
        hero.addEventListener('pointerenter', () => on && hero.classList.add('is-lit'));
        gsap.ticker.add(() => {
          if (!on) return;
          c.x += (t.x - c.x) * 0.12; c.y += (t.y - c.y) * 0.12;
          glow.style.setProperty('--gx', c.x.toFixed(1) + 'px');
          glow.style.setProperty('--gy', c.y.toFixed(1) + 'px');
        });
      }

      // depth on the way out: the lamp rises, the headline eases away
      const lamp = hero.querySelector('.hero__subject');
      const head = hero.querySelector('.hero__head');
      const out = { trigger: hero, start: 'top top', end: 'bottom top', scrub: true };
      gsap.to(lamp, { yPercent: -9, ease: 'none', scrollTrigger: out });
      if (head) gsap.to(head, { y: -70, autoAlpha: 0.15, ease: 'none', scrollTrigger: { ...out, end: '80% top' } });
    }

    // one entrance per section: the heading's lines rise from their masks, the rest of the head and the
    // group follow with a short, uneven stagger
    document.querySelectorAll('main > section:not(.hero), footer.closing').forEach((section) => {
      const head = section.querySelector('[data-reveal]') || (section.matches('footer') ? section.querySelector('.closing__cta') : null);
      const group = section.querySelector('[data-reveal-group]');
      const items = group ? Array.from(group.children) : [];
      if (!head && !items.length) return;
      const tl = gsap.timeline({
        defaults: { ease },
        scrollTrigger: { trigger: section, start: 'top 78%', once: true },
      });
      if (head) {
        const h = head.querySelector('h2');
        lineReveal(h, tl, 0);
        const rest = Array.from(head.querySelectorAll(':scope > :not(h2), .section-head > :not(h2)')).filter((el) => el !== h && !el.contains(h));
        if (rest.length) tl.from(rest, { autoAlpha: 0, y: 12, duration: 0.6, stagger: 0.06 }, 0.25);
      }
      if (items.length) {
        // the floating lamps only fade in: their y belongs to the bob below
        tl.from(items, {
          autoAlpha: 0, y: (i, el) => (el.matches('#aero-spec, #aero-order') ? 0 : 12), duration: 0.6,
          stagger: { each: 0.07, ease: 'power1.in' },
        }, head ? 0.18 : 0);
      }
    });

    // photographs are uncovered by a clean wipe, top to bottom, the first time they arrive
    document.querySelectorAll('#benefits .panel:not(.panel--render), #reviews .frame--photo, .faq-frame, .day__scene').forEach((el) => {
      gsap.fromTo(el, { clipPath: 'inset(0% 0% 100% 0%)' }, {
        clipPath: 'inset(0% 0% 0% 0%)', duration: 1.15, ease: 'power3.inOut', clearProps: 'clipPath',
        scrollTrigger: { trigger: el, start: 'top 85%', once: true },
      });
    });

    // the specs band opens from an inset card to the full width as it scrolls in
    const specs = document.querySelector('#specs');
    if (specs) {
      gsap.fromTo(specs, { clipPath: 'inset(0% 3.5% 0% 3.5% round 28px)' }, {
        clipPath: 'inset(0% 0% 0% 0% round 0px)', ease: 'none',
        scrollTrigger: { trigger: specs, start: 'top bottom', end: 'top 25%', scrub: true },
      });
    }

    // A DAY WITH AERO: the readout runs from 07:00 / 6,500 K to 21:30 / 2,700 K as the section passes,
    // the room in the picture warms, and the section's paper dims toward evening
    const day = document.querySelector('#day');
    if (day) {
      const timeEl = day.querySelector('[data-day-time]');
      const kEl = day.querySelector('[data-day-k]');
      const modeEl = day.querySelector('[data-day-mode]');
      const marker = day.querySelector('[data-day-marker]');
      const tint = day.querySelector('[data-day-tint]');
      const lerp = gsap.utils.interpolate;
      const tintAt = (p) => (p < 0.5 ? lerp('#dfe7fb', '#f3f1ec', p / 0.5) : lerp('#f3f1ec', '#f2bf86', (p - 0.5) / 0.5));
      const paper = getComputedStyle(html).getPropertyValue('--paper').trim() || '#edeae4';
      const kAt = (p) => (p < 0.4 ? lerp(6500, 5000, p / 0.4) : p < 0.7 ? lerp(5000, 4000, (p - 0.4) / 0.3) : lerp(4000, 2700, (p - 0.7) / 0.3));
      const pad = (n) => String(n).padStart(2, '0');
      let last = -1;
      const paint = (p) => {
        const mins = Math.round((7 * 60 + p * 14.5 * 60) / 5) * 5;
        const k = Math.round(kAt(p) / 50) * 50;
        if (mins !== last) { timeEl.textContent = pad(Math.floor(mins / 60)) + ':' + pad(mins % 60); last = mins; }
        kEl.textContent = k.toLocaleString('en-US');
        modeEl.textContent = p < 0.4 ? 'Daylight' : p < 0.7 ? 'Focus' : 'Warm';
        marker.style.transform = `translateX(${(p * (marker.parentElement.offsetWidth - marker.offsetWidth)).toFixed(1)}px)`;
        tint.style.backgroundColor = tintAt(p);
        tint.style.opacity = (0.5 + 0.25 * Math.max(0, p - 0.6) / 0.4).toFixed(3);
        day.style.backgroundColor = lerp(paper, '#d9d5ce', Math.max(0, (p - 0.55) / 0.45));
      };
      paint(0);
      // the day runs while the clock itself crosses the middle of the screen, so it is always in view
      ScrollTrigger.create({ trigger: timeEl, start: 'top 80%', end: 'top 20%', onUpdate: (self) => paint(self.progress) });
    }

    // the spec and order lamps bob gently up and down (16px, 2.6s each way) while the whole lamp is
    // on screen; off screen the bob pauses where it is
    document.querySelectorAll('#aero-spec, #aero-order').forEach((frame) => {
      const bob = gsap.to(frame, { y: -16, duration: 2.6, ease: 'sine.inOut', yoyo: true, repeat: -1, paused: true });
      ScrollTrigger.create({
        trigger: frame, start: 'bottom bottom', end: 'top top',
        onToggle: (self) => (self.isActive ? bob.play() : bob.pause()),
      });
    });

    // how it works: the line draws left to right (top to bottom on a phone), each step arrives as the
    // line reaches it, then the app's time marker walks the day once, morning to evening
    const track = document.querySelector('[data-track]');
    if (track) {
      const steps = Array.from(track.querySelectorAll('.track__step'));
      const marker = track.querySelector('[data-app-marker]');
      const rows = Array.from(track.querySelectorAll('[data-app-row]'));
      const tl = gsap.timeline({ scrollTrigger: { trigger: track, start: 'top 80%', once: true } });
      tl.fromTo(track, { '--line': 0 }, { '--line': 1, duration: 0.9, ease: 'power2.inOut' }, 0.15);
      steps.forEach((step, i) => {
        const at = 0.15 + i * 0.36; // the line's arrival at each node
        tl.from(step.querySelector('.track__node'), { autoAlpha: 0, scale: 0.9, duration: 0.35, ease }, at);
        tl.from([step.querySelector('.track__body'), step.querySelector('.track__pic')],
          { autoAlpha: 0, y: 12, duration: 0.5, ease, stagger: 0.06 }, at + 0.06);
      });
      if (marker) {
        const bar = marker.parentElement;
        const light = (p) => rows.forEach((r, i) => r.classList.toggle('is-dim', i !== (p < 0.34 ? 0 : p < 0.7 ? 1 : 2)));
        tl.set(marker, { left: '8%' }, 0);
        tl.call(() => light(0), null, 0);
        tl.to(marker, {
          x: () => bar.offsetWidth * 0.64, duration: 1.6, ease: 'power2.inOut',
          onUpdate() { light(this.progress()); },
          onComplete() { rows.forEach((r) => r.classList.remove('is-dim')); },
        }, 0.15 + 0.36 + 0.6);
      }
    }

    // the benefit pictures settle from a slight zoom as they come into view
    document.querySelectorAll('#benefits .panel').forEach((panel) => {
      const pic = panel.querySelector('img, .frame');
      if (!pic) return;
      gsap.fromTo(pic, { scale: 1.06 }, {
        scale: 1, ease: 'none',
        scrollTrigger: { trigger: panel, start: 'top bottom', end: 'center 55%', scrub: true },
      });
    });

    // the pre-order buttons lean a few pixels toward the pointer, and settle back when it leaves
    if (fine.matches) {
      document.querySelectorAll('.btn--primary').forEach((btn) => {
        const t = { x: 0, y: 0 }, c = { x: 0, y: 0 };
        let live = false;
        const tick = () => {
          c.x += (t.x - c.x) * 0.18; c.y += (t.y - c.y) * 0.18;
          btn.style.translate = `${c.x.toFixed(2)}px ${c.y.toFixed(2)}px`;
          if (!t.x && !t.y && Math.abs(c.x) < 0.05 && Math.abs(c.y) < 0.05) { btn.style.translate = ''; gsap.ticker.remove(tick); live = false; }
        };
        btn.addEventListener('pointermove', (e) => {
          const r = btn.getBoundingClientRect();
          t.x = gsap.utils.clamp(-8, 8, (e.clientX - (r.left + r.width / 2)) * 0.2);
          t.y = gsap.utils.clamp(-5, 5, (e.clientY - (r.top + r.height / 2)) * 0.3);
          if (!live) { live = true; gsap.ticker.add(tick); }
        });
        btn.addEventListener('pointerleave', () => { t.x = 0; t.y = 0; });
      });
    }
  });
  };

  // lines are split once the fonts are in, so they break where the reader sees them break
  let started = false;
  const start = () => { if (started) return; started = true; setup(); ScrollTrigger.refresh(); };
  (document.fonts ? document.fonts.ready : Promise.resolve()).then(start);
  setTimeout(start, 1500);

  // fonts and renders change heights after load: measure again once they are in
  const refresh = () => ScrollTrigger.refresh();
  document.fonts?.ready.then(refresh);
  window.addEventListener('load', refresh, { once: true });
})();
