# Motion coverage

Every design language uses one shared motion layer (`template-motion.css` and `template-motion.ts`). Language-specific chart, receipt, loader and demo animations stay in place. Tokens on the page (`--m-rise`, `--m-ease`, `--m-axis`, `--m-hover`, `--m-press`, `--m-glow`) change the character. The scroll entrance is always 280ms.

The language guides use a shared motion layer. Existing language-specific chart,
receipt, loader and demo animations stay in place. Relay's control room adds
graph-edge flow, sparkline draws, feed arrivals, and approval exits on top of
this layer. Those loops and transitions stop when `prefers-reduced-motion` is
`reduce`, and the tool-call count appears at its final value.


| Language | Entrance | Hover and press | What it should feel like |
| --- | --- | --- | --- |
| Lustro | 12px rise | 2px lift, 1px press, indigo glow on the primary action | Glass settling into place |
| Felix | 6px rise | 2px lift, warm shadow, no bounce | Linen, calm |
| PulseFit | 10px rise | Scale 1.03 on hover, 0.97 on press, gold shadow | Athletic spring |
| Scopecraft | 4px rise | No lift. Border and color only | A proposal, not a toy |
| Lumen | 6px rise | 1px lift, 1px press, no glow | Quiet |
| Pawprint | 10px rise | Scale 1.04, paw wag and avatar tilt stay in the Pawprint components | Playful, once |
| Folio | 4px rise | 1px lift, mint focus, no glow | Precise |
| Spark | 14px from the side | Border shifts to orange, no lift | Snappy data |
| Pace | 12px rise | 2px lift, 1px press | Arrival, then still |
| Umail | 6px rise | 1px lift, 1px press | Even product UI |
| Fixtrack | 8px rise | 2px lift, 1px press | A maintenance console |
| Crestway | 4px rise | No lift. Color carries the state | Corporate |
| Margin | 8px rise | 1px lift, 1px press | Job numbers, slight |
| Cargo | 8px from the side | 1px lift, 1px press | A route, not a bounce |

Shared behavior:

- Visible headings, sections, cards and previews receive the entrance. Charts, fixed overlays and anything that already has its own CSS animation are left alone so transforms are not replaced.
- Content is never hidden while waiting for JavaScript. The entrance only fades from 45% opacity.
- Controls transition on hover, press and focus. Disabled controls do not lift or scale.
- Inserted components, state changes and native field changes receive a short fade.
- Dialogs, menus, tooltips, accordion panels and expanded details have entry motion. Native disclosures animate their height.
- Static prose does not loop. Only existing loading and status indicators loop.
- Reduced motion disables CSS animations and transitions, including pseudo-elements and body-mounted overlays, and cancels running Web Animations. New shared motion is skipped until motion is allowed again.
- Route changes disconnect observers and listeners and cancel shared animations.

## Checks

`npm install && npm run build` verifies the complete site. The browser smoke test requires Playwright (`npm install --no-save playwright`, then `npx playwright install chromium`): `node tests/template-motion.cjs`. For a system Chrome binary, set `CHROME_PATH`. Screenshots are written under `/tmp/template-motion-*`.

The smoke test checks language pages, normal control transitions, zero running animations under reduced motion, dynamic preference changes, modal Escape, toast insertion and Felix amount feedback. Screenshots are local build evidence, not proof of production release.
