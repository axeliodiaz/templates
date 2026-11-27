<script setup>
defineProps({
  visible: { type: Boolean, default: true },
})
defineEmits(['squash'])
</script>
<template>
  <button
    type="button"
    class="mg-sq-btn mg-sq-btn--squash"
    :class="{ 'is-fading': !visible }"
    :disabled="!visible"
    @click="$emit('squash')"
  >
    ✨ Squash
  </button>
</template>