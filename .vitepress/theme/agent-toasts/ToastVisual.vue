<script setup lang="ts">
import { computed } from 'vue'
import { cells, type Visual, type CellFill } from './toast.model'

const props = withDefaults(defineProps<{ visual: Visual; size?: 'md' | 'sm' }>(), { size: 'md' })

const shapes = computed(() => cells(props.visual))
const vb = computed(() => (props.size === 'sm' ? '0 0 48 32' : '0 0 58 32'))

function fillClass(f?: CellFill): string {
  if (!f) return 'atoast-viz__ink'
  return `atoast-viz__${f.replace(/-/g, '-')}`
}
</script>

<template>
  <svg
    class="atoast-viz"
    :class="`atoast-viz--${size}`"
    :viewBox="vb"
    width="58"
    height="32"
    aria-hidden="true"
    focusable="false"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g v-for="(s, i) in shapes" :key="i">
      <rect
        v-if="s.kind === 'rect'"
        :x="s.x"
        :y="s.y"
        :width="s.w"
        :height="s.h"
        :rx="s.rx ?? 0"
        :class="fillClass(s.fill)"
      />
      <circle
        v-else-if="s.kind === 'circle'"
        :cx="s.cx"
        :cy="s.cy"
        :r="s.r"
        :class="[fillClass(s.fill), s.stroke ? `atoast-viz__stroke-${s.stroke}` : '']"
        :stroke-width="s.strokeWidth ?? 0"
        :fill="s.fill ? undefined : 'none'"
      />
      <line
        v-else-if="s.kind === 'line'"
        :x1="s.x1"
        :y1="s.y1"
        :x2="s.x2"
        :y2="s.y2"
        :class="`atoast-viz__stroke-${s.stroke}`"
        :stroke-width="s.strokeWidth ?? 1"
        :stroke-dasharray="s.dash"
      />
      <path
        v-else-if="s.kind === 'path'"
        :d="s.d"
        :class="[s.fill ? fillClass(s.fill) : '', s.stroke ? `atoast-viz__stroke-${s.stroke}` : '']"
        :stroke-width="s.strokeWidth ?? 1"
        :fill="s.fill ? undefined : 'none'"
        :stroke-dasharray="s.dash"
      />
      <text
        v-else-if="s.kind === 'text'"
        :x="s.x"
        :y="s.y"
        :class="fillClass(s.fill)"
        :font-size="s.size ?? 10"
      >
        {{ s.text }}
      </text>
    </g>
  </svg>
</template>