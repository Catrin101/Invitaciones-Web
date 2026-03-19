# Invitaciones Web — Framework Escalable

Framework basado en templates para crear invitaciones web de eventos (bodas, XV años, cumpleaños, etc.) de manera rápida y eficiente.

## 🚀 Características

- **Arquitectura basada en templates**: Un solo código base para múltiples invitaciones
- **Configuración externalizada**: Todo lo personalizable en archivos JSON
- **Cero duplicación**: El código del framework se comparte entre todas las invitaciones
- **Fácil personalización**: Solo necesitas modificar archivos de configuración
- **Soporte para múltiples eventos**: Bodas, XV años, y más

## 📁 Estructura del Proyecto

```
Invitaciones-Web/
├── core/                      # Framework base (compartido)
│   ├── engine/                # Motores principales
│   │   ├── App.js            # Orquestador
│   │   ├── ConfigLoader.js   # Carga de configuración
│   │   ├── ThemeEngine.js    # Temas y colores
│   │   ├── ChapterEngine.js  # Navegación
│   │   ├── ScrollReveal.js   # Animaciones
│   │   └── MusicController.js # Música
│   ├── components/            # Componentes UI
│   │   └── Splash.js         # Pantalla de bienvenida
│   └── utils/                 # Utilidades
│       ├── dom.js            # Helpers DOM
│       └── format.js         # Formateo
│
├── templates/                 # Templates/Plantillas
│   ├── boda/                  # Template para bodas
│   │   ├── template.json     # Configuración del template
│   │   ├── styles/main.css   # Estilos
│   │   ├── sections/         # Renderizadores
│   │   └── index.html        # HTML base
│   └── xv/                    # Template para XV años
│
├── invitations/               # Invitaciones específicas
│   ├── isabella-mateo-2026/   # Instancia de boda
│   │   ├── config/
│   │   │   ├── event.json    # Datos del evento
│   │   │   └── theme.json    # Overrides de tema
│   │   ├── assets/           # Assets únicos
│   │   └── index.html        # HTML de entrada
│   └── valentina-xv/          # Instancia de XV años
│
├── tools/                     # Herramientas
│   ├── build.js              # Script de build
│   └── dev-server.js         # Servidor de desarrollo
│
├── public/                    # Build generado (producción)
├── package.json
└── README.md
```

## 🛠️ Instalación

### Requisitos previos

- Node.js >= 18.0.0
- npm o yarn

### Pasos

```bash
# Clonar el repositorio
git clone <url-del-repositorio>
cd Invitaciones-Web

# Instalar dependencias
npm install
```

## 📖 Uso

### Desarrollo

Iniciar el servidor de desarrollo:

```bash
npm run dev
```

Accede a las invitaciones en:
- Boda: http://localhost:3000/invitations/isabella-mateo-2026/
- XV: http://localhost:3000/invitations/valentina-xv/

### Build de Producción

Generar build de todas las invitaciones:

```bash
npm run build
```

Generar build de una invitación específica:

```bash
npm run build:invitation -- --name=isabella-mateo-2026
```

El output se genera en la carpeta `public/`.

## 🎨 Crear Nueva Invitación

### Paso 1: Crear carpeta de invitación

```bash
mkdir -p invitations/mi-evento/{config,assets/img,assets/audio}
```

### Paso 2: Crear configuración

**`invitations/mi-evento/config/event.json`**:

```json
{
  "couple": {
    "bride": "Nombre",
    "groom": "Nombre",
    "story": "Nuestra historia...",
    "heroImage": "./assets/img/foto.jpg"
  },
  "event": {
    "date": "2026-07-12T17:00:00",
    "dateDisplay": "12 · VII · 2026",
    "ceremony": {
      "label": "Ceremonia",
      "time": "5:00 PM",
      "venue": "Lugar",
      "address": "Dirección",
      "mapsUrl": "https://maps.google.com/..."
    }
  },
  "gallery": {
    "photos": [
      { "url": "./assets/img/foto1.jpg", "alt": "Descripción" }
    ]
  },
  "rsvp": {
    "deadline": "30 de Junio de 2026",
    "whatsapp": {
      "number": "526864602677",
      "message": "Hola! Confirmo mi asistencia..."
    }
  }
}
```

