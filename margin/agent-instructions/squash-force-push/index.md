# Squash → force push

Margin · Run observation · [@pitus_ reference](https://x.com/pitus_/status/2126383874775118012)

## Composed card

`<MarginSquashForcePush :motion="true" :autoplay="true" />` — full timeline with Replay.

## Static reference frames (`state` prop)

Same component, frozen UI matching the video:

| `state` | Frame |
| --- | --- |
| `loading` | Branch pill + “Reading 10 commits” |
| `expanded` | 10 commits + ✨ Squash |
| `rebasing` | Mid-collapse + “Rebasing onto main” |
| `squashed` | 3 commits + base, hold to force push |
| `pushing` | `push-progress` ~0.6, “Pushing 3 of 3” |
| `pr-running` | Purple rail, #491, Checks running |
| `pr-passed` | 6 checks passed, Pushed / GitHub footer |
| `pr-running-checks-open` | Same as `pr-running` with checks list open |
| `pr-passed-checks-open` | Same as `pr-passed` with checks list open |

## Expandable checks sub-module

- `checks-data.mjs` — Build, Lint, Typecheck, Unit tests, E2E tests, Vercel Preview
- `SqChecksTrigger.vue` — header button, `aria-expanded`, Enter/Space
- `SqChecksPanel.vue` — list with pass icon or spinner + duration
- Wired in `SqBranchHeader` + `MarginSquashForcePush` (`mg-squash--checks-open` height motion)

Gallery: `MarginSquashStateGallery` on `/margin/squash-force-push` and `/margin/squash-force-push/submodules`.

## Checklist

- [ ] Solid blue Squash button in every frame
- [ ] 392px card, 14px type, 18–20px radius, soft shadow, gray stage
- [ ] 2-col grid / 390px single column
- [ ] No ghost rows after squash in autoplay
- [ ] Copy blocks under each frame
- [ ] Checks status expands to 6 rows (running + passed icons)