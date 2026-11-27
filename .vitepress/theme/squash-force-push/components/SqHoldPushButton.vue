<script setup>
const props = defineProps({
  active: { type: Boolean, default: false },
  progress: { type: Number, default: 0 },
  pushing: { type: Boolean, default: false },
})
const emit = defineEmits(['start', 'cancel'])
function onDown(e) {
  e.preventDefault()
  emit('start')
}
function onUp() {
  if (props.pushing && props.progress < 1) emit('cancel')
}
function onKeyDown(e) {
  if (e.key === ' ' || e.key === 'Enter') {
    e.preventDefault()
    emit('start')
  }
}
</script>
<template>
  <button
    type="button"
    class="mg-sq-btn mg-sq-btn--hold"
    :class="{ 'is-active': active }"
    :style="{ '--mg-push-fill': progress }"
    aria-describedby="mg-sq-hold-hint"
    @pointerdown="onDown"
    @pointerup="onUp"
    @pointerleave="onUp"
    @keydown="onKeyDown"
    @keyup="onUp"
  >
    <span class="mg-sq-btn__up" aria-hidden="true">↑</span>
    {{
      pushing
        ? `Pushing ${Math.min(3, Math.max(1, Math.ceil(progress * 3)))} of 3`
        : 'Hold to force push'
    }}
  </button>
  <span id="mg-sq-hold-hint" class="visually-hidden">
    Hold for about two seconds; release early to cancel. Space or Enter while focused.
  </span>
</template>