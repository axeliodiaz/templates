# Reference collection

Seven original implementations based on the design patterns selected October 9. Five standalone templates and two reusable components. No source assets or code redistributed. These are UI templates with sample data and local actions, not connected business services.

| Reference | Deliverable | Live example |
| --- | --- | --- |
| Nizam, job economics | Margin template | [Margin](./margin) |
| Jubayer, access/security | Sentinel template | [Sentinel](./agent-security) |
| Ilias, financial-agent onboarding | Brief template | [Brief](./agent-onboarding) |
| Akash, service topology | TopologyGraph component | [Graph components](./graph-components) |
| Adrian, workflow builder | WorkflowBuilder component | [Graph components](./graph-components#workflow-builder) |
| Muiz, mobile fitness | Pace template | [Pace](./fitness) |
| Dapson, trade finance | Cargo template | [Cargo](./trade-finance) |

## Use the templates

Each standalone page contains its own Vue3 state, scoped layout/styles and pattern credits. Copy the layout into your app and replace sample data through your own source-of-truth APIs. The examples use the existing `motion` library, respect reduced-motion, and cancel animations on unmount.

Use the graph components through their documented public inputs, events and slots. They do not edit supplied data directly, persist changes or execute a workflow engine.

## Boundaries

- Margin: cost/hours comparison, timeline, gross-profit bridge and local flag/estimate actions.
- Sentinel: security KPIs, request chart, search, review/revoke demo state. No credentials or access control is connected.
- Brief: guided name/brief, reviewed rules, cap validation, sample replay and session draft confirmation. No accounts, payments or authority are granted.
- Pace: goals, discovery filters, local workout timer, progress and profile settings. No health data or wearable is connected.
- Cargo: credit overview, activity views, shipment/timeline/document states, repayment draft and fixed-code verification UI. No shipping, banking or authentication service is connected.

This collection preserves the core patterns without pretending to reproduce every source screen or backend feature. Production data, authentication, persistent storage, financial execution, device integration and authorization require your application's own implementation.
