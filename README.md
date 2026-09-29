# templates

Design-language guides written in Markdown, built with [VitePress](https://vitepress.dev) and published at **templates.axeldiaz.com**.

## Guides

- **Lustro** (`lustro.md`) - dark glassmorphism design language: indigo-to-pink/cyan gradients, Space Grotesk / DM Sans / JetBrains Mono, glass surfaces, glow accents. Reference: TemplateMo tm-624.
- **Felix** (`felix/`) - Felix Pago in Markdown, with the linen/turquoise theme applied on those pages. Foundations (principles, colors, type), tokens, and the component catalog (atoms, molecules, organisms). Reference: [felix-design-system.vercel.app](https://felix-design-system.vercel.app/).

## Develop

```bash
npm install
npm run dev
```

`npm run build` outputs to `.vitepress/dist` (what Vercel deploys).

## Add a new guide

1. Create `<name>.md` at the repo root.
2. Add it to the sidebar/nav in `.vitepress/config.mts`.
