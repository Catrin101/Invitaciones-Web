# Guía Rápida: Crear Nueva Invitación

Esta guía te muestra cómo crear una nueva invitación paso a paso.

## 📋 Requisitos

- Tener el proyecto clonado y funcionando
- Node.js >= 18 instalado
- Conocimientos básicos de JSON

---

## Paso 1: Crear Estructura de Carpetas

```bash
cd invitations
mkdir -p mi-nueva-invitation/{config,assets/img,assets/audio}
```

**Estructura resultante:**
```
invitations/
└── mi-nueva-invitation/
    ├── config/
    │   ├── event.json      ← Datos del evento
    │   └── theme.json      ← Personalización visual
    └── assets/
        ├── img/            ← Fotos
        └── audio/          ← Música de fondo
```

---

## Paso 2: Configurar el Evento

Crea `config/event.json` con los datos de tu evento:

```json
{
  "welcome": {
    "message": "Con mucho cariño, les invitamos a celebrar este día especial.",
    "signature": "— Tus Nombres"
  },
  "meta": {
    "title": "Nombres — Fecha del Evento",
    "description": "Invitación especial para nuestro evento",
    "url": "https://tu-usuario.github.io/mi-nueva-invitation"
  },
  "couple": {
    "bride": "Isabella",
    "groom": "Mateo",
    "brideFamily": "Familia Montoya",
    "groomFamily": "Familia Castellanos",
    "story": "Nos conocimos en una tarde de lluvia...",
    "heroImage": "./assets/img/portada.jpg",
    "heroImageAlt": "Descripción de la foto"
  },
  "event": {
    "date": "2026-07-12T17:00:00",
    "dateDisplay": "12 · VII · 2026",
    "time": "5:00 PM",
    "ceremony": {
      "label": "Ceremonia",
      "time": "5:00 PM",
      "venue": "Parroquia San Francisco",
      "address": "Calle Principal #123",
      "mapsUrl": "https://maps.google.com/?q=Parroquia+San+Francisco"
    },
    "reception": {
      "label": "Recepción",
      "time": "8:00 PM",
      "venue": "Salón de Eventos",
      "address": "Avenida Principal #456",
      "mapsUrl": "https://maps.google.com/?q=Salon+Eventos"
    }
  },
  "itinerary": {
    "title": "Itinerario",
    "subtitle": "Lo que nos espera",
    "events": [
      { "time": "17:00", "title": "Ceremonia", "icon": "fa-solid fa-ring" },
      { "time": "19:00", "title": "Recepción", "icon": "fa-solid fa-champagne-glasses" },
      { "time": "20:00", "title": "Cena", "icon": "fa-solid fa-utensils" },
      { "time": "22:00", "title": "Fiesta", "icon": "fa-solid fa-music" }
    ]
  },
  "countdown": {
    "labels": {
      "days": "Días",
      "hours": "Horas",
      "minutes": "Minutos",
      "seconds": "Segundos"
    }
  },
  "gallery": {
    "photos": [
      { "url": "./assets/img/foto1.jpg", "alt": "Foto 1" },
      { "url": "./assets/img/foto2.jpg", "alt": "Foto 2" },
      { "url": "./assets/img/foto3.jpg", "alt": "Foto 3" }
    ]
  },
  "dresscode": {
    "label": "Etiqueta formal",
    "description": "Les pedimos vestimenta formal. Paleta: tonos tierra, verde salvia, vino.",
    "pinterestUrl": "https://pinterest.com/tu-tablero",
    "colors": [
      { "name": "Salvia", "hex": "#7D9B76" },
      { "name": "Cobre", "hex": "#B87333" },
      { "name": "Arena", "hex": "#C2A882" },
      { "name": "Blanco", "hex": "#F5F0E8", "avoid": true }
    ]
  },
  "gifts": {
    "title": "Mesa de Regalos",
    "subtitle": "Tu presencia es nuestro mejor regalo",
    "description": "Si deseas tener un detalle con nosotros:",
    "stores": [
      { "name": "Amazon", "url": "https://amazon.com.mx/wishlist", "icon": "fa-brands fa-amazon" },
      { "name": "Liverpool", "url": "https://liverpool.com.mx/mesa", "icon": "fa-solid fa-gift" }
    ]
  },
  "rsvp": {
    "deadline": "30 de Junio de 2026",
    "whatsapp": {
      "number": "526864602677",
      "message": "Hola! Confirmo mi asistencia. Mi nombre es: "
    },
    "buttonText": "Confirmar Asistencia"
  },
  "music": {
    "enabled": true,
    "src": "./assets/audio/background.mp3",
    "loop": true
  },
  "footer": {
    "message": "Nombres — 12 · VII · 2026",
    "brand": "Tu Marca",
    "brandUrl": "https://tu-sitio.com"
  }
}
```

