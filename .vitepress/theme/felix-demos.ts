const MONTHS = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic']

function padCalendar(root: HTMLElement, year: number, month: number, selected: number) {
  const grid = root.querySelector<HTMLElement>('.fx-cal-g')
  const title = root.querySelector<HTMLElement>('.fx-cal-h')
  if (!grid) return
  if (title) title.textContent = `${MONTHS[month][0].toUpperCase()}${MONTHS[month].slice(1)} ${year}`
  const first = new Date(year, month, 1).getDay()
  const offset = (first + 6) % 7
  const days = new Date(year, month + 1, 0).getDate()
  const labels = ['L', 'M', 'X', 'J', 'V', 'S', 'D']
  grid.innerHTML = ''
  for (const label of labels) {
    const span = document.createElement('span')
    span.textContent = label
    grid.appendChild(span)
  }
  for (let i = 0; i < offset; i++) grid.appendChild(document.createElement('span'))
  for (let day = 1; day <= days; day++) {
    const button = document.createElement('button')
    button.type = 'button'
    button.textContent = String(day)
    button.dataset.day = String(day)
    if (day === selected) button.classList.add('on')
    grid.appendChild(button)
  }
}

function formatDate(year: number, month: number, day: number) {
  return `${day} ${MONTHS[month]} ${year}`
}

