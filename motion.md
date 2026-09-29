<script setup>
import { ref } from 'vue'
const lane = ref(0)
const expanded = ref(false)
const replay = ref(0)
const lanes = ['Review','In progress','Resolved']
</script>

# Motion

Motion is a signal that the underlying state changed, not a progress claim. These interactive demos use **local sample state**. Wire motion to observed events in a real app; avoid looping success and error signals.

## Lane transition

A card should visibly move when it changes lanes, rather than disappear and reappear. For a live board, measure old and new positions, invert the delta and play it back with FLIP. Keep the DOM order and keyboard navigation correct.

<div class="l-demo"><button class="l-btn l-primary" @click="lane=(lane+1)%3">Move sample card →</button><div class="l-lane-track"><div class="l-lane-labels"><span v-for="item in lanes" :key="item">{{item}}</span></div><div class="l-lane-card" :class="'l-lane-'+lane" :style="{left:lane*50+'%'}">Sample task <small>{{lanes[lane]}}</small></div></div></div>

## Status pulse and transition ring

The running status breathes quietly. Blocked remains static. A success ring occurs only once on entering success, not forever. Labels are always visible even with animation turned off.

<div class="l-demo l-status-row"><span class="l-state"><i class="l-status-running"></i><b>Running</b></span><span class="l-state"><i class="l-status-blocked"></i><b>Blocked</b></span><span class="l-state"><i class="l-status-done"></i><b>Resolved</b></span></div>

## Expand in place

An inline panel preserves context. Its trigger is a button with `aria-expanded`, and the detail remains accessible when motion is reduced.

<div class="l-demo"><button class="l-expand-button" :aria-expanded="expanded" aria-controls="motion-detail" @click="expanded=!expanded"><strong>Sample task</strong><span>{{expanded?'Hide details −':'Show details +'}}</span></button><div id="motion-detail" v-if="expanded" class="l-expand-detail"><span class="l-badge l-badge-warn">In progress</span><p>Next step: review the pending change. This is example content, not a live task.</p></div></div>

## Staggered entrance

Only rows visible after a filter or page change should animate. Keep entrance under 240 ms of total delay so a long list never has to wait for its own content.

<div class="l-demo"><button class="l-btn l-secondary" @click="replay++">Replay entrance</button><div :key="replay" class="l-stagger"><div v-for="(item,i) in ['Review draft','Check status','Merge ready']" :key="item" :style="{'--item-delay':i*70+'ms'}"><span class="l-dot"></span>{{item}}</div></div></div>

## Canvas particle flow

Particles belong to an observed transition and move along the graph's actual edges. The [Graphs demo](/graphs) shows a small sample DAG with Bézier paths, moving particles and a running-node ring. For a board, keep cards and columns in HTML and use canvas only as a decorative layer behind them.

## Production checklist

- Respect `prefers-reduced-motion: reduce` across CSS and canvas. Never hide state in movement alone.
- Stop loops offscreen and clean up `requestAnimationFrame`, observers and timers on unmount.
- Animate a card only after a confirmed state change. Do not fake backend progress.
- Keep DOM, labels, focus, ordering and actions intact while animating.
- Limit painting and particle counts on phone. Never animate all rows in a large page at once.
