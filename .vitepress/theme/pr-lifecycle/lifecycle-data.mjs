/** Synthetic PR #491 — continues Squash force push storyline. */

export const PR_META = {
  number: 491,
  title: 'Refresh sessions near expiry',
  head: 'feat/session-refresh',
  base: 'main',
  author: '@luis',
  mergeCommit: 'a41c9e2',
}

export const CHECKS = [
  { name: 'Build', duration: '1m 12s' },
  { name: 'Lint', duration: '24s' },
  { name: 'Typecheck', duration: '38s' },
  { name: 'Unit tests', duration: '52s' },
  { name: 'E2E tests', duration: '3m 04s' },
  { name: 'Vercel Preview', duration: '1m 48s' },
]

export const REVIEWERS = [
  { handle: '@ana', role: 'code owner' },
  { handle: '@sam', role: '' },
]

export const THREADS = [
  { loc: 'src/session.ts:42', preview: 'Use the token expiry, not Date.now()' },
  { loc: 'src/refresh.ts:18', preview: 'Extract the 30s skew into a constant' },
  { loc: 'tests/session.test.ts:7', preview: 'Cover the expired-token path' },
]

export const PHASES = [
  { id: 'draft', label: 'Draft', step: 1 },
  { id: 'checks', label: 'Checks', step: 2 },
  { id: 'review', label: 'Review', step: 3 },
  { id: 'resolve', label: 'Resolve comments', step: null, rework: true },
  { id: 'approvals', label: 'Approvals', step: 4 },
  { id: 'ready', label: 'Ready to merge', step: 5 },
  { id: 'merged', label: 'Merged', step: 6 },
]

export const SPINE = ['draft', 'checks', 'review', 'approvals', 'ready', 'merged']

export function freshModel() {
  return {
    view: 'ready',
    closed: false,
    phases: {
      draft: 'active',
      checks: 'pending',
      review: 'pending',
      resolve: 'pending',
      approvals: 'pending',
      ready: 'pending',
      merged: 'pending',
    },
    checksPassed: 0,
    failIdx: -1,
    openThreads: 0,
    approvalsHave: 0,
    fixCount: 0,
    changesCount: 0,
    loopFixLit: false,
    loopFixHist: false,
    loopFixFly: false,
    loopChgDown: false,
    loopChgUp: false,
    loopChgHist: false,
    loopChgFly: false,
    drainDraftConn: false,
    downstreamDrain: false,
    flashId: null,
    flashKind: null,
    changedId: null,
  }
}