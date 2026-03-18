/**
 * Components — Gudino Dev Invitation Framework
 * Each section is a pure function: (config) → void (renders into pre-existing DOM containers).
 * Pattern: Component / Factory
 *
 * DOM containers (in index.html):
 *   #section-hero, #section-countdown, #section-event,
 *   #section-gallery, #section-dresscode, #section-rsvp, #music-control
 */

// ─────────────────────────────────────────────
// HERO
// ─────────────────────────────────────────────
export function renderHero(hero, theme) {
  const el = document.getElementById('section-hero');
  if (!el) return;

  el.style.backgroundImage = `url('${hero.image}')`;
  el.setAttribute('aria-label', hero.imageAlt);

  el.innerHTML = `
    <div class="hero__overlay"></div>
    <div class="hero__content reveal-up">
      <p class="hero__decorative">${hero.subtitle}</p>
      <h1 class="hero__name">${hero.name}</h1>
      <p class="hero__lastname">${hero.lastName}</p>
      <div class="divider-ornament">${theme.decorators?.sectionDivider ?? '❧'}</div>
      <p class="hero__tagline">${hero.tagline}</p>
    </div>
    <div class="hero__scroll-hint" aria-hidden="true">${theme.decorators?.heroScrollHint ?? '↓'}</div>
  `;
}

// ─────────────────────────────────────────────
// COUNTDOWN
// ─────────────────────────────────────────────
export function renderCountdown(event, labels) {
  const el = document.getElementById('section-countdown');
  if (!el) return;

  const target = new Date(event.date).getTime();

  el.innerHTML = `
    <div class="countdown__grid">
      ${['days', 'hours', 'minutes', 'seconds'].map(unit => `
        <div class="countdown__block reveal-up">
          <span class="countdown__number" id="cd-${unit}">--</span>
          <span class="countdown__label">${labels[unit]}</span>
        </div>
      `).join('')}
    </div>
  `;

  function tick() {
    const now = Date.now();
    const diff = target - now;

    if (diff <= 0) {
      document.getElementById('section-countdown').innerHTML =
        `<p class="countdown__done">¡El gran día ha llegado! 🎉</p>`;
      return;
    }

    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);

    const pad = (n) => String(n).padStart(2, '0');

    document.getElementById('cd-days').textContent = pad(d);
    document.getElementById('cd-hours').textContent = pad(h);
    document.getElementById('cd-minutes').textContent = pad(m);
    document.getElementById('cd-seconds').textContent = pad(s);
  }

  tick();
  setInterval(tick, 1000);
}

// ─────────────────────────────────────────────
// EVENT DETAILS
// ─────────────────────────────────────────────
export function renderEventDetails(event) {
  const el = document.getElementById('section-event');
  if (!el) return;

  el.innerHTML = `
    <div class="event__card reveal-up">
      <div class="event__item">
        <i class="fa-regular fa-calendar event__icon" aria-hidden="true"></i>
        <div>
          <p class="event__label">Fecha</p>
          <p class="event__value">${event.dateDisplay}</p>
          <p class="event__value">${event.time}</p>
        </div>
      </div>
      <div class="event__divider"></div>
      <div class="event__item">
        <i class="fa-solid fa-location-dot event__icon" aria-hidden="true"></i>
        <div>
          <p class="event__label">Lugar</p>
          <p class="event__value">${event.venue.name}</p>
          <p class="event__address">${event.venue.address}</p>
        </div>
      </div>
      <a href="${event.venue.mapsUrl}"
         target="_blank"
         rel="noopener noreferrer"
         class="btn btn--outline reveal-up"
         aria-label="Ver ubicación en Google Maps">
        <i class="fa-solid fa-map-location-dot" aria-hidden="true"></i>
        Ver en Google Maps
      </a>
    </div>
  `;
}

