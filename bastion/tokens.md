---
aside: false
title: Bastion tokens
---

# Tokens

Source of truth: `.vitepress/theme/bastion.css`, on `.bst-root`. Bootstrap 6 semantic variables are overridden in the same rule so `btn-solid`, `badge`, and `progress` pick up phosphor and amber.

```css
.bst-root {
  --bst-bg: #061108;
  --bst-surface: #0a1810;
  --bst-ink: #c8f7c2;
  --bst-green: #62f56a;
  --bst-muted: #8fbf8a;
  --bst-amber: #ffb000;
  --bst-hot: #ff7a18;
  --bst-danger: #ff6b6b;
  --bst-on-green: #061108;
  --bst-on-amber: #1a1200;
  --bst-line: #1c5a32;
  --bst-line-dim: #14321f;
  --bst-font: "JetBrains Mono", ui-monospace, Menlo, Consolas, monospace;
}
```

## What each token is for

| Token | Use |
| --- | --- |
| `--bst-bg` | Page field and the grid |
| `--bst-surface` | Panel fill, slightly lifted from the field |
| `--bst-ink` | Body sentences |
| `--bst-green` | Nominal text, links, healthy meters, primary buttons |
| `--bst-muted` | Kickers, timestamps, footnotes |
| `--bst-amber` | Attention text, review nodes, dismiss |
| `--bst-hot` | Map latency above 50ms |
| `--bst-danger` | Destructive confirmation |
| `--bst-on-green`, `--bst-on-amber` | Text on solid fills |
| `--bst-line`, `--bst-line-dim` | Panel borders and inner rules |

## Shape, space, elevation

4px grid. Panel padding 12px. Gap between panels 12px. Radius is 0 on panels, controls, badges, and dialogs. Status lamps and map dots stay circular so they read as lights. No drop shadow. The only glow is an 8px lamp shadow, removed under reduced motion along with the blink.

## Bootstrap aliases

Inside the root, Bastion sets `--bs-primary-*`, `--bs-success-*`, `--bs-warning-*`, and `--bs-danger-*` from the tokens above, and forces `--bs-border-radius`, `--bs-radius-5`, and `--bs-radius-7` to 0. `--bs-btn-input-min-height` is 0 so dense rows do not inherit the alpha’s tall control size.

[Color](/bastion/color) · [Usage](/bastion/usage)
