// Live previews for the Bootstrap-depth component set (.bsx blocks).
// The same markup is used by every template, so one script covers all of them.
// Static markup stays the source of truth. This adds behavior on top:
// clicks, toggles, overlays, toasts. A "Reset" chip restores any block.

type El = HTMLElement

const q = <T extends El = El>(r: ParentNode, s: string) => r.querySelector<T>(s)
const qa = <T extends El = El>(r: ParentNode, s: string) => Array.from(r.querySelectorAll<T>(s))
const txt = (e: El) => (e.textContent || '').trim()

function sectionTitle(block: El): string {
  let n: Element | null = block.previousElementSibling
  while (n) {
    if (/^H[23]$/.test(n.tagName)) return (n.textContent || '').replace(/[\u200b#]/g, '').trim().toLowerCase()
    n = n.previousElementSibling
  }
  return ''
}

function themeOf(block: El): string {
  return Array.from(block.classList).find((c) => c.startsWith('bsx-')) || 'bsx-fx'
}

function el(tag: string, cls: string, html = ''): El {
  const e = document.createElement(tag)
  e.className = cls
  e.innerHTML = html
  return e
}

/* ---------- overlay layer (modals, offcanvas, toasts) ---------- */

function layer(theme: string): El {
  const l = el('div', `bsx bsx-live-layer ${theme}`)
  document.body.appendChild(l)
  return l
}

function openOverlay(theme: string, build: (close: () => void, host: El) => El, className = 'bsx-ov') {
  const host = layer(theme)
  const ov = el('div', className)
  const close = () => {
    ov.classList.remove('in')
    setTimeout(() => host.remove(), 180)
    document.removeEventListener('keydown', onKey)
  }
  const onKey = (e: KeyboardEvent) => {
    if (e.key === 'Escape') close()
  }
  document.addEventListener('keydown', onKey)
  ov.addEventListener('mousedown', (e) => {
    if (e.target === ov) close()
  })
  ov.appendChild(build(close, host))
  host.appendChild(ov)
  requestAnimationFrame(() => ov.classList.add('in'))
  return close
}

/* ---------- toasts ---------- */

const TOAST_KINDS: Record<string, { title: string; body: string; cls: string }> = {
  default: { title: 'Notice', body: 'Hello, this is a toast message.', cls: '' },
  success: { title: 'Success', body: 'Saved successfully.', cls: 'col-ok' },
  warning: { title: 'Warning', body: 'Your trial ends in 3 days.', cls: 'col-warn' },
  error: { title: 'Error', body: 'Failed to save.', cls: 'col-bad' },
  info: { title: 'Info', body: 'New version available.', cls: 'col-info' },
}
const POSITIONS = ['top-left', 'top-center', 'top-right', 'bottom-left', 'bottom-center', 'bottom-right']

function toastStack(theme: string, pos: string): El {
  const id = `bsx-toasts-${pos}`
  let s = document.getElementById(id)
  if (!s) {
    s = el('div', `bsx bsx-live-layer bsx-toasts ${theme} ${pos}`)
    s.id = id
    document.body.appendChild(s)
  }
  s.className = `bsx bsx-live-layer bsx-toasts ${theme} ${pos}`
  return s
}

function fireToast(theme: string, kind: string, pos: string, auto: boolean) {
  const k = TOAST_KINDS[kind]
  const stack = toastStack(theme, pos)
  const t = el(
    'div',
    `toast bsx-toast-in ${k.cls}`,
    `<div class="hd"><span class="dot"></span>${k.title}<small>just now</small><span class="x" role="button" aria-label="Close">&#10005;</span></div><div class="bd">${k.body}</div>`
  )
  const kill = () => {
    t.classList.add('out')
    setTimeout(() => {
      t.remove()
      if (!stack.children.length) stack.remove()
    }, 200)
  }
  q(t, '.x')!.addEventListener('click', kill)
  if (pos.startsWith('top')) stack.prepend(t)
  else stack.appendChild(t)
  if (auto) setTimeout(kill, 4000)
}

function toastControls(block: El) {
  const theme = themeOf(block)
  const bar = el('div', 'bsx-livebar')
  bar.innerHTML =
    `<span class="lbl">Try it</span>` +
    Object.keys(TOAST_KINDS)
      .map((k) => `<button type="button" class="btn ${k === 'success' ? 'ok' : k === 'warning' ? 'warn' : k === 'error' ? 'bad' : k === 'info' ? 'info' : 'pri'} sm" data-toast="${k}">${k[0].toUpperCase() + k.slice(1)}</button>`)
      .join('') +
    `<select class="inp sel sm" aria-label="Position">${POSITIONS.map((p) => `<option value="${p}"${p === 'top-right' ? ' selected' : ''}>${p.replace('-', ' ')}</option>`).join('')}</select>` +
    `<label class="ck on"><i>&#10003;</i> Auto hide</label>`
  const ck = q(bar, '.ck')!
  ck.addEventListener('click', () => {
    const on = ck.classList.toggle('on')
    q(ck, 'i')!.innerHTML = on ? '&#10003;' : ''
  })
  bar.addEventListener('click', (e) => {
    const b = (e.target as El).closest<El>('[data-toast]')
    if (!b) return
    fireToast(theme, b.dataset.toast!, q<HTMLSelectElement>(bar, 'select')!.value, ck.classList.contains('on'))
  })
  block.prepend(bar)
}

/* ---------- modals and offcanvas triggers ---------- */

function modalControls(block: El) {
  const theme = themeOf(block)
  const variants: [string, string][] = [
    ['Default', ''],
    ['Small', 'sm'],
    ['Large', 'lg'],
    ['Centered', 'ctr'],
    ['Scrollable', 'scr'],
  ]
  const bar = el('div', 'bsx-livebar')
  bar.innerHTML = `<span class="lbl">Try it</span>` + variants.map(([n, v]) => `<button type="button" class="btn ${v ? '' : 'pri'} sm" data-modal="${v}">${n}</button>`).join('')
  bar.addEventListener('click', (e) => {
    const b = (e.target as El).closest<El>('[data-modal]')
    if (!b) return
    const v = b.dataset.modal!
    const body =
      v === 'scr'
        ? Array.from({ length: 14 }, (_, i) => `<p>Scrollable line ${i + 1}. The body scrolls, the header and footer stay.</p>`).join('')
        : v === 'lg'
          ? 'Wide content area for forms and tables.'
          : v === 'sm'
            ? '<b>Confirm delete?</b>'
            : 'Modal body text goes here.'
    openOverlay(theme, (close) => {
      const m = el(
        'div',
        `modal ${v === 'sm' || v === 'lg' ? v : ''} ${v === 'scr' ? 'scr' : ''}`,
        `<div class="hd"><span>${v === 'sm' ? 'Delete item' : 'Modal title'}</span><span class="x" role="button" aria-label="Close">&#10005;</span></div><div class="bd">${body}</div><div class="ft"><span class="btn" data-c>${v === 'sm' ? 'No' : 'Close'}</span><span class="btn ${v === 'sm' ? 'bad' : 'pri'}" data-c>${v === 'sm' ? 'Delete' : 'Save changes'}</span></div>`
      )
      qa(m, '.x,[data-c]').forEach((x) => x.addEventListener('click', close))
      return m
    }, `bsx-ov${v === 'ctr' ? ' ctr' : ''}`)
  })
  block.prepend(bar)
}

function offcanvasControls(block: El) {
  const theme = themeOf(block)
  const bar = el('div', 'bsx-livebar')
  bar.innerHTML = `<span class="lbl">Try it</span>` + ['start', 'end', 'top', 'bottom'].map((s) => `<button type="button" class="btn ${s === 'end' ? 'pri' : ''} sm" data-oc="${s}">${s[0].toUpperCase() + s.slice(1)}</button>`).join('')
  bar.addEventListener('click', (e) => {
    const b = (e.target as El).closest<El>('[data-oc]')
    if (!b) return
    const side = b.dataset.oc!
    openOverlay(theme, (close) => {
      const o = el('div', `oc ${side} live`, `<div class="hd"><span>Offcanvas ${side}</span><span class="x" role="button" aria-label="Close">&#10005;</span></div><div class="bd">Content for the ${side} panel. Press Escape or click outside to close.</div>`)
      q(o, '.x')!.addEventListener('click', close)
      return o
    }, `bsx-ov oc-${side}`)
  })
  block.prepend(bar)
}

/* ---------- generic behaviors ---------- */

function setRange(rng: El, clientX: number) {
  const r = rng.getBoundingClientRect()
  const pct = Math.max(0, Math.min(100, Math.round(((clientX - r.left) / r.width) * 100)))
  const b = q(rng, 'b')
  const s = q(rng, 's')
  if (b) b.style.width = pct + '%'
  if (s) s.style.left = pct + '%'
  rng.setAttribute('data-v', String(pct))
  let out = q(rng.parentElement!, '.bsx-val')
  if (!out) {
    out = el('span', 'bsx-val')
    rng.parentElement!.appendChild(out)
  }
  out.textContent = pct + '%'
}

const SLIDES = [
  ['Slide one', 'linear-gradient(135deg,var(--b-pri),var(--b-info))'],
  ['Slide two', 'linear-gradient(135deg,var(--b-info),var(--b-ok))'],
  ['Slide three', 'linear-gradient(135deg,var(--b-warn),var(--b-bad))'],
]

function carousel(car: El, step: number | null, to?: number) {
  const inds = qa(car, '.ind i')
  let cur = Math.max(0, inds.findIndex((i) => i.classList.contains('a')))
  cur = to != null ? to : (cur + (step || 0) + inds.length) % inds.length
  inds.forEach((i, n) => i.classList.toggle('a', n === cur))
  const sl = q(car, '.sl')
  if (sl) {
    sl.textContent = SLIDES[cur % SLIDES.length][0]
    sl.style.background = SLIDES[cur % SLIDES.length][1]
  }
}

function onClick(block: El, e: MouseEvent, markDirty: () => void) {
  const t = e.target as El
  const theme = themeOf(block)

  // alerts: dismiss
  const ax = t.closest<El>('.alert .x')
  if (ax) {
    const a = ax.closest<El>('.alert')!
    a.classList.add('gone')
    setTimeout(() => (a.style.display = 'none'), 180)
    return markDirty()
  }

  // checks, radios, switches
  const ck = t.closest<El>('.ck:not(.dis)')
  if (ck && !ck.closest('.bsx-livebar')) {
    if (ck.classList.contains('rd')) {
      const row = ck.parentElement!
      qa(row, '.ck.rd').forEach((r) => r.classList.remove('on'))
      ck.classList.add('on')
    } else {
      const on = ck.classList.toggle('on')
      ck.classList.remove('ind')
      const i = q(ck, 'i')
      if (i) i.innerHTML = on ? '&#10003;' : ''
    }
    return markDirty()
  }
  const sw = t.closest<El>('.sw:not(.dis)')
  if (sw) {
    sw.classList.toggle('on')
    return markDirty()
  }

  // range
  const rng = t.closest<El>('.rng')
  if (rng) {
    setRange(rng, e.clientX)
    return markDirty()
  }

  // nav and pagination
  const na = t.closest<El>('.nav a:not(.dis)')
  if (na) {
    qa(na.parentElement!, 'a').forEach((a) => a.classList.remove('act'))
    na.classList.add('act')
    return markDirty()
  }
  const pa = t.closest<El>('.pg a:not(.dis)')
  if (pa) {
    const pg = pa.parentElement!
    const links = qa(pg, 'a')
    const nums = links.filter((a) => /^\d+$/.test(txt(a)))
    const label = txt(pa)
    const cur = nums.findIndex((a) => a.classList.contains('act'))
    let next = nums.indexOf(pa)
    if (label === '«') next = Math.max(0, cur - 1)
    if (label === '»') next = Math.min(nums.length - 1, cur + 1)
    if (next >= 0) {
      nums.forEach((a, n) => a.classList.toggle('act', n === next))
      links.forEach((a) => {
        if (txt(a) === '«') a.classList.toggle('dis', next === 0)
        if (txt(a) === '»') a.classList.toggle('dis', next === nums.length - 1)
      })
    }
    return markDirty()
  }

  // dropdowns
  const dd = t.closest<El>('.dd')
  if (dd) {
    const item = t.closest<El>('.menu a:not(.dis)')
    if (item) {
      qa(dd, '.menu a').forEach((a) => a.classList.remove('act'))
      item.classList.add('act')
      dd.classList.add('shut')
    } else if (t.closest('.btn')) {
      dd.classList.toggle('shut')
    }
    return markDirty()
  }

  // button groups and toggles
  const btn = t.closest<El>('.btn')
  if (btn && !btn.closest('.bsx-livebar') && !btn.closest('.dd')) {
    const grp = btn.closest<El>('.grp')
    const title = sectionTitle(block)
    if (btn.classList.contains('dis')) return
    if (title.includes('loading')) {
      if (btn.dataset.busy) return
      btn.dataset.busy = '1'
      const old = btn.innerHTML
      btn.classList.add('dis')
      btn.innerHTML = '<span class="spin sm"></span> Working'
      setTimeout(() => {
        btn.innerHTML = old
        btn.classList.remove('dis')
        delete btn.dataset.busy
      }, 1600)
      return markDirty()
    }
    if (title.includes('collapse')) {
      const cl = q(block, '.cl')
      const det = q<HTMLDetailsElement>(block, 'details')
      const label = txt(btn).toLowerCase()
      if (cl && !label.includes('both')) cl.classList.toggle('open')
      if (label.includes('both')) {
        const open = !cl?.classList.contains('open')
        cl?.classList.toggle('open', open)
        if (det) det.open = open
      }
      return markDirty()
    }
    if (grp) {
      const checkbox = /checkbox/i.test(txt(btn))
      if (checkbox) btn.classList.toggle('act')
      else {
        qa(grp, '.btn').forEach((b) => b.classList.remove('act'))
        btn.classList.add('act')
      }
      return markDirty()
    }
    if (title.includes('active') || title.includes('toggle')) {
      btn.classList.toggle('act')
      return markDirty()
    }
    // plain buttons: press feedback
    btn.classList.add('pressed')
    setTimeout(() => btn.classList.remove('pressed'), 160)
    return
  }

  // carousel
  const car = t.closest<El>('.car')
  if (car) {
    if (t.closest('.ar.l')) carousel(car, -1)
    else if (t.closest('.ar.r')) carousel(car, 1)
    else {
      const ind = t.closest<El>('.ind i')
      if (ind) carousel(car, null, qa(car, '.ind i').indexOf(ind))
    }
    return markDirty()
  }

  // modal and offcanvas static previews: close buttons hide them
  const xs = t.closest<El>('.modal .hd span:last-child, .oc .hd span:last-child, .toast .hd span:last-child')
  if (xs && /✕|\u2715/.test(txt(xs))) {
    const host = xs.closest<El>('.modal, .oc, .toast')!
    host.classList.add('gone')
    setTimeout(() => (host.style.display = 'none'), 180)
    return markDirty()
  }

  // tooltips and popovers: toggle
  const tip = t.closest<El>('.tip, .pop')
  if (tip) {
    tip.classList.toggle('dim')
    return markDirty()
  }

  // list groups
  const li = t.closest<El>('.lg a, .list a, .lgrp a')
  if (li && li.parentElement) {
    qa(li.parentElement, 'a').forEach((a) => a.classList.remove('act'))
    li.classList.add('act')
    return markDirty()
  }

  // steps
  const st = t.closest<El>('.step .s')
  if (st) {
    const all = qa(st.parentElement!, '.s')
    const idx = all.indexOf(st)
    all.forEach((s, n) => {
      s.classList.toggle('done', n < idx)
      s.classList.toggle('cur', n === idx)
      const i = q(s, 'i')
      if (i) i.innerHTML = n < idx ? '&#10003;' : String(n + 1)
    })
    return markDirty()
  }
  void theme
}

function bindBlock(block: El) {
  if (block.dataset.live) return
  block.dataset.live = '1'
  const title = sectionTitle(block)
  const snapshot = block.innerHTML
  let dirty = false
  let chip: El | null = null
  const markDirty = () => {
    if (dirty) return
    dirty = true
    chip = el('button', 'bsx-reset')
    chip.setAttribute('type', 'button')
    chip.innerHTML = '&#8634; Reset'
    chip.addEventListener('click', (ev) => {
      ev.stopPropagation()
      block.innerHTML = snapshot
      block.removeAttribute('data-live')
      dirty = false
      block.dataset.liveReady = ''
      bindBlock(block)
    })
    block.appendChild(chip)
  }
  if (title === 'toasts') toastControls(block)
  if (title === 'modals') modalControls(block)
  if (title === 'offcanvas') offcanvasControls(block)
  block.classList.add('bsx-liveblock')
  block.addEventListener('click', (e) => onClick(block, e, markDirty))
  // preview of real range drag
  qa(block, '.rng').forEach((r) => {
    r.addEventListener('mousedown', (e) => {
      const move = (m: MouseEvent) => setRange(r, m.clientX)
      const up = () => {
        document.removeEventListener('mousemove', move)
        document.removeEventListener('mouseup', up)
      }
      document.addEventListener('mousemove', move)
      document.addEventListener('mouseup', up)
      void e
    })
  })
}

export function mountBsxLive() {
  qa(document, '.bsx:not(.bsx-live-layer)').forEach(bindBlock)
}
