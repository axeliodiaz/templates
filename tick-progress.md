---
title: Tick progress
---
<script setup>
import TickProgressDemo from './.vitepress/theme/TickProgressDemo.vue'
</script>

# Tick progress

The 60-tick strip from [Workflow operations](/felix/workflow-ops), available as a small framework-free capacity indicator. It changes only the visual shape, not the meaning of the value. Existing labels, status, reset information and series colors stay with the caller.

<TickProgressDemo />

## Use

Import `createTickProgress` from `/lumen-template/tick-progress.js` and load `/lumen-template/tick-progress.css`.

```js
const bar = createTickProgress(host, {
  value: 31,
  label: 'Weekly capacity used: 31%',
  color: '#22a06b'
})
bar.update({ value: 32, label: 'Weekly capacity used: 32%', color: '#22a06b' })
bar.destroy()
```

The default is 60 ticks, 20px high with a 2px gap and 1px corner radius, matching Workflow-OPS. Local CSS properties `--tick-progress-color`, `--tick-progress-track`, `--tick-progress-height`, `--tick-progress-gap` and `--tick-progress-radius` adapt to each host. No global palette changes or dependencies are needed.

## Exact values and accessibility

A partially filled tick preserves values below one tick, including small monthly spend. Values below 0 or above 100 are visually clamped while the caller's exact text remains unchanged. `null`, missing and non-finite values render an unavailable strip, never a false zero. Supply an unavailable label in those cases. Known values have `role="progressbar"` and a bounded 0-100 value; decorative ticks are hidden from assistive technology. The caller owns whether this is capacity used or work completed, its label, and any more detailed `valueText`.

There is no autonomous animation or polling. Updates are immediate, including with reduced motion. Forced colors use system colors and outlined ticks. This does not replace a native progress element for an unknown-duration task.
