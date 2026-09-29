# Typography

 {#typography}

| Role | Font | Usage |
|---|---|---|
| Display / headings | **Plain** (800–900) | h1, hero, tight `-0.02em` tracking, line-height `1.1` |
| Body / UI | **Saans** (300–700) | paragraphs, labels, controls. Heading tracking `-0.01em` |
| Code / data | **SF Mono** / ui-monospace | code, hex values, IDs |

Plain and Saans are licensed faces. Load them from the product font files (`PlainLTStd-Black`, `SaansLTStd-Light` / `Regular` / `SemiBold`). Fallback stack:

```css
--font-heading: "Plain", "Saans", system-ui, sans-serif;
--font-sans: "Saans", system-ui, sans-serif;
--font-mono: ui-monospace, "SF Mono", Menlo, Consolas, monospace;
```

| Step | Size | Line height |
|---|---|---|
| Caption / xxs | `0.6875rem` | — |
| Body | `1rem` | `1.5` |
| Heading 3 | `1.25rem` | `1.5` |
| Heading 2 | `1.75rem` | `1.4` |
| Display | `3.75rem`–`4.5rem` | `1.1` |
