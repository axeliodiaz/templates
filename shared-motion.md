# Motion coverage

All five languages use a shared motion layer. Existing language-specific chart,
receipt, loader and demo animations stay in place.

- Visible headings, content blocks, component previews, cards, tables and charts
  receive a short entry fade. Content is never hidden while waiting for JavaScript.
- Controls transition on hover, press and focus; disabled controls do not lift.
- Inserted components, state changes and native field changes receive a short fade.
- Dialogs, menus, tooltips and expanded details have entry motion.
- Static prose does not loop. Only existing loading/status indicators loop.
- Reduced motion disables CSS animations/transitions, including pseudo-elements
  and body-mounted overlays. Switching the preference while on a page cancels
  active document animations. New shared motion is skipped until enabled again.
- Route changes disconnect observers/listeners and cancel shared animations.

The shared layer uses opacity and the independent CSS `translate` property to
avoid replacing chart transforms or changing fixed/sticky positioning.

## Checks

`npm install && npm run build` verifies the complete site. The browser smoke test
requires Playwright (`npm install --no-save playwright`, then `npx playwright
install chromium`): `node tests/template-motion.cjs`. For a system Chrome binary,
set `CHROME_PATH`. Screenshots are written under `/tmp/template-motion-*`.

The smoke test checks all five language pages, normal control transitions,
zero running animations under reduced motion, dynamic preference changes,
modal Escape, toast insertion and Felix amount feedback. Screenshots are local
build evidence, not proof of production release.
