<script setup>
import MarginGuidePreview from '../MarginGuidePreview.vue'
import MarginPrLifecycleDemo from './MarginPrLifecycleDemo.vue'
import MarginPrLifecycleStateGallery from './MarginPrLifecycleStateGallery.vue'
</script>

<template>
  <div class="margin-prl-doc">
    <p>
      Track a pull request from draft through checks, review, optional comment resolution, approvals,
      merge readiness, and merged. Synthetic data for PR #491 continues the Squash force-push storyline.
    </p>
    <MarginGuidePreview label="Live lifecycle (autoplay once when visible)">
      <MarginPrLifecycleDemo />
    </MarginGuidePreview>

    <h2 id="reference-states">Reference states</h2>
    <p>Full cards (720px max) — loading, empty, draft, checks, review loops, blocked approvals, ready, merged, error, and closed.</p>
    <MarginGuidePreview label="State gallery">
      <MarginPrLifecycleStateGallery />
    </MarginGuidePreview>

    <h2 id="motion-timing">Motion &amp; timing</h2>
    <table>
      <thead>
        <tr><th>Event</th><th>Duration</th><th>Notes</th></tr>
      </thead>
      <tbody>
        <tr><td>Phase advance</td><td>≈650 ms</td><td>Connector 360 ms ease-io; next phase at 80%</td></tr>
        <tr><td>Fix &amp; push</td><td>≈1.7 s</td><td>Arc 520 ms; arc fades to history 400 ms</td></tr>
        <tr><td>Review ⇄ Resolve</td><td>≈3.3 s</td><td>Threads every 350 ms</td></tr>
        <tr><td>Autoplay</td><td>≈21 s</td><td>18 steps; pause on interaction or hidden tab</td></tr>
      </tbody>
    </table>
  </div>
</template>