function bind(root: ParentNode) {
  root.querySelectorAll<HTMLElement>('[data-fx="datepicker"]').forEach((host) => {
    if (host.dataset.bound) return
    host.dataset.bound = '1'
    const button = host.querySelector<HTMLButtonElement>('.fx-date-btn')
    const pop = host.querySelector<HTMLElement>('.fx-date-pop')
    if (!button || !pop) return
    let year = 2026
    let month = 8
    let selected = 10
    padCalendar(pop, year, month, selected)
    button.addEventListener('click', () => {
      pop.hidden = !pop.hidden
    })
    pop.addEventListener('click', (event) => {
      const target = event.target as HTMLElement
      const day = target.dataset.day
      if (!day) return
      selected = Number(day)
      button.textContent = formatDate(year, month, selected)
      padCalendar(pop, year, month, selected)
      pop.hidden = true
    })
  })

  root.querySelectorAll<HTMLElement>('[data-fx="calendar"]').forEach((host) => {
    if (host.dataset.bound) return
    host.dataset.bound = '1'
    const pop = host.querySelector<HTMLElement>('.fx-cal')
    if (!pop) return
    padCalendar(pop, 2026, 8, 10)
    pop.addEventListener('click', (event) => {
      const target = event.target as HTMLElement
      if (!target.dataset.day) return
      pop.querySelectorAll('button').forEach((node) => node.classList.remove('on'))
      target.classList.add('on')
    })
  })

  root.querySelectorAll<HTMLElement>('[data-fx="accordion"]').forEach((host) => {
    if (host.dataset.bound) return
    host.dataset.bound = '1'
    host.addEventListener('toggle', (event) => {
      const current = event.target as HTMLDetailsElement
      if (!current.open) return
      host.querySelectorAll('details').forEach((node) => {
        if (node !== current) node.open = false
      })
    }, true)
  })

  root.querySelectorAll<HTMLElement>('[data-fx="choice"]').forEach((host) => {
    if (host.dataset.bound) return
    host.dataset.bound = '1'
    host.addEventListener('click', (event) => {
      const card = (event.target as HTMLElement).closest<HTMLElement>('.fx-choice')
      if (!card) return
      host.querySelectorAll('.fx-choice').forEach((node) => node.classList.remove('on'))
      card.classList.add('on')
    })
  })

  root.querySelectorAll<HTMLElement>('[data-fx="tabs"]').forEach((host) => {
    if (host.dataset.bound) return
    host.dataset.bound = '1'
    const tabs = [...host.querySelectorAll<HTMLButtonElement>('.fx-tab')]
    const panels = [...host.querySelectorAll<HTMLElement>('[data-panel]')]
    tabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        tabs.forEach((node) => node.classList.remove('is-on'))
        tab.classList.add('is-on')
        panels.forEach((panel) => {
          panel.hidden = panel.dataset.panel !== tab.dataset.tab
        })
      })
    })
  })

  root.querySelectorAll<HTMLElement>('[data-fx="pages"]').forEach((host) => {
    if (host.dataset.bound) return
    host.dataset.bound = '1'
    const pages = [...host.querySelectorAll<HTMLButtonElement>('[data-page]')]
    const label = host.querySelector<HTMLElement>('[data-page-label]')
    host.addEventListener('click', (event) => {
      const button = (event.target as HTMLElement).closest<HTMLButtonElement>('button')
      if (!button) return
      const current = pages.find((node) => node.classList.contains('on'))
      let next = current ? Number(current.dataset.page) : 1
      if (button.dataset.page) next = Number(button.dataset.page)
      if (button.dataset.dir === 'prev') next = Math.max(1, next - 1)
      if (button.dataset.dir === 'next') next = Math.min(pages.length, next + 1)
      pages.forEach((node) => node.classList.toggle('on', Number(node.dataset.page) === next))
      if (label) label.textContent = `Página ${next} de ${pages.length}`
    })
  })

  root.querySelectorAll<HTMLElement>('[data-fx="overlay"]').forEach((host) => {
    if (host.dataset.bound) return
    host.dataset.bound = '1'
    const scrim = host.querySelector<HTMLElement>('.fx-scrim')
    host.querySelector('[data-open]')?.addEventListener('click', () => scrim?.classList.add('is-open'))
    host.querySelectorAll('[data-close]').forEach((node) => {
      node.addEventListener('click', () => scrim?.classList.remove('is-open'))
    })
  })

  root.querySelectorAll<HTMLElement>('[data-fx="toast"]').forEach((host) => {
    if (host.dataset.bound) return
    host.dataset.bound = '1'
    host.querySelectorAll<HTMLButtonElement>('[data-fire]').forEach((button) => {
      button.addEventListener('click', () => {
        const name = button.dataset.fire
        const toast = host.querySelector<HTMLElement>(`[data-toast="${name}"]`) ?? host.querySelector<HTMLElement>('.fx-toast')
        if (!toast) return
        host.querySelectorAll<HTMLElement>('.fx-toast').forEach((node) => { node.hidden = true })
        toast.hidden = false
        window.setTimeout(() => { toast.hidden = true }, 2200)
      })
    })
  })

  root.querySelectorAll<HTMLElement>('[data-fx="amount"]').forEach((host) => {
    if (host.dataset.bound) return
    host.dataset.bound = '1'
    const amount = host.querySelector<HTMLElement>('[data-amount-value]')
    if (!amount) return
    let value = Number(amount.dataset.amountValue ?? '0')
    const paint = () => {
      amount.dataset.amountValue = String(value)
      amount.innerHTML = `$${value.toLocaleString('en-US')}<span>.00</span> <small>USD</small>`
    }
    host.querySelectorAll<HTMLButtonElement>('[data-amt]').forEach((button) => {
      button.addEventListener('click', () => {
        value = Math.max(0, value + Number(button.dataset.amt))
        paint()
      })
    })
  })

  root.querySelectorAll<HTMLElement>('[data-fx="select-one"]').forEach((host) => {
    if (host.dataset.bound) return
    host.dataset.bound = '1'
    host.addEventListener('click', (event) => {
      const item = (event.target as HTMLElement).closest<HTMLElement>('[data-item]')
      if (!item) return
      host.querySelectorAll('[data-item]').forEach((node) => node.classList.remove('on'))
      item.classList.add('on')
    })
  })

  root.querySelectorAll<HTMLElement>('[data-fx="thread"]').forEach((host) => {
    if (host.dataset.bound) return
    host.dataset.bound = '1'
    const input = host.querySelector<HTMLInputElement>('input')
    const list = host.querySelector<HTMLElement>('[data-thread]')
    const send = () => {
      const text = input?.value.trim()
      if (!text || !list || !input) return
      const bubble = document.createElement('div')
      bubble.className = 'fx-bubble'
      bubble.textContent = text
      list.appendChild(bubble)
      input.value = ''
    }
    host.querySelector('[data-send]')?.addEventListener('click', send)
    input?.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') send()
    })
  })

  root.querySelectorAll<HTMLButtonElement>('[data-remove]').forEach((button) => {
    if (button.dataset.bound) return
    button.dataset.bound = '1'
    button.addEventListener('click', () => button.closest('.fx-file')?.remove())
  })
}

export function mountFelixDemos() {
  bind(document)
  enhancePreviews(document)
}


