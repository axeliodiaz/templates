---
pageClass: alert-guide
---
<script setup>
import AlertUsageDemo from './.vitepress/theme/AlertUsageDemo.vue'
</script>

# Alerts

An alert keeps an important message in the page near the work it concerns. It can explain a warning, a failed operation, a successful change or useful context. Unlike a short-lived toast, it stays visible until its condition changes or the user dismisses it. It is not a modal dialog and should not steal focus when it appears.

## Try a dismissible warning

Review sample checks changes local text. Dismiss sample warning removes only the fictitious warning and moves focus to Restore sample warning. Restore returns focus to the warning's dismiss button. The other messages illustrate success, information and error treatments without claiming a real account event.

<AlertUsageDemo />

## How to use it

1. **State what happened.** A short heading names the condition; supporting text says what is affected. Avoid a generic "Something went wrong" when the application knows the cause.
2. **Provide the next useful action.** Link to the affected detail, offer a safe retry or explain how to fix the input. An alert is not permission to retry an irreversible operation automatically.
3. **Choose severity from the condition.** Warning and error describe consequences, not visual variety. Keep words and an icon when useful so color is never the only signal.
4. **Decide whether dismissal is safe.** Hiding a warning must not mark its underlying problem fixed. Keep required validation or dangerous conditions visible near their source.
5. **Choose announcement urgency.** Static informational content can be ordinary markup. Use a polite status region for routine updates; reserve assertive alert announcements for urgent dynamic changes.
6. **Keep content in the flow.** Wrap long text and action labels. Keep a named dismiss control reachable without shrinking the message or covering adjacent content.

## Anatomy

| Part | Purpose |
|---|---|
| Container and semantic tone | Separate the message from ordinary content while preserving its place in the page. |
| Heading | Names the state in a short phrase. |
| Body | Explains impact and recovery in concrete words. |
| Optional icon | Repeats meaning without adding a duplicate announcement. |
| Optional action | Opens detail, corrects input or starts an explicit safe operation. |
| Optional dismiss button | Hides presentation, not the domain condition; needs a specific accessible name. |
| Announcement region | Communicates relevant dynamic updates once, without forcing focus. |

## Data shape

The guide's `AlertUsageDemo.vue` has no props or emits. It uses:

```ts
// visible: boolean = true
// message: string = 'No real review is pending. This is fictitious data.'
// restore: HTMLButtonElement | null
// dismiss: HTMLButtonElement | null
```

`hide()` sets visible false, updates the local message and uses Vue `nextTick()` before focusing Restore. `show()` reverses it and focuses Dismiss. Review only changes message. There is no timer, automatic dismissal, request or persistence. The static specimen containers have no assertive role; the single `role="status"` result is polite.

An application may model a message independently from its style:

```ts
type AlertMessage = {
  id: string
  tone: 'info' | 'success' | 'warning' | 'error'
  title: string
  body: string
  dismissible: boolean
  action?: { label: string; run: () => void | Promise<void> }
  announcement: 'none' | 'polite' | 'assertive'
}
```

This is an integration model, not one prop API shared by all template catalogs. Keep the actual condition in domain state; store dismissal separately if the product needs it.

## Usage

### Static warning in Lustro

```html
<div class="l-alert l-alert-warn">
  <div>
    <strong>Draft needs review</strong>
    <p>Review the two pending checks before submitting.</p>
  </div>
</div>
```

Existing Lustro styles provide the appearance. This static message does not need `role="alert"` merely because the component is called Alert.

### Dynamic announcement

```html
<!-- Keep the empty region mounted before adding a routine result. -->
<p role="status" aria-atomic="true"></p>
```

Update its text when a relevant operation completes. For an urgent dynamic error, a dedicated assertive alert region may be appropriate; do not announce the same text in both regions. A form should also show and associate its field errors. A toast or alert alone does not make validation usable.

### Dismissal

Use a native `button type="button"` with a name such as "Dismiss import warning". When removing the focused dismiss control, move focus to a sensible surviving control or restore action. Avoid jumping focus when content appears automatically. Dismissal must not submit a form, delete a record or clear a real error without an explicit action.

## States and variants

