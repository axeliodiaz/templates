#!/usr/bin/env node
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { MARGIN_BS6_IA } from './margin-bs6-ia.mjs'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const configPath = path.join(root, '.vitepress/config.mts')
let config = fs.readFileSync(configPath, 'utf8')

function sectionBlock(key, block) {
  const area = key === 'gettingStarted' ? 'getting-started' : key
  const items = block.pages.map(([slug, title, isIndex]) => {
    const linkSlug = isIndex ? (slug === 'introduction' ? '' : slug) : slug
    const link =
      linkSlug === ''
        ? `/margin/${area}/`
        : isIndex && slug !== 'introduction'
          ? `/margin/${area}/`
          : `/margin/${area}/${linkSlug}`
    return `          { text: '${title.replace(/'/g, "\\'")}', link: '${link}' },`
  })
  return `        { text: '${block.title}', collapsed: true, link: '${block.link}', items: [\n${items.join('\n')}\n        ]},`
}

const bsBlocks = Object.entries(MARGIN_BS6_IA).map(([k, b]) => sectionBlock(k, b))

const marginSidebar = `      '/margin': [
        { text: 'Run observation', items: [{ text: 'Agent orchestration', link: '/margin/agent-orchestration' }, { text: 'Agent crew', link: '/margin/agent-crew' }, { text: 'Payment ticket', link: '/margin/payment-ticket' }, { text: 'Squash → force push', link: '/margin/squash-force-push' }] },
        { text: 'Margin', items: [{ text: 'Overview', link: '/margin' }, { text: 'Analytics', link: '/margin/analytics' }, { text: 'Transactional emails', link: '/margin/correos' }] },
${bsBlocks.join('\n')}
        { text: 'Patterns', collapsed: true, link: '/margin/patterns/', items: [
          { text: 'Overview', link: '/margin/patterns/' },
          { text: 'KPI', link: '/margin/patterns/kpi' },
          { text: 'Waterfall', link: '/margin/patterns/waterfall' },
          { text: 'Profit bridge', link: '/margin/patterns/profit-bridge' },
          { text: 'Swarm plot', link: '/margin/patterns/swarm' },
          { text: 'Heatmap', link: '/margin/patterns/heatmap' },
          { text: 'Week bars', link: '/margin/patterns/week-bars' },
          { text: 'Forecast', link: '/margin/patterns/forecast' },
          { text: 'Insight card', link: '/margin/patterns/insight' },
        ]},
        { text: 'Modules', collapsed: true, link: '/margin/modules/', items: [
          { text: 'Overview', link: '/margin/modules/' },
          { text: 'Sidebar', link: '/margin/modules/sidebar' },
          { text: 'Top bar', link: '/margin/modules/topbar' },
          { text: 'Tables', link: '/margin/modules/tables' },
          { text: 'Dialog', link: '/margin/modules/dialog' },
          { text: 'Empty and loading', link: '/margin/modules/empty-loading' },
          { text: 'FAQ', link: '/margin/modules/faq' },
          { text: 'Avatars', link: '/margin/modules/avatars' },
          { text: 'Agent orchestration', link: '/margin/modules/agent-orchestration' },
          { text: 'Agent crew', link: '/margin/modules/agent-crew' },
          { text: 'Payment ticket', link: '/margin/modules/payment-ticket' },
          { text: 'Drawer', link: '/margin/modules/drawer' },
          { text: 'Emails', link: '/margin/modules/emails' },
        ]},
      ],`

config = config.replace(/      '\/margin': \[[\s\S]*?      \],\n      '\/evertrue':/, `${marginSidebar}\n      '/evertrue':`)
fs.writeFileSync(configPath, config)
console.log('Patched margin sidebar in config.mts')