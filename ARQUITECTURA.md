# Arquitectura Escalable para Invitaciones Web

## Problema Actual

Actualmente, cada invitación se crea copiando completamente un molde (`_moldes/boda`, `_moldes/xv`) a una nueva carpeta (`boda-demo`, `xv-demo`). Esto genera:

- **Duplicación de código**: Los mismos archivos JS/CSS existen en múltiples carpetas
- **Mantenimiento costoso**: Cualquier mejora o bug fix requiere modificar N archivos
- **Escalabilidad nula**: 1000 invitaciones = 1000 copias de los mismos archivos
- **Recursos duplicados**: Imágenes, fuentes y assets se repiten innecesariamente

---

## Solución Propuesta: Arquitectura Basada en Templates

### Principios de Diseño

1. **Separación de responsabilidades**: Lógica del framework vs. datos específicos del evento
2. **Reutilización máxima**: Un solo código base para todas las invitaciones
3. **Configuración externalizada**: Todo lo personalizable en archivos JSON
4. **Sistema de templates**: Cada tipo de invitación define su estructura y estilo
5. **Carga bajo demanda**: Recursos se cargan solo cuando se necesitan

---

## Estructura de Carpetas Propuesta

```
Invitaciones-Web/
├── core/                      # Framework base (compartido por TODAS las invitaciones)
│   ├── engine/
│   │   ├── App.js            # Orquestador principal
│   │   ├── ConfigLoader.js   # Carga configuración (event.json + theme.json)
│   │   ├── ThemeEngine.js    # Inyecta variables CSS y fuentes
│   │   ├── SectionRenderer.js # Renderiza secciones dinámicamente
│   │   ├── ScrollReveal.js   # Animaciones al hacer scroll
│   │   └── MusicController.js # Control de audio
│   ├── components/
│   │   ├── Splash.js         # Pantalla de bienvenida
│   │   ├── Navigation.js     # Navegación (dots, flechas)
│   │   ├── Gallery.js        # Lightbox para galerías
│   │   └── Countdown.js      # Cuenta regresiva
│   └── utils/
│       ├── dom.js            # Helpers para manipulación del DOM
│       └── format.js         # Formateo de fechas, textos
│
├── templates/                 # Moldes/Plantillas (definen estructura y estilo)
│   ├── boda/
│   │   ├── template.json     # Define secciones, orden, layout
│   │   ├── styles.css        # CSS específico del template
│   │   ├── sections/         # Renderizadores específicos de cada sección
│   │   │   ├── hero.js
│   │   │   ├── story.js
│   │   │   └── ...
│   │   └── assets/           # Assets compartidos del template (decoraciones, íconos)
│   │
│   └── xv/
│       ├── template.json
│       ├── styles.css
│       ├── sections/
│       └── assets/
│
├── invitations/               # Invitaciones específicas (SOLO configuración + assets únicos)
│   ├── isabella-mateo-2026/
│   │   ├── config/
│   │   │   ├── event.json    # Datos del evento (nombres, fecha, lugar)
│   │   │   └── theme.json    # Overrides del tema (colores, fuentes)
│   │   ├── assets/           # Assets únicos (fotos de la pareja, audio)
│   │   │   ├── img/
│   │   │   └── audio/
│   │   └── index.html        # HTML mínimo que apunta al core + template
│   │
│   └── valentina-xv/
│       ├── config/
│       ├── assets/
│       └── index.html
│
├── public/                    # Build generado (listo para deploy)
│   ├── isabella-mateo-2026/  # Invitación compilada
│   ├── valentina-xv/
│   └── ...
│
├── tools/                     # Herramientas de build y desarrollo
│   ├── build.js              # Script de build
│   ├── dev-server.js         # Servidor de desarrollo
│   └── deploy.js             # Deploy automático
│
├── package.json              # Dependencias y scripts
└── ARQUITECTURA.md           # Este documento
```

---

## Flujo de Funcionamiento

### 1. Build Time

```
┌─────────────────────────────────────────────────────────────┐
│  PRODUCCIÓN (build)                                         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  templates/boda/          invitations/isabella-mateo/       │
│  ├── template.json        ├── config/event.json             │
│  ├── styles.css           ├── config/theme.json             │
│  └── sections/            └── assets/                       │
│            │                          │                     │
│            └──────────┬───────────────┘                     │
│                       ▼                                     │
│              ┌─────────────────┐                            │
│              │   Build Script  │                            │
│              └────────┬────────┘                            │
│                       ▼                                     │
│         public/isabella-mateo/                              │
│         ├── index.html (bundled)                            │
│         ├── core.min.js                                     │
│         ├── template-boda.min.css                           │
│         ├── config.json (merged)                            │
│         └── assets/ (optimizados)                           │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 2. Runtime (Navegador)

```
┌─────────────────────────────────────────────────────────────┐
│  EJECUCIÓN EN EL NAVEGADOR                                  │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  1. index.html carga core.js + template.css                 │
│                                                             │
│  2. core/App.js se inicializa:                              │
│     ┌─────────────────────────────────────────────────┐    │
│     │ a) Carga config/event.json + config/theme.json  │    │
│     │ b) Fusiona con defaults del template            │    │
│     │ c) ThemeEngine aplica variables CSS             │    │
│     │ d) SectionRenderer renderiza cada sección       │    │
│     │ e) Inicializa navegación y animaciones          │    │
│     └─────────────────────────────────────────────────┘    │
│                                                             │
│  3. Usuario interactúa → animaciones, música, RSVP          │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Archivos Clave

