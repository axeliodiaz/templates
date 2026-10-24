/**
 * Felix decision tree.
 *
 * Portable browser module: no Vue, no graph library. Mount it on any element
 * that lives under Felix tokens (or the fallback palette in decision-tree.css).
 *
 *   import { initDecisionTree } from './decision-tree'
 *   import './decision-tree.css'
 *
 *   const tree = initDecisionTree(element, {
 *     decisions,
 *     onCommit(step) {},
 *     onComplete({ history }) {},
 *   })
 *
 * DOM events (bubble from the root): dt-step, dt-commit, dt-advance,
 * dt-complete, dt-back, dt-preview. Callbacks receive the same detail objects.
 */

export type RiskLevel = 'low' | 'medium' | 'high'

export type DecisionNote = {
  /** Defaults to "Agent's note". */
  title?: string
  body: string
  source?: string
}

export type DecisionOption = {
  id: string
  title: string
  /** 1–9. Assigned from sibling order when omitted. */
  shortcut?: number
  agentPick?: boolean
  /** Short warning shown as a status badge. */
  warning?: string
  /** Floating callout while this option is hovered, focused, or committed. */
  note?: DecisionNote
  /** Free-text leaf. Reveals an input on hover or focus. */
  other?: boolean
  otherPlaceholder?: string
  /** Shown after an Other… answer is sent, then the queue advances. */
  agentReply?: string
  /** Label above this option's child column. */
  columnLabel?: string
  children?: DecisionOption[]
}

export type DecisionAgent = {
  name: string
  /** Model or role line under the name. */
  model?: string
}

export type Decision = {
  id: string
  risk: RiskLevel
  riskLabel?: string
  agent: DecisionAgent
  question: string
  /** Muted context under the question. */
  context: string
  /** Label above the first option column. */
  columnLabel?: string
  options: DecisionOption[]
}

export type DecisionPathItem = {
  id: string
  title: string
  shortcut: number
}

export type DecisionStepDetail = {
  decisionId: string
  optionId: string
  title: string
  shortcut: number
  depth: number
  path: DecisionPathItem[]
  leaf: boolean
  text?: string
  agent: string
}

export type DecisionAdvanceDetail = {
  fromId: string
  toId: string | null
  index: number
  decision: Decision | null
}

export type DecisionTreePhase = 'choose' | 'approved' | 'reply' | 'leaving' | 'empty'

export type DecisionTreeState = {
  index: number
  total: number
  remaining: number
  path: string[]
  phase: DecisionTreePhase
  decisionId: string | null
  done: boolean
  history: DecisionStepDetail[]
}

export type DecisionTreeOptions = {
  decisions: Decision[]
  /** Move to the next decision after a leaf. Default true. */
  autoAdvance?: boolean
  /** How long the approved leaf stays before advancing. Default 1000. */
  advanceDelay?: number
  initialIndex?: number
  /** Option ids committed on the first decision. */
  initialPath?: string[]
  /** Option id kept in view until the pointer or focus moves. */
  lockPreview?: string
  /** `empty` skips the queue. `approved` freezes initialPath on its leaf. */
  phase?: 'queue' | 'approved' | 'empty'
  onStep?: (detail: DecisionStepDetail) => void
  onCommit?: (detail: DecisionStepDetail) => void
  onAdvance?: (detail: DecisionAdvanceDetail) => void
  onComplete?: (detail: { history: DecisionStepDetail[] }) => void
  onBack?: (detail: { decisionId: string; path: DecisionPathItem[] }) => void
  onPreview?: (detail: { decisionId: string; optionId: string | null }) => void
}

export type DecisionTreeHandle = {
  destroy: () => void
  reset: () => void
  getState: () => DecisionTreeState
}

type Flat = {
  id: string
  parentId: string | null
  depth: number
  option: DecisionOption
  shortcut: number
  childIds: string[]
}

const RISK_LABEL: Record<RiskLevel, string> = {
  low: 'Low risk',
  medium: 'Medium risk',
  high: 'High risk',
}

const SVG_NS = 'http://www.w3.org/2000/svg'

