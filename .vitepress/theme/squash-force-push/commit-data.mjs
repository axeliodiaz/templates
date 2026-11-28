/** Demo commit rows for squash → force-push (synthetic) — from squash-force-push.json. */
import {
  BRANCH,
  TARGET,
  initialCommits as _initial,
  squashedCommits as _squashed,
} from './squash-definition.mjs'

export { BRANCH, TARGET }

/** @typedef {'commit'|'fixup'|'wip'|'base'} CommitKind */

/** @type {import('./types').CommitRow[]} */
export const initialCommits = _initial

/** @type {import('./types').CommitRow[]} */
export const squashedCommits = _squashed

export const fixupCount = 7
export const prNumber = 491
export const prTitle = 'Refresh sessions near expiry'