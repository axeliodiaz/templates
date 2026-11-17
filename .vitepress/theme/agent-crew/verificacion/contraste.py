#!/usr/bin/env python3
# WCAG 2.2 contrast audit for Agent Crew template adapters (ACR-07).
# Core helpers match ACR-06/contraste.py (read-only reference); adapter tables are repo-owned.
from __future__ import annotations
import os
import sys

OUT = os.path.join(os.path.dirname(__file__), 'contrastes.md')
OUT_PUBLIC = os.path.join(os.path.dirname(__file__), '..', '..', '..', '..', 'agent-crew-contrastes.md')

def hx(h: str) -> tuple[int, int, int]:
    h = h.lstrip('#')
    return tuple(int(h[i : i + 2], 16) for i in (0, 2, 4))

def mix(a: str, b: str, p: float) -> str:
    A, B = hx(a), hx(b)
    return '#%02x%02x%02x' % tuple(round(A[i] * p / 100 + B[i] * (1 - p / 100)) for i in range(3))

def lum(c: str) -> float:
    r = []
    for v in hx(c):
        v /= 255
        r.append(v / 12.92 if v <= 0.04045 else ((v + 0.055) / 1.055) ** 2.4)
    return 0.2126 * r[0] + 0.7152 * r[1] + 0.0722 * r[2]

def cr(a: str, b: str) -> float:
    l1, l2 = sorted([lum(a), lum(b)], reverse=True)
    return (l1 + 0.05) / (l2 + 0.05)

def derived(base: dict) -> dict:
    T = dict(base)
    dark = T.get('_dark', False)
    T['canvas'] = T['bg'] if dark else mix(T['text'], T['bg'], 3)
    T['tray'] = mix(T['text'], T['card'], 4)
    T['track'] = mix(T['text'], T['card'], 12 if dark else 8)
    T['wire'] = T.get('wire') or mix(T['text'], T['bg'], 42 if dark else 58)
    T['bar_work'] = T.get('bar_work') or T['accent']
    T['bar_late'] = T.get('bar_late') or T['warn']
    T['bar_over'] = T.get('bar_over') or T['danger']
    T['bar_idle'] = T.get('bar_idle') or T['muted']
    T['wire_on'] = T['bar_work']
    T['pill_work_bg'] = T.get('pill_work_bg') or mix(T['accent'], T['card'], 12)
    T['pill_work_ink'] = T.get('pill_work_ink') or T['accent']
    T['pill_idle_bg'] = T.get('pill_idle_bg') or T['panel']
    T['pill_idle_ink'] = T.get('pill_idle_ink') or T['muted']
    T['pill_needs_bg'] = T.get('pill_needs_bg') or mix(T['warn'], T['card'], 14)
    T['pill_needs_ink'] = T.get('pill_needs_ink') or T['warn']
    T['pill_done_bg'] = T.get('pill_done_bg') or mix(T['accent'], T['card'], 10)
    T['pill_done_ink'] = T.get('pill_done_ink') or T['accent']
    T['pill_fail_bg'] = T.get('pill_fail_bg') or mix(T['danger'], T['card'], 14)
    T['pill_fail_ink'] = T.get('pill_fail_ink') or T['danger']
    return T

VP_LIGHT = dict(
    bg='#ffffff', card='#ffffff', panel='#f6f6f7', text='#213547', muted='#476582',
    accent='#3451b2', warn='#936022', danger='#a03808',
    bar_work='#3451b2', bar_late='#936022', bar_over='#a03808', bar_idle='#476582',
    pill_work_bg='#e8edfb', pill_work_ink='#243a7a',
    pill_idle_bg='#f0f3f8', pill_idle_ink='#3c5570',
    pill_needs_bg='#fff4e0', pill_needs_ink='#7a4e10',
    pill_done_bg='#e8edfb', pill_done_ink='#243a7a',
    pill_fail_bg='#ffe9e6', pill_fail_ink='#8f2800',
    _dark=False,
)
VP_DARK = dict(
    bg='#1b1b1f', card='#252529', panel='#2e2e33', text='#e8e8ed', muted='#b0b4c0',
    accent='#a8b1ff', warn='#f19d38', danger='#ff8f66',
    bar_work='#a8b1ff', bar_late='#f19d38', bar_over='#ff8f66', bar_idle='#8b919c',
    pill_work_bg='#2a2f52', pill_work_ink='#d4d9ff',
    pill_idle_bg='#2e2e33', pill_idle_ink='#c0c4ce',
    pill_needs_bg='#3d3015', pill_needs_ink='#f5c57a',
    pill_done_bg='#2a2f52', pill_done_ink='#d4d9ff',
    pill_fail_bg='#442218', pill_fail_ink='#ffb899',
    _dark=True,
)

