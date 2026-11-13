<script setup lang="ts">
import {
  computed,
  ref,
  onMounted,
  onBeforeUnmount,
  watch,
  nextTick,
} from "vue";
import type { AssayConfig } from "./assay.types";
import { assaySample, assayLabels } from "./assay.sample";
import { mountAssayMotion } from "./assay.motion";
import AssayKpis from "./AssayKpis.vue";
import AssayPassChart from "./AssayPassChart.vue";
import AssayHeatmap from "./AssayHeatmap.vue";
import AssayFailingCases from "./AssayFailingCases.vue";
import AssayLiveTrace from "./AssayLiveTrace.vue";
const props = defineProps<{ config?: AssayConfig }>();
const emit = defineEmits<{
  "select-nav": [id: string];
  compare: [];
  "view-billing": [];
  "view-all-failing": [];
  "select-case": [id: string];
  "select-commit": [sha: string];
}>();
const cfg = computed(() => props.config ?? assaySample),
  run = computed(() => cfg.value.run),
  labels = computed(() => ({ ...assayLabels, ...cfg.value.labels }));
const root = ref<HTMLElement>(),
  dialog = ref<HTMLDialogElement>(),
  navDialog = ref<HTMLDialogElement>(),
  menuButton = ref<HTMLButtonElement>(),
  active = ref(cfg.value.activeNav),
  dialogTitle = ref(""),
  dialogBody = ref("");
let stop: undefined | (() => void),
  returnFocus: HTMLElement | null = null;
