---
pageClass: avatars-guide
---
<script setup>
import AvatarUsageDemo from './.vitepress/theme/AvatarUsageDemo.vue'
</script>

# Avatars and stacks

An avatar represents a person or entity beside relevant content. A stack summarizes a group. Initials are a fallback, not proof of identity; initials can collide. Keep meaningful names nearby and do not infer availability or permission from a photo or colored dot. Noninteractive avatars need no tab stop.

## Try sizes, image fallback, status and groups

<AvatarUsageDemo />

The fictitious identities use sm/md/lg sizes and either initials or an original geometric local SVG image. Simulate image failure selects the fallback state without making a broken request. The real image error handler also selects initials if decoding fails. Status is local Available/Busy/Offline text plus a decorative dot, not a presence service. Group limits show two, three or all five people; the +N count is computed, not a button. The full member list stays visible below. Reset restores md/initials/Available/three members.

## How to use it

1. Identify the person in text. A decorative avatar beside the same visible name may use aria-hidden and an empty image alt to avoid duplicate announcements.
2. For a standalone meaningful avatar, provide an accessible name. The group uses role=img with each person's name, not just their initials.
3. Keep a stable footprint during loading and fallback. Crop with object-fit:cover without distorting the image.
4. Treat status as explicit data with a text equivalent. A dot alone cannot communicate Available, Busy or Offline accessibly.
5. Compute group overflow from the full collection. If +N opens a member list in the host, use a named native button and implement its focus/close behavior.
6. Use approved image sources. Do not leak private identity information through arbitrary remote avatar URLs.

## Anatomy and actual API

`AvatarUsageDemo.vue` has no props or emits. `people` contains `{ id, name, initials }`. `size` starts md, `mode` initials, `status` Available, `limit` three and `failed` false. `shown` slices people to the limit and `remaining` subtracts that count from the total. `changeMode()` sets simulated failure only for broken mode. `reset()` restores defaults. The image error event sets failed true.

```vue
<script setup>
import AvatarUsageDemo from './.vitepress/theme/AvatarUsageDemo.vue'
</script>
<template><AvatarUsageDemo /></template>
```

The portrait is an encoded, original SVG data URL with no external request. There are no timers, listeners or subscriptions, so unmount needs no cleanup. The failure option simulates state, not an actual network failure test. No generated-name initials algorithm, account lookup, presence polling, upload, image editing or group popover exists.

Suggested host data is `{ id, displayName, initials, imageUrl?, imageAlt?, status? }` with a group visibleLimit. Those are integration fields, not verified library props. Handle empty names, non-Latin scripts, duplicate initials, failed loads, stale image changes and allowed URL schemes deliberately. Do not use initials as a unique key.

## States and variants

| State | Actual behavior |
|---|---|
| sm/md/lg | 32/48/64px circle, with 11/15/18px initials. |
| Image | Original geometric portrait, circular crop. Decorative next to visible name. |
| Initials/fallback | AR for single identity, each fixed sample's initials in group. |
| Available/Busy/Offline | Local text and decorative dot; no live status. |
| Group/overflow | Arrival-order slice, overlapping circles, computed +N. Full names remain in nearby text. |
| All five visible | No overflow bubble. |
| Loading/upload/edit | Not simulated; the guide makes no server or account changes. |

## Source coverage

| Source | Actual implementation and limits |
|---|---|
| [UI kit](/ui-kit#avatar), [Lustro guide](/lustro/guide-components#avatar) | Shared catalog has two named role=img initials and Available text, not an image-loading or stacked-group controller. |
| Components inventory | The task lists Components#avatar, but the source page has an inline Avatar + identity specimen under Card anatomy, not a dedicated Avatar section. Do not rely on that missing anchor. |
| [Lustro expanded](/lustro/components-more#avatars-and-stacks), [Felix expanded](/felix/components-more#avatars-and-stacks), [Scopecraft expanded](/scopecraft/components-more#avatars-and-stacks) | Static sm/default/lg initials and fixed stacked initials/+4. The count is illustrative, not computed from member data. |
| [Lumen expanded](/lumen/components-more#avatars-and-stacks) | Separate linked gallery specimen, not this guide's state or image controller. |
| [Felix atoms](/felix/components/atoms#avatar) | Five initials sizes and four status treatments. Package prose names Avatar/AvatarFallback and size/status, but these previews do not establish installed exports or actual image fallback handling. |
| Studio catalogs | Static initials, decorative status dots, larger size and a fixed +4 group. No per-image loader, overflow disclosure or verified presence service. |

This guide demonstrates sizes, fallback and group math without claiming those controls already exist across every source template.

## Motion, accessibility and integration

Size changes transition width/height over 160ms. Reduced motion removes that transition. There is no continuous pulse or presence animation. Native select controls support standard browser keyboard behavior; the avatar and group circles are not interactive. If they navigate to profiles, use links with names; if they open a menu, use a button and implement that menu separately.

Test sizes, image/initials modes, simulated failure and recovery, computed overflow, all-members display, status text, reset, keyboard controls and narrow wrapping. Test real image errors separately when connecting remote photos. Keep presence subscriptions scoped to the current account and clean them up on unmount. Do not present a cached status as live without freshness and source handling.

<style>
@media(max-width:700px){.avatars-guide .vp-doc table,.avatars-guide .vp-doc tbody,.avatars-guide .vp-doc tr,.avatars-guide .vp-doc td{display:block;width:100%;box-sizing:border-box}.avatars-guide .vp-doc thead{display:none}.avatars-guide .vp-doc td:first-child{font-weight:650;background:var(--vp-c-bg-soft)}.avatars-guide .vp-doc td{overflow-wrap:anywhere}.avatars-guide .vp-doc tr{margin-bottom:12px}}
</style>
