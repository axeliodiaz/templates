import { reactive, readonly, ref } from 'vue'
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

export type ToastStore = ReturnType<typeof createToastStore>

export function createToastStore() {
  const state = reactive<StackState>({ items: [], queue: [], max: MAX })
  const pausedIds = reactive(new Set<string>())
  const pausedAll = ref(false)
  const timers = new Map<string, ReturnType<typeof setTimeout>>()
  let announceHandler: ((text: string, politeness: 'polite' | 'assertive') => void) | undefined
  const isClient = typeof window !== 'undefined'

  function itemId(item: StackItem): string {
    return item.data.id ?? item.key
  }

  function syncState(next: StackState) {
    state.items = next.items
    state.queue = next.queue
    state.max = next.max
  }

  function clearTimer(id: string) {
    const t = timers.get(id)
    if (t) {
      clearTimeout(t)
      timers.delete(id)
    }
  }

  function armTimer(id: string, ms: number) {
    if (!isClient || pausedAll.value || pausedIds.has(id)) return
    clearTimer(id)
    timers.set(
      id,
      setTimeout(() => {
        dismiss(id, 'timeout')
      }, ms),
    )
  }

  function scheduleItem(item: StackItem, reset = false) {
    const id = itemId(item)
    const ms = durationFor(item.data)
    if (ms === null) return
    if (reset || !timers.has(id)) armTimer(id, ms)
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
        if (!timers.has(id)) scheduleItem(item)
      })
    }
  }

  function push(data: AgentToastData, now = Date.now()) {
    const prevIds = new Set(state.items.map(itemId))
    const prevQueue = state.queue.length
    const raw = reduce(state, { type: 'push', data, now })
    syncState(raw)
    state.items.forEach(item => {
      const id = itemId(item)
      if (!prevIds.has(id)) {
        scheduleItem(item)
        onAnnounce(item.data)
      }
    })
    if (state.queue.length > prevQueue) {
      state.queue.slice(prevQueue).forEach(d => onAnnounce(d))
    }
  }

  function update(id: string, data: AgentToastData) {
    const next = reduce(state, { type: 'update', id, data })
    syncState(next)
    const item = state.items.find(it => itemId(it) === id || it.data.id === id)
    if (item) {
      clearTimer(itemId(item))
      scheduleItem(item, true)
      onAnnounce(item.data)
    } else if (data.tone === 'danger') {
      const created = state.items[state.items.length - 1]
      if (created) {
        scheduleItem(created)
        onAnnounce(created.data)
      }
    }
  }

  function dismiss(id: string, reason: DismissReason = 'close') {
    clearTimer(id)
    pausedIds.delete(id)
    syncState(reduce(state, { type: 'dismiss', id, reason }))
    dequeueIfRoom()
  }

  function clear() {
    timers.forEach((_, id) => clearTimer(id))
    timers.clear()
    pausedIds.clear()
    pausedAll.value = false
    syncState(reduce(state, { type: 'clear' }))
  }

  function pause(id?: string) {
    if (id) {
      pausedIds.add(id)
      clearTimer(id)
      return
    }
    pausedAll.value = true
    state.items.forEach(it => clearTimer(itemId(it)))
  }

  function resume(id?: string) {
    if (id) {
      pausedIds.delete(id)
      const item = state.items.find(it => itemId(it) === id)
      if (item) scheduleItem(item, true)
      return
    }
    pausedAll.value = false
    state.items.forEach(it => scheduleItem(it, true))
  }

  function setAnnounce(handler?: (text: string, politeness: 'polite' | 'assertive') => void) {
    announceHandler = handler
  }

  return {
    state,
    pausedAll,
    queueCount: () => state.queue.length,
    visible: () => state.items,
    push,
    update,
    dismiss,
    clear,
    pause,
    resume,
    setAnnounce,
    dispose: clear,
  }
}