// Every atom and molecule preview keeps its own local state and reset control.
function enhancePreviews(root: ParentNode) {
  root.querySelectorAll<HTMLElement>('.fx-preview').forEach((host) => {
    if (host.dataset.live) return
    host.dataset.live = '1'
    const original = host.innerHTML
    const status = document.createElement('output')
    status.className = 'fx-live-status'
    status.setAttribute('aria-live', 'polite')
    const controls = document.createElement('div')
    controls.className = 'fx-live-controls'
    const reset = document.createElement('button')
    reset.type = 'button'
    reset.className = 'fx-btn fx-btn-line fx-btn-sm'
    reset.textContent = 'Reset preview'
    reset.addEventListener('click', () => {
      const fresh = host.cloneNode(false) as HTMLElement
      fresh.innerHTML = original
      delete fresh.dataset.bound
      delete fresh.dataset.live
      host.replaceWith(fresh)
      bind(fresh.parentElement || document)
      enhancePreviews(fresh.parentElement || document)
    })
    controls.append(reset, status)
    host.append(controls)
    const say = (text: string) => { status.textContent = text }
    host.querySelectorAll<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>('input, select, textarea').forEach((field) => {
      if (!field.getAttribute('aria-label') && !field.closest('label')) field.setAttribute('aria-label', 'Demo value')
      field.addEventListener('input', () => say(field.type === 'checkbox' || field.type === 'radio' ? (field as HTMLInputElement).checked ? 'Selected' : 'Not selected' : `Value: ${field.value}`))
    })
    // Static button examples gain harmless, visible action feedback.
    host.addEventListener('click', (event) => {
      const button = (event.target as HTMLElement).closest<HTMLButtonElement>('button')
      if (!button || button.closest('.fx-live-controls') || button.disabled) return
      say(`${button.textContent?.trim() || button.getAttribute('aria-label') || 'Action'} selected`)
    })
    // Keyboard shortcuts preserve native behavior and close transient menus.
    host.addEventListener('keydown', (event) => {
      if (event.key !== 'Escape') return
      host.querySelectorAll<HTMLDetailsElement>('details').forEach((node) => { node.open = false })
      host.querySelectorAll<HTMLElement>('.fx-date-pop').forEach((node) => { node.hidden = true })
    })
    const tabs = Array.from(host.querySelectorAll<HTMLButtonElement>('.fx-tab'))
    if (tabs.length) {
      tabs[0].parentElement?.setAttribute('role', 'tablist')
      const panels = Array.from(host.querySelectorAll<HTMLElement>('[data-panel]'))
      const sync = () => tabs.forEach((tab, i) => {
        const selected = tab.classList.contains('is-on')
        tab.setAttribute('role', 'tab')
        tab.setAttribute('aria-selected', String(selected))
        tab.tabIndex = selected ? 0 : -1
        tab.id ||= `fx-tab-${Math.random().toString(36).slice(2)}`
        const panel = panels.find((p) => p.dataset.panel === tab.dataset.tab)
        if (panel) {
          panel.id ||= `${tab.id}-panel`
          panel.setAttribute('role', 'tabpanel')
          panel.setAttribute('aria-labelledby', tab.id)
          panel.tabIndex = 0
          tab.setAttribute('aria-controls', panel.id)
        }
        tab.addEventListener('keydown', (event) => {
          const next = event.key === 'ArrowRight' ? (i + 1) % tabs.length : event.key === 'ArrowLeft' ? (i + tabs.length - 1) % tabs.length : event.key === 'Home' ? 0 : event.key === 'End' ? tabs.length - 1 : -1
          if (next < 0) return
          event.preventDefault()
          tabs[next].click()
          tabs[next].focus()
        })
      })
      sync()
      tabs.forEach((tab) => tab.addEventListener('click', () => {
        tabs.forEach((node) => {
          const selected = node.classList.contains('is-on')
          node.setAttribute('aria-selected', String(selected))
          node.tabIndex = selected ? 0 : -1
        })
      }))
    }
    // Dialogs and drawers trap focus while open, dismiss on Escape or backdrop,
    // and return focus to their opener. They remain local to the preview.
    const scrim = host.querySelector<HTMLElement>('.fx-scrim')
    const opener = host.querySelector<HTMLButtonElement>('[data-open]')
    const dialog = scrim?.firstElementChild as HTMLElement | null
    if (scrim && opener && dialog) {
      scrim.style.position = 'fixed'
      scrim.style.zIndex = '1000'
      dialog.setAttribute('role', 'dialog')
      dialog.setAttribute('aria-modal', 'true')
      dialog.setAttribute('aria-label', dialog.querySelector('b')?.textContent || 'Demo dialog')
      const close = () => { scrim.classList.remove('is-open'); opener.focus() }
      opener.addEventListener('click', () => dialog.querySelector<HTMLElement>('button, input, select, textarea, [tabindex]')?.focus())
      scrim.addEventListener('click', (event) => { if (event.target === scrim) close() })
      host.querySelectorAll('[data-close]').forEach((node) => node.addEventListener('click', close))
      dialog.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') { event.preventDefault(); close(); return }
        if (event.key !== 'Tab') return
        const focusable = Array.from(dialog.querySelectorAll<HTMLElement>('button:not(:disabled), input:not(:disabled), select, textarea, a[href], [tabindex="0"]'))
        const first = focusable[0], last = focusable[focusable.length - 1]
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus() }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus() }
      })
    }
  })
}
