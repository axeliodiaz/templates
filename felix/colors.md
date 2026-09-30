# Colors

The palette is deliberately small — every color earns its place. Turquoise carries the brand energy; slate carries weight and authority.

## Brand and base

<div class="swatch-grid">
  <div class="swatch"><div class="chip" style="background:#2bf2f1"></div><div class="meta">Turquoise<br><code>#2bf2f1</code></div></div>
  <div class="swatch"><div class="chip" style="background:#082422"></div><div class="meta">Slate<br><code>#082422</code></div></div>
  <div class="swatch"><div class="chip" style="background:#fefcf9;box-shadow:inset 0 0 0 1px #08242214"></div><div class="meta">Linen<br><code>#fefcf9</code></div></div>
  <div class="swatch"><div class="chip" style="background:#dcff00"></div><div class="meta">Lime<br><code>#dcff00</code></div></div>
  <div class="swatch"><div class="chip" style="background:#efebe7;box-shadow:inset 0 0 0 1px #08242214"></div><div class="meta">Stone<br><code>#efebe7</code></div></div>
  <div class="swatch"><div class="chip" style="background:#cfcabf"></div><div class="meta">Concrete<br><code>#cfcabf</code></div></div>
  <div class="swatch"><div class="chip" style="background:#636158"></div><div class="meta">FG muted<br><code>#636158</code></div></div>
  <div class="swatch"><div class="chip" style="background:#d4fffe;box-shadow:inset 0 0 0 1px #08242214"></div><div class="meta">Light sky<br><code>#d4fffe</code></div></div>
</div>

## Status

<div class="swatch-grid">
  <div class="swatch"><div class="chip" style="background:#60d06f"></div><div class="meta">Success<br><code>#60d06f</code></div></div>
  <div class="swatch"><div class="chip" style="background:#ffd200"></div><div class="meta">Warning<br><code>#ffd200</code></div></div>
  <div class="swatch"><div class="chip" style="background:#f26629"></div><div class="meta">Error<br><code>#f26629</code></div></div>
  <div class="swatch"><div class="chip" style="background:#3b2e8c"></div><div class="meta">Info<br><code>#3b2e8c</code></div></div>
</div>

Status never borrows turquoise or lime. Warning is yellow, not orange.

## Semantic tokens

Light values from the live tokens page.

| CSS variable | Value | Use |
|---|---|---|
| `--primary` | `#2bf2f1` | CTAs, focus, brand |
| `--foreground` | `#082422` | Text, dark surfaces |
| `--background` | `#fefcf9` | Warm canvas |
| `--muted` | `#efebe7` | Hover, secondary fills |
| `--status-success` | `#60d06f` | Completed, received |
| `--status-warning` | `#ffd200` | Pending, on its way |
| `--status-error` | `#f26629` | Blocking, destructive |
| `--interactive-primary-hover` | `#1abfbe` | Primary hover |

In dark mode the canvas is slate `#082422` and text is linen `#fefcf9`. Cards are `#234343`, muted fills are `#152b2a`, the lime accent steps to `#b2d000`, and borders are `#35605f`. Turquoise stays primary. Text on turquoise and lime is always `#082422`.

## Core ramps

Each ramp runs 50–900. Brand steps called out below are the ones UI actually paints.

**Turquoise** — `#f0fffe` · `#d4fffe` · `#a8fffe` · `#8dfdfa` · `#5af5f4` · **`#2bf2f1`** · `#1abfbe` · `#0f8c8b` · `#065958` · `#023333`

**Slate** — `#e8f4f3` · `#c3e2e1` · `#97cbc9` · `#6ab3b1` · `#4d9290` · `#35605f` · `#234343` · `#152b2a` · **`#082422`** · `#031312`

**Lime** — `#fefff0` · `#fbffd6` · `#f5ffa3` · `#eaff57` · **`#dcff00`** · `#b2d000` · `#87a000` · `#5e7000` · `#364000` · `#181c00`

**Neutral** — `#ffffff` · `#fefcf9` · `#efebe7` · `#ddd9cf` · `#cfcabf` · `#adaa9e` · `#8a8780` · `#636158` · `#3e3c35` · `#1c1b16`

## Data visualization

Chart series, not brand colors. Series order: turquoise `#2bf2f1`, cactus `#42b552`, mango `#f19d38`, blueberry `#6e58d8`, papaya `#f77b42`. Dark charts shift one step lighter: `#5af5f4`, `#60d06f`, `#ffb05a`, `#9882f5`, `#ff9f66`.
