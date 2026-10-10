# Pawprint

Pawprint is a design language for pet-care products: clinics, insurance, shops, adoption, trackers and owner apps. It serves two audiences at once. The owner reads the interface and decides. The pet only sees the room, the bowl and the toys, so color carries two jobs: reassure the human and stay readable for a dichromatic eye. Warm cream surfaces, harbor blue, biscuit yellow and sage, rounded shapes, Fredoka headings and Nunito text. Light and dark modes, built-in motion, 43 component families and 38 chart types in this palette.

<div class="pp"><div class="pp-nav"><b><span class="pp-paw">🐾</span> Pawprint</b><a class="on" href="#">Home</a><a href="#">Pets</a><a href="#">Care plan</a><a href="#">Insurance</a><span class="pp-btn sm">Book a visit</span></div></div>

## Color psychology research

I checked what the evidence supports, because pet branding is full of confident infographics. Findings, kept honest:

| Question | What the sources say | Design decision |
|---|---|---|
| Do dogs see color? | Yes, but dichromatic: two cone types peaking near 429 nm (blue-violet) and 555 nm (yellow-green), behaving like red-green color blindness in tests. [Neitz et al. 1989](https://www.cambridge.org/core/journals/visual-neuroscience/article/abs/color-vision-in-the-dog/5A30E35A384D10B6A2B46B01C896D3D5), [Royal Society Open Science 2017](https://royalsocietypublishing.org/rsos/article-split/4/11/170869/93169/Are-dogs-red-green-colour-blind-Colour-vision-in) | Blue and yellow are the brand pair. Red and green are never the only difference between two states. |
| Is yellow special for dogs? | Pet dogs under seven years old approached yellow bowls first most often, replicating a free-ranging dog study; brightness was tested as an alternative explanation. [Stevens et al. 2026 preprint](https://jeffreyrstevens.github.io/pubs/stevens_etal_2026_preprint.pdf), [Roy et al., Animal Cognition](https://link.springer.com/article/10.1007/s10071-024-01928-9) | Yellow is the action color: it signals "go here" for people too. Treat it as a hint, not a law (preprint, small samples). |
| Cats? | Two cone types as well, tuned toward blue-violet; cats judge brightness and movement better than hue. [Pet Food Processing, 2022](https://www.petfoodprocessing.net/articles/16320-visual-purchasing-how-to-use-color-to-appeal-to-pets-and-owners) | Rely on contrast and movement (motion built in), not hue alone. |
| Do colors move human mood and behavior? | Effects exist but depend on context, and many popular claims are overstated. Red tends to signal threat or error in achievement contexts; blue and green are tied to calm and nature. [Elliot and Maier, Annual Review of Psychology 2014](https://www.annualreviews.org/content/journals/10.1146/annurev-psych-010213-115035) | Use color for meaning (status, hierarchy), with labels and icons. Do not promise "calming" through hex values alone. |
| What do pet brands actually do? | Chewy: deep blue. BARK: mustard yellow and pastel pink. Blue Buffalo: blue. Stella and Chewy's: red. The same source warns the Pinterest-style rules rarely hold. [Tails Talks, 2024](https://tailstalks.com/articles/color-theory-pet-products-packaging) | Blue for trust is the category norm; yellow gives Pawprint its own warmth. |
| Clinics and care spaces | Soft blues, greens and warm neutrals are widely recommended over stark white and heavy red; the evidence is mostly practitioner guidance. [Hinge Studio on Fear Free design](https://www.hingestudio.net/fearfreevetdesign/), [Design Work Life](https://designworklife.com/building-trust-through-color-and-design-in-a-veterinary-clinic/) | Cream, sage and blue surfaces. Coral stays small. |

Caveat: a vendor blog (coloracci.ai) claims clinic colors "measurably lower stress" citing a veterinary journal. I could not verify that citation, so it is not used here. Most pet-branding color claims are practitioner opinion; treat the palette as a reasoned default, then test it with real owners.

## Palette

<div class="pp"><div class="pp-grid"><div class="pp-sw"><i style="background:#FBF6EE"></i><div><b>Cream</b><code>#FBF6EE</code><span>Page surface. Warm, never stark white (clinical, cold).</span></div></div><div class="pp-sw"><i style="background:#2F6DB5"></i><div><b>Harbor blue</b><code>#2F6DB5</code><span>Primary. Trust, reliability, calm. Blue is one of the two hues dogs see best.</span></div></div><div class="pp-sw"><i style="background:#F2B84B"></i><div><b>Biscuit yellow</b><code>#F2B84B</code><span>Action fill and highlights. Warmth, play. Visible to dogs and cats.</span></div></div><div class="pp-sw"><i style="background:#6FA287"></i><div><b>Sage</b><code>#6FA287</code><span>Health, nature, success. Soft green for vaccines done and good news.</span></div></div><div class="pp-sw"><i style="background:#E4745A"></i><div><b>Coral</b><code>#E4745A</code><span>Affection and alerts for owners only. Never the only signal (dogs see it as dull brown-gray).</span></div></div><div class="pp-sw"><i style="background:#1F3A5F"></i><div><b>Deep harbor</b><code>#1F3A5F</code><span>Navigation and inverted bars. Anchors the page.</span></div></div><div class="pp-sw"><i style="background:#2A2A35"></i><div><b>Warm ink</b><code>#2A2A35</code><span>Text. Soft near-black, 13:1 on cream.</span></div></div></div></div>

Status colors keep a text label and an icon. Fill colors carry dark ink; blue fills carry white. Dark mode shifts to navy ink with lighter tints (`#8DB8F0` blue, `#F2C45E` yellow, `#8CC4A4` sage, `#F08E77` coral).

Chart series, in order: blue `#2F6DB5`, yellow `#F2B84B`, sage `#6FA287`, deep harbor `#1F3A5F`, coral `#E4745A`. Blue and yellow come first because they stay distinguishable for color-blind readers and for dogs.

## Typography

<div class="pp"><div class="pp-card"><div style="font:700 48px/1.05 Fredoka,sans-serif">Happy tails, healthy pets</div><small>Display and headings: Fredoka 500-700, rounded terminals, friendly without being childish.</small><hr style="border:0;border-top:1px solid var(--pp-line);margin:14px 0"><p style="font:400 17px/1.6 Nunito,sans-serif">Body text: Nunito 400-800, 16-17px, line height 1.6. Rounded like the headings, very readable at small sizes for dosage tables and appointment details.</p><small>Numbers use Fredoka in stat tiles and tabular digits in tables.</small></div></div>

## Rules

1. Cream, not white, for pages. White is for cards that sit on top.
2. Yellow fills carry dark ink. Blue is for links, selected states and primary data. One yellow button per view.
3. Never use red/green alone. Pair color with a label, icon or position.
4. Radius scale: 12px inputs, 16px cards, 999px for buttons and chips. Rounded shapes read as soft and safe.
5. Coral is for affection and urgent owner actions, always with text. Overdue vaccine: coral dot plus the word "Overdue".
6. Motion is built in: gentle lift on cards, a paw wag on hover, charts that draw in. All of it stops under reduced motion.
7. Dark mode is navy, not black, with the same hues lightened. Toggle in the bottom-right corner.

Next: [components](/pawprint/components), [charts](/pawprint/charts), [pricing example](/pawprint/pricing), [pet dashboard](/pawprint/dashboard), [motion](/pawprint/motion).
