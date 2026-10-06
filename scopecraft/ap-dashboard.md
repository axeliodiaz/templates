---
aside: false
pageClass: sc-page
---

<script setup>
import ClearbillDash from '../.vitepress/theme/ClearbillDash.vue'
</script>

# Accounts payable dashboard

An accounts payable overview based on the Clearbill concept (https://x.com/nizamdesign/status/2106995302582436310): a first-pass acceptance headline with a barcode strip where every mark is a share of the day's invoices, a "Needs attention" list with one action per row, a blocked value card split by due date, invoices by channel, and an AI-picked exception to start with. Themed for Scopecraft. Click an action (Send reminders, Review, Assign) and the open exception count and the strip update. Marks and rows animate in with Motion and stay still with reduced motion. Fictitious data.

<ClearbillDash theme="scopecraft" />

## Anatomy

| Part | Notes |
|---|---|
| Acceptance headline | First-pass rate with change, plus processed, accepted, fixed and open counts |
| Barcode strip | One mark per share of invoices; color separates accepted, fixed and open, and the legend names each |
| Needs attention | Exception groups with value at stake and a single action |
| Blocked value | Total split by how soon payment is due |
| Channels | Invoices and exceptions by intake channel |
| Start here | One recommended exception with owner, next action and due date |
