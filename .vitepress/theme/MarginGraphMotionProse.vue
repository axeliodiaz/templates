<script setup lang="ts">
import { computed } from 'vue'
import { MARGIN_GRAPH_MOTION_MD } from './margin-graphs-prose'

function renderSimpleMd(src: string) {
  let html = src
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
  html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>')
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>')
  const lines = html.split('\n')
  const out: string[] = []
  let tableRows: string[] = []
  let listItems: string[] = []
  const flushTable = () => {
    if (tableRows.length) {
      out.push(`<table><tbody>${tableRows.join('')}</tbody></table>`)
      tableRows = []
    }
  }
  const flushList = () => {
    if (listItems.length) {
      out.push(`<ul>${listItems.join('')}</ul>`)
      listItems = []
    }
  }
  for (const line of lines) {
    if (line.startsWith('|')) {
      flushList()
      if (line.includes('---')) continue
      const cells = line
        .split('|')
        .slice(1, -1)
        .map((c) => c.trim())
      tableRows.push(`<tr>${cells.map((c) => `<td>${c}</td>`).join('')}</tr>`)
      continue
    }
    if (line.startsWith('- ')) {
      flushTable()
      listItems.push(`<li>${line.slice(2)}</li>`)
      continue
    }
    flushTable()
    flushList()
    if (line.startsWith('<h3>')) out.push(line)
    else if (line.trim()) out.push(`<p>${line}</p>`)
  }
  flushTable()
  flushList()
  html = out.join('\n')
  html = html.replace(/```css\n([\s\S]*?)```/g, '<pre><code>$1</code></pre>')
  return html
}

const rendered = computed(() => renderSimpleMd(MARGIN_GRAPH_MOTION_MD.replace(/^## Motion\n\n/, '')))
</script>
<template>
  <div class="margin-graph-motion-prose" v-html="rendered" />
</template>