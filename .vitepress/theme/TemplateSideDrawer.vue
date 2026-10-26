<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { useRoute } from 'vitepress'
import { animate } from 'motion'
const route=useRoute(), panel=ref(null), trigger=ref(null), feedback=ref('')
let animation,media,closing=false
async function open(){feedback.value='';panel.value.showModal();await nextTick();if(!media?.matches)animation=animate(panel.value,{x:['100%','0%'],opacity:[.6,1]},{duration:.28,ease:'easeOut'})}
async function close(){if(closing||!panel.value?.open)return;closing=true;animation?.stop();if(!media?.matches){animation=animate(panel.value,{x:['0%','100%'],opacity:[1,.6]},{duration:.18,ease:'easeIn'});await animation.finished}panel.value?.close();closing=false;trigger.value?.focus()}
function backdrop(e){if(e.target!==panel.value)return;const r=panel.value.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)close()}
onMounted(()=>{media=matchMedia('(prefers-reduced-motion: reduce)')})
onUnmounted(()=>{animation?.stop();panel.value?.close()})
</script>
<template>
<section class="template-drawer-demo" aria-labelledby="drawer-pattern-title">
<h2 id="drawer-pattern-title">Lateral detail drawer</h2>
<p>Open a detail panel without losing the page behind it. This shared pattern follows the current template's colors. Fictitious data; actions stay local.</p>
<button ref="trigger" class="td-open" @click="open">Open detail drawer</button>
<Teleport to="body"><dialog ref="panel" class="template-side-drawer" aria-labelledby="td-heading" @cancel.prevent="close" @click="backdrop">
<header><span class="td-eyebrow">DETAIL PANEL · DEMO</span><button class="td-close" aria-label="Close detail drawer" @click="close">×</button></header>
<h2 id="td-heading">Sample project review</h2><p class="td-subtitle">Keep your context while reviewing the details.</p>
<div class="td-summary"><span class="td-status">Ready for review</span><dl><div><dt>Template route</dt><dd>{{route.path}}</dd></div><div><dt>Project</dt><dd>Riverside workspace (fictitious)</dd></div><div><dt>Owner</dt><dd>Morgan Lee (fictitious)</dd></div></dl></div>
<section><h3>Summary</h3><p>This is an original example. The underlying page stays visible while the panel holds the details. No account, payment or external service is connected.</p></section>
<section><h3>Review note</h3><label for="td-note">Local note<textarea id="td-note" placeholder="Add a note for this preview" rows="4"></textarea></label></section>
<footer><p role="status">{{feedback}}</p><div><button class="td-secondary" @click="close">Close</button><button class="td-primary" @click="feedback='Demo only: review marked locally. Nothing was saved or sent.'">Mark reviewed</button></div></footer>
</dialog></Teleport>
</section>
</template>
<style>
.template-drawer-demo{margin:48px 0 24px;padding:24px;border:1px solid var(--vp-c-divider);border-radius:12px;background:var(--vp-c-bg-soft)}.template-drawer-demo h2{margin:0 0 12px!important;border:0!important;padding:0!important}.template-drawer-demo p{color:var(--vp-c-text-2)}.td-open,.td-primary{background:var(--vp-c-brand-1);color:var(--vp-c-white,#fff);border:1px solid transparent;border-radius:8px;padding:10px 16px;font:600 14px/1.4 var(--vp-font-family-base);cursor:pointer}.template-side-drawer{position:fixed;inset:0 0 0 auto;margin:0;width:min(520px,100vw);max-width:100vw;height:100dvh;max-height:100dvh;border:0;border-left:1px solid var(--vp-c-divider);padding:28px;background:var(--vp-c-bg);color:var(--vp-c-text-1);box-shadow:-20px 0 70px #0004;overflow-y:auto;font:14px/1.6 var(--vp-font-family-base);box-sizing:border-box}.template-side-drawer::backdrop{background:rgb(12 15 25 / .42)}.template-side-drawer header{display:flex;align-items:center;justify-content:space-between;gap:16px}.td-eyebrow{font-size:10px;letter-spacing:1.2px;color:var(--vp-c-text-2)}.td-close{border:1px solid var(--vp-c-divider);border-radius:6px;background:var(--vp-c-bg-soft);color:inherit;font-size:24px;width:36px;height:36px;cursor:pointer}.template-side-drawer h2{font-size:26px;line-height:1.25;margin:28px 0 12px;font-weight:600;letter-spacing:-.6px}.td-subtitle{color:var(--vp-c-text-2);margin:0 0 24px}.td-summary,.template-side-drawer section{border:1px solid var(--vp-c-divider);border-radius:10px;padding:18px;margin:18px 0;background:var(--vp-c-bg-soft)}.td-status{display:inline-block;padding:3px 8px;border:1px solid var(--vp-c-brand-1);border-radius:6px;color:var(--vp-c-brand-1);font-size:12px}.template-side-drawer dl{margin:18px 0 0}.template-side-drawer dl div{display:grid;grid-template-columns:110px 1fr;gap:12px;margin-top:10px}.template-side-drawer dt{color:var(--vp-c-text-2);font-size:12px}.template-side-drawer dd{margin:0;overflow-wrap:anywhere}.template-side-drawer h3{font-size:15px;font-weight:600;margin:0 0 10px}.template-side-drawer section p{margin:0;color:var(--vp-c-text-2)}.template-side-drawer label{display:grid;gap:8px;font-size:12px}.template-side-drawer textarea{background:var(--vp-c-bg);border:1px solid var(--vp-c-divider);border-radius:6px;padding:10px;font:inherit;color:inherit;resize:vertical}.template-side-drawer footer{border-top:1px solid var(--vp-c-divider);margin-top:28px;padding-top:14px}.template-side-drawer footer p{min-height:22px;font-size:12px;color:var(--vp-c-text-2)}.template-side-drawer footer div{display:flex;justify-content:flex-end;gap:10px}.td-secondary{border:1px solid var(--vp-c-divider);border-radius:8px;background:var(--vp-c-bg-soft);color:inherit;padding:10px 16px;font:600 14px var(--vp-font-family-base);cursor:pointer}.template-side-drawer :focus-visible,.td-open:focus-visible{outline:3px solid var(--vp-c-brand-1);outline-offset:3px}@media(max-width:600px){.template-side-drawer{padding:20px}.template-drawer-demo{padding:18px}.template-side-drawer dl div{grid-template-columns:90px 1fr}}
</style>
