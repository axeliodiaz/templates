<script setup lang="ts">
import { computed } from 'vue'
import { cells, type Visual, type CellFill } from './toast.model'

const props = withDefaults(defineProps<{ visual: Visual; size?: 'md' | 'sm' }>(), { size: 'md' })

const shapes = computed(() => cells(props.visual))
const vb = computed(() => (props.size === 'sm' ? '0 0 48 28' : '0 0 56 32'))

function fillClass(f?: CellFill): string {
  if (!f) return 'atoast__fill--ink'
  return `atoast__fill--${f}`
}
</script>

<template>
  <svg
    class="atoast__viz"
    :class="`atoast__viz--${size}`"
    :viewBox="vb"
    :width="size === 'sm' ? 48 : 56"
    :height="size === 'sm' ? 28 : 32"
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
        :class="[fillClass(s.fill), s.stroke ? `atoast__stroke--${s.stroke}` : '']"
        :stroke-width="s.strokeWidth ?? 0"
        :fill="s.fill ? undefined : 'none'"
      />
      <line
        v-else-if="s.kind === 'line'"
        :x1="s.x1"
        :y1="s.y1"
        :x2="s.x2"
        :y2="s.y2"
        :class="`atoast__stroke--${s.stroke}`"
        :stroke-width="s.strokeWidth ?? 1"
        :stroke-dasharray="s.dash"
      />
      <path
        v-else-if="s.kind === 'path'"
        :d="s.d"
        :class="[s.fill ? fillClass(s.fill) : '', s.stroke ? `atoast__stroke--${s.stroke}` : '']"
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