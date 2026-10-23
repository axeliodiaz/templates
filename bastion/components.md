---
aside: false
title: Bastion components
---

<script setup>
import BastionCatalog from '../.vitepress/theme/BastionCatalog.vue'
</script>

# Components

Live Bootstrap 6 controls skinned as Bastion. Search the list, open the dialog and press Escape, and trigger a toast. Copy is sample workspace data.

<BastionCatalog />

## Families

Buttons, badges, alerts, cards, forms, checks and radios, range, tables, meters, tabs, lists, accordion, dialog, toasts, breadcrumb and pagination, empty and loading.

Buttons use `btn-solid` or `btn-outline` with `theme-success`, `theme-warning`, or `theme-danger`. Layout utilities use the alpha prefix form (`md:col-6`). See [Usage](/bastion/usage) for the quirks that come with the pin.

## Keyboard

Tab reaches each control. Enter activates buttons. Space toggles native checks. Escape closes the dialog. Disabled controls cannot be activated. Tabs in this catalog are toggle buttons with `aria-selected`; a production tablist still needs arrow keys and a tabpanel.
