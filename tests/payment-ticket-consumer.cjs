const { chromium } = require('playwright')
const { spawn } = require('node:child_process')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')

const root = path.resolve(__dirname, '..')
const fixture = path.join(root, 'ticket-review-fixture.md')
const FIXTURE = `<script setup>
import { ref } from 'vue'
import PaymentTicket from './.vitepress/theme/payment-ticket/PaymentTicket.vue'
import { sampleFailed, samplePaid } from './.vitepress/theme/payment-ticket/ticket.sample'
const data = ref(sampleFailed())
const show = ref(true)
const mode = ref('error')
async function act() {
  if (mode.value === 'reject') throw Error('Consumer denied')
  return { state: mode.value, message: 'Consumer error' }
}
</script>
<button id="reject" @click="mode='reject';data=sampleFailed()">Reject</button>
<button id="ack" @click="mode='ack';data=sampleFailed()">Ack</button>
<button id="paid" @click="data=samplePaid()">Paid data</button>
<button id="unmount" @click="show=false">Unmount</button>
<PaymentTicket v-if="show" :data="data" :act="act" :torn="true" />
`

;(async () => {
  fs.writeFileSync(fixture, FIXTURE)
  const server = spawn(path.join(root, 'node_modules/.bin/vitepress'), ['dev', root, '--host', '127.0.0.1', '--port', '4394'], { stdio: 'ignore' })
  let browser
  try {
    for (let i = 0; i < 100; i++) {
      try {
        if ((await fetch('http://127.0.0.1:4394/ticket-review-fixture')).ok) break
      } catch {}
      await new Promise(r => setTimeout(r, 200))
      if (i === 99) throw new Error('Server failed')
    }
    browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || '/usr/bin/google-chrome', args: ['--no-sandbox'] })
    const page = await browser.newPage()
    const errors = []
    page.on('pageerror', e => errors.push(e.message))
    await page.goto('http://127.0.0.1:4394/ticket-review-fixture', { waitUntil: 'networkidle' })
    const host = page.locator('.ticket')
    await host.getByRole('button', { name: 'Try again' }).click()
    await page.waitForTimeout(1700)
    assert.match(await host.innerText(), /didn’t go through/)
    await page.locator('#reject').click()
    await host.getByRole('button', { name: 'Try again' }).click()
    await page.waitForTimeout(100)
    assert.match(await host.innerText(), /didn’t go through/)
    await page.locator('#ack').click()
    await host.getByRole('button', { name: 'Try again' }).click()
    await page.waitForTimeout(1600)
    assert.match(await host.innerText(), /Confirming payment/)
    await page.locator('#paid').click()
    await page.waitForTimeout(400)
    assert.match(await host.locator('.ticket__live').innerText(), /Payment confirmed/)
    assert.equal(await host.getByRole('button', { name: 'Reattach stub' }).count(), 1)
    await host.getByRole('button', { name: 'Auto-explore', exact: true }).click()
    await page.locator('#unmount').click()
    await page.waitForTimeout(2300)
    assert.equal(await host.count(), 0)
    assert.deepEqual(errors, [])
    console.log('PASS consumer error/rejection/ack, data-paid, torn, unmount')
  } finally {
    await browser?.close()
    server.kill()
    await new Promise(r => server.on('exit', r))
    fs.rmSync(fixture, { force: true })
  }
})().catch(e => { console.error(e); process.exitCode = 1 })