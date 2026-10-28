---
pageClass: attachments-guide
---
<script setup>
import AttachmentUsageDemo from './.vitepress/theme/AttachmentUsageDemo.vue'
</script>

# Attachment and file upload

An attachment control collects a local file selection and shows what is attached. Selection is not upload. A real upload needs a destination, permissions, server validation and a verified result. Keep filenames, limits and removal clear before any transfer starts.

## Try picker, drop and removal

<AttachmentUsageDemo />

The list starts empty. The native picker accepts several PDF/TXT files; dropping files uses the same local rules. This guide checks filename extension and a 2 MiB per-file limit, then stores name, byte size and MIME metadata only. It does not read bytes or create previews, object URLs or upload requests. Add fictitious files adds two metadata records without generating files. Repeated selections are allowed, with unique local IDs; no deduplication is implied. Remove changes only this list and focuses the file input. Clear empties the list.

## How to use it

1. Keep the native input available as the keyboard alternative to drag/drop. Do not require a precise pointer gesture.
2. Explain accepted types, limits and destination. The accept attribute is a picker hint, not validation or proof of safe content.
3. Use one processing path for picker and dropped files. Report rejected names and preserve accepted records.
4. Use stable IDs, not filenames as keys; two files may share a name. Reset the picker value after processing so the same file can be chosen again.
5. Give removal controls item-specific names and a stable focus destination when their row disappears.
6. Never claim uploaded or saved from a populated local list. This sample explicitly says Local only.

## Anatomy and actual API

`AttachmentUsageDemo.vue` has no props or emits. `entries` contains `{ id, name, size, type }` metadata; feedback starts empty and dragging false. `accept(files)` checks PDF/TXT suffix and size, appends accepted records and reports rejection. `change(event)` and `drop(event)` pass File arrays to that function. `remove(id)` filters one record and focuses the picker. `clear()` empties the list/input; `samples()` appends fictitious metadata. IDs keep increasing after clear.

```vue
<script setup>
import AttachmentUsageDemo from './.vitepress/theme/AttachmentUsageDemo.vue'
</script>
<template><AttachmentUsageDemo /></template>
```

There are no retained File references, content reads, timers, subscriptions or object URLs, so no upload cancellation or URL revocation is needed on unmount. The displayed MIME comes from browser metadata and is not trusted. Instance-scope the rules ID before repeated mounts. Suggested host data is `{ id, file, status, progress, error, serverId }` with explicit selected/uploading/uploaded/failed states. Those are integration fields, not verified exports.

## States and variants

| State | Actual behavior |
|---|---|
| Empty | No local files selected text. |
| Drag over | Background feedback, same parser on drop. |
| Accepted | Metadata only, unique ID and Local only text. |
| Rejected | Filename or size rule failed, named feedback; accepted siblings remain. |
| Removed/cleared | Only local list changes, not disk or server deletion. |
| Fictitious samples | Metadata records, no actual files generated. |
| Uploading/progress/retry | Not simulated; no fake progress or successful-upload claim. |

## Source coverage

| Source | Actual implementation and limits |
|---|---|
| [UI kit](/ui-kit#attachment), [Components](/components#attachment), [Lustro guide](/lustro/guide-components#attachment) | Native single file input accepts PDF/TXT and displays filename plus rounded KB. Shared selectFile reads metadata, not a server upload. The source does not implement drag/drop or a multi-file list. |
| [Felix molecules](/felix/components/molecules#attachment) | Static file/image chip specimens in sizes and states. data-remove buttons remove local DOM chips through the enhancer. Loading/error labels are styled examples, not verified network upload progress or retry. |

Felix prose names attachment props and onRemove, but preview markup does not establish installed package exports. This guide adds local teaching interactions without silently changing source specimens.

## Motion, accessibility and integration

New rows fade and move 3px over 160ms; drop background changes over 150ms. Reduced motion removes both. Native input/buttons retain standard keyboard behavior. No global paste handler, automatic submit, drag-only action or focus trap exists. Status feedback is polite; rejected filenames stay readable.

Test picker/drop parity, multiple files, accepted/rejected mixtures, oversized files, repeated names/selections, removal, clear, keyboard, focus recovery, long filenames and narrow layouts. In production, validate bytes/MIME and limits on the server, scan content as appropriate, enforce account access and handle failed/aborted transfers. Revoke object URLs and cancel requests if you add previews or uploading. Do not disclose a private file merely because it was selected locally.

<style>
@media(max-width:700px){.attachments-guide .vp-doc table,.attachments-guide .vp-doc tbody,.attachments-guide .vp-doc tr,.attachments-guide .vp-doc td{display:block;width:100%;box-sizing:border-box}.attachments-guide .vp-doc thead{display:none}.attachments-guide .vp-doc td:first-child{font-weight:650;background:var(--vp-c-bg-soft)}.attachments-guide .vp-doc td{overflow-wrap:anywhere}.attachments-guide .vp-doc tr{margin-bottom:12px}}
</style>