### `templates/{nombre}/template.json`

Define la estructura del template:

```json
{
  "name": "boda-editorial",
  "description": "Editorial de lujo para bodas",
  "version": "1.0.0",
  
  "sections": [
    { "id": "hero", "component": "HeroBoda", "order": 1 },
    { "id": "story", "component": "Story", "order": 2 },
    { "id": "countdown", "component": "Countdown", "order": 3 },
    { "id": "details", "component": "DetailsBoda", "order": 4 },
    { "id": "itinerary", "component": "Itinerary", "order": 5 },
    { "id": "gallery", "component": "Gallery", "order": 6 },
    { "id": "dresscode", "component": "DressCode", "order": 7 },
    { "id": "gifts", "component": "GiftRegistry", "order": 8 },
    { "id": "rsvp", "component": "RSVP", "order": 9 }
  ],
  
  "features": {
    "splash": true,
    "music": true,
    "navigation": "chapter-dots",
    "animations": "scroll-reveal"
  },
  
  "defaults": {
    "colors": {
      "background": "#F7F3EC",
      "surface": "#EDE8DF",
      "accentPrimary": "#7D9B76"
    },
    "fonts": {
      "display": "Cormorant Garamond",
      "body": "Jost"
    }
  }
}
```

### `invitations/{nombre}/config/event.json`

Datos específicos del evento:

```json
{
  "couple": {
    "bride": "Isabella",
    "groom": "Mateo",
    "story": "Nos conocimos en una tarde de lluvia...",
    "heroImage": "./assets/img/pareja.jpg"
  },
  "event": {
    "date": "2026-07-12T17:00:00",
    "ceremony": { ... },
    "reception": { ... }
  },
  "gallery": { "photos": [...] },
  "rsvp": { "whatsapp": { "number": "526864602677" } }
}
```

### `invitations/{nombre}/index.html`

HTML mínimo (100-150 líneas):

```html
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Cargando invitación…</title>
  
  <!-- Core del framework (CDN o local) -->
  <link rel="stylesheet" href="../../core/core.css" />
  <!-- Template específico -->
  <link rel="stylesheet" href="../../templates/boda/styles.css" />
</head>
<body>
  <!-- Contenedores vacíos que el core llenará -->
  <div id="splash"></div>
  <div id="app"></div>
  
  <!-- Entry point -->
  <script type="module">
    import { bootstrap } from '../../core/engine/App.js';
    bootstrap({
      template: 'boda',
      config: './config/event.json',
      theme: './config/theme.json'
    });
  </script>
</body>
</html>
```

---

## Creación de Nueva Invitación

### Flujo Actual (Ineficiente)
1. Copiar `_moldes/boda` a `nueva-invitation`
2. Modificar `event.json` y `theme.json`
3. Modificar manualmente `sections.js` si hay cambios estructurales
4. Duplicar assets aunque sean iguales

**Problema**: 500 líneas de código duplicadas por invitación

### Flujo Propuesto (Eficiente)
1. Crear carpeta `invitations/nueva-invitation/`
2. Crear `config/event.json` con datos del evento
3. Crear `config/theme.json` (solo si hay overrides)
4. Crear `index.html` (copiar plantilla base de 50 líneas)
5. Agregar assets únicos en `assets/`

**Ventaja**: ~50 líneas de configuración + assets únicos. **Cero duplicación de lógica**

---

## Creación de Nuevo Template

Cuando se necesite un nuevo tipo de invitación (ej. `cumpleanos`, `graduacion`):

1. Crear `templates/cumpleanos/`
2. Definir `template.json` con secciones específicas
3. Crear `styles.css` con el diseño visual
4. Implementar renderizadores en `sections/` (solo los diferentes al core)
5. Reutilizar componentes del core (Splash, Navigation, Gallery, etc.)

**Ventaja**: Un template nuevo no afecta las invitaciones existentes

---

## Sistema de Build

### Script `tools/build.js`

```javascript
// Pseudocódigo del build
for each invitation in invitations/:
  1. Leer template.json del template referenciado
  2. Leer event.json y theme.json de la invitación
  3. Fusionar configuraciones (defaults del template + overrides)
  4. Copiar core/ a public/{invitation}/
  5. Copiar styles del template a public/{invitation}/
  6. Optimizar assets (imágenes, audio)
  7. Generar index.html final con paths correctos
  8. Minificar JS/CSS (producción)
```

### Comandos npm

```bash
npm run dev              # Servidor local con hot-reload
npm run build            # Build de producción de todas las invitaciones
npm run build:invitation -- --name=isabella-mateo  # Build individual
npm run deploy           # Deploy a hosting
```

