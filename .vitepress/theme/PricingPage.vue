<script setup>
import { computed, ref } from 'vue'
const props = defineProps({ language: { type: String, default: 'lustro' }, kind: { type: String, default: 'saas' } })
const annual = ref(true)
const seats = ref(5)
const open = ref(0)
const studio = props.kind === 'studio'
const plans = studio ? [
  { id: 'drop', name: 'Drop-in', tag: 'Try a class', price: 22, unit: 'per class', per: false, blurb: 'No commitment. Book any class up to 7 days ahead.', feats: ['Any group class', 'Shoe rental $3', 'Waitlist access', 'Valid 30 days'], cta: 'Buy a class' },
  { id: 'core', name: 'Core', tag: 'Most popular', price: 129, unit: 'per month', per: false, popular: true, blurb: '8 classes a month with rollover for one cycle.', feats: ['8 classes / month', 'Book 14 days ahead', 'Free shoe rental', 'Bring a friend once a month', 'Pause up to 30 days'], cta: 'Start Core' },
  { id: 'unl', name: 'Unlimited', tag: 'Best value', price: 199, unit: 'per month', per: false, blurb: 'Ride as often as you like, including peak hours.', feats: ['Unlimited classes', 'Book 21 days ahead', 'Free shoe and towel', '2 guest passes / month', 'Priority waitlist', 'Member-only workshops'], cta: 'Go Unlimited' },
  { id: 'duo', name: 'Duo', tag: 'For two', price: 339, unit: 'per month', per: false, blurb: 'Two Unlimited memberships on one invoice.', feats: ['2 Unlimited members', 'Shared guest passes', 'Joint class booking', 'One billing contact'], cta: 'Start Duo' }
] : [
  { id: 'free', name: 'Starter', tag: 'For trying it out', price: 0, unit: 'free forever', per: false, blurb: 'One workspace for a solo founder or a small side project.', feats: ['1 workspace', 'Up to 3 members', '5 GB storage', 'Community support'], cta: 'Start free' },
  { id: 'team', name: 'Team', tag: 'Most popular', price: 12, unit: 'per member / month', per: true, popular: true, blurb: 'Shared workspaces, automations and reporting for growing teams.', feats: ['Unlimited workspaces', 'Unlimited members', '250 GB storage', 'Automations (10k runs)', 'Priority email support'], cta: 'Start 14-day trial' },
  { id: 'biz', name: 'Business', tag: 'Best for scale', price: 24, unit: 'per member / month', per: true, blurb: 'Security controls, audit history and roles for larger organisations.', feats: ['Everything in Team', 'SSO and SCIM', 'Audit log (1 year)', 'Custom roles', '1 TB storage', 'Live chat support'], cta: 'Start 14-day trial' },
  { id: 'ent', name: 'Enterprise', tag: 'Custom', price: null, unit: 'talk to sales', per: false, blurb: 'Dedicated environment, custom contracts and a named success manager.', feats: ['Everything in Business', 'Dedicated region', 'Uptime SLA 99.95%', 'Security review', 'Named success manager'], cta: 'Contact sales' }
]
const compare = studio ? [
  { group: 'Booking', rows: [['Classes per month', ['1', '8', 'Unlimited', 'Unlimited x2']], ['Booking window', ['7 days', '14 days', '21 days', '21 days']], ['Waitlist', ['Standard', 'Standard', 'Priority', 'Priority']]] },
  { group: 'Perks', rows: [['Shoe rental', ['$3', true, true, true]], ['Towel service', [false, false, true, true]], ['Guest passes', [false, '1', '2', '4 shared']], ['Member workshops', [false, false, true, true]]] },
  { group: 'Flexibility', rows: [['Pause membership', [false, '30 days', '60 days', '60 days']], ['Class rollover', [false, '1 cycle', 'n/a', 'n/a']], ['Cancel anytime', [true, true, true, true]]] }
] : [
  { group: 'Workspace', rows: [['Workspaces', ['1', 'Unlimited', 'Unlimited', 'Unlimited']], ['Members', ['3', 'Unlimited', 'Unlimited', 'Unlimited']], ['Storage', ['5 GB', '250 GB', '1 TB', 'Custom']], ['Version history', ['7 days', '90 days', '1 year', 'Unlimited']]] },
  { group: 'Automation', rows: [['Automation runs / month', ['500', '10,000', '100,000', 'Custom']], ['Webhooks and API', [false, true, true, true]], ['Scheduled reports', [false, true, true, true]]] },
  { group: 'Security', rows: [['Two-factor authentication', [true, true, true, true]], ['SSO and SCIM', [false, false, true, true]], ['Audit log', [false, false, true, true]], ['Custom roles', [false, false, true, true]], ['Dedicated region', [false, false, false, true]]] },
  { group: 'Support', rows: [['Support channel', ['Community', 'Email', 'Email + chat', 'Named manager']], ['Response time', ['Best effort', '1 business day', '4 hours', '1 hour']]] }
]
const faqs = studio ? [
  ['Can I switch plans later?', 'Yes. Upgrades apply immediately and are prorated. Downgrades start at your next billing date.'],
  ['What happens to unused classes?', 'Core members roll over unused classes for one cycle. Drop-in credits expire after 30 days.'],
  ['How does the annual discount work?', 'Annual billing takes 15% off the monthly price and is charged once. You can pause, but not refund, the remaining months.'],
  ['Is there a cancellation fee?', 'No. Cancel any time before your next billing date and you keep access until the cycle ends.'],
  ['Do you offer student or corporate rates?', 'Students get 20% off Core and Unlimited with a valid ID. Teams of 10 or more can ask for a corporate rate at the front desk.']
] : [
  ['Can I change plans at any time?', 'Yes. Upgrades apply immediately and are prorated. Downgrades take effect at the next renewal.'],
  ['How does the 14-day trial work?', 'You get every Team or Business feature without entering a card. At the end you pick a plan or fall back to Starter.'],
  ['What counts as a member?', 'Anyone who can edit in a workspace. Viewers and guests are free and unlimited.'],
  ['How does annual billing work?', 'Annual billing takes 20% off and is invoiced once a year. Seats added mid-year are prorated.'],
  ['Do you offer discounts for nonprofits or education?', 'Verified nonprofits and schools get 50% off Team. Contact support with your registration details.']
]
const factor = computed(() => (studio ? 0.85 : 0.8))
function cost(p) {
  if (p.price === null) return null
  if (p.price === 0) return 0
  if (p.unit === 'per class') return p.price
  const base = annual.value ? Math.round(p.price * factor.value) : p.price
  return base
}
function total(p) {
  const c = cost(p)
  if (c === null || c === 0) return null
  if (p.per) return c * seats.value
  return c
}
const money = n => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n)
function yearly(p) {
  const t = total(p)
  if (t === null || p.unit === 'per class') return null
  return annual.value ? t * 12 : null
}
function saved(p) {
  if (!annual.value || p.price === null || p.price === 0 || p.unit === 'per class') return null
  const t = p.per ? p.price * seats.value : p.price
  return (t - total(p)) * 12
}
const cell = v => (v === true ? '✓' : v === false ? '–' : v)
const cellLabel = v => (v === true ? 'Included' : v === false ? 'Not included' : v)
</script>

