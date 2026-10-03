<script setup>
import ProjectWorkspace from '../.vitepress/theme/ProjectWorkspace.vue'
</script>

# Project workspaces (PulseFit)

A project-management dashboard inspired by [Marcel Kargul's board design](https://x.com/marcelkargul/status/2105810012266512566): compact navigation, project properties, view tabs and a four-column Kanban board. Reinterpreted in PulseFit: charcoal rail, gold selected state, Bebas Neue titles, white cards on the light gray page. Same interactive component as the Lustro and Felix versions, themed with PulseFit tokens. All projects, people and activity are fictitious.

## Product launch

A cross-functional release: design, engineering and marketing share one board. Try search, priority filters, Overview and List. Open a task to change its status, or create a task at the bottom. These are local UI demonstrations, not connected project data.

<div class="pf-pwx"><ProjectWorkspace scenario="launch" /></div>

## Studio operations

The same pattern inside a service business, which is the natural PulseFit case: client work next to internal operations, with milestone and workload summaries.

<div class="pf-pwx"><ProjectWorkspace scenario="studio" /></div>

## Static reference

The PulseFit board with its own parts, for copying markup rather than behavior.

<div class="pf"><div class="pf-app"><div class="pf-rail"><b>PF</b><i class="on">&#9638;</i><i>&#9776;</i><i>&#9679;</i><i>&#9881;</i></div><div class="pf-side"><h4>Projects</h4><div class="on"><span>Fall challenge</span><em>12</em></div><div><span>Studio refresh</span><em>8</em></div><div><span>Membership app</span><em>21</em></div><div><span>Holiday schedule</span><em>5</em></div><h4 style="margin-top:16px">Views</h4><div><span>My tasks</span><em>4</em></div><div><span>Overdue</span><em>2</em></div></div><div class="pf-main"><div class="pf-ph"><div><div class="t">Fall challenge</div><div class="pf-row" style="margin-top:6px"><span class="pf-badge ok">On track</span><small>Due Nov 15, 2026</small><span class="pf-row" style="gap:0"><span class="pf-av sm">DR</span><span class="pf-av sm d">ML</span><span class="pf-av sm m">AR</span></span></div></div><span class="pf-btn">New task</span></div><div class="pf-tabs"><span class="on">Board</span><span>List</span><span>Overview</span><span>Timeline</span></div><div class="pf-fl"><span class="on">All</span><span>High priority</span><span>Due this week</span><span>Assigned to me</span></div><div class="pf-kb">
<div class="pf-col"><h4>To do<span>3</span></h4><div class="pf-tk hi "><b>Design the challenge poster</b><span class="pf-badge info">Design</span><div class="m"><span>Oct 9</span><span class="pf-av sm">AR</span></div></div><div class="pf-tk md "><b>Write member email</b><span class="pf-badge ">Content</span><div class="m"><span>Oct 12</span><span class="pf-av sm">PO</span></div></div><div class="pf-tk lo "><b>Order prize towels</b><span class="pf-badge warn">Ops</span><div class="m"><span>Oct 14</span><span class="pf-av sm">SK</span></div></div></div><div class="pf-col"><h4>In progress<span>2</span></h4><div class="pf-tk md drag"><b>Build leaderboard sheet</b><span class="pf-badge ">Data</span><div class="m"><span>Oct 8</span><span class="pf-av sm">ML</span></div></div><div class="pf-tk hi "><b>Update class descriptions</b><span class="pf-badge ">Content</span><div class="m"><span>Oct 10</span><span class="pf-av sm">DR</span></div></div></div><div class="pf-col"><h4>Review<span>2</span></h4><div class="pf-tk md "><b>Sign-up form copy</b><span class="pf-badge ">Content</span><div class="m"><span>Oct 7</span><span class="pf-av sm">PO</span></div></div><div class="pf-tk lo "><b>Coach briefing deck</b><span class="pf-badge dk">Staff</span><div class="m"><span>Oct 8</span><span class="pf-av sm">DR</span></div></div></div><div class="pf-col"><h4>Done<span>5</span></h4><div class="pf-tk lo "><b>Set challenge rules</b><span class="pf-badge ok">Planning</span><div class="m"><span>Oct 2</span><span class="pf-av sm">DR</span></div></div><div class="pf-tk lo "><b>Book photographer</b><span class="pf-badge ok">Ops</span><div class="m"><span>Oct 1</span><span class="pf-av sm">SK</span></div></div></div></div></div></div></div>

## Anatomy

| Part | Purpose |
|---|---|
| Icon rail | Charcoal `#212529`, selected icon is a gold square, Bebas Neue mark |
| Project sidebar | Gold-soft selected project with a bold label, counts in muted text |
| Header | Bebas Neue title, status badge, due date, team avatars (gold, charcoal, bronze) |
| Board / List / Overview | Different lenses on one task collection; filters apply to Board and List |
| Task card | White, 12px radius, 3px top rule by priority in the static board |
| Primary action | Gold fill with black text, one per view |
| Focus | Gold 3px ring on tabs, inputs and selects |
