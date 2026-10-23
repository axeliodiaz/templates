<script setup lang="ts">
defineProps<{ name: string }>()
</script>

<template>
  <svg class="rl-ic" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
    <template v-if="name==='agents' || name==='research'">
      <circle cx="7" cy="8" r="2" /><circle cx="17" cy="8" r="2" /><circle cx="7" cy="16" r="2" /><circle cx="17" cy="16" r="2" />
      <path d="M9 8h6M7 10v4M17 10v4M9 16h6" />
    </template>
    <template v-else-if="name==='servers'">
      <rect x="4" y="4" width="16" height="6" rx="1.5" /><rect x="4" y="14" width="16" height="6" rx="1.5" /><path d="M8 7h.01M8 17h.01" />
    </template>
    <template v-else-if="name==='tools'">
      <path d="M14.5 6.5a3 3 0 0 0-4.3 3.4L5 15.1 8.9 19l5.2-5.2a3 3 0 0 0 3.4-4.3l-2.2 2.2-1.8-1.8z" />
    </template>
    <template v-else-if="name==='runs'">
      <path d="M4 15l4-5 3 3 4-6 5 4" />
    </template>
    <template v-else-if="name==='approvals'">
      <circle cx="12" cy="12" r="8" /><path d="M8.5 12.2 11 14.6 15.8 9.4" />
    </template>
    <template v-else-if="name==='code' || name==='user'">
      <circle cx="12" cy="9" r="3" /><path d="M6 19c1.3-2.5 3.3-3.7 6-3.7s4.7 1.2 6 3.7" />
    </template>
    <template v-else-if="name==='ops'">
      <circle cx="12" cy="12" r="8" /><path d="M4 12h16M12 4c2 2.3 3 5 3 8s-1 5.7-3 8c-2-2.3-3-5-3-8s1-5.7 3-8" />
    </template>
    <template v-else-if="name==='supabase'">
      <ellipse cx="12" cy="7" rx="6" ry="2.6" /><path d="M6 7v9c0 1.5 2.7 2.8 6 2.8s6-1.3 6-2.8V7" /><path d="M6 12c0 1.5 2.7 2.6 6 2.6s6-1.1 6-2.6" />
    </template>
    <template v-else-if="name==='github'">
      <circle cx="12" cy="12" r="8" /><path d="M9 14.5c.4 1.2 1.5 2 3 2s2.6-.8 3-2" /><path d="M9 11.2V9.8M15 11.2V9.8" />
    </template>
    <template v-else-if="name==='vercel'">
      <path d="M12 5.5 19.5 18h-15z" />
    </template>
    <template v-else-if="name==='gmail'">
      <rect x="4" y="6.5" width="16" height="11" rx="1.6" /><path d="m5 8 7 5 7-5" />
    </template>
    <template v-else-if="name==='bell'">
      <path d="M6.5 16h11l-1.2-2V10.2a4.3 4.3 0 0 0-8.6 0V14z" /><path d="M10 17.2a2 2 0 0 0 4 0" />
    </template>
    <template v-else-if="name==='help'">
      <circle cx="12" cy="12" r="8" /><path d="M9.6 9.6a2.4 2.4 0 1 1 3.1 2.3c-.7.3-1.2.8-1.2 1.6" /><path d="M12 16.8h.01" />
    </template>
    <template v-else-if="name==='fit'">
      <path d="M4 9V4h5M15 4h5v5M20 15v5h-5M9 20H4v-5" />
    </template>
  </svg>
</template>
