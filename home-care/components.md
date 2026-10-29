---
aside: false
sidebar: false
pageClass: homecare-page
---
<script setup>
import HomeCareDashboard from '../.vitepress/theme/HomeCareDashboard.vue'
</script>

# Home-care component kit

Working parts of the [Meadow operations template](/home-care), with local state, exact synthetic visit records and reduced-motion behavior. The same components power the full workspace and this catalog.

<HomeCareDashboard initialPage="Components" />

## Inventory and source coverage

| Component | Original implementation | Reference evidence |
|---|---|---|
| App shell | Operations/people/compliance navigation, service-area filter, search, mobile navigation, inbox, profile label | Sidebar and header visible; destination screens not shown. |
| Call-out / candidate rows | Candidate details, individual/batch local approval, derived assigned totals | Banner, three suggestions and review/day buttons visible; approval mechanics are original. |
| KPI card | Label, integer value, detail, dot tone and decorative spark bars | Four scheduled/covered/in-progress/at-risk cards visible. |
| Coverage matrix | Half-hour columns, active intervals, status cells, focus selection, exact accessible labels/readout, visit buttons | Colored coverage grid and one tooltip visible; data/selection model is original. |
| Attention / live visits | Derived exceptions, sample reminder preview, reassignment and verification dialogs, live rows | Three exception rows and three live rows visible. |
| Full workspace | Schedule, visit directory, alerts, caregiver/client directories, EVV preview, reports, settings/help | Navigation labels visible; screen layouts/actions beyond dashboard are original additions. |
| Modal / forms / feedback | Native dialog focus handling, validation, local create/reassign/note/verify, reset and manual states | Unseen interaction states are original, not claimed source matches. |

## Actual APIs

`HomeCareDashboard.vue` accepts optional `initialPage` String, default Dashboard. It owns the visit array, area/search filters, page/state/theme, dialog and local preferences. Navigation is in-component state, not separate application routes or an external router. Only `/home-care` and `/home-care/components` are published pages. It emits no data mutations to a host.

```vue
<script setup>
import HomeCareDashboard from './.vitepress/theme/HomeCareDashboard.vue'
</script>
<template><HomeCareDashboard initialPage="Dashboard" /></template>
```

`HomeCareKpi.vue` accepts `label`, numeric `value`, `detail`, optional `tone` and optional numeric `trend[]`. Trend bars normalize to that card's local maximum and are decorative, not a shared-axis comparison. It emits nothing. Parent owns entrance Motion.

`HomeCareCoverage.vue` accepts `visits`, each with id/start/end/status/caregiver/client. It emits `open(id)` from a selected time's visit buttons. Fixed 23 columns run 07:00–18:00 in half-hour steps. Active interval includes start and excludes end; one visit can occur in several columns. Height is max(10, maximum simultaneous visits), keeping all active records visible. Colors map completed/later assigned/unassigned/late to lavender/blue/pink/amber with exact names in the selected readout. No calendar date computation, timezone conversion or clinical scheduling exists.

`homecare-model.ts` exports the visit interface, four areas, fourteen fictitious people, `makeCareVisits()` and the half-hour label helper. Default 48 visits have 45 assignments, three gaps, six completed, three in progress, one late, one unverified flag and one completed visit with no note. Dates, status and progress are fixed sample fixtures, not inferred from a live clock. Some fixtures overlap for the same caregiver; the template does not claim capacity validation.

## Data and action contract

- Replacements change the local visit caregiver/status. Candidate percentages are illustrative labels, not an optimizer or qualified availability check. No person is contacted.
- New visit requires a nonempty client name, start 07:00–17:00, one of four service areas and optional caregiver. End is start+1 hour. It adds an unverified synthetic record to this session only.
- Assignment changes accept an available roster label or unassigned; there is no real staffing commitment. A live host needs permission, qualification, travel, overlap and server-conflict checks.
- EVV review changes a display boolean only. It does not verify GPS/signature, bill a payer or attest regulatory compliance.
- Care notes save local text. No health information should be entered; the template has no secure record persistence or privacy controls.
- Reminder action only records a preview notice. Inbox/settings do not send notifications. Export writes the filtered synthetic rows to a local CSV, not to another account.
- Area/search filters derive the same displayed KPIs, coverage, visit list and report rows. Empty search results are separate from the manual Empty preview. Reset restores record fixtures and filters; page/theme/preferences are not reset.

## States, motion and access

Ready shows the selected workspace screen. Loading/Empty/Error are manual previews with no request; recovery restores current page/filter data. Native dialog gives modal focus/escape behavior; the close button restores opener focus. Selection has native buttons and pressed state. Narrow data tables scroll inside their own container; core prose and source maps stack.

Motion fades/rises operational cards on page/state changes. The parent stores controls, stops/restores them before refresh, skips reduced motion, listens for preference changes and removes media listeners/controls on unmount. Coverage updates without inventing intermediate visit counts. CSS transitions stop under reduced motion. No continuous timer or decorative particle loop runs.

Integration requires authenticated roles, secure storage, audit trails, real date/timezone rules, verified caregiver qualifications/capacity, conflict handling, reliable state and compliant records. This example is not clinical software, a scheduling service, an EVV system or a certified accessibility implementation.

<style>
@media(max-width:700px){.homecare-page .vp-doc>table,.homecare-page .vp-doc>table tbody,.homecare-page .vp-doc>table tr,.homecare-page .vp-doc>table td{display:block;width:100%;box-sizing:border-box}.homecare-page .vp-doc>table thead{display:none}.homecare-page .vp-doc>table td:first-child{font-weight:650;background:var(--vp-c-bg-soft)}.homecare-page .vp-doc>table td{overflow-wrap:anywhere}.homecare-page .vp-doc>table tr{margin-bottom:12px}}
</style>
