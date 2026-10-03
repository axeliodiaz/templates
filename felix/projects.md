<script setup>
import ProjectWorkspace from '../.vitepress/theme/ProjectWorkspace.vue'
</script>

# Project workspaces (Felix)

A project-management dashboard inspired by [Marcel Kargul's board design](https://x.com/marcelkargul/status/2105810012266512566): compact navigation, project properties, view tabs and a four-column Kanban board. Reinterpreted in the Felix design language, not a pixel-for-pixel copy. All projects, people and activity are fictitious.

## Product launch

A cross-functional release: design, engineering and marketing share one board. Try search, priority filters, Overview and List. Open a task to change its status, or create a task at the bottom. These are local UI demonstrations, not connected project data.

<ProjectWorkspace scenario="launch" />

## Studio operations

The same pattern inside a service business: client work sits beside internal operations, with milestone and workload summaries. Each workspace keeps its own demo state.

<ProjectWorkspace scenario="studio" />

## Anatomy

| Part | Purpose |
|---|---|
| Icon rail + project sidebar | Workspace context, favorite projects and team. Navigation items are illustrative; no dead buttons. |
| Project header | Name, health, due date, team and completion count. |
| Board / List / Overview | Different lenses on the same task collection. Filters apply to Board and List; Overview always summarizes the whole project. |
| Status columns | To do, In progress, In review, Done. Counts derive from visible tasks. |
| Task card | Category, title, priority, due date, owner, comments and attachment counts. Entire card opens the detail panel. |
| Detail panel | Inline task information, status control and sample activity. Close returns focus to the workspace naturally. |
| Empty state | Each empty column explains the absence of results; cleared filters restore all tasks. |
| Quick create | Adds a local task; never sends an invitation or creates a record elsewhere. |

## Design rules

1. Keep navigation quiet so task titles lead. Linen surfaces, turquoise primary actions and restrained category accents follow Felix. The existing theme toggle also changes these workspaces.
2. A semantic status needs a text label, not color alone. Owner initials are reinforced by full names in List and task details.
3. Show the same tasks across views. Derive totals, completion and workload from data instead of duplicating numbers in the UI.
4. Filters narrow the current task view; Overview remains project-wide. Use explicit empty states, never an unexplained blank board.
5. On smaller screens collapse the project sidebar. Preserve column widths and scroll the board horizontally rather than crushing cards.
6. Use native buttons, inputs, selects and progress. All controls have accessible names and visible focus rings; the demo does not require dragging.
7. An implementation can add drag-and-drop, persistence, real invitations and permissions. None is implied here. There are no external requests or stored task changes.

## Integration notes

The shared Vue component is `ProjectWorkspace.vue`. Provide `scenario="launch"` or `scenario="studio"` and include `projects.css`. Theme colors are scoped to `.pw`, with Felix light/dark overrides. Both instances are independent and reset on reload.
