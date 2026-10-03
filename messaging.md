# Messaging (Lustro)

Messaging examples in the Lustro language: a two-pane inbox and conversation screen. Layout follows the reference Message/Chat screen design by Nizam (https://x.com/nizamdesign/status/2106052336724672692), restyled with glass surfaces and the indigo-to-pink gradient. Demo data is fictitious.

## Inbox and thread

<div class="lm"><div class="lm-list"><span class="lm-search">search messages</span><div class="lm-pills"><span class="lm-pill on">all</span><span class="lm-pill">unread</span><span class="lm-pill">quotes</span><span class="lm-pill">jobs</span></div><div class="lm-row on"><span class="lm-av ">SM</span><div class="lm-body"><div class="lm-top"><span>sarah miller<span class="lm-dot"></span></span><time>7:02</time></div><div class="lm-ref">ac replacement · $4,731</div><div class="lm-prev">does the price include hauling away the old…</div></div></div><div class="lm-row"><span class="lm-av c">JC</span><div class="lm-body"><div class="lm-top"><span>james carter<span class="lm-dot"></span></span><time>8:41</time></div><div class="lm-ref">roof replacement · $8,900</div><div class="lm-prev">can you start the week of the 29th instead?</div></div></div><div class="lm-row"><span class="lm-av a">LP</span><div class="lm-body"><div class="lm-top"><span>linda park</span><time>yest</time></div><div class="lm-ref">panel upgrade · $3,150</div><div class="lm-prev">you: sent the updated options - take a look</div></div></div><div class="lm-row"><span class="lm-av c">DR</span><div class="lm-body"><div class="lm-top"><span>dana ruiz</span><time>yest</time></div><div class="lm-ref">furnace tune-up · $690</div><div class="lm-prev">thanks! see you thursday</div></div></div></div><div class="lm-thread"><div class="lm-head"><div><b>sarah miller</b><small>1420 elm street · (512) 555-0142</small></div><span class="lm-chip">ac replacement · $4,731 ↗</span></div><div class="lm-msgs"><span class="lm-sys">you sent the quote - ac replacement · $4,731</span><div class="lm-bub out">hi sarah - here is the quote for the ac replacement we walked through. the balanced option is what i would put in my own house.</div><span class="lm-meta r">sep 13 · 8:42 am</span><div class="lm-bub in">thanks mike! give me a couple of days to talk it over with rob.</div><span class="lm-meta">sep 13 · 9:15 am</span><span class="lm-sys">follow-up #1 sent automatically - "still thinking it over?"</span><div class="lm-bub in">does the price include hauling away the old unit?</div><span class="lm-meta">today · 7:02 am · not answered yet</span></div><div class="lm-sugg"><span>yes - haul-away and the permit are both included</span><span>let me send you the line items</span><span>call me and i will walk you through it</span></div><div class="lm-comp">write a reply…<i>↗</i></div><div class="lm-foot">sarah replies by text - this thread also lands on her quote page.</div></div></div>

## Anatomy

| Part | Spec |
|---|---|
| Inbox list | Glass card, search pill, filter pills (`all` is the active gradient pill), rows with avatar, name, time, linked-record line, one-line preview, unread dot |
| Selected row | Glass raised (`rgba(148,140,255,.12)`) with a 3px indigo-soft left rule |
| Thread header | Contact name, secondary detail, a chip linking to the related record |
| Outgoing bubble | Gradient `#6366f1` to `#ec4899`, white text, square bottom-right corner |
| Incoming bubble | Glass `rgba(148,140,255,.16)`, square bottom-left corner |
| System event | Centered glass pill, 11.5px, for things like "quote sent" or "automatic follow-up sent" |
| Suggested replies | Outlined indigo-soft pills above the composer |
| Composer | Pill input with a gradient send button and soft glow |

## Rules

1. One gradient per view: outgoing bubbles and the send button share it, so the active filter pill may stay flat in busy threads.
2. Timestamps and metadata use JetBrains Mono at 10.5px.
3. Unread state is a glowing indigo dot, never a semantic color.
4. Show delivery state (`not answered yet`, `read`, `failed`) as meta text under the bubble.
