import fs from 'node:fs'
import path from 'node:path'

const root = path.resolve(import.meta.dirname, '..')
const ticket = fs.readFileSync(path.join(root, '.vitepress/theme/payment-ticket/ticket.css'), 'utf8')
const base = `.atoast{
  --at-stage:var(--vp-c-bg-alt);--at-paper:var(--vp-c-bg-elv);--at-ink:var(--vp-c-text-1);--at-muted:var(--vp-c-text-2);--at-line:var(--vp-c-divider);
  --at-ok:var(--vp-c-green-1);--at-bad:var(--vp-c-red-1);--at-warn:#d97706;--at-info:var(--vp-c-brand-1);
  --at-plus:var(--at-ok);--at-minus:var(--at-bad);
  --at-act-bg:color-mix(in srgb,var(--at-info) 14%,var(--at-paper));--at-act-ink:var(--at-info);--at-focus:var(--at-info);
  --at-on-bad:var(--at-paper);--at-on-ok:var(--at-paper);
  --at-cell:color-mix(in srgb,var(--at-ink) 12%,var(--at-paper));
  --at-radius:16px;--at-font:var(--vp-font-family-base);--at-mono:var(--vp-font-family-mono);
  --at-shadow:0 0 0 1px color-mix(in srgb,var(--at-ink) 6%,transparent),0 1px 2px color-mix(in srgb,var(--at-ink) 8%,transparent),0 10px 28px color-mix(in srgb,var(--at-ink) 12%,transparent);
  --at-ease-out:cubic-bezier(.16,1,.3,1);--at-t-enter:320ms;--at-t-exit:220ms;--at-t-reflow:300ms;
  width:100%;max-width:520px;margin:16px auto;color:var(--at-ink);font:13px/1.4 var(--at-font);
}
.atoast *{box-sizing:border-box}
.atoast__bar{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:12px}
.atoast__btn{height:32px;padding:0 10px;border-radius:999px;border:1px solid var(--at-line);background:var(--at-paper);font-size:13px;font-weight:600;cursor:pointer;color:var(--at-ink)}
.atoast__btn:hover{background:color-mix(in srgb,var(--at-ink) 6%,var(--at-paper))}
.atoast__btn[aria-pressed="true"]{background:var(--at-ink);color:var(--at-paper)}
.atoast__stage{position:relative;min-height:520px;height:520px;background:var(--at-stage);border:1px solid var(--at-line);border-radius:calc(var(--at-radius) + 6px);overflow:hidden}
.atoast__empty{position:absolute;inset:0;display:grid;place-items:center;padding:24px;text-align:center;color:var(--at-muted);font-size:13px;margin:0}
.atoast__region{position:absolute;right:16px;bottom:16px;width:min(360px,calc(100% - 32px))}
.atoast__region--bottom-center{left:8px;right:8px;margin:0 auto}
.atoast__list{list-style:none;margin:0;padding:0;position:relative;min-height:64px}
.atoast__item{position:absolute;left:0;right:0;bottom:0;transition:transform var(--at-t-reflow) var(--at-ease-out),opacity .18s ease,filter .18s ease}
.atoast__item--spot{filter:blur(2px);opacity:.55}
.atoast.is-reduced .atoast__item--spot,.atoast--terminal .atoast__item--spot{filter:none;opacity:.45}
.atoast__card{display:flex;align-items:center;gap:12px;min-height:64px;padding:12px 12px 12px 14px;background:var(--at-paper);border-radius:var(--at-radius);box-shadow:var(--at-shadow);touch-action:pan-y;position:relative}
.atoast__card--busy .atoast__title{background:linear-gradient(90deg,var(--at-muted),var(--at-ink),var(--at-muted));background-size:200% 100%;-webkit-background-clip:text;background-clip:text;color:transparent;animation:atoast-shimmer 1.6s linear infinite}
@keyframes atoast-shimmer{to{background-position:-50% 0}}
.atoast.is-reduced .atoast__card--busy .atoast__title{animation:none;color:var(--at-muted);background:none}
.atoast__viz{width:56px;height:32px;flex:none}
.atoast__viz--sm{width:48px;height:28px}
.atoast__text{min-width:0;flex:1;display:grid;gap:2px;position:relative}
.atoast__title{margin:0;font-size:14px;line-height:20px;font-weight:600;letter-spacing:-.005em;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;font-variant-numeric:tabular-nums}
.atoast__detail{margin:0;font-size:13px;line-height:18px;color:var(--at-muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.atoast__mono{font-family:var(--at-mono);font-size:12px}
.atoast__plus{color:var(--at-plus)}.atoast__minus{color:var(--at-minus)}
.atoast__vh{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);border:0}
.atoast__act{flex:none;height:28px;padding:0 12px;border-radius:999px;border:0;background:var(--at-act-bg);color:var(--at-act-ink);font-size:13px;font-weight:600;max-width:140px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;cursor:pointer}
.atoast__act:hover{background:color-mix(in srgb,var(--at-info) 22%,var(--at-paper))}
.atoast__act:focus-visible,.atoast__close:focus-visible{outline:2px solid var(--at-focus);outline-offset:2px}
.atoast__close{flex:none;width:28px;height:28px;margin-right:-4px;border:0;border-radius:999px;background:transparent;color:var(--at-muted);cursor:pointer;position:relative}
.atoast__close:hover{background:color-mix(in srgb,var(--at-ink) 7%,var(--at-paper));color:var(--at-ink)}
.atoast__queue{position:absolute;right:0;bottom:calc(100% + 8px);margin:0;padding:0 8px;border-radius:999px;background:var(--at-paper);color:var(--at-muted);font-size:11px;font-weight:600;line-height:20px;box-shadow:var(--at-shadow)}
.atoast__live{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);border:0}
.atoast__item:not(.atoast__region--expanded) .atoast__card--peek>*:not(.atoast__card){opacity:0}
.atoast__fill--ok{fill:var(--at-ok)}.atoast__fill--bad{fill:var(--at-bad)}.atoast__fill--warn{fill:var(--at-warn)}.atoast__fill--info{fill:var(--at-info)}.atoast__fill--cell{fill:var(--at-cell)}.atoast__fill--muted{fill:color-mix(in srgb,var(--at-muted) 55%,transparent)}.atoast__fill--ink{fill:color-mix(in srgb,var(--at-ink) 26%,var(--at-paper))}.atoast__fill--on-bad{fill:var(--at-on-bad)}.atoast__fill--on-ok{fill:var(--at-on-ok)}
.atoast__stroke--ok{stroke:var(--at-ok)}.atoast__stroke--bad{stroke:var(--at-bad)}.atoast__stroke--info{stroke:var(--at-info)}.atoast__stroke--muted{stroke:color-mix(in srgb,var(--at-muted) 60%,transparent)}
.atoast-page .VPDoc .container{max-width:1560px!important}
.atoast-page .VPDoc .content,.atoast-page .VPDoc .content-container{max-width:none!important;width:100%}
@media(max-width:480px){.atoast__stage{min-height:600px;height:600px}.atoast__region{left:8px;right:8px;bottom:max(12px,calc(env(safe-area-inset-bottom,0px) + 8px))}.atoast__card{min-height:60px;gap:10px}.atoast__close::before{content:"";position:absolute;inset:-8px}}
@media(min-width:481px){.atoast__region--bottom-center{left:auto;right:16px;width:min(360px,calc(100% - 32px))}}
@media(prefers-reduced-motion:reduce){.atoast__item{transition:none!important}.atoast__card--busy .atoast__title{animation:none}}
html.tpl-dark .atoast{--at-shadow:0 0 0 1px var(--at-line),0 12px 32px rgba(0,0,0,.45);--at-warn:#fbbf24;--at-cell:color-mix(in srgb,var(--at-ink) 16%,var(--at-paper))}
html.felix-dark .atoast-felix,html.pf-dark .atoast,html.sc-dark .atoast,html.lmn-dark .atoast,html.pp-dark .atoast,.atoast-trial,.atoast-lustro:not(.atoast-local-dark){--at-on-ok:var(--at-paper)}
.atoast--glass .atoast__card{background:linear-gradient(180deg,color-mix(in srgb,var(--at-info) 6%,var(--at-paper)),var(--at-paper))}
.atoast--terminal *{font-family:var(--at-mono)!important}
.atoast--terminal .atoast__item{transition-timing-function:steps(4,end)!important}
.atoast-margin{--at-warn:#cc7a11}
.atoast-meadow{--at-warn:#ab8f3f}
.atoast-pawprint{--at-warn:#bd8c2f}
html[data-tpl="spark"]:not(.tpl-dark) .atoast-spark{--at-act-ink:#a34d0f}
html[data-tpl="crestway"]:not(.tpl-dark) .atoast-crestway{--at-act-ink:#2a61a6}
html[data-tpl="bastion"].tpl-dark .atoast-bastion{--at-warn:#f5e663;--at-bad:#ffb000}
\n/* adapters */\n`

const idx = ticket.indexOf('/* Adapters */')
let adapters = ticket.slice(idx)
adapters = adapters
  .replace(/\.ticket/g, '.atoast')
  .replace(/--ticket-/g, '--at-')
  .replace(/ticket-local-dark/g, 'atoast-local-dark')
  .split('\n')
  .filter((l) => !l.includes('ticket__') && !l.includes('backdrop-filter') && !l.includes('ticket-') && !l.startsWith('html.dark .atoast'))
  .join('\n')

// Map radius tokens from ticket-radius to at-radius in adapters
adapters = adapters.replace(/--at-radius-outer/g, '--at-radius-outer')

const out = base + adapters
fs.writeFileSync(path.join(root, '.vitepress/theme/agent-toasts/toasts.css'), out)
console.log('bytes', out.length)