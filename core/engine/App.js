/**
 * App.js — Gudino Dev Invitation Framework
 * Orquestador principal de la aplicación
 * Pattern: Facade
 */

import ConfigLoader from './ConfigLoader.js';
import ThemeEngine from './ThemeEngine.js';
import ChapterEngine from './ChapterEngine.js';
import ScrollReveal from './ScrollReveal.js';
import MusicController from './MusicController.js';

class App {
  constructor() {
    this._config = null;
    this._template = null;
    this._initialized = false;
    this._renderers = {};
  }

  /**
   * Obtiene instancia única
   */
  static getInstance() {
    if (!App._instance) {
      App._instance = new App();
    }
    return App._instance;
  }

  /**
   * Registra renderizadores de secciones
   * @param {Object} renderers - Objeto con funciones de renderizado
   */
  registerRenderers(renderers) {
    this._renderers = { ...this._renderers, ...renderers };
    console.info(`[App] Renderizadores registrados: ${Object.keys(renderers).join(', ')}`);
  }

  /**
   * Ejecuta un renderizador por ID
   * @param {string} id - ID del renderizador
   * @param  {...any} args - Argumentos para el renderizador
   */
  render(id, ...args) {
    const renderer = this._renderers[id];
    if (!renderer) {
      console.warn(`[App] Renderizador "${id}" no encontrado`);
      return;
    }
    renderer(...args);
  }

  /**
   * Ejecuta todos los renderizadores en orden
   * @param {Array} order - Orden de ejecución [{ id, args }]
   */
  renderAll(order) {
    order.forEach(({ id, args = [] }) => {
      this.render(id, ...args);
    });
  }

  /**
   * Inicializa la aplicación
   * @param {Object} options
   * @param {string} options.template - Nombre del template
   * @param {string} options.eventConfig - Ruta a event.json
   * @param {string} options.themeConfig - Ruta a theme.json
   * @param {Object} options.templateDefaults - Defaults del template (opcional)
   * @param {Array} options.chapters - Definición de capítulos
   * @param {Array} options.renderOrder - Orden de renderizado
   */
  async init(options) {
    if (this._initialized) {
      console.warn('[App] Ya está inicializado');
      return;
    }

    const {
      template = 'boda',
      eventConfig = './config/event.json',
      themeConfig = './config/theme.json',
      templateDefaults = {},
      chapters = [],
      renderOrder = [],
    } = options;

    this._template = template;

    try {
      // 1. Cargar configuración
      console.info('[App] Cargando configuración...');
      this._config = await ConfigLoader.load(eventConfig, themeConfig, templateDefaults);

      // 2. Aplicar tema
      console.info('[App] Aplicando tema...');
      ThemeEngine.apply(this._config);

      // 3. Renderizar secciones
      console.info('[App] Renderizando secciones...');
      renderOrder.forEach(({ id, args = [] }) => {
        this.render(id, ...args);
      });

      // 4. Inicializar ChapterEngine
      console.info('[App] Inicializando navegación...');
      const stage = document.getElementById('stage');
      if (stage && chapters.length > 0) {
        ChapterEngine.init({
          chapters,
          stage,
          onNavigate: this._onNavigate.bind(this),
        });
      }

      // 5. Inicializar ScrollReveal
      console.info('[App] Inicializando animaciones...');
      ScrollReveal.init();

      // 6. Inicializar música
      console.info('[App] Inicializando música...');
      MusicController.init(this._config.music, (isPlaying) => {
        console.info(`[App] Música: ${isPlaying ? 'reproduciendo' : 'pausada'}`);
      });

      // 7. Quitar estado de carga
      document.body.classList.remove('is-loading');
      document.body.classList.add('is-ready');

      this._initialized = true;
      console.info(`[App] Inicialización completa ✓ Template: ${template}`);

    } catch (error) {
      console.error('[App] Error de inicialización:', error);
      this._showError(error);
      throw error;
    }
  }

  /**
   * Callback al navegar entre capítulos
   * @param {Object} data - Datos de navegación
   */
  _onNavigate({ from, to, chapter }) {
    console.info(`[App] Navegando: ${from} → ${to} (${chapter?.label || ''})`);

    // Scroll al top
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Re-inicializar ScrollReveal para nuevos elementos
    setTimeout(() => {
      ScrollReveal.init();
    }, 100);
  }

  /**
   * Muestra mensaje de error
   * @param {Error} error
   */
  _showError(error) {
    document.body.innerHTML = `
      <div style="display:flex;align-items:center;justify-content:center;min-height:100vh;
                  font-family:system-ui,sans-serif;color:var(--color-accent, #7D9B76);
                  text-align:center;padding:2rem;">
        <div>
          <h1 style="font-size:1.5rem;margin-bottom:1rem;">No se pudo cargar la invitación</h1>
          <p style="font-size:.9rem;opacity:.7;margin-bottom:1.5rem;">${error.message}</p>
          <button onclick="location.reload()"
                  style="padding:.75rem 1.5rem;background:var(--color-accent, #7D9B76);
                         color:white;border:none;border-radius:4px;cursor:pointer;">
            Reintentar
          </button>
        </div>
      </div>
    `;
  }

  /**
   * Obtiene configuración
   * @returns {Object}
   */
  getConfig() {
    return this._config;
  }

  /**
   * Obtiene template actual
   * @returns {string}
   */
  getTemplate() {
    return this._template;
  }

  /**
   * Reinicia la aplicación
   */
  reset() {
    this._initialized = false;
    this._config = null;
    this._renderers = {};
    this._template = null;
  }
}

// Exportar instancia singleton
const app = App.getInstance();

// Helper para bootstrap rápido
export function bootstrap(options) {
  return app.init(options);
}

export { app };
export default app;
