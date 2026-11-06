---
pageClass: felix-card-guide
---
<script setup>
import FelixCardDemo from '../../.vitepress/theme/FelixCardDemo.vue'
</script>

# Card

A Felix card groups one subject and its related actions. Use it for a recipient, transfer summary or short review step. Keep the linen/slate surfaces, turquoise primary action and Felix navigation throughout the flow.

[Back to Felix components](/felix/components/) · [Molecule reference](/felix/components/molecules#card)

## Try a summary and selected state

Open sample details changes only the local status message. Select sample recipient toggles an explicit button's pressed state and the selected card's border. Neither card is a disguised button. All data is fictitious.

<FelixCardDemo />

## Composition

The existing Felix component reference names `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent` and `CardFooter` from `@felix/ui`. This site demonstrates the same structure with local HTML and Vue, not an installed `@felix/ui` package.

| Part | Purpose |
| --- | --- |
| Container | Groups one subject. Use a border or a shadow, never both. |
| Header and title | Gives the subject a short, meaningful name. |
| Description and content | Explains the summary without duplicating its detail page. |
| Footer and actions | Offers the next step with a real button or link. |
| Selection control | Owns selection and its accessible pressed or checked state. |

Use [ChoiceCard](/felix/components/molecules#choicecard) for a radio-style choice between options. Use a [Table](/felix/components/molecules#table) for dense comparisons rather than a wall of cards.

## States and accessibility

- Keep meaningful headings and native buttons. Do not nest a button inside a card-wide link.
- Show selection through both the control state and the visible border, not color alone.
- Leave text selectable and let long text wrap. Footer actions wrap on narrow screens.
- Preserve a visible focus ring in light and dark Felix themes.
- Loading, empty and error states belong to the consuming app. This local demo has no network, props, persistence or loading API.

## Theme boundary

This guide lives at `/felix/components/card`, so direct visits and in-site navigation keep the Felix theme and sidebar. The earlier [molecule Card anchor](/felix/components/molecules#card) remains available.

The [shared Card guide](/cards) is a separate, general guide. Following that explicitly labeled link leaves the Felix section; it does not change the shared guide into a Felix page.
