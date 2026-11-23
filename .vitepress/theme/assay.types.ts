export type RunStatus =
  | "queued"
  | "running"
  | "passed"
  | "failed"
  | "cancelled";
export type CaseStatus = "pass" | "fail";
export type TraceStepStatus = "done" | "current" | "pending";
export type TraceStepKind =
  | "plan"
  | "tool_call"
  | "observation"
  | "answer"
  | "finalize";
export type DeltaDirection = "up" | "down" | "flat";

export interface AssayDelta {
  direction: DeltaDirection;
  label: string;
}

export interface AssayKpi {
  id: "pass-rate" | "regressions" | "latency" | "cost";
  label: string;
  value: string;
  delta: AssayDelta;
  sparkline: number[];
}

export interface AssayModelSeries {
  id: string;
  label: string;
  color: "accent" | "mid" | "ink";
  points: number[];
}

export interface AssayCommit {
  sha: string;
  current?: boolean;
}

export interface AssayHeatCell {
  tool: string;
  suite: string;
  passPct: number;
}

export interface AssayFailingCase {
  id: string;
  expected: string;
  got: string;
  toolChain: string[];
  status: CaseStatus;
}

export interface AssayTraceStep {
  id: string;
  kind: TraceStepKind;
  title: string;
  detail: string;
  extra?: string;
  chip?: string;
  at?: string;
  status: TraceStepStatus;
}

export interface AssayUsage {
  planName: string;
  label: string;
  percent: number;
  amount: string;
}

export interface AssayNavItem {
  id: string;
  label: string;
  icon: string;
}

export interface AssayRun {
  agent: string;
  runId: string;
  breadcrumb: string[];
  status: RunStatus;
  progress?: { current: number; total: number };
  kpis: AssayKpi[];
  commits: AssayCommit[];
  models: AssayModelSeries[];
  currentPassRate: string;
  suites: string[];
  tools: string[];
  heatmap: AssayHeatCell[];
  failing: AssayFailingCase[];
  failingTotal: number;
  trace: AssayTraceStep[];
  traceLive: boolean;
  usage: AssayUsage;
}

export interface AssayLabels {
  brand: string;
  eyebrow: string;
  running: (c: number, t: number) => string;
  compare: string;
  live: string;
  passRateByCommit: string;
  current: string;
  mcpToolAccuracy: string;
  heatmapHint: string;
  low: string;
  high: string;
  failingCases: string;
  casesBadge: (n: number) => string;
  colCaseId: string;
  colExpected: string;
  colGot: string;
  colToolChain: string;
  colStatus: string;
  viewAllFailing: string;
  usageThisMonth: string;
  viewBilling: string;
  openNav: string;
  closeNav: string;
}

export interface AssayConfig {
  run: AssayRun;
  nav: AssayNavItem[];
  activeNav: string;
  labels?: Partial<AssayLabels>;
}
