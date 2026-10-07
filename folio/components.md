---
aside: false
---
<script setup>
import ComponentCatalog from '../.vitepress/theme/ComponentCatalog.vue'
import StudioExtended from '../.vitepress/theme/StudioExtended.vue'
import StudioCatalog from '../.vitepress/theme/StudioCatalog.vue'
</script>

# Folio component catalog

Live variants and states. Buttons, forms and feedback update local state only. Use keyboard Tab to inspect focus. Search the sample table for an empty state; open the native dialog and press Escape.

<StudioCatalog theme="folio" />

## Catalog coverage

Button, icon button, button group, badge, status, tag, avatar, avatar group, label, input, helper/error, textarea, select, checkbox, radio, switch, slider, progress, spinner, skeleton, amount/text, separator, alert, card/KPI, tabs, details/accordion, dialog, drawer, menu/popover, tooltip, search, table/empty state, pagination, breadcrumb, stepper, toast, notification/list item, charts and app/form layouts.

Menus are lightweight illustrative patterns. Dialogs and drawers use native modal focus containment and Escape. A production application should add its own menu keyboard navigation and routing. No live preview sends or purchases anything.

<StudioExtended theme="folio" />

## Extended coverage checklist

These patterns match the Felix/Lumen extended catalog, with Folio tokens. Base patterns appear in the live catalog above; extended variants follow it.

- Buttons: variants
- Buttons: outline
- Buttons: sizes
- Buttons: disabled
- Buttons: block and full width
- Buttons: shapes
- Buttons: active and toggle
- Buttons: with icons and counters
- Buttons: loading
- Button groups: basic and sizes
- Button groups: toolbar and vertical
- Button groups: checkbox and radio style
- Button groups: with dropdown
- Badges: variants
- Badges: pill, square, dot and in buttons
- Badges: positioned on a button
- Alerts: variants
- Alerts: with heading and actions
- Alerts: dismissible and with icon
- Cards: basic, header and footer
- Cards: with image, horizontal and highlighted
- Cards: list and grid groups
- Forms: text inputs
- Forms: sizes, textarea and file
- Forms: validation
- Forms: input groups
- Forms: floating labels and layout
- Select: variants
- Checks and radios
- Switches
- Range
- Nav and tabs
- Nav: vertical and tab panes
- Pagination
- Breadcrumbs
- Dropdowns
- Modals
- Tooltips
- Popovers
- Progress
- Spinners
- List groups
- Tables: basic, striped and hover
- Tables: bordered, small, dark header and states
- Accordion
- Collapse
- Toasts
- Offcanvas
- Carousel
- Avatars and stacks
- Placeholders and skeletons
- Steps and keyboard keys
- Language select
- Navbar

## Complete family reference

Usage, copyable markup and keyboard notes for the same 43 core families as the other systems, using Folio tokens.

<ComponentCatalog language="folio" />
