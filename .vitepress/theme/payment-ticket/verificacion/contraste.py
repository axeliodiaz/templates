#!/usr/bin/env python3
from __future__ import annotations
import os
import sys

OUT = os.path.join(os.path.dirname(__file__), 'contrastes.md')
OUT_PUBLIC = os.path.join(os.path.dirname(__file__), '..', '..', '..', '..', 'payment-ticket-contrastes.md')

def hx(h: str) -> tuple[int, int, int]:
    h = h.lstrip('#')
    if len(h) == 3:
        h = ''.join(c * 2 for c in h)
    return tuple(int(h[i : i + 2], 16) for i in (0, 2, 4))

def lum(c: str) -> float:
    r = []
    for v in hx(c):
        v /= 255
        r.append(v / 12.92 if v <= 0.04045 else ((v + 0.055) / 1.055) ** 2.4)
    return 0.2126 * r[0] + 0.7152 * r[1] + 0.0722 * r[2]

def cr(a: str, b: str) -> float:
    l1, l2 = sorted([lum(a), lum(b)], reverse=True)
    return (l1 + 0.05) / (l2 + 0.05)

def T(stage, paper, field, ink, muted, line, accent, success, danger, _dark=False):
    return dict(stage=stage, paper=paper, field=field, ink=ink, muted=muted, line=line, accent=accent, success=success, danger=danger, on_success='#fff' if not _dark else paper, _dark=_dark)

ROWS = [
    ('texto', 'Title (ink / paper)', 'ink', 'paper', 4.5),
    ('texto', 'Message (muted / paper)', 'muted', 'paper', 4.5),
    ('texto', 'Label (muted / stage)', 'muted', 'stage', 4.5),
    ('texto', 'Failed title (danger / paper)', 'danger', 'paper', 4.5),
    ('texto', 'Chip (on_success / success)', 'on_success', 'success', 4.5),
    ('no-texto', 'Focus (accent / paper)', 'accent', 'paper', 3),
    ('no-texto', 'Focus (accent / stage)', 'accent', 'stage', 3),
    ('no-texto', 'Barcode (ink / paper)', 'ink', 'paper', 3),
    ('no-texto', 'Badge (success / paper)', 'success', 'paper', 3),
    ('info', 'Border (line / stage, decorative)', 'line', 'stage', 3),
    ('info', 'Perforation dashed (decorative)', 'line', 'paper', 3),
]

