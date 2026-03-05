/**
 * ScrollReveal — Gudino Dev Invitation Framework
 * Uses IntersectionObserver to trigger CSS reveal animations
 * when elements enter the viewport.
 *
 * Usage: Add class "reveal-up" (or "reveal-fade") to any element.
 * Pattern: Observer
 */

const ScrollReveal = (() => {

  const CLASSES = {
    trigger: 'reveal-up',    // Elements to watch
    trigger2: 'reveal-fade',
    active: 'is-visible',   // Class added when in view
  };

  const OBSERVER_OPTIONS = {
    root: null,   // Viewport
    rootMargin: '0px 0px -20px 0px',
    threshold: 0.1,
  };

  function _onIntersect(entries, observer) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add(CLASSES.active);
        observer.unobserve(entry.target); // Fire once only
      }
    });
  }

  return {
    /**
     * init() — Attaches observer to all reveal-* elements.
     * Call after all sections have been rendered.
     */
    init() {
      const observer = new IntersectionObserver(_onIntersect, OBSERVER_OPTIONS);
      const targets = document.querySelectorAll(`.${CLASSES.trigger}, .${CLASSES.trigger2}`);

      targets.forEach(el => {
        el.classList.add('reveal-initial'); // Set initial hidden state via CSS
        observer.observe(el);
      });

      console.info(`[ScrollReveal] Observing ${targets.length} elements ✓`);
    },
  };
})();

export default ScrollReveal;
