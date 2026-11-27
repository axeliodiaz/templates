export const CI_CHECKS = [
  { id: 'build', name: 'Build', duration: '1m 12s' },
  { id: 'lint', name: 'Lint', duration: '24s' },
  { id: 'typecheck', name: 'Typecheck', duration: '38s' },
  { id: 'unit', name: 'Unit tests', duration: '52s' },
  { id: 'e2e', name: 'E2E tests', duration: '3m 04s' },
  { id: 'vercel', name: 'Vercel Preview', duration: '1m 48s' },
]

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