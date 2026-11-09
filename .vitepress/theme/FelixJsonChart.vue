<script setup>
import { computed, ref, useId, watch } from "vue";
import { resolveSpec, chartGeometry, COMPONENTS } from "./felix-chart-spec.mjs";
const props = defineProps({
  spec: { type: Object, required: true },
  sources: { type: Object, required: true },
});
function sampleSources() {
  return JSON.parse(
    JSON.stringify({
      [props.spec.data.source]: props.sources[props.spec.data.source],
    }),
  );
}
const uid = useId(),
  tab = ref("Preview"),
  applied = ref(JSON.parse(JSON.stringify(props.spec))),
  localSources = ref(sampleSources()),
  draft = ref(JSON.stringify(props.spec, null, 2)),
  sourceDraft = ref(JSON.stringify(sampleSources(), null, 2)),
  error = ref(""),
  selected = ref(-1),
  markReadout = ref(""),
  revision = ref(0),
  state = ref("ready"),
  dataView = ref(false);
watch(() => props.spec, reset);
const result = computed(() => {
  try {
    return { model: resolveSpec(applied.value, localSources.value) };
  } catch (e) {
    return { error: e.message };
  }
});
const model = computed(() => result.value.model),
  geometry = computed(() =>
    model.value
      ? chartGeometry({
          ...model.value,
          options: { ...model.value.options, state: state.value },
        })
      : null,
  );