---

## Paso 3: Personalizar el Tema (Opcional)

Crea `config/theme.json` solo si quieres cambiar colores o fuentes:

```json
{
  "theme": {
    "name": "mi-tema-personalizado",
    "colors": {
      "background": "#F7F3EC",
      "surface": "#EDE8DF",
      "surfaceAlt": "#F0EBE2",
      "accentPrimary": "#7D9B76",
      "accentSecond": "#B87333",
      "text": "#2A2118",
      "textMuted": "#8A7D6E",
      "ctaWhatsapp": "#25D366",
      "overlay": "rgba(42, 33, 24, 0.42)"
    },
    "fonts": {
      "display": {
        "family": "'Cormorant Garamond', serif",
        "googleUrl": "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&display=swap"
      },
      "decorative": {
        "family": "'IM Fell English', serif",
        "googleUrl": "https://fonts.googleapis.com/css2?family=IM+Fell+English:ital@0;1&display=swap"
      },
      "body": {
        "family": "'Jost', sans-serif",
        "googleUrl": "https://fonts.googleapis.com/css2?family=Jost:wght@300;400;500&display=swap"
      }
    },
    "animations": {
      "pageTransition": "0.7s",
      "heroReveal": "1.1s",
      "stagger": "120ms"
    }
  }
}
```

> **Nota**: Si no creas este archivo, la invitación usará los valores por defecto del template.

---

## Paso 4: Agregar Assets

### Imágenes

Coloca tus imágenes en `assets/img/`:

```bash
assets/img/
├── portada.jpg          # Foto principal (hero)
├── pareja.jpg           # Foto de la pareja
├── anillos.jpg          # Foto de anillos
└── decoracion.jpg       # Foto de decoración
```

### Audio (Opcional)

```bash
assets/audio/
└── background.mp3       # Música de fondo
```

---

## Paso 5: Crear index.html

Copia el `index.html` de una invitación existente (`isabella-mateo-2026` o `valentina-xv`) y ajústalo:

```html
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Cargando invitación…</title>
  
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
  <!-- Para boda: -->
  <link rel="stylesheet" href="../../templates/boda/styles/main.css" />
  <!-- Para XV: -->
  <!-- <link rel="stylesheet" href="../../templates/xv/styles/main.css" /> -->
</head>
<body class="is-loading">
  <!-- ... resto del HTML ... -->
  
  <script type="module">
    import App, { bootstrap } from '../../core/engine/App.js';
    // Para boda:
    import * as bodaSections from '../../templates/boda/sections/sections.js';
    App.registerRenderers(bodaSections);
    
    // Para XV:
    // import * as xvSections from '../../templates/xv/sections/sections.js';
    // App.registerRenderers(xvSections);
    
    bootstrap({
      template: 'boda',  // o 'xv'
      eventConfig: './config/event.json',
      themeConfig: './config/theme.json',
      // ... configuración de capítulos
    });
  </script>
</body>
</html>
```

---

## Paso 6: Probar

Inicia el servidor de desarrollo:

```bash
npm run dev
```

Accede a tu invitación:
```
http://localhost:3000/invitations/mi-nueva-invitation/
```

---

## Paso 7: Build de Producción

Cuando estés listo:

```bash
# Build de tu invitación específica
npm run build:invitation -- --name=mi-nueva-invitation

# O build de todas
npm run build
```

El output estará en `public/mi-nueva-invitation/`.

---

## ✅ Checklist Final

- [ ] `event.json` creado con todos los datos
- [ ] `theme.json` creado (si hay personalización)
- [ ] Imágenes en `assets/img/`
- [ ] Audio en `assets/audio/` (opcional)
- [ ] `index.html` configurado correctamente
- [ ] Probado en desarrollo (`npm run dev`)
- [ ] Build generado (`npm run build`)

---

## 🆘 Solución de Problemas

### La invitación no carga

1. Verifica que las rutas en `index.html` sean correctas
2. Abre la consola del navegador (F12) y revisa los errores
3. Asegúrate de que `event.json` y `theme.json` sean JSON válido

### Las imágenes no se ven

1. Verifica que las rutas en `event.json` sean relativas: `./assets/img/foto.jpg`
2. Asegúrate de que los archivos existen en esas ubicaciones

### La música no funciona

1. Verifica que `music.enabled` sea `true` en `event.json`
2. Asegúrate de que el archivo de audio existe
3. Algunos navegadores requieren interacción del usuario para reproducir audio

---

## 📚 Recursos Adicionales

- [ARQUITECTURA.md](./ARQUITECTURA.md) - Detalles de la arquitectura
- [README.md](./README.md) - Documentación general
