# Squash → force push

Margin · Run observation · [reference](https://x.com/pitus_/status/2126383874775118012)

## Composed card

`MarginSquashForcePush` = sub-modules + `useSquashFlow` orchestration.

- **Autoplay** (default): 2s load/expand → pause → auto squash → hold push 2s → purple PR + checks 3s.
- **Interactive**: user Squash / hold push any time (cancels autoplay for that run).
- **Replay**: resets timeline.

Props: `motion`, `autoplay`. Method: `replay()`.

## Sub-modules

Import from `.vitepress/theme/squash-force-push/components/`:

| Module | File | Role |
| --- | --- | --- |
| Branch header | `SqBranchHeader.vue` | Branch pill → main, or PR # + title; loading / commit count / checks |
| Commit row | `SqCommitRow.vue` | Grid row + node; kinds: commit, fixup (×), wip/base (hollow) |
| Branch rail | `SqBranchRail.vue` | Vertical line + elbow + `origin/…` pill; purple when pushed |
| Footer status | `SqRunFooterStatus.vue` | Fixup hint, rebasing spinner, yellow warning, Pushed ✓ |
| Squash button | `SqSquashButton.vue` | ✨ Squash + fade on press |
| Hold push | `SqHoldPushButton.vue` | 2s fill, cancel on release, keyboard |
| PR actions | `SqPrFooterActions.vue` | Delete branch + GitHub CTA |

## Visual tokens

`margin-squash-force-push.css`: `--mg-squash-motion`, `--mg-squash-enter` (2s), blue/red/purple/green/yellow accents. Card max-width **392px**. 390px: hash stacks, time hidden.

## Checklist

- [ ] Autoplay matches video timing; Replay works
- [ ] Submodule gallery on `/margin/squash-force-push`
- [ ] Dark preview + 390px without overflow
- [ ] `prefers-reduced-motion` instant