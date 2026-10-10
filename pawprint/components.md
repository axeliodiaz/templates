---
outline: [2, 3]
---
<script setup>
import ComponentCatalog from '../.vitepress/theme/ComponentCatalog.vue'
</script>

# Pawprint components

Pet-care components in the Pawprint language. Every piece has hover, focus, active and disabled states, motion by default (stops under reduced motion) and light and dark modes. Names and data are fictitious.

## Pet profile and cards

<div class="pp"><div class="pp-grid"><div class="pp-card"><div class="pp-pet"><div class="pp-av ">🐕</div><div><h4>Kiara</h4><small>Labrador mix, 4 years</small><div class="pp-row" style="margin-top:6px"><span class="pp-badge ok">Vaccines up to date</span></div></div></div></div><div class="pp-card"><div class="pp-pet"><div class="pp-av blue">🐈</div><div><h4>Miso</h4><small>Domestic shorthair, 2 years</small><div class="pp-row" style="margin-top:6px"><span class="pp-badge warn">Booster due soon</span></div></div></div></div><div class="pp-card"><div class="pp-pet"><div class="pp-av sage">🐇</div><div><h4>Pip</h4><small>Holland lop rabbit, 1 year</small><div class="pp-row" style="margin-top:6px"><span class="pp-badge bad">Checkup overdue</span></div></div></div></div></div></div>

Use an avatar ring in the pet's own accent, one status badge, and a lift on hover. The paw avatar wiggles a few degrees on hover.

## Buttons and badges

<div class="pp"><div class="pp-card"><div class="pp-row"><span class="pp-btn"><span class="pp-paw">🐾</span> Book a visit</span><span class="pp-btn blue">Add pet</span><span class="pp-btn sage">Mark as done</span><span class="pp-btn out">Details</span><span class="pp-btn ghost">Cancel</span><span class="pp-btn" disabled>Disabled</span><span class="pp-btn sm">Small</span></div><div class="pp-row" style="margin-top:14px"><span class="pp-badge ok">✓ Vaccinated</span><span class="pp-badge info">ℹ Microchipped</span><span class="pp-badge warn">⏰ Due in 6 days</span><span class="pp-badge bad">! Overdue</span></div></div></div>

Primary is biscuit yellow with dark ink. Blue is for the main data action. Every status badge carries an icon or word, never color alone.

## Forms

<div class="pp"><div class="pp-card"><div class="pp-grid"><label class="pp-field">Pet name<input value="Kiara" aria-label="Pet name"></label><label class="pp-field">Species<select aria-label="Species"><option>Dog</option><option>Cat</option><option>Rabbit</option></select></label><label class="pp-field">Weight (kg)<input type="number" value="24.5" aria-label="Weight in kilograms"></label><label class="pp-field">Next visit<input type="date" value="2026-11-12" aria-label="Next visit"></label></div></div></div>

## Alerts

<div class="pp"><div style="display:grid;gap:10px"><div class="pp-alert ok"><b>✓</b><div><b>Booster recorded.</b><br><small>Rabies, valid until 10 Oct 2027.</small></div></div><div class="pp-alert info"><b>ℹ</b><div><b>Weight is 8% above target.</b><br><small>Ask about portions at the next visit.</small></div></div><div class="pp-alert warn"><b>⏰</b><div><b>Flea treatment due in 6 days.</b></div></div><div class="pp-alert bad"><b>!</b><div><b>Checkup overdue by 3 weeks.</b><br><small>Book a visit to keep the care plan active.</small></div></div></div></div>

## Navbar

<div class="pp"><div class="pp-nav"><b><span class="pp-paw">🐾</span> Pawprint</b><a class="on" href="#">Home</a><a href="#">Pets</a><a href="#">Care plan</a><a href="#">Shop</a><span class="pp-btn sm">Book a visit</span></div></div>

## Care timeline

<div class="pp"><div class="pp-card" style="max-width:420px"><h4>Kiara's care</h4><ul class="pp-tl"><li><b>Rabies booster</b><small>Done 3 Sep 2026</small></li><li><b>Deworming</b><small>Done 1 Oct 2026</small></li><li class="due"><b>Flea and tick</b><small>Due 16 Oct 2026</small></li><li class="late"><b>Dental checkup</b><small>Overdue since 19 Sep 2026</small></li></ul></div></div>

## UI-kit catalog

The full catalog below has 43 component families, each with a live preview, usage, markup and keyboard notes, drawn in the Pawprint palette.

<ComponentCatalog language="pawprint" />
