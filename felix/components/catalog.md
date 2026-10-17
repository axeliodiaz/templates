---
outline: false
---

# Felix component catalog

Bootstrap 6.0.0-alpha.1 renders in an isolated iframe so Felix tokens and Bootstrap styles do not bleed into the VitePress shell or other templates. Every family below is live in the catalog page; actions are fictitious and local.

<iframe src="/felix-template/catalog.html" title="Felix Bootstrap 6 component catalog" loading="lazy" style="width:100%;height:920px;border:1px solid var(--vp-c-divider);border-radius:12px;background:#fefcf9"></iframe>

[Open the catalog full screen](/felix-template/catalog.html) · [Send-flow app](/felix-template/index.html) · [Felix on Bootstrap 6 notes](/felix-bootstrap)

The earlier Vue catalog (`ComponentCatalog` with `language="felix"`) is retired here in favor of real Bootstrap markup. Atom and molecule docs under `/felix/components/atoms` and `/felix/components/molecules` remain the `@felix/ui` reference.

## Production checklist

Keep labels, validation, focus, loading and disabled states. Test keyboard and screen-reader behavior. Toasts are short confirmations; alerts persist. Replace local demo logic with validated application actions before production.
