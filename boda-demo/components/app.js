/**
 * app.js — Gudino Dev Invitation Framework (Boda)
 * Orquestador principal. Mismo patrón Facade que el template XV.
 * Orden: ConfigLoader → ThemeEngine → sections → ChapterEngine
 */

import ConfigLoader from './ConfigLoader.js';
import ThemeEngine from './ThemeEngine.js';
import ChapterEngine from './ChapterEngine.js';
import {
  renderMeta,
  renderSplash,
  renderWelcome,
  renderHero,
  renderStory,
  renderCountdown,
  renderDetails,
  renderItinerary,
  renderGallery,
  renderDressCode,
  renderRSVP,
  renderMusicControl,
} from './sections.js';

// Definición de capítulos — orden = secuencia de navegación
const CHAPTERS = [
  { id: 'ch-welcome', label: 'Bienvenida' },
  { id: 'ch-hero', label: 'Portada' },
  { id: 'ch-story', label: 'Nuestra historia' },
  { id: 'ch-countdown', label: 'Cuenta regresiva' },
  { id: 'ch-details', label: 'El gran día' },
  { id: 'ch-itinerary', label: 'Itinerario' },
  { id: 'ch-gallery', label: 'Galería' },
  { id: 'ch-dresscode', label: 'Vestimenta' },
  { id: 'ch-rsvp', label: 'Confirmar' },
];

/* ─── Splash logic ──────────────────────────────────────── */
function initSplash() {
  const splashScreen = document.getElementById('splash-screen');
  const splashBtn = document.getElementById('splash-btn');
  const audio = document.getElementById('bg-audio');
  const musicBtn = document.getElementById('music-btn');

  if (!splashScreen || !splashBtn) return;

  splashBtn.addEventListener('click', () => {
    // Curtain open animation
    splashScreen.classList.add('splash--opening');

    setTimeout(() => {
      splashScreen.classList.add('splash--hidden');
      splashScreen.addEventListener('transitionend', () => {
        splashScreen.remove();
      }, { once: true });
    }, 700); // wait for curtain animation

    if (audio) {
      if (!audio.src) audio.src = document.getElementById('music-btn').dataset.src;
      audio.load();
      audio.play().catch(e => console.warn("Autoplay prevented:", e));
      musicBtn?.classList.add('playing');
    }
  }, { once: true });
}

async function init() {
  try {
    // ── 1. Cargar configuración ────────────────────────────
    const config = await ConfigLoader.load(
      './config/event.json',
      './config/theme.json'
    );

    const { theme } = config;

    // ── 2. Aplicar tema visual ─────────────────────────────
    ThemeEngine.apply(theme);

    // ── 3. Renderizar secciones ────────────────────────────
    renderMeta(config.meta, config.couple);
    renderSplash(config.couple);
    renderWelcome(config.welcome);
    renderHero(config.couple, config.event);
    renderStory(config.couple);
    renderCountdown(config.event, config.countdown.labels);
    renderDetails(config.event);
    renderItinerary(config.itinerary);
    renderGallery(config.gallery);
    renderDressCode(config.dresscode);
    renderRSVP(config.rsvp);
    renderMusicControl(config.music);

    // ── 4. Inicializar navegación por capítulos ────────────
    const stage = document.getElementById('stage');
    ChapterEngine.init({ chapters: CHAPTERS, stage });

    // ── 5. Inicializar splash ──────────────────────────────
    initSplash();

    // ── 6. Quitar estado de carga ──────────────────────────
    document.body.classList.remove('is-loading');
    document.body.classList.add('is-ready');

  } catch (err) {
    console.error('[App] Error de inicialización:', err);
    document.body.innerHTML = `
      <div style="display:flex;align-items:center;justify-content:center;height:100vh;
                  font-family:serif;color:#7D9B76;text-align:center;padding:2rem;">
        <div>
          <p style="font-size:1.4rem">No se pudo cargar la invitación</p>
          <p style="font-size:.85rem;opacity:.5;margin-top:.5rem">${err.message}</p>
        </div>
      </div>
    `;
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
