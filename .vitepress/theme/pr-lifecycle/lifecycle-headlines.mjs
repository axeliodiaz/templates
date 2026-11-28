import { PHASES, PR_META } from './lifecycle-data.mjs'

const SW = {
  pending: 'Pending',
  active: 'In progress',
  done: 'Done',
  blocked: 'Blocked',
  failed: 'Failed',
  skipped: 'Not needed',
  stopped: 'Stopped',
}

export function phaseSub(id, M) {
  const s = M.phases[id]
  switch (id) {
    case 'draft':
      return M.fixCount > 0 ? `Round ${M.fixCount + 1}` : '4 commits'
    case 'checks':
      if (s === 'failed') return '1 failed'
      if (s === 'pending') return '6 checks'
      return `${M.checksPassed}/6 passed`
    case 'review':
      if (s === 'blocked') return 'Changes requested'
      if (s === 'active') return 'In review'
      if (s === 'done') return 'Reviewed'
      return '2 reviewers'
    case 'resolve':
      if (s === 'skipped') return 'Not needed'
      if (s === 'active') return `${M.openThreads} open`
      if (s === 'done') return 'All resolved'
      return 'If needed'
    case 'approvals':
      if (s === 'blocked') return `${M.approvalsHave} of 2 · needs 1 more`
      if (s === 'pending') return '2 required'
      return `${M.approvalsHave} of 2`
    case 'ready':
      if (s === 'active') return 'No conflicts'
      if (s === 'done') return 'Mergeable'
      return '—'
    case 'merged':
      return s === 'done' ? PR_META.mergeCommit : '—'
    default:
      return ''
  }
}

function focusPhase(M) {
  const spine = ['draft', 'checks', 'review', 'resolve', 'approvals', 'ready', 'merged']
  for (const k of ['failed', 'blocked']) {
    for (const id of spine) if (M.phases[id] === k) return id
  }
  for (const id of spine) if (M.phases[id] === 'active') return id
  for (const id of [...spine].reverse()) if (M.phases[id] === 'done') return id
  return 'draft'
}

export function headlineFor(M) {
  const f = focusPhase(M)
  const s = M.phases[f]
  const label = PHASES.find((p) => p.id === f)?.label ?? f
  if (M.closed) {
    return {
      tone: 'closed',
      chip: 'Closed',
      h1: 'Closed without merging',
      h2: `Stopped at ${label} · reopen to continue`,
    }
  }
  if (M.phases.merged === 'done') {
    return {
      tone: 'merged',
      chip: 'Merged',
      h1: 'Merged into main',
      h2: `Squash and merge · ${PR_META.mergeCommit} · branch deleted`,
    }
  }
  if (M.phases.ready === 'active') {
    return {
      tone: 'ready',
      chip: 'Ready to merge',
      h1: 'Ready to merge',
      h2: 'All required checks and approvals are in · no conflicts',
    }
  }
  if (s === 'failed') {
    return {
      tone: 'failed',
      chip: 'Failed',
      h1: 'Checks failed — fix and push',
      h2: `E2E tests failed after 3m 04s · sent back to Draft ×${M.fixCount}`,
    }
  }
  if (f === 'review' && s === 'blocked') {
    return {
      tone: 'blocked',
      chip: 'Blocked',
      h1: 'Changes requested',
      h2: `${M.changesCount} round${M.changesCount === 1 ? '' : 's'} · resolve the open threads`,
    }
  }
  if (s === 'blocked' && f === 'approvals') {
    return {
      tone: 'blocked',
      chip: 'Blocked',
      h1: 'Waiting on 1 more approval',
      h2: '@ana (code owner) hasn’t reviewed yet',
    }
  }
  if (f === 'draft') {
    return {
      tone: 'draft',
      chip: 'Draft',
      h1: 'Draft — not ready for review',
      h2: M.fixCount ? `Fix pushed · round ${M.fixCount + 1}` : '4 commits · opened 3h ago',
    }
  }
  if (f === 'checks') {
    return {
      tone: 'active',
      chip: 'In progress',
      h1: 'Running checks',
      h2: `${M.checksPassed} of 6 passed`,
    }
  }
  if (f === 'review') {
    return {
      tone: 'active',
      chip: 'In progress',
      h1: 'In review',
      h2: 'Waiting on @ana and @sam',
    }
  }
  if (f === 'resolve') {
    return {
      tone: 'active',
      chip: 'In progress',
      h1: `Resolving ${M.openThreads} open thread${M.openThreads === 1 ? '' : 's'}`,
      h2: `Round ${M.changesCount}`,
    }
  }
  if (f === 'approvals') {
    return {
      tone: 'active',
      chip: 'In progress',
      h1: `Approvals ${M.approvalsHave} of 2`,
      h2: 'Required by CODEOWNERS',
    }
  }
  return { tone: 'active', chip: 'In progress', h1: 'In progress', h2: '' }
}

export function ariaLabelFor(phase, M) {
  const st = M.phases[phase.id]
  const step =
    phase.rework
      ? 'Optional rework step'
      : `Step ${phase.step} of 6`
  return `${phase.label}. ${step}. ${SW[st] || st}. ${phaseSub(phase.id, M)}.`
}

export { SW }