import contracts from "./felix-chart-contracts.json" with { type: "json" };
// Chart spec wire contract. Local extensions are explicit and isolated.
export const CONTRACT_VERSION = "felix-chart-contract-1";
export const extensions = {
  "felix-step": { type: "step", channels: ["x", "y"] },
  "felix-stream": { type: "stream", channels: ["x", "value", "secondary"] },
  "felix-candlestick": {
    type: "candlestick",
    channels: ["category", "open", "high", "low", "close"],
  },
  "felix-polar": { type: "polar", channels: ["category", "value"] },
  "felix-radial": { type: "radial", channels: ["category", "value"] },
  "felix-pie": { type: "pie", channels: ["category", "value"] },
  "felix-hourmap": { type: "hourmap", channels: ["row", "column", "value"] },
  "felix-matrix": { type: "matrix", channels: ["row", "column", "value"] },
  "felix-contribution-skyline": {
    type: "contribution-skyline",
    channels: ["row", "column", "value"],
  },
  "felix-series-trend": { type: "series-trend", channels: ["x", "y"] },
  "felix-rings": { type: "rings", channels: ["category", "value"] },
  "felix-status-gauge": {
    type: "status-gauge",
    channels: ["category", "value"],
  },
  "felix-status-funnel": {
    type: "status-funnel",
    channels: ["category", "value"],
  },
  "felix-dependency": {
    type: "dependency",
    channels: ["category", "id", "depends"],
  },
  "felix-process": { type: "process", channels: ["category", "id", "depends"] },
  "felix-flowchart": {
    type: "flowchart",
    channels: ["category", "id", "depends"],
  },
  "felix-state-diagram": {
    type: "state-diagram",
    channels: ["category", "id", "depends"],
  },
  "felix-arc": { type: "arc", channels: ["category", "value"] },
  "felix-speed": { type: "speed", channels: ["category", "value"] },
  "felix-hybrid": { type: "hybrid", channels: ["x", "y", "comparison"] },
  "felix-telemetry": { type: "telemetry", channels: ["x", "y", "comparison"] },
};
const fail = (p, m) => {
    throw new Error(`${p}: ${m}`);
  },
  need = (v, p, m) => {
    if (!v) fail(p, m);
  },
  plain = (x) => x !== null && typeof x === "object" && !Array.isArray(x),
  own = (x, k) => Object.prototype.hasOwnProperty.call(x, k);