const status = computed(() => {
  if (markReadout.value) return markReadout.value;
  const m = model.value;
  if (!m) return "";
  const row = m.originalRows[selected.value];
  return row
    ? m.headers
        .map(
          (h) => `${h}: ${Array.isArray(row[h]) ? row[h].join(", ") : row[h]}`,
        )
        .join(" · ")
    : `${m.rows.length} rows from ${m.source}. Focus a mark or a data row to read exact values.`;
});
function render() {
  try {
    if (draft.value.length > 50000 || sourceDraft.value.length > 250000)
      throw Error(
        "Input is too large. Spec maximum50KB, sources maximum250KB.",
      );
    const spec = JSON.parse(draft.value),
      sources = JSON.parse(sourceDraft.value);
    resolveSpec(spec, sources);
    applied.value = spec;
    localSources.value = sources;
    selected.value = -1;
    markReadout.value = "";
    error.value = "";
    revision.value++;
    tab.value = "Preview";
  } catch (e) {
    error.value = e.message;
  }
}
function reset() {
  applied.value = JSON.parse(JSON.stringify(props.spec));
  localSources.value = sampleSources();
  draft.value = JSON.stringify(props.spec, null, 2);
  sourceDraft.value = JSON.stringify(sampleSources(), null, 2);
  error.value = "";
  selected.value = -1;
  markReadout.value = "";
  revision.value++;
  state.value = "ready";
  dataView.value = false;
}
function keyTab(e, i) {
  if (!["ArrowRight", "ArrowLeft", "Home", "End"].includes(e.key)) return;
  e.preventDefault();
  const a = ["Preview", "Spec", "Example"];
  const n =
    e.key === "Home"
      ? 0
      : e.key === "End"
        ? 2
        : (i + (e.key === "ArrowRight" ? 1 : 2)) % 3;
  tab.value = a[n];
  document.getElementById(uid + "-tab-" + n)?.focus();
}
function describe(m) {
  return (
    m.readout ||
    model.value.headers
      .map((h) => `${h}: ${model.value.originalRows[m.index]?.[h] ?? ""}`)
      .join(" · ")
  );
}
function activate(m) {
  selected.value = m.index;
  markReadout.value = describe(m);
}
function markAttrs(mark) {
  const {
    type,
    color,
    index,
    label,
    readout,
    semanticColor,
    fill,
    outline,
    opacity,
    strokeWidth,
    dash,
    ...attrs
  } = mark;
  return {
    ...attrs,
    fill:
      (["line", "path"].includes(type) && !fill) || outline ? "none" : color,
    stroke: color,
    "stroke-width": strokeWidth ?? (type === "path" ? 2.5 : 1),
    "stroke-dasharray": dash,
    opacity: opacity ?? 1,
  };
}
</script>
<template>
  <section class="fj-chart" :aria-label="model?.title || 'JSON chart'">
    <div class="fj-tabs" role="tablist" aria-label="Chart documentation">
      <button
        v-for="(name, i) in ['Preview', 'Spec', 'Example']"
        :id="uid + '-tab-' + i"
        :key="name"
        type="button"
        role="tab"
        :aria-selected="tab === name"
        :tabindex="tab === name ? 0 : -1"
        :aria-controls="uid + '-panel'"
        @click="tab = name"
        @keydown="keyTab($event, i)"
      >
        {{ name }}
      </button>
    </div>
    <div
      :id="uid + '-panel'"
      role="tabpanel"
      :aria-labelledby="
        uid + '-tab-' + ['Preview', 'Spec', 'Example'].indexOf(tab)
      "
      tabindex="0"
    >
      <div v-if="tab === 'Preview'">
        <p v-if="result.error" role="alert">{{ result.error }}</p>
        <template v-else>
          <header class="fj-head">
            <h3>{{ model.title }}</h3>
            <p v-if="model.subtitle">{{ model.subtitle }}</p>
          </header>
          <div class="fj-toolbar">
            <button type="button" @click="revision++">Replay motion</button
            ><button
              type="button"
              :aria-pressed="dataView"
              @click="dataView = !dataView"
            >
              {{ dataView ? "Chart view" : "Data view" }}</button
            ><label
              >Data state
              <select v-model="state">
                <option value="ready">Ready</option>
                <option value="loading">Loading</option>
                <option value="empty">Empty</option>
              </select></label
            >
          </div>
          <p v-if="state !== 'ready'" role="status" class="fj-state">
            {{
              state === "loading"
                ? "Loading demonstration. No request is running."
                : "No data in this demonstration state."
            }}
          </p>
          <p v-else-if="!model.rows.length" role="status" class="fj-state">
            No rows match this spec. Change its filters or source.
          </p>
          <template v-else>
            <svg
              v-if="!dataView"
              :key="revision"
              class="fj-plot"
              :viewBox="`0 0 ${geometry.width} ${geometry.height}`"
              role="img"
              :aria-label="model.title + '. Exact values are in Data view.'"
            >
              <title>{{ model.title }}</title>
              <g class="fj-grid">
                <line v-for="(l, i) in geometry.lines" :key="i" v-bind="l" />
              </g>
              <component
                :is="m.type"
                v-for="(m, i) in geometry.marks"
                :key="'mark' + i"
                v-bind="markAttrs(m)"
                :class="{ 'fj-selected': selected === m.index }"
                tabindex="0"
                role="button"
                :aria-label="describe(m)"
                @mouseenter="activate(m)"
                @focus="activate(m)"
                @click="activate(m)"
                @keydown.enter.prevent="activate(m)"
                @keydown.space.prevent="activate(m)"
              >
                <title>{{ describe(m) }}</title>
              </component>
              <text
                v-for="(t, i) in geometry.texts"
                :key="'text' + i"
                :x="t.x"
                :y="t.y"
                :text-anchor="t.anchor"
              >
                {{ t.value }}
              </text>
            </svg>
            <p class="fj-readout" role="status">{{ status }}</p>
            <div
              v-if="dataView"
              class="fj-table-scroll"
              tabindex="0"
              aria-label="Exact chart data"
            >
              <table>
                <caption>
                  {{
                    model.title
                  }}
                  · source
                  {{
                    model.source
                  }}
                </caption>
                <thead>
                  <tr>
                    <th v-for="h in model.headers" :key="h" scope="col">
                      {{ h }}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(r, i) in model.originalRows"
                    :key="i"
                    tabindex="0"
                    :class="{ active: selected === i }"
                    @focus="
                      selected = i;
                      markReadout = '';
                    "
                    @click="
                      selected = i;
                      markReadout = '';
                    "
                  >
                    <td v-for="h in model.headers" :key="h">
                      {{ Array.isArray(r[h]) ? r[h].join(", ") : r[h] }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </template>
          <p v-if="model.insight" class="fj-insight">{{ model.insight }}</p>
          <p v-for="w in model.warnings" :key="w" class="fj-warning">{{ w }}</p>
          <p class="fj-source">
            Synthetic local data · {{ applied.component }} · {{ model.source }}
          </p>
        </template>
      </div>
      <div v-else-if="tab === 'Spec'" class="fj-spec">
        <p>
          <code>{{ applied.component }}.json</code>
        </p>
        <pre
          tabindex="0"
        ><code>{{ JSON.stringify(applied,null,2) }}</code></pre>
        <p>
          Data stays in a named source; the spec chooses columns and options.
          Open Example to edit both locally.
        </p>
      </div>
      <div v-else class="fj-editor">
        <p>
          Change the component, source, filters, encoding or supported options,
          then render. Edit the separate source registry to try your own
          numbers. Nothing is sent or saved.
        </p>
        <details>
          <summary>Available renderers</summary>
          <p class="fj-components">{{ COMPONENTS.join(", ") }}</p>
        </details>
        <label :for="uid + '-json'">Chart spec JSON</label
        ><textarea
          :id="uid + '-json'"
          v-model="draft"
          spellcheck="false"
          rows="18"
        />
        <details>
          <summary>Edit local source data JSON</summary>
          <label :for="uid + '-source'"
            >Source registry with headers and rows</label
          ><textarea
            :id="uid + '-source'"
            v-model="sourceDraft"
            spellcheck="false"
            rows="14"
          />
        </details>
        <div class="fj-actions">
          <button type="button" class="fj-primary" @click="render">
            Render JSON</button
          ><button type="button" @click="reset">Reset example</button>
        </div>
        <p v-if="error" role="alert" class="fj-error">
          {{ error }} The last valid preview is unchanged.
        </p>
      </div>
    </div>
  </section>
</template>
<style scoped>
.fj-chart {
  --fj-c1: #0da4a3;
  --fj-c2: #527d7c;
  --fj-c3: #6266cc;
  --fj-c4: #f26629;
  --fj-c5: #d5a32a;
  --fj-card: #fff;
  --fj-ink: #082422;
  --fj-muted: #52706e;
  --fj-border: #d9d7cf;
  color: var(--fj-ink);
  min-width: 0;
  margin: 28px 0;
}
.fj-tabs {
  display: inline-flex;
  border-radius: 999px;
  background: var(--vp-c-bg-soft);
  padding: 4px;
  margin: 0 0 18px;
  gap: 3px;
}
.fj-tabs button {
  border: 0;
  border-radius: 999px;
  padding: 8px 16px;
  color: var(--vp-c-text-2);
}
.fj-tabs button[aria-selected="true"] {
  background: var(--fj-card);
  box-shadow: 0 1px 6px #08242225;
  color: var(--fj-ink);
}
.fj-head h3 {
  margin: 0 !important;
  border: 0 !important;
  padding: 0 !important;
  font-size: 20px;
  line-height: 1.35;
}
.fj-head p {
  margin: 6px 0 0;
  color: var(--fj-muted);
  font-size: 13px;
}
.fj-head {
  margin-bottom: 16px;
}
.fj-toolbar,
.fj-actions {
  display: flex;
  gap: 8px;
  align-items: center;
  flex-wrap: wrap;
}
.fj-toolbar label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
}
.fj-chart button,
.fj-chart select {
  font: inherit;
  font-size: 13px;
  cursor: pointer;
}
.fj-toolbar button,
.fj-actions button,
.fj-toolbar select {
  border: 1px solid var(--fj-border);
  border-radius: 9px;
  padding: 7px 11px;
  background: var(--fj-card);
  color: var(--fj-ink);
}
.fj-plot {
  display: block;
  width: 100%;
  height: auto;
  min-height: 180px;
  background: var(--fj-card);
  border: 1px solid var(--fj-border);
  border-radius: 22px;
  margin-top: 16px;
  overflow: visible;
  animation: fj-reveal 0.35s ease-out;
}
.fj-plot text {
  fill: var(--fj-ink);
  font-size: 11px;
  pointer-events: none;
}
.fj-plot [tabindex] {
  cursor: pointer;
  transition: opacity 0.15s;
}
.fj-selected {
  filter: drop-shadow(0 0 2px var(--fj-c1));
  stroke: var(--fj-ink) !important;
  stroke-width: 2.5 !important;
}
.fj-grid line {
  stroke: var(--fj-border);
  stroke-dasharray: 3 4;
}
.fj-readout {
  font-size: 13px;
  min-height: 44px;
  margin: 12px 0;
  overflow-wrap: anywhere;
}
.fj-source,
.fj-warning {
  font-size: 12px;
  color: var(--fj-muted);
  line-height: 1.6;
}
.fj-insight {
  padding-left: 12px;
  border-left: 3px solid var(--fj-c1);
}
.fj-table-scroll {
  overflow: auto;
  max-height: 450px;
  border: 1px solid var(--fj-border);
  border-radius: 12px;
}
.fj-chart table {
  margin: 0 !important;
  display: table !important;
  min-width: 100%;
  font-size: 12px;
}
.fj-chart caption {
  text-align: left;
  padding: 10px;
}
.fj-chart td,
.fj-chart th {
  white-space: nowrap;
}
.fj-chart tr.active {
  background: var(--vp-c-brand-soft);
}
.fj-chart textarea {
  display: block;
  box-sizing: border-box;
  width: 100%;
  max-width: 100%;
  resize: vertical;
  border: 1px solid var(--fj-border);
  border-radius: 12px;
  padding: 12px;
  font: 12px/1.65 var(--vp-font-family-mono);
  background: var(--fj-card);
  color: var(--fj-ink);
  tab-size: 2;
}
.fj-chart label {
  font-weight: 600;
}
.fj-editor details {
  margin: 14px 0;
}
.fj-components {
  font: 12px/1.8 var(--vp-font-family-mono);
  overflow-wrap: anywhere;
}
.fj-actions {
  margin: 16px 0;
}
.fj-actions .fj-primary {
  background: var(--fj-c1);
  color: #082422;
  font-weight: 700;
}
.fj-error {
  border: 1px solid #bf4639;
  border-radius: 10px;
  padding: 12px;
  color: var(--vp-c-danger-1);
}
.fj-state {
  padding: 40px 18px;
  background: var(--vp-c-bg-soft);
  border-radius: 16px;
}
.fj-spec pre {
  white-space: pre;
  overflow: auto;
  padding: 16px;
  border: 1px solid var(--fj-border);
  border-radius: 12px;
  background: var(--fj-card);
  font: 12px/1.7 var(--vp-font-family-mono);
}
.fj-chart :is(button, textarea, select, [tabindex]):focus-visible {
  outline: 2px solid var(--fj-c1);
  outline-offset: 3px;
}
@keyframes fj-reveal {
  from {
    opacity: 0.35;
    transform: translateY(4px);
  }
  to {
    opacity: 1;
    transform: none;
  }
}
@media (prefers-reduced-motion: reduce) {
  .fj-plot {
    animation: none;
  }
  .fj-plot [tabindex] {
    transition: none;
  }
}
@media (max-width: 500px) {
  .fj-tabs button {
    padding: 8px 13px;
  }
  .fj-toolbar {
    gap: 6px;
  }
  .fj-toolbar button,
  .fj-toolbar select {
    font-size: 12px;
    padding: 6px;
  }
  .fj-plot text {
    font-size: 18px;
  }
}
:global(html.felix-dark .fj-chart) {
  --fj-c1: #2bf2f1;
  --fj-c2: #8cacab;
  --fj-c3: #8689ec;
  --fj-c4: #f26629;
  --fj-c5: #f1be45;
  --fj-card: #1a2928;
  --fj-ink: #fefcf9;
  --fj-muted: #cfcabf;
  --fj-border: #35605f;
}
</style>
