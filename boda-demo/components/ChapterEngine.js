/**
 * ChapterEngine — Gudino Dev Invitation Framework (Boda)
 * Gestiona la navegación entre capítulos con transiciones cinematográficas.
 * Soporta: flechas, teclado (←→), swipe touch y dots laterales.
 * Pattern: State Machine / Observer
 */

const ChapterEngine = (() => {

  let _current = 0;
  let _total = 0;
  let _chapters = [];
  let _busy = false;

  // ── DOM refs (se asignan en init) ───────────────────────
  let _sideNav, _counter, _btnPrev, _btnNext;

  /**
   * _setStyle — aplica estilos inline para la transición saliente/entrante.
   */
  function _setStyle(el, { opacity, transform, transition, zIndex, pointerEvents }) {
    if (transition !== undefined) el.style.transition = transition;
    if (opacity !== undefined) el.style.opacity = opacity;
    if (transform !== undefined) el.style.transform = transform;
    if (zIndex !== undefined) el.style.zIndex = zIndex;
    if (pointerEvents !== undefined) el.style.pointerEvents = pointerEvents;
  }

  function _clearStyle(el) {
    ['transition', 'opacity', 'transform', 'pointerEvents'].forEach(p => el.style[p] = '');
    el.style.zIndex = '0'; // siempre bajar al limpiar
  }

  /**
   * navigate(dir) — mueve +1 o -1 capítulo con transición.
   */
  function navigate(dir) {
    if (_busy) return;
    const next = _current + dir;
    if (next < 0 || next >= _total) return;

    _busy = true;

    const outEl = _chapters[_current];
    const inEl = _chapters[next];

    // Quitar clase active del saliente, agregar al entrante
    outEl.classList.remove('active');
    inEl.classList.add('active');

    // Saliente
    _setStyle(outEl, {
      transition: `opacity var(--anim-page) ease, transform var(--anim-page) cubic-bezier(.76,0,.24,1)`,
      opacity: '0',
      transform: dir > 0 ? 'translateX(-60px)' : 'translateX(60px)',
      pointerEvents: 'none',
      zIndex: '5',
    });

    // Entrante: posicionar antes de animar
    _setStyle(inEl, {
      transition: 'none',
      opacity: '0',
      transform: dir > 0 ? 'translateX(60px)' : 'translateX(-60px)',
      zIndex: '10',
      pointerEvents: 'all',
    });

    // Forzar reflow y arrancar animación entrante
    requestAnimationFrame(() => requestAnimationFrame(() => {
      _setStyle(inEl, {
        transition: `opacity var(--anim-page) ease, transform var(--anim-page) cubic-bezier(.76,0,.24,1)`,
        opacity: '1',
        transform: 'translateX(0)',
      });
    }));

    const old = _current;
    _current = next;
    _updateUI();

    setTimeout(() => {
      _clearStyle(outEl);
      outEl.style.zIndex = '0';   // bajar explícitamente al terminar
      _busy = false;
    }, 750);
  }

  /**
   * _updateUI — sincroniza dots, counter y estado de botones.
   */
  function _updateUI() {
    document.querySelectorAll('.nav-dot').forEach((d, i) =>
      d.classList.toggle('active', i === _current));

    if (_counter) {
      const pad = n => String(n).padStart(2, '0');
      _counter.textContent = `${pad(_current + 1)} / ${pad(_total)}`;
    }

    if (_btnPrev) _btnPrev.disabled = _current === 0;
    if (_btnNext) _btnNext.disabled = _current === _total - 1;
  }

  /**
   * _buildSideNav — crea los dots de navegación lateral.
   */
  function _buildSideNav(labels) {
    if (!_sideNav) return;
    labels.forEach((label, i) => {
      const btn = document.createElement('button');
      btn.className = 'nav-dot' + (i === 0 ? ' active' : '');
      btn.setAttribute('aria-label', label);
      btn.title = label;
      btn.addEventListener('click', () => {
        const dir = i - _current;
        if (dir !== 0) navigate(dir > 0 ? 1 : -1);
        // Para saltos de más de 1 capítulo, usar goTo directo
        if (Math.abs(dir) > 1) _jumpTo(i);
      });
      _sideNav.appendChild(btn);
    });
  }

  /**
   * _jumpTo — salto directo sin animación (usado por dots en saltos >1).
   */
  function _jumpTo(index) {
    if (index === _current) return;
    _chapters.forEach((el, i) => {
      _clearStyle(el);
      el.classList.toggle('active', i === index);
      el.style.opacity = i === index ? '1' : '0';
      el.style.pointerEvents = i === index ? 'all' : 'none';
      el.style.zIndex = i === index ? '10' : '5';
    });
    _current = index;
    _updateUI();
  }

  return {
    /**
     * init(options) — inicializa el motor.
     * @param {Object} options
     *   chapters: Array<{ id, label }> — definición de capítulos
     *   stage:    HTMLElement          — contenedor del stage
     */
    init({ chapters, stage }) {
      _chapters = [...stage.querySelectorAll('.chapter')];
      _total = _chapters.length;

      _sideNav = document.getElementById('side-nav');
      _counter = document.getElementById('chapter-counter');
      _btnPrev = document.getElementById('btn-prev');
      _btnNext = document.getElementById('btn-next');

      _buildSideNav(chapters.map(c => c.label));

      // Botones
      _btnPrev?.addEventListener('click', () => navigate(-1));
      _btnNext?.addEventListener('click', () => navigate(1));

      // Teclado
      document.addEventListener('keydown', e => {
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') navigate(1);
        if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') navigate(-1);
      });

      // Swipe touch
      let startX = 0;
      stage.addEventListener('touchstart', e => {
        startX = e.touches[0].clientX;
      }, { passive: true });
      stage.addEventListener('touchend', e => {
        const dx = startX - e.changedTouches[0].clientX;
        if (Math.abs(dx) > 50) navigate(dx > 0 ? 1 : -1);
      });

      _updateUI();
      console.info('[ChapterEngine] Init ✓', _total, 'chapters');
    },

    navigate,
    jumpTo: _jumpTo,
  };
})();

export default ChapterEngine;
