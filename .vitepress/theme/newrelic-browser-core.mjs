import options from './newrelic-browser-options.json' with { type: 'json' }

let started = false

/** @returns {typeof options} */
export function getNewRelicBrowserOptions() {
  return options
}

/**
 * @param {() => Promise<{ BrowserAgent: new (opts: typeof options) => unknown }>} loadAgent
 */
export async function initNewRelicBrowser(loadAgent) {
  if (started) {
    return { status: 'skipped-already-started' }
  }
  started = true
  try {
    const { BrowserAgent } = await loadAgent()
    new BrowserAgent(options)
    return { status: 'started' }
  } catch {
    return { status: 'failed-open' }
  }
}

/** @internal test-only */
export function resetNewRelicBrowserForTests() {
  started = false
}