<template>
<div class="pr" :class="`pr-${props.language}`">
  <header class="pr-head">
    <span class="pr-eyebrow">{{ studio ? 'MEMBERSHIPS' : 'PRICING' }}</span>
    <h3>{{ studio ? 'Find the plan that fits your week.' : 'Simple plans that scale with your team.' }}</h3>
    <p>{{ studio ? 'Northside Cycle Studio · Prices in USD, taxes not included' : 'Northstar Workspace · Prices in USD, billed per workspace' }}</p>
    <div class="pr-controls">
      <div class="pr-toggle" role="group" aria-label="Billing period">
        <button type="button" :class="{ on: !annual }" :aria-pressed="!annual" @click="annual = false">Monthly</button>
        <button type="button" :class="{ on: annual }" :aria-pressed="annual" @click="annual = true">Annual <span class="pr-save">Save {{ studio ? '15' : '20' }}%</span></button>
      </div>
      <label v-if="!studio" class="pr-seats">Team size
        <select v-model.number="seats"><option :value="3">3 members</option><option :value="5">5 members</option><option :value="10">10 members</option><option :value="25">25 members</option><option :value="50">50 members</option></select>
      </label>
    </div>
  </header>

  <section class="pr-grid" aria-label="Plans" aria-live="polite">
    <article v-for="p in plans" :key="p.id" class="pr-card" :class="{ pop: p.popular }">
      <span v-if="p.popular" class="pr-badge">Most popular</span>
      <small class="pr-tag">{{ p.tag }}</small>
      <h4>{{ p.name }}</h4>
      <p class="pr-blurb">{{ p.blurb }}</p>
      <div class="pr-price"><strong v-if="p.price === null" class="pr-custom">Custom</strong><strong v-else>{{ money(cost(p)) }}</strong><span>{{ p.unit }}</span></div>
      <p class="pr-note">
        <template v-if="total(p) !== null && p.per">{{ money(total(p)) }} / month for {{ seats }} members</template>
        <template v-else-if="saved(p)">Billed {{ money(yearly(p)) }} yearly · you save {{ money(saved(p)) }}</template>
        <template v-else-if="p.price === 0">No card required</template>
        <template v-else-if="p.price === null">Volume pricing and custom terms</template>
        <template v-else>Billed monthly, cancel any time</template>
      </p>
      <button type="button" class="pr-cta" :class="{ solid: p.popular }">{{ p.cta }}</button>
      <ul><li v-for="f in p.feats" :key="f"><span aria-hidden="true">✓</span>{{ f }}</li></ul>
    </article>
  </section>

  <section class="pr-trust" aria-label="Guarantees">
    <div><strong>{{ studio ? 'First class free' : '14-day trial' }}</strong><span>{{ studio ? 'New riders try any class once at no cost.' : 'No card needed to start.' }}</span></div>
    <div><strong>{{ studio ? 'Cancel online' : 'Cancel any time' }}</strong><span>{{ studio ? 'No fee, no phone call.' : 'Keep your data for 30 days.' }}</span></div>
    <div><strong>{{ studio ? 'Pause when you travel' : 'Secure by default' }}</strong><span>{{ studio ? 'Freeze up to 60 days a year.' : 'Encrypted at rest and in transit.' }}</span></div>
  </section>

  <section class="pr-compare">
    <h4>Compare plans</h4>
    <div class="pr-scroll">
      <table>
        <thead><tr><th scope="col">Feature</th><th v-for="p in plans" :key="p.id" scope="col">{{ p.name }}</th></tr></thead>
        <template v-for="g in compare" :key="g.group">
          <tbody>
            <tr class="pr-group"><th :colspan="plans.length + 1" scope="colgroup">{{ g.group }}</th></tr>
            <tr v-for="r in g.rows" :key="r[0]"><th scope="row">{{ r[0] }}</th><td v-for="(v, i) in r[1]" :key="i" :class="{ yes: v === true, no: v === false }"><span :aria-label="cellLabel(v)">{{ cell(v) }}</span></td></tr>
          </tbody>
        </template>
      </table>
    </div>
  </section>

  <section class="pr-quote">
    <blockquote>{{ studio ? '“Unlimited paid for itself in three weeks. I stopped counting classes and just showed up.”' : '“We moved forty people onto Team in an afternoon. The audit log alone justified Business.”' }}</blockquote>
    <cite>{{ studio ? 'Camila R., member since 2024' : 'Daniel Okafor, Operations lead at Brightwell' }}</cite>
  </section>

  <section class="pr-faq">
    <h4>Frequently asked questions</h4>
    <div v-for="(f, i) in faqs" :key="f[0]" class="pr-q" :class="{ open: open === i }">
      <button type="button" :aria-expanded="open === i" @click="open = open === i ? -1 : i"><span>{{ f[0] }}</span><b aria-hidden="true">{{ open === i ? '−' : '+' }}</b></button>
      <p v-if="open === i">{{ f[1] }}</p>
    </div>
  </section>

  <section class="pr-final">
    <div><h4>{{ studio ? 'Not sure yet?' : 'Still comparing?' }}</h4><p>{{ studio ? 'Book a free intro ride and a coach will help you choose.' : 'Talk to our team for a walkthrough and a tailored quote.' }}</p></div>
    <button type="button" class="pr-cta solid">{{ studio ? 'Book intro ride' : 'Talk to sales' }}</button>
  </section>
