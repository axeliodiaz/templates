---
aside: false
pageClass: pf-page
---

# KPI cards: inner structure

PulseFit KPI cards as in the Admin Studio dashboard (gold 2px border, white surface, Montserrat labels, gold Montserrat values, green and red delta pills), with the inner structure of the Finance KPI reference (https://x.com/imimran04/status/2106609916630986949): label with a circled icon on the first row, the big value, then the comparison text on the left and the delta on the right. Demo data is fictitious.

## Studio dashboard metrics

<div class="pf pfk-grid"><div class="pfk"><div class="pfk-h"><span class="pfk-l">Reservas hoy</span><span class="pfk-i">&#9638;</span></div><div class="pfk-v">128</div><div class="pfk-f"><span>vs ayer</span><span class="pfk-d up">&#9650; +18,5 %</span></div></div><div class="pfk"><div class="pfk-h"><span class="pfk-l">Ocupaci&oacute;n media</span><span class="pfk-i">%</span></div><div class="pfk-v">84%</div><div class="pfk-f"><span>&uacute;ltimos 7 d&iacute;as</span><span class="pfk-d up">&#9650; +3,2 pts</span></div></div><div class="pfk"><div class="pfk-h"><span class="pfk-l">Riders activos</span><span class="pfk-i">&#9679;</span></div><div class="pfk-v">342</div><div class="pfk-f"><span>con plan vigente</span><span class="pfk-d dn">&#9660; &minus;4,1 %</span></div></div><div class="pfk"><div class="pfk-h"><span class="pfk-l">Ingresos del mes</span><span class="pfk-i">$</span></div><div class="pfk-v">$8,4 M</div><div class="pfk-f"><span>+24 socios nuevos</span><span class="pfk-d up">&#9650; +9,7 %</span></div></div></div>

## Finance metrics

<div class="pf pfk-grid"><div class="pfk"><div class="pfk-h"><span class="pfk-l">Total income</span><span class="pfk-i">$</span></div><div class="pfk-v">$78,000</div><div class="pfk-f"><span>Since last week</span><span class="pfk-d up">&#9650; 1.78%</span></div></div><div class="pfk"><div class="pfk-h"><span class="pfk-l">Total expense</span><span class="pfk-i">$</span></div><div class="pfk-v">$40,000</div><div class="pfk-f"><span>Since last week</span><span class="pfk-d dn">&#9660; 1.78%</span></div></div><div class="pfk"><div class="pfk-h"><span class="pfk-l">Total savings</span><span class="pfk-i">&#9638;</span></div><div class="pfk-v">$55,000</div><div class="pfk-f"><span>Since last week</span><span class="pfk-d up">&#9650; 1.70%</span></div></div></div>

<style>
.pfk-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(210px,1fr));gap:14px;margin:12px 0}
.pfk{background:#fff;border:2px solid var(--gold);border-radius:14px;padding:16px 18px;display:flex;flex-direction:column;gap:8px;transition:transform .2s ease,box-shadow .2s ease}
.pfk:hover{transform:translateY(-2px);box-shadow:var(--sh2)}
@media (prefers-reduced-motion:reduce){.pfk{transition:none}.pfk:hover{transform:none}}
.pfk-h{display:flex;align-items:center;justify-content:space-between;gap:8px}
.pfk-l{font:700 15px 'Montserrat',sans-serif;color:#212121}
.pfk-i{width:24px;height:24px;border-radius:50%;border:2px solid var(--gold);color:var(--gold-ink);display:grid;place-items:center;font:700 12px 'Montserrat',sans-serif;flex:none}
.pfk-v{font:800 40px/1.1 'Montserrat',sans-serif;color:var(--gold);letter-spacing:-.01em}
.pfk-f{display:flex;justify-content:space-between;align-items:center;gap:8px;font:400 13px 'Rubik',sans-serif;color:var(--muted);flex-wrap:wrap}
.pfk-d{font:600 12px 'Rubik',sans-serif;padding:3px 10px;border-radius:999px;font-variant-numeric:tabular-nums}
.pfk-d.up{background:#e3f4ea;color:#11643b}.pfk-d.dn{background:#fde8ea;color:#a52432}.pfk-d.flat{background:#efefef;color:var(--muted)}
</style>
