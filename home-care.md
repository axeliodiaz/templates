---
aside: false
sidebar: false
pageClass: homecare-page
---
<script setup>
import HomeCareDashboard from './.vitepress/theme/HomeCareDashboard.vue'
</script>

# Meadow home care

An original operations template for coordinating home-care visits. Full local workspace with dashboard, schedule, visits, alerts, caregivers, clients, verification, reports, settings and a component kit. All records are fictitious; no care action or message leaves this demo.

<HomeCareDashboard />

## Reference and scope

Visual pattern credit: [Nizam's home-care operations post](https://x.com/nizamdesign/status/2115383080894833000?s=46). Its two images are complementary halves of one dashboard. They show a sidebar, call-out banner, suggested replacements, four KPI cards, half-hour coverage, attention queue and live visits. No source repository, downloadable product or reuse license was visible. This implementation uses original code, copy, initials and synthetic records; no source code, photos or branding were copied.

The other destination screens, local approval/create/reassign/note/verification flows, dark theme, states, component APIs and mobile behavior are implementation choices beyond what the reference images establish. This is a whole working template, not a claim that unseen product screens have been recovered. [Read the component kit and integration limits](/home-care/components).

## Try the workflow

1. Review a suggested replacement and approve it locally. Assigned totals and coverage update from the same visit records.
2. Inspect half-hour coverage with mouse, keyboard or touch. A square is one active visit at that time; a visit may appear in more than one column. It is not a count of unique daily visits.
3. Open a visit, change its local assignment, add a sample care note or review the sample verification flag.
4. Create a one-hour sample visit, filter by service area or search for a client. Export only the synthetic rows currently visible.
5. Preview Loading/Empty/Error, change theme, inspect narrow layouts and reset the sample.

The fixed sample date is Monday, October 5, 2026, at 08:46. Times are local wall-clock fixtures, not live time or timezone-aware appointments. "In progress" and ETA are sample states, not GPS tracking. Candidate scores do not check travel, skills or availability. No clinical recommendation, staffing conflict solver, real EVV attestation, regulated record storage or production care system is bundled.
