# Markdown

## The system, in files AI understands

Two files readable by people and by AI capture the whole system. Download or copy them into an AI tool so it generates on-brand interfaces using the real @felix/ui components. Canonical files live in the design-system repo; this page is the same map.

### DESIGN.md — the identity contract

Colors, typography, tokens, shapes, voice, and system rules in one file. Use it as base context whenever AI generates Felix UI.

- One primary button per screen. Interactive elements are pills.
- Focus is always a turquoise ring (`--shadow-selection`), never a border-color change alone.
- A card uses a border or a shadow, never both.
- Icons are Phosphor: duotone at rest, fill when active. Never Lucide.
- Spanish-first, informal tú. Never usted. Fees are a visible line even when zero.
- No gradients or emoji in product UI. Warning is yellow `#ffd200`, not orange.

### components.md — the component reference

All 43 @felix/ui components: what each is for, how to use it, and what it exports. Add it when asking for screens built from existing components instead of raw HTML. The catalog in this guide ([atoms](/felix/components/atoms), [molecules](/felix/components/molecules), [organisms](/felix/components/organisms)) is that same list.

## How to use them

- **Cursor** — Drag the files into chat or reference them with @DESIGN.md and @components.md. Cursor uses them as context when generating UI.
- **Claude Code** — Ask it to read DESIGN.md and components.md from the repo (or attach them) before generating screens.
- **v0** — Paste DESIGN.md as Project Instructions. v0 reskins shadcn with Felix's look. See V0_SETUP.md.
- **ChatGPT, Gemini, and others** — Paste the files at the start of the conversation: DESIGN.md as brand context, components.md when asking for screens built from components.

Live system: [felix-design-system.vercel.app/markdown](https://felix-design-system.vercel.app/markdown)
