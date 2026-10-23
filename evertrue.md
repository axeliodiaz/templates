---
aside: false
---
<script setup>
import EvertruePages from './.vitepress/theme/EvertruePages.vue'
</script>

# Evertrue self-updating pages

A "pages that keep themselves true" terminal concept: a command line that asks for a page once, headline counters that tick up on their own, six page cards that cycle through live refreshes, and a detail panel per page with KPI tiles that flip from old to new values (previous values kept as struck-through "was" lines), weekly bar charts, source chips, refresh pills and a per-page KEEP UP TO DATE toggle. Pages 01-03 (Revenue last week, Q4 Forecast & Pipeline, Morning brief) reproduce the source video's copy, numbers and two visible refresh states; pages 04-06 (Board memo, Policy page, Competitor watch) are built in the same anatomy from the post's prompts and are labeled illustrative, since the video shows their cards only. The overview panel recreates the video's closing card.

Source-inspired implementation from [the distortgeekin Pages video](https://x.com/distortgeekin/status/2113261664694894731?s=46). Recreated with local components, layouts and copy; no downloaded product code, assets or brands (the source product name and author handle are intentionally replaced). All data is fictitious; the self-updates are simulated locally on a timer, not real integrations, and the toggle pauses them per page. Values, schedules and captions for pages 01-03 match the video frames; anything the video did not show is labeled illustrative.

<EvertruePages />

## Motion and accessibility

The command line types itself on load, counters tick up, page cards rise on hover, KPI values flip vertically with their was-lines, refresh pills and captions cross-fade, and bars animate their height when a simulated refresh lands. Card selection switches the panel with a short rise transition. Reduced-motion preferences disable every animation and timer: the page renders its final state with all values visible. Cards, mini chips and the toggle are real buttons, keyboard reachable with visible focus. The grid collapses to two columns and then one on narrow screens via container queries.
