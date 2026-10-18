---
aside: false
---
# Pace

Fresh green design system for fitness and cycling studios. One calm brand green on light or dark surfaces, clear status colors, large touch targets and light motion. Built for studio admin, coach and member screens plus transactional email.

## Start here

- [Foundations](/pace/foundations): palette, contrast, typography, spacing, shape and icons.
- [CSS implementation](/pace/tokens): tokens, theming and usage.
- [Components](/pace/components): full live catalog with states.
- [Charts](/pace/charts): attendance, trends, comparison and funnel.
- [Layouts](/pace/layouts): admin console and member app.
- [Emails](/pace/emails): booking, reminder, receipt and expiry templates.
- [Motion](/pace/motion): what moves, how long, and reduced-motion rules.
- [Member app demo](/fitness): the original one-screen Pace demo.

## Principles

1. One brand green per surface. Green is the action; status colors carry meaning with a label and icon.
2. Light and dark are first-class. Dark uses a lighter green (#83d4a1) so contrast stays above 4.5:1.
3. Numbers use tabular digits. Seats, credits and times never hide units.
4. Touch targets stay at least 40px in member screens; admin tables scroll inside their wrapper.
5. Motion explains change (arrival, count, confirmation) and respects reduced motion.
6. Every preview is local with fictitious data. No booking, payment or message is real.

## Using the system

Load `studio-systems.css` and `pace-system.css`, wrap content in `studio-kit studio-pace` and use the `sk-*` classes. `StudioCatalog.vue` and `StudioExtended.vue` render live components with `theme="pace"`. Dark mode follows the site toggle (`html.tpl-dark`).
