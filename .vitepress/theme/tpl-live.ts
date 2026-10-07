// Live previews for the component pages of Scopecraft (.sc) and Lumen (.lmn).
// Static markup stays as written. This adds clicks, toggles, validation,
// triggerable toasts and a real modal, with a Reset chip per block.

type El = HTMLElement
const qa = (r: ParentNode, s: string) => Array.from(r.querySelectorAll<El>(s))
const q = (r: ParentNode, s: string) => r.querySelector<El>(s)
const txt = (e: El) => (e.textContent || '').trim()
const mk = (tag: string, cls: string, html = ''): El => {
  const e = document.createElement(tag)
  e.className = cls
  e.innerHTML = html
  return e
}

function title(block: El): string {
  let n: Element | null = block.previousElementSibling
  while (n) {
    if (/^H[23]$/.test(n.tagName)) return (n.textContent || '').replace(/[\u200b#]/g, '').trim().toLowerCase()
    n = n.previousElementSibling
  }
  return ''
}

const excl = (el: El, sel: string, cls: string) => {
  qa(el.parentElement!, sel).forEach((s) => s.classList.remove(cls))
  el.classList.add(cls)
}

/* ---------- toast (Scopecraft) ---------- */

const POS = ['top-left', 'top-center', 'top-right', 'bottom-left', 'bottom-center', 'bottom-right']
const KINDS: Record<string, [string, string, string]> = {
  success: ['&#10003;', 'Proposal sent to Odalys Brandt', 'var(--ink)'],
  warning: ['&#9888;', '2 questions are still unanswered', 'var(--warn)'],
  error: ['&#10005;', 'Could not send. The client email bounced', 'var(--bad)'],
  info: ['&#9432;', 'Press Cmd+K to search anything', 'var(--blue)'],
}

function stack(cls: string, pos: string): El {
  const id = `tpl-toasts-${pos}`
  let s = document.getElementById(id)
  if (!s) {
    s = mk('div', `${cls} tpl-toasts ${pos}`)
    s.id = id
    document.body.appendChild(s)
  }
  return s
}

function toast(cls: string, kind: string, pos: string, auto: boolean) {
  const [icon, msg, bg] = KINDS[kind]
  const s = stack(cls, pos)
  const t = mk('div', 'tpl-toast', `<span>${icon}</span> ${msg} <span class="x" role="button" aria-label="Close">&#10005;</span>`)
  t.style.background = bg
  const kill = () => {
    t.classList.add('out')
    setTimeout(() => {
      t.remove()
      if (!s.children.length) s.remove()
    }, 200)
  }
  q(t, '.x')!.addEventListener('click', kill)
  pos.startsWith('top') ? s.prepend(t) : s.appendChild(t)
  if (auto) setTimeout(kill, 4000)
}

function toastBar(block: El, cls: string) {
  const bar = mk(
    'div',
    'tpl-livebar',
    `<span class="lbl">Try it</span>` +
      Object.keys(KINDS).map((k) => `<span class="${cls}-btn ${k === 'success' ? 'pri' : ''}" data-toast="${k}">${k[0].toUpperCase() + k.slice(1)}</span>`).join('') +
      `<select aria-label="Position">${POS.map((p) => `<option value="${p}"${p === 'top-right' ? ' selected' : ''}>${p.replace('-', ' ')}</option>`).join('')}</select>` +
      `<label><input type="checkbox" checked> Auto hide</label>`
  )
  bar.addEventListener('click', (e) => {
    const b = (e.target as El).closest<El>('[data-toast]')
    if (!b) return
    toast(cls, b.dataset.toast!, (q(bar, 'select') as unknown as HTMLSelectElement).value, (q(bar, 'input') as HTMLInputElement).checked)
  })
  block.prepend(bar)
}

/* ---------- modal (Scopecraft) ---------- */

function modalBar(block: El) {
  const bar = mk('div', 'tpl-livebar', `<span class="lbl">Try it</span><span class="sc-btn pri" data-m="send">Send proposal</span><span class="sc-btn" data-m="del">Delete project</span>`)
  bar.addEventListener('click', (e) => {
    const b = (e.target as El).closest<El>('[data-m]')
    if (!b) return
    const del = b.dataset.m === 'del'
    const host = mk('div', 'sc tpl-layer')
    const ov = mk('div', 'tpl-ov')
    const close = () => {
      ov.classList.remove('in')
      setTimeout(() => host.remove(), 180)
      document.removeEventListener('keydown', key)
    }
    const key = (ev: KeyboardEvent) => ev.key === 'Escape' && close()
    document.addEventListener('keydown', key)
    ov.addEventListener('mousedown', (ev) => ev.target === ov && close())
    ov.innerHTML = del
      ? `<div class="scx-md"><b>Delete Hazelgrove Clinics?</b><p>This removes the scope and the price. It cannot be undone.</p><div class="sc-wrap" style="justify-content:flex-end"><span class="sc-btn" data-c>Cancel</span><span class="sc-btn pri" style="background:var(--bad);border-color:var(--bad)" data-c>Delete</span></div></div>`
      : `<div class="scx-md"><b>Send proposal?</b><p>Odalys Brandt will get a link to the scope and price. You can still edit afterwards.</p><div class="sc-wrap" style="justify-content:flex-end"><span class="sc-btn" data-c>Cancel</span><span class="sc-btn pri" data-c>Send</span></div></div>`
    qa(ov, '[data-c]').forEach((x) => x.addEventListener('click', close))
    host.appendChild(ov)
    document.body.appendChild(host)
    requestAnimationFrame(() => ov.classList.add('in'))
  })
  block.prepend(bar)
}

/* ---------- generic click behavior ---------- */

function setBar(bar: El, clientX: number) {
  const i = q(bar, 'i')
  if (!i) return
  const r = bar.getBoundingClientRect()
  i.style.width = Math.max(0, Math.min(100, Math.round(((clientX - r.left) / r.width) * 100))) + '%'
}

function menu(btn: El, items: string[]) {
  const old = q(document.body, '.tpl-menu')
  if (old) old.remove()
  const r = btn.getBoundingClientRect()
  const m = mk('div', 'tpl-menu')
  m.style.cssText = `position:fixed;left:${r.left}px;top:${r.bottom + 4}px`
  m.innerHTML = items.map((i) => `<a>${i}</a>`).join('')
  m.addEventListener('click', (e) => {
    const a = (e.target as El).closest('a')
    if (a && !btn.classList.contains('sq')) btn.innerHTML = `${a.textContent} &#9662;`
    m.remove()
  })
  document.body.appendChild(m)
  const off = (e: MouseEvent) => {
    if (!m.contains(e.target as Node)) {
      m.remove()
      document.removeEventListener('mousedown', off)
    }
  }
  setTimeout(() => document.addEventListener('mousedown', off), 0)
}

function onClick(block: El, e: MouseEvent, dirty: () => void) {
  const t = e.target as El
  const sec = title(block)

  // Scopecraft
  const seg = t.closest<El>('.sc-seg span, .sc-tabs span, .lmn-seg span')
  if (seg) return excl(seg, 'span', 'on'), dirty()
  const pg = t.closest<El>('.scx-pg span')
  if (pg) {
    const all = qa(pg.parentElement!, 'span')
    const nums = all.filter((s) => /^\d+$/.test(txt(s)))
    const cur = nums.findIndex((s) => s.classList.contains('on'))
    let n = nums.indexOf(pg)
    if (/‹|‹/.test(txt(pg)) || pg.innerHTML.includes('‹')) n = Math.max(0, cur - 1)
    if (pg.innerHTML.includes('›')) n = Math.min(nums.length - 1, cur + 1)
    if (n >= 0) nums.forEach((s, i) => s.classList.toggle('on', i === n))
    return dirty()
  }
  const st = t.closest<El>('.scx-st span')
  if (st) {
    const all = qa(st.parentElement!, 'span')
    const i = all.indexOf(st)
    all.forEach((s, n) => {
      s.classList.toggle('done', n < i)
      s.classList.toggle('on', n === i)
    })
    return dirty()
  }
  const nav = t.closest<El>('.sc-nav')
  if (nav) return excl(nav, '.sc-nav', 'on'), dirty()
  const al = t.closest<El>('.scx-al .x')
  if (al) {
    const a = al.closest<El>('.scx-al')!
    a.style.opacity = '0'
    setTimeout(() => (a.style.display = 'none'), 180)
    return dirty()
  }
  const bar = t.closest<El>('.sc-bar, .lmn-bar2')
  if (bar) return setBar(bar, e.clientX), dirty()

  // Lumen
  const lb = t.closest<El>('.lmn-btn')
  if (lb && !lb.closest('.tpl-livebar')) {
    if (lb.classList.contains('dis')) return
    const grp = lb.closest<El>('.lmn-bg')
    if (sec.includes('loading')) {
      if (lb.dataset.busy) return
      lb.dataset.busy = '1'
      const old = lb.innerHTML
      lb.style.opacity = '.7'
      lb.innerHTML = '<span class="tpl-spin"></span> Working'
      setTimeout(() => {
        lb.innerHTML = old
        lb.style.opacity = ''
        delete lb.dataset.busy
      }, 1600)
      return dirty()
    }
    if (grp && qa(grp, '.lmn-btn.on').length) return excl(lb, '.lmn-btn', 'on'), dirty()
    if (sec.includes('toggle')) return lb.classList.toggle('on'), dirty()
    if (/▾|▾/.test(txt(lb)) || lb.innerHTML.includes('▾')) {
      menu(lb, sec.includes('split') ? ['Run', 'Run with trace', 'Schedule'] : ['Production', 'Staging', 'Development'])
      return
    }
    lb.classList.add('tpl-pressed')
    setTimeout(() => lb.classList.remove('tpl-pressed'), 160)
    return
  }
  const sc = t.closest<El>('.sc-btn')
  if (sc && !sc.closest('.tpl-livebar')) {
    if (sc.classList.contains('dis')) return
    sc.classList.add('tpl-pressed')
    setTimeout(() => sc.classList.remove('tpl-pressed'), 160)
    return
  }
  const tog = t.closest<El>('.lmn-tog')
  if (tog) return tog.classList.toggle('on'), dirty()
  const chip = t.closest<El>('.sc-chip, .lmn-chip')
  if (chip) return chip.classList.toggle('tpl-dim'), dirty()
}

function validate(block: El) {
  const ins = qa(block, 'input.scx-in')
  if (ins.length < 2) return
  const [em, bud] = ins as unknown as HTMLInputElement[]
  const setH = (inp: HTMLInputElement, ok: boolean, good: string, bad: string) => {
    inp.classList.toggle('ok', ok)
    inp.classList.toggle('bad', !ok)
    inp.setAttribute('aria-invalid', String(!ok))
    const h = inp.parentElement!.querySelector('.scx-help')
    if (h) {
      h.className = `scx-help ${ok ? 'ok' : 'bad'}`
      h.textContent = ok ? good : bad
    }
  }
  em.addEventListener('input', () => setH(em, /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(em.value), 'Looks good.', 'Enter a full email address.'))
  bud.addEventListener('input', () => {
    const n = Number(bud.value.replace(/[^0-9.]/g, ''))
    setH(bud, n > 0 && n <= 50000, 'Within the approved range.', n > 50000 ? 'Over the approved range ($50,000).' : 'Enter an amount.')
  })
}

function bind(block: El) {
  if (block.dataset.tplLive) return
  block.dataset.tplLive = '1'
  const sec = title(block)
  const snapshot = block.innerHTML
  let isDirty = false
  const dirty = () => {
    if (isDirty) return
    isDirty = true
    const chip = mk('button', 'tpl-reset', '&#8634; Reset')
    chip.setAttribute('type', 'button')
    chip.addEventListener('click', (ev) => {
      ev.stopPropagation()
      block.innerHTML = snapshot
      delete block.dataset.tplLive
      bind(block)
    })
    block.appendChild(chip)
  }
  const cls = block.classList.contains('sc') ? 'sc' : 'lmn'
  block.classList.add('tpl-liveblock')
  if (cls === 'sc') {
    if (sec === 'toast') toastBar(block, 'sc')
    if (sec.startsWith('modal')) modalBar(block)
    if (sec.startsWith('alerts')) qa(block, '.scx-al').forEach((a) => a.appendChild(mk('span', 'x', '&#10005;')))
    if (sec.startsWith('input with validation')) validate(block)
    qa(block, '.sc-input, .sc-search').forEach((i) => {
      i.setAttribute('contenteditable', 'true')
      i.setAttribute('spellcheck', 'false')
    })
  } else {
    qa(block, '.lmn-input').forEach((i) => {
      i.setAttribute('contenteditable', 'true')
      i.setAttribute('spellcheck', 'false')
    })
  }
  block.addEventListener('click', (e) => onClick(block, e, dirty))
}

export function mountTplLive(path: string) {
  const sc = path.startsWith('/scopecraft/') && path.endsWith('/components')
  const lm = path.startsWith('/lumen/') && path.endsWith('/components')
  if (!sc && !lm) return
  qa(document, sc ? '.vp-doc .sc' : '.vp-doc .lmn').forEach(bind)
}