function skipMain(event: MouseEvent) {
  event.preventDefault();
  const main = root.value?.querySelector<HTMLElement>("main");
  main?.focus();
  main?.scrollIntoView();
}
function show(title: string, body: string) {
  returnFocus = document.activeElement as HTMLElement;
  dialogTitle.value = title;
  dialogBody.value = body;
  dialog.value?.showModal();
}
function restoreFocus() {
  returnFocus?.focus();
}
function close() {
  dialog.value?.close();
  returnFocus?.focus();
}
function select(id: string) {
  active.value = id;
  emit("select-nav", id);
  navDialog.value?.close();
  menuButton.value?.focus();
}
function compare() {
  emit("compare");
  show(
    labels.value.compare,
    "Comparison is coming in a later version. This sample does not connect to a backend.",
  );
}
function billing() {
  emit("view-billing");
  show(
    "Team plan",
    "Sample usage only. No billing account is connected and no payment is made.",
  );
}
function allFailing() {
  emit("view-all-failing");
  show(
    "All failing cases",
    `${run.value.failing.length} of ${run.value.failingTotal} sample cases are provided. The remaining case is not included in this fixture.`,
  );
}
function caseDetail(id: string) {
  emit("select-case", id);
  const c = run.value.failing.find((c) => c.id === id);
  if (c)
    show(
      id,
      `Expected: ${c.expected}. Got: ${c.got}. Tool call chain: ${c.toolChain.join(" → ")}.`,
    );
}
function commit(sha: string) {
  emit("select-commit", sha);
  const i = run.value.commits.findIndex((c) => c.sha === sha);
  show(
    `Commit ${sha}`,
    run.value.models.map((m) => `${m.label}: ${m.points[i]}%`).join("; "),
  );
}
watch(
  () => cfg.value.activeNav,
  (id) => (active.value = id),
);
watch([active, cfg], async () => {
  await nextTick();
  if (root.value) {
    stop?.();
    stop = mountAssayMotion(root.value);
  }
});
onMounted(() => {
  if (root.value) stop = mountAssayMotion(root.value);
});
onBeforeUnmount(() => stop?.());
</script>
<template>
  <div ref="root" class="assay assay-bs6" lang="en" data-bs-theme="light">
    <a class="as-skip" href="#assay-main" @click="skipMain"
      >Skip to run dashboard</a
    >
    <div class="as-frame">
      <aside class="as-rail">
        <a class="as-brand" href="/assay"
          ><span aria-hidden="true">✳</span>{{ labels.brand }}</a
        >
        <p class="as-eyebrow">{{ labels.eyebrow }}</p>
        <nav aria-label="Assay">
          <button
            v-for="n in cfg.nav"
            :key="n.id"
            :aria-current="active === n.id ? 'page' : undefined"
            @click="select(n.id)"
          >
            <span aria-hidden="true">{{ n.icon }}</span
            >{{ n.label }}
          </button>
        </nav>
        <section class="as-usage">
          <strong>{{ run.usage.planName }}</strong>
          <p>{{ labels.usageThisMonth }}</p>
          <p>{{ run.usage.percent }}% · {{ run.usage.amount }}</p>
          <progress
            :value="run.usage.percent"
            max="100"
            :aria-label="labels.usageThisMonth"
          /><button @click="billing">{{ labels.viewBilling }} ↗</button>
        </section>
      </aside>
      <main id="assay-main" tabindex="-1">
        <header class="as-topbar">
          <button
            ref="menuButton"
            class="as-menu"
            :aria-label="labels.openNav"
            @click="navDialog?.showModal()"
          >
            ☰
          </button>
          <p class="as-breadcrumb">
            <template v-for="(part, i) in run.breadcrumb" :key="i"
              ><span v-if="i" aria-hidden="true"> / </span
              ><strong v-if="i === run.breadcrumb.length - 1">{{ part }}</strong
              ><span v-else>{{ part }}</span></template
            >
          </p>
          <div class="as-top-actions">
            <span class="as-status" aria-live="polite"
              ><i v-if="run.status === 'running'" class="as-dot" />{{
                run.status === "running" && run.progress
                  ? labels.running(run.progress.current, run.progress.total)
                  : run.status
              }}<span aria-hidden="true" class="as-mini-spark">⌁</span></span
            ><button class="as-compare" @click="compare">
              ⇄ {{ labels.compare }}
            </button>
          </div>
        </header>
        <div v-if="active === 'runs'" class="as-content">
          <h1 class="as-sr">{{ run.agent }} evaluation run {{ run.runId }}</h1>
          <AssayKpis :kpis="run.kpis" />
          <div class="as-upper">
            <AssayPassChart
              :run="run"
              :labels="labels"
              @select-commit="commit"
            /><AssayLiveTrace :run="run" :labels="labels" />
          </div>
          <div class="as-lower">
            <AssayHeatmap :run="run" :labels="labels" /><AssayFailingCases
              :run="run"
              :labels="labels"
              @select-case="caseDetail"
              @view-all-failing="allFailing"
            />
          </div>
          <p class="as-demo-note">
            Sample data only. No models, tools, inboxes or billing accounts are
            connected. <a href="/assay">Assay guide</a>
          </p>
        </div>
        <section v-else class="as-empty">
          <h1>{{ cfg.nav.find((n) => n.id === active)?.label ?? active }}</h1>
          <p>
            No
            {{
              active === "suites"
                ? "suite"
                : active === "models"
                  ? "model"
                  : active === "mcp-tools"
                    ? "MCP tool"
                    : active === "datasets"
                      ? "dataset"
                      : "trace"
            }}
            selected.
          </p>
          <p>
            This section is a preview. Choose Runs to return to the sample
            evaluation.
          </p>
          <button @click="select('runs')">Back to Runs</button>
        </section>
      </main>
    </div>
    <dialog ref="navDialog" class="as-nav-dialog" @close="menuButton?.focus()">
      <header>
        <strong>{{ labels.brand }}</strong
        ><button :aria-label="labels.closeNav" @click="navDialog?.close()">
          ×
        </button>
      </header>
      <nav aria-label="Assay mobile">
        <button
          v-for="n in cfg.nav"
          :key="n.id"
          :aria-current="active === n.id ? 'page' : undefined"
          @click="select(n.id)"
        >
          <span aria-hidden="true">{{ n.icon }}</span
          >{{ n.label }}
        </button>
      </nav>
      <section class="as-usage">
        <strong>{{ run.usage.planName }}</strong>
        <p>{{ labels.usageThisMonth }}</p>
        <p>{{ run.usage.percent }}% · {{ run.usage.amount }}</p>
        <progress
          :value="run.usage.percent"
          max="100"
          :aria-label="labels.usageThisMonth"
        /><button
          @click="
            navDialog?.close();
            billing();
          "
        >
          {{ labels.viewBilling }} ↗
        </button>
      </section>
    </dialog>
    <dialog
      ref="dialog"
      class="as-dialog"
      aria-labelledby="as-dialog-title"
      @close="restoreFocus"
    >
      <h2 id="as-dialog-title">{{ dialogTitle }}</h2>
      <p>{{ dialogBody }}</p>
      <button @click="close">Close</button>
    </dialog>
  </div>
</template>
