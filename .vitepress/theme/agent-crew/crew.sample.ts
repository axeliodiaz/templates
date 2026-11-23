import type { CrewAgent, CrewHandoff, CrewProject } from './crew.model'

const iso = '2026-11-17T12:00:00Z'

function tool(id: string, name: string, icon: string) {
  return { id, name, icon }
}

function onboardingTree(): CrewAgent {
  return {
    id: 'lead',
    name: 'Lead',
    model: 'Model A · large',
    hue: 'c1',
    icon: 'squares-four-duotone',
    status: 'working',
    activity: 'Coordinating the onboarding fix',
    context: { used: 42000, limit: 200000 },
    tools: [tool('plan', 'Planner', 'flow-arrow-duotone')],
    task: 'Ship the onboarding fix without regressing checkout.',
    startedAt: iso,
    cost: 0.08,
    tokens: { input: 12000, output: 3400 },
    children: [
      {
        id: 'researcher',
        name: 'Researcher',
        model: 'Model B · medium',
        hue: 'c2',
        icon: 'magnifying-glass-duotone',
        status: 'idle',
        activity: 'Standing by',
        context: { used: 28000, limit: 200000 },
        tools: [tool('web', 'Web search', 'notebook-duotone')],
        startedAt: iso,
        children: [
          {
            id: 'web-search',
            name: 'Web search',
            model: null,
            hue: 'c3',
            icon: 'notebook-duotone',
            status: 'idle',
            activity: 'Idle',
            context: { used: 8000, limit: 80000 },
            tools: [],
            startedAt: iso,
          },
        ],
      },
      {
        id: 'coder',
        name: 'Coder',
        model: 'Model B · medium',
        hue: 'c4',
        icon: 'code-duotone',
        status: 'idle',
        activity: 'Waiting for research',
        context: { used: 36000, limit: 200000 },
        tools: [
          tool('lint', 'Linter', 'hammer-duotone'),
          tool('test', 'Test runner', 'git-merge-duotone'),
        ],
        startedAt: iso,
        children: [
          {
            id: 'linter',
            name: 'Linter',
            model: null,
            hue: 'c5',
            icon: 'hammer-duotone',
            status: 'idle',
            activity: 'Idle',
            context: { used: 2000, limit: 50000 },
            tools: [],
            startedAt: iso,
          },
          {
            id: 'test-runner',
            name: 'Test runner',
            model: null,
            hue: 'c6',
            icon: 'git-merge-duotone',
            status: 'idle',
            activity: 'Idle',
            context: { used: 4000, limit: 50000 },
            tools: [],
            startedAt: iso,
          },
        ],
      },
      {
        id: 'reviewer',
        name: 'Reviewer',
        model: 'Model A · large',
        hue: 'c3',
        icon: 'vault-duotone',
        status: 'idle',
        activity: 'Idle',
        context: { used: 22000, limit: 200000 },
        tools: [tool('docs', 'Docs writer', 'notebook-duotone')],
        startedAt: iso,
        children: [
          {
            id: 'docs-writer',
            name: 'Docs writer',
            model: null,
            hue: 'c2',
            icon: 'notebook-duotone',
            status: 'idle',
            activity: 'Idle',
            context: { used: 6000, limit: 80000 },
            tools: [],
            startedAt: iso,
          },
        ],
      },
    ],
  }
}

function auditTree(): CrewAgent {
  return {
    id: 'audit-lead',
    name: 'Lead',
    model: 'Model A · large',
    hue: 'c1',
    icon: 'squares-four-duotone',
    status: 'working',
    activity: 'Tracking dependency audit',
    context: { used: 52000, limit: 200000 },
    tools: [tool('triage', 'Triage board', 'tray-duotone')],
    startedAt: iso,
    children: [
      {
        id: 'scanner',
        name: 'Scanner',
        model: 'Model C · small',
        hue: 'c4',
        icon: 'cpu-duotone',
        status: 'working',
        activity: 'Scanning lockfiles',
        context: { used: 31000, limit: 120000 },
        tools: [tool('vault', 'Vault', 'vault-duotone')],
        startedAt: iso,
      },
      {
        id: 'triage',
        name: 'Triage',
        model: 'Model B · medium',
        hue: 'c2',
        status: 'working',
        activity: 'Ranking CVEs',
        context: { used: 44000, limit: 200000 },
        tools: [tool('changelog', 'Changelog reader', 'git-diff-duotone')],
        startedAt: iso,
        children: [
          {
            id: 'changelog',
            name: 'Changelog reader',
            model: null,
            hue: 'c6',
            icon: 'git-diff-duotone',
            status: 'idle',
            activity: 'Parsing releases',
            context: { used: 12000, limit: 80000 },
            tools: [],
            startedAt: iso,
          },
        ],
      },
    ],
  }
}

