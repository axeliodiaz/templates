---
---

# Components: Bootstrap set

Every component family from the Bootstrap 6.0.0-alpha.1 set, rendered with real Bootstrap markup and PulseFit theme tokens in a **scoped** standalone gallery (`/pulsefit-template/`). Bootstrap does not load on the VitePress shell or other templates. Fictitious data.

<iframe src="/pulsefit-template/components.html" title="PulseFit Bootstrap 6 component gallery" loading="lazy" style="width:100%;height:min(72vh,920px);border:1px solid var(--vp-c-divider);border-radius:12px;background:#f5f5f5"></iframe>

[Open the gallery full screen](/pulsefit-template/components.html) · [Studio template preview](/pulsefit-template/index.html)

The sections below link into the gallery. Live Vue examples (language select and navbar) stay on this page.

## Buttons: variants

[Open in gallery](/pulsefit-template/components.html#buttons-variants)

## Buttons: outline

[Open in gallery](/pulsefit-template/components.html#buttons-outline)

## Buttons: sizes

[Open in gallery](/pulsefit-template/components.html#buttons-sizes)

## Badges

[Open in gallery](/pulsefit-template/components.html#badges)

## Alerts

[Open in gallery](/pulsefit-template/components.html#alerts)

## Cards

[Open in gallery](/pulsefit-template/components.html#cards)

## Forms

[Open in gallery](/pulsefit-template/components.html#forms)

## Tables

[Open in gallery](/pulsefit-template/components.html#tables)

## Nav and tabs

[Open in gallery](/pulsefit-template/components.html#nav-tabs)

## Progress

[Open in gallery](/pulsefit-template/components.html#progress)

## List groups

[Open in gallery](/pulsefit-template/components.html#list-group)

## Accordion

[Open in gallery](/pulsefit-template/components.html#accordion)

## Modals

[Open in gallery](/pulsefit-template/components.html#modal-dialog)

## Toasts

[Open in gallery](/pulsefit-template/components.html#toasts)

## Offcanvas

[Open in gallery](/pulsefit-template/components.html#offcanvas)

## Language select

A compact language switcher: a globe, the current language code and a chevron. Click it to open the list, move with the arrow keys, Home and End, press Enter to choose and Escape to close. The choice updates the code on the button; wire it to your i18n routing.

<LangSelect theme="pulsefit" />

## Navbar

Top navigation with brand, links, dropdown, search and a collapse button under 700 px, in three treatments. Menus animate in with Motion and stay still with reduced motion.

<script setup>
import NavbarDemo from '../.vitepress/theme/NavbarDemo.vue'
import LangSelect from '../.vitepress/theme/LangSelect.vue'
</script>

<NavbarDemo theme="pulsefit" />
