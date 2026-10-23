<script setup>
import { computed, ref } from 'vue'

const q = ref('')
const tab = ref('Live')
const page = ref(1)
const sent = ref(false)
const name = ref('')
const level = ref('info')
const checked = ref(true)
const channel = ref('pager')
const range = ref(62)
const openItem = ref('tokens')
const toasts = ref([])
const dialog = ref(null)
const gone = ref(false)
let toastId = 0

const sections = [
  { id: 'buttons', title: 'Buttons' },
  { id: 'badges', title: 'Badges' },
  { id: 'alerts', title: 'Alerts' },
  { id: 'cards', title: 'Cards' },
  { id: 'forms', title: 'Forms' },
  { id: 'choices', title: 'Choices' },
  { id: 'tables', title: 'Tables' },
  { id: 'meters', title: 'Meters' },
  { id: 'tabs', title: 'Tabs' },
  { id: 'lists', title: 'Lists' },
  { id: 'accordion', title: 'Accordion' },
  { id: 'dialog', title: 'Dialog' },
  { id: 'toasts', title: 'Toasts' },
  { id: 'nav', title: 'Navigation' },
  { id: 'states', title: 'Empty and loading' },
]
const visible = computed(() => {
  const needle = q.value.trim().toLowerCase()
  if (!needle) return sections
  return sections.filter((s) => s.title.toLowerCase().includes(needle) || s.id.includes(needle))
})
function show(id) { return visible.value.some((s) => s.id === id) }
function toast(message, kind = 'info') {
  const id = ++toastId
  toasts.value.push({ id, message, kind })
  window.setTimeout(() => { toasts.value = toasts.value.filter((t) => t.id !== id) }, 4000)
}
function submit() {
  sent.value = true
  if (name.value.trim()) toast('Sample filter saved locally', 'ok')
}
</script>