// ─────────────────────────────────────────────
// GALLERY
// ─────────────────────────────────────────────
export function renderGallery(gallery) {
  const el = document.getElementById('section-gallery');
  if (!el) return;

  el.innerHTML = `
    <header class="section__header reveal-up">
      <h2 class="section__title">${gallery.title}</h2>
      <p class="section__subtitle">${gallery.subtitle}</p>
    </header>
    <div class="gallery__grid">
      ${gallery.photos.map((photo, i) => `
        <div class="gallery__item reveal-up" style="animation-delay:${i * 80}ms">
          <img
            src="${photo.url}"
            alt="${photo.alt}"
            loading="lazy"
            decoding="async"
            class="gallery__img"
          />
          <div class="gallery__overlay" aria-hidden="true"></div>
        </div>
      `).join('')}
    </div>
  `;

  // --- Lightbox ---
  let lightbox = document.getElementById('gallery-lightbox');
  if (!lightbox) {
    lightbox = document.createElement('div');
    lightbox.id = 'gallery-lightbox';
    Object.assign(lightbox.style, {
      position: 'fixed', inset: '0', backgroundColor: 'rgba(0,0,0,0.92)',
      zIndex: '99999', display: 'none', alignItems: 'center', justifyContent: 'center',
      cursor: 'zoom-out', opacity: '0', transition: 'opacity 0.3s ease'
    });

    const lbImg = document.createElement('img');
    Object.assign(lbImg.style, {
      maxWidth: '90%', maxHeight: '90%', objectFit: 'contain', borderRadius: '8px',
      boxShadow: '0 10px 30px rgba(0,0,0,0.5)', transform: 'scale(0.95)', transition: 'transform 0.3s ease'
    });
    lightbox.appendChild(lbImg);

    lightbox.addEventListener('click', () => {
      lightbox.style.opacity = '0';
      lbImg.style.transform = 'scale(0.95)';
      setTimeout(() => { lightbox.style.display = 'none'; }, 300);
    });

    document.body.appendChild(lightbox);
  }

  const items = el.querySelectorAll('.mosaic__item, .gallery__item');
  items.forEach(item => {
    item.style.cursor = 'zoom-in';
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      if (!img) return;
      const lbImg = lightbox.querySelector('img');
      lbImg.src = img.src;
      lightbox.style.display = 'flex';
      lightbox.offsetHeight; // force reflow
      lightbox.style.opacity = '1';
      lbImg.style.transform = 'scale(1)';
    });
  });
}

// ─────────────────────────────────────────────
// DRESS CODE
// ─────────────────────────────────────────────
export function renderDressCode(dresscode) {
  const el = document.getElementById('section-dresscode');
  if (!el) return;

  const pinterestBtn = dresscode.pinterestUrl ? `
    <a href="${dresscode.pinterestUrl}"
       target="_blank"
       rel="noopener noreferrer"
       class="btn btn--pinterest reveal-up"
       aria-label="Ver ejemplos de vestimenta en Pinterest">
      <i class="fa-brands fa-pinterest" aria-hidden="true"></i>
      Ver ejemplos de vestimenta
    </a>
  ` : '';

  el.innerHTML = `
    <header class="section__header reveal-up">
      <h2 class="section__title">${dresscode.title}</h2>
      <p class="section__subtitle">${dresscode.subtitle}</p>
    </header>
    <div class="dresscode__palette reveal-up">
      ${dresscode.colors.map(color => `
        <div class="dresscode__swatch ${color.avoid ? 'dresscode__swatch--avoid' : ''}">
          <div class="dresscode__color" style="background:${color.hex}" aria-label="${color.name}">
            ${color.avoid ? '<span class="dresscode__avoid-icon" aria-hidden="true">✕</span>' : ''}
          </div>
          <span class="dresscode__name">${color.name}${color.avoid ? ' (evitar)' : ''}</span>
        </div>
      `).join('')}
    </div>
    <p class="dresscode__desc reveal-up">${dresscode.description}</p>
    ${pinterestBtn}
  `;
}

// ─────────────────────────────────────────────
// RSVP
// ─────────────────────────────────────────────
export function renderRSVP(rsvp) {
  const el = document.getElementById('section-rsvp');
  if (!el) return;

  const waUrl = `https://wa.me/${rsvp.whatsapp.number}?text=${encodeURIComponent(rsvp.whatsapp.message)}`;

  el.innerHTML = `
    <header class="section__header reveal-up">
      <h2 class="section__title">${rsvp.title}</h2>
      <p class="section__subtitle">${rsvp.subtitle}</p>
    </header>
    <p class="rsvp__deadline reveal-up">
      <i class="fa-regular fa-clock" aria-hidden="true"></i>
      Confirmar antes del <strong>${rsvp.deadline}</strong>
    </p>
    <a href="${waUrl}"
       target="_blank"
       rel="noopener noreferrer"
       class="btn btn--whatsapp reveal-up"
       aria-label="Confirmar asistencia por WhatsApp">
      <i class="fa-brands fa-whatsapp" aria-hidden="true"></i>
      ${rsvp.buttonText}
    </a>
  `;
}