export function validate(value, schema, path = "spec") {
  if (schema.oneOf) {
    const ok = schema.oneOf.filter((s) => {
      try {
        validate(value, s, path);
        return true;
      } catch {
        return false;
      }
    });
    need(
      ok.length === 1,
      path,
      "value does not match exactly one supported shape",
    );
    return;
  }
  if (schema.anyOf) {
    need(
      schema.anyOf.some((s) => {
        try {
          validate(value, s, path);
          return true;
        } catch {
          return false;
        }
      }),
      path,
      "unsupported value",
    );
    return;
  }
  if (schema.const !== undefined)
    need(value === schema.const, path, `expected ${schema.const}`);
  if (schema.enum)
    need(
      schema.enum.includes(value),
      path,
      `expected ${schema.enum.join(", ")}`,
    );
  const t = schema.type;
  if (t) {
    const types = Array.isArray(t) ? t : [t];
    need(
      types.some((type) =>
        type === "object"
          ? plain(value)
          : type === "array"
            ? Array.isArray(value)
            : type === "integer"
              ? Number.isInteger(value)
              : type === "number"
                ? typeof value === "number" && Number.isFinite(value)
                : type === "null"
                  ? value === null
                  : typeof value === type,
      ),
      path,
      `expected ${types.join(" or ")}`,
    );
  }
  if (typeof value === "string") {
    if (schema.maxLength)
      need(
        value.length <= schema.maxLength,
        path,
        `maximum length ${schema.maxLength}`,
      );
    if (schema.minLength)
      need(value.length >= schema.minLength, path, "text is too short");
  }
  if (typeof value === "number") {
    need(Number.isFinite(value), path, "expected finite number");
    if (schema.minimum !== undefined)
      need(value >= schema.minimum, path, `minimum ${schema.minimum}`);
    if (schema.maximum !== undefined)
      need(value <= schema.maximum, path, `maximum ${schema.maximum}`);
  }
  if (Array.isArray(value)) {
    if (schema.minItems !== undefined)
      need(value.length >= schema.minItems, path, "too few items");
    if (schema.maxItems !== undefined)
      need(value.length <= schema.maxItems, path, "too many items");
    if (schema.items)
      value.forEach((x, i) => validate(x, schema.items, `${path}[${i}]`));
  }
  if (plain(value)) {
    for (const k of schema.required || [])
      need(own(value, k), `${path}.${k}`, "required");
    for (const [k, v] of Object.entries(value)) {
      need(
        !["__proto__", "constructor", "prototype"].includes(k),
        `${path}.${k}`,
        "unsafe key",
      );
      const child = schema.properties?.[k];
      if (child) validate(v, child, `${path}.${k}`);
      else
        need(
          schema.additionalProperties !== false,
          `${path}.${k}`,
          "unknown field",
        );
    }
  }
}
const supported = [
  "bar",
  "column",
  "line",
  "area",
  "range",
  "sankey",
  "timeline",
  "box",
  "sunburst",
  "heatmap",
  "combo",
  "radar",
  "bubble",
  "scatter",
  "cohort",
  "treemap",
  "gauge",
  "donut",
  "pyramid",
  "histogram",
  "waterfall",
  "funnel",
  "bullet",
  "dumbbell",
  "sparkline",
  "kpi",
  "grouped",
  "stackedbar",
];
export const COMPONENTS = [...supported, ...Object.keys(extensions)];
function extensionContract(id) {
  const ext = extensions[id];
  return {
    type: "object",
    additionalProperties: false,
    required: ["component", "data", "encoding"],
    properties: {
      component: { const: id },
      title: { type: "string", maxLength: 90 },
      subtitle: { type: "string", maxLength: 90 },
      insight: { type: "string", maxLength: 300 },
      data: contracts.bar.properties.data,
      encoding: {
        type: "object",
        additionalProperties: false,
        required: ext.channels,
        properties: Object.fromEntries(
          [...new Set([...ext.channels, "secondary", "status", "series"])].map(
            (k) => [k, { type: "string" }],
          ),
        ),
      },
      options: {
        type: "object",
        additionalProperties: false,
        properties: {
          highlight: { type: "string" },
          max: { type: "number", minimum: 0.000001 },
          unit: { type: "string" },
          currentPeriod: { type: "string" },
          weights: { type: "object" },
          interactive: { type: "boolean" },
          selectedSeries: { type: "string" },
          polarEncoding: { enum: ["radius", "area"] },
        },
      },
    },
  };
}
export function resolveSpec(input, sources) {
  need(plain(input), "spec", "expected an object");
  need(
    COMPONENTS.includes(input.component),
    "component",
    "unsupported component; choose a documented renderer",
  );
  validate(
    input,
    extensions[input.component]
      ? extensionContract(input.component)
      : contracts[input.component],
  );
  const d = input.data,
    e = input.encoding || {},
    opts = input.options || {},
    warnings = [];
  need(plain(sources), "sources", "expected a named local source registry");
  need(
    own(sources, d.source),
    "data.source",
    "unknown local source; URLs are never fetched",
  );
  const source = sources[d.source];
  need(
    plain(source) &&
      Array.isArray(source.headers) &&
      Array.isArray(source.rows),
    "source",
    "expected headers and rows",
  );
  need(source.rows.length <= 2000, "source.rows", "maximum 2000 rows");
  need(source.headers.length <= 30, "source.headers", "maximum 30 fields");
  need(
    source.headers.every((x) => typeof x === "string" && x.length <= 90) &&
      new Set(source.headers).size === source.headers.length,
    "source.headers",
    "unique field names required",
  );
  let rows = source.rows.map((r, i) => {
    need(
      Array.isArray(r) && r.length === source.headers.length,
      `source.rows[${i}]`,
      "row width must match headers",
    );
    return Object.fromEntries(source.headers.map((h, j) => [h, r[j]]));
  });
  for (const filter of d.filter || []) {
    need(
      source.headers.includes(filter.field),
      "data.filter.field",
      "unknown field",
    );
    if (["in", "not in"].includes(filter.op))
      need(
        Array.isArray(filter.value),
        "data.filter.value",
        "in/not in requires an array",
      );
    rows = rows.filter((r) => {
      const v = r[filter.field],
        f = filter.value;
      return filter.op === "="
        ? v === f
        : filter.op === "!="
          ? v !== f
          : filter.op === ">"
            ? v > f
            : filter.op === ">="
              ? v >= f
              : filter.op === "<"
                ? v < f
                : filter.op === "<="
                  ? v <= f
                  : filter.op === "in"
                    ? f.includes(v)
                    : !f.includes(v);
    });
  }
  if (d.sort) {
    need(
      source.headers.includes(d.sort.field),
      "data.sort.field",
      "unknown field",
    );
    rows.sort((a, b) => {
      const x = a[d.sort.field],
        y = b[d.sort.field];
      return (x === y ? 0 : x < y ? -1 : 1) * (d.sort.dir === "desc" ? -1 : 1);
    });
  }
  if (d.limit) rows = rows.slice(0, d.limit);
  for (const [channel, field] of Object.entries(e)) {
    const fields = Array.isArray(field) ? field : [field];
    for (const f of fields)
      need(
        source.headers.includes(f),
        `encoding.${channel}`,
        `unknown source column ${f}`,
      );
  }
  const renderedChannels = {
    bar: ["category", "value"],
    column: ["x", "value"],
    line: ["x", "y", "comparison"],
    sparkline: ["x", "y"],
    area: ["x", "value"],
    range: ["category", "low", "high"],
    dumbbell: ["category", "before", "after"],
    bullet: ["category", "actual", "target"],
    box: ["group", "min", "q1", "median", "q3", "max"],
    timeline: ["stage", "start", "end"],
    sunburst: ["group", "subgroup", "value"],
    treemap: ["group", "subgroup", "value"],
    funnel: ["step", "count"],
    waterfall: ["step", "value"],
    radar: ["axis", "value"],
    gauge: ["period", "actual", "target"],
    heatmap: ["row", "column", "value"],
    cohort: ["cohort", "period", "value"],
    combo: ["x", "actual", "plan"],
    scatter: ["label", "x", "y"],
    bubble: ["label", "x", "y", "size"],
    histogram: ["value"],
    sankey: ["source", "target", "value"],
    donut: ["category", "value"],
    pyramid: ["category", "value"],
    kpi: ["value", "period"],
    grouped: ["category", "value"],
    stackedbar: ["category", "value"],
  };
  for (const key of Object.keys(e))
    need(
      extensions[input.component] ||
        (renderedChannels[input.component] || []).includes(key),
      `encoding.${key}`,
      "valid base channel but not supported by this Felix renderer yet",
    );
  const renderedOptions = {
    bar: ["highlight"],
    column: ["highlight"],
    line: [],
    sparkline: [],
    area: ["values"],
    range: [],
    dumbbell: [],
    bullet: ["highlight"],
    box: [],
    timeline: ["unit"],
    sunburst: [],
    treemap: [],
    funnel: ["highlight", "unit"],
    waterfall: ["unit"],
    radar: ["max"],
    gauge: [],
    heatmap: [],
    cohort: [],
    combo: [],
    scatter: [],
    bubble: ["highlight"],
    histogram: ["bins", "unit"],
    sankey: ["unit"],
    donut: [],
    pyramid: [],
    kpi: [],
    grouped: [],
    stackedbar: [],
  };
  for (const key of Object.keys(opts))
    need(
      (extensions[input.component]
        ? [
            "highlight",
            "max",
            "unit",
            "currentPeriod",
            "weights",
            "polarEncoding",
            "interactive",
            "selectedSeries",
          ]
        : renderedOptions[input.component] || []
      ).includes(key),
      `options.${key}`,
      "valid base option but not supported by this Felix renderer yet",
    );
  const kind =
    extensions[input.component]?.type ||
    ({
      column: "bar",
      grouped: "grouped-bar",
      stackedbar: "stacked-bar",
      timeline: "gantt",
      box: "boxplot",
      gauge: "rings",
      sparkline: "sparkline",
    }[input.component] ??
      input.component);
  let enc = { ...e },
    options = { ...opts },
    norm = rows;
  if (
    [
      "line",
      "sparkline",
      "felix-step",
      "felix-hybrid",
      "felix-telemetry",
      "felix-series-trend",
    ].includes(input.component)
  )
    enc = { category: e.x, value: e.y, secondary: e.comparison };
  if (input.component === "kpi") enc = { value: e.value, category: e.period };
  if (input.component === "area") {
    need(
      e.value,
      "encoding.value",
      "this Felix area renderer requires a per-period numeric value",
    );
    enc = { category: e.x, value: e.value };
    let cumulative = 0;
    norm = rows.map((r) => {
      need(
        typeof r[e.value] === "number" && r[e.value] >= 0,
        "data",
        "area requires nonnegative additive values",
      );
      cumulative =
        opts.values === "running" ? r[e.value] : cumulative + r[e.value];
      return { ...r, __cumulative: cumulative };
    });
    enc.value = "__cumulative";
    warnings.push(
      opts.values === "running"
        ? "Source values are already running totals."
        : "Area accumulates per-period values into a running total.",
    );
  }
  if (input.component === "felix-stream")
    enc = { category: e.x, value: e.value, secondary: e.secondary };
  if (input.component === "range")
    enc = { category: e.category, low: e.low, high: e.high };
  if (input.component === "dumbbell")
    enc = { category: e.category, start: e.before, end: e.after };
  if (input.component === "bullet")
    enc = { category: e.category, value: e.actual, target: e.target };
  if (input.component === "box")
    enc = {
      category: e.group,
      min: e.min,
      q1: e.q1,
      median: e.median,
      q3: e.q3,
      max: e.max,
    };
  if (input.component === "timeline")
    enc = { category: e.stage, start: e.start, end: e.end };
  if (["treemap", "sunburst"].includes(input.component)) {
    enc = { category: e.group, value: e.value };
    if (e.subgroup) enc.secondaryCategory = e.subgroup;
  }
  if (input.component === "funnel") enc = { category: e.step, value: e.count };
  if (input.component === "waterfall")
    enc = { category: e.step, value: e.value };
  if (input.component === "radar") enc = { category: e.axis, value: e.value };
  if (input.component === "gauge")
    enc = { category: e.period, value: e.actual, target: e.target };
  if (
    [
      "heatmap",
      "felix-hourmap",
      "felix-matrix",
      "felix-contribution-skyline",
    ].includes(input.component)
  )
    enc = { x: e.column, y: e.row, value: e.value };
  if (input.component === "cohort")
    enc = { x: e.period, y: e.cohort, value: e.value };
  if (["scatter", "bubble"].includes(input.component))
    enc = { category: e.label, x: e.x, y: e.y, size: e.size };
  if (input.component === "combo")
    enc = { category: e.x, value: e.actual, secondary: e.plan };
  if (["grouped", "stackedbar"].includes(input.component)) {
    need(
      Array.isArray(e.value) && e.value.length === 2,
      "encoding.value",
      "this renderer requires exactly two numeric series",
    );
    enc = { category: e.category, value: e.value[0], secondary: e.value[1] };
  }
  if (input.component === "sparkline" && !enc.category) {
    norm = norm.map((r, i) => ({ ...r, __position: String(i + 1) }));
    enc.category = "__position";
  }
  if (input.component === "felix-series-trend" && e.series) {
    const periods = [...new Set(rows.map((r) => r[e.x]))],
      chosen = opts.selectedSeries ?? "All";
    need(
      chosen === "All" || rows.some((r) => String(r[e.series]) === chosen),
      "options.selectedSeries",
      "unknown series",
    );
    norm = periods.map((period) => {
      const group = rows.filter(
        (r) =>
          r[e.x] === period &&
          (chosen === "All" || String(r[e.series]) === chosen),
      );
      const values = group.map((r) => r[e.y]).filter((v) => v !== null);
      need(
        values.every((v) => typeof v === "number" && Number.isFinite(v)),
        "data",
        "series values must be numeric or missing",
      );
      return {
        [e.x]: period,
        __aggregate: values.length ? values.reduce((a, b) => a + b, 0) : null,
      };
    });
    enc = { category: e.x, value: "__aggregate" };
  }
  enc = Object.fromEntries(
    Object.entries(enc).filter(([, v]) => v !== undefined),
  );
  if (input.component === "bar") options.orientation = "row";
  if (input.component === "column") {
    enc = { category: e.x, value: e.value };
    options.orientation = "column";
  }
  if (opts.max !== undefined) options.maximum = opts.max;
  if (input.component === "gauge") {
    options.maximum = Math.max(1, ...rows.map((r) => r[e.target]));
    warnings.push("Each ring shows actual against its own target.");
    norm = rows.map((r) => ({
      ...r,
      __percent: (r[e.actual] / r[e.target]) * 100,
    }));
    enc.value = "__percent";
    options.maximum = 100;
  }
  const numeric = [
    "value",
    "secondary",
    "low",
    "high",
    "open",
    "close",
    "target",
    "start",
    "end",
    "min",
    "q1",
    "median",
    "q3",
    "max",
    "size",
  ];
  if (["scatter", "bubble"].includes(kind)) numeric.push("x", "y");
  for (const [i, r] of norm.entries())
    for (const [ch, f] of Object.entries(enc)) {
      const val = r[f];
      if (ch === "depends") {
        need(
          Array.isArray(val) && val.every((x) => typeof x === "string"),
          `source.rows[${i}].${f}`,
          "expected node ID array",
        );
        continue;
      }
      if (numeric.includes(ch) && !(kind === "sankey" && ch === "target")) {
        if (
          val === null &&
          ["line", "sparkline", "step", "telemetry", "series-trend"].includes(
            kind,
          ) &&
          ["value", "secondary"].includes(ch)
        )
          continue;
        need(
          typeof val === "number" && Number.isFinite(val),
          `source.rows[${i}].${f}`,
          "expected finite number; missing values are not zero",
        );
        need(
          Math.abs(val) <= 1e12,
          `source.rows[${i}].${f}`,
          "number is out of bounds",
        );
      } else
        need(
          val !== undefined && String(val).length <= 300,
          `source.rows[${i}].${f}`,
          "missing or oversized label",
        );
    }
  const v = (r, k) => r[enc[k]];
  if (["range", "candlestick", "gantt", "boxplot"].includes(kind))
    for (const [i, r] of norm.entries()) {
      const order =
        kind === "range"
          ? ["low", "high"]
          : kind === "gantt"
            ? ["start", "end"]
            : kind === "boxplot"
              ? ["min", "q1", "median", "q3", "max"]
              : ["low", "open", "high"];
      for (let j = 1; j < order.length; j++)
        need(
          v(r, order[j - 1]) <= v(r, order[j]),
          `data[${i}]`,
          "bounds must be ordered",
        );
      if (kind === "candlestick")
        need(
          v(r, "close") >= v(r, "low") && v(r, "close") <= v(r, "high"),
          "data",
          "close must be inside low/high",
        );
    }
  if (
    [
      "bar",
      "donut",
      "pie",
      "treemap",
      "sunburst",
      "pyramid",
      "funnel",
      "sankey",
      "radial",
      "rings",
      "speed",
      "arc",
      "status-gauge",
      "status-funnel",
      "bubble",
      "heatmap",
      "hourmap",
      "matrix",
      "contribution-skyline",
      "cohort",
      "polar",
      "radar",
      "grouped-bar",
      "stacked-bar",
      "stream",
    ].includes(kind)
  )
    for (const r of norm) {
      const key = kind === "bubble" ? "size" : "value";
      need(v(r, key) >= 0, "data", "this chart requires nonnegative values");
      if (enc.secondary)
        need(
          v(r, "secondary") >= 0,
          "data",
          "secondary values must be nonnegative",
        );
    }
  if (kind === "sankey") {
    const path = new Set(),
      done = new Set();
    const visit = (id) => {
      need(!path.has(id), "data", "Sankey cycle detected");
      if (done.has(id)) return;
      path.add(id);
      for (const row of norm.filter((r) => v(r, "source") === id))
        visit(v(row, "target"));
      path.delete(id);
      done.add(id);
    };
    norm.forEach((r) => visit(v(r, "source")));
  }
  if (enc.id) {
    const ids = norm.map((r) => String(v(r, "id")));
    need(new Set(ids).size === ids.length, "encoding.id", "duplicate node IDs");
    for (const r of norm)
      for (const id of enc.depends ? v(r, "depends") : [])
        need(ids.includes(id), "encoding.depends", "unknown dependency");
    const visiting = new Set(),
      done = new Set();
    function visit(id) {
      need(!visiting.has(id), "data", "cycle detected");
      if (done.has(id)) return;
      visiting.add(id);
      const row = norm.find((r) => String(v(r, "id")) === id);
      for (const d of enc.depends ? v(row, "depends") : []) visit(d);
      visiting.delete(id);
      done.add(id);
    }
    ids.forEach(visit);
  }
  if (["radial", "rings", "speed", "arc", "polar", "radar"].includes(kind))
    for (const r of norm)
      need(
        v(r, "value") <= (options.maximum ?? 100),
        "data",
        "value exceeds the chart maximum",
      );
  if (["dependency", "process", "flowchart", "state-diagram"].includes(kind))
    need(norm.length <= 20, "data", "node charts support at most20nodes");
  if (options.weights)
    for (const w of Object.values(options.weights))
      need(
        typeof w === "number" && w >= 0 && w <= 1,
        "options.weights",
        "weights must be between 0 and 1",
      );
  return {
    component: kind,
    title: input.title || input.component,
    subtitle: input.subtitle || "",
    insight: input.insight || "",
    rows: norm,
    encoding: enc,
    options,
    warnings,
    source: d.source,
    headers: source.headers,
    originalRows: rows,
  };
}
export const colorTokens = [
  "var(--fj-c1)",
  "var(--fj-c2)",
  "var(--fj-c3)",
  "var(--fj-c4)",
  "var(--fj-c5)",
];
export function chartGeometry(m) {
  const { rows: r, encoding: e, options: o, component: c } = m,
    v = (a, k) => a[e[k]],
    label = (a) =>
      String(v(a, "category") ?? v(a, "source") ?? v(a, "id") ?? ""),
    colors = o.colors || colorTokens;
  const marks = [],
    texts = [],
    lines = [],
    n = r.length,
    W = 600,
    H = 320,
    L = 72,
    R = 28,
    T = 28,
    B = 44,
    pw = W - L - R,
    ph = H - T - B;
  const defaultHighlight =
    c === "bar" && r.length
      ? String(
          r.reduce((a, b) => (v(a, "value") >= v(b, "value") ? a : b))[
            e.category
          ],
        )
      : null;
  const identity = [
    ...new Set(
      m.originalRows?.map((a) =>
        String(a[e.category] ?? a[e.source] ?? a[e.id] ?? ""),
      ) || [],
    ),
  ].sort();
  const categorical = [
    "donut",
    "pie",
    "treemap",
    "sunburst",
    "radar",
    "scatter",
    "bubble",
    "sankey",
    "pyramid",
    "funnel",
    "status-funnel",
  ].includes(c);
  const add = (type, attrs, i = 0) => {
    const entity =
      attrs.label ??
      String(r[i]?.[e.category] ?? r[i]?.[e.source] ?? r[i]?.[e.id] ?? "");
    const slot =
      categorical && identity.includes(entity) ? identity.indexOf(entity) : i;
    marks.push({
      type,
      ...attrs,
      color:
        attrs.semanticColor ??
        ((o.highlight ?? defaultHighlight)
          ? entity === (o.highlight ?? defaultHighlight)
            ? colors[0]
            : colors[1]
          : categorical
            ? colors[slot % colors.length]
            : colors[Math.min(i, 1)]),
      index: i,
    });
  };
  const text = (x, y, value, anchor = "middle") =>
    texts.push({
      x,
      y,
      value:
        String(value).length > 16
          ? String(value).slice(0, 14) + "…"
          : String(value),
      anchor,
    });
  let nums = r.flatMap((a) =>
    Object.entries(e)
      .filter(([k]) =>
        [
          "value",
          "secondary",
          "low",
          "high",
          "open",
          "close",
          "target",
          "start",
          "end",
          "min",
          "max",
          "q1",
          "q3",
          "median",
          "y",
        ].includes(k),
      )
      .map(([, f]) => a[f])
      .filter((x) => typeof x === "number"),
  );
  if (c === "waterfall") {
    let sum = 0;
    nums = [0, ...r.map((a) => (sum += v(a, "value")))];
  }
  if (c === "stacked-bar")
    nums = r.map((a) => v(a, "value") + v(a, "secondary"));
  const lo = o.domain?.[0] ?? Math.min(0, ...nums),
    hi = o.domain?.[1] ?? Math.max(1, ...nums) * 1.1,
    Y = (x) => T + ph - ((x - lo) / (hi - lo)) * ph,
    X = (i) => L + (pw * (i + 0.5)) / Math.max(1, n),
    step = pw / Math.max(1, n),
    cx = 300,
    cy = 150;
  const axis = () => {
    for (let i = 0; i <= 4; i++) {
      const val = lo + ((hi - lo) * i) / 4,
        y = Y(val);
      lines.push({ x1: L, x2: W - R, y1: y, y2: y });
      text(L - 8, y + 4, Number(val.toFixed(2)), "end");
    }
    r.forEach((a, i) => {
      if (n <= 20) text(X(i), H - 18, label(a));
    });
  };
  const path = (values, mode = "line") =>
    values
      .map((y, i) =>
        y === null
          ? ""
          : !i || values[i - 1] === null
            ? `M${X(i)},${Y(y)}`
            : mode === "step"
              ? `H${X(i)} V${Y(y)}`
              : o.curve === "smooth"
                ? `C${(X(i - 1) + X(i)) / 2},${Y(values[i - 1])} ${(X(i - 1) + X(i)) / 2},${Y(y)} ${X(i)},${Y(y)}`
                : `L${X(i)},${Y(y)}`,
      )
      .join(" ");
  const series = (key = "value") => r.map((a) => v(a, key));
  if (!n || o.state === "empty" || o.state === "loading")
    return { marks, texts, lines, width: W, height: H, domain: [lo, hi] };
  if (
    [
      "line",
      "area",
      "step",
      "sparkline",
      "telemetry",
      "hybrid",
      "combo",
      "series-trend",
      "stream",
      "range",
    ].includes(c)
  ) {
    if (c !== "stream") axis();
    const a = series(),
      b = e.secondary ? series("secondary") : [];
    if (c === "range") {
      const upper = series("high"),
        lower = series("low");
      add("path", {
        d:
          path(upper) +
          " " +
          lower
            .map((y, j) => `L${X(n - 1 - j)},${Y(lower[n - 1 - j])}`)
            .join(" ") +
          "Z",
        fill: true,
        opacity: 0.25,
      });
    } else if (c === "stream") {
      const aa = a.map((x) => x),
        bb = b.length ? b : a.map(() => 0),
        tot = aa.map((x, i) => x + bb[i]),
        scale = ph / Math.max(1, ...tot),
        lower = tot.map((x) => cy - (x * scale) / 2),
        mid = lower.map((x, i) => x + aa[i] * scale),
        upper = lower.map((x, i) => x + tot[i] * scale);
      const band = (low, up) =>
        up.map((y, i) => `${i ? "L" : "M"}${X(i)},${y}`).join(" ") +
        low.map((_, j) => `L${X(n - 1 - j)},${low[n - 1 - j]}`).join(" ") +
        "Z";
      add("path", { d: band(lower, mid), fill: true, opacity: 0.8 });
      add("path", { d: band(mid, upper), fill: true, opacity: 0.6 }, 1);
    } else {
      if (["area"].includes(c))
        add("path", {
          d: path(a) + ` L${X(n - 1)},${Y(0)} L${X(0)},${Y(0)}Z`,
          fill: true,
          opacity: 0.25,
        });
      if (["hybrid", "combo", "series-trend"].includes(c))
        a.forEach((z, i) =>
          z === null
            ? null
            : add(
                "rect",
                {
                  x: X(i) - step * 0.25,
                  y: Math.min(Y(z), Y(0)),
                  width: step * 0.5,
                  height: Math.abs(Y(z) - Y(0)),
                  opacity: 0.45,
                },
                i,
              ),
        );
      add(
        "path",
        { d: path(a, c === "step" ? "step" : "line"), fill: false },
        0,
      );
      if (b.length && o.showSecondary !== false) {
        const dual = c === "combo",
          bmax = Math.max(1, ...b) * 1.1;
        const d = dual
          ? b
              .map(
                (z, i) => `${i ? "L" : "M"}${X(i)},${T + ph - (z / bmax) * ph}`,
              )
              .join(" ")
          : path(b);
        add("path", { d, fill: false, dash: "7 4" }, 1);
        if (dual) {
          text(W - 4, T + 10, bmax.toFixed(1), "end");
          text(W - 4, T + ph, "0", "end");
        }
      }
      if (c === "series-trend") {
        const pts = a
          .map((z, i) => [i, z])
          .filter(
            ([, z], i) => Number.isFinite(z) && label(r[i]) !== o.currentPeriod,
          );
        if (pts.length >= 3) {
          const count = pts.length,
            sx = pts.reduce((s, p) => s + p[0], 0),
            sy = pts.reduce((s, p) => s + p[1], 0),
            sxx = pts.reduce((s, p) => s + p[0] ** 2, 0),
            sxy = pts.reduce((s, p) => s + p[0] * p[1], 0),
            slope = (count * sxy - sx * sy) / (count * sxx - sx * sx),
            intercept = (sy - slope * sx) / count;
          add(
            "path",
            {
              d: `M${X(pts[0][0])},${Y(intercept + slope * pts[0][0])} L${X(pts.at(-1)[0])},${Y(intercept + slope * pts.at(-1)[0])}`,
              fill: false,
              dash: "3 3",
            },
            2,
          );
        }
      }
    }
  } else if (
    [
      "bar",
      "grouped-bar",
      "stacked-bar",
      "waterfall",
      "bullet",
      "dumbbell",
      "candlestick",
      "boxplot",
      "gantt",
      "pyramid",
      "funnel",
      "status-funnel",
    ].includes(c)
  ) {
    if (
      !(c === "bar" && o.orientation === "row") &&
      !["gantt", "pyramid", "funnel", "status-funnel"].includes(c)
    )
      axis();
    let acc = 0;
    r.forEach((a, i) => {
      const z = v(a, "value"),
        bw = step * 0.6,
        x = X(i) - bw / 2;
      const rect = (low, high, offset = 0, width = bw, k = i) =>
        add(
          "rect",
          {
            x: x + offset,
            y: Math.min(Y(low), Y(high)),
            width,
            height: Math.abs(Y(high) - Y(low)),
            label: label(a),
          },
          k,
        );
      if (["bar", "grouped-bar", "stacked-bar"].includes(c)) {
        if (o.orientation === "row" && c === "bar") {
          const y = T + (i * ph) / n;
          add(
            "rect",
            {
              x: L,
              y,
              width: Math.max(0, ((z - lo) / (hi - lo)) * pw),
              height: (ph / n) * 0.65,
              label: label(a),
            },
            i,
          );
          text(L - 8, y + (ph / n) * 0.4, label(a), "end");
          text(
            L + ((z - lo) / (hi - lo)) * pw + 8,
            y + (ph / n) * 0.4,
            z,
            "start",
          );
        } else if (c === "grouped-bar" && e.secondary) {
          rect(0, z, 0, bw * 0.45);
          rect(0, v(a, "secondary"), bw * 0.55, bw * 0.45, i + 1);
        } else if (c === "stacked-bar" && e.secondary) {
          const total = z + v(a, "secondary"),
            maxTotal =
              Math.max(1, ...r.map((q) => v(q, "value") + v(q, "secondary"))) *
              1.1;
          add(
            "rect",
            {
              x,
              y: T + ph - (z / maxTotal) * ph,
              width: bw,
              height: (z / maxTotal) * ph,
            },
            0,
          );
          add(
            "rect",
            {
              x,
              y: T + ph - (total / maxTotal) * ph,
              width: bw,
              height: (v(a, "secondary") / maxTotal) * ph,
            },
            1,
          );
        } else rect(0, z);
      } else if (c === "waterfall") {
        const next = acc + z;
        const balances = r.map((_, j) =>
          r.slice(0, j + 1).reduce((s, q) => s + v(q, "value"), 0),
        );
        const min = Math.min(0, ...balances),
          max = Math.max(1, ...balances),
          sy = (q) => T + ph - ((q - min) / (max - min)) * ph;
        add(
          "rect",
          {
            x,
            y: Math.min(sy(acc), sy(next)),
            width: bw,
            height: Math.abs(sy(next) - sy(acc)),
            label: label(a),
          },
          z < 0 ? 2 : 0,
        );
        text(
          x + bw / 2,
          Math.min(sy(acc), sy(next)) - 5,
          `${z > 0 ? "+" : ""}${z}`,
        );
        acc = next;
      } else if (c === "candlestick") {
        add(
          "line",
          { x1: X(i), x2: X(i), y1: Y(v(a, "high")), y2: Y(v(a, "low")) },
          i,
        );
        rect(
          v(a, "open"),
          v(a, "close"),
          0,
          bw,
          v(a, "close") >= v(a, "open") ? 0 : 2,
        );
      } else if (c === "boxplot") {
        add(
          "line",
          { x1: X(i), x2: X(i), y1: Y(v(a, "min")), y2: Y(v(a, "max")) },
          i,
        );
        rect(v(a, "q1"), v(a, "q3"));
        add(
          "line",
          { x1: x, x2: x + bw, y1: Y(v(a, "median")), y2: Y(v(a, "median")) },
          i,
        );
      } else if (c === "dumbbell") {
        add(
          "line",
          {
            x1: X(i) - 8,
            x2: X(i) + 8,
            y1: Y(v(a, "start")),
            y2: Y(v(a, "end")),
          },
          i,
        );
        add("circle", { cx: X(i) - 8, cy: Y(v(a, "start")), r: 5 }, 0);
        add("circle", { cx: X(i) + 8, cy: Y(v(a, "end")), r: 5 }, 1);
      } else if (c === "bullet") {
        rect(0, z);
        add(
          "line",
          {
            x1: x - 4,
            x2: x + bw + 4,
            y1: Y(v(a, "target")),
            y2: Y(v(a, "target")),
          },
          2,
        );
      } else if (c === "gantt") {
        const all = r.flatMap((q) => [v(q, "start"), v(q, "end")]),
          start = Math.min(...all),
          span = Math.max(1, Math.max(...all) - start);
        add(
          "rect",
          {
            x: L + ((v(a, "start") - start) / span) * pw,
            y: T + (i * ph) / n,
            width: ((v(a, "end") - v(a, "start")) / span) * pw,
            height: (ph / n) * 0.65,
            label: label(a),
          },
          i,
        );
        text(L - 8, T + ((i + 0.4) * ph) / n, label(a), "end");
      } else {
        const max = Math.max(1, ...r.map((q) => v(q, "value"))),
          width = (z / max) * pw;
        add(
          "rect",
          {
            x: c === "pyramid" ? cx - width / 2 : L,
            y: T + (i * ph) / n,
            width,
            height: (ph / n) * 0.65,
            label: label(a),
          },
          i,
        );
        text(cx, T + ((i + 0.4) * ph) / n, `${label(a)}: ${z}`);
      }
    });
  } else if (
    [
      "pie",
      "donut",
      "sunburst",
      "polar",
      "radar",
      "radial",
      "rings",
      "speed",
      "arc",
      "status-gauge",
    ].includes(c)
  ) {
    const total = r.reduce((s, a) => s + v(a, "value"), 0),
      max = o.maximum ?? 100,
      R = 108;
    if (c === "sunburst") {
      const groups = [...new Set(r.map((a) => v(a, "category")))],
        sum = total;
      let start = -Math.PI / 2;
      const arc = (inner, outer, a, b) => {
        const pt = (rr, ang) =>
            `${cx + Math.cos(ang) * rr},${cy + Math.sin(ang) * rr}`,
          angle = Math.min(b - a, Math.PI * 2 - 0.00001),
          end = a + angle;
        return `M${pt(outer, a)} A${outer},${outer} 0 ${angle > Math.PI ? 1 : 0} 1 ${pt(outer, end)} L${pt(inner, end)} A${inner},${inner} 0 ${angle > Math.PI ? 1 : 0} 0 ${pt(inner, a)}Z`;
      };
      groups.forEach((group, gi) => {
        const children = r.filter((a) => v(a, "category") === group),
          value = children.reduce((s, a) => s + v(a, "value"), 0),
          end = start + (sum ? (value / sum) * Math.PI * 2 : 0);
        if (end > start)
          add(
            "path",
            {
              d: arc(24, 62, start, end),
              fill: true,
              label: group,
              readout: `${group}: ${value} total`,
            },
            gi,
          );
        let sub = start;
        children.forEach((a) => {
          const stop = sub + (sum ? (v(a, "value") / sum) * Math.PI * 2 : 0);
          if (stop > sub)
            add(
              "path",
              {
                d: arc(64, R, sub, stop),
                fill: true,
                label: String(v(a, "secondaryCategory") ?? group),
                readout: `${group} · ${v(a, "secondaryCategory") ?? group}: ${v(a, "value")}`,
              },
              r.indexOf(a),
            );
          sub = stop;
        });
        start = end;
      });
    } else if (c === "radar") {
      for (const z of [0.25, 0.5, 0.75, 1])
        add("circle", { cx, cy, r: R * z, outline: true }, 1);
      const point = (z, i) => [
        cx + (Math.cos(-Math.PI / 2 + (2 * Math.PI * i) / n) * R * z) / max,
        cy + (Math.sin(-Math.PI / 2 + (2 * Math.PI * i) / n) * R * z) / max,
      ];
      add("polygon", {
        points: r.map((a, i) => point(v(a, "value"), i).join(",")).join(" "),
        opacity: 0.3,
      });
      r.forEach((a, i) => {
        const [x, y] = point(max * 1.18, i);
        text(x, y, label(a));
      });
    } else if (
      ["rings", "radial", "speed", "arc", "status-gauge"].includes(c)
    ) {
      const rr = ["speed", "arc", "status-gauge"].includes(c) ? [r[0]] : r;
      rr.forEach((a, i) => {
        const radius = R - i * (R / Math.max(rr.length, 2)),
          half = ["speed", "arc", "status-gauge"].includes(c),
          val =
            c === "status-gauge"
              ? (r.reduce(
                  (s, q) => s + v(q, "value") * (o.weights?.[label(q)] ?? 0),
                  0,
                ) /
                  Math.max(1, total)) *
                100
              : v(a, "value"),
          fraction = val / max,
          ang = half ? Math.PI : Math.PI * 2,
          start = half ? Math.PI : -Math.PI / 2,
          arc = (f) => {
            const end = start + ang * Math.min(0.999999, f);
            return `M${cx + Math.cos(start) * radius},${cy + Math.sin(start) * radius} A${radius},${radius} 0 ${ang * f > Math.PI ? 1 : 0} 1 ${cx + Math.cos(end) * radius},${cy + Math.sin(end) * radius}`;
          };
        add(
          "path",
          { d: arc(1), fill: false, strokeWidth: 12, opacity: 0.15 },
          i,
        );
        add(
          "path",
          {
            d: arc(fraction),
            fill: false,
            strokeWidth: 12,
            readout:
              c === "status-gauge"
                ? `Weighted progress ${Number(val.toFixed(2))}% from ${total} cards`
                : undefined,
          },
          i,
        );
        text(
          cx,
          half ? cy - 20 : cy + i * 18,
          `${c === "status-gauge" ? "Progress" : label(a)} ${Number(val.toFixed(2))}/${max}`,
        );
      });
    } else {
      let cursor = -Math.PI / 2;
      r.forEach((a, i) => {
        const val = v(a, "value"),
          angle =
            c === "polar"
              ? (2 * Math.PI) / n
              : total
                ? (val / total) * Math.PI * 2
                : 0;
        if (!angle) return;
        const radius =
          c === "polar"
            ? R *
              (o.polarEncoding === "area" ? Math.sqrt(val / max) : val / max)
            : R;
        const end = cursor + Math.min(angle, Math.PI * 2 - 0.00001),
          p = (rr, ang) =>
            `${cx + Math.cos(ang) * rr},${cy + Math.sin(ang) * rr}`,
          inner =
            c === "donut"
              ? R * (o.innerRadius ?? 0.58)
              : c === "sunburst" && e.parent && v(a, "parent")
                ? R * 0.5
                : 0;
        const d = inner
          ? `M${p(radius, cursor)} A${radius},${radius} 0 ${angle > Math.PI ? 1 : 0} 1 ${p(radius, end)} L${p(inner, end)} A${inner},${inner} 0 ${angle > Math.PI ? 1 : 0} 0 ${p(inner, cursor)} Z`
          : `M${cx},${cy} L${p(radius, cursor)} A${radius},${radius} 0 ${angle > Math.PI ? 1 : 0} 1 ${p(radius, end)} Z`;
        add("path", { d, fill: true, label: label(a) }, i);
        cursor += angle;
      });
    }
  } else if (["scatter", "bubble"].includes(c)) {
    const xs = series("x"),
      ys = series("y"),
      xmin = Math.min(0, ...xs),
      xmax = Math.max(1, ...xs),
      ymin = Math.min(0, ...ys),
      ymax = Math.max(1, ...ys);
    for (let j = 0; j <= 4; j++) {
      const yy = T + ph - (j / 4) * ph;
      lines.push({ x1: L, x2: W - R, y1: yy, y2: yy });
      text(L - 8, yy + 4, (ymin + ((ymax - ymin) * j) / 4).toFixed(1), "end");
      text(
        L + (pw * j) / 4,
        H - 18,
        (xmin + ((xmax - xmin) * j) / 4).toFixed(1),
      );
    }
    r.forEach((a, i) =>
      add(
        "circle",
        {
          cx: L + ((v(a, "x") - xmin) / (xmax - xmin)) * pw,
          cy: T + ph - ((v(a, "y") - ymin) / (ymax - ymin)) * ph,
          r:
            c === "bubble"
              ? Math.sqrt(v(a, "size")) * (o.size ?? 2)
              : (o.size ?? 5),
        },
        i,
      ),
    );
  } else if (
    ["heatmap", "hourmap", "matrix", "cohort", "contribution-skyline"].includes(
      c,
    )
  ) {
    const xs = [...new Set(series("x"))],
      ys = [...new Set(series("y"))],
      max = Math.max(1, ...series()),
      cw = pw / xs.length,
      ch = ph / ys.length;
    r.forEach((a, i) => {
      const x = L + xs.indexOf(v(a, "x")) * cw,
        y = T + ys.indexOf(v(a, "y")) * ch,
        ratio = v(a, "value") / max;
      if (c === "matrix")
        add(
          "circle",
          {
            cx: x + cw / 2,
            cy: y + ch / 2,
            r: Math.max(1, Math.min(cw, ch) * 0.42 * ratio),
            opacity: 0.2 + 0.8 * ratio,
          },
          i,
        );
      else if (c === "contribution-skyline") {
        const h = ratio * 60;
        add(
          "path",
          {
            d: `M${x},${y + ch} l${cw * 0.7},${-ch * 0.25} v${-h} l${-cw * 0.7},${ch * 0.25}Z`,
            fill: true,
            opacity: 0.4 + 0.6 * ratio,
          },
          0,
        );
        add(
          "path",
          {
            d: `M${x + cw * 0.7},${y + ch - ch * 0.25} l${cw * 0.25},${-ch * 0.2} v${-h} l${-cw * 0.25},${ch * 0.2}Z`,
            fill: true,
            opacity: 0.55,
          },
          1,
        );
      } else
        add(
          "rect",
          {
            x,
            y,
            width: Math.max(1, cw - 2),
            height: Math.max(1, ch - 2),
            opacity: 0.15 + 0.85 * ratio,
          },
          0,
        );
    });
    xs.forEach((x, i) => text(L + (i + 0.5) * cw, H - 18, x));
    ys.forEach((y, i) => text(L - 8, T + (i + 0.6) * ch, y, "end"));
  } else if (c === "histogram") {
    const vals = series(),
      min = Math.min(...vals),
      max = Math.max(...vals),
      bins = o.bins ?? 6,
      width = (max - min || 1) / bins,
      counts = Array(bins).fill(0);
    vals.forEach(
      (x) => counts[Math.min(bins - 1, Math.floor((x - min) / width))]++,
    );
    const peak = Math.max(...counts, 1);
    counts.forEach((count, i) => {
      const x = L + (i * pw) / bins,
        h = (count / peak) * ph;
      add(
        "rect",
        {
          x,
          y: T + ph - h,
          width: pw / bins - 2,
          height: h,
          readout: `Bin ${min + i * width} to ${min + (i + 1) * width}${i === bins - 1 ? " (inclusive)" : " (upper exclusive)"}: ${count} observations`,
        },
        0,
      );
      text(x + pw / bins / 2, T + ph - h - 4, count);
      text(x + pw / bins / 2, H - 18, (min + i * width).toFixed(1));
    });
  } else if (c === "treemap") {
    const total = r.reduce((s, a) => s + v(a, "value"), 0);
    let x = L;
    r.forEach((a, i) => {
      const w = total ? (v(a, "value") / total) * pw : 0;
      add("rect", { x, y: T, width: w, height: ph }, i);
      if (w >= 65)
        text(x + w / 2, cy, `${label(a).slice(0, 8)} ${v(a, "value")}`);
      x += w;
    });
  } else if (c === "sankey") {
    const ids = [...new Set([...series("source"), ...series("target")])],
      levels = {},
      visiting = new Set();
    function level(id) {
      if (levels[id] !== undefined) return levels[id];
      if (visiting.has(id)) throw Error("Sankey cycles are not supported");
      visiting.add(id);
      const incoming = r.filter((a) => v(a, "target") === id);
      const result = incoming.length
        ? 1 + Math.max(...incoming.map((a) => level(v(a, "source"))))
        : 0;
      visiting.delete(id);
      return (levels[id] = result);
    }
    ids.forEach(level);
    const maxLevel = Math.max(1, ...Object.values(levels)),
      inflow = {},
      outflow = {},
      size = {},
      pos = {},
      sourceOffset = {},
      targetOffset = {};
    ids.forEach((id) => {
      inflow[id] = r
        .filter((a) => v(a, "target") === id)
        .reduce((s, a) => s + v(a, "value"), 0);
      outflow[id] = r
        .filter((a) => v(a, "source") === id)
        .reduce((s, a) => s + v(a, "value"), 0);
      size[id] = Math.max(inflow[id], outflow[id]);
      sourceOffset[id] = targetOffset[id] = 0;
    });
    const groups = Array.from({ length: maxLevel + 1 }, (_, i) =>
        ids.filter((id) => levels[id] === i),
      ),
      unit = Math.min(
        ...groups
          .filter((g) => g.length)
          .map(
            (g) =>
              (ph - 16 * (g.length - 1)) /
              Math.max(
                1,
                g.reduce((s, id) => s + size[id], 0),
              ),
          ),
      );
    groups.forEach((g, level) => {
      let y = T;
      g.forEach((id) => {
        const x = L + (level / maxLevel) * (pw - 18);
        pos[id] = [x, y];
        add(
          "rect",
          {
            x,
            y,
            width: 18,
            height: size[id] * unit,
            label: id,
            readout: `${id}: incoming ${inflow[id]}, outgoing ${outflow[id]}`,
          },
          ids.indexOf(id),
        );
        text(x + 9, y - 6, id);
        y += size[id] * unit + 16;
      });
    });
    r.forEach((a, i) => {
      const source = v(a, "source"),
        target = v(a, "target"),
        [sx, sy] = pos[source],
        [tx, ty] = pos[target],
        x1 = sx + 18,
        x2 = tx,
        h = v(a, "value") * unit,
        y1 = sy + sourceOffset[source],
        y2 = ty + targetOffset[target],
        mx = (x1 + x2) / 2;
      sourceOffset[source] += h;
      targetOffset[target] += h;
      add(
        "path",
        {
          d: `M${x1},${y1} C${mx},${y1} ${mx},${y2} ${x2},${y2} L${x2},${y2 + h} C${mx},${y2 + h} ${mx},${y1 + h} ${x1},${y1 + h}Z`,
          fill: true,
          opacity: 0.5,
          label: source,
        },
        i,
      );
    });
  } else if (
    ["dependency", "process", "flowchart", "state-diagram"].includes(c)
  ) {
    const levels = {};
    const level = (id) => {
      if (levels[id] !== undefined) return levels[id];
      const a = r.find((q) => String(v(q, "id")) === id),
        deps = e.depends ? v(a, "depends") : [];
      return (levels[id] = deps.length ? 1 + Math.max(...deps.map(level)) : 0);
    };
    r.forEach((a) => level(String(v(a, "id"))));
    const max = Math.max(1, ...Object.values(levels)),
      positions = {};
    r.forEach(
      (a, i) =>
        (positions[v(a, "id")] = [
          L + (levels[v(a, "id")] / max) * (pw - 90),
          T + i * (ph / Math.max(n, 1)),
        ]),
    );
    r.forEach((a, i) => {
      const [x, y] = positions[v(a, "id")];
      for (const d of e.depends ? v(a, "depends") : []) {
        const [sx, sy] = positions[d];
        add(
          "path",
          {
            d: `M${sx + 90},${sy + 16} C${(sx + x) / 2 + 45},${sy + 16} ${(sx + x) / 2 + 45},${y + 16} ${x},${y + 16}`,
            fill: false,
          },
          1,
        );
      }
      add(
        "rect",
        {
          x,
          y,
          width: 90,
          height: 32,
          rx: 7,
          label: label(a),
          semanticColor: e.status
            ? String(v(a, "status")).toLowerCase().includes("done")
              ? colors[0]
              : String(v(a, "status")).toLowerCase().includes("progress")
                ? colors[4]
                : colors[1]
            : undefined,
        },
        i,
      );
      text(x + 45, y + 20, label(a));
    });
  } else if (c === "kpi") {
    text(cx, cy, `${label(r[0])}: ${v(r[0], "value")} ${o.unit ?? ""}`);
  }
  return { marks, texts, lines, width: W, height: H, domain: [lo, hi] };
}

export function advanceNode(spec, sources, id) {
  const model = resolveSpec(spec, sources);
  need(
    ["dependency", "process"].includes(model.component),
    "component",
    "node actions require a dependency/process chart",
  );
  need(
    spec.options?.interactive,
    "options.interactive",
    "actions are not enabled",
  );
  const registry = JSON.parse(JSON.stringify(sources)),
    source = registry[spec.data.source],
    enc = spec.encoding,
    idx = source.headers.indexOf(enc.id),
    deps = source.headers.indexOf(enc.depends),
    status = source.headers.indexOf(enc.status);
  need(status >= 0, "encoding.status", "actions require a status field");
  const row = source.rows.find((r) => r[idx] === id);
  need(row, "node", "unknown node ID");
  need(
    row[status] === "In progress",
    "node",
    "only in-progress nodes may complete",
  );
  row[status] = "Done";
  for (const candidate of source.rows) {
    if (candidate[status] !== "Waiting") continue;
    if (
      candidate[deps].every(
        (d) => source.rows.find((r) => r[idx] === d)?.[status] === "Done",
      )
    )
      candidate[status] = "In progress";
  }
  return registry;
}
