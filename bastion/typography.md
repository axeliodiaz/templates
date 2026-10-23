---
aside: false
title: Bastion typography
---

# Typography

One monospace family. JetBrains Mono is already on the docs site; the stack falls through to `ui-monospace`, SF Mono, Menlo, and Consolas. IBM Plex Mono is an equal substitute if a product already loads it.

<div class="bst-root" data-bs-theme="dark"><div class="bst bst-spec"><div class="display">BASTION &gt;_</div><small class="bst-note">Wordmark. 15px, weight 700, tracking 0.16em. The prompt caret is amber.</small><div style="letter-spacing:.14em;color:#62f56a;font-size:11px;font-weight:600">EDGE REGIONS · LATENCY MAP</div><small class="bst-note">Panel title. 11px, uppercase, tracking 0.14em. The middle dot is a divider, not a sentence.</small><div class="body">Root cause: Elevated packet loss on upstream provider.</div><small class="bst-note">Body. 12–14px, phosphor ink, line-height 1.45.</small><div style="font-variant-numeric:tabular-nums;color:#62f56a;font-size:13px">99.982% · 12ms · 3/3 · 09:52:16</div><small class="bst-note">Numbers. Tabular figures so columns of percents, latencies, replicas, and timestamps do not jitter.</small></div></div>

## Scale

| Role | Size | Weight | Notes |
| --- | --- | --- | --- |
| Wordmark | 15px | 700 | Tracking 0.16em |
| Panel title | 11px | 600 | Uppercase, tracking 0.14em |
| Table header | 10px | 500 | Uppercase, muted |
| Body and logs | 12px | 400 | 14px in prose specimens |
| Uptime figure | 13px | 600 | Tabular |
| Footnote | 11px | 400 | Muted, may use amber when it is a warning |

## Dividers

Panels use a 1px solid green border and a dashed rule in the header. Section labels join with a middle dot: `DEPLOYS · TIMELINE`. Do not mix rounded cards, drop shadows, or a second type family into the product UI.

## Language

The approved dashboard keeps the ops-agent copy in Spanish and the rest of the chrome in English. Mark that block with `lang="es"`. Do not translate sample telemetry unless the product locale changes.
