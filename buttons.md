<script setup>
import ButtonUsageDemo from './.vitepress/theme/ButtonUsageDemo.vue'
</script>

# Buttons

Buttons start an action: save a draft, open a dialog, retry a request or confirm a choice. Use a link for navigation to another URL. This guide explains the button family across the template catalogs, with the same how-to, data shape and integration detail as the [Node flow builder](/node-flow).

## Try the states

Save the fictitious draft to see a one-second pending state. Favorite is a toggle: its accessible pressed state changes, but its label stays stable. Unavailable is truly disabled. Delete sample only explains the destructive style; it never deletes anything. Tab through the enabled controls, then activate them with Enter or Space.

<ButtonUsageDemo />

## How to use it

1. **Name the outcome.** Prefer "Save draft" to "OK". An icon-only action still needs an accessible name such as `aria-label="Close details"`.
2. **Choose one leading action per surface.** Primary draws attention to that outcome; secondary, outline or quiet styles support it. Danger is for a destructive consequence, not a second brand color.
3. **Pick the semantic element.** Use `<button type="button">` for local actions, `type="submit"` for the form's submitter, and `<a href="...">` for navigation. A styled span is a visual specimen, not an accessible control.
4. **Connect state to the real operation.** Guard against double submission, show a pending label, and restore the control after success or failure. Keep useful progress and errors in visible text.
5. **Handle the outcome.** The demo only changes local text. An application must validate data, handle network failure and permission errors, and supply any destructive confirmation separately.
6. **Test the actual theme.** Keep the theme's shape, type, focus and semantic colors. Check both appearances and narrow screens rather than mixing classes from different catalogs.

## Anatomy

| Part | Purpose |
|---|---|
| Native control | Receives focus and keyboard activation; owns `disabled`, `type` and event handling. |
| Label | Short verb and object that tell the user what will happen. |
| Optional icon or counter | Supports the label; decorative icons use `aria-hidden="true"`. |
| Surface, border and focus ring | Communicate priority and interaction without relying on color alone. |
| Pending indicator | Shows the operation is running without changing the button's purpose. |
| Outcome text | Confirms success or explains failure outside the button. |

## Data shape

The catalogs use native markup, not one shared installed Button package. The following is an **application model**, not a claim that every catalog accepts these Vue props:

```ts
type ButtonSpec = {
  id: string
  label: string
  intent: 'primary' | 'secondary' | 'quiet' | 'danger'
  type: 'button' | 'submit' | 'reset'
  disabled?: boolean
  busy?: boolean
  pressed?: boolean // only for toggle buttons, omit for ordinary actions
  accessibleName?: string // required when no visible label exists
  action: () => void | Promise<void>
}
```

The live demo is `ButtonUsageDemo.vue` with no props or emitted events. Its `busy: boolean`, `pressed: boolean` and `result: string` refs start as `false`, `false` and the ready message. `save()` guards a repeated click, sets busy, waits 1,000ms and updates the result. The timer is cleared on unmount. It is a simulated delay, not a request or an estimate of real save time.

## Usage

### Native Lustro markup

```html
<button type="button" class="l-btn l-primary">Save draft</button>
<button type="button" class="l-btn l-secondary">Preview</button>
<button type="button" class="l-btn l-quiet">Cancel</button>
<button type="button" class="l-btn l-danger">Delete record</button>
<button type="button" class="l-btn l-secondary" disabled>Unavailable</button>
```

These classes require the repository's Lustro styles. They do not supply event handlers, a confirmation dialog or persistence. Do not copy only the appearance and omit native semantics.

### Pending action in Vue

```vue
<script setup>
import { ref } from 'vue'
const busy = ref(false)
const message = ref('')
async function save() {
  if (busy.value) return
  busy.value = true
  try {
    // Replace with your validated application operation.
    await Promise.resolve()
    message.value = 'Sample complete.'
  } catch {
    message.value = 'Could not save. Try again.'
  } finally {
    busy.value = false
  }
}
</script>
<template>
  <button type="button" class="l-btn l-primary"
    :disabled="busy" :aria-busy="busy" @click="save">
    {{ busy ? 'Saving...' : 'Save draft' }}
  </button>
  <p role="status">{{ message }}</p>
</template>
```

`Promise.resolve()` is a placeholder, not a backend implementation. Do not report a real record saved until the real operation succeeds. For a form, bind `@submit.prevent` on the form and use a submit button so keyboard submission follows the same path.

## States and variants

