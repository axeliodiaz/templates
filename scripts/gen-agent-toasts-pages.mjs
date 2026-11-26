import fs from 'node:fs'
import path from 'node:path'

const root = path.resolve(import.meta.dirname, '..')
const inventory = JSON.parse(fs.readFileSync(path.join(root, '.vitepress/theme/agent-toasts/inventory.json'), 'utf8'))

const blurbs = {
  Assay: 'evaluation-lab neutrals and burnt orange accent',
  Felix: 'teal-forward product surfaces',
  Meadow: 'home-care blues on calm gray',
  Margin: 'finance-neutral surfaces and crisp indigo accent',
  Evertrue: 'cream terminal calm',
  Sentinel: 'security lab contrast',
  Brief: 'onboarding greens',
  Pace: 'fitness greens on soft mint',
  Cargo: 'trade-finance blues',
  'Trial journey': 'deep violet chart night',
  Relay: 'indigo workflow panels',
  Folio: 'folio sage trading tone',
  Spark: 'ember analytics warmth',
  Bastion: 'terminal green mono',
  Lustro: 'lustro glass paper on deep violet stage',
  PulseFit: 'wellness brass on neutral gray',
  Scopecraft: 'scope navy precision',
  Lumen: 'lumen violet clarity',
  Pawprint: 'pawprint friendly blue',
  Umail: 'Helvetica simplicity and classic blue',
  Fixtrack: 'field-service green',
  Crestway: 'crestway financial blue-gray',
}

for (const item of inventory) {
  const routePath = item.route.replace(/^\//, '')
  const dir = path.dirname(routePath)
  const file = path.join(root, dir, 'agent-toasts.md')
  const folder = item.source.split(';')[0].replace(/^\//, '')
  const link = item.source.includes(';') ? item.source.split(';')[0].trim() : item.source
  const char = blurbs[item.name] ?? 'template tokens'
  const body = `---
aside: false
sidebar: false
pageClass: atoast-page
---
<script setup>
import AgentToasts from '../.vitepress/theme/agent-toasts/AgentToasts.vue'
</script>

# Agent toasts (${item.name})

Agent results as compact toasts with a data graphic in the ${item.name} language: ${char}. Play the sequence, retry a failed deploy or compact the context in place.

<AgentToasts theme="${item.theme}" />

[Return to ${item.name}](${link}) · [Module contract, scope and theme inventory](/agent-toasts)

Synthetic demo. No agent, CI or deploy is connected. Use Play sequence to replay the reference flow, or the buttons to add one toast at a time.
`
  fs.mkdirSync(path.dirname(file), { recursive: true })
  fs.writeFileSync(file, body)
  console.log('wrote', file)
}