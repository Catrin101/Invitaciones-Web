/**
 * app.js — Gudino Dev Invitation Framework
 * Application bootstrap. Orchestrates config loading, theme injection,
 * and section rendering in the correct order.
 *
 * Pattern: Facade / Orchestrator
 * Import order: ConfigLoader → ThemeEngine → sections → ScrollReveal
 */

import ConfigLoader from './ConfigLoader.js';
import ThemeEngine from './ThemeEngine.js';
import ScrollReveal from './ScrollReveal.js';
import {
  renderMeta,
  renderHero,
  renderCountdown,
  renderEventDetails,
  renderItinerary,
  renderGallery,
  renderDressCode,
  renderRSVP,
  renderMusicControl,
} from './sections.js';

async function init() {
  try {
    // ── 1. Load configuration ──────────────────────────────────────────────
    const config = await ConfigLoader.load(
      './config/event.json',
      './config/theme.json'
    );

    const { theme } = config;

    // ── 2. Apply visual theme (CSS vars + fonts) ───────────────────────────
    ThemeEngine.apply(theme);

    // ── 3. Render sections (order = visual reading order) ──────────────────
    renderMeta(config.meta, config.hero);
    renderHero(config.hero, theme);
    renderCountdown(config.event, config.countdown.labels);
    renderEventDetails(config.event);
    renderItinerary(config.itinerary);
    renderGallery(config.gallery);
    renderDressCode(config.dresscode);
    renderRSVP(config.rsvp);
    renderMusicControl(config.music);

    // ── 4. Initialize scroll animations ────────────────────────────────────
    // Small timeout ensures DOM is fully painted before observing
    requestAnimationFrame(() => ScrollReveal.init());

    // ── 5. Remove loading state ────────────────────────────────────────────
    // Attempt to play audio if available, before removing loading state
    const audio = document.getElementById('background-music');
    const musicBtn = document.getElementById('music-control-btn');
    if (audio) {
      if (audio.readyState === 0) audio.load();
      audio.play().catch(e => console.warn("Autoplay prevented:", e));
    }
    musicBtn?.classList.add('playing');

    document.body.classList.remove('is-loading');
    document.body.classList.add('is-ready');

  } catch (err) {
    console.error('[App] Initialization failed:', err);
    document.body.innerHTML = `
      <div style="display:flex;align-items:center;justify-content:center;height:100vh;
                  font-family:serif;color:#C9A84C;text-align:center;padding:20px;">
        <div>
          <p style="font-size:1.4rem">No se pudo cargar la invitación.</p>
          <p style="font-size:0.9rem;opacity:0.6;margin-top:8px">${err.message}</p>
        </div>
      </div>
    `;
  }
}

// Boot on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
