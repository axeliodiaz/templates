---
aside: false
pageClass: lmn-page
---

# Lumen

Lumen is a design language for an LLM observability and cost dashboard, from a concept by Imran (https://x.com/imimran04/status/2106637533744624116). The idea: teams see cost, tokens and latency on day one, not when the invoice arrives. Warm off-white app inside a cool gray frame, rounded cards, quiet borders, one near-black primary action, and one color per model.

## Colors

<div class="lmn"><div class="lmn-g4"><div class="lmn-sw"><i style="background:#17171a"></i><div><b>Ink</b><br><code>#17171a</code></div></div><div class="lmn-sw"><i style="background:#25262b"></i><div><b>Text</b><br><code>#25262b</code></div></div><div class="lmn-sw"><i style="background:#74767d"></i><div><b>Muted</b><br><code>#74767d</code></div></div><div class="lmn-sw"><i style="background:#eceef1"></i><div><b>Page</b><br><code>#eceef1</code></div></div><div class="lmn-sw"><i style="background:#fbfbfa"></i><div><b>App</b><br><code>#fbfbfa</code></div></div><div class="lmn-sw"><i style="background:#ffffff"></i><div><b>Surface</b><br><code>#ffffff</code></div></div><div class="lmn-sw"><i style="background:#e7e7e9"></i><div><b>Border</b><br><code>#e7e7e9</code></div></div><div class="lmn-sw"><i style="background:#7c6cf0"></i><div><b>Purple (gpt-4o)</b><br><code>#7c6cf0</code></div></div><div class="lmn-sw"><i style="background:#f5b800"></i><div><b>Yellow (claude)</b><br><code>#f5b800</code></div></div><div class="lmn-sw"><i style="background:#0fb0ea"></i><div><b>Cyan (gemini)</b><br><code>#0fb0ea</code></div></div><div class="lmn-sw"><i style="background:#e08a1e"></i><div><b>Amber (up, brand)</b><br><code>#e08a1e</code></div></div><div class="lmn-sw"><i style="background:#1b9a4b"></i><div><b>Green (down, good)</b><br><code>#1b9a4b</code></div></div><div class="lmn-sw"><i style="background:#d9770a"></i><div><b>Warning</b><br><code>#d9770a</code></div></div><div class="lmn-sw"><i style="background:#d23b3b"></i><div><b>Danger</b><br><code>#d23b3b</code></div></div></div></div>

Model series colors are stable everywhere: purple, yellow, cyan. Amber marks an increase (cost and usage going up is a warning), green marks a decrease in cost or latency.

## Typography

<div class="lmn"><div class="lmn-card"><div style="font-size:26px;font-weight:600;color:#17171a">Welcome back, Alex</div><div class="lmn-sub">Page title - Plus Jakarta Sans 600, 22 to 26 px</div><hr style="border:0;border-top:1px solid #f0f0f1;margin:10px 0"><div style="font-size:28px;font-weight:600">$2,484.00</div><div class="lmn-sub">Big number - 600, 26 to 28 px, tabular digits</div><hr style="border:0;border-top:1px solid #f0f0f1;margin:10px 0"><b style="font-size:15px">Cost over time</b><div class="lmn-sub">Card title - 600, 15 px. Body 13 px, secondary text muted.</div></div></div>

## Rules

1. One color per model, the same in charts, legends, rows and tooltips.
2. Direction colors: amber up, green down. Never red for normal growth.
3. KPI tiles have a light gray footer with the comparison period.
4. Cards have a title row with a right-side control: tabs, a link or a menu.
5. Lists use a bordered icon tile, a title, one line of context and a mono-style meta line.

## Pages

[Components](/lumen/components), [Charts](/lumen/charts) (38 patterns) and the [Overview](/lumen/overview), [Traces](/lumen/traces), [Agents](/lumen/agents) and [Evals](/lumen/evals) examples. More pages are added as the template grows: Prompts, Playground, Gateway, Cost and Budget, API Keys, Team, Settings.