---

## Ventajas de Esta Arquitectura

| Aspecto | Antes | Después |
|---------|-------|---------|
| **Código duplicado** | 500+ líneas por invitación | ~50 líneas (config) |
| **Agregar feature** | Modificar N archivos | 1 archivo en `core/` |
| **Bug fix** | Modificar N archivos | 1 archivo en `core/` |
| **Nuevo template** | N/A (solo copias) | Carpeta `templates/` independiente |
| **Nueva invitación** | Copiar molde + editar | Solo config JSON + assets |
| **Tamaño hosting** | 10 MB × 100 invitaciones | 10 MB core + assets únicos |
| **Testing** | Testear cada copia | Testear core + templates |

---

## Migración Gradual

### Fase 1: Preparar Core (Semana 1)
- [ ] Mover `components/` de `_moldes/boda` a `core/engine/`
- [ ] Extraer lógica común a `core/components/`
- [ ] Crear sistema de templates con `template.json`

### Fase 2: Convertir Templates (Semana 2)
- [ ] Mover `_moldes/boda` → `templates/boda`
- [ ] Mover `_moldes/xv` → `templates/xv`
- [ ] Adaptar `sections.js` a sistema modular

### Fase 3: Migrar Invitaciones Existentes (Semana 3)
- [ ] Mover `boda-demo` → `invitations/isabella-mateo`
- [ ] Mover `xv-demo` → `invitations/valentina-xv`
- [ ] Actualizar paths en `index.html`

### Fase 4: Sistema de Build (Semana 4)
- [ ] Implementar `tools/build.js`
- [ ] Configurar optimización de assets
- [ ] Scripts npm para dev/prod

---

## Ejemplo: Crear Invitación de Cumpleaños

### 1. Template nuevo (`templates/cumpleanos/`)

```
templates/cumpleanos/
├── template.json       # Secciones: hero, countdown, gallery, gifts, rsvp
├── styles.css          # Colores vibrantes, fuentes divertidas
├── sections/
│   ├── hero.js         # Hero con globos
│   └── gifts.js        # Lista de deseos
└── assets/
    └── decorations/    # SVGs de globos, pasteles
```

### 2. Invitación específica (`invitations/sofia-5-anios/`)

```
invitaciones/sofia-5-anios/
├── config/
│   ├── event.json      # Nombre: Sofía, edad: 5, fecha, lugar
│   └── theme.json      # Colores: rosa, morado, dorado
├── assets/
│   └── img/
│       └── sofia.jpg   # Foto de la cumpleañera
└── index.html          # 50 líneas, referencia al template "cumpleanos"
```

**Total de código nuevo**: 3 archivos JSON + 1 HTML mínimo + 1 foto
**Código reutilizado**: Todo el core + componentes del template

---

## Consideraciones de Hosting

### Opción A: GitHub Pages (Recomendado para empezar)

```
public/
├── isabella-mateo/     # https://usuario.github.io/isabella-mateo
├── valentina-xv/       # https://usuario.github.io/valentina-xv
└── sofia-5-anios/      # https://usuario.github.io/sofia-5-anios
```

### Opción B: Hosting con Subdominios

```
isabella.invitaciones.com   → public/isabella-mateo/
valentina.invitaciones.com  → public/valentina-xv/
```

### Opción C: Single Page App con Routing

```
invitaciones.com/boda/isabella-mateo
invitaciones.com/xv/valentina
invitaciones.com/cumpleanos/sofia-5-anios
```

---

## Próximos Pasos Inmediatos

1. **Validar esta arquitectura** con el equipo
2. **Crear rama `refactor/arquitectura`** en el repositorio
3. **Implementar Fase 1** (extraer core)
4. **Probar con una invitación** antes de migrar todas
5. **Documentar proceso** de creación de nuevas invitaciones

---

## Preguntas Frecuentes

### ¿Qué pasa si dos templates necesitan secciones similares pero con diseño diferente?

El `SectionRenderer` del core acepta un `templateId`. Cada template puede tener su propia versión de una sección en `templates/{nombre}/sections/`.

### ¿Puedo personalizar una invitación específica sin afectar las demás?

Sí. El sistema de `theme.json` permite overrides. Si necesitas una sección completamente diferente, crea un override en la carpeta de la invitación.

### ¿Cómo manejo assets compartidos entre múltiples invitaciones?

Los assets del template (`templates/boda/assets/`) son compartidos. Los assets únicos van en cada `invitations/{nombre}/assets/`.

### ¿Puedo usar esta arquitectura sin build step?

Sí. En modo desarrollo, el `index.html` puede cargar los módulos ES6 directamente desde `core/` y `templates/`. El build es opcional y solo para optimización en producción.

---

## Conclusión

Esta arquitectura transforma un proceso de **copiar y pegar** en un sistema de **configurar y personalizar**, reduciendo el esfuerzo de mantenimiento en un 90% y permitiendo escalar a cientos de invitaciones sin deuda técnica acumulada.
