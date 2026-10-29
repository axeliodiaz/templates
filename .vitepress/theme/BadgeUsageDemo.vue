<script setup lang="ts">
import { ref } from 'vue'
const status = ref('Draft'), count = ref(4), message = ref('Fictitious sample. No external activity.')
const states = ['Draft','Ready','Running','Blocked']
const tone = (s: string) => ({Ready:'l-badge-success',Running:'l-badge-warn',Blocked:'l-badge-error'}[s] || '')
</script>
<template>
 <section class="badge-usage l-demo" aria-label="Badge usage demonstration">
  <div class="l-actions"><span v-for="s in states" :key="s" :class="['l-badge',tone(s)]">{{ s }}</span></div>
  <p><label>Sample status <select v-model="status"><option v-for="s in states" :key="s">{{ s }}</option></select></label></p>
  <p role="status">Current status: <span :class="['l-badge',tone(status)]">{{ status }}</span></p>
  <div class="l-actions">
   <button type="button" class="l-btn l-secondary" @click="message = 'Sample inbox opened locally. No navigation.'">Inbox <span class="l-badge" aria-hidden="true">{{ count }}</span><span class="badge-sr">{{ count }} unread sample messages</span></button>
   <button type="button" class="l-btn l-quiet" @click="count = count + 1; message = 'Added one fictitious unread item.'">Add sample item</button>
   <button type="button" class="l-btn l-quiet" @click="count = 0; message = 'Sample unread count cleared.'">Clear sample count</button>
  </div>
  <div class="badge-shapes"><span class="l-badge">Pill</span><span class="l-badge badge-square">Square</span><span class="l-badge"><i class="badge-dot" aria-hidden="true"></i> Online</span><button type="button" class="l-btn l-secondary badge-positioned" @click="message = 'Positioned count is decorative; the button owns the action.'" aria-label="Sample alerts, 99 or more unread">Sample alerts <span class="l-badge l-badge-error badge-corner" aria-hidden="true">99+</span></button></div>
  <p role="status">{{ message }}</p><small>All names and counts are fictitious. No server, storage or message system is connected.</small>
 </section>
</template>
<style scoped>
.badge-usage { padding:20px; border:1px solid var(--vp-c-divider); border-radius:12px; margin:20px 0 }
.badge-usage button,.badge-usage select { min-height:44px }
.badge-usage select { color:inherit; background:var(--vp-c-bg-soft); border:1px solid var(--vp-c-divider); padding:8px; border-radius:8px; margin:6px }
.badge-usage .l-badge { transition:background-color 120ms ease }
.badge-usage :focus-visible { outline:3px solid var(--vp-c-brand-1); outline-offset:3px }
.badge-shapes { display:flex; align-items:center; flex-wrap:wrap; gap:14px; padding-top:22px }
.badge-square { border-radius:3px }
.badge-dot { width:7px; height:7px; display:inline-block; border-radius:50%; background:currentColor; margin-right:5px }
.badge-positioned { position:relative; margin:6px 14px 0 0 }
.badge-corner { position:absolute; right:-12px; top:-12px }
.badge-sr { position:absolute; width:1px; height:1px; padding:0; overflow:hidden; clip-path:inset(50%); white-space:nowrap }
@media(prefers-reduced-motion:reduce) { .badge-usage .l-badge { transition:none } }
</style>
