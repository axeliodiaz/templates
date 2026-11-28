import def from './pr-lifecycle.json'

export const LIFECYCLE_DEF = def
export const PR_META = def.meta
export const PHASES = def.phases
export const SPINE = def.spine
export const CHECKS = def.datasets.checks
export const REVIEWERS = def.datasets.reviewers
export const THREADS = def.datasets.threads
export const LOOPS = def.loops
export const FOCUS_ORDER = def.focusOrder
export const AUTOPLAY_STEPS = def.autoplay.steps
export const GALLERY_STATES = def.galleryStates
export const MOBILE_GALLERY = def.mobileGalleryStates

const phaseIds = def.phases.map((p) => p.id)

export function freshModel() {
  const phases = Object.fromEntries(phaseIds.map((id) => [id, 'pending']))
  phases.draft = 'active'
  return {
    view: 'ready',
    closed: false,
    phases,
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

export function phaseById(id) {
  return def.phases.find((p) => p.id === id)
}

export function notchFor(id) {
  return phaseById(id)?.notchPercent ?? '50%'
}

export function gridColumnFor(id) {
  return phaseById(id)?.gridColumn ?? 1
}

export function loopById(id) {
  return def.loops.find((l) => l.id === id)
}