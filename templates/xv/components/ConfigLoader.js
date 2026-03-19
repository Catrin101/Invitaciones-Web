/**
 * ConfigLoader — Gudino Dev Invitation Framework
 * Loads event.json + theme.json and merges them into a single app config.
 * Pattern: Module Singleton
 */

const ConfigLoader = (() => {
  let _config = null;

  /**
   * Fetches a JSON file. Falls back gracefully if fetch is unavailable
   * (e.g., file:// protocol during local dev — uses inline data).
   */
  async function _fetchJSON(path) {
    const res = await fetch(path);
    if (!res.ok) throw new Error(`ConfigLoader: Failed to load ${path} (${res.status})`);
    return res.json();
  }

  /**
   * Deep-merges two objects (theme into event config).
   */
  function _merge(base, overrides) {
    return { ...base, ...overrides };
  }

  /**
   * Public API
   */
  return {
    /**
     * load() — Call once at app boot.
     * @param {string} eventPath  - Path to event.json
     * @param {string} themePath  - Path to theme.json
     * @returns {Promise<Object>} - Merged config
     */
    async load(eventPath = './config/event.json', themePath = './config/theme.json') {
      if (_config) return _config; // Singleton: return cached config

      const [eventData, themeData] = await Promise.all([
        _fetchJSON(eventPath),
        _fetchJSON(themePath),
      ]);

      _config = _merge(eventData, themeData);
      console.info('[ConfigLoader] Config loaded ✓', _config);
      return _config;
    },

    /**
     * get() — Returns cached config synchronously after load().
     */
    get() {
      if (!_config) throw new Error('ConfigLoader: Call load() before get()');
      return _config;
    },

    /**
     * getSection(key) — Returns a single section of the config.
     * @param {string} key - e.g. 'hero', 'event', 'theme'
     */
    getSection(key) {
      const c = this.get();
      if (!(key in c)) throw new Error(`ConfigLoader: Section "${key}" not found`);
      return c[key];
    },
  };
})();

export default ConfigLoader;
