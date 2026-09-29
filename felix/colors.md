# Colors

### Named brand colors

<div class="swatch-grid">
  <div class="swatch"><div class="chip" style="background:#2bf2f1"></div><div class="meta">Turquoise<br><code>#2bf2f1</code></div></div>
  <div class="swatch"><div class="chip" style="background:#dcff00"></div><div class="meta">Lime<br><code>#dcff00</code></div></div>
  <div class="swatch"><div class="chip" style="background:#082422"></div><div class="meta">Slate<br><code>#082422</code></div></div>
  <div class="swatch"><div class="chip" style="background:#fefcf9"></div><div class="meta">Linen<br><code>#fefcf9</code></div></div>
  <div class="swatch"><div class="chip" style="background:#efebe7"></div><div class="meta">Stone<br><code>#efebe7</code></div></div>
  <div class="swatch"><div class="chip" style="background:#cfcabf"></div><div class="meta">Concrete<br><code>#cfcabf</code></div></div>
  <div class="swatch"><div class="chip" style="background:#877867"></div><div class="meta">Mocha<br><code>#877867</code></div></div>
  <div class="swatch"><div class="chip" style="background:#f26629"></div><div class="meta">Papaya<br><code>#f26629</code></div></div>
  <div class="swatch"><div class="chip" style="background:#60d06f"></div><div class="meta">Cactus<br><code>#60d06f</code></div></div>
  <div class="swatch"><div class="chip" style="background:#6060bf"></div><div class="meta">Blueberry<br><code>#6060bf</code></div></div>
  <div class="swatch"><div class="chip" style="background:#f19d38"></div><div class="meta">Mango<br><code>#f19d38</code></div></div>
  <div class="swatch"><div class="chip" style="background:#35605f"></div><div class="meta">Evergreen<br><code>#35605f</code></div></div>
</div>

### Semantic tokens

Light is the default. Dark flips surfaces and keeps turquoise as primary.

| Token | Light | Dark |
|---|---|---|
| Background | `#fefcf9` linen | `#082422` slate |
| Foreground | `#082422` | `#fefcf9` |
| Card | `#fefcf9` | `#234343` |
| Muted | `#efebe7` stone | `#152b2a` |
| Muted foreground | `#6ab3b1` | `#cfcabf` |
| Primary | `#2bf2f1` | `#2bf2f1` |
| Primary foreground | `#082422` | `#082422` |
| Accent | `#dcff00` lime | `#b2d000` |
| Border | `#cfcabf` | `#35605f` |
| Link | `#10a8a7` | — |
| Destructive | `#f26629` | `#f26629` |

Primary button states (light): hover `#1abfbe`, active `#2bf2f1`, disabled `#d4fffe`. Danger hover `#cc4d14`.

### Status

Keep status on semantic colors, never on the brand accent.

| Role | Background | Mark | Text |
|---|---|---|---|
| Success | `#eefbf0` | `#60d06f` | `#1b7a29` |
| Warning | `#fffce0` | `#ffd200` | `#665500` |
| Error | `#fff5ef` | `#f26629` | `#a03808` |
| Info | `#f2eeff` | `#3b2e8c` | `#1c1249` |

### Core ramps

Each ramp runs 50–900. Brand steps called out below are the ones UI actually paints.

**Turquoise** — `#f0fffe` · `#d4fffe` · `#a8fffe` · `#8dfdfa` · `#5af5f4` · **`#2bf2f1`** · `#1abfbe` · `#0f8c8b` · `#065958` · `#023333`

**Slate** — `#e8f4f3` · `#c3e2e1` · `#97cbc9` · `#6ab3b1` · `#4d9290` · `#35605f` · `#234343` · `#152b2a` · **`#082422`** · `#031312`

**Lime** — `#fefff0` · `#fbffd6` · `#f5ffa3` · `#eaff57` · **`#dcff00`** · `#b2d000` · `#87a000` · `#5e7000` · `#364000` · `#181c00`

