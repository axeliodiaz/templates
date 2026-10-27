---
layout: page
aside: false
title: Developer profile
---

<style>
.dp{--bg:#0b1620;--surf:#152736;--ink:#e8eef3;--mut:#9fb0bf;--pri:#2aa8a0;--pri-d:#0f766e;--acc:#e8a13c;--line:rgba(255,255,255,.1);--on:#04201e;font-family:Inter,system-ui,sans-serif;background:var(--bg);color:var(--ink);max-width:1040px;margin:0 auto;padding:0 20px 40px;line-height:1.6;transition:background .3s,color .3s}
.dp[data-theme=light]{--bg:#f6f8f9;--surf:#fff;--ink:#152736;--mut:#5c6d7e;--pri:#0f766e;--pri-d:#0d655e;--acc:#a86a00;--line:rgba(21,39,54,.12);--on:#fff}
.dp *{box-sizing:border-box}.dp a{text-decoration:none}
.dp-mono{font-family:"JetBrains Mono",ui-monospace,monospace;font-size:.78rem;letter-spacing:.02em}
.dp-nav{display:flex;align-items:center;gap:16px;padding:16px 0;border-bottom:1px solid var(--line)}
.dp-logo{width:34px;height:34px;border-radius:8px;background:var(--pri-d);color:#fff;display:grid;place-items:center;font-weight:700;font-size:.85rem}
.dp-nav nav{display:flex;gap:16px;margin-left:auto;overflow-x:auto}.dp-nav nav a{color:var(--mut);font-size:.9rem;white-space:nowrap}.dp-nav nav a:hover{color:var(--pri)}
.dp-toggle{background:var(--surf);color:var(--ink);border:1px solid var(--line);border-radius:999px;width:36px;height:36px;cursor:pointer}
.dp-hero{padding:56px 0 32px}.dp-eyebrow{color:var(--pri);margin:0 0 12px}
.dp h1{font-size:clamp(2.4rem,8vw,4rem);line-height:1.05;margin:0 0 16px;letter-spacing:-.02em;border:0;padding:0}
.dp h2{font-size:1.4rem;margin:48px 0 20px;border:0;padding:0;display:flex;gap:12px;align-items:baseline}.dp h2 .dp-mono{color:var(--acc)}
.dp h3{font-size:1.1rem;margin:4px 0 8px;border:0}
.dp-lead{max-width:60ch;color:var(--mut);font-size:1.1rem;margin:0 0 24px}
.dp-cta{display:flex;gap:12px;flex-wrap:wrap}
.dp-btn{padding:10px 18px;border-radius:8px;border:1px solid var(--line);color:var(--ink);font-weight:600;font-size:.92rem;transition:transform .2s,background .2s}.dp-btn:hover{transform:translateY(-2px)}
.dp-btn-primary{background:var(--acc);color:#1a1100;border-color:var(--acc)}
.dp-strip{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:1px;background:var(--line);border:1px solid var(--line);border-radius:12px;overflow:hidden;margin-top:16px}
.dp-strip div{background:var(--surf);padding:20px}.dp-strip b{display:block;font-family:"JetBrains Mono",monospace;font-size:1.7rem;color:var(--acc)}.dp-strip span{color:var(--mut);font-size:.85rem}
.dp-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:16px}
.dp-card{background:var(--surf);border:1px solid var(--line);border-radius:12px;padding:20px;transition:transform .25s,border-color .25s}.dp-card:hover{transform:translateY(-3px);border-color:var(--pri)}
.dp-card p{margin:6px 0;color:var(--mut);font-size:.92rem}.dp-tag{color:var(--pri)!important}
.dp-chips{display:flex;gap:6px;flex-wrap:wrap}.dp-chips i{font-style:normal;font-family:"JetBrains Mono",monospace;font-size:.72rem;padding:3px 9px;border-radius:999px;background:rgba(42,168,160,.15);color:var(--pri)}
.dp-metric b{font-family:"JetBrains Mono",monospace;font-size:1.4rem;color:var(--acc)}
.dp-scroll{overflow-x:auto;border:1px solid var(--line);border-radius:12px}
.dp-matrix{border-collapse:collapse;width:100%;min-width:480px;background:var(--surf);margin:0;display:table}
.dp-matrix th,.dp-matrix td{padding:10px 14px;text-align:center;border:0;border-bottom:1px solid var(--line);background:transparent;font-size:.88rem}
.dp-matrix tbody th{text-align:left;font-family:"JetBrains Mono",monospace;font-weight:500}.dp-matrix thead th{color:var(--mut);font-weight:600}.dp-matrix td{color:var(--pri)}
.dp-note{color:var(--mut);margin-top:8px}
.dp-time{list-style:none;margin:0;padding:0 0 0 18px;border-left:2px solid var(--pri-d)}.dp-time li{padding:0 0 18px 16px;position:relative}
.dp-time li::before{content:"";position:absolute;left:-25px;top:8px;width:10px;height:10px;border-radius:50%;background:var(--acc)}.dp-time .dp-mono{display:block;color:var(--mut)}
.dp-foot{margin-top:48px;padding-top:16px;border-top:1px solid var(--line);color:var(--mut)}
@media (prefers-reduced-motion:reduce){.dp *{transition:none!important}}
</style>

<div class="dp" data-theme="dark" id="dp">
<header class="dp-nav"><span class="dp-logo">AD</span><nav><a href="#impacto">Impacto</a><a href="#casos">Casos</a><a href="#stack">Stack</a><a href="#exp">Experiencia</a></nav><button class="dp-toggle" aria-label="Cambiar tema" onclick="var d=document.getElementById('dp'),f=function(){d.dataset.theme=d.dataset.theme==='dark'?'light':'dark'};window.__themeReveal?window.__themeReveal(this,f):f()">◐</button></header>
<section class="dp-hero"><p class="dp-mono dp-eyebrow">Senior Software Engineer · Santiago, Chile</p><h1>Axel Díaz</h1><p class="dp-lead">Backend engineer con más de 13 años creando sistemas escalables y de alto impacto. Python y Django; hoy en Félix mejorando la experiencia de remesas para millones de usuarios en Latinoamérica.</p><div class="dp-cta"><a class="dp-btn dp-btn-primary" href="#casos">Ver casos</a><a class="dp-btn" href="https://www.linkedin.com/">LinkedIn ↗</a></div></section>
<section class="dp-strip" id="impacto"><div><b>13+</b><span>Años de experiencia</span></div><div><b>−60%</b><span>Tiempo de resolución de soporte</span></div><div><b>90%</b><span>KPIs de shoppers rediseñados</span></div><div><b>&lt;0,4 ms</b><span>Consultas de fraude</span></div></section>
<section id="casos"><h2><span class="dp-mono">01</span> Casos</h2><div class="dp-grid">
<article class="dp-card"><p class="dp-mono dp-tag">Uber · 2024</p><h3>Detección de fraude en pagos</h3><p>Sistema de detección con dashboards en tiempo real y estandarización de procesos de pago en Puerto Rico.</p><p class="dp-chips"><i>Go</i><i>Kafka</i><i>Docstore</i><i>Redis</i></p></article>
<article class="dp-card"><p class="dp-mono dp-tag">Prevención de fraude</p><h3>De segundos a milisegundos</h3><p>Consultas de fraude pasaron de segundos a menos de 0,4 ms con un grafo de relaciones.</p><p class="dp-chips"><i>Python</i><i>Django</i><i>Neo4j</i></p><p class="dp-metric"><b>&lt;0,4 ms</b></p></article>
<article class="dp-card"><p class="dp-mono dp-tag">Cornershop by Uber</p><h3>Soporte unificado</h3><p>Plataforma centralizada que redujo tiempos de resolución y mejoró la productividad de agentes.</p><p class="dp-metric"><b>−60%</b> resolución</p></article>
<article class="dp-card"><p class="dp-mono dp-tag">Félix · 2025–hoy</p><h3>Transacciones fallidas o demoradas</h3><p>Microservicios en Python que detectan fallos, automatizan unhappy paths y mejoran herramientas internas.</p><p class="dp-chips"><i>Python</i><i>Microservicios</i></p></article>
</div></section>
<section id="stack"><h2><span class="dp-mono">02</span> Stack por caso</h2><div class="dp-scroll"><table class="dp-matrix"><thead><tr><th></th><th>Uber fraude</th><th>Grafo fraude</th><th>Félix</th><th>Check Point</th></tr></thead><tbody>
<tr><th>Python</th><td></td><td>●</td><td>●</td><td>●</td></tr>
<tr><th>Django</th><td></td><td>●</td><td></td><td></td></tr>
<tr><th>Go</th><td>●</td><td></td><td></td><td></td></tr>
<tr><th>Kafka</th><td>●</td><td></td><td></td><td></td></tr>
<tr><th>Redis</th><td>●</td><td></td><td></td><td></td></tr>
<tr><th>Neo4j</th><td></td><td>●</td><td></td><td></td></tr>
<tr><th>AWS</th><td></td><td></td><td></td><td>●</td></tr>
</tbody></table></div><p class="dp-note dp-mono">Solo marca lo documentado en cada caso.</p></section>
<section id="exp"><h2><span class="dp-mono">03</span> Experiencia</h2><ol class="dp-time">
<li><span class="dp-mono">Oct 2025 — hoy</span><b>Senior Software Developer</b> · Félix</li>
<li><span class="dp-mono">Feb — Ago 2025</span><b>Software Engineer</b> · Check Point</li>
<li><span class="dp-mono">Feb — Oct 2024</span><b>Software Engineer I, CPX</b> · Uber</li>
<li><span class="dp-mono">Antes</span><b>Central Ops Engineering Manager</b> · Cornershop by Uber</li>
</ol></section>
<footer class="dp-foot dp-mono">axeldiaz.com · plantilla developer profile</footer>
</div>
