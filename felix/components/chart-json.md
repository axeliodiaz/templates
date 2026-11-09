---
pageClass: felix-scoped-guide
---

# JSON charts

A chart spec names a component, a local source, source columns and component-specific options. The renderer owns the Felix visual system, keyboard reading, exact data view and motion. The spec does not contain chart numbers.

## Format

```json
{
  "component": "bar",
  "title": "Sample units by group",
  "subtitle": "Fictitious local data",
  "data": {
    "source": "sample.groups",
    "filter": [{ "field": "Value", "op": ">", "value": 0 }],
    "sort": { "field": "Value", "dir": "desc" },
    "limit": 20
  },
  "encoding": { "category": "Group", "value": "Value" },
  "options": { "highlight": "North" },
  "insight": "A short observation supported by the source."
}
```

The corresponding source registry is separate:

```json
{
  "sample.groups": {
    "headers": ["Group", "Value"],
    "rows": [
      ["North", 35],
      ["South", 25],
      ["East", 20]
    ]
  }
}
```

`component`, `data` and `encoding` are required. Titles and subtitles are at most 90 characters. The source must exist locally and each mapped column must exist in its headers. Filter operators are `=`, `!=`, `>`, `>=`, `<`, `<=`, `in` and `not in`; membership values must be arrays. Sorting is stable and uses `asc` by default. Limits are 1–500 rows.

## Preview, Spec and Example

- Preview renders the last valid spec. Focus or hover marks for exact values, or open Data view.
- Spec shows the JSON that produced that preview.
- Example edits the spec and the separate source registry. Render JSON validates both before changing the preview. Reset restores the sample. Invalid input never clears a valid chart or silently substitutes invented data.

The tab list supports Left/Right, Home and End. Inputs, marks and data rows support keyboard focus. Motion can be replayed and respects reduced motion. Loading/Empty are demonstration states, not claims about an external request.

## Components and local extensions

The supported catalog uses per-component channel and option contracts. A line maps `x` and `y`; a bar maps `category` and `value`; a Sankey maps `source`, `target` and `value`. Channels are not interchangeable. The renderer checks the appropriate numeric domains and bounds before drawing.

Felix-only components use an explicit `felix-` prefix for families with no matching base contract, including candlesticks, step and stream charts, polar/radial charts, activity skylines and node dependency diagrams. These extensions are isolated in `felix-chart-spec.mjs`; they do not redefine base component names. The source registry and implementation carry their own version metadata outside the chart spec.

Data comes from the selected source. There are no implicit remote fetches, inline executable expressions, raw HTML, arbitrary CSS or JavaScript in a spec. User-supplied source input is capped at 2,000 rows and 30 columns. Fields, options, components and data sources are validated. Bad bounds, negative allocation values, duplicate node IDs, missing dependencies and dependency cycles are rejected with an error path.

## Semantics

- Area charts accumulate additive per-period values. Use `options.values: "running"` only when the supplied values already are a running total.
- Bars begin at zero; grouped and stacked charts retain series identity. Waterfall geometry uses cumulative signed changes.
- Ranges and boxes use ordered bounds; candlesticks require open and close within low/high.
- Scatter positions use independent numeric x/y scales. Bubble area, not radius, scales with size.
- Histograms compute equal-width bin counts from observations. Treemap tile area and donut angles encode nonnegative shares.
- Gantt intervals preserve start/end; chart samples use numeric elapsed units rather than parsing locale-dependent dates.
- Sankey link width scales with source flow. Nodes and dependency links use explicit IDs and a cycle-checked dependency list.
- Status progress uses explicit per-status weights. It is not the fraction of cards merely started.
- Series trend accepts optional `encoding.series`, `options.selectedSeries` (default `All`) and `options.currentPeriod`. The selector sums the selected series by period, keeps wholly missing periods as gaps and excludes the named current period from the regression. Mark readouts report these aggregates; Data view retains the original source rows.
- Dependency/process charts accept `options.interactive: true` with `encoding.status`. Complete actions change local source rows from `In progress` to `Done`; waiting nodes unlock when all dependencies are done. Reset restores the sample even after all nodes complete. Nothing is sent or persisted. These are local completion controls, not external workflow updates.

The examples are local demonstrations, not a production data connector. Applications remain responsible for access control, retrieval, refresh cadence, complete/missing periods and source provenance. Do not label synthetic data as real.

## Current renderer scope

The contract validates component-specific fields. This version implements the documented sample channels and a conservative option subset; a valid base-contract option that has no renderer implementation is rejected with an explicit error rather than silently ignored. For example, this line renderer accepts x/y/comparison, but not annotation/reference styling yet. Range requires precomputed low/high; box requires precomputed five-number summaries; grouped/stacked bars require two wide-format series; Gantt requires numeric start/end. These constraints are reported during validation.

This is a JSON renderer, not an arbitrary charting-language interpreter. Additional renderers and options can be added behind the component registry without changing existing specs. Base contracts and Felix-only extensions stay separate.
