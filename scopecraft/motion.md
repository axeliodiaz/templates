---
aside: false
---
<script setup>
import StudioMotion from '../.vitepress/theme/StudioMotion.vue'
</script>

# Scopecraft motion

Motion shows a real local state change. Cards retain identity between lanes; expansion keeps context; list changes use keyed transitions. No payment, message or external task runs.

<StudioMotion theme="scopecraft" />

## System behavior

The shared motion layer animates visible entry (280ms), state updates (180ms) and controls (160ms) on component catalogs and examples. This page demonstrates card movement (300ms), expansion and reordering (240ms), status feedback, and staggered entry (200ms with 70ms spacing).

Reduced-motion turns CSS and shared animations off while keeping labels, focus and final content. Success is not a looping activity signal. Native dialog/drawer previews use Escape and contain focus.

[Live components](/scopecraft/components) · [Extended variants](/scopecraft/components-more)
