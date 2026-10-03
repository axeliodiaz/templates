# Messaging

Messaging examples for PulseFit: a two-pane inbox and conversation with gold outgoing bubbles, light gray incoming bubbles and charcoal pills. Demo data is fictitious.

## Inbox and thread

<div class="pf"><div class="pf-msg"><div class="pf-list"><span class="pf-srch">Search messages</span><div class="pf-pills"><span class="pf-pill on">All</span><span class="pf-pill">Unread</span><span class="pf-pill">Members</span><span class="pf-pill">Coaches</span></div>
<div class="pf-mr on"><span class="pf-av ">MT</span><div class="pf-mb"><div class="pf-mt"><span>Maya Torres<span class="pf-dot"></span></span><time>9:41</time></div><div class="pf-mref">Unlimited plan</div><div class="pf-mp">Can I move tomorrow&#39;s 7 am to Thursday?</div></div></div><div class="pf-mr"><span class="pf-av d">LP</span><div class="pf-mb"><div class="pf-mt"><span>Leo Park</span><time>9:12</time></div><div class="pf-mref">8 classes</div><div class="pf-mp">Thanks, I received the receipt.</div></div></div><div class="pf-mr"><span class="pf-av m">CD</span><div class="pf-mb"><div class="pf-mt"><span>Coach Dana<span class="pf-dot"></span></span><time>Yesterday</time></div><div class="pf-mref">Team</div><div class="pf-mp">Playlist for Friday HIIT is ready.</div></div></div><div class="pf-mr"><span class="pf-av l">AR</span><div class="pf-mb"><div class="pf-mt"><span>Ana Ruiz</span><time>Mon</time></div><div class="pf-mref">Drop-in</div><div class="pf-mp">Is the studio open on the holiday?</div></div></div><div class="pf-mr"><span class="pf-av ">FR</span><div class="pf-mb"><div class="pf-mt"><span>Front desk</span><time>Mon</time></div><div class="pf-mref">Team</div><div class="pf-mp">Two mats need replacing in room B.</div></div></div></div>
<div class="pf-thr"><div class="pf-th"><div><b>Maya Torres</b><small>Unlimited plan &middot; member since 2025</small></div><span class="pf-badge">Booking #4821</span></div><div class="pf-msgs"><span class="pf-sys">Wednesday, Oct 7</span><div class="pf-b in">Hi! Can I move tomorrow&#39;s 7 am class to Thursday?<time>9:38</time></div><div class="pf-b out">Of course. Thursday has a 7 am Strength with Coach Dana, 4 spots left.<time>9:40</time></div><div class="pf-att"><i>PDF</i><div><b>Class schedule - October.pdf</b><br><small>184 KB</small></div></div><div class="pf-b in">Perfect, book me in please.<time>9:41</time></div><span class="pf-sys">Booking #4821 moved to Thu, Oct 8, 7:00 am</span><div class="pf-typing"><i></i><i></i><i></i></div></div><div class="pf-sug"><span>You&#39;re booked</span><span>See you Thursday</span><span>Need anything else?</span></div><div class="pf-comp"><span class="pf-in">Write a message</span><span class="pf-send">&uarr;</span></div></div></div></div>

## Attachments, read states and empty state

<div class="pf"><div class="pf-two"><div class="pf-card"><b class="h">Message states</b><div class="pf-msgs" style="padding-bottom:0"><div class="pf-b out">Sent<time>9:40</time></div><div class="pf-b out">Delivered <small style="color:#000;opacity:.7">&check;&check;</small><time>9:41</time></div><div class="pf-b out">Failed to send - <b>Retry</b><time>9:42</time></div></div></div><div class="pf-card" style="text-align:center;padding:30px"><div class="disp" style="font-size:34px;color:#C9A66B">No messages yet</div><small>Members will appear here when they write to the studio.</small><div style="margin-top:12px"><span class="pf-btn">New message</span></div></div></div></div>

## Anatomy

| Part | Spec |
|---|---|
| Inbox list | White card, 16px radius, pill search, charcoal active filter pill |
| Selected row | Light gold `#F5E6D3` with a 3px gold left rule |
| Unread dot | Gold 8px dot next to the name |
| Linked record | Ink gold text (`#7a5a1f`) under the name |
| Outgoing bubble | Gold `#C9A66B`, black text, 4px corner on the sender side |
| Incoming bubble | Page gray `#F5F5F5`, dark text |
| System event | Centered gray pill |
| Suggested replies | Outlined gold pills, ink gold text |
| Composer | Pill input, round gold send button |
| Typing | Three gray dots, static with reduced motion |
