<script setup>
defineProps({
  step: { type: [Number, String], default: 1 },
  state: { type: String, default: 'pending' },
  running: { type: Boolean, default: false },
  pop: { type: Boolean, default: false },
  shake: { type: Boolean, default: false },
})
</script>

<template>
  <span
    class="mg-prl__mk"
    :class="{
      'mg-prl__mk--pop': pop,
      'mg-prl__mk--shake': shake,
    }"
    aria-hidden="true"
  >
    <span class="mg-prl__mk-num">{{ step }}</span>
    <span class="mg-prl__mk-dot" />
    <svg class="mg-prl__glyph mg-prl__glyph--check" viewBox="0 0 16 16">
      <path d="M3 8.5l3.2 3.2L13 4.8" />
    </svg>
    <svg class="mg-prl__glyph mg-prl__glyph--x" viewBox="0 0 16 16">
      <path d="M4 4l8 8" />
      <path d="M12 4l-8 8" />
    </svg>
    <svg class="mg-prl__glyph mg-prl__glyph--bang" viewBox="0 0 16 16">
      <path d="M8 3.5v5.5" />
      <path d="M8 12.2v.1" />
    </svg>
    <svg class="mg-prl__glyph mg-prl__glyph--dash" viewBox="0 0 16 16">
      <path d="M4 8h8" />
    </svg>
    <span class="mg-prl__ring" :class="{ 'mg-prl__ring--go': state === 'active' && !running }" />
    <span class="mg-prl__spin" :class="{ 'mg-prl__spin--on': running }" />
  </span>
</template>