# Messaging

Messaging examples for Felix: a two-pane inbox and conversation screen with the structure of the reference Message/Chat design by Nizam (https://x.com/nizamdesign/status/2106052336724672692), built from Felix tokens. Follows the light/dark toggle. Demo data is fictitious.

## Inbox and thread

<div class="fm"><div class="fm-list"><span class="fm-search">search messages</span><div class="fm-pills"><span class="fm-pill on">all</span><span class="fm-pill">unread</span><span class="fm-pill">quotes</span><span class="fm-pill">jobs</span></div><div class="fm-row on"><span class="fm-av ">SM</span><div class="fm-body"><div class="fm-top"><span>sarah miller<span class="fm-dot"></span></span><time>7:02</time></div><div class="fm-ref">ac replacement · $4,731</div><div class="fm-prev">does the price include hauling away the old…</div></div></div><div class="fm-row"><span class="fm-av c">JC</span><div class="fm-body"><div class="fm-top"><span>james carter<span class="fm-dot"></span></span><time>8:41</time></div><div class="fm-ref">roof replacement · $8,900</div><div class="fm-prev">can you start the week of the 29th instead?</div></div></div><div class="fm-row"><span class="fm-av a">LP</span><div class="fm-body"><div class="fm-top"><span>linda park</span><time>yest</time></div><div class="fm-ref">panel upgrade · $3,150</div><div class="fm-prev">you: sent the updated options - take a look</div></div></div><div class="fm-row"><span class="fm-av c">DR</span><div class="fm-body"><div class="fm-top"><span>dana ruiz</span><time>yest</time></div><div class="fm-ref">furnace tune-up · $690</div><div class="fm-prev">thanks! see you thursday</div></div></div></div><div class="fm-thread"><div class="fm-head"><div><b>sarah miller</b><small>1420 elm street · (512) 555-0142</small></div><span class="fm-chip">ac replacement · $4,731 ↗</span></div><div class="fm-msgs"><span class="fm-sys">you sent the quote - ac replacement · $4,731</span><div class="fm-bub out">hi sarah - here is the quote for the ac replacement we walked through. the balanced option is what i would put in my own house.</div><span class="fm-meta r">sep 13 · 8:42 am</span><div class="fm-bub in">thanks mike! give me a couple of days to talk it over with rob.</div><span class="fm-meta">sep 13 · 9:15 am</span><span class="fm-sys">follow-up #1 sent automatically - "still thinking it over?"</span><div class="fm-bub in">does the price include hauling away the old unit?</div><span class="fm-meta">today · 7:02 am · not answered yet</span></div><div class="fm-sugg"><span>yes - haul-away and the permit are both included</span><span>let me send you the line items</span><span>call me and i will walk you through it</span></div><div class="fm-comp">write a reply…<i>↗</i></div><div class="fm-foot">sarah replies by text - this thread also lands on her quote page.</div></div></div>

## Anatomy

| Part | Spec |
|---|---|
| Inbox list | White card, search pill, filter pills (active pill is turquoise `#2bf2f1`), rows with avatar, name, time, linked-record line, preview, unread dot |
| Selected row | Light turquoise `#d4fffe` with a turquoise left rule (dark mode `#234343`) |
| Thread header | Contact name, detail line, chip linking to the related record |
| Outgoing bubble | Turquoise `#2bf2f1`, ink text `#082422` |
| Incoming bubble | Linen `#efebe7` (dark mode `#234343`) |
| System event | Centered linen pill for automatic events |
| Suggested replies | Outlined pills above the composer |
| Composer | Pill input with a turquoise round send button |

Unread dots use orange `#f26629`. For the single-thread component see the [MessageScroller organism](/felix/components/organisms#messagescroller).
