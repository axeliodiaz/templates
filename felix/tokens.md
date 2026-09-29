# Design tokens

Copy these as CSS variables. They match the live system at [felix-design-system.vercel.app/tokens](https://felix-design-system.vercel.app/tokens).

```css
:root {
  --turquoise: #2bf2f1;
  --lime: #dcff00;
  --slate: #082422;
  --linen: #fefcf9;
  --stone: #efebe7;
  --concrete: #cfcabf;
  --mocha: #877867;
  --papaya: #f26629;
  --cactus: #60d06f;
  --blueberry: #6060bf;
  --mango: #f19d38;
  --evergreen: #35605f;

  --background: var(--linen);
  --foreground: var(--slate);
  --primary: var(--turquoise);
  --primary-foreground: var(--slate);
  --accent: var(--lime);
  --border: var(--concrete);
  --muted: var(--stone);
  --destructive: var(--papaya);
  --ring: var(--mocha);

  --radius-button: 9999px;
  --shadow-turquoise: 0 4px 14px #2bf2f140;
  --shadow-selection: 0 0 0 6px #2bf2f11a;

  --font-heading: "Plain", "Saans", system-ui, sans-serif;
  --font-sans: "Saans", system-ui, sans-serif;
  --font-mono: ui-monospace, "SF Mono", Menlo, Consolas, monospace;
}

.dark {
  --background: #082422;
  --foreground: #fefcf9;
  --card: #234343;
  --muted: #152b2a;
  --accent: #b2d000;
  --border: #35605f;
}
```

## Shape and elevation {#shape}

Radius: `2px` xs · `4px` sm · `8px` md · `12px` lg · `16px` xl · `24px` 2xl · `32px` 3xl · pill `9999px`. Buttons use a full pill: `border-radius: calc(1rem + 999px)`.

```css
--shadow-sm: 0 1px 3px #0824220f, 0 1px 2px #0824220a;
--shadow-md: 0 4px 6px #0824220f, 0 2px 4px #0824220a;
--shadow-turquoise: 0 4px 14px #2bf2f140; /* primary button glow */
--shadow-selection: 0 0 0 6px #2bf2f11a;  /* turquoise focus, 6px */
```

Spacing scale (px): 0, 4, 8, 12, 16, 20, 24, 28, 32, 40, 48, 64, 80, 96.
