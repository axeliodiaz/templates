<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{ label: string; value: string; bg: string }>()

function parseHex(hex: string) {
  const h = hex.replace('#', '').trim()
  const n = h.length === 3 ? h.split('').map((c) => c + c).join('') : h
  const v = Number.parseInt(n, 16)
  return [(v >> 16) & 255, (v >> 8) & 255, v & 255] as const
}

function lin(c: number) {
  const x = c / 255
  return x <= 0.04045 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4
}

function lum(hex: string) {
  const [r, g, b] = parseHex(hex)
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b)
}

function ratio(fg: string, bg: string) {
  const l1 = lum(fg)
  const l2 = lum(bg)
  const hi = Math.max(l1, l2)
  const lo = Math.min(l1, l2)
  return (hi + 0.05) / (lo + 0.05)
}

function pickFg(bg: string) {
  const opts = ['#f1f3f8', '#22252b', '#0f1528']
  const ok = opts.find((c) => ratio(c, bg) >= 4.5)
  if (ok) return ok
  return lum(bg) > 0.5 ? '#0f1528' : '#f1f3f8'
}

const fg = computed(() => pickFg(props.bg))
const muted = computed(() => (ratio('#aab3c3', props.bg) >= 4.5 ? '#aab3c3' : ratio('#676e7b', props.bg) >= 4.5 ? '#676e7b' : fg.value))
</script>

<template>
  <div
    class="mg-swatch"
    :style="{ background: bg, borderColor: bg, '--mg-swatch-fg': fg, '--mg-swatch-muted': muted }"
  >
    <small>{{ label }}</small>
    <strong>{{ value }}</strong>
  </div>
</template>

<style scoped>
.mg-swatch {
  border: 1px solid var(--line, #e0e3e9);
  border-radius: 8px;
  padding: 12px;
  color: var(--mg-swatch-fg);
  min-width: 0;
}
.mg-swatch small {
  display: block;
  font-size: 10px;
  color: var(--mg-swatch-muted);
  margin-bottom: 4px;
}
.mg-swatch strong {
  display: block;
  font-size: 13px;
  font-weight: 600;
  color: var(--mg-swatch-fg);
}
</style>