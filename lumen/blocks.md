---
aside: false
pageClass: lmn-page
---

<script setup>
import ShadcnBlocks from '../.vitepress/theme/ShadcnBlocks.vue'
</script>

# Dashboard blocks

Six compact dashboard cards based on the shadcnuikit.com blocks post (https://x.com/tobybelhome/status/2106789085809352934): weekly active members with an OS or browser switch, sales by channel, today's transfers with a filter, an activation funnel, monthly recurring revenue with renewals, and an energy sparkline. Themed for Lumen. Every block is interactive: switch the segmented control, hover a row, channel or funnel stage, or filter transfers. Bars and lines animate in with Motion and stay still with reduced motion. Fictitious data.

<ShadcnBlocks theme="lumen" />

## Anatomy

| Block | Notes |
|---|---|
| Weekly active members | Headline, change, stacked share bar and a ranked list with hover change |
| Sales by channel | Width of each segment is its share; hover shows the change |
| Today's transfers | Net flow follows the filter; direction is shown by a bar color and a sign |
| Activation funnel | Total or step conversion; hover a stage for its details |
| Monthly recurring revenue | Plan split, upcoming renewals and a past due alert |
| Energy generated | Value with a sparkline and a daily average |
