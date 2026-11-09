<script setup lang="ts">
import { ref } from 'vue'
const status = ref('Draft'), count = ref(4), message = ref('Fictitious sample. No external activity.')
const states = ['Draft','Ready','Running','Blocked']
const tone = (s: string) => ({Ready:'fg-badge-success',Running:'fg-badge-warn',Blocked:'fg-badge-error'}[s] || '')
</script>
<template>
 <section class="badge-usage fg-demo" aria-label="Badge usage demonstration">
  <div class="fg-actions"><span v-for="s in states" :key="s" :class="['fg-badge',tone(s)]">{{ s }}</span></div>
  <p><label>Sample status <select v-model="status"><option v-for="s in states" :key="s">{{ s }}</option></select></label></p>
  <p role="status">Current status: <span :class="['fg-badge',tone(status)]">{{ status }}</span></p>
  <div class="fg-actions">
   <button type="button" class="fg-btn fg-secondary" @click="message = 'Sample inbox opened locally. No navigation.'">Inbox <span class="fg-badge" aria-hidden="true">{{ count }}</span><span class="badge-sr">{{ count }} unread sample messages</span></button>
   <button type="button" class="fg-btn fg-quiet" @click="count = count + 1; message = 'Added one fictitious unread item.'">Add sample item</button>
   <button type="button" class="fg-btn fg-quiet" @click="count = 0; message = 'Sample unread count cleared.'">Clear sample count</button>
  </div>
  <div class="badge-shapes"><span class="fg-badge">Pill</span><span class="fg-badge badge-square">Square</span><span class="fg-badge"><i class="badge-dot" aria-hidden="true"></i> Online</span><button type="button" class="fg-btn fg-secondary badge-positioned" @click="message = 'Positioned count is decorative; the button owns the action.'" aria-label="Sample alerts, 99 or more unread">Sample alerts <span class="fg-badge fg-badge-error badge-corner" aria-hidden="true">99+</span></button></div>
  <p role="status">{{ message }}</p><small>All names and counts are fictitious. No server, storage or message system is connected.</small>
 </section>
</template>
<style scoped>
.badge-usage { padding:20px; border:1px solid var(--vp-c-divider); border-radius:12px; margin:20px 0 }
.badge-usage button,.badge-usage select { min-height:44px }
.badge-usage select { color:inherit; background:var(--vp-c-bg-soft); border:1px solid var(--vp-c-divider); padding:8px; border-radius:8px; margin:6px }
.badge-usage .fg-badge { transition:background-color 120ms ease }
.badge-usage :focus-visible { outline:3px solid var(--vp-c-brand-1); outline-offset:3px }
.badge-shapes { display:flex; align-items:center; flex-wrap:wrap; gap:14px; padding-top:22px }
.badge-square { border-radius:3px }
.badge-dot { width:7px; height:7px; display:inline-block; border-radius:50%; background:currentColor; margin-right:5px }
.badge-positioned { position:relative; margin:6px 14px 0 0 }
.badge-corner { position:absolute; right:-12px; top:-12px }
.badge-sr { position:absolute; width:1px; height:1px; padding:0; overflow:hidden; clip-path:inset(50%); white-space:nowrap }
@media(prefers-reduced-motion:reduce) { .badge-usage .fg-badge { transition:none } }

/* Local Felix guide classes, not an installed component API. */
:global(html.felix-dark .fg-demo){--fg-danger:#fda4af}
.fg-demo{--fg-danger:#a91c38;background:var(--vp-c-bg);color:var(--vp-c-text-1)}
.fg-btn,.fg-icon-btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;padding:10px 14px;min-height:44px;border:1px solid var(--vp-c-divider);border-radius:10px;font:inherit;color:var(--vp-c-text-1);background:var(--vp-c-bg-soft);cursor:pointer}
.fg-primary{background:var(--vp-c-brand-1);border-color:var(--vp-c-brand-1);color:var(--vp-c-bg)}
.fg-quiet{background:transparent;border-color:transparent}.fg-danger{border-color:var(--fg-danger);color:var(--fg-danger);background:transparent}
.fg-btn:disabled{opacity:.5;cursor:not-allowed}.fg-btn:hover:not(:disabled){box-shadow:inset 0 0 0 1px currentColor}.fg-btn:focus-visible,.fg-icon-btn:focus-visible{outline:3px solid var(--vp-c-brand-1);outline-offset:3px}
.fg-actions{display:flex;gap:10px;flex-wrap:wrap}.fg-segment button{border:1px solid var(--vp-c-divider);border-radius:8px;background:var(--vp-c-bg-soft)}.fg-segment button.is-active{background:var(--vp-c-brand-soft);color:var(--vp-c-brand-1)}
.fg-badge{display:inline-flex;align-items:center;gap:4px;border:1px solid var(--vp-c-divider);border-radius:99px;padding:3px 8px;background:var(--vp-c-bg-soft);color:var(--vp-c-text-1);font-size:12px;line-height:1.5}
.fg-badge-success,.fg-alert-success{background:var(--vp-c-brand-soft);color:var(--vp-c-text-1);border-color:var(--vp-c-brand-1)}
.fg-badge-warn,.fg-alert-warn{background:var(--vp-c-warning-soft);color:var(--vp-c-text-1);border-color:var(--vp-c-warning-1)}
.fg-badge-error{background:var(--vp-c-danger-soft);color:var(--fg-danger);border-color:var(--fg-danger)}
.fg-alert{padding:16px;border:1px solid var(--vp-c-divider);border-radius:10px;background:var(--vp-c-bg-soft);color:var(--vp-c-text-1)}
.fg-menu{border:1px solid var(--vp-c-divider);border-radius:10px;padding:8px;background:var(--vp-c-bg)}
:is(input[type=range],input[type=checkbox],input[type=radio]){accent-color:var(--vp-c-brand-1)}

.fg-alert.fg-alert-success{border-color:var(--vp-c-brand-1);background:var(--vp-c-brand-soft)}
.fg-alert.fg-alert-warn{border-color:var(--vp-c-warning-1);background:var(--vp-c-warning-soft)}
</style>
