<script setup>
defineEmits(['delete', 'github'])
</script>
<template>
  <div class="mg-sq-pr-actions">
    <slot name="status" />
    <button type="button" class="mg-sq-pr-actions__text" @click="$emit('delete')">
      Delete branch
    </button>
    <button type="button" class="mg-sq-pr-actions__github" @click="$emit('github')">
      <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true" focusable="false">
        <path
          fill="currentColor"
          d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.53-.49-.45-.29-.76-.92-.76-1.65 0-.91.41-1.65 1.03-1.65.73 0 1.04.56 1.04 1.13 0 .69-.26 1.38-.4 2.12-.11.48.24.87.71.87.85 0 1.51-.89 1.51-2.19 0-1.14-.82-1.94-1.99-1.94-1.36 0-2.16 1.02-2.16 2.08 0 .41.16.86.36 1.09.04.05.04.1.03.15-.04.17-.11.54-.12.61-.02.1-.08.12-.18.07-.66-.31-1.08-1.29-1.08-2.08 0-1.69.84-3.25 2.42-3.25 1.43 0 2.26 1.12 2.26 2.61 0 1.58-.72 2.9-1.81 2.9-.35 0-.69-.18-.8-.4 0 0-.18.69-.22.86-.08.31-.28.58-.47.71.39.12.81.18 1.24.18 4.42 0 8-3.58 8-8s-3.58-8-8-8z"
        />
      </svg>
      View on GitHub
    </button>
  </div>
</template>