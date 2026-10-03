<script setup>
import PricingPage from '../.vitepress/theme/PricingPage.vue'
</script>

# Pricing (Felix)

A pricing-page example: billing toggle, plan cards with a highlighted tier, a feature comparison table, a guarantee strip, a testimonial, an FAQ and a closing call to action. Linen surfaces, turquoise accents and quiet rounded cards. The page follows the Felix light/dark toggle. All company names, people and prices are fictitious. Currency is USD throughout.

## Four SaaS plans

Switch monthly and annual billing, change the team size, and open any question in the FAQ. Everything runs locally and resets on reload.

<PricingPage language="felix" kind="saas" />

## How to use it

- **Plan cards:** keep one tier highlighted and label it in text as well as with a border, so the emphasis never depends on color alone.
- **Billing toggle:** show the discount next to the annual option. Each card restates what you pay and what the yearly total saves, so nobody has to do the math.
- **Comparison table:** group rows by topic, keep the same column order as the cards, and pair every check mark with a hidden text label.
- **FAQ:** answer cancellation, proration and discounts before a visitor has to ask support.

## Anatomy

| Part | Purpose |
|---|---|
| Billing toggle | Two-state control that updates every price on the page |
| Plan card | Name, audience, price, billing note, call to action and top features |
| Guarantee strip | Three short reassurances close to the decision |
| Comparison table | Every feature by plan, grouped, with horizontal scroll on narrow screens |
| FAQ | Single-open accordion with keyboard-operable buttons |
| Closing call to action | One last route for undecided visitors |
