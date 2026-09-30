# Typography

Two families, two registers. Plain is the display face — the file loaded in this guide is Plain Black. Saans is the UI face.

Plain for the amount you send and the success headline. Saans for every label, button, and paragraph.

## Scale

<div class="fx-t fx-t-display-xl">$1,200.00</div>

`text-display-xl` · Plain · 700 · 56 / 1.2 · -2px

<div class="fx-t fx-t-display-lg">Enviaste con éxito</div>

`text-display-lg` · Plain · 700 · 48 / 1.2 · -2px

<div class="fx-t fx-t-display-md">Envío confirmado</div>

`text-display-md` · Plain · 700 · 28 / 1.1 · -1px

<div class="fx-t fx-t-heading-1">Tu dinero está en camino</div>

`text-heading-1` · Saans · 600 · 36 / 1.2 · -1px

<div class="fx-t fx-t-heading-2">Historial de envíos</div>

`text-heading-2` · Saans · 600 · 30 / 1.2 · 0

<div class="fx-t fx-t-heading-3">Título de pantalla</div>

`text-heading-3` · Plain · 700 · 24 / 1.3 · 0

<div class="fx-t fx-t-heading-4">Subtítulo de sección</div>

`text-heading-4` · Plain · 700 · 20 / 1.5 · 0

<div class="fx-t fx-t-body-lg">Texto de cuerpo grande para introducciones.</div>

`text-body-lg` · Saans · 400 · 18 / 1.3 · 0

<div class="fx-t fx-t-body">Texto de cuerpo para instrucciones y descripciones claras.</div>

`text-body` · Saans · 400 · 16 / 1.2 · 0

<div class="fx-t fx-t-body-sm">Texto de cuerpo pequeño para detalles secundarios.</div>

`text-body-sm` · Saans · 400 · 14 / 1.5 · 0

<div class="fx-t fx-t-caption">RECIBIDO · HACE 2 MIN</div>

`text-caption` · Saans · 400 · 12 / 1.2 · 0.25px

<div class="fx-t fx-t-caption-sm">TÉRMINOS Y CONDICIONES</div>

`text-caption-sm` · Saans · 400 · 11 / 1.1 · 0

| Token | Family | Weight | Size | Line | Tracking | Sample |
|---|---|---|---|---|---|---|
| `text-display-xl` | Plain | 700 | 56 | 1.2 | -2px | $1,200.00 |
| `text-display-lg` | Plain | 700 | 48 | 1.2 | -2px | Enviaste con éxito |
| `text-display-md` | Plain | 700 | 28 | 1.1 | -1px | Envío confirmado |
| `text-heading-1` | Saans | 600 | 36 | 1.2 | -1px | Tu dinero está en camino |
| `text-heading-2` | Saans | 600 | 30 | 1.2 | 0 | Historial de envíos |
| `text-heading-3` | Plain | 700 | 24 | 1.3 | 0 | Título de pantalla |
| `text-heading-4` | Plain | 700 | 20 | 1.5 | 0 | Subtítulo de sección |
| `text-body-lg` | Saans | 400 | 18 | 1.3 | 0 | Texto de cuerpo grande para introducciones. |
| `text-body` | Saans | 400 | 16 | 1.2 | 0 | Texto de cuerpo para instrucciones y descripciones claras. |
| `text-body-sm` | Saans | 400 | 14 | 1.5 | 0 | Texto de cuerpo pequeño para detalles secundarios. |
| `text-caption` | Saans | 400 | 12 | 1.2 | 0.25px | RECIBIDO · HACE 2 MIN |
| `text-caption-sm` | Saans | 400 | 11 | 1.1 | 0 | TÉRMINOS Y CONDICIONES |

## Fonts

Plain and Saans are licensed. They load in this guide from the design-system font files. Fallback stack:

```css
--font-heading: "Plain", "Saans", system-ui, sans-serif;
--font-sans: "Saans", system-ui, sans-serif;
--font-mono: ui-monospace, "SF Mono", Menlo, Consolas, monospace;
```
