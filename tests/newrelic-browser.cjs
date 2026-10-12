const { test } = require('node:test')
const assert = require('node:assert/strict')
const path = require('path')

const corePath = path.join(__dirname, '../.vitepress/theme/newrelic-browser-core.mjs')
const optionsPath = path.join(__dirname, '../.vitepress/theme/newrelic-browser-options.json')

async function loadCore() {
  return import(corePath)
}

test('New Relic browser options preserve privacy and tracing flags', async () => {
  const options = require(optionsPath)
  assert.equal(options.init.session_replay.enabled, false)
  assert.equal(options.init.session_trace.enabled, false)
  assert.equal(options.init.privacy.cookies_enabled, false)
  assert.equal(options.init.distributed_tracing.enabled, false)
  assert.equal(options.init.browser_consent_mode.enabled, false)
  assert.equal(options.init.performance.capture_detail, false)
  assert.equal(options.init.performance.capture_marks, false)
  assert.equal(options.init.performance.capture_measures, true)
  assert.deepEqual(options.init.ajax.deny_list, ['bam.nr-data.net'])
  assert.equal(options.info.applicationID, '1103549827')
  assert.equal(options.loader_config.accountID, '8612973')
})

test('initNewRelicBrowser initializes once and fail-opens on loader errors', async () => {
  const core = await loadCore()
  core.resetNewRelicBrowserForTests()
  let calls = 0
  const loadAgent = async () => {
    calls += 1
    throw new Error('mock loader failure')
  }

  const first = await core.initNewRelicBrowser(loadAgent)
  const second = await core.initNewRelicBrowser(loadAgent)

  assert.equal(first.status, 'failed-open')
  assert.equal(second.status, 'skipped-already-started')
  assert.equal(calls, 1)
})

test('initNewRelicBrowser passes exact options to BrowserAgent', async () => {
  const core = await loadCore()
  core.resetNewRelicBrowserForTests()

  const seen = []
  const loadAgent = async () => ({
    BrowserAgent: class {
      constructor(opts) {
        seen.push(opts)
      }
    }
  })

  const result = await core.initNewRelicBrowser(loadAgent)
  assert.equal(result.status, 'started')
  assert.equal(seen.length, 1)
  assert.deepEqual(seen[0], require(optionsPath))
})
