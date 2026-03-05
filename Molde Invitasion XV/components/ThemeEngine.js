/**
 * ThemeEngine — Gudino Dev Invitation Framework
 * Reads theme.json config and injects CSS Custom Properties into :root.
 * This means the entire visual identity can be swapped via JSON — zero CSS edits.
 * Pattern: Strategy / Bridge
 */

const ThemeEngine = (() => {

  /**
   * Maps theme.json keys → CSS variable names.
   * Structure: [jsonPath, cssVarName]
   */
  const CSS_VAR_MAP = [
    // Colors
    ['colors.background',    '--color-bg'],
    ['colors.surface',       '--color-surface'],
    ['colors.surfaceAlt',    '--color-surface-alt'],
    ['colors.accentPrimary', '--color-accent'],
    ['colors.accentSecond',  '--color-accent2'],
    ['colors.text',          '--color-text'],
    ['colors.textMuted',     '--color-text-muted'],
    ['colors.ctaWhatsapp',   '--color-whatsapp'],
    ['colors.overlay',       '--color-overlay'],
    // Fonts
    ['fonts.display.family',    '--font-display'],
    ['fonts.decorative.family', '--font-decorative'],
    ['fonts.body.family',       '--font-body'],
    // Font sizes
    ['fontSizes.heroName',    '--fs-hero-name'],
    ['fontSizes.heroTag',     '--fs-hero-tag'],
    ['fontSizes.sectionTitle','--fs-section-title'],
    ['fontSizes.body',        '--fs-body'],
    ['fontSizes.small',       '--fs-small'],
    // Spacing
    ['spacing.sectionPadding', '--spacing-section'],
    ['spacing.maxWidth',       '--max-width'],
    // Borders
    ['borders.radius',      '--radius'],
    ['borders.radiusLg',    '--radius-lg'],
    ['borders.radiusRound', '--radius-round'],
    // Shadows
    ['shadows.gold',      '--shadow-gold'],
    ['shadows.whatsapp',  '--shadow-whatsapp'],
    ['shadows.card',      '--shadow-card'],
    // Animations
    ['animations.heroFadeIn',   '--anim-hero'],
    ['animations.scrollReveal', '--anim-reveal'],
    ['animations.hoverScale',   '--anim-hover-scale'],
    ['animations.buttonHover',  '--anim-btn'],
  ];

  /**
   * Resolves a dot-notation path on an object.
   * e.g. resolve({a:{b:1}}, 'a.b') → 1
   */
  function _resolve(obj, path) {
    return path.split('.').reduce((acc, key) => acc?.[key], obj);
  }

  /**
   * Injects Google Fonts <link> tags if not already present.
   */
  function _injectFonts(fonts) {
    const loaded = new Set(
      [...document.querySelectorAll('link[rel="stylesheet"]')].map(l => l.href)
    );
    Object.values(fonts).forEach(({ googleUrl }) => {
      if (googleUrl && !loaded.has(googleUrl)) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = googleUrl;
        document.head.appendChild(link);
      }
    });
  }

  return {
    /**
     * apply(theme) — Injects all CSS variables + fonts.
     * @param {Object} theme - theme section from config
     */
    apply(theme) {
      const root = document.documentElement;

      CSS_VAR_MAP.forEach(([path, cssVar]) => {
        const value = _resolve(theme, path);
        if (value !== undefined) {
          root.style.setProperty(cssVar, value);
        }
      });

      if (theme.fonts) _injectFonts(theme.fonts);

      // Set page language if meta exists
      const lang = document.documentElement.lang;
      if (!lang) document.documentElement.lang = 'es';

      console.info('[ThemeEngine] Theme applied ✓', theme.name);
    },
  };
})();

export default ThemeEngine;
