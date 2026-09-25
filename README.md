# templates

Design-language guides written in Markdown, built with [VitePress](https://vitepress.dev) and published at **templates.axeldiaz.com**.

## Guides

- **Lustro** (`lustro.md`) - dark glassmorphism design language: indigo-to-pink/cyan gradients, Space Grotesk / DM Sans / JetBrains Mono, glass surfaces, glow accents. Reference: TemplateMo tm-624.

## Develop

```bash
npm install
npm run dev
```

`npm run build` outputs to `.vitepress/dist` (what Vercel deploys).

## Add a new guide

1. Create `<name>.md` at the repo root.
2. Add it to the sidebar/nav in `.vitepress/config.mts`.
