---
aside: false
---

<script setup>
import ForecastDash from '../.vitepress/theme/ForecastDash.vue'
</script>

# Forecast

A demand forecast screen based on the Mise concept (https://x.com/nizamdesign/status/2106846318174114267): a headline cover count with change and confidence range, lunch, dinner and peak cards, a dot chart where each dot is one cover, a "What is driving it" list that adds up to the forecast, and demand change cards per dish. Themed for Felix. Click a driver to switch it off and watch the forecast, range and dots update. Dots and cards animate in with Motion and stay still with reduced motion. Fictitious data.

<ForecastDash theme="felix" />

## Anatomy

| Part | Notes |
|---|---|
| Headline | Expected covers, change vs a typical day and a likely range |
| Service cards | Lunch, dinner and peak time |
| Dot chart | One dot per cover across the day |
| Drivers | Reservations, weather, promotion, event and menu change; each is a toggle with its effect |
| Demand changes | Per dish change with a sparkline and a one line reason |
