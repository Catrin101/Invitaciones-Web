/**
 * ScrollReveal.js — Gudino Dev Invitation Framework
 * Animaciones de revelado al hacer scroll usando IntersectionObserver
 * Pattern: Observer
 */

class ScrollReveal {
  constructor() {
    this._observer = null;
    this._observedElements = new Set();
  }

  /**
   * Obtiene instancia única
   */
  static getInstance() {
    if (!ScrollReveal._instance) {
      ScrollReveal._instance = new ScrollReveal();
    }
    return ScrollReveal._instance;
  }

  /**
   * Clases CSS utilizadas
   */
  _classes = {
    trigger: 'reveal-up',
    triggerFade: 'reveal-fade',
    active: 'is-visible',
    initial: 'reveal-initial',
  };

  /**
   * Opciones del IntersectionObserver
   */
  _observerOptions = {
    root: null,
    rootMargin: '0px 0px -60px 0px',
    threshold: 0.1,
  };

  /**
   * Callback cuando un elemento intersecta
   * @param {IntersectionObserverEntry[]} entries
   * @param {IntersectionObserver} observer
   */
  _onIntersect(entries, observer) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add(this._classes.active);
        observer.unobserve(entry.target); // Solo disparar una vez
        this._observedElements.delete(entry.target);
      }
    });
  }

  /**
   * Inicializa el observador de elementos
   * @param {Object} options - Opciones adicionales
   * @param {string} options.selector - Selector personalizado (default: '.reveal-up, .reveal-fade')
   * @param {Object} options.observerOptions - Opciones del IntersectionObserver
   */
  init(options = {}) {
    const {
      selector = `.${this._classes.trigger}, .${this._classes.triggerFade}`,
      observerOptions = this._observerOptions,
    } = options;

    // Crear observador
    this._observer = new IntersectionObserver(
      this._onIntersect.bind(this),
      observerOptions
    );

    // Seleccionar elementos
    const targets = document.querySelectorAll(selector);

    targets.forEach(el => {
      if (!this._observedElements.has(el)) {
        el.classList.add(this._classes.initial);
        this._observer.observe(el);
        this._observedElements.add(el);
      }
    });

    console.info(`[ScrollReveal] Observando ${targets.length} elementos ✓`);
  }

  /**
   * Observa un elemento específico
   * @param {Element} el - Elemento a observar
   */
  observe(el) {
    if (!this._observer) {
      console.warn('[ScrollReveal] Debes llamar a init() primero');
      return;
    }
    el.classList.add(this._classes.initial);
    this._observer.observe(el);
    this._observedElements.add(el);
  }

  /**
   * Deja de observar un elemento
   * @param {Element} el - Elemento
   */
  unobserve(el) {
    if (this._observer) {
      this._observer.unobserve(el);
      this._observedElements.delete(el);
    }
  }

  /**
   * Destruye el observador
   */
  destroy() {
    if (this._observer) {
      this._observer.disconnect();
      this._observer = null;
      this._observedElements.clear();
    }
  }
}

// Exportar instancia singleton
export default ScrollReveal.getInstance();
