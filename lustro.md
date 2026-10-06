# Lustro

Lustro is a dark-first design language: a deep indigo-black canvas, translucent **glass surfaces**, and an **indigo-to-pink/cyan gradient** accent system. Reference implementation: TemplateMo `tm-624`. This page is the build guide - copy tokens straight from here.

## Colors {#colors}

### Core palette

<div class="swatch-grid">
  <div class="swatch"><div class="chip" style="background:#6366f1"></div><div class="meta">Indigo<br><code>#6366f1</code></div></div>
  <div class="swatch"><div class="chip" style="background:#818cf8"></div><div class="meta">Indigo soft<br><code>#818cf8</code></div></div>
  <div class="swatch"><div class="chip" style="background:#a5b4fc"></div><div class="meta">Indigo softer<br><code>#a5b4fc</code></div></div>
  <div class="swatch"><div class="chip" style="background:#ec4899"></div><div class="meta">Pink<br><code>#ec4899</code></div></div>
  <div class="swatch"><div class="chip" style="background:#f472b6"></div><div class="meta">Pink soft<br><code>#f472b6</code></div></div>
  <div class="swatch"><div class="chip" style="background:#22d3ee"></div><div class="meta">Cyan<br><code>#22d3ee</code></div></div>
</div>

### Surfaces

<div class="swatch-grid">
  <div class="swatch"><div class="chip" style="background:#07070f"></div><div class="meta">Background<br><code>#07070f</code></div></div>
  <div class="swatch"><div class="chip" style="background:rgba(148,140,255,0.07)"></div><div class="meta">Glass<br><code>rgba(148,140,255,.07)</code></div></div>
  <div class="swatch"><div class="chip" style="background:rgba(148,140,255,0.12)"></div><div class="meta">Glass raised<br><code>rgba(148,140,255,.12)</code></div></div>
  <div class="swatch"><div class="chip" style="background:rgba(148,140,255,0.16)"></div><div class="meta">Glass border<br><code>rgba(148,140,255,.16)</code></div></div>
</div>

- Body text: `#ffffff`. Secondary text: `#b8b3b0`.
- Semantic: success `#00d992`, error `#ef4444`, warning `#fbbf24`. Keep status chips on semantic colors, not brand gradients.

### Gradients

Primary accent (buttons, active tabs, highlights):

<div class="gradient-bar" style="background-image:linear-gradient(90deg,#6366f1,#ec4899)"></div>

`linear-gradient(90deg, #6366f1, #ec4899)`

Full spectrum (hero headings, decorative):

<div class="gradient-bar" style="background-image:linear-gradient(90deg,#818cf8,#ec4899,#22d3ee)"></div>

`linear-gradient(90deg, #818cf8, #ec4899, #22d3ee)`

Ambient background glow (fixed, behind everything):

```css
background-image:
  radial-gradient(60rem 30rem at 85% -10%, rgba(99, 102, 241, 0.18), transparent 60%),
  radial-gradient(50rem 25rem at -10% 110%, rgba(236, 72, 153, 0.12), transparent 60%);
background-attachment: fixed;
```

::: warning Gradients go on `background-image`, never `background-color`
CSS `background-color` cannot hold a gradient. Frameworks that paint buttons via a `background-color` variable (Bootstrap's `--bs-btn-bg` does this) will silently drop the gradient. Put gradient fills on `background-image` and leave `background-color` transparent.
:::

## Typography {#typography}

| Role | Font | Usage |
|---|---|---|
| Display / headings | **Space Grotesk** (500-700) | h1-h3, hero copy, tight `-0.01em` tracking |
| Body / UI | **DM Sans** (400-700) | paragraphs, labels, controls |
| Code / data | **JetBrains Mono** | code, hex values, IDs, timestamps |

```html
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700&family=JetBrains+Mono:wght@400;600&display=swap" rel="stylesheet">
```

## Components {#components}

Explore the interactive [component catalog](/components), [graphs](/graphs), and [motion patterns](/motion).

### Glass card

```css
.card {
  background: rgba(148, 140, 255, 0.07);
  border: 1px solid rgba(148, 140, 255, 0.16);
  border-radius: 16px;
  backdrop-filter: blur(12px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
}
```

Raised state: swap the background for `rgba(148, 140, 255, 0.12)`.

### Primary button

```css
.btn-primary {
  background-image: linear-gradient(90deg, #6366f1, #ec4899);
  background-color: transparent;
  border: 0;
  color: #fff;
  border-radius: 12px;
  font-family: 'DM Sans', sans-serif;
  font-weight: 600;
}
```

### Active nav tab

Same gradient as the primary button, with a soft glow: `box-shadow: 0 0 16px rgba(99, 102, 241, 0.45)`.

## Data visualization {#data-viz}

Series order for charts and sparklines: indigo `#6366f1`, pink `#ec4899`, cyan `#22d3ee`, indigo-soft `#818cf8`, emerald `#10b981`, amber `#fbbf24`. Sparklines default to the indigo stroke with a 20%-opacity fill of the same color.

Reference overlays stay on that same scale and off the brand gradient: a **dashed cyan** `#22d3ee` line for the arithmetic mean, and a **solid indigo-soft** `#818cf8` stroke for an ordinary-least-squares linear trend. Name both in the legend. Average is a horizontal reference; trend is a fitted line across ordered categories, not a smoothed path through every point. See [Graphs](/graphs#charts-overlay).

## Rules of thumb

1. Dark canvas always; Lustro has no light mode.
2. One gradient accent per view - if the primary button is a gradient, nearby accents stay flat.
3. Text over glass sits at full opacity; only surfaces are translucent.
4. Status stays semantic: success/error/warning never use brand gradients.

## More components

The full Bootstrap-depth set (52 sections) is on [Components: Bootstrap set](/lustro/components-more).

See also the [Cart summary](/lustro/cart-summary) receipt component and the [Price timeline](/lustro/price-timeline) chart card the [Gauges](/lustro/gauges) the [Operations dashboard](/lustro/ops-dashboard) the [Waste dashboard](/lustro/waste-dashboard) the [Project dashboard](/lustro/project-dashboard) the [Forecast](/lustro/forecast) the [Order view](/lustro/order-view) the [Dashboard blocks](/lustro/blocks) the [Sales dashboard](/lustro/sales-dashboard) the [AP dashboard](/lustro/ap-dashboard) the [Log entry](/lustro/log-entry) and the [Workflow operations](/lustro/workflow-ops).
