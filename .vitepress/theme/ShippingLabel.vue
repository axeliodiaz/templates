<script setup>
import { computed, reactive, ref } from 'vue'
const props = defineProps({ language: { type: String, default: 'lustro' } })
const presets = { 'Small box (20 × 15 × 10 cm)': [20, 15, 10], 'Medium box (40 × 30 × 20 cm)': [40, 30, 20], 'Large box (60 × 40 × 30 cm)': [60, 40, 30] }
const makePkg = (id, item, sku, itemKg, name, type, weight, l, w, h) => ({ id, item, sku, itemKg, mode: 'custom', name, type, weight, l, w, h, preset: 'Small box (20 × 15 × 10 cm)', save: true })
const pkgs = reactive([
  makePkg(1, 'Laptop sleeve, 16 in', 'SKU-LS-1604', 0.4, 'Personal Box', 'Box', 0.45, 45, 35, 11),
  makePkg(2, 'Studio display stand', 'SKU-DS-2208', 2.5, 'Personal Wood Box', 'Wooden crate', 1.2, 75, 30, 25)
])
const date = ref('2026-10-05')
const notify = ref(true)
const bought = ref(false)
const num = v => Math.max(0, Number(v) || 0)
const dims = p => p.mode === 'carrier' ? presets[p.preset] : [num(p.l), num(p.w), num(p.h)]
const price = p => { const d = dims(p); const base = 2.5 + (num(p.weight) + p.itemKg) * 0.9 + (d[0] * d[1] * d[2]) / 20000; return Math.round(base * (p.mode === 'carrier' ? 0.85 : 1) * 100) / 100 }
const money = n => '$' + n.toFixed(2)
const subtotal = computed(() => pkgs.reduce((s, p) => s + price(p), 0))
const discount = computed(() => 0)
const total = computed(() => subtotal.value - discount.value)
const errors = computed(() => pkgs.flatMap(p => (p.mode === 'custom' && (!num(p.weight) || !num(p.l) || !num(p.w) || !num(p.h))) ? [`${p.name}: enter a weight and all three dimensions.`] : []))
const canBuy = computed(() => !errors.value.length && !!date.value && !bought.value)
const buy = () => { if (canBuy.value) bought.value = true }
const reset = () => { bought.value = false; date.value = '2026-10-05'; notify.value = true }
</script>

<template>
<div class="shp" :class="`shp-${props.language}`">
  <div class="shp-backdrop" aria-hidden="true">
    <div class="shp-bar"><span>◎ Fikri Store</span><span>Orders</span></div>
    <h3>Order-12567 <span class="shp-chip">Paid</span></h3>
    <p>Placed Oct 3, 2026 · 2 products · Fictitious order</p>
    <div class="shp-ghost"></div><div class="shp-ghost short"></div>
  </div>
  <section class="shp-modal" role="group" aria-label="Create shipping label">
    <header><h4>Create Shipping Label</h4><span class="shp-chip">Demo · no carrier is contacted</span></header>
    <div class="shp-body">
      <div class="shp-left">
        <article v-for="p in pkgs" :key="p.id" class="shp-pkg">
          <div class="shp-item"><span class="shp-thumb" aria-hidden="true">▣</span><div><strong>{{ p.item }}</strong><small>{{ p.sku }}</small></div><label class="shp-sm">Item weight<input :value="p.itemKg" disabled> kg</label></div>
          <div class="shp-tabs" role="tablist"><button role="tab" :aria-selected="p.mode==='custom'" :class="{on:p.mode==='custom'}" @click="p.mode='custom'">Custom package</button><button role="tab" :aria-selected="p.mode==='carrier'" :class="{on:p.mode==='carrier'}" @click="p.mode='carrier'">Carrier package</button></div>
          <div v-if="p.mode==='custom'" class="shp-grid">
            <label class="wide">Package name<input v-model="p.name"></label>
            <label>Package type<select v-model="p.type"><option>Box</option><option>Wooden crate</option><option>Envelope</option></select></label>
            <label>Total weight (kg)<input type="number" min="0" step="0.05" v-model="p.weight"></label>
            <fieldset class="wide"><legend>Dimension (cm)</legend><div class="shp-dim"><label>L<input type="number" min="0" v-model="p.l"></label><label>W<input type="number" min="0" v-model="p.w"></label><label>H<input type="number" min="0" v-model="p.h"></label></div></fieldset>
          </div>
          <div v-else class="shp-grid"><label class="wide">Carrier package<select v-model="p.preset"><option v-for="(_, k) in presets" :key="k">{{ k }}</option></select></label><p class="wide">Carrier boxes are 15% cheaper and have fixed dimensions.</p></div>
          <div class="shp-foot"><label class="shp-check"><input type="checkbox" v-model="p.save"> Save this package for future use</label><span>Shipping item price <strong>{{ money(price(p)) }}</strong></span></div>
        </article>
      </div>
      <aside class="shp-right">
        <div class="shp-box" aria-live="polite"><h4>Summary</h4>
          <div class="shp-row"><span>Subtotal</span><span>{{ money(subtotal) }}</span></div>
          <div class="shp-row"><span>Discount</span><span>{{ money(discount) }}</span></div>
          <div class="shp-row total"><span>Total</span><span>{{ money(total) }}</span></div></div>
        <div class="shp-box"><label>Shipping date<input type="date" v-model="date"></label>
          <label class="shp-check"><input type="checkbox" v-model="notify"> Send shipping info to customer now</label></div>
        <div class="shp-box"><div class="shp-row"><h4>Return address</h4><span class="shp-link">Edit</span></div>
          <p>Fikri Store<br>5063 Kira Loop Suite 014<br>Clermont, Oklahoma 74201<br>United States</p></div>
      </aside>
    </div>
    <p v-if="errors.length" class="shp-err" role="alert">{{ errors[0] }}</p>
    <p v-if="bought" class="shp-ok" role="status">Label purchased for {{ money(total) }}, ships {{ date }}{{ notify ? '. Customer notified.' : '.' }} Nothing was sent; this is a UI demo.</p>
    <footer><span class="shp-link">Learn more about creating shipping labels</span><div><button class="ghost" @click="reset">Cancel</button><button class="primary" :disabled="!canBuy" @click="buy">{{ bought ? 'Label purchased' : 'Buy Shipping Label' }}</button></div></footer>
  </section>
