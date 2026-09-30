# Design tokens

One source of truth. Every token lives in `theme.css` and is exposed as a CSS variable and a Tailwind v4 utility. Short names don't exist — use the real ones.

## Semantic color

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

## Border radius

| Token | Value | Applies to |
|---|---|---|
| `--radius-xs` | 2px | — |
| `--radius-md` | 8px | Inputs, small cards |
| `--radius-xl` | 16px | Standard cards |
| `--radius-2xl` | 24px | Hero cards, sheets |
| `--radius-3xl` | 32px | Large overlays |
| `--radius-full` | 9999px | Buttons, badges, chips |

`--radius-sm` (4px) and `--radius-lg` (12px) also exist. Pill buttons use `--radius-button: calc(1rem + 999px)`, which resolves to a full pill.

| Token | Value |
|---|---|
| `--radius-xs` | 2px |
| `--radius-sm` | 4px |
| `--radius-md` | 8px |
| `--radius-lg` | 12px |
| `--radius-xl` | 16px |
| `--radius-2xl` | 24px |
| `--radius-3xl` | 32px |
| `--radius-full` | 9999px |

## Spacing

A 4px grid only: 4, 8, 12, 16, 24, 32, 48, 64. They map to `--spacing-1`, `--spacing-2`, `--spacing-3`, `--spacing-4`, `--spacing-6`, `--spacing-8`, `--spacing-12`, and `--spacing-16`.

| Token | Value | rem |
|---|---|---|
| `--spacing-1` | 4px | 0.25rem |
| `--spacing-2` | 8px | 0.5rem |
| `--spacing-3` | 12px | 0.75rem |
| `--spacing-4` | 16px | 1rem |
| `--spacing-6` | 24px | 1.5rem |
| `--spacing-8` | 32px | 2rem |
| `--spacing-12` | 48px | 3rem |
| `--spacing-16` | 64px | 4rem |

## Shadows

Slate-tinted. Never pure black.

| Token | Use |
|---|---|
| `--shadow-sm` | Chips, active tabs |
| `--shadow-md` | Elevated card |
| `--shadow-lg` | Dropdowns, popovers |
| `--shadow-xl` | Dialogs |
| `--shadow-turquoise` | Primary button glow: `0 4px 14px #2bf2f140` |
| `--shadow-selection` | Turquoise focus, 6px: `0 0 0 6px #2bf2f11a` |

## CSS variables

```css
:root {
  --turquoise: #2bf2f1;
  --lime: #dcff00;
  --slate: #082422;
  --linen: #fefcf9;
  --stone: #efebe7;
  --concrete: #cfcabf;
  --fg-muted: #636158;
  --light-sky: #d4fffe;

  --background: var(--linen);
  --foreground: var(--slate);
  --primary: var(--turquoise);
  --primary-foreground: var(--slate);
  --accent: var(--lime);
  --border: var(--concrete);
  --muted: var(--stone);
  --destructive: #f26629;
  --status-success: #60d06f;
  --status-warning: #ffd200;
  --status-error: #f26629;
  --interactive-primary-hover: #1abfbe;

  --radius-xs: 2px;
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-xl: 16px;
  --radius-2xl: 24px;
  --radius-3xl: 32px;
  --radius-full: 9999px;
  --radius-button: calc(1rem + 999px);

  --spacing-1: 4px;
  --spacing-2: 8px;
  --spacing-3: 12px;
  --spacing-4: 16px;
  --spacing-6: 24px;
  --spacing-8: 32px;
  --spacing-12: 48px;
  --spacing-16: 64px;

  --shadow-sm: 0 1px 3px #0824220f, 0 1px 2px #0824220a;
  --shadow-md: 0 4px 6px #0824220f, 0 2px 4px #0824220a;
  --shadow-lg: 0 10px 15px #0824220f, 0 4px 6px #08242208;
  --shadow-xl: 0 20px 25px #0824220f, 0 8px 10px #08242208;
  --shadow-turquoise: 0 4px 14px #2bf2f140; /* primary button glow */
  --shadow-selection: 0 0 0 6px #2bf2f11a;  /* turquoise focus, 6px */

  --font-heading: "Plain", "Saans", system-ui, sans-serif;
  --font-sans: "Saans", system-ui, sans-serif;
  --font-mono: ui-monospace, "SF Mono", Menlo, Consolas, monospace;
}

.dark {
  --background: #082422;
  --foreground: #fefcf9;
  --card: #234343;
  --muted: #152b2a;
  --accent: #b2d000;
  --border: #35605f;
}
```

## Dark mode

Slate canvas `#082422`, linen text `#fefcf9`, card `#234343`, muted `#152b2a`, lime accent `#b2d000`, border `#35605f`. Turquoise stays `--primary`. Text on turquoise and lime is always `#082422`.