// ─────────────────────────────────────────────
// MESA DE REGALOS
// ─────────────────────────────────────────────
export function renderGiftRegistry(gifts) {
  const el = document.getElementById('section-gifts');
  if (!el || !gifts) return;

  el.innerHTML = `
    <div class="section section--alt">
      <div class="section__inner reveal-up">
        <header class="section__header">
          <h2 class="section__title">${gifts.title}</h2>
          <p class="section__subtitle">${gifts.subtitle}</p>
        </header>
        <p class="section__desc" style="text-align:center;margin-bottom:2rem">${gifts.description}</p>
        
        <div class="gifts-stores">
          ${gifts.stores.map(store => `
            <a href="${store.url}"
               target="_blank"
               rel="noopener noreferrer"
               class="gift-store-card"
               aria-label="Ver mesa de regalos en ${store.name}">
              <i class="${store.icon} gift-store-icon" aria-hidden="true"></i>
              <span class="gift-store-name">${store.name}</span>
            </a>
          `).join('')}
        </div>
      </div>
    </div>
  `;
}

// ─────────────────────────────────────────────
// MUSIC CONTROL
// ─────────────────────────────────────────────
export function renderMusicControl(music) {
  if (!music.enabled) return;

  const el = document.getElementById('music-control');
  if (!el) return;

  el.innerHTML = `
    <audio id="bg-audio" loop="${music.loop}" preload="auto">
      <source src="${music.src}" type="audio/mpeg">
    </audio>
    <button
      id="music-btn"
      class="music-btn"
      aria-label="Reproducir música de fondo"
      aria-pressed="false"
      title="${music.tooltip}"
    >
      <i class="fa-solid fa-music" aria-hidden="true"></i>
    </button>
  `;

  const audio = document.getElementById('bg-audio');
  const btn = document.getElementById('music-btn');

  const updatePlayState = () => {
    if (!audio.paused) {
      btn.innerHTML = '<i class="fa-solid fa-pause" aria-hidden="true"></i>';
      btn.setAttribute('aria-label', 'Pausar música');
      btn.setAttribute('aria-pressed', 'true');
      btn.classList.add('music-btn--playing');
    } else {
      btn.innerHTML = '<i class="fa-solid fa-music" aria-hidden="true"></i>';
      btn.setAttribute('aria-label', 'Reproducir música de fondo');
      btn.setAttribute('aria-pressed', 'false');
      btn.classList.remove('music-btn--playing');
    }
  };

  audio.addEventListener('play', updatePlayState);
  audio.addEventListener('pause', updatePlayState);

  btn.addEventListener('click', () => {
    if (audio.paused) {
      if (audio.readyState === 0) audio.load();
      audio.play().catch(e => console.warn("Autoplay prevented:", e));
    } else {
      audio.pause();
    }
  });
}

// ─────────────────────────────────────────────
// ITINERARY
// ─────────────────────────────────────────────
export function renderItinerary(itinerary) {
  const el = document.getElementById('section-itinerary');
  if (!el || !itinerary) return;

  el.innerHTML = `
    <header class="section__header reveal-up">
      <h2 class="section__title">${itinerary.title}</h2>
      <p class="section__subtitle">${itinerary.subtitle}</p>
    </header>
    <div class="itinerary__list reveal-up">
      ${itinerary.events.map(ev => `
        <div class="itinerary__item">
          <div class="itinerary__time">${ev.time}</div>
          <div class="itinerary__icon"><i class="${ev.icon}"></i></div>
          <div class="itinerary__content">
            <h3 class="itinerary__event-title">${ev.title}</h3>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

// ─────────────────────────────────────────────
// META TAGS (OG / WhatsApp preview)
// ─────────────────────────────────────────────
export function renderMeta(meta, hero) {
  const setMeta = (prop, val, attr = 'property') => {
    let el = document.querySelector(`meta[${attr}="${prop}"]`);
    if (!el) {
      el = document.createElement('meta');
      el.setAttribute(attr, prop);
      document.head.appendChild(el);
    }
    el.setAttribute('content', val);
  };

  document.title = meta.title;
  setMeta('og:title', meta.title);
  setMeta('og:description', meta.description);
  setMeta('og:image', hero.image);
  setMeta('og:url', meta.url);
  setMeta('theme-color', '#C9A84C', 'name');
}