</div>
</template>

<style>
.shp{--shp-bg:#111120;--shp-panel:#1a192c;--shp-line:#353149;--shp-text:#f5f3ff;--shp-muted:#b4afcb;--shp-accent:#a6a7ff;--shp-on:#111120;--shp-soft:#292743;--shp-ok:#78ddbe;--shp-err:#ff9aa8;position:relative;margin:26px 0 38px;padding:26px 22px;border:1px solid var(--shp-line);border-radius:20px;overflow:hidden;color:var(--shp-text);background:var(--shp-bg);font:12px/1.5 'DM Sans',sans-serif;text-align:left;box-shadow:0 15px 60px #0002}
.shp-felix{--shp-bg:#f5f1eb;--shp-panel:#fffefa;--shp-line:#ded9d1;--shp-text:#172d2c;--shp-muted:#586966;--shp-accent:#087b76;--shp-on:#fff;--shp-soft:#dcefeb;--shp-ok:#147c56;--shp-err:#b3261e;border-radius:24px}
html.felix-dark .shp-felix{--shp-bg:#082422;--shp-panel:#152f2e;--shp-line:#35605f;--shp-text:#fefcf9;--shp-muted:#c3e2e1;--shp-accent:#69d7d2;--shp-on:#082422;--shp-soft:#1a4b47;--shp-ok:#91dfb2;--shp-err:#ffb4ab}
.shp-pulsefit{--shp-bg:#f5f5f5;--shp-panel:#fff;--shp-line:#dedede;--shp-text:#212121;--shp-muted:#5f666d;--shp-accent:#7a5a1f;--shp-on:#fff;--shp-soft:#f5e6d3;--shp-ok:#11643b;--shp-err:#a4262c;font-family:'Rubik',sans-serif;border-radius:16px}
.shp *{box-sizing:border-box}.shp h3,.shp h4,.shp p{margin:0!important;border:0!important;padding:0!important}.shp h3{font:600 20px 'Space Grotesk',sans-serif}.shp h4{font-size:13px!important;font-weight:600}.shp-pulsefit h3,.shp-pulsefit h4{font-family:'Bebas Neue',sans-serif;font-weight:400;letter-spacing:.04em}.shp-pulsefit h4{font-size:16px!important}.shp p{color:var(--shp-muted);font-size:11px!important;line-height:1.6!important}.shp small{display:block;font-size:10px;color:var(--shp-muted)}
.shp-backdrop{position:absolute;inset:0;padding:22px;opacity:.35;filter:blur(2px);pointer-events:none}.shp-bar{display:flex;justify-content:space-between;margin-bottom:18px;color:var(--shp-muted)}.shp-ghost{height:70px;margin-top:14px;border-radius:12px;background:var(--shp-soft)}.shp-ghost.short{height:46px;width:60%}
.shp-chip{display:inline-block;padding:2px 9px;font-size:9px;font-weight:600;border:1px solid var(--shp-line);border-radius:99px;color:var(--shp-accent);background:var(--shp-soft)}
.shp-modal{position:relative;max-width:820px;margin:0 auto;padding:18px;border:1px solid var(--shp-line);border-radius:16px;background:var(--shp-panel);box-shadow:0 20px 60px #0004}.shp-modal>header{display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:14px}
.shp-body{display:grid;grid-template-columns:minmax(0,1.7fr) minmax(0,1fr);gap:14px}.shp-left{display:flex;flex-direction:column;gap:12px}.shp-right{display:flex;flex-direction:column;gap:12px}
.shp-pkg,.shp-box{padding:12px;border:1px solid var(--shp-line);border-radius:12px;background:var(--shp-bg)}.shp-box{display:flex;flex-direction:column;gap:9px}
.shp-item{display:flex;align-items:center;gap:10px;margin-bottom:10px}.shp-item>div{flex:1;min-width:0}.shp-item strong{font-size:12px}.shp-thumb{display:grid;place-items:center;width:34px;height:34px;border-radius:8px;background:var(--shp-soft);color:var(--shp-accent);font-size:18px}.shp-sm{display:flex;align-items:center;gap:5px;font-size:10px;color:var(--shp-muted)}.shp-sm input{width:52px}
.shp-tabs{display:flex;gap:2px;padding:3px;margin-bottom:10px;border:1px solid var(--shp-line);border-radius:8px;width:max-content;max-width:100%}.shp-tabs button{padding:5px 10px;font-size:10px;border:0;border-radius:5px;background:transparent;color:var(--shp-muted);cursor:pointer}.shp-tabs button.on{background:var(--shp-accent);color:var(--shp-on);font-weight:600}
.shp-grid{display:grid;grid-template-columns:1fr 1fr;gap:9px}.shp .wide{grid-column:1/-1}.shp label,.shp fieldset{display:flex;flex-direction:column;gap:4px;font-size:10px;color:var(--shp-muted);margin:0;padding:0;border:0;min-width:0}.shp legend{font-size:10px;padding:0 0 4px}.shp-dim{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}
.shp input,.shp select{font:inherit;font-size:12px;color:var(--shp-text);background:var(--shp-panel);border:1px solid var(--shp-line);border-radius:7px;padding:6px 9px;min-height:32px;min-width:0;width:100%}.shp input:disabled{opacity:.7}.shp input[type=checkbox]{width:15px;min-height:15px;accent-color:var(--shp-accent)}
.shp button:focus-visible,.shp input:focus-visible,.shp select:focus-visible{outline:3px solid var(--shp-accent);outline-offset:2px}
.shp .shp-check{flex-direction:row;align-items:center;gap:7px;color:var(--shp-text)}.shp-foot{display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap;margin-top:12px;padding-top:10px;border-top:1px solid var(--shp-line);font-size:11px;color:var(--shp-muted)}.shp-foot strong{color:var(--shp-text);margin-left:4px;font-variant-numeric:tabular-nums}
.shp-row{display:flex;justify-content:space-between;align-items:center;font-variant-numeric:tabular-nums}.shp-row.total{padding-top:8px;border-top:1px solid var(--shp-line);font-weight:700;font-size:14px}.shp-link{color:var(--shp-accent);font-size:10px;text-decoration:underline}
.shp-err{margin-top:12px!important;color:var(--shp-err)!important}.shp-ok{margin-top:12px!important;padding:8px 10px!important;border-radius:8px;background:var(--shp-soft);color:var(--shp-ok)!important}
.shp-modal>footer{display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap;margin-top:14px;padding-top:12px;border-top:1px solid var(--shp-line)}.shp-modal>footer>div{display:flex;gap:8px}
.shp-modal button.ghost,.shp-modal button.primary{padding:8px 14px;font:600 11px inherit;border-radius:8px;cursor:pointer;min-height:34px}.shp-modal button.ghost{background:transparent;border:1px solid var(--shp-line);color:var(--shp-text)}.shp-modal button.primary{background:var(--shp-accent);border:1px solid var(--shp-accent);color:var(--shp-on)}.shp-modal button.primary:disabled{opacity:.45;cursor:not-allowed}
@media(min-width:960px){.VPDoc:has(.shp) .content-container{max-width:1000px!important}.VPDoc:has(.shp) .content{max-width:1000px!important}.VPDoc:has(.shp) .aside{display:none}}
@media(max-width:700px){.shp{padding:14px 10px}.shp-body{grid-template-columns:1fr}.shp-modal{padding:12px}.shp-item{flex-wrap:wrap}}
html.felix-dark .VPDoc:has(.shp) .vp-doc table tr{background:#152f2e;color:#fefcf9}html.felix-dark .VPDoc:has(.shp) .vp-doc table th{background:#1a4b47;color:#fefcf9}
</style>
