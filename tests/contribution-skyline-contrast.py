# Contraste WCAG (1.4.11, ≥ 3:1) del Skyline por app y tema. Valores de tokens verificados en evidencia/lookups.md,
# Templates board measured from live computed styles: #f6f6f7 / #202127.
# Caras: front = color-mix(top 80%, #000) · left = color-mix(top 64%, #000) (spec §6). Exit code 1 si algún criterio normativo falla.
import sys
def hx(h): h = h.lstrip('#'); return tuple(int(h[i:i+2], 16) for i in (0, 2, 4))
def mix(a, b, p): return tuple(round(a[i]*p + b[i]*(1-p)) for i in range(3))
def lum(c):
    f = lambda v: (v/255)/12.92 if v/255 <= 0.03928 else ((v/255 + 0.055)/1.055)**2.4
    r, g, b = map(f, c); return .2126*r + .7152*g + .0722*b
def cr(a, b): x, y = sorted([lum(a), lum(b)], reverse=True); return (x + .05)/(y + .05)
H = lambda c: '#%02x%02x%02x' % c
K = hx('#000000')
bl = mix(hx('#F5F6F8'), hx('#12343a'), .82); bd = mix(hx('#0F1115'), hx('#12343a'), .82)   # board agents (fondo actual del board)
AG = ['#1b6e78', '#1f9aa6', '#3dced8', '#9cf4f6']
sd, sl = hx('#1a2332'), hx('#ffffff')
THEMES = {
 # nombre: (board, tapas 0..4, borde (token → hex), foco interior, halo exterior)
 'agents-ai claro':  (bl, [mix(hx('#6B7280'), bl, .24)] + [hx(x) for x in AG], ('var(--text-1)', '#111827'), ('var(--text-1)', '#111827'), ('var(--surface)', '#FFFFFF')),
 'agents-ai oscuro': (bd, [mix(hx('#8B93A1'), bd, .24)] + [hx(x) for x in AG], ('var(--text-1)', '#F3F4F6'), ('var(--text-1)', '#F3F4F6'), ('var(--bg)', '#0F1115')),
 'axeldiaz-web oscuro': (sd, [mix(hx('#5c6d7e'), sd, .22), mix(hx('#2aa8a0'), sd, .35), mix(hx('#0f766e'), sd, .55), mix(hx('#0f766e'), sd, .78), hx('#0f766e')],
                         ('var(--ax-text)', '#f0f2f5'), ('var(--ax-text)', '#f0f2f5'), ('var(--ax-bg)', '#10141c')),
 'axeldiaz-web claro':  (sl, [mix(hx('#152736'), sl, .08), mix(hx('#2aa8a0'), sl, .40), mix(hx('#0f766e'), sl, .55), mix(hx('#0f766e'), sl, .72), hx('#0d655e')],
                         ('var(--ax-structural)', '#152736'), ('var(--ax-structural)', '#152736'), ('var(--ax-surface)', '#ffffff')),
 'templates light (measured #f6f6f7)': (hx('#f6f6f7'), [hx(x) for x in '#E5E7EB #BFDBFE #60A5FA #2563EB #1E3A8A'.split()], ('--sky-edge', '#111827'), ('--sky-focus', '#111827'), ('--sky-halo', '#FFFFFF')),
 'templates dark (measured #202127)': (hx('#202127'), [hx(x) for x in '#2A303C #1E3A5F #1D4ED8 #3B82F6 #93C5FD'.split()], ('--sky-edge', '#E5E7EB'), ('--sky-focus', '#E5E7EB'), ('--sky-halo', '#161618')),
}
ACCENTS = {'agents-ai claro': [('--accent-ink', '#2459C9')], 'agents-ai oscuro': [('--accent-ink', '#93C5FD')],
           'axeldiaz-web oscuro': [('--ax-info', '#2aa8a0')], 'axeldiaz-web claro': [('--ax-info', '#2aa8a0'), ('--ax-primary', '#0f766e')]}
fails = 0
def line(st, v, txt):
    global fails
    if st == 'FAIL': fails += 1
    print(f'{st:4}  {v:6.2f}:1  {txt}')
for name, (board, tops, (et, e), (ft, f), (ht, h)) in THEMES.items():
    E, F, Hh = hx(e), hx(f), hx(h)
    faces = [(f'tapa{i}', t) for i, t in enumerate(tops)] + [(f'frontal{i}', mix(t, K, .8)) for i, t in enumerate(tops)] + [(f'izq{i}', mix(t, K, .64)) for i, t in enumerate(tops)]
    print(f'\n== {name} · board {H(board)} · borde {et}={e} (1 px opaco) · foco = anillo tinta {ft}={f} 2 px + halo {ht}={h} 2 px por fuera')
    weak = [(k, v) for k, v in faces if cr(v, board) < 3]
    print('info  caras < 3:1 contra el board (necesitan borde): ' + (', '.join(f'{k}={cr(v, board):.2f}' for k, v in weak) or 'ninguna'))
    line('PASS' if cr(E, board) >= 3 else 'FAIL', cr(E, board), f'borde vs board')
    worst = min(weak, key=lambda kv: cr(E, kv[1])) if weak else None
    if worst: line('PASS' if cr(E, worst[1]) >= 3 else 'FAIL', cr(E, worst[1]), f'borde vs peor cara débil ({worst[0]} {H(worst[1])})')
    line('PASS' if cr(F, Hh) >= 3 else 'FAIL', cr(F, Hh), 'foco interior vs halo')
    adj = [('board', board), ('borde', E)] + faces
    bad = [(k, max(cr(F, v), cr(Hh, v))) for k, v in adj if max(cr(F, v), cr(Hh, v)) < 3]
    mn = min(adj, key=lambda kv: max(cr(F, kv[1]), cr(Hh, kv[1])))
    line('PASS' if not bad else 'FAIL', max(cr(F, mn[1]), cr(Hh, mn[1])), f'foco doble (max(interior,halo)) vs cada color adyacente: board, borde, 5 tapas, 5 frontales, 5 izquierdas · peor={mn[0]}')
    if bad: print('      no cumplen: ' + ', '.join(f'{k}={v:.2f}' for k, v in bad))
    # Informativo: acento de marca solo (sin halo) — motivo del anillo doble
    for an, ac in ACCENTS.get(name, []):
        A = hx(ac); w = min(adj, key=lambda kv: cr(A, kv[1]))
        print(f'info  {cr(A, w[1]):6.2f}:1  (acento {an}={ac} solo, peor vs {w[0]}: insuficiente como único indicador)')
print('\nNota: --sky-edge al 28 % de alfa sobre 0,5 px (versión anterior de la spec) queda DESCARTADA: no garantiza 3:1.')
print('ALL PASS' if not fails else f'{fails} FAIL')
sys.exit(1 if fails else 0)
