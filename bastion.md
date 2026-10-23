---
aside: false
title: Bastion
---

# Bastion

Infrastructure and ops monitoring in a retro-terminal brutalist style. Dark green-black field, phosphor green and amber monospace, square corners, visible grid, and ASCII dividers. Built for status, latency, deploys, incidents, a live log tail, and an operator confirmation.

## Start here

- [Color](/bastion/color): phosphor, amber, and the pairs that carry meaning.
- [Typography](/bastion/typography): monospace, tabular numbers, uppercase labels.
- [Tokens](/bastion/tokens): the CSS variables to copy.
- [Components](/bastion/components): live Bootstrap 6 catalog inside the Bastion frame.
- [Charts](/bastion/charts): sparklines, CPU meters, and request bars.
- [Motion](/bastion/motion): lamps, pings, draws, and reduced motion.
- [Usage](/bastion/usage): how to load Bootstrap 6 without touching other languages.
- [Ops dashboard](/bastion/dashboard): the full sample screen.

## Principles

1. The screen reads like a terminal. Square panels, dashed rules, one monospace family.
2. Green means nominal. Amber means attention. A word always sits next to the color.
3. Numbers are tabular. Latencies, percents, replica counts, and timestamps keep their columns.
4. Motion is a lamp, a ping, a meter filling, or a new log line. It is not decoration that hides data.
5. Bootstrap 6.0.0-alpha.1 is pinned and scoped to `.bst-root`. Other languages stay on their own CSS.
6. Every live preview is fictitious. Approve and Dismiss do not reach a cluster.

## Using the system

Wrap product UI in `.bst-root` with `data-bs-theme="dark"`, then `.bst`. Load the scoped Bootstrap 6 stylesheet only for that root. Details, alpha quirks, and the do-not list are in [Usage](/bastion/usage).
