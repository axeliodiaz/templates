# Squash → force push

Margin · Run observation · `/margin/squash-force-push`

## Purpose

Live card that walks an agent (or human operator) through: **read commits → squash fixups → hold to force-push → PR checks**. Synthetic data only; no real git remote.

## Preview chrome

- **Dark preview** toggle on the guide frame (inherits Margin lab).
- Toolbar: **Replay** (calls exposed `replay()`), **Motion on/off** (`:motion` prop).
- Card max-width ~420px; lab padding supports **390px** width (hash/time stack on small screens).

## Build checklist

- [ ] Loading: `feat/session-refresh` blue pill → gray `main`; spinner “Reading 10 commits”.
- [ ] Expanded: branch rail + `origin/feat/session-refresh`; 10 rows with correct node glyphs and hashes from spec.
- [ ] Squash: footer “7 of 10…” + ✨ Squash; rebasing spinner; fixup/wip rows collapse; 3 commits + base remain.
- [ ] Force push: yellow dot warning; hold button ~2s fill; early release cancels.
- [ ] Done: purple `#491` header; checks running → 6 passed; Pushed / Delete / GitHub actions.
- [ ] Colors: blue / red / purple / green / yellow per visual system.
- [ ] `prefers-reduced-motion` and `--mg-squash-motion: 0` instant.

## Component API

```vue
<MarginSquashForcePush ref="squash" :motion="true" />
```

- `replay()` — reset to loading and replay expand.
- `motion` — when false, skips timed delays (push still completes on hold).

## Files

- `.vitepress/theme/squash-force-push/MarginSquashForcePush.vue`
- `.vitepress/theme/margin-squash-force-push.css`
- Demo: `MarginSquashForcePushDemo.vue` inside `MarginGuidePreview`

## Motion tokens

| Token | Role |
| --- | --- |
| `--mg-squash-motion` | Master 0/1 multiplier |
| `--mg-squash-enter` | Card expand duration |
| `--mg-squash-spring` | Expand easing |

Disable: `mg-squash--motion-off` or `prefers-reduced-motion`.