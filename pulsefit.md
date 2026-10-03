# PulseFit

PulseFit is the design language of the PulseFit Studio and Admin Studio apps: warm gold on a clean light surface, charcoal navigation, Montserrat headings, Rubik body text and Bebas Neue for big numbers and titles. This section rebuilds the reference sketch (https://pulsefit-sketch.vercel.app) with refined styles, then adds the same examples the other languages have: [Messaging](/pulsefit/messaging), [Calendar](/pulsefit/calendar) and [Projects](/pulsefit/projects). Demo data is fictitious.

## What changed from the sketch

| Area | Sketch | Refined |
|---|---|---|
| Gold as text | `#C9A66B` on white (about 2.3:1) | New ink gold `#7a5a1f` for text, links and outlined buttons (7:1). Fill gold is unchanged |
| Card hover | Lifts 8px | Lifts 2px with a deeper shadow, off with reduced motion |
| Shadows | One flat shadow | Two levels: `sh1` resting, `sh2` raised (menus, dragged cards, dialogs) |
| Focus | Bootstrap blue-ish default in places | One gold ring, 3px, 35% opacity, on every control |
| Status colors | Raw Bootstrap greens, reds | Tinted soft badges with dark text, each above 4.5:1 |
| Numbers | Proportional digits | Tabular digits in tables, calendars and stats |
| Neutral text | `#6c757d` muted | `#5f666d` muted, passes AA on the gray page background |
| Disabled | Gray text only | Gray fill and text, never gold |

## Colors

<div class="pf"><div class="pf-grid"><div class="pf-sw"><i style="background:#C9A66B"></i><div><b>Gold</b><code>#C9A66B</code></div></div><div class="pf-sw"><i style="background:#b8955c"></i><div><b>Gold hover</b><code>#b8955c</code></div></div><div class="pf-sw"><i style="background:#7a5a1f"></i><div><b>Gold ink (text)</b><code>#7a5a1f</code></div></div><div class="pf-sw"><i style="background:#F5E6D3"></i><div><b>Gold light</b><code>#F5E6D3</code></div></div><div class="pf-sw"><i style="background:#333333"></i><div><b>Dark</b><code>#333333</code></div></div><div class="pf-sw"><i style="background:#212529"></i><div><b>Navbar</b><code>#212529</code></div></div><div class="pf-sw"><i style="background:#F5F5F5"></i><div><b>Page</b><code>#F5F5F5</code></div></div><div class="pf-sw"><i style="background:#ffffff"></i><div><b>Surface</b><code>#ffffff</code></div></div><div class="pf-sw"><i style="background:#e0e0e0"></i><div><b>Border</b><code>#e0e0e0</code></div></div><div class="pf-sw"><i style="background:#6c757d"></i><div><b>Muted (sketch)</b><code>#6c757d</code></div></div><div class="pf-sw"><i style="background:#5f666d"></i><div><b>Muted (refined)</b><code>#5f666d</code></div></div><div class="pf-sw"><i style="background:#198754"></i><div><b>Success</b><code>#198754</code></div></div><div class="pf-sw"><i style="background:#b77900"></i><div><b>Warning (refined)</b><code>#b77900</code></div></div><div class="pf-sw"><i style="background:#dc3545"></i><div><b>Danger</b><code>#dc3545</code></div></div><div class="pf-sw"><i style="background:#0a7e96"></i><div><b>Info (refined)</b><code>#0a7e96</code></div></div></div></div>

Chart series: gold `#C9A66B`, charcoal `#333`, bronze `#8b7355`, sand `#d4c4a8`, graphite `#4a4a4a`. Calendar categories reuse the same five.

## Typography

<div class="pf"><div class="pf-card"><div class="disp" style="font-size:56px;line-height:1">Stronger every day</div><small>Display - Bebas Neue 56 / 1.0, letter-spacing .04em. Titles and big numbers only.</small><hr style="border:0;border-top:1px solid #e9ecef;margin:12px 0"><div class="h" style="font-size:26px">Weekly class schedule</div><small>Heading - Montserrat 700 26 / 1.2</small><div class="h" style="font-size:18px;margin-top:10px">Pricing and memberships</div><small>Heading - Montserrat 700 18 / 1.3</small><p style="margin-top:12px">Body copy is Rubik 400 at 14 to 16 pixels. It stays warm and readable on the light gray page, with a 1.45 line height and tabular digits for times and prices.</p><small>Body - Rubik 400 14 / 1.45</small></div></div>

## Buttons, badges and inputs

<div class="pf"><div class="pf-row"><span class="pf-btn">Book class</span><span class="pf-btn out">Details</span><span class="pf-btn dark">Add member</span><span class="pf-btn ghost">Cancel</span><span class="pf-btn focus">Focused</span><span class="pf-btn dis">Disabled</span><span class="pf-btn pill sm">Small pill</span></div><div class="pf-row" style="margin-top:12px"><span class="pf-badge">Gold</span><span class="pf-badge ok">Active</span><span class="pf-badge warn">Expiring</span><span class="pf-badge bad">Overdue</span><span class="pf-badge info">New</span><span class="pf-badge dk">Staff</span></div><div class="pf-grid" style="margin-top:14px"><div><span class="pf-lab">Full name</span><span class="pf-in">Maya Torres</span></div><div><span class="pf-lab">Email (focused)</span><span class="pf-in on">maya@example.com</span></div><div><span class="pf-lab">Phone (error)</span><span class="pf-in bad">+1 555</span><small style="color:#a52432">Enter a full phone number</small></div></div></div>

## Navbar, cards and table

<div class="pf"><div class="pf-nav"><span class="logo">PULSEFIT</span><span class="on">Classes</span><span>Schedule</span><span>Pricing</span><span>Coaches</span><span style="margin-left:auto"><span class="pf-av sm">MT</span></span></div><div class="pf-grid" style="margin-top:14px"><div class="pf-card lift"><span class="pf-badge">Featured</span><div class="disp" style="font-size:40px;margin-top:6px">Unlimited</div><small>Per month</small><div class="h" style="font-size:24px;margin:6px 0">$89</div><span class="pf-btn">Choose plan</span></div><div class="pf-card lift"><span class="pf-badge dk">Starter</span><div class="disp" style="font-size:40px;margin-top:6px">8 classes</div><small>Per month</small><div class="h" style="font-size:24px;margin:6px 0">$59</div><span class="pf-btn out">Choose plan</span></div></div><table class="pf-tbl" style="margin-top:14px"><tr><th>Member</th><th>Plan</th><th>Status</th><th>Renews</th></tr><tr><td>Maya Torres</td><td>Unlimited</td><td><span class="pf-badge ok">Active</span></td><td>Oct 21</td></tr><tr><td>Leo Park</td><td>8 classes</td><td><span class="pf-badge warn">Expiring</span></td><td>Oct 9</td></tr><tr><td>Ana Ruiz</td><td>Drop-in</td><td><span class="pf-badge bad">Overdue</span></td><td>Sep 28</td></tr></table></div>

## Rules

1. Gold fills carry black text. Gold as text on white uses the ink gold.
2. Bebas Neue is for titles and numbers, never for paragraphs.
3. One primary gold button per view. Secondary actions are outlined or dark.
4. Radius scale: 8px controls, 12px inner cards, 16px cards and panels, full pill for chips.
5. Raise only what moves or floats. Resting cards use the light shadow.
6. Status is a soft tint with dark text, not a saturated fill.
7. Digits are tabular wherever numbers line up.
