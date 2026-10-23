# Relay foundations

Relay is a dark control room. Graphite panels sit on `#070910`. Violet (`#6d4dff` on buttons, `#a78bfa` on glows) connects the person to agents. Teal (`#5eead4`) connects the person to MCP servers. Text is Inter.

## Palette

| Token | Value | Role |
| --- | --- | --- |
| Canvas | `#070910` | Page behind the panels |
| Surface | `#12141f` | Glassy cards |
| Ink | `#f4f6fb` | Primary text |
| Muted | `#b7c0d6` | Secondary text and timestamps |
| Violet action | `#6d4dff` | Primary buttons and the active nav pill |
| Violet glow | `#a78bfa` | Agent borders, graph edges, focus |
| Teal | `#5eead4` | Server borders and graph edges |
| Success | `#3ddc97` | Online, connected, positive delta |
| Warning | `#f0c36d` | Pending and paused |
| Danger | `#ff8da3` | Failed or denied sample states |

White on `#6d4dff` is the button pair. Muted `#b7c0d6` on `#070910` is the secondary pair. Status color never replaces the label.

## Typography

Inter for UI and headings, with DM Sans as the fallback already loaded by the site. Titles about 22px, card titles 15px, body 14px, metadata 12px. Metrics use tabular figures at about 30px. Tool names use a monospace face.

## Spacing and shape

4px grid. Card radius is 16px, the shell radius is 20px, and pills are fully round. Cards use a 1px violet or teal edge plus a soft outer glow. Do not stack extra shadows on resting cards.

## Accessibility

Focus is a 2px `#c4b5fd` ring. Icon buttons have accessible names. The graph has a visually hidden list of the same links, and a visible sentence when the curves are hidden. The live region announces the latest sample event only, after the page has loaded. Dialogs are native `<dialog>` elements: Escape closes them and focus stays inside while they are open. The closed drawer is `inert`.

## Responsive layout

From the `lg` breakpoint (1024px) up, the rail is a 228px column. Below that, Open navigation reveals a Bootstrap 6 start drawer. Inside the frame, container queries stack the approval and activity cards, then the agent row, then the metric cards, so a 390px, 820px, and 1440px viewport each keep the feed readable.

[CSS implementation](/relay/tokens) · [Motion](/relay/motion) · [Control room](/relay/overview)