ADAPTERS: list[tuple[str, str, list[tuple[str, dict]]]] = [
    ('Felix', 'felix', [
        ('light', dict(bg='#fefcf9', card='#ffffff', panel='#efebe7', text='#082422', muted='#636158',
                       accent='#065958', warn='#665500', danger='#a03808',
                       bar_work='#128585', bar_late='#665500', bar_over='#a03808', bar_idle='#4f6f6e',
                       pill_work_bg='#d4fffe', pill_work_ink='#065958',
                       pill_idle_bg='#f0f5f5', pill_idle_ink='#3f5958',
                       pill_needs_bg='#fffce0', pill_needs_ink='#665500',
                       pill_done_bg='#eefbf0', pill_done_ink='#1b7a29',
                       pill_fail_bg='#fff5ef', pill_fail_ink='#a03808', _dark=False)),
        ('dark', dict(bg='#082422', card='#234343', panel='#152b2a', text='#fefcf9', muted='#97cbc9',
                      accent='#2bf2f1', warn='#ffe066', danger='#ff9f66',
                      bar_work='#2bf2f1', bar_late='#ffe066', bar_over='#ff9f66', bar_idle='#90adab',
                      pill_work_bg='#16302e', pill_work_ink='#2bf2f1',
                      pill_idle_bg='#2d3d3c', pill_idle_ink='#cfcabf',
                      pill_needs_bg='#3a2e12', pill_needs_ink='#ffe066',
                      pill_done_bg='#1a3528', pill_done_ink='#8ee79a',
                      pill_fail_bg='#3a1a1a', pill_fail_ink='#ff9f66', _dark=True)),
    ]),
    ('Meadow', 'meadow', [
        ('light', dict(bg='#eef1f7', card='#ffffff', panel='#f5f7fb', text='#26364a', muted='#536279',
                       accent='#385cb7', warn='#665500', danger='#a03808', _dark=False,
                       pill_work_bg='#dde6fb', pill_work_ink='#1e3f9e',
                       pill_needs_bg='#fff4e0', pill_needs_ink='#665500')),
        ('local-dark', dict(bg='#192230', card='#222e3e', panel='#2a384c', text='#e5ebf5', muted='#a9b7cb',
                            accent='#9bb8ff', warn='#ffe066', danger='#ff9f66', _dark=True,
                            pill_work_bg='#2a3558', pill_work_ink='#dce6ff',
                            pill_needs_bg='#3d3015', pill_needs_ink='#f5d07a')),
    ]),
    ('Margin', 'margin', [('light', VP_LIGHT), ('dark', VP_DARK)]),
    ('Evertrue', 'evertrue', [('light', dict(bg='#f4f3ee', card='#ffffff', panel='#e9e8e2', text='#141412', muted='#65645d',
                                              accent='#33332b', warn='#665500', danger='#a03808', _dark=False,
                                              pill_work_bg='#e5e4df', pill_work_ink='#141412',
                                              pill_needs_bg='#fff4e0', pill_needs_ink='#665500'))]),
    ('Sentinel', 'sentinel', [
        ('light', dict(bg='#f5f5f7', card='#ffffff', panel='#eceef5', text='#22252b', muted='#545b68',
                       accent='#4162a3', warn='#665500', danger='#a03808', _dark=False,
                       pill_work_bg='#dce5f7', pill_work_ink='#264a8a',
                       pill_needs_bg='#fff4e0', pill_needs_ink='#665500')),
        ('local-dark', dict(bg='#161c24', card='#212731', panel='#2b3443', text='#f1f3f8', muted='#aab3c3',
                            accent='#9cbcff', warn='#ffe066', danger='#ff9f66', _dark=True,
                            pill_work_bg='#2a3a58', pill_work_ink='#dce7ff',
                            pill_needs_bg='#3d3015', pill_needs_ink='#f5d07a')),
    ]),
    ('Brief', 'brief', [
        ('light', dict(bg='#f5f5f7', card='#ffffff', panel='#eceef5', text='#22252b', muted='#545b68',
                       accent='#23724e', warn='#665500', danger='#a03808', _dark=False,
                       pill_work_bg='#d9f0e4', pill_work_ink='#155c39',
                       pill_needs_bg='#fff4e0', pill_needs_ink='#665500')),
        ('local-dark', dict(bg='#161c24', card='#212731', panel='#2b3443', text='#f1f3f8', muted='#aab3c3',
                            accent='#a7d9c5', warn='#ffe066', danger='#ff9f66', _dark=True,
                            pill_work_bg='#1f3d30', pill_work_ink='#c8f0de',
                            pill_needs_bg='#3d3015', pill_needs_ink='#f5d07a')),
    ]),
    ('Pace', 'pace', [('light', VP_LIGHT), ('dark', VP_DARK)]),
    ('Cargo', 'cargo', [('light', VP_LIGHT), ('dark', VP_DARK)]),
    ('Trial journey', 'trial', [('dark', dict(bg='#07070f', card='#171727', panel='#10101d', text='#f0efff', muted='#b8b5cd',
                                              accent='#a799ff', warn='#ffe066', danger='#ff9f66', _dark=True,
                                              pill_work_bg='#2a2548', pill_work_ink='#dbd6ff',
                                              pill_needs_bg='#3d3015', pill_needs_ink='#f5d07a'))]),
    ('Relay', 'relay', [('light', VP_LIGHT), ('dark', VP_DARK)]),
    ('Folio', 'folio', [('light', VP_LIGHT), ('dark', VP_DARK)]),
    ('Spark', 'spark', [('light', VP_LIGHT), ('dark', VP_DARK)]),
    ('Bastion', 'bastion', [('light', VP_LIGHT), ('dark', VP_DARK)]),
    ('Lustro', 'lustro', [('light', VP_LIGHT), ('dark', VP_DARK)]),
    ('PulseFit', 'pulsefit', [('light', VP_LIGHT), ('dark', VP_DARK)]),
    ('Scopecraft', 'scopecraft', [('light', VP_LIGHT), ('dark', VP_DARK)]),
    ('Lumen', 'lumen', [('light', VP_LIGHT), ('dark', VP_DARK)]),
    ('Pawprint', 'pawprint', [('light', VP_LIGHT), ('dark', VP_DARK)]),
    ('Umail', 'umail', [('light', VP_LIGHT), ('dark', VP_DARK)]),
    ('Fixtrack', 'fixtrack', [('light', VP_LIGHT), ('dark', VP_DARK)]),
    ('Crestway', 'crestway', [('light', VP_LIGHT), ('dark', VP_DARK)]),
]

