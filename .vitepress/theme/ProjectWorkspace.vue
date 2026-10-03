<script setup lang="ts">
import { computed, ref } from 'vue'
const props = defineProps<{ scenario?: 'launch' | 'studio' }>()
const studio = props.scenario === 'studio'
const title = studio ? 'Studio operations' : 'Orbit product launch'
const view = ref('Board'), query = ref(''), priority = ref('All priorities')
const selected = ref<number | null>(null), notice = ref(''), draft = ref('')
const stages = ['To do', 'In progress', 'In review', 'Done']
const members = studio ? ['Maya Chen', 'Leo Park', 'Nora Bell'] : ['Ada Reed', 'Sam Ortiz', 'Jules Kim']
const tasks = ref((studio ? [
  ['Prepare client kickoff', 'To do', 'High', 0, 'Oct 12', 'Client work', 2, 1],
  ['Renew asset licenses', 'To do', 'Normal', 1, 'Oct 14', 'Operations', 0, 0],
  ['Review October capacity', 'In progress', 'High', 2, 'Oct 9', 'Operations', 3, 2],
  ['Build identity exploration', 'In progress', 'Normal', 0, 'Oct 13', 'Client work', 5, 3],
  ['Approve handoff package', 'In review', 'High', 1, 'Oct 10', 'Client work', 4, 2],
  ['Archive signed proposal', 'Done', 'Low', 2, 'Oct 6', 'Operations', 1, 1]
] : [
  ['Map the onboarding journey', 'To do', 'High', 0, 'Oct 12', 'Design', 2, 1],
  ['Set up product analytics', 'To do', 'Normal', 1, 'Oct 15', 'Engineering', 0, 0],
  ['Write launch announcement', 'To do', 'Low', 2, 'Oct 16', 'Marketing', 1, 0],
  ['Build the welcome flow', 'In progress', 'High', 1, 'Oct 9', 'Engineering', 4, 2],
  ['Explore landing page visuals', 'In progress', 'Normal', 0, 'Oct 13', 'Design', 3, 3],
  ['Review accessibility', 'In review', 'High', 2, 'Oct 10', 'Design', 5, 1],
  ['Confirm release checklist', 'Done', 'Normal', 1, 'Oct 6', 'Engineering', 2, 1],
  ['Approve product positioning', 'Done', 'Low', 2, 'Oct 5', 'Marketing', 1, 0]
]).map((t, id) => ({ id, title: String(t[0]), status: String(t[1]), priority: String(t[2]), person: Number(t[3]), due: String(t[4]), category: String(t[5]), comments: Number(t[6]), files: Number(t[7]) })))
const filtered = computed(() => tasks.value.filter(t => (priority.value === 'All priorities' || t.priority === priority.value) && `${t.title} ${members[t.person]} ${t.category}`.toLowerCase().includes(query.value.toLowerCase())))
const active = computed(() => tasks.value.find(t => t.id === selected.value))
const completed = computed(() => tasks.value.filter(t => t.status === 'Done').length)
const percent = computed(() => Math.round(completed.value / tasks.value.length * 100))
function initials(name: string) { return name.split(' ').map(n => n[0]).join('') }
function addTask() {
  if (!draft.value.trim()) return
  tasks.value.push({ id: Math.max(...tasks.value.map(t => t.id)) + 1, title: draft.value.trim().slice(0, 80), status: 'To do', priority: 'Normal', person: 0, due: 'No date', category: studio ? 'Operations' : 'Design', comments: 0, files: 0 })
  draft.value = ''; query.value = ''; priority.value = 'All priorities'; view.value = 'Board'; notice.value = 'Task added to this demo only.'
}
</script>

