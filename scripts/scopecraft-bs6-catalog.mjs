/**
 * Build ScopecraftBs6Catalog.vue from ComponentCatalog.vue with Bootstrap 6 markup.
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const src = path.join(root, '.vitepress/theme/ComponentCatalog.vue')
const out = path.join(root, '.vitepress/theme/ScopecraftBs6Catalog.vue')

let s = fs.readFileSync(src, 'utf8')

s = s.replace(
  'const props=defineProps({language:{default:"lustro"}})',
  'const props=defineProps({language:{default:"scopecraft"}})'
)

s = s.replace(
  '<div class="kit" :class="\'kit-\'+language">',
  '<div class="sc-bs6-root kit kit-scopecraft" data-bs-theme="light">'
)

const pairs = [
  ['class="l-btn l-primary"', 'class="btn-solid theme-primary"'],
  ['class="l-btn l-secondary"', 'class="btn-outline theme-secondary"'],
  ['class="l-btn l-quiet"', 'class="btn-link"'],
  ['class="l-btn l-danger"', 'class="btn-solid theme-danger"'],
  ['class="l-btn l-secondary"', 'class="btn-outline theme-secondary"'],
  ['class="l-badge"', 'class="badge text-bg-secondary"'],
  ['class="l-badge l-badge-success"', 'class="badge text-bg-success"'],
  ['class="l-badge l-badge-warn"', 'class="badge text-bg-warning"'],
  ['class="l-badge l-badge-error"', 'class="badge text-bg-danger"'],
  ['class="l-alert l-alert-warn"', 'class="alert theme-warning d-flex align-items-start gap-2"'],
  ['class="l-alert l-alert-success"', 'class="alert theme-success"'],
  ['class="l-spinner"', 'class="spinner-border spinner-border-sm"'],
  ['class="l-skeleton"', 'class="placeholder col-12"'],
  ['class="l-card"', 'class="card"'],
  ['class="l-table"', 'class="table table-striped"'],
  ['class="l-empty"', 'class="card text-center p-4"'],
  ['<progress id="sample-progress"', '<div class="progress" role="progressbar" aria-valuenow="68" aria-valuemin="0" aria-valuemax="100"><div class="progress-bar" style="width:68%"></div></div><progress id="sample-progress" hidden'],
]

for (const [from, to] of pairs) {
  s = s.split(from).join(to)
}

s = s.replace(
  "import { onBeforeUnmount } from 'vue'",
  "import { onBeforeUnmount, onMounted } from 'vue'\nimport { initScopecraftBs6 } from './scopecraft-bs6-live'\nonMounted(() => initScopecraftBs6())"
)

fs.writeFileSync(out, s)
console.log('Wrote', out)
