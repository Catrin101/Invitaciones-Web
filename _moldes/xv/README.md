# 🎉 Gudino Dev — Invitation Framework

**Template modular para invitaciones web digitales**  
Personalizable 100% por JSON, sin tocar código.

---

## 🗂️ Estructura del Proyecto

```
invitacion-template/
│
├── index.html                  ← Shell HTML (no editar para personalizar)
│
├── config/
│   ├── event.json              ← ✏️  DATOS DEL EVENTO (nombre, fecha, lugar, etc.)
│   └── theme.json              ← 🎨  DISEÑO VISUAL (colores, fuentes, tamaños)
│
├── components/
│   ├── app.js                  ← Orquestador principal (no editar)
│   ├── ConfigLoader.js         ← Carga y mergea los JSON (no editar)
│   ├── ThemeEngine.js          ← Inyecta CSS variables desde theme.json (no editar)
│   ├── sections.js             ← Componentes de cada sección (no editar)
│   └── ScrollReveal.js         ← Animaciones de entrada (no editar)
│
├── styles/
│   └── main.css                ← Estilos base — usa CSS vars, no editar valores aquí
│
├── assets/
│   └── audio/
│       └── background.mp3      ← 🎵  Reemplazar con música del cliente
│
└── README.md
```

---

## ✏️ Cómo Personalizar (Solo JSON)

### Para un nuevo evento:

**1. Edita `config/event.json`** — todos los datos del evento:

| Campo | Descripción |
|-------|-------------|
| `meta.title` | Título de la pestaña del navegador y preview de WhatsApp |
| `hero.name` | Nombre de la festejada (aparece grande en portada) |
| `hero.image` | URL de la foto principal (Unsplash, Cloudinary, o GitHub) |
| `event.date` | Fecha en formato ISO: `"2025-12-25T20:00:00"` |
| `event.venue.mapsUrl` | Link de Google Maps del salón |
| `gallery.photos` | Array de objetos `{url, alt}` — agregar o quitar fotos |
| `dresscode.colors` | Paleta visual — hex + nombre + `"avoid": true` si aplica |
| `rsvp.whatsapp.number` | Número en formato internacional sin `+`: `526864602677` |
| `rsvp.whatsapp.message` | Mensaje prellenado de WhatsApp |
| `music.src` | Ruta al archivo de audio |

**2. Edita `config/theme.json`** — identidad visual:

| Campo | Descripción |
|-------|-------------|
| `colors.background` | Color de fondo principal |
| `colors.accentPrimary` | Color dorado / color de acento principal |
| `colors.accentSecond` | Color secundario (rosa, azul, etc.) |
| `fonts.display.family` | Fuente de títulos (Google Fonts name) |
| `fonts.display.googleUrl` | URL de importación de Google Fonts |
| `fonts.body.family` | Fuente de cuerpo de texto |
| `fontSizes.heroName` | Tamaño del nombre principal (acepta `clamp()`) |
| `animations.*` | Duración de cada animación en segundos |

---

## 🎨 Temas Predefinidos (Próximamente)

Crear un archivo por tipo de evento en `config/themes/`:

```
themes/
├── xv-elegant-dark.json     ← Negro + dorado + rosa (incluido)
├── boda-ivory.json          ← Marfil + champagne + verde salvia
├── bautizo-celeste.json     ← Azul bebé + blanco + dorado suave
└── cumpleanos-festivo.json  ← Colores vibrantes, tipografía playful
```

Para usar: copiar el archivo deseado a `config/theme.json`.

---

## 🚀 Deploy

### GitHub Pages
```bash
git init
git add .
git commit -m "Invitación [Nombre del evento]"
git branch -M main
git remote add origin https://github.com/catrin101/[nombre-repo].git
git push -u origin main
# → Activar en: Settings → Pages → Source: main / root
```

### Netlify Drop (60 segundos)
1. Ir a [netlify.com/drop](https://netlify.com/drop)
2. Arrastrar la carpeta del proyecto
3. URL lista al instante

---

## ⚠️ Nota sobre Módulos ES

`index.html` usa `<script type="module">`, por lo que:
- **Producción** (GitHub Pages, Netlify): funciona sin configuración
- **Desarrollo local**: necesitas un servidor local (no `file://`)

```bash
# Opción 1 — Python (sin instalación adicional)
python3 -m http.server 8080

# Opción 2 — Node.js
npx serve .

# Opción 3 — VS Code
# Instalar extensión "Live Server" y dar click en "Go Live"
```

---

## 🎵 Música

1. Descargar MP3 libre de royalties desde [pixabay.com/music](https://pixabay.com/music)
2. Renombrar a `background.mp3`
3. Colocar en `assets/audio/`
4. El botón de música aparece automáticamente (activación manual por política del browser)

---

## 📦 Checklist de Materiales del Cliente

- [ ] Nombre completo de la festejada/o
- [ ] Fecha, hora y lugar del evento
- [ ] Link de Google Maps del salón
- [ ] Número WhatsApp para RSVP
- [ ] Mínimo 6 fotos (JPG/PNG, > 1MB c/u)
- [ ] Colores de vestimenta
- [ ] Música deseada (o confirmar genérica)
- [ ] Paleta de colores del evento (hex o referencia)
- [ ] Fuentes preferidas (o dejar a criterio)

---

## ⏱️ Tiempo Estimado por Invitación

| Tarea | Tiempo |
|-------|--------|
| Editar `event.json` con datos del cliente | 10 min |
| Editar `theme.json` con colores/fuentes | 10 min |
| Optimizar y subir fotos | 15 min |
| Deploy y pruebas | 10 min |
| **Total con template** | **~45 min** |

---

*Gudino Dev · [catrin101.github.io](https://catrin101.github.io) · (+52) 686 460 2677*