<template>
  <div class="bst-root" data-bs-theme="dark">
    <div class="bst is-ready">
      <p class="bst-sample"><strong>SAMPLE</strong><span>Catalog actions are local. Bootstrap 6.0.0-alpha.1 is scoped to this frame.</span></p>
      <label class="bst-kicker">Find a component
        <input class="form-control" type="search" v-model="q" placeholder="buttons, dialog, meter" style="border:1px solid var(--bst-line);margin-top:6px;padding:6px 8px;width:min(100%,320px);background:#061108;color:var(--bst-green)" />
      </label>
      <div class="bst-catalog" style="margin-top:12px">
        <p v-if="!visible.length" class="bst-empty" role="status">No component matches “{{ q }}”. <button type="button" class="btn-outline theme-success btn-sm" @click="q = ''">Clear search</button></p>

        <section v-show="show('buttons')" id="buttons" class="bst-block">
          <h3>Buttons</h3>
          <div class="bst-row">
            <button type="button" class="btn-solid theme-success" @click="toast('Primary action selected')">Primary</button>
            <button type="button" class="btn-outline theme-success" @click="toast('Secondary action selected')">Secondary</button>
            <button type="button" class="btn-outline theme-warning" @click="toast('Review queued', 'warn')">Warning</button>
            <button type="button" class="btn-outline theme-danger" @click="dialog?.showModal()">Delete…</button>
            <button type="button" class="btn-outline theme-success" disabled>Disabled</button>
          </div>
          <p class="bst-note">Square corners. Green is the action. Amber is attention. Danger is a separate label, not the brand color. Tab to each control. Disabled buttons do not activate.</p>
        </section>

        <section v-show="show('badges')" id="badges" class="bst-block">
          <h3>Badges</h3>
          <div class="bst-row">
            <span class="badge theme-success">RUNNING</span>
            <span class="badge badge-outline theme-warning">REVIEW</span>
            <span class="badge badge-outline theme-success">RESOLVED</span>
            <span class="badge theme-danger">PAGE</span>
          </div>
          <p class="bst-note">Every badge includes a word. Color repeats the word; it does not replace it.</p>
        </section>

        <section v-show="show('alerts')" id="alerts" class="bst-block">
          <h3>Alerts</h3>
          <div v-if="!gone" class="alert theme-warning" role="alert">High CPU on worker (62%). This is a sample alert.</div>
          <button type="button" class="btn-outline theme-success btn-sm" @click="gone = !gone">{{ gone ? 'Show alert' : 'Dismiss alert' }}</button>
        </section>

        <section v-show="show('cards')" id="cards" class="bst-block">
          <h3>Cards</h3>
          <article class="card">
            <div class="card-header">SERVICE · worker</div>
            <div class="card-body">
              <p>Queue depth 128. Sample only.</p>
              <button type="button" class="btn-outline theme-success btn-sm" @click="toast('Opened sample service')">Open</button>
            </div>
          </article>
        </section>

        <section v-show="show('forms')" id="forms" class="bst-block">
          <h3>Forms</h3>
          <form class="bst-form" @submit.prevent="submit">
            <label>Service name
              <input class="form-control" v-model="name" required placeholder="worker" />
            </label>
            <label>Severity
              <select class="form-control" v-model="level">
                <option value="info">Info</option>
                <option value="warn">Warning</option>
                <option value="page">Page</option>
              </select>
            </label>
            <label>Note
              <textarea class="form-control" rows="2" placeholder="Optional sample note"></textarea>
            </label>
            <p v-if="sent && !name.trim()" class="bst-invalid" role="alert">Enter a service name. Nothing was submitted.</p>
            <p v-else-if="sent" class="bst-note" role="status">Saved locally as {{ name }} / {{ level }}.</p>
            <button type="submit" class="btn-solid theme-success">Save sample</button>
          </form>
        </section>

        <section v-show="show('choices')" id="choices" class="bst-block">
          <h3>Choices</h3>
          <label class="bst-choice"><input type="checkbox" v-model="checked" /> Include resolved incidents</label>
          <fieldset>
            <legend class="bst-kicker">Notify</legend>
            <label class="bst-choice"><input type="radio" value="pager" v-model="channel" /> Pager</label>
            <label class="bst-choice"><input type="radio" value="mail" v-model="channel" /> Mail</label>
          </fieldset>
          <label class="bst-kicker">CPU threshold {{ range }}%
            <input type="range" min="10" max="90" v-model="range" />
          </label>
          <div class="progress bst-meter" role="progressbar" :aria-valuenow="range" aria-valuemin="0" aria-valuemax="100" aria-label="Threshold preview">
            <div class="progress-bar" :class="Number(range) >= 60 ? 'theme-warning' : 'theme-success'" :style="{ '--w': range + '%', width: range + '%' }"></div>
          </div>
        </section>

        <section v-show="show('tables')" id="tables" class="bst-block">
          <h3>Tables</h3>
          <div class="table-responsive">
            <table class="table bst-table">
              <caption class="bst-sr">Sample service table</caption>
              <thead><tr><th scope="col">Service</th><th scope="col">Status</th><th scope="col">Replicas</th></tr></thead>
              <tbody>
                <tr><th scope="row">api</th><td>RUNNING</td><td>3/3</td></tr>
                <tr><th scope="row">worker</th><td class="is-warn">RUNNING *</td><td class="is-warn">2/3</td></tr>
              </tbody>
            </table>
          </div>
        </section>

        <section v-show="show('meters')" id="meters" class="bst-block">
          <h3>Meters</h3>
          <div class="bst-meter-wrap">
            <div class="progress bst-meter" role="progressbar" aria-valuenow="18" aria-valuemin="0" aria-valuemax="100" aria-label="api CPU 18 percent">
              <div class="progress-bar theme-success" style="--w:18%;width:18%"></div>
            </div>
            <span class="bst-pct">18%</span>
          </div>
          <div class="bst-meter-wrap" style="margin-top:8px">
            <div class="progress bst-meter" role="progressbar" aria-valuenow="62" aria-valuemin="0" aria-valuemax="100" aria-label="worker CPU 62 percent">
              <div class="progress-bar theme-warning" style="--w:62%;width:62%"></div>
            </div>
            <span class="bst-pct is-warn">62%</span>
          </div>
          <p class="bst-note">Bars animate in on the dashboard. Here they show the final sample values.</p>
        </section>

        <section v-show="show('tabs')" id="tabs" class="bst-block">
          <h3>Tabs</h3>
          <div class="nav nav-tabs bst-tabs" role="tablist" aria-label="Sample views">
            <button v-for="item in ['Live', 'Hour', 'Day']" :key="item" type="button" role="tab" :aria-selected="tab === item" @click="tab = item">{{ item }}</button>
          </div>
          <p class="bst-note" role="tabpanel">{{ tab }} view, sample series. Arrow-key tab patterns belong to the app; these are toggle buttons.</p>
        </section>

        <section v-show="show('lists')" id="lists" class="bst-block">
          <h3>Lists</h3>
          <ul class="list-group">
            <li class="list-group-item">09:52:11 INFO health check passed</li>
            <li class="list-group-item">09:52:16 WARN high CPU on worker</li>
          </ul>
        </section>

        <section v-show="show('accordion')" id="accordion" class="bst-block">
          <h3>Accordion</h3>
          <div class="accordion">
            <details v-for="item in [['tokens', 'Tokens'], ['motion', 'Motion'], ['scope', 'Scope']]" :key="item[0]" class="accordion-item" :open="openItem === item[0]" @toggle="openItem = $event.target.open ? item[0] : ''">
              <summary class="accordion-header">{{ item[1] }}</summary>
              <div class="accordion-body">{{ item[0] === 'tokens' ? 'Use the phosphor and amber tokens. Do not borrow another language’s palette.' : item[0] === 'motion' ? 'Short entrances, blinking lamps, and a slow scan. Reduced motion keeps the final state.' : 'Bootstrap 6 is pinned and scoped to .bst-root.' }}</div>
            </details>
          </div>
        </section>

        <section v-show="show('dialog')" id="dialog" class="bst-block">
          <h3>Dialog</h3>
          <button type="button" class="btn-outline theme-success" @click="dialog?.showModal()">Open dialog</button>
          <p class="bst-note">Native dialog. Escape closes it and returns focus.</p>
        </section>

        <section v-show="show('toasts')" id="toasts" class="bst-block">
          <h3>Toasts</h3>
          <button type="button" class="btn-solid theme-success" @click="toast('Changes saved locally', 'ok')">Show toast</button>
          <div class="bst-toast-stack" aria-label="Sample toasts">
            <div v-for="item in toasts" :key="item.id" class="toast show" role="status">
              <div class="toast-body">{{ item.message }}</div>
            </div>
          </div>
        </section>

        <section v-show="show('nav')" id="nav" class="bst-block">
          <h3>Navigation</h3>
          <nav aria-label="Breadcrumb" class="bst-note">Bastion / Catalog / {{ tab }}</nav>
          <nav class="bst-pages" aria-label="Sample pages">
            <button type="button" class="btn-outline theme-success btn-sm" :disabled="page === 1" @click="page--">Previous</button>
            <span>Page {{ page }} / 3</span>
            <button type="button" class="btn-outline theme-success btn-sm" :disabled="page === 3" @click="page++">Next</button>
          </nav>
        </section>

        <section v-show="show('states')" id="states" class="bst-block">
          <h3>Empty and loading</h3>
          <div class="bst-empty">No deploys in this sample window.</div>
          <div class="bst-skel" aria-hidden="true"></div>
          <div class="bst-skel" style="width:60%" aria-hidden="true"></div>
          <p class="bst-note" role="status">Loading sample… the bars above are placeholders, not a spinner that hides content.</p>
        </section>
      </div>

      <dialog ref="dialog" class="dialog bst-dialog" aria-labelledby="bst-del-title">
        <form method="dialog">
          <header><h3 id="bst-del-title">Archive sample?</h3></header>
          <div class="bst-dialog-body"><p>This closes locally. No service is deleted.</p></div>
          <footer>
            <button type="submit" class="btn-outline theme-success" value="cancel">Cancel</button>
            <button type="submit" class="btn-solid theme-danger" value="ok" @click="toast('Sample archived locally', 'warn')">Archive sample</button>
          </footer>
        </form>
      </dialog>
    </div>
  </div>
</template>
