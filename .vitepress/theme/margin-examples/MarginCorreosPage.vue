<script setup>
import { computed, ref, onMounted, onUnmounted, nextTick } from 'vue'
import { animate } from 'motion'
import MarginExampleTabs from '../MarginExampleTabs.vue'
import emailDef from '../margin-emails.json'
import { EMAIL_SCHEMA } from '../margin-example-schemas.mjs'

const preview = ref(null)
const selected = ref(emailDef.defaultId)
const name = ref('Morgan')
const notice = ref('')
const messages = emailDef.messages
const mail = computed(() => messages.find((x) => x.id === selected.value))
const customer = computed(() => name.value.trim() || 'Morgan')
let controls, media, disposed = false

async function enter() {
  controls?.stop()
  await nextTick()
  if (!disposed && !media?.matches && preview.value)
    controls = animate(preview.value, { opacity: [0, 1], y: [8, 0] }, { duration: 0.25 })
}
function choose(id) {
  selected.value = id
  notice.value = ''
  enter()
}
onMounted(() => {
  media = matchMedia('(prefers-reduced-motion: reduce)')
  enter()
})
onUnmounted(() => {
  disposed = true
  controls?.stop()
})
</script>
<template>
  <MarginExampleTabs
    :definition="emailDef"
    json-path=".vitepress/theme/margin-emails.json"
    :schema-fields="EMAIL_SCHEMA"
    code-snippet="Import margin-emails.json and bind messages[] in your mail preview shell."
    tabs-aria-label="Transactional emails"
  >
    <div class="margin-mail">
      <nav aria-label="Email examples">
        <button
          v-for="item in messages"
          :key="item.id"
          type="button"
          :aria-pressed="selected === item.id"
          @click="choose(item.id)"
        >
          {{ item.label }}
        </button>
      </nav>
      <label class="mm-field"
        >Fictitious customer name<input v-model="name" maxlength="32" autocomplete="off"
      /></label>
      <div class="mm-meta"><strong>Subject</strong><span>{{ mail?.subject }}</span></div>
      <article ref="preview" class="mm-preview" aria-label="Email preview">
        <header>margin<span>.</span><small>PROJECT COMMUNICATIONS · SAMPLE</small></header>
        <div class="mm-content">
          <small>PROJECT UPDATE</small>
          <h2>{{ mail?.heading }}</h2>
          <p>Hello {{ customer }},</p>
          <p>{{ mail?.body }}</p>
          <div class="mm-detail">{{ mail?.detail }}</div>
          <button
            type="button"
            class="mm-action"
            @click="notice = 'Demo only: this preview does not open a real account or process a payment.'"
          >
            {{ mail?.action }}
          </button>
          <p role="status" class="mm-notice">{{ notice }}</p>
        </div>
        <footer>
          Fictitious preview · No email sent<br />Contact your project team through your verified account in a real
          implementation.
        </footer>
      </article>
      <p class="mm-help">
        Production checklist: replace sample job details, amounts and destinations with verified data. Invoice review must
        not imply automatic payment or approval.
      </p>
    </div>
  </MarginExampleTabs>
</template>
<style scoped>
.margin-mail {
  --mm-text: #22252b;
  --mm-muted: #676e7b;
  --mm-border: #e0e3e9;
  background: #f5f5f7;
  border: 1px solid var(--mm-border);
  border-radius: 16px;
  padding: 24px;
  color: var(--mm-text);
  font: 14px/1.6 system-ui, Arial, sans-serif;
  margin: 24px 0;
}
.margin-mail nav {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 20px;
}
.margin-mail nav button {
  border: 1px solid #e0e3e9;
  border-radius: 8px;
  padding: 8px 12px;
  background: #ffffff;
  color: #22252b;
  font: inherit;
  cursor: pointer;
}
.margin-mail nav button[aria-pressed='true'] {
  background: #6389ea;
  border-color: #6389ea;
  color: #0f1528;
  font-weight: 600;
}
.mm-field {
  display: grid;
  gap: 5px;
  font-size: 12px;
  font-weight: 600;
  margin-bottom: 20px;
}
.mm-field input {
  background: #ffffff;
  border: 1px solid #e0e3e9;
  border-radius: 8px;
  padding: 9px 12px;
  color: #22252b;
  font: inherit;
  max-width: 320px;
}
.mm-meta {
  display: flex;
  gap: 12px;
  margin: 0 auto 12px;
  max-width: 560px;
  font-size: 12px;
  flex-wrap: wrap;
}
.mm-preview {
  background: #ffffff;
  max-width: 560px;
  margin: auto;
  border: 1px solid var(--mm-border);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 12px 36px #22252b12;
}
.mm-preview header {
  font: 600 28px system-ui, sans-serif;
  padding: 24px 28px;
  border-bottom: 1px solid var(--mm-border);
  color: #22252b;
}
.mm-preview header span {
  color: #6389ea;
}
.mm-preview header small {
  display: block;
  font: 10px system-ui, sans-serif;
  letter-spacing: 1.1px;
  margin-top: 8px;
  color: var(--mm-muted);
}
.mm-content {
  padding: 28px;
}
.mm-content > small {
  color: #8f3052;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 1px;
}
.mm-content h2 {
  font: 600 26px/1.2 system-ui, sans-serif;
  color: #22252b;
  letter-spacing: -0.6px;
  border: 0;
  margin: 12px 0 24px;
  padding: 0;
}
.mm-content p {
  color: var(--mm-muted);
}
.mm-detail {
  background: #eceef5;
  border: 1px solid var(--mm-border);
  border-radius: 8px;
  padding: 12px;
  margin: 24px 0;
  font-size: 12px;
  color: #22252b;
}
.mm-action {
  background: #6389ea;
  border: 1px solid #6389ea;
  color: #0f1528;
  border-radius: 8px;
  padding: 11px 18px;
  font: 600 13px system-ui, sans-serif;
  cursor: pointer;
}
.mm-notice {
  font-size: 12px;
  min-height: 20px;
  color: #22252b;
}
.mm-preview footer {
  border-top: 1px solid var(--mm-border);
  padding: 20px 28px;
  font-size: 11px;
  color: var(--mm-muted);
  background: #f5f5f7;
}
.mm-help {
  font-size: 12px;
  color: var(--mm-muted);
  max-width: 560px;
  margin: 20px auto 0;
}
.margin-mail :focus-visible {
  outline: 2px solid #6389ea;
  outline-offset: 3px;
}
@media (max-width: 600px) {
  .margin-mail {
    padding: 14px;
  }
  .mm-content,
  .mm-preview header {
    padding: 20px;
  }
  .mm-content h2 {
    font-size: 23px;
  }
}
</style>