</div>
</template>

<style>
.pr{--pr-bg:#111120;--pr-panel:#1a192c;--pr-line:#353149;--pr-text:#f5f3ff;--pr-muted:#b4afcb;--pr-accent:#a6a7ff;--pr-on:#17162b;--pr-soft:#292743;--pr-pos:#78ddbe;background:var(--pr-bg);color:var(--pr-text);border:1px solid var(--pr-line);border-radius:20px;padding:28px;margin:20px 0;font-family:'DM Sans',sans-serif}
.pr-felix{--pr-bg:#f5f1eb;--pr-panel:#fffefa;--pr-line:#ded9d1;--pr-text:#172d2c;--pr-muted:#586966;--pr-accent:#087b76;--pr-on:#fff;--pr-soft:#dcefeb;--pr-pos:#147c56;border-radius:24px}
html.felix-dark .pr-felix{--pr-bg:#082422;--pr-panel:#152f2e;--pr-line:#35605f;--pr-text:#fefcf9;--pr-muted:#c3e2e1;--pr-accent:#69d7d2;--pr-on:#082422;--pr-soft:#1a4b47;--pr-pos:#91dfb2}
.pr-pulsefit{--pr-bg:#f5f5f5;--pr-panel:#fff;--pr-line:#dedede;--pr-text:#212121;--pr-muted:#5f666d;--pr-accent:#7a5a1f;--pr-on:#fff;--pr-soft:#f5e6d3;--pr-pos:#11643b;font-family:'Rubik',sans-serif;border-radius:16px}
.pr *{box-sizing:border-box}
.pr h3,.pr h4,.pr p,.pr blockquote,.pr cite{margin:0!important;border:0!important;padding-top:0!important;letter-spacing:normal}
.pr-head{text-align:center;display:grid;gap:8px;justify-items:center}
.pr-eyebrow{font-size:11px;letter-spacing:.14em;color:var(--pr-accent);font-weight:700}
.pr h3{font:600 30px/1.2 'Space Grotesk',sans-serif!important;color:var(--pr-text)}
.pr-pulsefit h3{font:400 40px/1.1 'Bebas Neue','Rubik',sans-serif!important;letter-spacing:.02em}
.pr-head>p{color:var(--pr-muted);font-size:14px}
.pr-controls{display:flex;gap:14px;align-items:center;justify-content:center;flex-wrap:wrap;margin-top:10px}
.pr-toggle{display:inline-flex;background:var(--pr-soft);border-radius:999px;padding:4px}
.pr-toggle button{border:0;background:transparent;color:var(--pr-muted);font:600 13px inherit;font-family:inherit;padding:8px 16px;border-radius:999px;cursor:pointer}
.pr-toggle button.on{background:var(--pr-accent);color:var(--pr-on)}
.pr-toggle button:focus-visible,.pr-cta:focus-visible,.pr-q button:focus-visible,.pr-seats select:focus-visible{outline:2px solid var(--pr-accent);outline-offset:2px}
.pr-save{font-size:11px;font-weight:700;margin-left:4px;opacity:.9}
.pr-seats{display:flex;gap:8px;align-items:center;font-size:13px;color:var(--pr-muted)}
.pr-seats select{background:var(--pr-panel);color:var(--pr-text);border:1px solid var(--pr-line);border-radius:10px;padding:7px 10px;font:inherit}
.pr-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:14px;margin-top:26px;align-items:stretch}
.pr-card{position:relative;background:var(--pr-panel);border:1px solid var(--pr-line);border-radius:16px;padding:20px;display:flex;flex-direction:column;gap:8px}
.pr-card.pop{border-color:var(--pr-accent);box-shadow:0 0 0 1px var(--pr-accent),0 12px 32px rgba(0,0,0,.18)}
.pr-badge{position:absolute;top:-11px;left:20px;background:var(--pr-accent);color:var(--pr-on);font-size:11px;font-weight:700;border-radius:999px;padding:3px 10px}
.pr-tag{color:var(--pr-muted);font-size:12px}
.pr-card h4{font:600 20px/1.2 'Space Grotesk',sans-serif!important;color:var(--pr-text)}
.pr-pulsefit .pr-card h4{font:400 26px/1.1 'Bebas Neue','Rubik',sans-serif!important}
.pr-blurb{font-size:13px;color:var(--pr-muted);min-height:54px;line-height:1.45}
.pr-price{display:flex;align-items:baseline;gap:6px;flex-wrap:wrap;margin-top:6px}
.pr-price strong{font:700 34px/1 'Space Grotesk',sans-serif;color:var(--pr-text)}
.pr-pulsefit .pr-price strong{font:400 42px/1 'Bebas Neue','Rubik',sans-serif}
.pr-price span{font-size:12px;color:var(--pr-muted)}
.pr-note{font-size:12px;color:var(--pr-pos);min-height:32px}
.pr-cta{border:1px solid var(--pr-accent);background:transparent;color:var(--pr-accent);font:600 14px inherit;font-family:inherit;border-radius:12px;padding:11px 14px;cursor:pointer;width:100%}
.pr-cta.solid{background:var(--pr-accent);color:var(--pr-on)}
.pr-final .pr-cta{width:auto;white-space:nowrap}
.pr-card ul{list-style:none;margin:8px 0 0!important;padding:0!important;display:grid;gap:8px}
.pr-card li{display:flex;gap:8px;font-size:13px;margin:0!important;color:var(--pr-text)}
.pr-card li span{color:var(--pr-pos);font-weight:700}
.pr-trust{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px;margin-top:22px}
.pr-trust div{background:var(--pr-soft);border-radius:14px;padding:14px 16px;display:grid;gap:3px}
.pr-trust strong{font-size:14px}.pr-trust span{font-size:12px;color:var(--pr-muted)}
.pr-compare{margin-top:32px}.pr h4{font-size:18px}
.pr-compare h4,.pr-faq h4{margin-bottom:12px!important;font:600 20px/1.2 'Space Grotesk',sans-serif!important;color:var(--pr-text)}
.pr-pulsefit .pr-compare h4,.pr-pulsefit .pr-faq h4,.pr-pulsefit .pr-final h4{font:400 26px/1.1 'Bebas Neue','Rubik',sans-serif!important}
.pr-scroll{overflow-x:auto;border:1px solid var(--pr-line);border-radius:14px;background:var(--pr-panel)}
.pr table{border-collapse:collapse;width:100%!important;min-width:640px;margin:0!important;display:table!important}
.pr th,.pr td{padding:11px 14px!important;border:0!important;border-bottom:1px solid var(--pr-line)!important;font-size:13px;text-align:center;background:transparent!important;color:var(--pr-text)!important}
.pr thead th{background:var(--pr-soft)!important;font-weight:700}
.pr tbody th{text-align:left;font-weight:500}
.pr tr.pr-group th{text-align:left;font-size:11px;letter-spacing:.1em;text-transform:uppercase;color:var(--pr-accent)!important;background:transparent!important}
.pr td.yes{color:var(--pr-pos)!important;font-weight:700}.pr td.no{color:var(--pr-muted)!important}
.pr thead th:first-child,.pr tbody th{text-align:left}
.pr-quote{margin-top:32px;background:var(--pr-panel);border:1px solid var(--pr-line);border-radius:16px;padding:24px;text-align:center;display:grid;gap:10px}
.pr blockquote{color:var(--pr-text)!important;font:500 19px/1.45 'Space Grotesk',sans-serif;color:var(--pr-text)}
.pr-pulsefit blockquote{font:500 18px/1.5 'Rubik',sans-serif}
.pr cite{font-size:13px;color:var(--pr-muted);font-style:normal}
.pr-faq{margin-top:32px}
.pr-q{border:1px solid var(--pr-line);border-radius:12px;background:var(--pr-panel);margin-bottom:8px;overflow:hidden}
.pr-q button{display:flex;justify-content:space-between;align-items:center;width:100%;border:0;background:transparent;color:var(--pr-text);font:600 14px inherit;font-family:inherit;padding:14px 16px;text-align:left;cursor:pointer;gap:12px}
.pr-q b{color:var(--pr-accent);font-size:18px}
.pr-q p{padding:0 16px 14px!important;font-size:13px;color:var(--pr-muted);line-height:1.55}
.pr-final{margin-top:28px;background:var(--pr-soft);border-radius:16px;padding:20px 24px;display:flex;justify-content:space-between;align-items:center;gap:16px;flex-wrap:wrap}
.pr-final h4{font:600 20px/1.2 'Space Grotesk',sans-serif!important;color:var(--pr-text);margin-bottom:4px!important}.pr-final p{font-size:13px;color:var(--pr-muted)}
@media(min-width:960px){.VPDoc:has(.pr) .content-container{max-width:1100px!important}.VPDoc:has(.pr) .content{max-width:1200px!important}.VPDoc:has(.pr) .aside{display:none}}
@media(max-width:1100px){.pr-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}
@media(max-width:700px){.pr{padding:16px}.pr h3{font-size:23px!important}.pr-grid,.pr-trust{grid-template-columns:1fr}.pr-blurb,.pr-note{min-height:0}.pr-final .pr-cta{width:100%}}
@media(prefers-reduced-motion:no-preference){.pr-card,.pr-cta{transition:transform .15s,box-shadow .15s}.pr-card:hover{transform:translateY(-2px)}}
.pr table tr,.VPDoc:has(.pr) .vp-doc .pr tr,html.felix-dark .VPDoc:has(.pr) .vp-doc .pr tr{background:transparent!important}
.pr-card{padding:16px}.pr-card h4{font-size:18px!important}.pr-price strong.pr-custom{font-size:26px}
.pr th,.pr td{padding:10px 10px!important}.pr table{min-width:560px}
</style>
