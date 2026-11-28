import { freshModel } from './lifecycle-data.mjs'

export const GALLERY_STATES = [
  { id: 'loading', title: 'Loading', code: '<MarginPrLifecycle state="loading" :motion="false" :autoplay="false" />' },
  { id: 'empty', title: 'Empty', code: '<MarginPrLifecycle state="empty" :motion="false" :autoplay="false" />' },
  { id: 'draft', title: 'Draft', code: '<MarginPrLifecycle state="draft" :motion="false" :autoplay="false" />' },
  { id: 'checks-running', title: 'Checks running', open: 'checks', code: '<MarginPrLifecycle state="checks-running" open="checks" :motion="false" :autoplay="false" />' },
  { id: 'checks-failed', title: 'Checks failed', open: 'checks', code: '<MarginPrLifecycle state="checks-failed" open="checks" :motion="false" :autoplay="false" />' },
  { id: 'changes-requested', title: 'Changes requested', open: 'resolve', code: '<MarginPrLifecycle state="changes-requested" open="resolve" :motion="false" :autoplay="false" />' },
  { id: 'approval-blocked', title: 'Approval blocked', open: 'approvals', code: '<MarginPrLifecycle state="approval-blocked" open="approvals" :motion="false" :autoplay="false" />' },
  { id: 'ready', title: 'Ready to merge', code: '<MarginPrLifecycle state="ready" :motion="false" :autoplay="false" />' },
  { id: 'merged', title: 'Merged', code: '<MarginPrLifecycle state="merged" :motion="false" :autoplay="false" />' },
  { id: 'error', title: 'Error', code: '<MarginPrLifecycle state="error" :motion="false" :autoplay="false" />' },
  { id: 'closed', title: 'Closed', code: '<MarginPrLifecycle state="closed" :motion="false" :autoplay="false" />' },
]

export const MOBILE_GALLERY = [
  { id: 'approval-blocked', title: 'Approval blocked (closed panel)', open: '' },
  { id: 'changes-requested', title: 'Changes requested (resolve open)', open: 'resolve' },
  { id: 'checks-failed', title: 'Checks failed', open: 'checks' },
]

function blockedPreset() {
  const M = freshModel()
  M.phases = {
    draft: 'done',
    checks: 'done',
    review: 'done',
    resolve: 'done',
    approvals: 'blocked',
    ready: 'pending',
    merged: 'pending',
  }
  M.checksPassed = 6
  M.approvalsHave = 1
  M.fixCount = 1
  M.changesCount = 1
  M.loopFixHist = true
  M.loopChgHist = true
  return M
}

/** @param {string} state */
export function lifecycleStatePreset(state, { open } = {}) {
  const base = freshModel()
  switch (state) {
    case 'loading':
      return { mode: 'loading', model: { ...base, view: 'loading' }, open: null }
    case 'empty':
      return { mode: 'empty', model: { ...base, view: 'empty' }, open: null }
    case 'error': {
      const m = blockedPreset()
      m.view = 'error'
      return { mode: 'error', model: m, open: open ?? 'approvals' }
    }
    case 'closed': {
      const m = freshModel()
      m.phases = {
        draft: 'done',
        checks: 'done',
        review: 'active',
        resolve: 'pending',
        approvals: 'pending',
        ready: 'pending',
        merged: 'pending',
      }
      m.checksPassed = 6
      m.closed = true
      return { mode: 'closed', model: m, open: null }
    }
    case 'draft':
      return { mode: 'static', model: base, open: open ?? null }
    case 'checks-running': {
      const m = freshModel()
      m.phases.draft = 'done'
      m.phases.checks = 'active'
      m.checksPassed = 2
      return { mode: 'static', model: m, open: open ?? 'checks' }
    }
    case 'checks-failed': {
      const m = freshModel()
      m.phases.draft = 'done'
      m.phases.checks = 'failed'
      m.checksPassed = 4
      m.failIdx = 4
      m.fixCount = 1
      m.loopFixHist = true
      m.loopFixFly = false
      return { mode: 'static', model: m, open: open ?? 'checks' }
    }
    case 'changes-requested': {
      const m = freshModel()
      m.phases = {
        draft: 'done',
        checks: 'done',
        review: 'blocked',
        resolve: 'active',
        approvals: 'pending',
        ready: 'pending',
        merged: 'pending',
      }
      m.checksPassed = 6
      m.openThreads = 2
      m.changesCount = 1
      m.fixCount = 1
      m.loopChgDown = true
      m.loopChgHist = true
      m.loopFixHist = true
      return { mode: 'static', model: m, open: open ?? 'resolve' }
    }
    case 'approval-blocked': {
      const m = blockedPreset()
      return { mode: 'static', model: m, open: open ?? 'approvals' }
    }
    case 'ready': {
      const m = blockedPreset()
      m.phases.approvals = 'done'
      m.phases.ready = 'active'
      m.approvalsHave = 2
      return { mode: 'static', model: m, open: open ?? null }
    }
    case 'merged': {
      const m = blockedPreset()
      m.phases.approvals = 'done'
      m.phases.ready = 'done'
      m.phases.merged = 'done'
      m.approvalsHave = 2
      return { mode: 'static', model: m, open: open ?? null }
    }
    default:
      return { mode: 'live', model: base, open: null }
  }
}