export function initDecisionTree(root: HTMLElement, options: DecisionTreeOptions): DecisionTreeHandle {
  const decisions = options.decisions ?? []
  const autoAdvance = options.autoAdvance !== false
  const advanceDelay = options.advanceDelay ?? 1200
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)')

  let index = 0
  let path: string[] = []
  let preview: string | null = null
  let phase: DecisionTreePhase = 'choose'
  let approvedId: string | null = null
  let leafTitle = 'Approved · running'
  let history: DecisionStepDetail[] = []
  let flats: Flat[] = []
  let flatById = new Map<string, Flat>()
  let dead = false
  let timer = 0
  let streamTimer = 0
  const drawnEdges = new Set<string>()

  root.classList.add('dt')
  root.setAttribute('role', 'region')
  root.setAttribute('aria-label', 'Agent decisions')
  root.replaceChildren()

  root.innerHTML = `
    <header class="dt-head">
      <p class="dt-title" data-dt-heading>Decisions · <span data-dt-waiting>0 waiting</span></p>
      <div class="dt-progress" data-dt-progress>
        <span class="dt-fraction" data-dt-fraction></span>
        <span class="dt-dots" data-dt-dots aria-hidden="true"></span>
      </div>
    </header>
    <div class="dt-viewport">
      <div class="dt-deck">
        <div class="dt-stage">
          <svg class="dt-edges" aria-hidden="true"></svg>
          <div class="dt-columns"></div>
        </div>
      </div>
      <div class="dt-empty" hidden>
        <div class="dt-empty-mark" aria-hidden="true">
          <svg viewBox="0 0 16 16" width="22" height="22"><path d="M3.2 8.2 6.4 11.4 12.8 4.6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </div>
        <h3>All decided</h3>
        <p>New decisions from your agents show up here.</p>
        <button type="button" class="dt-again">Review the queue</button>
      </div>
    </div>
    <footer class="dt-foot">
      <p class="dt-hints" id="${uid(root)}-hints"></p>
    </footer>
    <div class="dt-sr" data-dt-live aria-live="polite" aria-atomic="true"></div>
  `
  root.setAttribute('aria-describedby', `${uid(root)}-hints`)

  const waitingEl = q<HTMLElement>('[data-dt-waiting]')
  const fractionEl = q<HTMLElement>('[data-dt-fraction]')
  const dotsEl = q<HTMLElement>('[data-dt-dots]')
  const progressEl = q<HTMLElement>('[data-dt-progress]')
  const viewport = q<HTMLElement>('.dt-viewport')
  const deck = q<HTMLElement>('.dt-deck')
  const stage = q<HTMLElement>('.dt-stage')
  const svg = q<SVGSVGElement>('.dt-edges')
  const columns = q<HTMLElement>('.dt-columns')
  const emptyEl = q<HTMLElement>('.dt-empty')
  const hintsEl = q<HTMLElement>('.dt-hints')
  const liveEl = q<HTMLElement>('[data-dt-live]')

  const onClick = (event: Event) => {
    const target = event.target as HTMLElement
    if (target.closest('.dt-again')) {
      reset()
      return
    }
    const hit = target.closest('.dt-hit')
    const id = hit?.closest('.dt-option')?.getAttribute('data-id')
    if (id) choose(id)
  }
  const onSubmit = (event: Event) => {
    const form = event.target as HTMLFormElement
    if (!form.classList?.contains('dt-other')) return
    event.preventDefault()
    const id = form.closest('.dt-option')?.getAttribute('data-id')
    const input = form.querySelector('input')
    if (id && input) submitOther(id, input.value)
  }
  const onKey = (event: KeyboardEvent) => {
    if (dead || !root.contains(event.target as Node)) return
    const typing = (event.target as HTMLElement).matches('input, textarea')
    if (event.key === 'Escape') {
      event.preventDefault()
      if (typing) {
        ;(event.target as HTMLElement).blur()
        return
      }
      back()
      return
    }
    if (typing) {
      if (event.key === 'Enter') {
        event.preventDefault()
        const form = (event.target as HTMLElement).closest('form')
        form?.requestSubmit()
      }
      return
    }
    if (phase !== 'choose') {
      if (event.key === 'ArrowLeft') {
        event.preventDefault()
        back()
      }
      return
    }
    if (event.key === 'ArrowLeft') {
      event.preventDefault()
      back()
      return
    }
    if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
      event.preventDefault()
      moveFocus(event.key === 'ArrowDown' ? 1 : -1)
      return
    }
    if (event.key === 'ArrowRight') {
      event.preventDefault()
      const id = focusedOptionId()
      if (id) choose(id)
      return
    }
    if (/^[1-9]$/.test(event.key)) {
      const sib = activeSiblings().find(item => item.shortcut === Number(event.key))
      if (!sib) return
      event.preventDefault()
      choose(sib.id)
    }
  }
  const onFocusIn = (event: FocusEvent) => {
    const id = (event.target as HTMLElement).closest?.('.dt-option')?.getAttribute('data-id')
    if (id && phase === 'choose') setPreview(id)
  }
  const onMouseOver = (event: MouseEvent) => {
    if (phase !== 'choose') return
    const id = (event.target as HTMLElement).closest?.('.dt-option')?.getAttribute('data-id')
    if (!id || isOut(id)) return
    setPreview(id)
  }
  const onMouseOut = (event: MouseEvent) => {
    const next = event.relatedTarget as Node | null
    if (next && root.contains(next)) return
    setPreview(options.lockPreview ?? null)
  }
  const onMotion = () => {
    root.classList.toggle('dt-reduce', motion.matches)
    if (motion.matches) window.clearTimeout(streamTimer)
  }

  root.addEventListener('click', onClick)
  root.addEventListener('submit', onSubmit)
  root.addEventListener('keydown', onKey)
  root.addEventListener('focusin', onFocusIn)
  root.addEventListener('mouseover', onMouseOver)
  root.addEventListener('mouseout', onMouseOut)
  motion.addEventListener('change', onMotion)
  onMotion()

  const resize = new ResizeObserver(() => scheduleMeasure())
  resize.observe(viewport)

  boot(true)

  function boot(first: boolean) {
    index = clamp(options.initialIndex ?? 0, 0, Math.max(0, decisions.length - 1))
    path = []
    preview = first ? (options.lockPreview ?? null) : null
    approvedId = null
    history = []
    if (!decisions.length || (first && options.phase === 'empty')) {
      phase = 'empty'
      paint()
      return
    }
    if (first && options.initialPath?.length) path = validPath(options.initialPath)
    if (first && options.phase === 'approved' && path.length) {
      phase = 'approved'
      approvedId = path[path.length - 1] ?? null
      leafTitle = 'Approved · running'
    } else {
      phase = 'choose'
    }
    renderDecision()
  }

  function reset() {
    if (dead) return
    clearTimers()
    boot(false)
    announce(decisions.length ? 'Decision queue restarted.' : 'All decided.')
  }

  function destroy() {
    dead = true
    clearTimers()
    resize.disconnect()
    motion.removeEventListener('change', onMotion)
    root.replaceChildren()
  }

  function current(): Decision | null {
    return decisions[index] ?? null
  }

  function renderDecision() {
    const decision = current()
    if (!decision) {
      phase = 'empty'
      paint()
      return
    }
    flats = flatten(decision)
    flatById = new Map(flats.map(item => [item.id, item]))
    drawnEdges.clear()
    const maxDepth = flats.reduce((max, item) => Math.max(max, item.depth), 1)
    const parts: string[] = [renderRoot(decision)]
    for (let depth = 1; depth <= maxDepth; depth++) parts.push(renderColumn(decision, depth))
    columns.innerHTML = parts.join('')
    svg.replaceChildren()
    paint()
    document.fonts?.ready.then(() => {
      if (!dead) scheduleMeasure()
    }).catch(() => {})
  }

  function renderRoot(decision: Decision) {
    const risk = decision.riskLabel || RISK_LABEL[decision.risk]
    return `
      <div class="dt-col" data-depth="0">
        <article class="dt-root" aria-labelledby="${uid(root)}-q">
          <p><span class="dt-risk dt-risk-${decision.risk}">${esc(risk)}</span></p>
          <div class="dt-agent">
            <span class="dt-avatar" aria-hidden="true">${esc(initials(decision.agent.name))}</span>
            <span>
              <strong>${esc(decision.agent.name)}</strong>
              ${decision.agent.model ? `<small>${esc(decision.agent.model)}</small>` : ''}
            </span>
          </div>
          <h3 class="dt-q" id="${uid(root)}-q">${esc(decision.question)}</h3>
          <p class="dt-context">${esc(decision.context)}</p>
        </article>
      </div>
    `
  }

  function renderColumn(decision: Decision, depth: number) {
    const nodes = flats.filter(item => item.depth === depth)
    const labels = new Map<string, string>()
    if (depth === 1 && decision.columnLabel) labels.set('root', decision.columnLabel)
    for (const node of flats) {
      if (node.depth === depth - 1 && node.option.columnLabel) labels.set(node.id, node.option.columnLabel)
    }
    const labelHtml = [...labels.entries()].map(([forId, text]) =>
      `<p class="dt-label is-hidden" data-label-for="${esc(forId)}">${esc(text)}</p>`
    ).join('')
    const options = nodes.map(renderOption).join('')
    const notes = nodes.filter(node => node.option.note).map(node => {
      const note = node.option.note!
      return `
        <aside class="dt-note is-hidden" data-note-for="${esc(node.id)}">
          <p class="dt-note-kicker">${esc(note.title || "Agent's note")}</p>
          <p>${esc(note.body)}</p>
          ${note.source ? `<p class="dt-note-src">${esc(note.source)}</p>` : ''}
        </aside>
      `
    }).join('')
    return `
      <div class="dt-col" data-depth="${depth}" role="group" aria-label="${esc(decision.columnLabel || 'Options')}">
        ${labelHtml}
        ${options}
        ${notes}
      </div>
    `
  }

  function renderOption(node: Flat) {
    const option = node.option
    const pick = option.agentPick ? '<span class="dt-pick"><i aria-hidden="true"></i> Agent\'s pick</span>' : ''
    const warning = option.warning
      ? `<span class="dt-warn"><svg viewBox="0 0 16 16" width="12" height="12" aria-hidden="true"><path d="M8 2.2 14.2 13H1.8L8 2.2Z" fill="none" stroke="currentColor" stroke-width="1.4"/><path d="M8 6.2v3.2" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/><circle cx="8" cy="11.2" r="0.7" fill="currentColor"/></svg>${esc(option.warning)}</span>`
      : ''
    const other = option.other
      ? `<form class="dt-other">
          <label class="dt-sr-label" for="${uid(root)}-${esc(option.id)}-other">Instruction for the agent</label>
          <input id="${uid(root)}-${esc(option.id)}-other" type="text" name="instruction" autocomplete="off" placeholder="${esc(option.otherPlaceholder || 'Tell the agent what to do instead…')}" />
          <button type="submit" class="dt-send">Send</button>
        </form>`
      : ''
    return `
      <div class="dt-option is-hidden" data-id="${esc(node.id)}" data-parent="${esc(node.parentId || 'root')}" data-depth="${node.depth}">
        <button type="button" class="dt-hit" aria-keyshortcuts="${node.shortcut}" aria-label="${esc(accessibleName(node))}">
          <span class="dt-key" aria-hidden="true">${node.shortcut}</span>
          <span class="dt-body">
            <span class="dt-opt-main">
              <span class="dt-opt-top"><span class="dt-opt-title">${esc(option.title)}</span>${pick}</span>
              ${warning}
            </span>
            <span class="dt-approved" hidden>
              <span class="dt-approved-title"></span>
              <small class="dt-approved-sub"></small>
              <p class="dt-reply" hidden></p>
            </span>
          </span>
        </button>
        ${other}
      </div>
    `
  }

  function paint() {
    const decision = current()
    const total = decisions.length
    const remaining = phase === 'empty' ? 0 : Math.max(0, total - index)
    root.dataset.dtPhase = phase
    root.classList.toggle('is-empty', phase === 'empty')
    root.classList.toggle('is-leaving', phase === 'leaving')
    if (phase === 'empty') {
      waitingEl.textContent = total ? `${total} of ${total} decided` : 'nothing waiting'
      fractionEl.textContent = ''
      dotsEl.innerHTML = ''
      progressEl.removeAttribute('aria-label')
      emptyEl.hidden = false
      deck.hidden = true
      const again = emptyEl.querySelector<HTMLButtonElement>('.dt-again')
      if (again) again.hidden = total === 0
      hintsEl.innerHTML = '<span>Queue clear</span>'
      return
    }
    emptyEl.hidden = true
    deck.hidden = false
    waitingEl.textContent = `${remaining} waiting`
    fractionEl.textContent = remaining ? `1 of ${remaining}` : ''
    progressEl.setAttribute('aria-label', remaining ? `1 of ${remaining} still waiting` : 'Queue clear')
    dotsEl.innerHTML = Array.from({ length: remaining }, (_, i) =>
      `<i class="${i === 0 ? 'is-on' : ''}"></i>`
    ).join('')

    const open = openedIds()
    for (const node of flats) {
      const el = optionEl(node.id)
      if (!el) continue
      const visible = isVisible(node, open)
      const out = isOut(node.id)
      const dim = isDim(node)
      const wasHidden = el.classList.contains('is-hidden')
      el.classList.toggle('is-hidden', !visible)
      el.classList.toggle('is-out', visible && out)
      el.classList.toggle('is-dim', visible && dim)
      el.classList.toggle('is-preview', preview === node.id)
      el.classList.toggle('is-committed', path.includes(node.id))
      el.classList.toggle('is-approved', approvedId === node.id && (phase === 'approved' || phase === 'reply' || phase === 'leaving'))
      const hit = el.querySelector<HTMLButtonElement>('.dt-hit')
      if (hit) {
        hit.tabIndex = visible && !out ? 0 : -1
        hit.setAttribute('aria-pressed', path.includes(node.id) ? 'true' : 'false')
        if (node.childIds.length) hit.setAttribute('aria-expanded', open.has(node.id) ? 'true' : 'false')
        hit.setAttribute('aria-label', approvedId === node.id && phase !== 'choose'
          ? `${leafTitle}. ${node.option.title}`
          : accessibleName(node))
      }
      el.toggleAttribute('aria-hidden', !visible || out)
      const approved = el.querySelector<HTMLElement>('.dt-approved')
      const approvedTitle = el.querySelector<HTMLElement>('.dt-approved-title')
      const approvedSub = el.querySelector<HTMLElement>('.dt-approved-sub')
      if (approved && approvedTitle && approvedSub) {
        const show = approvedId === node.id && phase !== 'choose'
        approved.hidden = !show
        if (show) {
          approvedTitle.innerHTML = `${checkSvg()} ${esc(leafTitle)}`
          approvedSub.textContent = node.option.title
        }
      }
      if (wasHidden && visible && phase === 'choose' && !motion.matches) {
        el.classList.remove('is-enter')
        void el.offsetWidth
        el.classList.add('is-enter')
      }
    }
    root.querySelectorAll<HTMLElement>('.dt-label').forEach(label => {
      const forId = label.dataset.labelFor || ''
      const depth = Number(label.closest<HTMLElement>('.dt-col')?.dataset.depth || 0)
      label.classList.toggle('is-hidden', activeParent(depth, open) !== forId)
    })
    root.querySelectorAll<HTMLElement>('.dt-note').forEach(note => {
      const id = note.dataset.noteFor || ''
      const show = preview === id || (path[path.length - 1] === id && preview == null)
      note.classList.toggle('is-hidden', !show)
    })
    root.querySelectorAll<HTMLElement>('.dt-col').forEach(col => {
      const depth = Number(col.dataset.depth || 0)
      if (depth === 0) return
      const any = flats.some(node => node.depth === depth && isVisible(node, open))
      col.classList.toggle('is-hidden', !any)
      const parent = activeParent(depth, open)
      const parentFlat = parent ? flatById.get(parent) : undefined
      const label = depth === 1
        ? (decision?.columnLabel || 'Options')
        : (parentFlat?.option.columnLabel || 'Options')
      col.setAttribute('aria-label', label)
    })
    hintsEl.innerHTML = hintMarkup()
    scheduleMeasure()
  }

  function hintMarkup() {
    const sibs = activeSiblings()
    const nums = sibs.map(item => item.shortcut).sort((a, b) => a - b)
    const range = !nums.length ? '' : nums[0] === nums[nums.length - 1] ? String(nums[0]) : `${nums[0]}–${nums[nums.length - 1]}`
    const chooseHint = range ? `<span><kbd>${esc(range.includes('–') ? String(nums[0]) : range)}</kbd>${range.includes('–') ? `–<kbd>${nums[nums.length - 1]}</kbd>` : ''} choose</span>` : ''
    return `${chooseHint}<span><kbd>↑</kbd><kbd>↓</kbd> move</span><span><kbd>Enter</kbd> commit</span><span><kbd>→</kbd> next</span><span><kbd>Esc</kbd> back</span>`
  }

  function openedIds() {
    const open = new Set<string>(path)
    if (preview && phase === 'choose') {
      const chain: string[] = []
      let cur = flatById.get(preview)
      const guard = new Set<string>()
      while (cur && !guard.has(cur.id)) {
        const committed = path[cur.depth - 1]
        if (committed && committed !== cur.id) break
        chain.push(cur.id)
        guard.add(cur.id)
        cur = cur.parentId ? flatById.get(cur.parentId) : undefined
      }
      chain.reverse().forEach(id => open.add(id))
    } else if (!path.length) {
      const pick = flats.find(item => item.depth === 1 && item.option.agentPick)
      if (pick) open.add(pick.id)
    }
    return open
  }

  function previewChain() {
    if (!preview) return [] as string[]
    const chain: string[] = []
    let cur = flatById.get(preview)
    const guard = new Set<string>()
    while (cur && !guard.has(cur.id)) {
      const committed = path[cur.depth - 1]
      if (committed && committed !== cur.id) break
      chain.push(cur.id)
      guard.add(cur.id)
      cur = cur.parentId ? flatById.get(cur.parentId) : undefined
    }
    return chain
  }

  function isVisible(node: Flat, open = openedIds()) {
    if (node.depth === 1) return true
    return !!node.parentId && open.has(node.parentId)
  }

  function isOut(id: string) {
    const node = flatById.get(id)
    if (!node) return false
    const chosen = path[node.depth - 1]
    return !!chosen && chosen !== id
  }

  function isDim(node: Flat) {
    if (!preview || phase !== 'choose' || isOut(node.id)) return false
    const chain = previewChain()
    const active = chain.map(id => flatById.get(id)).find(item => item?.depth === node.depth)
    if (!active || active.id === node.id) return false
    return active.parentId === node.parentId
  }

  function activeParent(depth: number, open: Set<string>) {
    if (depth === 1) return 'root'
    return flats.find(item => item.depth === depth - 1 && open.has(item.id))?.id ?? null
  }

  function activeSiblings() {
    const depth = path.length + 1
    const open = openedIds()
    return flats.filter(item => item.depth === depth && isVisible(item, open) && !isOut(item.id))
  }

  function choose(id: string) {
    const node = flatById.get(id)
    if (!node || phase !== 'choose' || isOut(id)) return
    if (node.depth !== path.length + 1) return
    if (node.option.other) {
      preview = id
      paint()
      optionEl(id)?.querySelector<HTMLInputElement>('input')?.focus()
      return
    }
    commit(node)
  }

  function commit(node: Flat) {
    path = path.slice(0, node.depth - 1).concat(node.id)
    preview = null
    const leaf = node.childIds.length === 0
    const detail = makeDetail(node, leaf)
    emit('dt-step', detail)
    options.onStep?.(detail)
    if (!leaf) {
      announce(`Chose ${node.option.title}.`)
      paint()
      focusActive()
      return
    }
    phase = 'approved'
    approvedId = node.id
    leafTitle = 'Approved · running'
    announce(`Approved. ${node.option.title} is running.`)
    emit('dt-commit', detail)
    options.onCommit?.(detail)
    history.push(detail)
    paint()
    if (autoAdvance) later(() => advance(), advanceDelay)
  }

  function submitOther(id: string, text: string) {
    const node = flatById.get(id)
    if (!node?.option.other || phase !== 'choose') return
    if (node.depth !== path.length + 1) return
    const value = text.trim()
    if (!value) {
      announce('Add a note for the agent first.')
      return
    }
    path = path.slice(0, node.depth - 1).concat(node.id)
    preview = null
    approvedId = node.id
    const agent = current()?.agent.name || 'agent'
    leafTitle = `Sent to the ${agent}`
    const detail = makeDetail(node, true, value)
    emit('dt-step', detail)
    options.onStep?.(detail)
    emit('dt-commit', detail)
    options.onCommit?.(detail)
    history.push(detail)
    phase = 'reply'
    const reply = node.option.agentReply
    announce(reply ? `Sent to the ${agent}. ${value} ${reply}` : `Sent to the ${agent}. ${value}`)
    paint()
    if (reply) startReply(reply)
    else if (autoAdvance) later(() => advance(), advanceDelay)
    else phase = 'approved'
  }

  function startReply(text: string) {
    const replyEl = approvedId ? optionEl(approvedId)?.querySelector<HTMLElement>('.dt-reply') : null
    if (!replyEl) {
      if (autoAdvance) later(() => advance(), advanceDelay)
      return
    }
    if (motion.matches) {
      replyEl.hidden = false
      replyEl.textContent = text
      if (autoAdvance) later(() => advance(), advanceDelay)
      return
    }
    let i = 0
    const tick = () => {
      if (dead || phase !== 'reply') return
      i += 1
      replyEl.hidden = false
      replyEl.textContent = text.slice(0, i)
      if (i < text.length) streamTimer = window.setTimeout(tick, 16)
      else if (autoAdvance) later(() => advance(), Math.min(advanceDelay, 700))
    }
    tick()
  }

  function advance() {
    if (dead || (phase !== 'approved' && phase !== 'reply')) return
    const go = () => {
      if (dead) return
      const hadFocus = root.contains(document.activeElement)
      deck.classList.remove('is-leave')
      if (index >= decisions.length - 1) {
        phase = 'empty'
        announce('All decided. New decisions from your agents show up here.')
        emit('dt-complete', { history })
        options.onComplete?.({ history })
        paint()
        return
      }
      const from = decisions[index]
      index += 1
      path = []
      preview = null
      approvedId = null
      phase = 'choose'
      const next = decisions[index]
      renderDecision()
      playEnter()
      announce(`Next decision. ${next.agent.name} asks: ${next.question} ${decisions.length - index} waiting.`)
      const detail: DecisionAdvanceDetail = { fromId: from.id, toId: next.id, index, decision: next }
      emit('dt-advance', detail)
      options.onAdvance?.(detail)
      if (hadFocus) focusActive()
    }
    if (motion.matches) {
      go()
      return
    }
    phase = 'leaving'
    root.classList.add('is-leaving')
    deck.classList.add('is-leave')
    later(go, 280)
  }

  function playEnter() {
    if (motion.matches) return
    deck.classList.add('is-enter')
    void deck.offsetWidth
    deck.classList.remove('is-enter')
  }

  function back() {
    if (dead || phase === 'empty' || phase === 'leaving') return
    clearTimers()
    const decision = current()
    if (!decision || !path.length) return
    if (phase === 'approved' || phase === 'reply') {
      phase = 'choose'
      approvedId = null
    }
    const popped = path[path.length - 1]
    path = path.slice(0, -1)
    preview = options.lockPreview ?? null
    announce('Back to the previous choice.')
    const detail = { decisionId: decision.id, path: pathItems() }
    emit('dt-back', detail)
    options.onBack?.(detail)
    paint()
    const hit = popped ? optionEl(popped)?.querySelector<HTMLButtonElement>('.dt-hit') : null
    hit?.focus({ preventScroll: true })
  }

  function moveFocus(delta: number) {
    const sibs = activeSiblings()
    if (!sibs.length) return
    const currentId = focusedOptionId()
    let i = sibs.findIndex(item => item.id === currentId)
    if (i < 0) i = delta > 0 ? -1 : 0
    const next = sibs[(i + delta + sibs.length) % sibs.length]
    optionEl(next.id)?.querySelector<HTMLButtonElement>('.dt-hit')?.focus({ preventScroll: true })
  }

  function focusActive() {
    const sibs = activeSiblings()
    const target = sibs[0]
    if (!target) return
    optionEl(target.id)?.querySelector<HTMLButtonElement>('.dt-hit')?.focus({ preventScroll: true })
  }

  function focusedOptionId() {
    const el = document.activeElement as HTMLElement | null
    return el?.closest('.dt-option')?.getAttribute('data-id') ?? null
  }

  function setPreview(id: string | null) {
    if (preview === id || phase !== 'choose') return
    preview = id
    emit('dt-preview', { decisionId: current()?.id ?? null, optionId: id })
    options.onPreview?.({ decisionId: current()?.id ?? '', optionId: id })
    paint()
  }

  function scheduleMeasure() {
    requestAnimationFrame(() => {
      if (dead || phase === 'empty') return
      drawEdges()
      applyPan()
    })
  }

  function drawEdges() {
    const open = openedIds()
    const chain = previewChain()
    const w = Math.max(1, stage.scrollWidth)
    const h = Math.max(1, stage.scrollHeight)
    svg.setAttribute('viewBox', `0 0 ${w} ${h}`)
    svg.style.width = `${w}px`
    svg.style.height = `${h}px`
    const stack = stacked()
    const wanted = new Map<string, { d: string; className: string }>()
    const rootCard = root.querySelector<HTMLElement>('.dt-root')
    for (const node of flats) {
      if (!isVisible(node, open)) continue
      const fromEl = node.depth === 1 ? rootCard : optionEl(node.parentId || '')
      const toEl = optionEl(node.id)
      if (!fromEl || !toEl) continue
      const from = anchor(fromEl, stack ? 'bottom' : 'right')
      const to = anchor(toEl, stack ? 'top' : 'left')
      const key = `${node.parentId || 'root'}->${node.id}`
      const dim = isDim(node) || isOut(node.id)
      const active = path.includes(node.id) || chain.includes(node.id)
      wanted.set(key, {
        d: curve(from.x, from.y, to.x, to.y, stack),
        className: ['dt-edge', active ? 'is-active' : '', node.id === preview ? 'is-hot' : '', dim ? 'is-dim' : ''].filter(Boolean).join(' '),
      })
    }
    for (const child of [...svg.querySelectorAll<SVGPathElement>('path')]) {
      const key = child.dataset.k || ''
      if (!wanted.has(key)) {
        child.remove()
        drawnEdges.delete(key)
      }
    }
    for (const [key, spec] of wanted) {
      let pathEl = svg.querySelector<SVGPathElement>(`path[data-k="${key.replace(/"/g, '')}"]`)
      const created = !pathEl
      if (!pathEl) {
        pathEl = document.createElementNS(SVG_NS, 'path')
        pathEl.dataset.k = key
        svg.appendChild(pathEl)
      }
      pathEl.setAttribute('d', spec.d)
      pathEl.setAttribute('class', spec.className)
      if (created && !drawnEdges.has(key) && !motion.matches && !spec.className.includes('is-dim')) {
        drawnEdges.add(key)
        const length = pathEl.getTotalLength()
        const anim = pathEl.animate(
          [{ strokeDasharray: `${length}`, strokeDashoffset: `${length}` }, { strokeDasharray: `${length}`, strokeDashoffset: '0' }],
          { duration: 520, easing: 'ease-out', fill: 'forwards' }
        )
        anim.finished.then(() => {
          pathEl?.style.removeProperty('stroke-dasharray')
          pathEl?.style.removeProperty('stroke-dashoffset')
        }).catch(() => {})
      }
    }
  }

  function applyPan() {
    if (stacked()) {
      stage.style.transform = 'none'
      return
    }
    const view = viewport.clientWidth
    const max = Math.max(0, stage.scrollWidth - view)
    const pad = 16
    let shift = 0
    if (path.length) {
      const depth = Math.max(1, path.length + (phase === 'choose' ? 1 : 0))
      const col = columns.querySelector<HTMLElement>(`.dt-col[data-depth="${depth}"]`)
      if (col && !col.classList.contains('is-hidden')) shift = Math.max(0, col.offsetLeft - pad)
    }
    if (preview) {
      const node = flatById.get(preview)
      const revealDepth = node && node.childIds.length ? node.depth + 1 : node?.depth
      const col = revealDepth ? columns.querySelector<HTMLElement>(`.dt-col[data-depth="${revealDepth}"]`) : null
      if (col && !col.classList.contains('is-hidden')) {
        const need = col.offsetLeft + col.offsetWidth + pad - view
        if (need > shift) shift = need
      }
    }
    shift = Math.max(0, Math.min(shift, max))
    stage.style.transform = `translate3d(${-shift}px,0,0)`
  }

  function curve(x1: number, y1: number, x2: number, y2: number, stack: boolean) {
    if (stack) {
      const dy = Math.max(28, Math.abs(y2 - y1) * 0.45)
      return `M ${x1.toFixed(1)} ${y1.toFixed(1)} C ${x1.toFixed(1)} ${(y1 + dy).toFixed(1)}, ${x2.toFixed(1)} ${(y2 - dy).toFixed(1)}, ${x2.toFixed(1)} ${y2.toFixed(1)}`
    }
    const dx = Math.max(36, Math.abs(x2 - x1) * 0.5)
    const dir = x2 >= x1 ? 1 : -1
    return `M ${x1.toFixed(1)} ${y1.toFixed(1)} C ${(x1 + dx * dir).toFixed(1)} ${y1.toFixed(1)}, ${(x2 - dx * dir).toFixed(1)} ${y2.toFixed(1)}, ${x2.toFixed(1)} ${y2.toFixed(1)}`
  }

  function anchor(el: HTMLElement, side: 'left' | 'right' | 'top' | 'bottom') {
    const a = el.getBoundingClientRect()
    const b = stage.getBoundingClientRect()
    const x = a.left - b.left
    const y = a.top - b.top
    if (side === 'right') return { x: x + a.width, y: y + a.height / 2 }
    if (side === 'left') return { x, y: y + a.height / 2 }
    if (side === 'bottom') return { x: x + a.width / 2, y: y + a.height }
    return { x: x + a.width / 2, y }
  }

  function stacked() {
    return viewport.clientWidth <= 560
  }

  function makeDetail(node: Flat, leaf: boolean, text?: string): DecisionStepDetail {
    const decision = current()
    return {
      decisionId: decision?.id ?? '',
      optionId: node.id,
      title: node.option.title,
      shortcut: node.shortcut,
      depth: node.depth,
      path: pathItems(),
      leaf,
      text,
      agent: decision?.agent.name ?? '',
    }
  }

  function pathItems(): DecisionPathItem[] {
    return path.map(id => {
      const node = flatById.get(id)
      return { id, title: node?.option.title ?? id, shortcut: node?.shortcut ?? 0 }
    })
  }

  function validPath(ids: string[]) {
    const decision = decisions[index]
    if (!decision) return []
    const map = new Map(flatten(decision).map(item => [item.id, item]))
    const next: string[] = []
    for (const id of ids) {
      const node = map.get(id)
      if (!node || node.depth !== next.length + 1) continue
      const parent = next[next.length - 1] ?? null
      if (node.parentId !== parent) continue
      next.push(id)
    }
    return next
  }

  function announce(text: string) {
    liveEl.textContent = ''
    liveEl.textContent = text
  }

  function later(fn: () => void, ms: number) {
    window.clearTimeout(timer)
    timer = window.setTimeout(() => {
      if (!dead) fn()
    }, ms)
  }

  function clearTimers() {
    window.clearTimeout(timer)
    window.clearTimeout(streamTimer)
  }

  function optionEl(id: string) {
    return root.querySelector<HTMLElement>(`.dt-option[data-id="${id.replace(/"/g, '')}"]`)
  }

  function emit(name: string, detail: unknown) {
    root.dispatchEvent(new CustomEvent(name, { detail, bubbles: true }))
  }

  function q<T extends Element>(sel: string) {
    const el = root.querySelector<T>(sel)
    if (!el) throw new Error(`Decision tree is missing ${sel}`)
    return el
  }

  function getState(): DecisionTreeState {
    return {
      index,
      total: decisions.length,
      remaining: phase === 'empty' ? 0 : Math.max(0, decisions.length - index),
      path: path.slice(),
      phase,
      decisionId: current()?.id ?? null,
      done: phase === 'empty',
      history: history.slice(),
    }
  }

  return { destroy, reset, getState }
}

