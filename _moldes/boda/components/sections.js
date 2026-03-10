/**
 * sections.js — Gudino Dev Invitation Framework (Boda)
 * Funciones puras de renderizado: (config) → void.
 * Cada función escribe HTML en su contenedor del DOM.
 * Mismo patrón que el template XV — solo cambia el markup.
 * Pattern: Component / Factory
 */

// ─────────────────────────────────────────────
// CH 4.5 — ITINERARIO
// ─────────────────────────────────────────────
export function renderItinerary(itinerary) {
  const el = document.getElementById('ch-itinerary');
  if (!el || !itinerary) return;

  el.innerHTML = `
    <div class="full-content full-content--alt">
      <span class="chapter-label">Itinerario</span>
      <h2 class="headline headline--md">${itinerary.title}</h2>
      <p class="body-text" style="text-align:center;margin-bottom:2rem">${itinerary.subtitle}</p>
      
      <div class="itinerary-list">
        ${itinerary.events.map(ev => `
          <div class="itinerary-list__item">
            <div class="itinerary-list__time">${ev.time}</div>
            <div class="itinerary-list__icon"><i class="${ev.icon}"></i></div>
            <div class="itinerary-list__title">${ev.title}</div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

// ─────────────────────────────────────────────
// META TAGS (OG / WhatsApp preview)
// ─────────────────────────────────────────────
export function renderMeta(meta, couple) {
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
  setMeta('og:image', couple.heroImage);
  setMeta('og:url', meta.url);
  setMeta('theme-color', 'var(--color-accent2)', 'name');
}

// ─────────────────────────────────────────────
// CH 1 — PORTADA / HERO
// ─────────────────────────────────────────────
export function renderHero(couple, event) {
  const el = document.getElementById('ch-hero');
  if (!el) return;

  el.innerHTML = `
    <div class="split">
      <div class="split__photo">
        <img src="${couple.heroImage}"
             alt="${couple.heroImageAlt}"
             loading="eager"
             decoding="async" />
        <div class="hero-date-badge">${event.dateDisplay} &nbsp;·&nbsp; Mexicali, B.C.</div>
      </div>
      <div class="split__content hero-animate">
        <span class="chapter-label">Nos casamos</span>
        <h1 class="headline headline--xl">
          ${couple.bride}<br/><em>${couple.groom}</em>
        </h1>
        <div class="thin-rule"></div>
        <p class="subheadline">
          ${couple.brideFamily}<br/>
          &amp; ${couple.groomFamily}
        </p>
        <div class="ornament" style="margin-top:2rem;">— ♥ —</div>
        <p class="nav-hint">Usa las flechas o desliza para continuar</p>
      </div>
    </div>
  `;
}

// ─────────────────────────────────────────────
// CH 2 — HISTORIA
// ─────────────────────────────────────────────
export function renderStory(couple) {
  const el = document.getElementById('ch-story');
  if (!el) return;

  el.innerHTML = `
    <div class="split">
      <div class="split__photo">
        <img src="https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=900&q=80"
             alt="Nuestra historia" loading="lazy" />
      </div>
      <div class="split__content">
        <span class="chapter-label">Nuestra historia</span>
        <h2 class="headline headline--lg">El inicio<br/>de <em>todo</em></h2>
        <div class="thin-rule"></div>
        <blockquote class="story-quote">${couple.story}</blockquote>
        <p class="body-text">
          Hoy, después de tantos capítulos juntos, queremos escribir el más importante.
          Y queremos que tú seas parte de él.
        </p>
        <div class="ornament" style="margin-top:1.8rem;">✦ ✦ ✦</div>
      </div>
    </div>
  `;
}

// ─────────────────────────────────────────────
// CH 3 — CUENTA REGRESIVA
// ─────────────────────────────────────────────
export function renderCountdown(event, labels) {
  const el = document.getElementById('ch-countdown');
  if (!el) return;

  el.innerHTML = `
    <div class="full-content full-content--dark">
      <span class="chapter-label chapter-label--light">Faltan</span>
      <div class="cd-grid">
        ${['days', 'hours', 'minutes', 'seconds'].map(unit => `
          <div class="cd-block">
            <span class="cd-num" id="cd-${unit}">--</span>
            <div class="cd-label">${labels[unit]}</div>
          </div>
        `).join('')}
      </div>
      <p class="cd-date-display">${event.dateDisplay}</p>
    </div>
  `;

  // Countdown logic
  const target = new Date(event.date).getTime();
  const pad = n => String(n).padStart(2, '0');

  function tick() {
    const diff = target - Date.now();
    if (diff <= 0) {
      el.querySelector('.cd-grid').innerHTML =
        `<p style="color:var(--color-bg);font-family:var(--font-display);font-size:2rem;">
          ¡El gran día ha llegado! 🎉
        </p>`;
      return;
    }
    document.getElementById('cd-days').textContent = pad(Math.floor(diff / 86400000));
    document.getElementById('cd-hours').textContent = pad(Math.floor((diff % 86400000) / 3600000));
    document.getElementById('cd-minutes').textContent = pad(Math.floor((diff % 3600000) / 60000));
    document.getElementById('cd-seconds').textContent = pad(Math.floor((diff % 60000) / 1000));
  }

  tick();
  setInterval(tick, 1000);
}

// ─────────────────────────────────────────────
// CH 4 — DETALLES DEL EVENTO
// ─────────────────────────────────────────────
export function renderDetails(event) {
  const el = document.getElementById('ch-details');
  if (!el) return;

  const eventBlock = (block) => `
    <div class="event-block">
      <div class="event-block__time">${block.time}</div>
      <div class="event-block__body">
        <div class="event-block__title">${block.label}</div>
        <div class="event-block__venue">${block.venue}</div>
        <div class="event-block__address">${block.address}</div>
        <a href="${block.mapsUrl}" target="_blank" rel="noopener noreferrer"
           class="event-block__link" aria-label="Ver ${block.venue} en Google Maps">
          <i class="fa-solid fa-location-dot" aria-hidden="true"></i> Ver en Maps
        </a>
      </div>
    </div>
  `;

  el.innerHTML = `
    <div class="split">
      <div class="split__photo">
        <img src="https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=900&q=80"
             alt="Iglesia" loading="lazy" />
      </div>
      <div class="split__content">
        <span class="chapter-label">El gran día</span>
        <h2 class="headline headline--md">Todo listo<br/>para <em>celebrar</em></h2>
        <div style="margin-top:2rem;">
          ${eventBlock(event.ceremony)}
          ${eventBlock(event.reception)}
        </div>
      </div>
    </div>
  `;
}

// ─────────────────────────────────────────────
// CH 5 — GALERÍA (mosaico editorial)
// ─────────────────────────────────────────────
export function renderGallery(gallery) {
  const el = document.getElementById('ch-gallery');
  if (!el) return;

  el.innerHTML = `
    <div style="position:relative;width:100%;height:100%;">
      <div class="mosaic">
        ${gallery.photos.map(p => `
          <div class="mosaic__item">
            <img src="${p.url}" alt="${p.alt}" loading="lazy" decoding="async" />
          </div>
        `).join('')}
      </div>
      <div class="gallery-chapter-label">
        <span class="chapter-label chapter-label--over">Galería</span>
      </div>
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
// CH 6 — CÓDIGO DE VESTIMENTA
// ─────────────────────────────────────────────
export function renderDressCode(dresscode) {
  const el = document.getElementById('ch-dresscode');
  if (!el) return;

  el.innerHTML = `
    <div class="split">
      <div class="split__photo">
        <img src="https://images.unsplash.com/photo-1532712938310-34cb3982ef74?w=900&q=80"
             alt="Vestimenta formal" loading="lazy" />
      </div>
      <div class="split__content">
        <span class="chapter-label">Código de vestimenta</span>
        <h2 class="headline headline--md"><em>${dresscode.label}</em></h2>
        <div class="thin-rule"></div>
        <p class="body-text">${dresscode.description}</p>
        <div class="palette-row">
          ${dresscode.colors.map(color => `
            <div class="swatch ${color.avoid ? 'swatch--avoid' : ''}">
              <div class="swatch__circle"
                   style="background:${color.hex};"
                   aria-label="${color.name}${color.avoid ? ' (evitar)' : ''}">
              </div>
              <span class="swatch__name">${color.name}</span>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;
}

// ─────────────────────────────────────────────
// CH 7 — RSVP
// ─────────────────────────────────────────────
export function renderRSVP(rsvp) {
  const el = document.getElementById('ch-rsvp');
  if (!el) return;

  const waUrl = `https://wa.me/${rsvp.whatsapp.number}?text=${encodeURIComponent(rsvp.whatsapp.message)}`;

  el.innerHTML = `
    <div class="full-content full-content--accent">
      <span class="chapter-label chapter-label--light">Tu presencia</span>
      <h2 class="headline headline--lg" style="color:white;text-align:center;">
        ¿Nos<br/><em style="color:rgba(255,255,255,0.7);">acompañas?</em>
      </h2>
      <div class="ornament ornament--light">— ♥ —</div>
      <p class="rsvp-tagline">Tu presencia es el mejor regalo</p>
      <p class="rsvp-deadline">
        <i class="fa-regular fa-clock" aria-hidden="true"></i>
        Confirmar antes del <strong>${rsvp.deadline}</strong>
      </p>
      <a href="${waUrl}"
         target="_blank"
         rel="noopener noreferrer"
         class="btn btn--whatsapp"
         aria-label="Confirmar asistencia por WhatsApp">
        <i class="fa-brands fa-whatsapp" aria-hidden="true"></i>
        ${rsvp.buttonText}
      </a>
    </div>
  `;
}

// ─────────────────────────────────────────────
// MUSIC CONTROL
// ─────────────────────────────────────────────
export function renderMusicControl(music) {
  if (!music?.enabled) return;

  const btn = document.getElementById('music-btn');
  if (!btn) return;

  const audio = document.getElementById('bg-audio');
  if (audio) {
    audio.src = music.src;
    audio.preload = "auto";
  }

  // Store src on button so splash can use it if audio tag was empty
  btn.dataset.src = music.src;

  const updatePlayState = () => {
    if (!audio.paused) {
      btn.innerHTML = '<i class="fa-solid fa-pause" aria-hidden="true"></i>';
      btn.classList.add('playing');
      btn.setAttribute('aria-label', 'Pausar música');
    } else {
      btn.innerHTML = '<i class="fa-solid fa-music" aria-hidden="true"></i>';
      btn.classList.remove('playing');
      btn.setAttribute('aria-label', 'Reproducir música');
    }
  };

  audio.addEventListener('play', updatePlayState);
  audio.addEventListener('pause', updatePlayState);

  btn.addEventListener('click', () => {
    if (audio.paused) {
      if (audio.readyState === 0) audio.load();
      audio?.play().catch(e => console.warn("Play prevented:", e));
    } else {
      audio?.pause();
    }
  });
}