**Neutral** — `#ffffff` · `#fefcf9` · `#efebe7` · `#ddd9cf` · `#cfcabf` · `#adaa9e` · `#8a8780` · `#636158` · `#3e3c35` · `#1c1b16`

## Typography {#typography}

| Role | Font | Usage |
|---|---|---|
| Display / headings | **Plain** (800–900) | h1, hero, tight `-0.02em` tracking, line-height `1.1` |
| Body / UI | **Saans** (300–700) | paragraphs, labels, controls. Heading tracking `-0.01em` |
| Code / data | **SF Mono** / ui-monospace | code, hex values, IDs |

Plain and Saans are licensed faces. Load them from the product font files (`PlainLTStd-Black`, `SaansLTStd-Light` / `Regular` / `SemiBold`). Fallback stack:

```css
--font-heading: "Plain", "Saans", system-ui, sans-serif;
--font-sans: "Saans", system-ui, sans-serif;
--font-mono: ui-monospace, "SF Mono", Menlo, Consolas, monospace;
```

| Step | Size | Line height |
|---|---|---|
| Caption / xxs | `0.6875rem` | — |
| Body | `1rem` | `1.5` |
| Heading 3 | `1.25rem` | `1.5` |
| Heading 2 | `1.75rem` | `1.4` |
| Display | `3.75rem`–`4.5rem` | `1.1` |

## Shape and elevation {#shape}

Radius: `2px` xs · `4px` sm · `8px` md · `12px` lg · `16px` xl · `24px` 2xl · `32px` 3xl · pill `9999px`. Buttons use a full pill: `border-radius: calc(1rem + 999px)`.

```css
--shadow-sm: 0 1px 3px #0824220f, 0 1px 2px #0824220a;
--shadow-md: 0 4px 6px #0824220f, 0 2px 4px #0824220a;
--shadow-turquoise: 0 4px 14px #2bf2f140; /* primary button glow */
--shadow-selection: 0 0 0 6px #2bf2f11a;  /* turquoise focus, 6px */
```

Spacing scale (px): 0, 4, 8, 12, 16, 20, 24, 28, 32, 40, 48, 64, 80, 96.

## Components {#components}

### Primary button

```css
.btn-primary {
  background-color: #2bf2f1;
  color: #082422;
  border: 0;
  border-radius: 9999px;
  font-family: "Saans", system-ui, sans-serif;
  font-weight: 600;
  box-shadow: 0 4px 14px #2bf2f140;
}
.btn-primary:hover { background-color: #1abfbe; }
.btn-primary:disabled { background-color: #d4fffe; }
```

Accent (lime) is for highlights and emphasis, not a second primary button in the same view.

### Surface card

```css
.card {
  background: #fefcf9;
  color: #082422;
  border: 1px solid #cfcabf;
  border-radius: 16px;
  box-shadow: 0 1px 3px #0824220f, 0 1px 2px #0824220a;
}
```

Dark card: background `#234343`, border `#35605f`, text `#fefcf9`.

## Data visualization {#data-viz}

Series order: turquoise `#2bf2f1`, cactus `#42b552`, mango `#f19d38`, blueberry `#6e58d8`, papaya `#f77b42`. Dark charts shift one step lighter: `#5af5f4`, `#60d06f`, `#ffb05a`, `#9882f5`, `#ff9f66`.

## Rules of thumb

1. Linen canvas in light mode; slate canvas in dark. Turquoise stays the primary in both.
2. Text on turquoise and lime is slate `#082422`, never white.
3. One electric accent per view. If the primary button is turquoise, nearby emphasis is lime or flat slate, not a second glow.
4. Status stays semantic: success, warning, error, and info never borrow turquoise or lime.
5. Selection and focus use turquoise at low opacity (`#2bf2f14d` selection, 6px focus ring), not a border color change alone.
