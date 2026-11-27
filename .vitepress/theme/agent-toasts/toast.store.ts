import { reactive } from 'vue'
import {
  announceText,
  durationFor,
  reduce,
  MAX,
  type AgentToastData,
  type DismissReason,
  type StackItem,
  type StackState,
} from './toast.model'

export type PauseReason = 'hover' | 'focus' | 'expanded' | 'hidden' | 'autohide'

export type ToastStore = ReturnType<typeof createToastStore>

const RESUME_MIN_MS = 2000

interface TimerState {
  remainingMs: number
  deadline: number | null
  handle?: ReturnType<typeof setTimeout>
}

export function createToastStore() {
  const state = reactive<StackState>({ items: [], queue: [], max: MAX })
  const pauseReasons = reactive(new Set<PauseReason>())
  const timers = new Map<string, TimerState>()
  let announceHandler: ((text: string, politeness: 'polite' | 'assertive') => void) | undefined
  const isClient = typeof window !== 'undefined'

  function itemId(item: StackItem): string {
    return item.data.id ?? item.key
  }

  function syncState(next: StackState) {
    const evicted = state.items.filter(it => !next.items.some(n => n.key === it.key))
    evicted.forEach(it => clearTimer(itemId(it)))
    state.items = next.items
    state.queue = next.queue
    state.max = next.max
  }

  function clearTimer(id: string) {
    const t = timers.get(id)
    if (!t) return
    if (t.handle) clearTimeout(t.handle)
    timers.delete(id)
  }

  function frozen(): boolean {
    return pauseReasons.size > 0
  }

  function freezeTimers() {
    const now = Date.now()
    for (const [id, t] of timers) {
      if (t.deadline != null) {
        t.remainingMs = Math.max(t.deadline - now, 0)
        if (t.handle) clearTimeout(t.handle)
        t.handle = undefined
        t.deadline = null
        timers.set(id, t)
      }
    }
  }

  function thawTimers() {
    for (const item of state.items) {
      const id = itemId(item)
      const ms = durationFor(item.data)
      if (ms === null) continue
      let t = timers.get(id)
      if (!t) {
        t = { remainingMs: ms, deadline: null }
        timers.set(id, t)
      }
      const wait = Math.max(t.remainingMs, RESUME_MIN_MS)
      armDeadline(id, wait, item)
    }
  }

  function armDeadline(id: string, ms: number, item: StackItem) {
    if (!isClient || frozen()) {
      const t = timers.get(id) ?? { remainingMs: ms, deadline: null }
      t.remainingMs = ms
      t.deadline = null
      if (t.handle) clearTimeout(t.handle)
      t.handle = undefined
      timers.set(id, t)
      return
    }
    clearTimer(id)
    const deadline = Date.now() + ms
    const handle = setTimeout(() => dismiss(id, 'timeout'), ms)
    timers.set(id, { remainingMs: ms, deadline, handle })
  }

  function resetTimer(item: StackItem, fullDuration = false) {
    const id = itemId(item)
    const ms = durationFor(item.data)
    if (ms === null) {
      clearTimer(id)
      return
    }
    const nextMs = fullDuration ? ms : Math.max(timers.get(id)?.remainingMs ?? ms, RESUME_MIN_MS)
    armDeadline(id, nextMs, item)
  }

  function scheduleNew(item: StackItem) {
    const ms = durationFor(item.data)
    if (ms === null) return
    armDeadline(itemId(item), ms, item)
  }

  function onAnnounce(data: AgentToastData) {
    const msg = announceText(data)
    if (msg && announceHandler) announceHandler(msg.text, msg.politeness)
  }

  function dequeueIfRoom() {
    const next = reduce(state, { type: 'dequeue' })
    if (next.queue.length !== state.queue.length || next.items.length !== state.items.length) {
      syncState(next)
      next.items.forEach(item => {
        const id = itemId(item)
        if (!timers.has(id)) scheduleNew(item)
      })
    }
  }

  function push(data: AgentToastData, now = Date.now()) {
    const prevByKey = new Map(state.items.map(it => [it.key, it]))
    const prevIds = new Set(state.items.map(itemId))
    const prevQueue = state.queue.length
    const raw = reduce(state, { type: 'push', data, now })
    syncState(raw)

    state.items.forEach(item => {
      const id = itemId(item)
      const prev = prevByKey.get(item.key)
      if (prev) {
        if (prev.data !== item.data || prev.dedupeAt !== item.dedupeAt) resetTimer(item, true)
        const dedupeRefresh = !item.data.id && prev.dedupeAt !== item.dedupeAt
        const titleChanged = prev.data.title !== item.data.title
        if (!dedupeRefresh && titleChanged) onAnnounce(item.data)
        return
      }
      if (!prevIds.has(id)) {
        scheduleNew(item)
        onAnnounce(item.data)
      }
    })

    if (state.queue.length > prevQueue) {
      state.queue.slice(prevQueue).forEach(d => onAnnounce(d))
    }
  }

  function update(id: string, data: AgentToastData) {
    const prev = state.items.find(it => itemId(it) === id || it.data.id === id)
    const prevTitle = prev?.data.title
    const next = reduce(state, { type: 'update', id, data })
    syncState(next)
    const item = state.items.find(it => itemId(it) === id || it.data.id === id)
    if (item) {
      resetTimer(item, true)
      const titleSame = prevTitle === item.data.title
      if (!(item.data.busy && titleSame)) onAnnounce(item.data)
    } else if (data.tone === 'danger') {
      const created = state.items[state.items.length - 1]
      if (created) {
        scheduleNew(created)
        onAnnounce(created.data)
      }
    }
  }

  function dismiss(id: string, reason: DismissReason = 'close') {
    clearTimer(id)
    syncState(reduce(state, { type: 'dismiss', id, reason }))
    dequeueIfRoom()
    state.items.forEach(item => {
      if (!timers.has(itemId(item))) scheduleNew(item)
    })
  }

  function clear() {
    timers.forEach((_, id) => clearTimer(id))
    timers.clear()
    syncState(reduce(state, { type: 'clear' }))
  }

  function pause(reason: PauseReason) {
    const wasFrozen = frozen()
    pauseReasons.add(reason)
    if (!wasFrozen && frozen()) freezeTimers()
  }

  function resume(reason: PauseReason) {
    const wasFrozen = frozen()
    pauseReasons.delete(reason)
    if (wasFrozen && !frozen()) thawTimers()
  }

  function setAnnounce(handler?: (text: string, politeness: 'polite' | 'assertive') => void) {
    announceHandler = handler
  }

  return {
    state,
    pauseReasons,
    queueCount: () => state.queue.length,
    visible: () => state.items,
    push,
    update,
    dismiss,
    clear,
    pause,
    resume,
    setAnnounce,
    dispose: () => { clear(); pauseReasons.clear(); announceHandler = undefined },
  }
}