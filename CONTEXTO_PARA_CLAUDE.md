# Contexto del Proyecto INVICTUS BARBERIA — Para Claude

## Quién eres tú (el usuario)
- Nombre: José (GitHub: mengjota)
- Nivel: Principiante en web dev, aprendes haciendo
- Idioma: Español
- Herramientas: VS Code + GitHub

## El proyecto
- **Nombre:** INVICTUS BARBERIA
- **Repo:** https://github.com/mengjota/vikingos
- **Ruta local:** `C:\Users\josej\Documents\vikingos`
- **Stack:** Next.js 16, TypeScript, Tailwind CSS v4
- **Temática:** Barbería artesanal, estética vikinga/rústica premium

## Colores principales
- Dorado: `#c8921a`
- Fondo oscuro: `#0f0d0a` / `#1a1510`
- Crema: `#f0e6c8`
- Marrón suave: `#b8a882`

## Sistema de fuentes (Google Fonts)
| Variable CSS | Fuente | Uso |
|---|---|---|
| `--font-cinzel-decorative` | Cinzel Decorative | Solo el logo INVICTUS |
| `--font-oswald` | Oswald | Nombres de servicios, barberos, productos |
| `--font-barlow` | Barlow Condensed | Botones, nav, etiquetas uppercase |
| `--font-lato` | Lato | Descripciones, cuerpo |
| `--font-im-fell` | IM Fell English | Citas poéticas únicamente |

## Páginas del sitio
- `/` — Página principal (Hero + Servicios + ElGremio + Footer)
- `/reservar` — Reserva en 3 pasos con animaciones y glow
- `/nosotros` — Historia de INVICTUS, fundador y staff
- `/productos` — 9 productos en 3 categorías

## Estilo visual — MUY IMPORTANTE
El usuario quiere efecto cinematográfico de luminosidad máxima:
- **Glow pulsante** en los cards con `animation: inner-glow-breathe`
- **Selected pulse** cuando el card está seleccionado
- **Triple box-shadow** en botones y elementos activos
- **Inputs reactivos** que brillan cuando tienen contenido
- **Ambient radial light** detrás de los grids

## Clases CSS clave (en globals.css)
```css
.service-card { animation: inner-glow-breathe 4s ease-in-out infinite; }
.service-card.selected { animation: selected-pulse 2.5s ease-in-out infinite; }
.icon-glow-idle { filter: drop-shadow(0 0 3px rgba(200,146,26,0.35)); }
.btn-glow { /* glow dorado en botones */ }
.badge-pulse { /* badge animado */ }
.card-glow { /* glow en cards de barberos */ }
```

## Problemas conocidos del entorno
- Node.js no aparece en PATH de bash → siempre prefijar con:
  `export PATH="$PATH:/c/Program Files/nodejs:/c/Users/josej/AppData/Roaming/npm"`

## Lo que se ha completado
- [x] Sitio completo con todas las páginas
- [x] Iconos SVG animados en servicios (scissors, razor, comb, beard, child, crown)
- [x] Sistema de glow cinematográfico en /reservar (3 pasos)
- [x] Todos los barberos con título "Barbero Profesional"
- [x] Tipografía profesional con jerarquía (Oswald/Barlow/Lato)
- [x] Push a GitHub

## Último commit
`f0a467f` — Refinar jerarquía tipográfica: Oswald en títulos, Barlow en etiquetas

## Cómo trabajamos
- Paso a paso, sin apuro
- Claude ejecuta todo (npm, git, edición de archivos)
- Siempre `npm run build` antes de hacer push
- El usuario confirma visualmente antes de continuar
