# Relay tokens and implementation

Relay pins Bootstrap to `bootstrap@6.0.0-alpha.1`. `scripts/build-batch2-bs6.mjs` reads that package and writes two stylesheets:

| File | Scope | Used by |
| --- | --- | --- |
| `batch2-bs6.bootstrap.css` | `@scope (.b2-bs6)` | Folio, Spark, Pace, and the Relay catalog |
| `relay-bs6.bootstrap.css` | `@scope (.relay-bs6)` | The control room only |

Both files are generated at dev and build time and are gitignored. `:root`, `:host`, `html`, and `body` in Bootstrap are rewritten to `:scope`, so reboot rules stay inside the scope. Scopecraft keeps its own Bootstrap 5 build. The VitePress shell is outside both scopes.

## Control-room tokens

```css
.relay-bs6 {
  --bs-primary-bg: #6d4dff;
  --bs-primary-contrast: #fff;
  --bs-fg-body: #f4f6fb;
  --bs-secondary-color: #b7c0d6;
  --bs-body-font-family: Inter, "DM Sans", system-ui, sans-serif;
  --bs-card-border-radius: 16px;
  --rl-violet: #a78bfa;
  --rl-teal: #5eead4;
  --rl-green: #3ddc97;
}
```

## Catalog tokens

```css
.studio-relay {
  --sk-bg: #070910;
  --sk-surface: #141624;
  --sk-ink: #f4f6fb;
  --sk-muted: #b7c0d6;
  --sk-accent: #6d4dff;
  --sk-on: #fff;
  --sk-radius: 16px;
}
```

## Bootstrap 6 alpha notes

- Buttons are `btn-solid` or `btn-outline` plus `theme-primary`. The Bootstrap 5 pair `btn btn-primary` is not the API.
- Responsive utilities are prefixed: `lg:d-none`, `lg:d-flex`, `sm:col-6`. The `lg` breakpoint is 1024px.
- Offcanvas is gone. Overlay panels are `<dialog class="drawer drawer-start">`, opened with `showModal()`.
- An unprefixed `.drawer` is an overlay at every width. A prefixed `lg:drawer` becomes a horizontal bar at `lg`, so the desktop rail is a real `<aside class="d-none lg:d-flex">` and the drawer is only the narrow-screen nav.
- `.dialog` and `.drawer` set `display: flex`, which beats the user-agent `dialog:not([open]) { display: none }`. Closed Relay dialogs stay `inert` so the extra nav is not a second tab stop. The open and close motion still uses Bootstrap's visibility and transform.
- `::backdrop` painted from inside `@scope` is unreliable. Relay sets `.relay dialog::backdrop` in `relay.css`, outside the scope.
- Do not put `theme-primary` on a card ancestor. Bootstrap 6 card borders pick up `--bs-theme-bg` from a themed ancestor.
- Bootstrap 6 uses `oklch()` and `color-mix()`. Current Chrome supports both. Check the target browser before adopting the alpha.

The control room does not load Bootstrap's JavaScript. Vue calls `showModal()` and `close()` on the native dialogs.

```vue
<script setup>
import RelayDashboard from './.vitepress/theme/RelayDashboard.vue'
</script>
<RelayDashboard />
```

[Foundations](/relay/foundations) · [Components](/relay/components)
