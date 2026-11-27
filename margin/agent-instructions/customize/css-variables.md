# CSS variables — agent instructions

## Goal

Replicate the **CSS variables** section on `templates.axeldiaz.com/margin/customize/css-variables` using Margin scoped BS6 (`.lab.b2-bs6.b2-margin`) and the live preview on that page.

## Tokens / CSS variables

Lab shell (`.lab`):

```css
.lab {
  --bg: #f5f5f7;
  --surface: #fff;
  --ink: #22252b;
  --muted: #676e7b;
  --line: #e0e3e9;
  --soft: #eceef5;
  --accent: #6389ea;
}
```

Bootstrap adapter (`.b2-margin`):

```css
.b2-margin {
  --b2-accent: #6389ea;
  --b2-on: #0f1528;
  --b2-bg: var(--bg, #f5f5f7);
  --b2-surface: var(--surface, #fff);
  --b2-ink: var(--ink, #22252b);
  --b2-line: var(--line, #e0e3e9);
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

Use both lab and adapter blocks in documentation examples; scope interactive demos under `.lab.b2-bs6.b2-margin.margin-bs6-root`.

## Variants

N/A — token reference page. Related: [Color](/margin/customize/color), [Theme](/margin/customize/theme).

## States

- Dark mode: toggle **Dark preview** on the guide chrome (`.mg-guide-preview.lab-dark`).

## Responsive / mobile

Previews use `.mg-guide-frame` padding `18px`; token callouts wrap on narrow viewports.

## Motion

Preview chrome crossfade: `0.25s ease` on `background-color`, `color`, `border-color` when `.mg-guide-motion` is active.

## Accessibility

- Verify contrast for `--ink` on `--surface` in light and dark preview modes.
- `:focus-visible`: 2px `#6389ea` outline, 3px offset.

## Do

- Map lab tokens before Bootstrap `--b2-*` overrides.
- Scope CSS under `.margin-bs6-root` / `.mg-guide-preview`.

## Don't

- Reintroduce a second **CSS variables** page under Getting started.
- Import global Bootstrap CSS onto the VitePress shell.

## Verification checklist

- [ ] Single sidebar entry under Customize
- [ ] Legacy getting-started URL redirects
- [ ] Preview shows lab + `--b2-*` mapping copy
- [ ] 390px layout has no horizontal overflow in preview