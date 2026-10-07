# Folio motion

| Interaction | Timing | Behavior |
| --- | --- | --- |
| Hover / focus | 160ms | Border or surface change, no layout shift |
| Press | 160ms | 1px movement and immediate feedback |
| Toast / drawer | 200ms | 8px fade-in |
| Bar reveal | 600ms | Scale from baseline |
| Line reveal | 1000ms | Draw the series once |
| Loading indicator | 800ms loop | Only in a visible loading state |

State changes use transitions that preserve card identity and final values. Never animate amounts in a way that obscures the final value. For reduced-motion, transitions and animations are disabled; content and final values remain visible.

## Live motion states

<script setup>
import StudioMotion from '../.vitepress/theme/StudioMotion.vue'
import StudioCatalog from '../.vitepress/theme/StudioCatalog.vue'
</script>
<StudioCatalog theme="folio" section="atoms" />

Try Async demo, toggle, slider, focus and pressed states. With reduced-motion enabled, loading text still communicates the state without rotation.

## State and layout motion

<StudioMotion theme="folio" />
