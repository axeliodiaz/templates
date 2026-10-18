---
aside: false
---
<script setup>
import StudioCatalog from '../.vitepress/theme/StudioCatalog.vue'
import PaceLayouts from '../.vitepress/theme/PaceLayouts.vue'

</script>

# Pace layouts

## Admin console

Sidebar, search, KPI cards, class table with status filter, weekly bookings chart and a waitlist alert. Switch status in the table filter. Counters animate once on load.

<PaceLayouts view="admin" />

## Member app

Mobile frame with credits ring, day tabs, class cards with Book, Cancel and Waitlist, and a tab bar. Booking spends a credit locally and cancel returns it.

<PaceLayouts view="member" />

## Shell and form composition

<StudioCatalog theme="pace" section="layouts" />
