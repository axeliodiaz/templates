/** Demo commit rows for squash → force-push (synthetic). */
export const BRANCH = 'feat/session-refresh'
export const TARGET = 'main'

/** @typedef {'commit'|'fixup'|'wip'|'base'} CommitKind */

/** @type {import('./types').CommitRow[]} */
export const initialCommits = [
  { id: 'c1', kind: 'fixup', message: 'ok now it works', hash: '7e0c3b8', time: 'now', squashInto: 'c2' },
  {
    id: 'c2',
    kind: 'commit',
    message: 'Add session refresh tests',
    hash: 'd29f50a',
    time: '3m',
    extra: 1,
  },
  { id: 'c3', kind: 'fixup', message: 'pls work', hash: 'b81f4c2', time: '9m', squashInto: 'c2' },
  { id: 'c4', kind: 'fixup', message: 'remove console.logs', hash: '3e6b0d7', time: '12m', squashInto: 'c2' },
  { id: 'c5', kind: 'fixup', message: 'fix typo again', hash: '9a7c11e', time: '15m', squashInto: 'c2' },
  { id: 'c6', kind: 'fixup', message: 'fix typo', hash: 'b38f7c4', time: '16m', squashInto: 'c2' },
  {
    id: 'c7',
    kind: 'commit',
    message: 'Refresh sessions near expiry',
    hash: 'c70a92b',
    time: '25m',
    extra: 3,
  },
  { id: 'c8', kind: 'fixup', message: 'add console.logs', hash: '8e19aa0', time: '31m', squashInto: 'c7' },
  { id: 'c9', kind: 'wip', message: 'wip', hash: '0b47d2f', time: '36m', squashInto: 'c10' },
  {
    id: 'c10',
    kind: 'commit',
    message: 'Read session expiry from the token',
    hash: '1f8e3b6',
    time: '40m',
    extra: 1,
  },
  {
    id: 'c11',
    kind: 'base',
    message: 'Bump next to 16.3',
    hash: '9c2d4a1',
    time: '3h',
    branchPill: 'main',
  },
]

/** @type {import('./types').CommitRow[]} */
export const squashedCommits = [
  {
    id: 'c2',
    kind: 'commit',
    message: 'Add session refresh tests',
    hash: '686258a',
    time: '3m',
    extra: 1,
  },
  {
    id: 'c7',
    kind: 'commit',
    message: 'Refresh sessions near expiry',
    hash: 'cc6667b',
    time: '25m',
    extra: 3,
  },
  {
    id: 'c10',
    kind: 'commit',
    message: 'Read session expiry from the token',
    hash: 'dd921ed',
    time: '40m',
    extra: 1,
  },
  {
    id: 'c11',
    kind: 'base',
    message: 'Bump next to 16.3',
    hash: '9c2d4a1',
    time: '3h',
    branchPill: 'main',
  },
]

export const fixupCount = 7
export const prNumber = 491
export const prTitle = 'Refresh sessions near expiry'