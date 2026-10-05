---
aside: false
pageClass: pf-page
---

# KPI cards: inner structure

Only the inner layout of the Finance KPI reference (https://x.com/imimran04/status/2106609916630986949) is used: label with a circled icon on the first row, the big value, then the comparison text and the delta on one line. The card itself is the standard PulseFit card (white surface, same radius, shadow, lift on hover), and colors and type are PulseFit's: Montserrat labels, Bebas Neue values, Rubik body, gold and charcoal icons. Demo data is fictitious.

## Four metrics

<div class="pf pfk-grid"><div class="pf-card lift pfk"><div class="pfk-h"><span class="pfk-l">Total income</span><span class="pfk-i gold">$</span></div><div class="pfk-v">$78,000</div><div class="pfk-f"><span>Since last week</span><span class="pfk-d up">&#9650; 1.78%</span></div></div><div class="pf-card lift pfk"><div class="pfk-h"><span class="pfk-l">Total expense</span><span class="pfk-i char">$</span></div><div class="pfk-v">$40,000</div><div class="pfk-f"><span>Since last week</span><span class="pfk-d dn">&#9660; 1.78%</span></div></div><div class="pf-card lift pfk"><div class="pfk-h"><span class="pfk-l">Total savings</span><span class="pfk-i bronze">&#9638;</span></div><div class="pfk-v">$55,000</div><div class="pfk-f"><span>Since last week</span><span class="pfk-d up">&#9650; 1.70%</span></div></div><div class="pf-card lift pfk"><div class="pfk-h"><span class="pfk-l">Active members</span><span class="pfk-i gold">&#9679;</span></div><div class="pfk-v">1,284</div><div class="pfk-f"><span>Since last week</span><span class="pfk-d up">&#9650; 4.20%</span></div></div></div>

## Variants

<div class="pf pfk-grid"><div class="pf-card lift pfk"><div class="pfk-h"><span class="pfk-l">Class revenue</span><span class="pfk-i gold">$</span></div><div class="pfk-v">$12,450</div><div class="pfk-f"><span>Since last week</span><span class="pfk-d up">&#9650; 2.40%</span></div></div><div class="pf-card lift pfk"><div class="pfk-h"><span class="pfk-l">Cancellations</span><span class="pfk-i char">!</span></div><div class="pfk-v">38</div><div class="pfk-f"><span>Since last week</span><span class="pfk-d dn">&#9660; 6.10%</span></div></div><div class="pf-card lift pfk"><div class="pfk-h"><span class="pfk-l">Waitlist</span><span class="pfk-i bronze">&#8987;</span></div><div class="pfk-v">92</div><div class="pfk-f"><span>No change</span><span class="pfk-d flat">&#9644; 0.00%</span></div></div></div>

<style>
.pfk-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:12px;margin:12px 0}
.pfk{display:flex;flex-direction:column;gap:10px}
.pfk-h{display:flex;align-items:center;justify-content:space-between;gap:8px}
.pfk-l{font:600 10.5px 'Montserrat',sans-serif;letter-spacing:.07em;text-transform:uppercase;color:var(--muted)}
.pfk-i{width:24px;height:24px;border-radius:50%;border:2px solid;display:grid;place-items:center;font:700 12px 'Montserrat',sans-serif;flex:none}
.pfk-i.gold{color:#7a5a1f;border-color:#C9A66B}.pfk-i.char{color:#333;border-color:#333}.pfk-i.bronze{color:#8b7355;border-color:#8b7355}
.pfk-v{font:400 34px 'Bebas Neue',sans-serif;line-height:1;letter-spacing:.03em;color:var(--text)}
.pfk-f{display:flex;justify-content:space-between;align-items:center;gap:8px;font:400 13px 'Rubik',sans-serif;color:var(--muted)}
.pfk-d{font-weight:500;font-variant-numeric:tabular-nums}.pfk-d.up{color:var(--ok)}.pfk-d.dn{color:var(--bad)}.pfk-d.flat{color:var(--muted)}
</style>
