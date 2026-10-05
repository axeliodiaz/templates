---
aside: false
pageClass: pf-page
---

# KPI cards: stacked structure

PulseFit KPI cards rebuilt with the stacked layout from the Finance KPI reference (https://x.com/imimran04/status/2106609916630986949): a soft outer shell holding the label and icon, with a raised white panel inside for the value, the comparison text and the delta. Colors and type stay PulseFit: charcoal, gold, Montserrat labels, Bebas Neue numbers, Rubik body. Demo data is fictitious.

## Four metrics

<div class="pf pfk-grid">
  <div class="pfk"><div class="pfk-h"><span class="pfk-l">Total income</span><span class="pfk-i gold">$</span></div><div class="pfk-b"><div class="pfk-v">$78,000</div><div class="pfk-f"><span>Since last week</span><span class="pfk-d up">&#9650; 1.78%</span></div></div></div>
  <div class="pfk"><div class="pfk-h"><span class="pfk-l">Total expense</span><span class="pfk-i char">$</span></div><div class="pfk-b"><div class="pfk-v">$40,000</div><div class="pfk-f"><span>Since last week</span><span class="pfk-d dn">&#9660; 1.78%</span></div></div></div>
  <div class="pfk"><div class="pfk-h"><span class="pfk-l">Total savings</span><span class="pfk-i bronze">&#9638;</span></div><div class="pfk-b"><div class="pfk-v">$55,000</div><div class="pfk-f"><span>Since last week</span><span class="pfk-d up">&#9650; 1.70%</span></div></div></div>
  <div class="pfk"><div class="pfk-h"><span class="pfk-l">Active members</span><span class="pfk-i gold">&#9679;</span></div><div class="pfk-b"><div class="pfk-v">1,284</div><div class="pfk-f"><span>Since last week</span><span class="pfk-d up">&#9650; 4.20%</span></div></div></div>
</div>

## Variants

<div class="pf pfk-grid">
  <div class="pfk dark"><div class="pfk-h"><span class="pfk-l">Class revenue</span><span class="pfk-i gold">$</span></div><div class="pfk-b"><div class="pfk-v">$12,450</div><div class="pfk-f"><span>Since last week</span><span class="pfk-d up">&#9650; 2.40%</span></div></div></div>
  <div class="pfk"><div class="pfk-h"><span class="pfk-l">Cancellations</span><span class="pfk-i char">!</span></div><div class="pfk-b"><div class="pfk-v">38</div><div class="pfk-f"><span>Since last week</span><span class="pfk-d dn">&#9660; 6.10%</span></div></div></div>
  <div class="pfk"><div class="pfk-h"><span class="pfk-l">Waitlist</span><span class="pfk-i bronze">&#8987;</span></div><div class="pfk-b"><div class="pfk-v">92</div><div class="pfk-f"><span>No change</span><span class="pfk-d flat">&#9644; 0.00%</span></div></div></div>
</div>

<style>
.pfk-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:18px;padding:22px;background:#e9e9ea;border-radius:14px;margin:12px 0}
.pfk{background:#f5f5f7;border:2px solid #fff;border-radius:28px;padding:0;box-shadow:0 1px 2px rgba(0,0,0,.06),0 2px 10px rgba(0,0,0,.05);overflow:hidden;transition:transform .2s,box-shadow .2s}
.pfk:hover{transform:translateY(-2px);box-shadow:0 2px 4px rgba(0,0,0,.06),0 8px 24px rgba(0,0,0,.08)}
.pfk-h{display:flex;align-items:center;justify-content:space-between;padding:20px 22px 18px;font-family:'Montserrat',sans-serif}
.pfk-l{font-weight:500;font-size:15px;color:#333}
.pfk-i{width:26px;height:26px;border-radius:50%;border:2px solid;display:grid;place-items:center;font:700 13px 'Montserrat',sans-serif}
.pfk-i.gold{color:#C9A66B;border-color:#C9A66B}.pfk-i.char{color:#333;border-color:#333}.pfk-i.bronze{color:#8b7355;border-color:#8b7355}
.pfk-b{background:#fff;border-radius:24px;margin:0 3px 3px;padding:22px 20px 18px;box-shadow:inset 0 0 0 1px #f0f0f0}
.pfk-v{font-family:'Bebas Neue','Montserrat',sans-serif;font-size:52px;line-height:1;color:#212121;letter-spacing:.01em;font-variant-numeric:tabular-nums}
.pfk-f{display:flex;justify-content:space-between;align-items:center;margin-top:18px;font-family:'Rubik',sans-serif;font-size:14px;color:#5f666d}
.pfk-d{font-weight:600;font-variant-numeric:tabular-nums}.pfk-d.up{color:#198754}.pfk-d.dn{color:#a4492e}.pfk-d.flat{color:#5f666d}
.pfk.dark{background:#333;border-color:#4a4a4a}.pfk.dark .pfk-l{color:#f5f5f5}.pfk.dark .pfk-b{background:#2a2a2a;box-shadow:inset 0 0 0 1px #3d3d3d}.pfk.dark .pfk-v{color:#C9A66B}.pfk.dark .pfk-f{color:#c9c9c9}.pfk.dark .pfk-d.up{color:#5fd08f}
</style>
