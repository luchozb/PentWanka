---
name: WankaPets Premium
colors:
  canvas: '#F9FAFB'
  surface: '#FFFFFF'
  surface-muted: '#F4F4F5'
  ink: '#18181B'
  ink-secondary: '#52525B'
  ink-tertiary: '#A1A1AA'
  border: '#E4E4E7'
  accent: '#0F766E'
  accent-deep: '#0B4F47'
  accent-soft: '#E7F5F2'
  urgent: '#B42318'
  urgent-soft: '#FEF2F2'
  success: '#15803D'
  warning: '#A16207'
  warning-soft: '#FEF3C7'
typography:
  display:
    fontFamily: Outfit
    fontSize: clamp(2.25rem, 5vw, 3.75rem)
    fontWeight: '700'
    lineHeight: 1.1
    letterSpacing: -0.025em
  heading:
    fontFamily: Outfit
    fontSize: 1.5rem
    fontWeight: '700'
    lineHeight: 1.2
    letterSpacing: -0.02em
  body:
    fontFamily: Geist
    fontSize: 1rem
    fontWeight: '400'
    lineHeight: 1.65
    letterSpacing: '0'
  label:
    fontFamily: Geist
    fontSize: 0.75rem
    fontWeight: '600'
    lineHeight: 1.2
    letterSpacing: 0.06em
  mono:
    fontFamily: 'Geist Mono'
    fontSize: 0.875rem
    fontWeight: '500'
    lineHeight: 1.4
    letterSpacing: '0'
rounded:
  sm: 0.5rem
  md: 0.75rem
  lg: 1.25rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 8px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  section: clamp(3rem, 8vw, 6rem)
  container: 1320px
---

# Design System: WankaPets Premium

## 1. Visual Theme & Atmosphere

Una interfaz cívica contemporánea, sobria y cálida: superficies Zinc neutrales, un único acento teal del Valle del Mantaro y ritmo espacial generoso. La densidad es equilibrada (5), la variación es moderada (6) y el movimiento es fluido pero nunca teatral (6). El resultado se siente institucional sin ser rígido, cercano sin caer en lo informal.

La identidad anterior mezclaba azules de filtro, seis rojos distintos, tipografías duplicadas y emojis. Este sistema consolida todo en una sola voz: Outfit para títulos, Geist para texto y Geist Mono para cifras y códigos. Cada color tiene un rol único y cada componente comparte radios, bordes y sombras.

## 2. Color Palette & Roles

### Primary Foundation
- **Canvas White** (`#F9FAFB`) — fondo general de la aplicación.
- **Pure Surface** (`#FFFFFF`) — tarjetas, nav, paneles y campos.
- **Quiet Gray** (`#F4F4F5`) — superficies secundarias, filas alternas y estados deshabilitados.
- **Hairline Border** (`#E4E4E7`) — separadores de 1px y bordes estructurales.

### Accent & Interactive
- **Mantaro Teal** (`#0F766E`) — acento único: CTA primario, activos, foco y enlaces. Saturación 77%, por debajo del límite del 80%.
- **Deep Teal** (`#0B4F47`) — mismo hue en su variante oscura para títulos y hover.
- **Teal Mist** (`#E7F5F2`) — fondos de badges, callouts y estados seleccionados.

### Typography & Text Hierarchy
- **Charcoal Ink** (`#18181B`) — títulos y texto principal (nunca negro puro).
- **Steel Secondary** (`#52525B`) — cuerpo, descripciones y metadatos.
- **Faint Gray** (`#A1A1AA`) — texto terciario, placeholder y datos inactivos.

### Functional States
- **Urgent Red** (`#B42318`) — excepción funcional: CTA de reporte de pérdida y errores. No se usa en otros botones.
- **Urgent Wash** (`#FEF2F2`) — fondo de alertas y mensajes de error.
- **Success Green** (`#15803D`) — confirmaciones y estados verificados.
- **Warning Amber** (`#A16207` / `#FEF3C7`) — cupos bajos y advertencias no críticas.

Colores prohibidos: azules de filtro (`#1E3A8A`, `#93C5FD`), teals duplicados (`#006553`, `#056254`, `#115E59`), rojos múltiples, `#000000`, neón y degradados de acento.

## 3. Typography Rules