| State or variant | Behavior and rule |
|---|---|
| Default / hover | Label remains legible; hover is feedback, never the only way to discover an action. |
| Focus | Visible focus ring; keep the ring outside clipping containers. |
| Active | Pointer or keyboard press feedback is temporary. It is not a saved selection. |
| Toggle | Set `aria-pressed` to match local selection. Keep a stable label. Use checkbox/radio for form choices. |
| Disabled | Native `disabled` blocks activation and removes the button from sequential focus. Explain an important prerequisite nearby. `aria-disabled` alone does not block a handler. |
| Loading | Prevent duplicate actions; keep a recognizable label and an announced result. Do not leave a control pending after failure. |
| Danger | Use explicit consequence text and the application's confirmation/undo policy. A red style alone provides no safeguard. |
| Small / default / large | Match local density while keeping usable touch targets. The guide demo uses 44px minimum height. |
| Full width / shape | Use full width in a narrow action area; preserve the theme's pill, rounded or square language. |
| Icon / counter | Name icon-only actions and make count changes understandable. Hide purely decorative icons from assistive technology. |

## Template map and existing specimens

Each link opens the existing implementation or its button section. This guide does not replace their styles or silently convert static examples into interactive controls.

| Template / surface | Existing button language and specimen |
|---|---|
| Lustro | `l-btn` with `l-primary`, `l-secondary`, `l-quiet`, `l-danger`. [UI kit](/ui-kit#buttons), [component page](/components#buttons), [guide](/lustro/guide-components#buttons). |
| Lustro expanded | [BSX specimens](/lustro/components-more#buttons-variants): semantic fills, outline, sizes, disabled, full width, shapes, toggle, icons/counters and loading. Legacy previews use styled spans; use native buttons in an app. |
| Felix | [Atoms](/felix/components/atoms#button): `fx-btn` plus primary/secondary/ghost/line/danger modifiers; pill shape, sm/md/lg and block modifier. [Expanded set](/felix/components-more#buttons-variants) covers the extended variants. The Markdown uses native HTML; references to `@felix/ui` describe its design source, not a package installed here. |
| Lumen | [Expanded sections](/lumen/components-more#buttons-variants) link to the [Bootstrap gallery](/lumen-template/bootstrap-set.html#buttons-variants). Keep the scoped Lumen Bootstrap styles rather than reusing `fx-btn`. |
| Scopecraft | [Expanded specimens](/scopecraft/components-more#buttons-variants) use BSX's `btn` plus `pri`, outline, size and state modifiers inside the scoped wrapper. Legacy span specimens are visual only. |
| PulseFit | [Standalone components](/pulsefit-template/components.html#buttons-variants): the native gallery's variants and states. Use its bundled PulseFit theme styles rather than assuming Lustro classes work there. |
| Pawprint | [Buttons and badges](/pawprint/components#buttons-and-badges): `pp-btn`, blue/sage, `out`, ghost and small. Existing styled spans illustrate appearance; a `disabled` attribute on a span does not create a disabled button. |
| Relay | [Catalog](/relay/components): `StudioCatalog.vue` uses scoped `b2-bs6` / `b2-relay`, Bootstrap `btn btn-solid theme-primary` or outline plus `sk-*` adjustments. Async demo resets after 650ms locally. |
| Folio | [Catalog](/folio/components): the same Studio control structure under `b2-folio`, with Folio tokens. |
| Pace | [Catalog](/pace/components): Studio control structure under `b2-pacekit`, not `b2-pace`; preserve the actual wrapper. |
| Spark | [Catalog](/spark/components): Studio control structure under `b2-spark`, with Spark tokens. |
| Bastion | [Catalog](/bastion/components#buttons): native Bootstrap alpha controls with `btn-solid` / `btn-outline` and semantic `theme-*` classes. See the [pin and usage constraints](/bastion/usage). |

## Motion and accessibility

The guide demo uses a 120ms press/opacity transition, without moving layout or changing meaning. Reduced motion removes that transition and the pressed translation. Pending remains a text state, so understanding never depends on animation. The simulated wait still lasts one second.

- Native buttons support Tab focus and Enter/Space activation. Do not put interactive controls inside other interactive controls.
- Keep focus visible and preserve a useful focus location after pending states, dialogs and removed elements. Test the actual application flow.
- Use `aria-pressed` only for toggles and `aria-busy` while processing. Status text uses `role="status"` for a polite announcement.
- A disabled action should not hide an error. Keep the reason and recovery path visible outside it.
- Check text, border and focus contrast in every target theme; never rely on destructive red or a spinner alone to explain the action.

## Integration notes

This page's interactive example imports `ButtonUsageDemo.vue`; Lustro styles are already loaded by the VitePress theme. Other templates keep their own scoped native or Bootstrap styles listed above. There is no universal `Button` export shared by all catalogs. Keep one namespace per implementation and do not include an unscoped Bootstrap sheet over the full documentation site.

The original catalogs remain the source for each visual variant. This guide adds usage and state guidance without editing their in-flight files. All demo data is fictitious; examples never send requests, delete records or persist state. Production validation, error handling, authorization, confirmation and routing belong to the consuming application.
