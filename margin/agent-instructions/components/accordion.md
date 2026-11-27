# Accordion — agent instructions

## Goal

Replicate the Margin BS6 accordion demo: one expandable panel at a time, ~300ms height animation, chevron rotation, plus an always-open example row.

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

Panel animation uses `.mg-accordion-panel` grid (`grid-template-rows: 0fr → 1fr`, `0.3s ease`) and `.mg-accordion-chevron` (`transform 0.3s ease`, `rotate(180deg)` when `.is-open`).

## Required markup

```html
<div class="l-accordion border-bottom">
  <button type="button" class="w-100" aria-expanded="false">
    Tokens <span class="mg-accordion-chevron" aria-hidden="true">⌄</span>
  </button>
  <div class="mg-accordion-panel">
    <div class="mg-accordion-panel-inner"><p>…</p></div>
  </div>
</div>
```

Add `is-open` on `.mg-accordion-panel` and chevron when expanded; set `aria-expanded` on the button.

## Variants

- Single-open (Vue state `accordion` string).
- Always-open row: `.mg-accordion-panel.is-open` without a toggle.

## States

- `:hover` on button: inherited from `.l-accordion button` (transparent background).
- `:focus-visible`: Margin focus ring.
- Disabled: not used on demo headers.

## Responsive / mobile

Full-width buttons (`w-100`); padding `12px 2px` on headers. Works at 390px without horizontal scroll.

## Motion

Preview chrome crossfade: `0.25s ease` on `background-color`, `color`, `border-color` when `.mg-guide-motion` is active (after first paint).

Accordion panel: `0.3s ease` height (`margin-motion.css`). Collapse utilities elsewhere: BS6 `0.3s` / `0.35s` on `.collapse`.

`@media (prefers-reduced-motion: reduce)`: transitions/animations inside `.margin-bs6-root` are disabled (`margin-bs6.css`). Preview panel collapse uses `0.25s ease` unless reduced motion is set.

## Accessibility

- Expose meaningful names on controls; do not rely on color alone.
- `:focus-visible`: 2px `#6389ea` outline, 3px offset (Margin convention).
- Pair preview chrome with light/dark toggle to verify contrast on `--ink` / `--surface`.
- Keyboard: Tab order follows DOM; interactive demos use native buttons/links with visible focus.

## Do

- Keep one panel open at a time unless demonstrating always-open.
- Animate height with grid rows; keep `overflow: hidden` on inner wrapper.

## Don't

- Use `v-if` for panel body (instant unmount breaks height transition).
- Remove `aria-expanded` on headers.

## Verification checklist

- [ ] Chevron rotates when open
- [ ] Only one panel open in default demo
- [ ] Always-open row stays expanded
- [ ] Readable in light + dark preview
- [ ] Reduced motion: instant open/close
