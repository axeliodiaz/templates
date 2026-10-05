---
aside: false
pageClass: lmn-page
---

<script setup>
import ProjectDash from '../.vitepress/theme/ProjectDash.vue'
</script>

# Project dashboard

A project management screen based on the enaz concept (https://x.com/rakibulism/status/2106757589065466189): range pills, an icon rail, a task list with tinted cards you can check off, a donut of project status, an income vs expense line with a hover marker, and an invoice overview with status bars. Themed for Lumen. Cards and bars animate in with Motion and stay still with reduced motion. Fictitious data.

<ProjectDash theme="lumen" />

## Anatomy

| Part | Notes |
|---|---|
| Range pills | Today, This Week, This Month and Reports; one active at a time |
| Icon rail | Navigation icons; the current section is filled |
| My Tasks | Day toggle, task count and tinted cards with a check button |
| Projects overview | Donut with in progress, completed and not started counts in the legend |
| Income vs Expense | Two lines; move the pointer to read a month |
| Invoice overview | One bar per payment status with count and total |
