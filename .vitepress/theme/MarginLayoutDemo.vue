<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useMarginPreviewDark } from './useMarginPreviewDark'

const props = defineProps<{ section: string }>()
const previewDark = useMarginPreviewDark()
const root = ref<HTMLElement | null>(null)
const previewW = ref(0)

const show = (id: string) => {
  if (!props.section || props.section === 'grid') return true
  if (props.section === 'columns') return ['columns', 'mixed', 'auto'].includes(id)
  if (props.section === 'gutters') return id === 'gutters'
  if (props.section === 'containers') return id === 'containers'
  if (props.section === 'breakpoints') return ['breakpoints', 'cq-note'].includes(id)
  if (props.section === 'css-grid') return id === 'css-grid'
  return props.section === id
}

const viewportBp = computed(() => {
  if (typeof window === 'undefined') return '—'
  const w = window.innerWidth
  if (w >= 1200) return 'xl'
  if (w >= 992) return 'lg'
  if (w >= 768) return 'md'
  if (w >= 576) return 'sm'
  return 'xs'
})

const containerBp = computed(() => {
  const w = previewW.value
  if (!w) return '—'
  if (w >= 992) return 'lg'
  if (w >= 768) return 'md'
  if (w >= 576) return 'sm'
  return 'xs'
})

