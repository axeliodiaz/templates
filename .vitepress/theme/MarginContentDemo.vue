<script setup lang="ts">
import { useMarginPreviewDark } from './useMarginPreviewDark'
const props = defineProps<{ section: string }>()
const previewDark = useMarginPreviewDark()
const show = (id: string) => !props.section || props.section === id
</script>
<template>
  <div
    class="lab b2-bs6 b2-margin margin-bs6-root margin-content-demo"
    :class="{ 'lab-dark': previewDark }"
  >
    <section v-show="show('reboot')" class="mg-content-block" aria-label="Reboot">
      <h1>Profit review</h1>
      <h2>Quarter summary</h2>
      <p>Margin uses Bootstrap Reboot inside <code>.lab</code> so headings, paragraphs and links inherit AA contrast in light and dark previews.</p>
      <p><a href="/margin">Back to overview</a> · <a href="/margin/analytics">Analytics demo</a></p>
      <ul><li>Normalize box sizing and typography</li><li>Respect user font and motion preferences</li></ul>
      <ol><li>Load scoped Bootstrap 6 stylesheet</li><li>Map <code>--lab</code> tokens into <code>--b2-*</code></li></ol>
    </section>
    <section v-show="show('typography')" class="mg-content-block" aria-label="Typography">
      <p class="display-6">Display headline</p>
      <p class="lead">Lead paragraph: scan KPI deltas before drilling into job-level leakage.</p>
      <blockquote class="blockquote"><p>Teams kept the same markup while swapping palette tokens.</p><footer class="blockquote-footer">Margin design ops</footer></blockquote>
      <p><mark>Highlighted</mark> inline text and <small class="text-body-secondary">secondary captions</small>.</p>
    </section>
    <section v-show="show('images')" class="mg-content-block" aria-label="Images">
      <svg class="img-fluid rounded border" viewBox="0 0 320 140" role="img" aria-label="Sample margin chart placeholder" style="max-height:140px;background:linear-gradient(135deg,var(--soft,#eceef5),var(--surface,#fff))">
        <text x="50%" y="52%" text-anchor="middle" fill="var(--muted,#676e7b)" font-size="14">320×140 sample figure</text>
      </svg>
      <figure class="figure text-center mt-3">
        <svg class="figure-img img-fluid rounded" viewBox="0 0 280 90" role="img" aria-label="Leakage trend thumbnail" style="background:var(--soft,#eceef5);max-height:90px"><text x="50%" y="55%" text-anchor="middle" fill="var(--ink,#22252b)" font-size="12">Figure image</text></svg>
        <figcaption class="figure-caption">Fig. 1 — Fictitious weekly margin trend.</figcaption>
      </figure>
    </section>
    <section v-show="show('tables') || show('tables-figures')" class="mg-content-block" aria-label="Tables">
      <div class="table-responsive">
        <table class="table table-striped table-hover align-middle">
          <caption class="caption-top">Sample job margins</caption>
          <thead><tr><th scope="col">Job</th><th scope="col">Status</th><th scope="col" class="text-end">Margin</th></tr></thead>
          <tbody>
            <tr><th scope="row">#5812</th><td><span class="badge text-bg-warning">At risk</span></td><td class="text-end">12.4%</td></tr>
            <tr><th scope="row">#5819</th><td><span class="badge text-bg-success">On target</span></td><td class="text-end">28.1%</td></tr>
          </tbody>
        </table>
      </div>
      <figure class="text-center mt-3">
        <blockquote class="blockquote"><p>Job #5812 lost 4.2 pts vs plan.</p></blockquote>
        <figcaption class="blockquote-footer">Operations review · Nov 2026</figcaption>
      </figure>
    </section>
    <section v-show="show('prose')" class="mg-content-block" aria-label="Prose">
      <article>
        <h3>Margin narrative</h3>
        <p>Prose blocks use rebooted heading and paragraph styles inside <code>.lab</code>. Prefer <a href="/margin/content/typography">typography</a> for display utilities and the <a href="/margin">Margin overview</a> for dashboard type roles (DM Sans / Space Grotesk).</p>
        <hr />
        <p><abbr title="Gross margin">GM</abbr> reviews combine tables and short paragraphs.</p>
      </article>
    </section>
  </div>
</template>
<style scoped>
.margin-content-demo {
  font: 13px/1.55 'DM Sans', system-ui, sans-serif;
}
.mg-content-block :is(h1, h2, h3, p, li, th, td, a, blockquote, figcaption) {
  color: inherit;
}
.margin-content-demo :focus-visible {
  outline: 2px solid #6389ea;
  outline-offset: 3px;
}
.margin-content-demo .display-6 {
  font-size: clamp(1.75rem, 3vw, 2.25rem);
  font-weight: 600;
  line-height: 1.2;
  letter-spacing: -0.02em;
}
.margin-content-demo .lead {
  font-size: 1.125rem;
  line-height: 1.45;
  color: var(--muted);
}
</style>