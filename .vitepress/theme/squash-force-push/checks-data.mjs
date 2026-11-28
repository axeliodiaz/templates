import { CI_CHECKS as CHECKS, SQUASH_DEF } from './squash-definition.mjs'

export const CI_CHECKS = CHECKS

/** @param {'running'|'passed'} phase */
export function checksForPhase(phase) {
  if (phase === 'passed') {
    return CI_CHECKS.map((c) => ({ ...c, status: 'passed' }))
  }
  return CI_CHECKS.map((c, i) => ({
    ...c,
    status: i < 3 ? 'passed' : 'running',
    duration: i < 3 ? c.duration : '…',
  }))
}

export { SQUASH_DEF }