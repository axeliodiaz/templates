<script setup>
// Template gallery for the home page: one card per template with a real
// thumbnail. Cards rise in with the motion library (skipped under
// prefers-reduced-motion); hover/focus zoom is CSS-only and also motion-safe.
import { ref, onMounted } from 'vue'
import { animate, stagger } from 'motion'

const cards = [
  { title: 'Reference collection', details: 'Five standalone interactive templates, two reusable graph components. Original UI patterns with sample data.', link: '/reference-templates', thumb: 'reference-templates' },
  { title: 'Margin', details: 'Job economics, estimate versus actual costs, profit bridge and work timeline.', link: '/margin', thumb: 'margin' },
  { title: 'Evertrue', details: 'Self-updating pages terminal - ticking counters, refreshing page cards and KPI panels with struck-through was-lines.', link: '/evertrue', thumb: 'evertrue' },
  { title: 'Sentinel', details: 'Agent security dashboard, request charts, local review and credential states.', link: '/agent-security', thumb: 'agent-security' },
  { title: 'Brief', details: 'Agent onboarding with brief, rules, limits and sample replay gates.', link: '/agent-onboarding', thumb: 'agent-onboarding' },
  { title: 'Pace', details: 'Fitness goals, workout discovery, a local timer and progress views.', link: '/fitness', thumb: 'fitness' },
  { title: 'Cargo', details: 'Trade finance, shipment details, repayment drafts and demo verification.', link: '/trade-finance', thumb: 'trade-finance' },
  { title: 'Trial journey', details: 'Sankey conversion funnel with drop-offs, date ranges, animated flow and keyboard focus.', link: '/trial-journey', thumb: 'trial-journey' },
  { title: 'Reusable graphs', details: 'Topology and workflow components with editable nodes, events, slots and theme tokens.', link: '/graph-components', thumb: 'graph-components' },
  { title: 'Relay', details: 'Dark graphite control room for agents and MCP servers, Bootstrap 6, live graph and sample approvals.', link: '/relay', thumb: 'relay' },
  { title: 'Folio', details: 'Charcoal finance system, mint actions, component states and cash-flow patterns.', link: '/folio', thumb: 'folio' },
  { title: 'Spark', details: 'Dark orange analytics system, pixel histograms, reporting components and live variants.', link: '/spark', thumb: 'spark' },
  { title: 'Bastion', details: 'Retro-terminal ops dashboard. Phosphor green and amber on a green-black grid, square panels, a live tail, and an ops agent.', link: '/bastion', thumb: 'bastion' },
  { title: 'Lustro', details: 'Dark glassmorphism, indigo-to-pink/cyan gradients, Space Grotesk / DM Sans / JetBrains Mono.', link: '/lustro', thumb: 'lustro' },
  { title: 'Felix', details: 'Linen and slate, turquoise and lime, Plain for display and Saans for UI.', link: '/felix', thumb: 'felix' },
  { title: 'PulseFit', details: 'Warm gold on a clean light surface, charcoal navigation, Montserrat, Rubik and Bebas Neue.', link: '/pulsefit', thumb: 'pulsefit' },
  { title: 'Scopecraft', details: 'Light and neutral proposal builder: near-black buttons, soft white cards, tiny uppercase labels.', link: '/scopecraft', thumb: 'scopecraft' },
  { title: 'Lumen', details: 'Warm off-white app in a cool gray frame, quiet borders, one color per model.', link: '/lumen', thumb: 'lumen' },
  { title: 'Pawprint', details: 'Pet-care language from color psychology research - cream, harbor blue, biscuit yellow and sage, rounded and playful.', link: '/pawprint', thumb: 'pawprint' },
]

const root = ref(null)

onMounted(() => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  const els = root.value?.querySelectorAll('.tg-card')
  if (els && els.length) {
    animate(els, { opacity: [0, 1], y: [14, 0] }, { delay: stagger(0.045), duration: 0.45, easing: 'ease-out' })
  }
})
</script>

<template>
<section class="tg" ref="root" aria-label="Template gallery">
  <div class="tg-grid">
    <a v-for="c in cards" :key="c.link" class="tg-card" :href="c.link">
      <span class="tg-thumb" aria-hidden="true">
        <img :src="`/thumbnails/${c.thumb}.webp`" :alt="`${c.title} template preview`" loading="lazy" width="480" height="270" />
      </span>
      <span class="tg-body">
        <span class="tg-title">{{ c.title }}</span>
        <span class="tg-details">{{ c.details }}</span>
      </span>
    </a>
  </div>
</section>
</template>

<style scoped>
.tg { margin-top: 8px; }
.tg-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 16px;
}
.tg-card {
  display: flex;
  flex-direction: column;
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  background: var(--vp-c-bg-soft);
  overflow: hidden;
  text-decoration: none !important;
  color: inherit;
  transition: transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease;
}
.tg-card:hover, .tg-card:focus-visible {
  transform: translateY(-3px);
  border-color: var(--vp-c-brand-1);
  box-shadow: 0 10px 28px rgba(0, 0, 0, 0.22);
}
.tg-thumb {
  display: block;
  aspect-ratio: 16 / 9;
  overflow: hidden;
  border-bottom: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-mute);
}
.tg-thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: top center;
  display: block;
  transition: transform 0.35s ease;
}
.tg-card:hover .tg-thumb img, .tg-card:focus-visible .tg-thumb img { transform: scale(1.045); }
.tg-body { display: flex; flex-direction: column; gap: 6px; padding: 14px 16px 16px; }
.tg-title { font-weight: 600; font-size: 15px; color: var(--vp-c-text-1); }
.tg-details { font-size: 13px; line-height: 1.5; color: var(--vp-c-text-2); }
@media (prefers-reduced-motion: reduce) {
  .tg-card, .tg-thumb img { transition: none; }
  .tg-card:hover, .tg-card:focus-visible { transform: none; }
  .tg-card:hover .tg-thumb img, .tg-card:focus-visible .tg-thumb img { transform: none; }
}
</style>
