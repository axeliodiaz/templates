import def from './pr-lifecycle.json'

const meta = def.meta

function dig(o, path) {
  if (!path) return undefined
  return path.split('.').reduce((a, k) => (a == null ? undefined : a[k]), o)
}

function tpl(s, ctx) {
  if (s == null) return ''
  return String(s).replace(/\{([^}]+)\}/g, (_, raw) => {
    const key = raw.trim()
    if (key === 'meta.mergeCommit') return meta.mergeCommit
    if (key === 'meta.head') return meta.head
    if (key === 'meta.author') return meta.author
    if (key === 'meta.number') return String(meta.number)
    if (key === 'meta.title') return meta.title
    if (key === 'm.fixCount_plus_1') return String(ctx.m.fixCount + 1)
    if (key === 'threads.resolvedCount') return String(3 - ctx.m.openThreads)
    if (key === 'merged.branchTail') {
      return ctx.phaseState('merged') === 'done' ? 'Deleted' : '—'
    }
    if (key.startsWith('m.')) return String(dig(ctx.m, key.slice(2)) ?? '')
    if (key.startsWith('focus.')) return String(ctx.focus?.[key.slice(6)] ?? '')
    return ctx[key] ?? ''
  })
}

function matchIf(cond, ctx) {
  if (!cond) return true
  for (const [k, v] of Object.entries(cond)) {
    if (k === 'state') {
      if (ctx.state !== v) return false
      continue
    }
    if (k === 'm.closed') {
      if (Boolean(ctx.m.closed) !== Boolean(v)) return false
      continue
    }
    if (k === 'm.fixCount_gt') {
      if (!(ctx.m.fixCount > v)) return false
      continue
    }
    if (k === 'm.approvalsHave_gt') {
      if (!(ctx.m.approvalsHave > v)) return false
      continue
    }
    if (k.startsWith('focus.')) {
      const fk = k.slice(6)
      const [a, b] = fk.split('.')
      if (a === 'id' && ctx.focusId !== b) return false
      if (a === 'state' && ctx.focusState !== b) return false
      continue
    }
    if (k.startsWith('phase.')) {
      const [, pid, st] = k.match(/^phase\.(\w+)\.state$/) || []
      if (pid && ctx.m.phases[pid] !== st) return false
      continue
    }
  }
  return true
}

export function focusPhaseId(M) {
  const spine = def.focusOrder
  for (const k of ['failed', 'blocked']) {
    for (const id of spine) if (M.phases[id] === k) return id
  }
  for (const id of spine) if (M.phases[id] === 'active') return id
  for (const id of [...spine].reverse()) if (M.phases[id] === 'done') return id
  return 'draft'
}

export function phaseMetric(phaseId, M) {
  const state = M.closed && ['pending', 'active'].includes(M.phases[phaseId]) ? 'stopped' : M.phases[phaseId]
  const rules = def.metrics[phaseId] || []
  const ctx = { m: M, state }
  for (const r of rules) {
    if (matchIf(r.if, ctx)) return tpl(r.text, { m: M, state, phaseState: () => state })
  }
  return ''
}

export function headlineFor(M) {
  const focusId = focusPhaseId(M)
  const focusState = M.phases[focusId]
  const focusLabel = def.phases.find((p) => p.id === focusId)?.label ?? focusId
  const ctx = {
    m: M,
    focusId,
    focusState,
    focus: { id: focusId, state: focusState, label: focusLabel },
    phaseState: (id) => M.phases[id],
  }
  for (const rule of def.headlines) {
    if (!matchIf(rule.if, ctx)) continue
    let h2 = rule.h2
    if (rule.h2Choices) {
      for (const c of rule.h2Choices) {
        if (matchIf(c.if, ctx)) {
          h2 = c.text
          break
        }
      }
    }
    return {
      tone: rule.tone,
      chip: rule.chip,
      h1: tpl(rule.h1, ctx),
      h2: tpl(h2 ?? '', ctx),
    }
  }
  return { tone: 'active', chip: 'In progress', h1: 'In progress', h2: '' }
}

export function ariaLabelFor(phase, M) {
  const st = M.phases[phase.id]
  const sw = def.stateLabels[st] || st
  const step = phase.rework ? 'Optional rework step' : `Step ${phase.step} of 6`
  return `${phase.label}. ${step}. ${sw}. ${phaseMetric(phase.id, M)}.`
}

function checkRowValue(i, item, M, phaseState) {
  const state = phaseState('checks')
  if (i < M.checksPassed) return item.duration
  if (state === 'failed' && i === M.failIdx) return `${item.duration} · failed`
  return '—'
}

export function resolvePanel(phaseId, M, phaseState) {
  const panel = def.panels[phaseId]
  if (!panel) return { stat: null, callouts: [], rows: [] }
  const state = phaseState(phaseId)
  const ctx = { m: M, state, meta, phaseState }

  const callouts = []
  if (panel.calloutBlocked && state === 'blocked') {
    if (phaseId === 'approvals') callouts.push({ kind: 'blocked', text: panel.calloutBlocked })
    if (phaseId === 'review') callouts.push({ kind: 'blocked', text: panel.calloutBlocked })
  }
  if (panel.calloutFailed && state === 'failed') {
    callouts.push({ kind: 'failed', text: panel.calloutFailed })
  }

  let stat = null
  if (panel.stat) stat = tpl(panel.stat, ctx)
  if (phaseId === 'resolve') {
    if (state === 'skipped') stat = panel.statSkipped
    else if (state !== 'pending') stat = tpl(panel.statActive, ctx)
  }

  if (panel.showWhenStateNotIn && panel.showWhenStateNotIn.includes(state)) {
    return { stat, callouts, rows: [] }
  }

  const rows = []
  if (panel.rowsFrom === 'checks') {
    for (let i = 0; i < def.datasets.checks.length; i++) {
      const c = def.datasets.checks[i]
      rows.push({
        kind: 'split',
        label: c.name,
        value: checkRowValue(i, c, M, phaseState),
      })
    }
  } else if (panel.rowsFrom === 'threads') {
    def.datasets.threads.forEach((t, k) => {
      rows.push({
        kind: 'full',
        text: `${t.loc} — ${t.preview} · ${k >= M.openThreads ? 'Resolved' : 'Open'}`,
      })
    })
  } else if (panel.rows) {
    const ps = phaseState(phaseId)
    for (const row of panel.rows) {
      if (row.if?.state != null) {
        rows.push({
          kind: 'full',
          text: ps === row.if.state ? row.text : row.elseText,
        })
        continue
      }
      if (row.kind === 'split') {
        let value = row.value
        if (row.valueIf) {
          if (row.valueIf.state != null) {
            value = ps === row.valueIf.state ? row.valueIf.then : row.valueIf.else
          } else if (row.valueIf.key === 'm.approvalsHave_gt') {
            value = M.approvalsHave > row.valueIf.n ? row.valueIf.then : row.valueIf.else
          }
        }
        value = tpl(value, ctx)
        if (row.valuePrefix) value = row.valuePrefix + value
        rows.push({ kind: 'split', label: tpl(row.label, ctx), value })
      } else if (row.kind === 'full') {
        rows.push({ kind: 'full', text: tpl(row.text, ctx) })
      }
    }
  }

  return { stat, callouts, rows }
}

export { def as LIFECYCLE_DEF, meta as PR_META }