import fs from 'node:fs'
import path from 'node:path'

const root = path.resolve(import.meta.dirname, '..')
const inventory = JSON.parse(fs.readFileSync(path.join(root, '.vitepress/theme/agent-toasts/inventory.json'), 'utf8'))

const portadaFiles = {
  Assay: 'assay.md',
  Felix: 'felix/index.md',
  Meadow: 'home-care.md',
  Margin: 'margin.md',
  Evertrue: 'evertrue.md',
  Sentinel: 'agent-security.md',
  Brief: 'agent-onboarding.md',
  Pace: 'fitness.md',
  Cargo: 'trade-finance.md',
  'Trial journey': 'trial-journey.md',
  Relay: 'relay.md',
  Folio: 'folio.md',
  Spark: 'spark.md',
  Bastion: 'bastion.md',
  Lustro: 'lustro.md',
  PulseFit: 'pulsefit.md',
  Scopecraft: 'scopecraft.md',
  Lumen: 'lumen.md',
  Pawprint: 'pawprint.md',
  Umail: 'umail.md',
  Fixtrack: 'fixtrack.md',
  Crestway: 'crestway-financials.md',
}

for (const item of inventory) {
  const rel = portadaFiles[item.name]
  if (!rel) continue
  const file = path.join(root, rel)
  if (!fs.existsSync(file)) {
    console.warn('missing', rel)
    continue
  }
  const folder = item.route.replace(/\/agent-toasts$/, '')
  const line = `\n[Open the ${item.name} agent toasts demo](${item.route}) for synthetic agent results as toasts with a data graphic, in-place retry and a collapsible stack in this template language.\n`
  let text = fs.readFileSync(file, 'utf8')
  if (text.includes('/agent-toasts')) continue
  const anchor = '## Agent crew'
  if (!text.includes(anchor)) {
    text += `\n## Agent toasts\n${line}`
  } else {
    const idx = text.indexOf(anchor)
    const next = text.indexOf('\n## ', idx + anchor.length)
    const insertAt = next === -1 ? text.length : next
    text = text.slice(0, insertAt) + `\n## Agent toasts\n${line}` + text.slice(insertAt)
  }
  fs.writeFileSync(file, text)
  console.log('updated', rel)
}