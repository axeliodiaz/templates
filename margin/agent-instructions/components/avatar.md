# Avatar — agent instructions

## Goal

Replicate the **Avatar** section on `templates.axeldiaz.com/margin/components/avatar` using Margin scoped BS6 (`.lab.b2-bs6.b2-margin`) and the live preview on that page.

## Tokens / CSS variables

## Tokens / CSS variables

Scoped preview shell (light):

```css
.lab.b2-bs6.b2-margin {
  --bg: #f5f5f7;
  --surface: #fff;
  --ink: #22252b;
  --muted: #676e7b;
  --line: #e0e3e9;
  --soft: #eceef5;
  --b2-accent: #6389ea;
  --b2-on: #0f1528;
}
```

Dark preview (`.lab-dark` on root + `.mg-guide-preview.lab-dark`):

```css
--bg: #181b22;
--surface: #242833;
--ink: #f1f3f8;
--muted: #aab3c3;
--line: #404757;
--soft: #303747;
```

Focus ring (Margin guides): `outline: 2px solid #6389ea; outline-offset: 3px`.

## Required markup

```html
<span class=\
```

## Variants

See the doc preview and BS6 catalog section `avatar` when `area === 'components'`.

## States

- Hover/focus/active: follow Bootstrap 6 `theme-*` utilities in the scoped preview.
- Dark mode: toggle **Dark preview** on the guide chrome (`.mg-guide-preview.lab-dark`).

## Responsive / mobile

Previews use `.mg-guide-frame` padding `18px`; demos use Bootstrap responsive utilities where shown on the page.

## Motion

Preview chrome crossfade: `0.25s ease` on `background-color`, `color`, `border-color` when `.mg-guide-motion` is active (after first paint).



`@media (prefers-reduced-motion: reduce)`: transitions/animations inside `.margin-bs6-root` are disabled (`margin-bs6.css`). Preview panel collapse uses `0.25s ease` unless reduced motion is set.

## Accessibility

- Expose meaningful names on controls; do not rely on color alone.
- `:focus-visible`: 2px `#6389ea` outline, 3px offset (Margin convention).
- Pair preview chrome with light/dark toggle to verify contrast on `--ink` / `--surface`.
- Keyboard: Tab order follows DOM; interactive demos use native buttons/links with visible focus.

## Do

- Scope CSS under `.margin-bs6-root` / `.mg-guide-preview`.
- Match classes exactly from the copy block when present.

## Don't

- Import global Bootstrap CSS onto the VitePress shell.
- Drop Margin focus or contrast tokens.

## Verification checklist

- [ ] Matches live preview in light mode
- [ ] Matches live preview with Dark preview enabled
- [ ] Keyboard focus visible
- [ ] 390px layout has no horizontal overflow in preview