<template>
<section class="pw" :aria-label="`${title} interactive project workspace`">
  <aside class="pw-rail" aria-label="Workspace navigation"><span class="pw-brand" aria-label="Orbit workspace">O</span><span>⌂</span><span>▦</span><span class="pw-rail-active">▤</span><span>✉</span><span class="pw-rail-bottom">⚙</span></aside>
  <aside class="pw-sidebar"><div class="pw-sidebar-title">Workspace <span>⌘ K</span></div><span class="pw-muted">PROJECTS</span><div class="pw-project selected">{{ studio ? 'Studio operations' : 'Orbit product launch' }} <span>›</span></div><div class="pw-project">{{ studio ? 'Brand refresh' : 'Customer research' }} <span>6</span></div><div class="pw-project">{{ studio ? 'Client onboarding' : 'Design system' }} <span>4</span></div><div class="pw-sidebar-note">Sample navigation<br>Use the tabs and filters to explore the active project.</div><div class="pw-team"><span class="pw-muted">PROJECT TEAM</span><div v-for="(m, i) in members" :key="m"><span class="pw-avatar" :class="`person-${i}`">{{ initials(m) }}</span>{{ m }}</div></div></aside>
  <main class="pw-main"><header class="pw-top"><span>Projects <span class="pw-muted">/</span> {{ title }}</span><div class="pw-faces"><span v-for="(m, i) in members" :key="m" class="pw-avatar" :class="`person-${i}`" :title="m">{{ initials(m) }}</span></div></header>
    <div class="pw-heading"><div><span class="pw-eyebrow">{{ studio ? 'DELIVERY WORKSPACE' : 'PRODUCT WORKSPACE' }}</span><h3>{{ title }}</h3><p>{{ studio ? 'Keep client delivery and studio capacity in one place.' : 'From first impression to a launch worth sharing.' }}</p></div><span class="pw-project-status">● On track</span></div>
    <div class="pw-properties"><span>◷ Due Oct 16</span><span>♧ {{ studio ? 'Northline Studio' : 'Orbit team' }}</span><span>{{ completed }}/{{ tasks.length }} complete</span></div>
    <div class="pw-tabs" role="tablist" :aria-label="`${title} views`"><button v-for="v in ['Overview', 'List', 'Board']" :key="v" role="tab" :aria-selected="view === v" :class="{ active: view === v }" @click="view = v">{{ v }}</button></div>
    <div class="pw-tools"><label><span class="sr-only">Search tasks or team members</span><input v-model="query" type="search" placeholder="Search in project…" /></label><label><span class="sr-only">Priority filter</span><select v-model="priority"><option>All priorities</option><option>High</option><option>Normal</option><option>Low</option></select></label><span class="pw-muted pw-result">{{ filtered.length }} tasks</span></div>
    <div v-if="view === 'Board'" class="pw-board" role="tabpanel"><section v-for="(stage, s) in stages" :key="stage" class="pw-column"><div class="pw-column-title"><span class="pw-status-dot" :class="`stage-${s}`"></span>{{ stage }}<span class="pw-count">{{ filtered.filter(t => t.status === stage).length }}</span></div><button v-for="t in filtered.filter(t => t.status === stage)" :key="t.id" class="pw-task" @click="selected = t.id"><span class="pw-category">{{ t.category }}</span><strong>{{ t.title }}</strong><span class="pw-card-meta"><span :class="{ 'pw-urgent': t.priority === 'High' }">{{ t.priority === 'High' ? '↑' : t.priority === 'Low' ? '↓' : '−' }} {{ t.priority }} · {{ t.due }}</span><span class="pw-avatar" :class="`person-${t.person}`" :title="members[t.person]">{{ initials(members[t.person]) }}</span></span><span class="pw-card-bottom">♧ {{ t.comments }} comments <span>▧ {{ t.files }}</span></span></button><div v-if="!filtered.some(t => t.status === stage)" class="pw-empty-column">No matching tasks</div></section></div>
    <div v-else-if="view === 'List'" class="pw-list" role="tabpanel"><div class="pw-list-head"><span>Task / owner</span><span>Status</span><span>Due date</span></div><button v-for="t in filtered" :key="t.id" @click="selected = t.id"><span><strong>{{ t.title }}</strong><small>{{ members[t.person] }} · {{ t.category }}</small></span><span class="pw-list-status">{{ t.status }}</span><span>{{ t.due }}</span></button><p v-if="!filtered.length" class="pw-no-results">No tasks match these filters.</p></div>
    <div v-else class="pw-overview" role="tabpanel"><div class="pw-metrics"><div><span>Completion</span><strong>{{ percent }}%</strong><progress :value="completed" :max="tasks.length" aria-label="Project completion"></progress></div><div><span>In motion</span><strong>{{ tasks.filter(t => t.status === 'In progress').length }}</strong><small>Tasks being worked on</small></div><div><span>Needs review</span><strong>{{ tasks.filter(t => t.status === 'In review').length }}</strong><small>Ready for a second pair of eyes</small></div></div><div class="pw-overview-grid"><section><h4>Milestones</h4><div class="pw-milestone"><span>✓</span><div>Direction approved<small>Oct 5 · complete</small></div></div><div class="pw-milestone"><span>◉</span><div>{{ studio ? 'Client review' : 'Internal launch review' }}<small>Oct 12 · next checkpoint</small></div></div><div class="pw-milestone"><span>○</span><div>{{ studio ? 'Handoff and retrospective' : 'Public launch' }}<small>Oct 16 · planned</small></div></div></section><section><h4>Team workload</h4><div v-for="(m, i) in members" :key="m" class="pw-workload"><span class="pw-avatar" :class="`person-${i}`">{{ initials(m) }}</span><span>{{ m }}</span><b>{{ tasks.filter(t => t.person === i && t.status !== 'Done').length }} open</b></div></section></div></div>
    <div v-if="view === 'Board' && !filtered.length" class="pw-no-results">No matching tasks. Clear search or choose all priorities.</div>
    <form class="pw-create" @submit.prevent="addTask"><label class="sr-only">New task title</label><input v-model="draft" aria-label="New task title" maxlength="80" placeholder="Add a task to this demo…" /><button type="submit" :disabled="!draft.trim()">+ Add task</button></form><p class="pw-feedback" role="status">{{ notice || 'Demo only. Click any task for details; changes reset when the page reloads.' }}</p>
    <section v-if="active" class="pw-detail" :aria-label="`Details: ${active.title}`"><div class="pw-detail-top"><span class="pw-eyebrow">TASK {{ String(active.id + 1).padStart(3, '0') }}</span><button @click="selected = null" aria-label="Close task details">×</button></div><h4>{{ active.title }}</h4><p>Deliver a clear, reviewed result and attach the final files before moving this task to Done. This description is fictitious.</p><div class="pw-detail-fields"><label>Status<select v-model="active.status" @change="notice = 'Task status updated in this demo only.'"><option v-for="s in stages" :key="s">{{ s }}</option></select></label><div><span>Owner</span><b>{{ members[active.person] }}</b></div><div><span>Priority / due</span><b>{{ active.priority }} · {{ active.due }}</b></div></div><div class="pw-activity"><span class="pw-avatar" :class="`person-${active.person}`">{{ initials(members[active.person]) }}</span><div><b>{{ members[active.person] }}</b><p>Draft is ready. The next step is a team review.</p><small>Sample activity · {{ active.comments }} comments · {{ active.files }} attachments</small></div></div></section>
  </main>
</section>
</template>
