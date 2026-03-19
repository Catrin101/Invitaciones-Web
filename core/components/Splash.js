/**
 * Splash.js — Gudino Dev Invitation Framework
 * Pantalla de bienvenida animada
 * Pattern: Component
 */

import { onReady, once } from '../utils/dom.js';

class Splash {
  constructor() {
    this._screen = null;
    this._btn = null;
    this._audio = null;
    this._musicBtn = null;
    this._onOpen = null;
  }

  /**
   * Obtiene instancia única
   */
  static getInstance() {
    if (!Splash._instance) {
      Splash._instance = new Splash();
    }
    return Splash._instance;
  }

  /**
   * Renderiza el splash screen
   * @param {Object} config - Configuración del splash
   * @param {string} config.message - Mensaje (ej: "Te invitamos a")
   * @param {string} config.names - Nombres (ej: "Isabella & Mateo")
   * @param {string} config.btnText - Texto del botón
   */
  render(config) {
    const {
      message = 'Te invitamos a',
      names = '',
      btnText = 'Abrir invitación',
    } = config;

    const existing = document.getElementById('splash-screen');
    if (existing) return;

    const splash = document.createElement('div');
    splash.id = 'splash-screen';
    splash.setAttribute('role', 'dialog');
    splash.setAttribute('aria-modal', 'true');
    splash.setAttribute('aria-label', 'Pantalla de bienvenida');

    splash.innerHTML = `
      <div class="splash__curtain" aria-hidden="true">
        <div class="splash__curtain-left"></div>
        <div class="splash__curtain-right"></div>
      </div>
      <div class="splash__content">
        <p class="splash__pre">${message}</p>
        <h2 class="splash__name">${names}</h2>
        <button id="splash-btn" class="splash__btn" type="button">
          ${btnText}
          <span class="splash__btn-icon" aria-hidden="true">✉</span>
        </button>
      </div>
    `;

    document.body.insertBefore(splash, document.body.firstChild);
    this._screen = splash;
    this._btn = splash.querySelector('#splash-btn');
  }

  /**
   * Inicializa el splash screen
   * @param {Object} options
   * @param {Function} options.onOpen - Callback al abrir
   */
  init(options = {}) {
    this._onOpen = options.onOpen;

    this._screen = document.getElementById('splash-screen');
    this._btn = document.getElementById('splash-btn');
    this._audio = document.getElementById('bg-audio');
    this._musicBtn = document.getElementById('music-btn');

    if (!this._screen || !this._btn) {
      console.warn('[Splash] Elementos no encontrados');
      return;
    }

    this._setupEventListeners();
    console.info('[Splash] Inicializado ✓');
  }

  /**
   * Configura event listeners
   */
  _setupEventListeners() {
    this._btn.addEventListener('click', () => this.open(), { once: true });

    // Cerrar con tecla Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this._screen) {
        this.open();
      }
    });
  }

  /**
   * Abre el splash (cierra la pantalla de bienvenida)
   */
  async open() {
    if (!this._screen) return;

    // Animación de apertura de cortinas
    this._screen.classList.add('splash--opening');

    // Esperar animación de cortinas
    await once(this._screen, 'transitionend');

    // Eliminar splash
    this._screen.remove();
    this._screen = null;

    // Iniciar música si existe
    this._startMusic();

    // Callback
    if (this._onOpen) {
      this._onOpen();
    }

    console.info('[Splash] Abierto ✓');
  }

  /**
   * Inicia la música de fondo
   */
  _startMusic() {
    if (!this._audio) return;

    // Obtener src del botón o del audio
    const src = this._musicBtn?.dataset.src || this._audio.src;
    if (src && !this._audio.src) {
      this._audio.src = src;
    }

    if (this._audio.src) {
      this._audio.load();
      this._audio.play().catch(e => {
        console.warn('[Splash] Autoplay prevenido:', e);
      });

      // Actualizar botón de música
      this._musicBtn?.classList.add('playing');
    }
  }

  /**
   * Cierra el splash sin animación
   */
  close() {
    if (!this._screen) return;
    this._screen.remove();
    this._screen = null;
  }

  /**
   * Verifica si el splash está visible
   * @returns {boolean}
   */
  isVisible() {
    return this._screen !== null && document.getElementById('splash-screen') !== null;
  }

  /**
   * Destruye el splash
   */
  destroy() {
    this.close();
    this._onOpen = null;
  }
}

// Exportar instancia singleton
export default Splash.getInstance();
