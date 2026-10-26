<script setup lang="ts">
import RelayIcon from './RelayIcon.vue'

defineProps<{ section: string; count: number; status: string; ok: boolean }>()
const emit = defineEmits<{ select: [id: string]; profile: [] }>()
const items = [
  { id: 'agents', label: 'Agents', icon: 'agents' },
  { id: 'servers', label: 'MCP Servers', icon: 'servers' },
  { id: 'tools', label: 'Tools', icon: 'tools' },
  { id: 'runs', label: 'Runs', icon: 'runs' },
  { id: 'approvals', label: 'Approvals', icon: 'approvals' },
]
</script>

<template>
  <nav class="nav flex-column rl-nav" aria-label="Relay">
    <button
      v-for="item in items"
      :key="item.id"
      type="button"
      class="nav-link"
      :class="{ active: section === item.id }"
      :aria-current="section === item.id ? 'page' : undefined"
      @click="emit('select', item.id)"
    >
      <RelayIcon :name="item.icon" />
      <span>{{ item.label }}</span>
      <span v-if="item.id === 'approvals'" class="badge rounded-pill theme-primary">{{ count }}</span>
    </button>
  </nav>
  <div class="rl-foot">
    <section class="card rl-status-card" aria-label="System status">
      <p class="rl-ok"><i class="rl-dot" :class="{ warn: !ok }" aria-hidden="true"></i>{{ status }}</p>
      <p><span>Agents online</span><strong>12</strong></p>
      <p><span>MCP Servers</span><strong>4</strong></p>
    </section>
    <button type="button" class="btn-outline theme-primary rl-user" @click="emit('profile')">
      <span class="rl-avatar" aria-hidden="true">AM</span>
      <span class="rl-user-copy"><strong>Alex Morgan</strong><small>alex@morgan.dev</small></span>
    </button>
  </div>
</template>
