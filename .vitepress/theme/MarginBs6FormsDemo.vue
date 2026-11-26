<script setup lang="ts">
import { ref } from 'vue'
const props = defineProps<{ section: string }>()
const show = (id: string) => !props.section || props.section === id
const sent = ref(false)
const name = ref('')
const email = ref('')
</script>
<template>
  <div class="lab b2-bs6 b2-margin margin-bs6-forms">
    <section v-show="show('overview')" class="l-demo l-form">
      <p>Forms use scoped Bootstrap 6 controls with Margin <code>.lab</code> tokens. Pair fields with visible labels; keep errors in text, not color alone.</p>
      <label class="form-label" for="mg-overview-name">Workspace</label>
      <input id="mg-overview-name" class="form-control" placeholder="Northstar demo" />
    </section>
    <section v-show="show('form-control')" class="l-demo l-form">
      <label class="form-label" for="mg-fc">Job reference</label>
      <input id="mg-fc" class="form-control" type="text" autocomplete="off" />
      <label class="form-label mt-2" for="mg-fc-ta">Notes</label>
      <textarea id="mg-fc-ta" class="form-control" rows="2" />
    </section>
    <section v-show="show('select')" class="l-demo l-form">
      <label class="form-label" for="mg-sel">Scenario</label>
      <select id="mg-sel" class="form-control">
        <option>Base case</option>
        <option>Upside</option>
        <option>Downside</option>
      </select>
    </section>
    <section v-show="show('checks-radios')" class="l-demo l-form">
      <div class="form-check">
        <input id="mg-chk" class="form-check-input" type="checkbox" checked />
        <label class="form-check-label" for="mg-chk">Email weekly summary</label>
      </div>
      <fieldset class="mt-2">
        <legend class="form-label mb-1">Density</legend>
        <div class="form-check">
          <input id="mg-r1" class="form-check-input" type="radio" name="mg-density" checked />
          <label class="form-check-label" for="mg-r1">Comfortable</label>
        </div>
        <div class="form-check">
          <input id="mg-r2" class="form-check-input" type="radio" name="mg-density" />
          <label class="form-check-label" for="mg-r2">Compact</label>
        </div>
      </fieldset>
    </section>
    <section v-show="show('range')" class="l-demo l-form">
      <label class="form-label" for="mg-range">Threshold <output class="ms-1">64%</output></label>
      <input id="mg-range" class="form-range" type="range" min="0" max="100" value="64" />
    </section>
    <section v-show="show('input-group')" class="l-demo l-form">
      <label class="form-label" for="mg-ig">Budget</label>
      <div class="input-group">
        <span class="input-group-text">$</span>
        <input id="mg-ig" class="form-control" type="number" min="0" value="1200" />
        <button type="button" class="btn btn-outline theme-secondary">Apply</button>
      </div>
    </section>
    <section v-show="show('floating-labels')" class="l-demo l-form">
      <div class="form-floating">
        <input id="mg-float" class="form-control" placeholder="Branch" value="Austin hub" />
        <label for="mg-float">Branch</label>
      </div>
    </section>
    <section v-show="show('layout')" class="l-demo l-form">
      <div class="row g-2">
        <div class="col-md-6">
          <label class="form-label" for="mg-a">From</label>
          <input id="mg-a" class="form-control" type="date" />
        </div>
        <div class="col-md-6">
          <label class="form-label" for="mg-b">To</label>
          <input id="mg-b" class="form-control" type="date" />
        </div>
      </div>
    </section>
    <section v-show="show('validation')" class="l-demo l-form">
      <form novalidate @submit.prevent="sent = true">
        <label class="form-label" for="mg-val">Project name</label>
        <input id="mg-val" v-model="name" class="form-control" required :class="{'is-invalid': sent && !name.trim()}" :aria-invalid="sent && !name.trim()" aria-describedby="mg-val-hint" />
        <div id="mg-val-hint" class="form-text">{{ sent ? (name.trim() ? 'Looks good (demo).' : 'Enter a project name.') : 'Validate after submit attempt.' }}</div>
        <label class="form-label mt-2" for="mg-val-email">Owner email</label>
        <input id="mg-val-email" v-model="email" class="form-control" type="email" :class="{'is-invalid': sent && !email.includes('@')}" />
        <button type="submit" class="btn btn-solid theme-primary mt-3">Save sample</button>
      </form>
    </section>
  </div>
</template>
<style scoped>
.margin-bs6-forms .l-demo {
  border: 1px solid var(--line, #e0e3e9);
  border-radius: 10px;
  padding: 14px;
  background: var(--surface, #fff);
}
.margin-bs6-forms :focus-visible {
  outline: 2px solid #6389ea;
  outline-offset: 3px;
}
</style>