ROWS = [
    ('texto', 'Nombre (text / card)', 'text', 'card', 4.5),
    ('texto', 'Subtítulo (muted / card)', 'muted', 'card', 4.5),
    ('texto', 'Conteo working (pill_work_ink / canvas)', 'pill_work_ink', 'canvas', 4.5),
    ('texto', 'Conteo needs you (warn / canvas)', 'warn', 'canvas', 4.5),
    ('texto', 'Pill Working', 'pill_work_ink', 'pill_work_bg', 4.5),
    ('texto', 'Pill Idle', 'pill_idle_ink', 'pill_idle_bg', 4.5),
    ('texto', 'Pill Needs you', 'pill_needs_ink', 'pill_needs_bg', 4.5),
    ('texto', 'Pill Done', 'pill_done_ink', 'pill_done_bg', 4.5),
    ('texto', 'Pill Failed', 'pill_fail_ink', 'pill_fail_bg', 4.5),
    ('texto', 'Bandeja (muted / tray)', 'muted', 'tray', 4.5),
    ('no-texto', 'Barra working / pista', 'bar_work', 'track', 3),
    ('no-texto', 'Barra late / pista', 'bar_late', 'track', 3),
    ('no-texto', 'Barra over / pista', 'bar_over', 'track', 3),
    ('no-texto', 'Conector activo / lienzo', 'wire_on', 'canvas', 3),
    ('no-texto', 'Conector reposo / lienzo', 'wire', 'canvas', 3),
    ('no-texto', 'Foco (text / canvas)', 'text', 'canvas', 3),
    ('no-texto', 'Foco (text / card)', 'text', 'card', 3),
]

def audit() -> int:
    out = [
        '# Agent Crew · contrast verification (21 adapters)\n',
        'Generated by `.vitepress/theme/agent-crew/verificacion/contraste.py`.',
        'Minimums: normal text 4.5:1 (WCAG 1.4.3), UI components and graphics 3:1 (1.4.11).\n',
        'Tokens mirror `crew.css` adapter blocks and Felix status pills where applicable.\n',
    ]
    fails = 0
    for name, _theme, variants in ADAPTERS:
        out.append(f'\n## {name}\n')
        for label, raw in variants:
            T = derived(raw)
            out.append(f'### {label}\n')
            out.append('| Tipo | Par | Colores | Ratio | Mín | |')
            out.append('|---|---|---|---|---|---|')
            for kind, lab, a, b, mn in ROWS:
                r = cr(T[a], T[b])
                ok = r >= mn
                if not ok:
                    fails += 1
                out.append(
                    f'| {kind} | {lab} | `{T[a]}` / `{T[b]}` | {r:.2f}:1 | {mn}:1 | {"OK" if ok else "**FALLA**"} |'
                )
    out.append(f'\n## Summary\n\nTotal pairs below minimum: **{fails}**.\n')
    text = '\n'.join(out) + '\n'
    with open(OUT, 'w', encoding='utf-8') as f:
        f.write(text)
    pub = '---\naside: false\n---\n\n' + text
    with open(OUT_PUBLIC, 'w', encoding='utf-8') as f:
        f.write(pub)
    print(text)
    return fails

if __name__ == '__main__':
    sys.exit(1 if audit() else 0)