import { freshModel, GALLERY_STATES, MOBILE_GALLERY } from './lifecycle-definition.mjs'

export { GALLERY_STATES, MOBILE_GALLERY }

function applyPatch(model, patch) {
  if (!patch) return
  const p = { ...patch }
  if (p.phases && typeof p.phases === 'object') {
    Object.assign(model.phases, p.phases)
    delete p.phases
  }
  for (const [k, v] of Object.entries(p)) {
    if (k.startsWith('phases.')) model.phases[k.slice(7)] = v
    else model[k] = v
  }
}

/** @param {string} state */
export function lifecycleStatePreset(state, { open } = {}) {
  const base = freshModel()
  const row = GALLERY_STATES.find((g) => g.id === state)
  if (!row) return { mode: 'live', model: base, open: null }

  const model = structuredClone(base)
  if (row.view) model.view = row.view
  applyPatch(model, row.patch ? structuredClone(row.patch) : null)

  let mode = 'static'
  if (row.view === 'loading') mode = 'loading'
  else if (row.view === 'empty') mode = 'empty'
  else if (row.view === 'error') mode = 'error'
  else if (state === 'closed') mode = 'closed'

  const openId = open !== undefined ? open : row.open ?? null
  return { mode, model, open: openId === '' ? null : openId }
}