let ro: ResizeObserver | null = null
let measure: (() => void) | null = null
onMounted(() => {
  const el = root.value?.closest('.mg-guide-preview') as HTMLElement | null
  if (!el) return
  measure = () => {
    previewW.value = Math.round(el.getBoundingClientRect().width)
  }
  measure()
  ro = new ResizeObserver(measure)
  ro.observe(el)
  window.addEventListener('resize', measure)
})
onUnmounted(() => {
  ro?.disconnect()
  if (measure) window.removeEventListener('resize', measure)
})
</script>
<template>
  <div
    ref="root"
    class="lab b2-bs6 b2-margin margin-bs6-root kit kit-margin margin-bs6-layout"
    :class="{ 'lab-dark': previewDark }"
  >
    <div class="mg-layout-bp" role="status" aria-live="polite">
      <span><strong>Viewport</strong> {{ viewportBp }} ({{ typeof window !== 'undefined' ? window.innerWidth : '—' }}px)</span>
      <span><strong>Preview</strong> {{ containerBp }} ({{ previewW || '—' }}px)</span>
      <span class="small">Grid classes use the <em>viewport</em>; <code class="mg-layout-bp-code">col-cq-*</code> uses the preview container.</span>
    </div>

    <h3 v-show="!section || section === 'grid'" class="mg-layout-block-title">Three columns (.col-md-4)</h3>
    <div v-show="!section || section === 'grid'" class="mg-layout-block">
      <div class="row g-2">
        <div class="col-md-4"><div class="mg-demo-item mg-demo-item--soft">.col-md-4</div></div>
        <div class="col-md-4"><div class="mg-demo-item mg-demo-item--soft">.col-md-4</div></div>
        <div class="col-md-4"><div class="mg-demo-item mg-demo-item--soft">.col-md-4</div></div>
      </div>
    </div>

    <h3 v-show="show('columns') && (!section || section === 'grid' || section === 'columns')" class="mg-layout-block-title">Equal-width columns</h3>
    <div v-show="show('columns')" class="mg-layout-block">
      <div class="row g-2">
        <div class="col"><div class="mg-demo-item mg-demo-item--soft">.col</div></div>
        <div class="col"><div class="mg-demo-item mg-demo-item--soft">.col</div></div>
        <div class="col"><div class="mg-demo-item mg-demo-item--soft">.col</div></div>
      </div>
    </div>

    <h3 v-show="!section || section === 'grid'" class="mg-layout-block-title">12-column ruler</h3>
    <div v-show="!section || section === 'grid'" class="mg-layout-block">
      <div class="row g-0">
        <div v-for="n in 12" :key="'r'+n" class="col-1">
          <div class="mg-demo-item mg-demo-item--accent">{{ n }}</div>
        </div>
      </div>
    </div>

    <h3 v-show="show('mixed')" class="mg-layout-block-title">Mixed widths</h3>
    <div v-show="show('mixed')" class="mg-layout-block vstack gap-2">
      <div class="row g-2">
        <div class="col-8"><div class="mg-demo-item">.col-8</div></div>
        <div class="col-4"><div class="mg-demo-item">.col-4</div></div>
      </div>
      <div class="row g-2">
        <div class="col-6"><div class="mg-demo-item">.col-6</div></div>
        <div class="col-6"><div class="mg-demo-item">.col-6</div></div>
      </div>
      <div class="row g-2">
        <div v-for="n in 4" :key="'q'+n" class="col-3">
          <div class="mg-demo-item">.col-3</div>
        </div>
      </div>
    </div>

    <h3 v-show="show('auto')" class="mg-layout-block-title">Auto layout</h3>
    <div v-show="show('auto')" class="mg-layout-block">
      <div class="row g-2">
        <div class="col"><div class="mg-demo-item">.col</div></div>
        <div class="col-auto"><div class="mg-demo-item">.col-auto</div></div>
        <div class="col"><div class="mg-demo-item">.col</div></div>
      </div>
    </div>

    <h3 v-show="show('breakpoints')" class="mg-layout-block-title">Responsive (.col-12 .col-md-6 .col-lg-3)</h3>
    <div v-show="show('breakpoints')" class="mg-layout-block">
      <p v-show="show('cq-note')" class="small text-body-secondary mb-2">Viewport ≥768px → two columns; ≥992px → four columns (may differ from preview width when the card is narrow).</p>
      <div class="row g-2">
        <div v-for="n in 4" :key="'resp'+n" class="col-12 col-md-6 col-lg-3">
          <div class="mg-demo-item mg-demo-item--soft">.col-12.col-md-6.col-lg-3</div>
        </div>
      </div>
    </div>

    <h3 v-show="!section || section === 'grid'" class="mg-layout-block-title">Row columns</h3>
    <div v-show="!section || section === 'grid'" class="mg-layout-block vstack gap-2">
      <div class="row row-cols-2 g-2">
        <div class="col"><div class="mg-demo-item">.row-cols-2</div></div>
        <div class="col"><div class="mg-demo-item">.row-cols-2</div></div>
        <div class="col"><div class="mg-demo-item">.row-cols-2</div></div>
      </div>
      <div class="row row-cols-md-3 g-2">
        <div v-for="n in 6" :key="'rc'+n" class="col">
          <div class="mg-demo-item">.row-cols-md-3</div>
        </div>
      </div>
    </div>

    <h3 v-show="!section || section === 'grid'" class="mg-layout-block-title">Offset</h3>
    <div v-show="!section || section === 'grid'" class="mg-layout-block">
      <div class="row g-2">
        <div class="col-md-4 offset-md-4"><div class="mg-demo-item">.col-md-4 .offset-md-4</div></div>
      </div>
    </div>

    <h3 v-show="!section || section === 'grid'" class="mg-layout-block-title">Order</h3>
    <div v-show="!section || section === 'grid'" class="mg-layout-block">
      <div class="row g-2">
        <div class="col order-last order-md-last"><div class="mg-demo-item">First in DOM — .order-last .order-md-last</div></div>
        <div class="col order-first"><div class="mg-demo-item">Second — .order-first</div></div>
      </div>
    </div>

    <h3 v-show="!section || section === 'grid'" class="mg-layout-block-title">Nesting</h3>
    <div v-show="!section || section === 'grid'" class="mg-layout-block">
      <div class="row g-2">
        <div class="col-md-8">
          <div class="row g-2">
            <div class="col-6"><div class="mg-demo-item">Nested .col-6</div></div>
            <div class="col-6"><div class="mg-demo-item">Nested .col-6</div></div>
          </div>
        </div>
        <div class="col-md-4"><div class="mg-demo-item">.col-md-4</div></div>
      </div>
    </div>

    <h3 v-show="show('gutters')" class="mg-layout-block-title">Gutters</h3>
    <div v-show="show('gutters')" class="mg-layout-block vstack gap-3">
      <div class="row g-0">
        <div class="col-6"><div class="mg-demo-item">.g-0</div></div>
        <div class="col-6"><div class="mg-demo-item">.g-0</div></div>
      </div>
      <div class="row g-3">
        <div class="col-6"><div class="mg-demo-item">.g-3</div></div>
        <div class="col-6"><div class="mg-demo-item">.g-3</div></div>
      </div>
      <div class="row g-5">
        <div class="col-6"><div class="mg-demo-item">.g-5</div></div>
        <div class="col-6"><div class="mg-demo-item">.g-5</div></div>
      </div>
    </div>

    <h3 v-show="!section || section === 'grid'" class="mg-layout-block-title">Vertical alignment</h3>
    <div v-show="!section || section === 'grid'" class="mg-layout-block vstack gap-2">
      <div class="row g-2 align-items-start mg-layout-tall">
        <div class="col-4"><div class="mg-demo-item">.align-items-start</div></div>
        <div class="col-4"><div class="mg-demo-item">Tall row</div></div>
      </div>
      <div class="row g-2 align-items-center mg-layout-tall">
        <div class="col-4"><div class="mg-demo-item">.align-items-center</div></div>
        <div class="col-4"><div class="mg-demo-item">Tall row</div></div>
      </div>
      <div class="row g-2 align-items-end mg-layout-tall">
        <div class="col-4"><div class="mg-demo-item">.align-items-end</div></div>
        <div class="col-4"><div class="mg-demo-item">Tall row</div></div>
      </div>
    </div>

    <h3 v-show="show('containers')" class="mg-layout-block-title">Containers</h3>
    <div v-show="show('containers')" class="mg-layout-block vstack gap-2">
      <div class="container mg-demo-surface py-2"><div class="mg-demo-item">.container</div></div>
      <div class="container-fluid mg-demo-surface py-2"><div class="mg-demo-item">.container-fluid</div></div>
    </div>

    <h3 v-show="show('css-grid')" class="mg-layout-block-title">CSS grid (native)</h3>
    <div v-show="show('css-grid')" class="mg-layout-block">
      <p class="small text-body-secondary mb-2">Three columns in the preview; stacks below ~420px preview width (container query).</p>
      <div class="mg-css-grid-demo">
        <div class="mg-demo-item">grid 1</div>
        <div class="mg-demo-item">grid 2</div>
        <div class="mg-demo-item">grid 3</div>
      </div>
    </div>
  </div>
</template>