# Color — agent instructions

## Goal

Document Margin `.lab` color tokens used in customize swatches and BS6 previews; accent `#6389ea` with AA contrast pairs.

## Tokens / CSS variables

Light `.lab` (canonical on this page):

| Token | Value |
|-------|-------|
| `--bg` | `#f5f5f7` |
| `--surface` | `#fff` |
| `--ink` | `#22252b` |
| `--muted` | `#676e7b` |
| `--line` | `#e0e3e9` |
| `--soft` | `#eceef5` |
| `--accent` | `#6389ea` |

Dark `.lab-dark`:

| Token | Value |
|-------|-------|
| `--bg` | `#181b22` |
| `--surface` | `#242833` |
| `--ink` | `#f1f3f8` |
| `--muted` | `#aab3c3` |
| `--line` | `#404757` |
| `--soft` | `#303747` |

Primary solid buttons use `--b2-accent` / `--b2-on` (`#6389ea` / `#0f1528`).

## Required markup

```html
<div class="lab b2-bs6 b2-margin margin-bs6-root">
  <!-- swatches use .mg-swatch with --mg-swatch-fg / --mg-swatch-muted -->
</div>
```

## Variants

- Light preview (default): `.mg-guide-preview` without `.lab-dark`.
- Dark preview: `.mg-guide-preview.lab-dark` + optional `.lab-dark` on BS6 root.

## States

- Swatch hover: border follows `--line`.
- Focus on toggle: `#6389ea` ring.

## Responsive / mobile

Swatch grid wraps; 390px: single column in `.mg-swatch-grid`.

## Motion

Preview chrome crossfade: `0.25s ease` on `background-color`, `color`, `border-color` when `.mg-guide-motion` is active (after first paint).

Swatches: no required motion. Preview toggle: 0.25s crossfade.

`@media (prefers-reduced-motion: reduce)`: transitions/animations inside `.margin-bs6-root` are disabled (`margin-bs6.css`). Preview panel collapse uses `0.25s ease` unless reduced motion is set.

## Accessibility

- Expose meaningful names on controls; do not rely on color alone.
- `:focus-visible`: 2px `#6389ea` outline, 3px offset (Margin convention).
- Pair preview chrome with light/dark toggle to verify contrast on `--ink` / `--surface`.
- Keyboard: Tab order follows DOM; interactive demos use native buttons/links with visible focus.

## Do

- Use token variables; never hard-code random grays in Margin docs.
- Test swatch text on `--surface` in both previews.

## Don't

- Invent new accent hues per component page.

## Verification checklist

- [ ] Swatches readable light + dark
- [ ] Accent #6389ea on primary actions
- [ ] Dark preview updates --surface/--ink
