---
aside: false
title: Bastion color
---

# Color

Phosphor green on a near-black green field, with amber for anything that needs a person. Borders are a dimmer green so the grid stays visible without shouting.

<div class="bst-root" data-bs-theme="dark"><div class="bst"><div class="bst-swatches"><div class="bst-sw"><i style="background:#061108"></i><div><b>Background</b><small>#061108</small></div></div><div class="bst-sw"><i style="background:#0a1810"></i><div><b>Surface</b><small>#0a1810</small></div></div><div class="bst-sw"><i style="background:#c8f7c2"></i><div><b>Ink</b><small>#c8f7c2</small></div></div><div class="bst-sw"><i style="background:#62f56a"></i><div><b>Phosphor</b><small>#62f56a</small></div></div><div class="bst-sw"><i style="background:#8fbf8a"></i><div><b>Muted</b><small>#8fbf8a</small></div></div><div class="bst-sw"><i style="background:#ffb000"></i><div><b>Amber</b><small>#ffb000</small></div></div><div class="bst-sw"><i style="background:#ff7a18"></i><div><b>Hot</b><small>#ff7a18</small></div></div><div class="bst-sw"><i style="background:#ff6b6b"></i><div><b>Danger</b><small>#ff6b6b</small></div></div></div></div></div>

## Meaning

| Color | Use | Do not use it for |
| --- | --- | --- |
| Phosphor `#62f56a` | Nominal status, primary actions, links, healthy meters | A warning |
| Amber `#ffb000` | Attention, review, high CPU, dismiss | Decoration |
| Hot `#ff7a18` | Latency above 50ms on the map | Body text blocks |
| Danger `#ff6b6b` | Paging and destructive confirmation | The brand accent |
| Muted `#8fbf8a` | Labels, timestamps, footnotes | The only copy of an error |

Status lamps are round. Everything else is square. A lamp never replaces its label: `RUNNING`, `RUNNING *`, `RESOLVED`, `Review`.

## Contrast

Pairs below are ink on the green-black field, checked against WCAG 2.2 AA (4.5:1) from the token hex values. `tests/bastion.cjs` recomputes them.

| Pair | Role |
| --- | --- |
| Ink `#c8f7c2` on background and surface | Body copy |
| Phosphor `#62f56a` on background and surface | Status and links |
| Muted `#8fbf8a` on background and surface | Secondary labels |
| Amber `#ffb000`, hot `#ff7a18`, danger `#ff6b6b` on background | Attention text |
| Background `#061108` on phosphor | Text on a solid green button |
| `#1a1200` on amber | Text on a solid amber button |

Focus is a 2px amber outline with a 2px offset, which clears 3:1 against the field.

## Bootstrap theme

Inside `.bst-root`, Bastion remaps Bootstrap 6 semantic tokens (`--bs-success-*`, `--bs-warning-*`, `--bs-danger-*`, `--bs-primary-*`) onto this palette and sets `color-scheme: dark` via `data-bs-theme="dark"`. `light-dark()` then resolves to the dark branch. Those variables do not leak to the docs shell. See [Usage](/bastion/usage).
