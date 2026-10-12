---
aside: false
---
<script setup>
import SankeyFunnel from '../.vitepress/theme/SankeyFunnel.vue'
import StudioCatalog from '../.vitepress/theme/StudioCatalog.vue'
</script>

# Folio charts

Live variants and states. Buttons, forms and feedback update local state only. Use keyboard Tab to inspect focus. Search the sample table for an empty state; open the native dialog and press Escape.

<StudioCatalog theme="folio" section="charts" />

## Catalog coverage

Button, icon button, button group, badge, status, tag, avatar, avatar group, label, input, helper/error, textarea, select, checkbox, radio, switch, slider, progress, spinner, skeleton, amount/text, separator, alert, card/KPI, tabs, details/accordion, dialog, drawer, menu/popover, tooltip, search, table/empty state, pagination, breadcrumb, stepper, toast, notification/list item, charts and app/form layouts.

Menus are lightweight illustrative patterns. Dialogs and drawers use native modal focus containment and Escape. A production application should add its own menu keyboard navigation and routing. No live preview sends or purchases anything.

## Conversion funnel (Sankey)

Multi-stage conversion flow with drop-offs, date ranges, play/pause and keyboard focus. It inherits this template's colors and works with synthetic data. Replace the stage counts with your own source of truth.

<SankeyFunnel title="Conversion funnel" />
