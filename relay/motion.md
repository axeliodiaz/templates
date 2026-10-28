---
aside: false
---
# Relay motion

Motion shows that the room is live. It does not hide content, and it does not loop on static prose.

| Moment | Motion | Duration |
| --- | --- | --- |
| Cards on arrival | Fade and rise 10px | 550ms |
| Tool-call count | Counts up once from a nearby value | 700ms |
| Sparkline | Stroke draws left to right | 1.05s, and again when a new sample point arrives |
| Graph edges | Violet and teal dashes travel toward the person | about 3s, looping |
| Status dots | Soft pulse | 2.2s, looping |
| Run bars | Grow from the baseline | 700ms |
| Feed row | Slides in from above | 400ms |
| Approval leave | Fades and shifts right, then the row is gone | 280ms |
| Buttons | Background and a 1px press | 160ms |
| Drawer and dialogs | Bootstrap 6 overlay transition | 300ms |

Graph edges, status dots, and the live feed are the only loops. They describe connection and arrival. Guide pages also use the shared template motion layer: a short opacity fade on headings, cards, and inserted catalog pieces. That layer does not replace the chart transforms.

## Reduced motion

When `prefers-reduced-motion: reduce` is set:

- CSS animations and transitions on `.relay`, including pseudo-elements, are removed.
- The tool-call figure appears at its final value.
- New feed rows and approval changes still update the text. They do not travel.
- The shared template-motion layer cancels running document animations.

Content stays visible before JavaScript runs. Timers are cleared when the control room unmounts.

[Control room](/relay/overview) · [Components](/relay/components)
