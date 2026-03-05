/**
 * ThemeEngine — Gudino Dev Invitation Framework
 * Lee theme.json e inyecta CSS Custom Properties en :root.
 * Idéntico al del template XV — reutilizable sin modificación.
 * Pattern: Strategy / Bridge
 */

const ThemeEngine = (() => {

  const CSS_VAR_MAP = [
    ['colors.background',    '--color-bg'],
    ['colors.surface',       '--color-surface'],
    ['colors.surfaceAlt',    '--color-surface-alt'],
    ['colors.accentPrimary', '--color-accent'],
    ['colors.accentSecond',  '--color-accent2'],
    ['colors.text',          '--color-text'],
    ['colors.textMuted',     '--color-text-muted'],
    ['colors.ctaWhatsapp',   '--color-whatsapp'],
    ['colors.overlay',       '--color-overlay'],
    ['fonts.display.family',    '--font-display'],
    ['fonts.decorative.family', '--font-deco'],
    ['fonts.body.family',       '--font-body'],
    ['animations.pageTransition', '--anim-page'],
    ['animations.heroReveal',     '--anim-hero'],
    ['animations.stagger',        '--anim-stagger'],
  ];

  function _resolve(obj, path) {
    return path.split('.').reduce((acc, key) => acc?.[key], obj);
  }

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
    apply(theme) {
      const root = document.documentElement;
      CSS_VAR_MAP.forEach(([path, cssVar]) => {
        const value = _resolve(theme, path);
        if (value !== undefined) root.style.setProperty(cssVar, value);
      });
      if (theme.fonts) _injectFonts(theme.fonts);
      console.info('[ThemeEngine] Theme applied ✓', theme.name);
    },
  };
})();

export default ThemeEngine;
