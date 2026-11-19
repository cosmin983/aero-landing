/* Aero page script: smooth scroll (Lenis) synced with GSAP ScrollTrigger, one quiet reveal per
   section as it enters, and the order form's colour field. Everything is visible without this file;
   under prefers-reduced-motion nothing moves (Lenis turns its smoothing off on its own). */
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

  // Lenis on native scroll, driven by GSAP's ticker so ScrollTrigger and the photo-chapters moment stay in step
  const lenis = new Lenis({ anchors: true, stopInertiaOnNavigate: true });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
  window.__lenis = lenis;

  // one entrance per section: the heading leads, its group follows with a short, uneven stagger
  const ease = 'power3.out'; // close to cubic-bezier(0.23, 1, 0.32, 1)
  const mm = gsap.matchMedia();
  mm.add('(prefers-reduced-motion: no-preference)', () => {
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
  });

  // fonts and renders change heights after load: measure again once they are in
  const refresh = () => ScrollTrigger.refresh();
  document.fonts?.ready.then(refresh);
  window.addEventListener('load', refresh, { once: true });
})();
