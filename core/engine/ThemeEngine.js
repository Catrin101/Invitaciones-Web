/**
 * ThemeEngine.js — Gudino Dev Invitation Framework
 * Inyecta variables CSS y fuentes desde la configuración
 * Pattern: Strategy
 */

class ThemeEngine {
  constructor() {
    this._appliedTheme = null;
  }

  /**
   * Obtiene instancia única
   */
  static getInstance() {
    if (!ThemeEngine._instance) {
      ThemeEngine._instance = new ThemeEngine();
    }
    return ThemeEngine._instance;
  }

  /**
   * Mapeo de rutas de configuración a variables CSS
   */
  _cssVarMap = [
    ['colors.background', '--color-bg'],
    ['colors.surface', '--color-surface'],
    ['colors.surfaceAlt', '--color-surface-alt'],
    ['colors.accentPrimary', '--color-accent'],
    ['colors.accentSecond', '--color-accent2'],
    ['colors.text', '--color-text'],
    ['colors.textMuted', '--color-text-muted'],
    ['colors.ctaWhatsapp', '--color-whatsapp'],
    ['colors.overlay', '--color-overlay'],
    ['fonts.display.family', '--font-display'],
    ['fonts.decorative.family', '--font-deco'],
    ['fonts.body.family', '--font-body'],
    ['animations.pageTransition', '--anim-page'],
    ['animations.heroReveal', '--anim-hero'],
    ['animations.stagger', '--anim-stagger'],
  ];

  /**
   * Resuelve una ruta anidada en un objeto
   * @param {Object} obj - Objeto
   * @param {string} path - Ruta (ej: 'colors.background')
   * @returns {any}
   */
  _resolve(obj, path) {
    return path.split('.').reduce((acc, key) => acc?.[key], obj);
  }

  /**
   * Inyecta fuentes de Google en el head
   * @param {Object} fonts - Configuración de fuentes
   */
  _injectFonts(fonts) {
    if (!fonts) return;

    const loaded = new Set(
      [...document.querySelectorAll('link[rel="stylesheet"]')].map(link => link.href)
    );

    Object.values(fonts).forEach(({ googleUrl }) => {
      if (googleUrl && !loaded.has(googleUrl)) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = googleUrl;
        document.head.appendChild(link);
        loaded.add(googleUrl);
      }
    });
  }

  /**
   * Aplica el tema al documento
   * @param {Object} theme - Configuración del tema
   */
  apply(theme) {
    if (!theme) {
      console.warn('[ThemeEngine] No se proporcionó tema, usando valores por defecto');
      return;
    }

    const root = document.documentElement;

    // Inyectar variables CSS
    this._cssVarMap.forEach(([path, cssVar]) => {
      const value = this._resolve(theme, path);
      if (value !== undefined) {
        root.style.setProperty(cssVar, value);
      }
    });

    // Inyectar fuentes
    if (theme.fonts) {
      this._injectFonts(theme.fonts);
    }

    this._appliedTheme = theme;
    console.info(`[ThemeEngine] Tema aplicado ✓ ${theme.name || 'sin nombre'}`);
  }

  /**
   * Obtiene el tema actualmente aplicado
   * @returns {Object|null}
   */
  getAppliedTheme() {
    return this._appliedTheme;
  }

  /**
   * Remueve variables CSS del tema
   */
  reset() {
    const root = document.documentElement;
    this._cssVarMap.forEach(([, cssVar]) => {
      root.style.removeProperty(cssVar);
    });
    this._appliedTheme = null;
  }
}

// Exportar instancia singleton
export default ThemeEngine.getInstance();