**`invitations/mi-evento/config/theme.json`**:

```json
{
  "theme": {
    "name": "mi-tema-personalizado",
    "colors": {
      "background": "#F7F3EC",
      "accentPrimary": "#7D9B76"
    },
    "fonts": {
      "display": {
        "family": "'Cormorant Garamond', serif",
        "googleUrl": "https://fonts.googleapis.com/css2?family=Cormorant+Garamond"
      }
    }
  }
}
```

### Paso 3: Crear index.html

Copia el `index.html` de una invitación existente y ajusta las rutas:

```html
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Cargando invitación…</title>
  
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
  <link rel="stylesheet" href="../../templates/boda/styles/main.css" />
</head>
<body class="is-loading">
  <audio id="bg-audio" loop preload="none"></audio>
  <button id="music-btn" aria-label="Reproducir música">
    <i class="fa-solid fa-music"></i>
  </button>
  <nav id="side-nav"></nav>
  <div id="chapter-counter"></div>
  <nav class="chapter-nav">
    <button id="btn-prev"><i class="fa-solid fa-arrow-left"></i></button>
    <button id="btn-next"><i class="fa-solid fa-arrow-right"></i></button>
  </nav>
  
  <div id="splash-screen">
    <div class="splash__curtain">
      <div class="splash__curtain-left"></div>
      <div class="splash__curtain-right"></div>
    </div>
    <div class="splash__content">
      <p class="splash__pre">Te invitamos a</p>
      <h2 class="splash__name"></h2>
      <button id="splash-btn">Abrir invitación</button>
    </div>
  </div>
  
  <div id="stage">
    <section id="ch-welcome" class="chapter"></section>
    <section id="ch-hero" class="chapter"></section>
    <!-- ... más secciones ... -->
  </div>
  
  <script type="module">
    import App, { bootstrap } from '../../core/engine/App.js';
    import * as bodaSections from '../../templates/boda/sections/sections.js';
    
    App.registerRenderers(bodaSections);
    
    bootstrap({
      template: 'boda',
      eventConfig: './config/event.json',
      themeConfig: './config/theme.json',
      chapters: [
        { id: 'ch-welcome', label: 'Bienvenida' },
        { id: 'ch-hero', label: 'Portada' },
        // ... más capítulos
      ],
      renderOrder: [
        { id: 'renderMeta', args: [] },
        { id: 'renderSplash', args: [] },
        // ... más renderizadores
      ],
    });
  </script>
</body>
</html>
```

### Paso 4: Agregar assets

Coloca tus imágenes en `invitations/mi-evento/assets/img/` y audio en `assets/audio/`.

### Paso 5: Probar

```bash
npm run dev
# Accede a: http://localhost:3000/invitations/mi-evento/
```

### Paso 6: Build

```bash
npm run build
```

## 🎭 Crear Nuevo Template

Para crear un template completamente nuevo (ej. cumpleaños):

1. Crear carpeta `templates/cumpleanos/`
2. Crear `template.json` con la configuración
3. Crear `styles/main.css` con los estilos
4. Crear `sections/sections.js` con los renderizadores
5. Crear `index.html` base

## 📦 Comandos Disponibles

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Inicia servidor de desarrollo |
| `npm run build` | Build de todas las invitaciones |
| `npm run build:invitation -- --name=X` | Build de una invitación específica |
| `npm run clean` | Elimina la carpeta public |

## 🌐 Deploy

### GitHub Pages

```bash
# Después de npm run build
git add public/
git commit -m "Build production"
git subtree push --prefix public origin gh-pages
```

### Hosting tradicional

Copia el contenido de `public/` a tu hosting.

## 📄 Licencia

MIT

## 👨‍💻 Autor

Gudino Dev

---

Para más detalles, ver [ARQUITECTURA.md](./ARQUITECTURA.md).
