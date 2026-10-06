---
aside: false
pageClass: sc-page
---

<script setup>
import QanunLog from '../.vitepress/theme/QanunLog.vue'
</script>

# Log an entry

A quick health log based on the Qanun concept (https://x.com/imimran04/status/2106997312346329287): tabs for water, mood, weight and meal photo, a weight ruler you drag or move with the arrow keys, a Kg and lb switch with the goal, a Save button and a list of today's logs you can delete. Themed for Scopecraft. Save adds a row to the list; the trash button removes it. The new row animates in with Motion and stays still with reduced motion. Fictitious data.

<QanunLog theme="scopecraft" />

## Anatomy

| Part | Notes |
|---|---|
| Tabs | One entry type at a time; the selected tab is marked with fill and `aria-selected` |
| Weight ruler | A range input over a tick scale; the active tick is highlighted and the value updates live |
| Unit switch | Kg or lb; the goal converts with it |
| Save | Adds the entry to today's logs and confirms with "Saved" |
| Today's logs | Type, summary, time and a delete button with an accessible name |
