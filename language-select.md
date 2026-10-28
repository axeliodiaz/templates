---
pageClass: language-guide
---
<script setup>
import LanguageUsageDemo from './.vitepress/theme/LanguageUsageDemo.vue'
</script>

# Language select

Language select opens a compact list of supported language names and shows the chosen code. Use it for an explicit language choice, not as a flag-based country selector. Changing this component alone does not translate text, update the document language or navigate to a localized route.

## Try a local language choice

Open the list, move with Up/Down or Home/End, then Enter or Space chooses. Escape closes without changing the selection and returns focus to the trigger. Tab closes without forcing focus back. Clicking outside also closes. All choices stay local; no account setting or page translation changes.

<LanguageUsageDemo />

## How to use it

1. **List supported languages only.** Provide a nonempty array with unique codes and readable names. Display names in a form people can recognize, such as Español or English.
2. **Choose the initial value.** `modelValue` is matched case-insensitively at mount. An unknown value falls back to the first language.
3. **Handle the emitted code.** The component emits a lowercase code when someone chooses. Wire routing, translation and persistence separately, with truthful loading/error states.
4. **Place the popup safely.** Choose left/right alignment and allow space for the menu. Do not clip it inside an overflow-hidden container.
5. **Keep keyboard behavior.** The list owns active-descendant focus, arrow movement and selection; do not turn each option into a nested button.
6. **Test actual locale change.** A real application must update text, route, document lang and direction where appropriate, preserving user context. The sample does none of that.

## Anatomy

| Part | Purpose |
|---|---|
| Trigger button | Shows code, globe and chevron; accessible name includes the current language. |
| Listbox | Focused popup named Language, with an active descendant. |
| Option | Language code/name, selected state and checkmark. |
| Active highlight | Keyboard/pointer candidate, distinct from the committed selection. |
| Local result | Guide wrapper shows the last emitted code, not a successful settings save. |

## Actual props and events

The existing `LangSelect.vue` defines:

| Prop | Default and behavior |
|---|---|
| `theme` | String, `lumen`; styles exist for lumen, lustro, felix, scopecraft and pulsefit. |
| `align` | String, `left`; `right` moves the popup's aligned edge. |
| `modelValue` | String, `es`; initializes selection once, case-insensitively. |
| `languages` | Array of `{ code, name }`; default ES/Español, EN/English, PT/Português, FR/Français, DE/Deutsch. |

Event: `update:modelValue` emits the picked `code.toLowerCase()`. The guide wrapper has `language: string = 'es'` and binds v-model. It adds local result text and 44px minimum trigger/option heights without changing the underlying component.

Internal refs: `cur` holds the selected object; `open` is the popup state; `act` is the active option index. Root/menu/button refs manage focus and outside clicks. Option IDs use a generated instance prefix; `aria-activedescendant` follows the active index.

Important limits: `cur` is initialized from props, not watched. Later external `modelValue` changes do not automatically resync the displayed selection. Dynamic language-list replacement is also not reconciled. Keep the list stable and nonempty, and do not assume a fully controlled component contract. Empty lists, duplicate codes and missing code/name values are unsupported by the current implementation.

## Usage

```vue
<script setup>
import { ref } from 'vue'
import LangSelect from './.vitepress/theme/LangSelect.vue'
const language = ref('es')
const languages = [
  { code: 'ES', name: 'Español' },
  { code: 'EN', name: 'English' }
]
</script>
<template>
  <LangSelect theme="lustro" align="left" v-model="language" :languages="languages" />
</template>
```

Adapt the import path for nested pages. This code only chooses a local language. A real locale handler must resolve supported routes and translations, handle failure, and avoid reporting account persistence unless confirmed. If an external locale can change independently, add deliberate synchronization in the consuming implementation rather than relying on a watcher that does not exist here.

## States and variants

- **Closed:** trigger shows the committed code with aria-expanded false.
- **Open:** listbox receives focus; active index starts at the current selection.
- **Active versus selected:** arrows/mouse movement changes the candidate. Enter/Space/click commits and emits; Escape does not.
- **Left / right alignment:** visual placement only, not a reading-direction switch.
- **Theme variants:** existing template tokens change surfaces, borders, typography and highlights. They do not change locale behavior.
- **Unknown initial code:** falls back to the first supplied language. Validate the intended initial locale in application code.
- **Disabled / loading / failure:** there are no such props or states in this component. Add explicit application handling if language switching depends on remote work.
- **Long list / typeahead:** no search, typeahead, virtualization or automatic active-option scroll logic is implemented. Keep the list short or implement and test a suitable alternative.

## Keyboard, motion and accessibility

Click, Enter or Space on the native trigger opens it; ArrowDown also opens. In the focused list, Up/Down wraps, Home/End moves to endpoints, Enter/Space selects, Escape closes and refocuses the trigger, and Tab closes without refocusing. Pointer-down outside closes without stealing focus. The document listener is registered on mount and removed on unmount.

The popup uses a 140ms opacity/translate animation and the chevron a 150ms rotation transition. Reduced motion removes both. Selected language remains in text and aria-selected, independent of motion.

Test focus return, active-descendant targets, selected state and zoom. The current component uses English accessible labels (Language) even when names are localized; localize those in a production integration if needed. The base trigger is 36px high; this guide wrapper raises it and options to 44px. Do not claim the base component already has the wrapper's target sizing. The trigger has aria-haspopup and aria-expanded but no explicit aria-controls binding to a listbox ID; assess that wiring in the consuming accessibility review rather than assuming it exists.

## Template map

| Surface | Existing use |
|---|---|
| Lustro base | [Guide](/lustro/guide-components#language-select), [components](/components#language-select), [UI kit](/ui-kit#language-select): LangSelect with lustro theme. |
| Lustro expanded | [Language select](/lustro/components-more#language-select): same component and theme. |
| Felix | [Language select](/felix/components-more#language-select): same component with felix theme. |
| Lumen | [Language select](/lumen/components-more#language-select): same component with lumen theme. |
| Scopecraft | [Language select](/scopecraft/components-more#language-select): same component with scopecraft theme. |
| PulseFit | [Language select](/pulsefit/components-more#language-select): same component with pulsefit theme. |

Unlike static visual specimens, these surfaces share the actual LangSelect implementation. Their local choice is still not wired to a localization service by this component.

## Integration notes

Use supported locale codes and safe text labels, preserve context through route changes, and update document lang/direction together with translated content. Handle a failed real change without silently showing an unsupported saved locale. Persist only through the application's authorized settings flow. No user preferences are stored by this guide.

<style>
.language-guide .vp-doc table { width:100%; table-layout:fixed }
.language-guide .vp-doc td, .language-guide .vp-doc th { overflow-wrap:anywhere }
@media(max-width:640px) {
  .language-guide .vp-doc table, .language-guide .vp-doc tbody, .language-guide .vp-doc tr, .language-guide .vp-doc td { display:block; width:100% }
  .language-guide .vp-doc thead { display:none }
  .language-guide .vp-doc tr { margin:12px 0; border:1px solid var(--vp-c-divider) }
  .language-guide .vp-doc td { border:0 }
  .language-guide .vp-doc td:first-child { font-weight:700; padding-bottom:4px }
  .language-guide .vp-doc td + td { padding-top:4px }
}
</style>