### Hierarchy & Weights
- **Display:** Outfit 700, `clamp(2.25rem, 5vw, 3.75rem)`, tracking `-0.025em`, leading `1.1`. Solo para héroes.
- **Heading:** Outfit 700, `1.5rem`, tracking `-0.02em`. Jerarquía por peso y color, no por tamaño excesivo.
- **Body:** Geist 400, `1rem/1.65`, ancho máximo `65ch`, color Steel Secondary.
- **Label:** Geist 600, `0.75rem`, tracking `0.06em`, uppercase solo en etiquetas de sección.
- **Mono:** Geist Mono 500 para códigos de adopción, teléfonos y cifras del observatorio.

### Spacing Principles
Escala estricta de 8px (`4 / 8 / 16 / 24 / 32`). Separación entre secciones `clamp(3rem, 8vw, 6rem)`. Mínimo 44px de área táctil en móvil. Sin `!important`.

## 4. Component Stylings

### Buttons
Superficie plana, sin glow. Primario: relleno Mantaro Teal con texto blanco. Secundario: ghost con borde Hairline. Urgente: relleno Urgent Red, **solo** para "Reportar Pérdida". Radio `0.75rem`, altura mínima 44px. Hover: cambio de tono sin sombra exterior; active: `translateY(-1px)` followed by `scale(0.985)` al soltar.

### Cards & Domain Containers
Radio `1.25rem`, borde 1px Hairline, sombra difusa `0 18px 40px -24px rgba(24,24,27,0.18)`. Padding interno `1.5rem–2rem`. Se usan solo cuando la elevación comunica jerarquía; listas densas usan divisores `border-top`. Imágenes full-bleed dentro de tarjeta con radio heredado.

### Navigation
Sticky, blanca, borde inferior Hairline. Enlace activo: color acento + barra inferior de 2px. Mobile: menú colapsable con etiqueta visible, sin hamburger diminuto. Cintillo institucional en Deep Teal con texto pequeño y sin emojis.

### Inputs & Forms
Label arriba, campo con borde Hairline y radio `0.5rem`, foco con anillo de 2px en acento y offset 2px. Texto de ayuda opcional y error debajo en Urgent Red. Altura mínima 44px.

### Observatorio & Reporte Wizard
Cifras en Geist Mono dentro de callouts Teal Mist. Barras de progreso con track Quiet Gray y relleno acento; el rojo queda reservado para ocupación crítica. El wizard usa steps con indicador numérico y estados completado/activo/pendiente.

### Dialogs
Backdrop `rgba(24,24,27,0.55)` con `backdrop-filter: blur(6px)`. Panel centrado, radio `1.5rem`, sombra difusa, cierre con Escape y foco inicial en el primer control. Sin animaciones de entrada superiores a 280ms.

## 5. Layout Principles

### Grid & Structure
Contenedor máximo `1320px`, centrado, padding `1rem` móvil / `2rem` tablet / `3rem` desktop. CSS Grid para toda estructura; `.page-grid--with-aside` crea `2fr 1fr` sobre 992px y una sola columna por debajo. Prohibido `calc()` para fracciones.

### Whitespace Strategy
Secciones separadas por `clamp(3rem, 8vw, 6rem)`. Tarjetas con `gap: 1.5rem`. Sin apilamiento absoluto de contenido: cada elemento ocupa su propia celda.

### Alignment & Visual Balance
Héroes alineados a la izquierda con visual a la derecha (split 55/45). No se usan filas de 3 tarjetas iguales: se prefiere grilla asimétrica 2fr 1fr 1fr o scroll horizontal.

### Responsive Behavior & Touch
Debajo de 768px todo pasa a una columna, sin scroll horizontal. Títulos escalan con `clamp()`. Botones full-width en móvil. Navegación colapsa a menú etiquetado.

## 6. Motion & Interaction

Movimiento spring con `cubic-bezier(0.16, 1, 0.3, 1)` y duración `280ms`. Entradas escalonadas de listas con retardo de `60ms` por índice. Micro-interacciones perpetuas solo en estados activos (punto de "en vivo" en el observatorio). Se animan exclusivamente `transform` y `opacity`. Sin spinners circulares: se usa shimmer esquelético.

## 7. Anti-Patterns (Banned)

Sin emojis en UI, sin `Inter`, sin negro puro, sin glows, sin azules de filtro, sin rojos duplicados, sin degradados en títulos, sin cursores personalizados, sin superposición de texto sobre imágenes, sin filas de 3 tarjetas iguales, sin "Scroll to explore", sin datos inventados, sin `LABEL // YEAR`, sin clichés de copywriting, sin `!important`, sin estilos inline estáticos.
