/**
 * ChapterEngine.js — Gudino Dev Invitation Framework
 * Gestiona navegación entre capítulos con transiciones
 * Pattern: State Machine / Observer
 */

class ChapterEngine {
  constructor() {
    this._current = 0;
    this._total = 0;
    this._chapters = [];
    this._chaptersDef = [];
    this._busy = false;
    this._dom = {};
    this._onNavigate = null;
  }

  /**
   * Obtiene instancia única
   */
  static getInstance() {
    if (!ChapterEngine._instance) {
      ChapterEngine._instance = new ChapterEngine();
    }
    return ChapterEngine._instance;
  }

  /**
   * Aplica estilos inline para transición
   * @param {Element} el - Elemento
   * @param {Object} styles - Estilos a aplicar
   */
  _setStyle(el, styles) {
    Object.entries(styles).forEach(([prop, value]) => {
      if (value !== undefined) {
        el.style[prop] = value;
      }
    });
  }

  /**
   * Limpia estilos inline
   * @param {Element} el - Elemento
   */
  _clearStyle(el) {
    ['transition', 'opacity', 'transform', 'pointerEvents'].forEach(prop => {
      el.style[prop] = '';
    });
    el.style.zIndex = '0';
  }

  /**
   * Navega a un capítulo
   * @param {number} dir - Dirección (+1 o -1)
   */
  navigate(dir) {
    if (this._busy) return;

    const next = this._current + dir;
    if (next < 0 || next >= this._total) return;

    this._busy = true;

    const outEl = this._chapters[this._current];
    const inEl = this._chapters[next];

    // Actualizar clases
    outEl.classList.remove('active');
    inEl.classList.add('active');

    // Animación de salida
    this._setStyle(outEl, {
      transition: `opacity var(--anim-page) ease, transform var(--anim-page) cubic-bezier(.76,0,.24,1)`,
      opacity: '0',
      transform: dir > 0 ? 'translateX(-60px)' : 'translateX(60px)',
      pointerEvents: 'none',
      zIndex: '5',
    });

    // Posicionar elemento entrante
    this._setStyle(inEl, {
      transition: 'none',
      opacity: '0',
      transform: dir > 0 ? 'translateX(60px)' : 'translateX(-60px)',
      zIndex: '10',
      pointerEvents: 'all',
    });

    // Forzar reflow y animar entrada
    requestAnimationFrame(() => requestAnimationFrame(() => {
      this._setStyle(inEl, {
        transition: `opacity var(--anim-page) ease, transform var(--anim-page) cubic-bezier(.76,0,.24,1)`,
        opacity: '1',
        transform: 'translateX(0)',
      });
    }));

    const old = this._current;
    this._current = next;
    this._updateUI();

    // Callback de navegación
    if (this._onNavigate) {
      this._onNavigate({ from: old, to: next, chapter: this._chaptersDef[next] });
    }

    // Limpiar después de la animación
    setTimeout(() => {
      this._clearStyle(outEl);
      outEl.style.zIndex = '0';
      this._busy = false;
    }, 750);
  }

  /**
   * Salta directamente a un índice
   * @param {number} index - Índice de destino
   */
  jumpTo(index) {
    if (index === this._current) return;

    this._chapters.forEach((el, i) => {
      this._clearStyle(el);
      el.classList.toggle('active', i === index);
      el.style.opacity = i === index ? '1' : '0';
      el.style.pointerEvents = i === index ? 'all' : 'none';
      el.style.zIndex = i === index ? '10' : '5';
    });

    const old = this._current;
    this._current = index;
    this._updateUI();

    if (this._onNavigate) {
      this._onNavigate({ from: old, to: index, chapter: this._chaptersDef[index] });
    }
  }

  /**
   * Actualiza UI (dots, contador, botones)
   */
  _updateUI() {
    // Actualizar dots
    document.querySelectorAll('.nav-dot').forEach((dot, i) => {
      dot.classList.toggle('active', i === this._current);
    });

    // Actualizar contador
    if (this._dom.counter) {
      const pad = n => String(n).padStart(2, '0');
      this._dom.counter.textContent = `${pad(this._current + 1)} / ${pad(this._total)}`;
    }

    // Actualizar botones
    if (this._dom.btnPrev) {
      this._dom.btnPrev.disabled = this._current === 0;
    }
    if (this._dom.btnNext) {
      this._dom.btnNext.disabled = this._current === this._total - 1;
    }
  }

  /**
   * Construye navegación lateral (dots)
   * @param {string[]} labels - Etiquetas de capítulos
   */
  _buildSideNav(labels) {
    if (!this._dom.sideNav) return;

    this._dom.sideNav.innerHTML = '';

    labels.forEach((label, i) => {
      const btn = document.createElement('button');
      btn.className = 'nav-dot' + (i === 0 ? ' active' : '');
      btn.setAttribute('aria-label', label);
      btn.title = label;
      btn.addEventListener('click', () => {
        const dir = i - this._current;
        if (Math.abs(dir) > 1) {
          this.jumpTo(i);
        } else if (dir !== 0) {
          this.navigate(dir > 0 ? 1 : -1);
        }
      });
      this._dom.sideNav.appendChild(btn);
    });
  }

  /**
   * Inicializa el motor de capítulos
   * @param {Object} options
   * @param {Array} options.chapters - Definición de capítulos [{ id, label }]
   * @param {Element} options.stage - Contenedor del stage
   * @param {Function} options.onNavigate - Callback al navegar
   */
  init({ chapters, stage, onNavigate = null }) {
    this._chaptersDef = chapters;
    this._onNavigate = onNavigate;

    // Obtener elementos del DOM
    this._chapters = [...stage.querySelectorAll('.chapter')];
    this._total = this._chapters.length;

    // Referencias DOM
    this._dom = {
      sideNav: document.getElementById('side-nav'),
      counter: document.getElementById('chapter-counter'),
      btnPrev: document.getElementById('btn-prev'),
      btnNext: document.getElementById('btn-next'),
    };

    // Construir navegación
    this._buildSideNav(chapters.map(c => c.label));

    // Event listeners para botones
    this._dom.btnPrev?.addEventListener('click', () => this.navigate(-1));
    this._dom.btnNext?.addEventListener('click', () => this.navigate(1));

    // Teclado
    document.addEventListener('keydown', e => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') this.navigate(1);
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') this.navigate(-1);
    });

    // Swipe touch
    let startX = 0;
    stage.addEventListener('touchstart', e => {
      startX = e.touches[0].clientX;
    }, { passive: true });

    stage.addEventListener('touchend', e => {
      const dx = startX - e.changedTouches[0].clientX;
      if (Math.abs(dx) > 50) {
        this.navigate(dx > 0 ? 1 : -1);
      }
    });

    this._updateUI();
    console.info(`[ChapterEngine] Inicializado ✓ ${this._total} capítulos`);
  }

  /**
   * Obtiene el capítulo actual
   * @returns {Object}
   */
  getCurrentChapter() {
    return this._chaptersDef[this._current];
  }

  /**
   * Obtiene el índice actual
   * @returns {number}
   */
  getCurrentIndex() {
    return this._current;
  }

  /**
   * Obtiene el total de capítulos
   * @returns {number}
   */
  getTotal() {
    return this._total;
  }
}

// Exportar instancia singleton
export default ChapterEngine.getInstance();