- **Information:** useful context, with no implied failure or completion. Do not interrupt reading for routine background detail.
- **Success:** confirm a known successful operation. Never show it from a click alone before the real operation completes.
- **Warning:** explain the risk or prerequisite and a recovery path.
- **Error / danger:** explain what failed, what remains unchanged and how to retry or correct it. Keep important errors visible instead of auto-hiding them.
- **Heading and actions:** title, body and action have a clear order. Use a real link for navigation, a button for an operation, and a restrained priority style.
- **With icon:** hide redundant icons from assistive technology; keep a visible severity word or meaningful title.
- **Dismissible:** the close control hides the message only. The guide provides explicit restore and focus behavior; existing catalogs vary in their implementation.
- **Pending action:** if retrying takes time, guard duplicate requests and expose loading on the action, not as a fake success message. Handle failure without losing the recovery control.

## Template map and listed variants

| Template / surface | Source and behavior |
|---|---|
| Lustro | [UI kit](/ui-kit#alerts), [components](/components#alerts), [guide](/lustro/guide-components#alerts): `l-alert` with warning/success modifiers, local dismiss/restore controls. The original warning uses an alert role; audit announcement urgency for the consuming context. |
| Lustro expanded | [Variants](/lustro/components-more#alerts-variants), [heading/actions](/lustro/components-more#alerts-with-heading-and-actions), [dismissible/icon](/lustro/components-more#alerts-dismissible-and-with-icon): BSX visual specimens. A drawn close symbol in static markup is not a working dismiss button. |
| Felix | [Molecules](/felix/components/molecules#alert): `fx-alert` with ok/warn/err. [Expanded alerts](/felix/components-more#alerts-variants) cover additional presentation variants with separately scoped BSX classes. |
| Lumen | [Expanded alerts](/lumen/components-more#alerts-variants) link to the bundled scoped Bootstrap gallery. |
| Scopecraft | [Expanded alerts](/scopecraft/components-more#alerts-variants), including heading/actions and dismissible/icon specimens. |
| Pawprint | [Alerts](/pawprint/components#alerts): `pp-alert` with ok/info/warn/bad modifiers and supporting icons/text. |
| Relay | [Catalog](/relay/components): Studio `sk-alert` with success/warning/danger/info; local sample feedback, no account action. |
| Folio | [Catalog](/folio/components): the same Studio alert structure under Folio styling. |
| Pace | [Catalog](/pace/components): Studio severity treatments under Pace tokens. |
| Spark | [Catalog](/spark/components): Studio severity treatments under Spark tokens. |
| Bastion | [Alerts](/bastion/components#alerts): Bootstrap alpha `alert theme-warning`, toggled by a native Dismiss/Show alert button. Sample text only. |
| PulseFit | [Standalone alerts](/pulsefit-template/components.html#alerts): bundled gallery styles and variants. Use its actual native handlers where present, not guessed framework props. |

## Motion and accessibility

The guide fades messages in over 150ms without moving layout; reduced motion removes the animation. There is no countdown or auto-dismiss. Important content stays readable independently of motion.

Keep a meaningful reading order and visible focus rings. Use native controls for actions, label dismiss buttons, and keep icons decorative when the text repeats their meaning. Alerts do not trap focus. Routine updates use polite announcements; urgent dynamic messages can use an assertive alert, but repeating static message blocks should not all interrupt the user on load. Verify with assistive technology in the consuming app.

## Integration notes

Import `AlertUsageDemo.vue` for this exact example. It uses existing Lustro alert/button classes with scoped layout, an explicit demo-only error treatment and entry motion. The existing Lustro base stylesheet has warning/success modifiers but no error-alert modifier; do not assume `l-alert-error` exists. The real catalogs keep distinct namespaces and behavior; there is no universal installed Alert package in this repository. This documentation does not rewrite their in-flight files or silently add handlers to static specimens.

Render untrusted message text as text, not raw HTML. Keep domain conditions separate from presentation/dismissal state, and avoid persisting a dismissed security or validation problem as resolved. The consuming application owns data, permissions, validation, network handling and recovery. All guide examples are fictitious and local.

<style>
.alert-guide .vp-doc table { width:100%; table-layout:fixed }
.alert-guide .vp-doc td, .alert-guide .vp-doc th { overflow-wrap:anywhere }
@media(max-width:640px) {
  .alert-guide .vp-doc table, .alert-guide .vp-doc tbody, .alert-guide .vp-doc tr, .alert-guide .vp-doc td { display:block; width:100% }
  .alert-guide .vp-doc thead { display:none }
  .alert-guide .vp-doc tr { margin:12px 0; border:1px solid var(--vp-c-divider) }
  .alert-guide .vp-doc td { border:0 }
  .alert-guide .vp-doc td:first-child { font-weight:700; padding-bottom:4px }
  .alert-guide .vp-doc td + td { padding-top:4px }
}
</style>
