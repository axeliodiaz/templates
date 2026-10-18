---
aside: false
---
<script setup>
import PaceIcons from '../.vitepress/theme/PaceIcons.vue'
</script>
# Pace foundations

## Palette, light

<div class="studio-kit studio-pace" style="background:transparent"><div class="pace-swatches"><div class="pace-sw"><i style="background:Background"></i><div><b>Background</b><br><code>#f5f8f4</code> <small>--sk-bg</small></div></div><div class="pace-sw"><i style="background:Surface"></i><div><b>Surface</b><br><code>#ffffff</code> <small>--sk-surface</small></div></div><div class="pace-sw"><i style="background:Border"></i><div><b>Border</b><br><code>#cfdcd3</code> <small>--sk-border</small></div></div><div class="pace-sw"><i style="background:Ink"></i><div><b>Ink</b><br><code>#173528</code> <small>--sk-ink</small></div></div><div class="pace-sw"><i style="background:Muted"></i><div><b>Muted</b><br><code>#52665a</code> <small>--sk-muted</small></div></div><div class="pace-sw"><i style="background:Accent"></i><div><b>Accent</b><br><code>#23724e</code> <small>--sk-accent</small></div></div><div class="pace-sw"><i style="background:On accent"></i><div><b>On accent</b><br><code>#ffffff</code> <small>--sk-on</small></div></div><div class="pace-sw"><i style="background:Success"></i><div><b>Success</b><br><code>#1a6e44</code> <small>--sk-success</small></div></div><div class="pace-sw"><i style="background:Warning"></i><div><b>Warning</b><br><code>#8a5a00</code> <small>--sk-warning</small></div></div><div class="pace-sw"><i style="background:Danger"></i><div><b>Danger</b><br><code>#b3261e</code> <small>--sk-danger</small></div></div><div class="pace-sw"><i style="background:Info"></i><div><b>Info</b><br><code>#255f9e</code> <small>--sk-info</small></div></div></div></div>

## Palette, dark

<div class="studio-kit studio-pace" style="background:transparent"><div class="pace-swatches"><div class="pace-sw"><i style="background:--sk-bg"></i><div><b>Background</b><br><code>#111a15</code> <small>--sk-bg</small></div></div><div class="pace-sw"><i style="background:--sk-surface"></i><div><b>Surface</b><br><code>#18241d</code> <small>--sk-surface</small></div></div><div class="pace-sw"><i style="background:--sk-border"></i><div><b>Border</b><br><code>#2b3d32</code> <small>--sk-border</small></div></div><div class="pace-sw"><i style="background:--sk-ink"></i><div><b>Ink</b><br><code>#e6f1ea</code> <small>--sk-ink</small></div></div><div class="pace-sw"><i style="background:--sk-muted"></i><div><b>Muted</b><br><code>#a2b7a9</code> <small>--sk-muted</small></div></div><div class="pace-sw"><i style="background:--sk-accent"></i><div><b>Accent</b><br><code>#83d4a1</code> <small>--sk-accent</small></div></div><div class="pace-sw"><i style="background:--sk-on"></i><div><b>On accent</b><br><code>#0b2417</code> <small>--sk-on</small></div></div><div class="pace-sw"><i style="background:--sk-success"></i><div><b>Success</b><br><code>#7fd69b</code> <small>--sk-success</small></div></div><div class="pace-sw"><i style="background:--sk-warning"></i><div><b>Warning</b><br><code>#f0c36d</code> <small>--sk-warning</small></div></div><div class="pace-sw"><i style="background:--sk-danger"></i><div><b>Danger</b><br><code>#f29b94</code> <small>--sk-danger</small></div></div><div class="pace-sw"><i style="background:--sk-info"></i><div><b>Info</b><br><code>#8fbfee</code> <small>--sk-info</small></div></div></div></div>

Brand green is an action color. Success also leans green, so status always pairs a label and icon with the color. Pace never borrows other templates' palettes.

## Contrast (WCAG 2.2, computed from the tokens)

| Pair | Light | Dark |
| --- | --- | --- |
| Ink on background | 12.4:1 | 15.3:1 |
| Ink on surface | 13.3:1 | 13.9:1 |
| Muted on background | 5.8:1 | 8.4:1 |
| Muted on surface | 6.2:1 | 7.6:1 |
| On-accent text on accent (buttons) | 5.9:1 | 9.3:1 |
| Accent text on background (links) | 5.5:1 | 10.1:1 |
| Accent on surface | 5.9:1 | 9.1:1 |
| Success, warning, danger, info text on background | 5.5 to 6.1:1 | 9.2 to 10.8:1 |

Every text pair clears 4.5:1 (AA). Focus rings use the accent, 2px with a 3px offset, and also clear 3:1 against both surfaces. `tests/pace-system.cjs` recomputes these numbers from `studio-systems.css`.

## Typography

<div class="studio-kit studio-pace pace-specimen" style="background:transparent">
<div style="font:700 44px/1.1 'Space Grotesk',sans-serif">Ride stronger</div>
<small>Display: Space Grotesk 700, 44/48. Page titles and big numbers.</small>
<div style="font:600 24px/1.25 'Space Grotesk',sans-serif">Today's classes</div>
<small>Heading: Space Grotesk 600, 24/30. Card titles 15px.</small>
<div style="font:400 15px/1.5 'DM Sans',sans-serif">Arrive ten minutes early to set up your bike and clip in.</div>
<small>Body: DM Sans 400, 15/22 (admin tables 13px, metadata 11px).</small>
<div class="pace-num" style="font-size:30px;font-weight:700">1,284 <span style="font-size:13px;font-weight:400">credits used</span></div>
<small>Numbers: tabular digits, unit beside the value.</small>
</div>

## Spacing, shape and elevation

4px base grid, gaps 8/12/16/24px, card padding 16 to 24px. Radius: 12px cards, 6px controls, 28px phone frame, 999px avatars and switches. 1px borders; shadows only on overlays and the phone frame. No gradients on controls.

## Icons

24px grid, 1.75px round stroke, `currentColor`. Search and pick one to copy its markup.

<PaceIcons />

## Accessibility

Labels on every input, visible error text, 40px minimum touch targets on member screens, keyboard focus on every control, native dialogs with Escape, charts with captions and SVG labels, reduced motion respected.

[Live components](/pace/components)