function migrateTree(): CrewAgent {
  return {
    id: 'migrate-lead',
    name: 'Lead',
    model: 'Model A · large',
    hue: 'c1',
    icon: 'path-duotone',
    status: 'working',
    activity: 'Coordinating cutover',
    context: { used: 60000, limit: 200000 },
    tools: [],
    startedAt: iso,
    children: [
      {
        id: 'planner',
        name: 'Planner',
        model: 'Model B · medium',
        hue: 'c2',
        status: 'working',
        activity: 'Sequencing batches',
        context: { used: 48000, limit: 200000 },
        tools: [],
        startedAt: iso,
      },
      {
        id: 'migrator',
        name: 'Migrator',
        model: 'Model B · medium',
        hue: 'c4',
        status: 'working',
        activity: 'Copying partitions',
        context: { used: 92000, limit: 200000 },
        tools: [
          tool('backup', 'Backup', 'cloud-duotone'),
          tool('verify', 'Verifier', 'check-square-offset-duotone'),
        ],
        startedAt: iso,
        children: [
          {
            id: 'backup',
            name: 'Backup',
            model: null,
            hue: 'c5',
            icon: 'cloud-duotone',
            status: 'working',
            activity: 'Snapshotting',
            context: { used: 15000, limit: 80000 },
            tools: [],
            startedAt: iso,
          },
          {
            id: 'verifier',
            name: 'Verifier',
            model: null,
            hue: 'c6',
            icon: 'check-square-offset-duotone',
            status: 'idle',
            activity: 'Waiting',
            context: { used: 4000, limit: 80000 },
            tools: [],
            startedAt: iso,
          },
        ],
      },
      {
        id: 'monitor',
        name: 'Monitor',
        model: 'Model C · small',
        hue: 'c3',
        icon: 'broadcast-duotone',
        status: 'working',
        activity: 'Watching lag',
        context: { used: 24000, limit: 120000 },
        tools: [],
        startedAt: iso,
      },
    ],
  }
}

export function projects(): CrewProject[] {
  return [
    { id: 'onboarding', name: 'Ship the onboarding fix', root: onboardingTree() },
    { id: 'audit', name: 'Audit dependencies', root: auditTree() },
    { id: 'migrate', name: 'Migrate the reports database', root: migrateTree() },
  ]
}

export function initialHandoffs(): CrewHandoff[] {
  return []
}

type StepResult = { root: CrewAgent; handoffs: CrewHandoff[]; newHandoffId?: string; announce?: string }

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T
}

function findAgent(root: CrewAgent, id: string): CrewAgent | null {
  if (root.id === id) return root
  for (const child of root.children ?? []) {
    const hit = findAgent(child, id)
    if (hit) return hit
  }
  return null
}

function patch(root: CrewAgent, id: string, patch: Partial<CrewAgent>) {
  const node = findAgent(root, id)
  if (node) Object.assign(node, patch)
}

