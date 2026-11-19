/* Aero page script: Lenis smooth scroll synced with GSAP ScrollTrigger, one reveal per section,
   a few scroll-linked depth moves, and the order form's colour field. Everything is visible without
   this file; under prefers-reduced-motion nothing moves (Lenis turns its smoothing off on its own). */
(() => {
  const { gsap, ScrollTrigger, Lenis } = window;

  // the order form: the chosen swatch is sent with the form (auto.js swaps the picture and aria-pressed)
  const field = document.querySelector('[data-colour-field]');
  document.addEventListener('click', (e) => {
    const s = e.target.closest('.swatch');
    if (s && field) field.value = s.textContent.trim();
  });

  if (!gsap || !ScrollTrigger || !Lenis) return;
  gsap.registerPlugin(ScrollTrigger);

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
  const mm = gsap.matchMedia();
  mm.add('(prefers-reduced-motion: no-preference)', () => {
    // one entrance per section: the heading leads, its group follows with a short, uneven stagger
    document.querySelectorAll('main > section:not(.hero):not([data-moment])').forEach((section) => {
      const head = section.querySelector('[data-reveal]');
      const group = section.querySelector('[data-reveal-group]');
      const items = group ? Array.from(group.children) : [];
      if (!head && !items.length) return;
      const tl = gsap.timeline({
        defaults: { ease },
        scrollTrigger: { trigger: section, start: 'top 78%', once: true },
      });
      if (head) tl.from(head, { autoAlpha: 0, y: 16, duration: 0.6 }, 0);
      if (items.length) {
        tl.from(items, {
          autoAlpha: 0, y: 12, duration: 0.55,
          stagger: { each: 0.07, ease: 'power1.in' },
        }, head ? 0.08 : 0);
      }
    });

    // depth on scroll, scrubbed to the smoothed position (Lenis already eases it, so scrub: true)
    const hero = document.querySelector('.hero--huge');
    const lamp = hero?.querySelector('.hero__subject');
    const head = hero?.querySelector('.hero__head');
    if (hero && lamp) {
      // the mirror lives in the CSS `scale` property, so GSAP's transform never undoes it
      const out = { trigger: hero, start: 'top top', end: 'bottom top', scrub: true };
      gsap.to(lamp, { yPercent: -9, ease: 'none', scrollTrigger: out });
      if (head) gsap.to(head, { y: -70, autoAlpha: 0.15, ease: 'none', scrollTrigger: { ...out, end: '80% top' } });
    }

    // the spec and order lamps drift a little slower than the page
    document.querySelectorAll('#aero-spec, #aero-order').forEach((frame) => {
      gsap.fromTo(frame, { y: 36 }, {
        y: -36, ease: 'none',
        scrollTrigger: { trigger: frame, start: 'top bottom', end: 'bottom top', scrub: true },
      });
    });

    // the benefit pictures settle from a slight zoom as they come into view
    document.querySelectorAll('#benefits .panel').forEach((panel) => {
      const pic = panel.querySelector('img, .frame');
      if (!pic) return;
      gsap.fromTo(pic, { scale: 1.06 }, {
        scale: 1, ease: 'none',
        scrollTrigger: { trigger: panel, start: 'top bottom', end: 'center 55%', scrub: true },
      });
    });
  });

  // fonts and renders change heights after load: measure again once they are in
  const refresh = () => ScrollTrigger.refresh();
  document.fonts?.ready.then(refresh);
  window.addEventListener('load', refresh, { once: true });
})();
