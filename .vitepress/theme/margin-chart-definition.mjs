import chartExamples from './felix-chart-examples.json'

/**
 * @param {string} slug Felix example key (margin graph slug)
 */
export function marginChartDefinition(slug) {
  const spec = chartExamples.examples[slug]
  if (!spec) {
    return { type: 'chart', chart: { kind: slug }, error: `Unknown chart slug: ${slug}` }
  }
  const sourceId = spec.data?.source
  const sources = sourceId
    ? { [sourceId]: structuredClone(chartExamples.sources[sourceId]) }
    : {}
  const kind =
    spec.component === 'felix-arc'
      ? 'arc'
      : spec.component?.replace(/^felix-/, '') || spec.component || slug
  return {
    type: 'chart',
    chart: { kind },
    spec: structuredClone(spec),
    sources,
  }
}

export const CHART_SCHEMA_FIELDS = [
  { field: 'type', role: 'Schema discriminator (`chart`).' },
  { field: 'chart.kind', role: 'Renderer id (line, bar, donut, arc, sankey, …).' },
  { field: 'spec', role: 'Felix chart JSON spec (component, data, encoding, options).' },
  { field: 'sources', role: 'Named tabular blocks referenced by spec.data.source.' },
]