const STEPS: Array<(root: CrewAgent, handoffs: CrewHandoff[]) => StepResult> = [
  (root, handoffs) => {
    patch(root, 'lead', { status: 'working', activity: 'Drafting the rollout plan' })
    return { root, handoffs, announce: 'Lead drafting rollout plan' }
  },
  (root, handoffs) => {
    patch(root, 'researcher', { status: 'working', activity: 'Tracing checkout regressions' })
    const id = 'h1'
    return {
      root,
      handoffs: [...handoffs, { id, from: 'lead', to: 'researcher', label: 'Investigate empty carts' }],
      newHandoffId: id,
      announce: 'Lead handed to Researcher: Investigate empty carts',
    }
  },
  (root, handoffs) => {
    patch(root, 'web-search', { status: 'working', activity: 'Querying indexed docs' })
    patch(root, 'researcher', { activity: 'Reviewing search hits' })
    return { root, handoffs, announce: 'Web search querying indexed docs' }
  },
  (root, handoffs) => {
    patch(root, 'web-search', { status: 'done', activity: '3 matching sources' })
    patch(root, 'researcher', { status: 'done', activity: 'Found the root cause', last: { from: 'Web search', text: '3 matching sources' } })
    patch(root, 'coder', { status: 'working', activity: 'Implementing the guard' })
    const id = 'h2'
    return {
      root,
      handoffs: [...handoffs, { id, from: 'researcher', to: 'coder', label: 'Guard empty carts' }],
      newHandoffId: id,
      announce: 'Lead handed to Coder: Guard empty carts',
    }
  },
  (root, handoffs) => {
    patch(root, 'linter', { status: 'working', activity: 'Checking style' })
    patch(root, 'coder', { activity: 'Waiting on linter' })
    return { root, handoffs, announce: 'Linter checking style' }
  },
  (root, handoffs) => {
    patch(root, 'linter', { status: 'done', activity: 'Clean' })
    patch(root, 'test-runner', { status: 'working', activity: '182/214 pass' })
    patch(root, 'coder', { activity: 'Fixing failing specs' })
    return { root, handoffs, announce: 'Test runner 182/214 pass' }
  },
  (root, handoffs) => {
    patch(root, 'test-runner', { status: 'working', activity: '214/214 pass' })
    patch(root, 'coder', { activity: 'Tests green' })
    return { root, handoffs, announce: 'Test runner 214/214 pass' }
  },
  (root, handoffs) => {
    patch(root, 'test-runner', { status: 'done', activity: '214/214 pass', last: { from: 'Test runner', text: '214/214 pass' } })
    patch(root, 'coder', {
      status: 'done',
      activity: 'Opened PR #318',
      context: { used: 172000, limit: 200000 },
      last: { from: 'Test runner', text: '214/214 pass' },
      cost: 0.24,
      tokens: { input: 52000, output: 18000 },
    })
    return { root, handoffs, announce: 'Coder opened PR #318' }
  },
  (root, handoffs) => {
    patch(root, 'reviewer', { status: 'working', activity: 'Reading the diff' })
    const id = 'h3'
    return {
      root,
      handoffs: [...handoffs, { id, from: 'coder', to: 'reviewer', label: 'Review PR #318' }],
      newHandoffId: id,
      announce: 'Coder handed to Reviewer: Review PR #318',
    }
  },
  (root, handoffs) => {
    patch(root, 'reviewer', {
      status: 'done',
      activity: 'Approved, ready to merge',
      last: { from: 'Coder', text: 'Review PR #318' },
    })
    return { root, handoffs, announce: 'Reviewer approved PR #318' }
  },
  (root, handoffs) => {
    patch(root, 'lead', { status: 'needs_you', activity: 'Merge PR #318?' })
    return { root, handoffs, announce: 'Lead needs input: Merge PR #318?' }
  },
  (root, handoffs) => ({ root, handoffs }),
]

export const STEP_COUNT = STEPS.length

export function resetProject(projectId: string): StepResult {
  const project = projects().find(p => p.id === projectId)!
  return { root: clone(project.root), handoffs: [], announce: 'Demo reset to step 0' }
}

export function applyStep(projectId: string, stepIndex: number): StepResult {
  if (projectId !== 'onboarding') return resetProject(projectId)
  const cursor = Math.min(Math.max(stepIndex, 0), STEPS.length - 1)
  let result = resetProject(projectId)
  for (let i = 0; i <= cursor; i++) result = STEPS[i](clone(result.root), result.handoffs)
  return result
}