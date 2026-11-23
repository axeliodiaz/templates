# TEM-384 pure-model groundwork

This draft is only the pure-model portion of ACR-06. It does not complete TEM-384, create a visible demo or complete TEM-385 adapters.

The issue's written contract supplies CrewAgent, CrewProject, CrewHandoff, tool/status/action/Ack shapes, context thresholds, number formatting rules and common-ancestor handoff semantics. These support original isolated model work without the missing visuals. No source or assets from the external component were fetched or copied.

Missing ACR-06.zip and shared spec-general.md sections 3, 7 and 9 block exact anatomy, motion/reduced-motion behavior, dialog behavior and visual verification. The issue also contains an unresolved scope conflict: metadata excludes a project switcher and some controls while the detailed templates requirements include them. No control or switcher UI is implemented here. That decision goes to the owner before implementation.

The helper APIs are draft groundwork, not a shipped consumer contract:
- validate accepts a root and returns errors; normalize validates then returns preorder references without changing source data. Validation covers required core fields, duplicate agent ids and object cycles. Optional detail metadata validation remains follow-up work.
- counts includes the root. Validation/identity scope is one project tree; project selection is not implemented.
- IconName is temporarily an unrestricted string because the eventual original icon catalog is not supplied. No guessed paths or icon assets are included.
- contextLevel returns a clamped ratio and work/late/over level; null/nonfinite/invalid denominator yields no bar. Display values are not fabricated.
- formatCost returns n/a for unknown values and null for invalid values, so a future consumer can omit invalid costs. A real zero remains $0.00.
- formatDuration advances only working agents; nonworking agents without an observed end show n/a rather than a guessed stop time. Final paused-time semantics need the source/consumer decision.
- handoffPath returns source-to-target ids through the common ancestor; an absent endpoint yields an empty path, and an invalid tree throws. Animation, event-id history and initial-render suppression are not part of these helpers.

No AgentCrew.vue, synthetic event script, geometry, motion, CSS, icon catalog, canonical page or adapter routes are claimed. No existing agent-orchestration or flow-graph files are modified. No production, migration, provider, billing or network integration is added.