function flatten(decision: Decision): Flat[] {
  const out: Flat[] = []
  const walk = (options: DecisionOption[], parentId: string | null, depth: number) => {
    options.forEach((option, i) => {
      const shortcut = option.shortcut ?? Math.min(i + 1, 9)
      out.push({
        id: option.id,
        parentId,
        depth,
        option,
        shortcut,
        childIds: (option.children ?? []).map(child => child.id),
      })
      if (option.children?.length) walk(option.children, option.id, depth + 1)
    })
  }
  walk(decision.options, null, 1)
  return out
}

function accessibleName(node: Flat) {
  const bits = [`${node.shortcut}. ${node.option.title}`]
  if (node.option.agentPick) bits.push("Agent's pick")
  if (node.option.warning) bits.push(node.option.warning)
  if (node.option.other) bits.push('Write your own instruction')
  return bits.join('. ')
}

function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  const first = parts[0]?.[0] ?? '?'
  const last = parts.length > 1 ? parts[parts.length - 1][0] : ''
  return (first + last).toUpperCase()
}

function checkSvg() {
  return '<svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M3.2 8.2 6.4 11.4 12.8 4.6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>'
}

function esc(value: string) {
  return value.replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]!))
}

function uid(root: HTMLElement) {
  if (!root.dataset.dtUid) root.dataset.dtUid = `dt${Math.random().toString(36).slice(2, 8)}`
  return root.dataset.dtUid
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n))
}
