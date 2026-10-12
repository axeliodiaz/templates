import { initNewRelicBrowser as initCore } from './newrelic-browser-core.mjs'

let initPromise: Promise<void> | null = null

export function initNewRelicBrowser(): Promise<void> {
  if (typeof window === 'undefined') {
    return Promise.resolve()
  }
  if (!initPromise) {
    initPromise = initCore(() =>
      import('@newrelic/browser-agent/loaders/browser-agent')
    ).then(() => undefined)
  }
  return initPromise
}