ADAPTERS = [
    ('Assay', [('light', T('#fcf9f4','#fefdf9','#f4f3ef','#000000','#44403c','#e8e2da','#c2410c','#166534','#9a3412'))]),
    ('Felix', [
        ('light', T('#efebe7','#ffffff','#f5f6f6','#082422','#234343','#cfcabf','#065958','#1b7a29','#a03808')),
        ('dark', T('#082422','#234343','#304e4e','#fefcf9','#c3e2e1','#35605f','#2bf2f1','#8ee79a','#ff9f66', True)),
    ]),
    ('Meadow', [
        ('light', T('#eef1f7','#ffffff','#f6f7f8','#26364a','#536279','#c6cfdd','#385cb7','#18794e','#b8272c')),
        ('local-dark', T('#192230','#222e3e','#2e3949','#e5ebf5','#a9b7cb','#4d5f78','#9bb8ff','#3dd68c','#f66f81', True)),
    ]),
    ('Margin', [
        ('light', T('#eceef5','#f5f5f7','#ecedef','#1f2230','#444a5e','#dde1ec','#3f63cf','#18794e','#b8272c')),
        ('dark', T('#14161f','#1b1e2a','#282a36','#eceef5','#c6cbdb','#2d3245','#9bb3f3','#3dd68c','#f66f81', True)),
    ]),
    ('Evertrue', [('light', T('#f4f3ee','#ffffff','#f6f6f6','#141412','#65645d','#cbc9bf','#33332b','#18794e','#b8272c'))]),
    ('Sentinel', [
        ('light', T('#f5f5f7','#ffffff','#f6f7f8','#22252b','#545b68','#c6cbd7','#4162a3','#18794e','#b8272c')),
        ('local-dark', T('#161c24','#212731','#2d333d','#f1f3f8','#aab3c3','#4d5970','#9cbcff','#3dd68c','#f66f81', True)),
    ]),
    ('Brief', [
        ('light', T('#f5f5f7','#ffffff','#f6f7f8','#22252b','#545b68','#c6cbd7','#23724e','#23724e','#b8272c')),
        ('local-dark', T('#161c24','#212731','#2d333d','#f1f3f8','#aab3c3','#4d5970','#a7d9c5','#a7d9c5','#f66f81', True)),
    ]),
    ('Pace', [
        ('light', T('#edf8ef','#f5f8f4','#ecf0ec','#1f2d25','#405c4b','#d9e4dc','#23724e','#23724e','#b8272c')),
        ('dark', T('#111a15','#18241d','#243029','#e6f1ea','#c0d2c6','#2b3d32','#83d4a1','#83d4a1','#f66f81', True)),
    ]),
    ('Cargo', [
        ('light', T('#eff6ff','#f5f8fb','#ecf0f4','#1d3043','#3c5670','#d9e3ed','#2866a8','#18794e','#b8272c')),
        ('dark', T('#101922','#16212c','#222d38','#e6eef6','#bfd0e0','#2a3b4c','#6bb7ff','#3dd68c','#f66f81', True)),
    ]),
    ('Trial journey', [('dark', T('#07070f','#171727','#242434','#f0efff','#b8b5cd','#44445e','#a799ff','#3dd68c','#f66f81', True))]),
    ('Relay', [
        ('light', T('#e7e9f4','#f3f4fb','#eaebf3','#16182a','#3c415c','#d5d8ea','#4c3ad4','#18794e','#b8272c')),
        ('dark', T('#070910','#10121c','#1e2029','#f4f6fb','#d5dced','#2c3148','#c4b5fd','#3dd68c','#f66f81', True)),
    ]),
    ('Folio', [
        ('light', T('#eef2ef','#f6f8f6','#edf0ee','#1f2623','#46514c','#d8dfdb','#2f7a63','#2f7a63','#b8272c')),
        ('dark', T('#232423','#2a2c2a','#363836','#edf0eb','#c8cfc8','#414641','#a7d9c5','#a7d9c5','#f66f81', True)),
    ]),
    ('Spark', [
        ('light', T('#f4efe9','#fbf8f4','#f2f0ec','#252525','#4a4843','#e1d9ce','#c2570a','#18794e','#b8272c')),
        ('dark', T('#252525','#2c2c2c','#383837','#f0efeb','#cfcfca','#444444','#ff953f','#3dd68c','#f66f81', True)),
    ]),
    ('Bastion', [
        ('light', T('#e7f0e6','#f4f7f1','#ebeee8','#102216','#24382c','#c5d7c8','#0e6a34','#0e6a34','#b8272c')),
        ('dark', T('#061108','#0a1810','#15251b','#c8f7c2','#b7e4b0','#1c5a32','#62f56a','#62f56a','#ffb000', True)),
    ]),
    ('Lustro', [
        ('light', T('#f2f2fb','#ffffff','#f6f6f7','#17172b','#4a4a68','#e0e0fc','#4f46e5','#18794e','#b8272c')),
        ('dark', T('#07070f','#0f0f1f','#1d1c2b','#dfdfd6','#98989f','#1e1c35','#818cf8','#3dd68c','#f66f81', True)),
    ]),
    ('PulseFit', [
        ('light', T('#f5f5f5','#ffffff','#f6f6f6','#212121','#5f666d','#e0e0e0','#8b6a2c','#18794e','#b8272c')),
        ('dark', T('#17171a','#26282d','#323439','#f4f4f5','#c8c9ce','#2e3036','#d9bc86','#3dd68c','#f66f81', True)),
    ]),
    ('Scopecraft', [
        ('light', T('#f4f4f5','#ffffff','#f5f5f6','#111113','#4a4d54','#e6e6e8','#1e4eaa','#18794e','#b8272c')),
        ('dark', T('#17171a','#26282d','#323439','#f4f4f5','#c8c9ce','#2e3036','#7fa8f0','#3dd68c','#f66f81', True)),
    ]),
    ('Lumen', [
        ('light', T('#f3f3f1','#ffffff','#f6f6f6','#17171a','#45464c','#e7e7e9','#6b5be0','#18794e','#b8272c')),
        ('dark', T('#17171a','#26282d','#323439','#f4f4f5','#c8c9ce','#2e3036','#a99cf6','#3dd68c','#f66f81', True)),
    ]),
    ('Pawprint', [
        ('light', T('#f4ecdf','#ffffff','#f6f6f7','#2a2a35','#5e6270','#e6dccb','#245a9a','#18794e','#b8272c')),
        ('dark', T('#141c26','#223044','#2f3b4e','#f3efe8','#c3cbd6','#33445a','#8db8f0','#3dd68c','#f66f81', True)),
    ]),
    ('Umail', [
        ('light', T('#f9f9f9','#ffffff','#f7f7f7','#333333','#4d4d4d','#e5e5e5','#2274ba','#18794e','#b8272c')),
        ('dark', T('#15191d','#1d2329','#292f34','#e5e5e5','#c4cbd1','#2d353d','#5aaee6','#3dd68c','#f66f81', True)),
    ]),
    ('Fixtrack', [
        ('light', T('#f3f6f2','#ffffff','#f6f6f6','#1f2a25','#43524a','#dde5df','#2a5546','#18794e','#b8272c')),
        ('dark', T('#131a17','#1a2420','#26302c','#e8ece7','#c3cdc6','#2e3b35','#8fc4ae','#3dd68c','#f66f81', True)),
    ]),
    ('Crestway', [
        ('light', T('#e9e9ea','#f1f1f1','#e9e9e9','#28292c','#4a4c50','#dedede','#2a6fc4','#18794e','#b8272c')),
        ('dark', T('#1c1d20','#242529','#303135','#f1f1f1','#cfd1d4','#38393d','#7fb2ee','#3dd68c','#f66f81', True)),
    ]),
]

def audit() -> int:
    out = ['# Payment ticket · contrast verification (22 adapters)\n', 'Generated by `.vitepress/theme/payment-ticket/verificacion/contraste.py`.\n']
    fails = 0
    for name, variants in ADAPTERS:
        out.append(f'\n## {name}\n')
        for label, tok in variants:
            out.append(f'### {label}\n')
            out.append('| Kind | Pair | Colors | Ratio | Min | |')
            out.append('|---|---|---|---|---|---|')
            for kind, lab, a, b, mn in ROWS:
                if kind == 'info':
                    continue
                r = cr(tok[a], tok[b])
                ok = r >= mn
                if not ok:
                    fails += 1
                out.append(f'| {kind} | {lab} | `{tok[a]}` / `{tok[b]}` | {r:.2f}:1 | {mn}:1 | {"OK" if ok else "**FAIL**"} |')
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