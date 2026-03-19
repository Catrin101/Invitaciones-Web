/**
 * ConfigLoader.js — Gudino Dev Invitation Framework
 * Carga y fusiona configuraciones de event.json y theme.json
 * Pattern: Singleton
 */

class ConfigLoader {
  constructor() {
    this._config = null;
  }

  /**
   * Obtiene instancia única (Singleton)
   */
  static getInstance() {
    if (!ConfigLoader._instance) {
      ConfigLoader._instance = new ConfigLoader();
    }
    return ConfigLoader._instance;
  }

  /**
   * Fetch JSON desde URL
   * @param {string} path - Ruta al archivo JSON
   * @returns {Promise<Object>}
   */
  async _fetchJSON(path) {
    try {
      const res = await fetch(path);
      if (!res.ok) {
        throw new Error(`ConfigLoader: Failed to load ${path} (${res.status})`);
      }
      return res.json();
    } catch (error) {
      // Fallback para file:// protocol (desarrollo local)
      console.warn(`[ConfigLoader] Fetch falló para ${path}, usando fallback`);
      throw error;
    }
  }

  /**
   * Fusión profunda de objetos
   * @param {Object} base - Objeto base
   * @param {Object} overrides - Overrides
   * @returns {Object}
   */
  _merge(base, overrides) {
    const result = { ...base };
    for (const key in overrides) {
      if (overrides[key]?.constructor === Object && base[key]?.constructor === Object) {
        result[key] = this._merge(base[key], overrides[key]);
      } else {
        result[key] = overrides[key];
      }
    }
    return result;
  }

  /**
   * Carga y fusiona configuraciones
   * @param {string} eventPath - Ruta a event.json
   * @param {string} themePath - Ruta a theme.json
   * @param {Object} defaults - Valores por defecto del template (opcional)
   * @returns {Promise<Object>} Configuración fusionada
   */
  async load(eventPath = './config/event.json', themePath = './config/theme.json', defaults = {}) {
    if (this._config) return this._config;

    try {
      const [eventData, themeData] = await Promise.all([
        this._fetchJSON(eventPath),
        this._fetchJSON(themePath),
      ]);

      // Fusión: defaults → event → theme
      this._config = this._merge(
        this._merge(defaults, eventData),
        themeData
      );

      console.info('[ConfigLoader] Configuración cargada ✓', this._config);
      return this._config;
    } catch (error) {
      console.error('[ConfigLoader] Error cargando configuración:', error);
      throw error;
    }
  }

  /**
   * Obtiene configuración completa (después de load())
   * @returns {Object}
   */
  get() {
    if (!this._config) {
      throw new Error('ConfigLoader: Debes llamar a load() antes de get()');
    }
    return this._config;
  }

  /**
   * Obtiene una sección específica de la configuración
   * @param {string} key - Clave de la sección (ej: 'hero', 'event', 'theme')
   * @returns {any}
   */
  getSection(key) {
    const config = this.get();
    if (!(key in config)) {
      throw new Error(`ConfigLoader: Sección "${key}" no encontrada`);
    }
    return config[key];
  }

  /**
   * Reinicia la configuración cacheada
   */
  reset() {
    this._config = null;
  }
}

// Exportar instancia singleton
export default ConfigLoader.getInstance();
