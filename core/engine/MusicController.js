/**
 * MusicController.js — Gudino Dev Invitation Framework
 * Controla reproducción de música de fondo
 * Pattern: Observer
 */

class MusicController {
  constructor() {
    this._audio = null;
    this._button = null;
    this._isPlaying = false;
    this._config = null;
    this._onStateChange = null;
  }

  /**
   * Obtiene instancia única
   */
  static getInstance() {
    if (!MusicController._instance) {
      MusicController._instance = new MusicController();
    }
    return MusicController._instance;
  }

  /**
   * Inicializa el control de música
   * @param {Object} config - Configuración de música
   * @param {Function} onStateChange - Callback al cambiar estado
   */
  init(config, onStateChange = null) {
    this._config = config;
    this._onStateChange = onStateChange;

    if (!config?.enabled) {
      console.info('[MusicController] Música deshabilitada');
      return;
    }

    this._audio = document.getElementById('bg-audio');
    this._button = document.getElementById('music-btn');

    if (!this._audio || !this._button) {
      console.warn('[MusicController] Elementos de audio no encontrados');
      return;
    }

    // Configurar audio
    this._audio.src = config.src;
    this._audio.loop = config.loop !== false;
    this._audio.preload = 'auto';

    // Guardar src en el botón para que splash pueda usarlo
    this._button.dataset.src = config.src;

    // Configurar event listeners
    this._setupEventListeners();

    console.info('[MusicController] Inicializado ✓');
  }

  /**
   * Configura event listeners
   */
  _setupEventListeners() {
    // Eventos de audio
    this._audio.addEventListener('play', () => this._updateState(true));
    this._audio.addEventListener('pause', () => this._updateState(false));
    this._audio.addEventListener('ended', () => {
      if (!this._config.loop) {
        this._updateState(false);
      }
    });

    // Click en botón
    this._button.addEventListener('click', () => this.toggle());

    // Prevenir que el audio se detenga al navegar
    this._audio.addEventListener('suspend', () => {
      if (this._isPlaying) {
        this._audio.play().catch(() => {});
      }
    });
  }

  /**
   * Actualiza el estado UI
   * @param {boolean} isPlaying
   */
  _updateState(isPlaying) {
    this._isPlaying = isPlaying;

    if (isPlaying) {
      this._button.innerHTML = '<i class="fa-solid fa-pause" aria-hidden="true"></i>';
      this._button.classList.add('playing');
      this._button.setAttribute('aria-label', 'Pausar música');
    } else {
      this._button.innerHTML = '<i class="fa-solid fa-music" aria-hidden="true"></i>';
      this._button.classList.remove('playing');
      this._button.setAttribute('aria-label', 'Reproducir música');
    }

    if (this._onStateChange) {
      this._onStateChange(isPlaying);
    }
  }

  /**
   * Alterna reproducción/pausa
   */
  toggle() {
    if (!this._audio || !this._config?.enabled) return;

    if (this._audio.paused) {
      this.play();
    } else {
      this.pause();
    }
  }

  /**
   * Reproduce música
   */
  play() {
    if (!this._audio || !this._config?.enabled) return;

    if (this._audio.readyState === 0) {
      this._audio.load();
    }

    this._audio.play()
      .then(() => {
        this._updateState(true);
        console.info('[MusicController] Reproduciendo ✓');
      })
      .catch(error => {
        console.warn('[MusicController] Error al reproducir:', error);
      });
  }

  /**
   * Pausa música
   */
  pause() {
    if (!this._audio) return;

    this._audio.pause();
    this._updateState(false);
    console.info('[MusicController] Pausado');
  }

  /**
   * Detiene música completamente
   */
  stop() {
    if (!this._audio) return;

    this._audio.pause();
    this._audio.currentTime = 0;
    this._updateState(false);
  }

  /**
   * Obtiene estado actual
   * @returns {boolean}
   */
  isPlaying() {
    return this._isPlaying;
  }

  /**
   * Obtiene configuración
   * @returns {Object|null}
   */
  getConfig() {
    return this._config;
  }

  /**
   * Destruye el controlador
   */
  destroy() {
    this.stop();
    this._audio = null;
    this._button = null;
    this._config = null;
    this._onStateChange = null;
  }
}

// Exportar instancia singleton
export default MusicController.getInstance();
