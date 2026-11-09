import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import {
  resolveSpec,
  chartGeometry,
  validate,
} from "../.vitepress/theme/felix-chart-spec.mjs";
const db = JSON.parse(
    fs.readFileSync(
      new URL("../.vitepress/theme/felix-chart-examples.json", import.meta.url),
    ),
  ),
  clone = (x) => JSON.parse(JSON.stringify(x));
for (const [id, spec] of Object.entries(db.examples))
  test(`JSON fixture ${id} renders from its named source`, () => {
    const m = resolveSpec(spec, db.sources),
      g = chartGeometry(m);
    assert(g.marks.length + g.texts.length > 0);
    assert(!JSON.stringify(g).match(/NaN|Infinity/));
    assert.equal(m.rows.length, db.sources[spec.data.source].rows.length);
  });
test("bar example format has no required wrapper or inline values", () => {
  const s = {
    component: "bar",
    data: { source: "test" },
    encoding: { category: "name", value: "number" },
    options: { highlight: "A" },
  };
  assert.equal(
    resolveSpec(s, { test: { headers: ["name", "number"], rows: [["A", 30]] } })
      .rows[0].number,
    30,
  );
});
test("changed source numbers change chart marks", () => {
  for (const [id, spec] of Object.entries(db.examples)) {
    const a = resolveSpec(spec, db.sources),
      sources = clone(db.sources),
      source = sources[spec.data.source];
    let changed = false;
    source.rows = source.rows.map((r) =>
      r.map((v) => (typeof v === "number" ? ((changed = true), v * 1.1) : v)),
    );
    if (!changed) continue;
    try {
      const b = resolveSpec(spec, sources);
      assert.notDeepEqual(chartGeometry(a), chartGeometry(b), id);
    } catch (e) {
      if (/exceeds/.test(e.message)) continue;
      throw e;
    }
  }
});
test("stable sort/filter/limit do not mutate sources", () => {
  const sources = {
      test: {
        headers: ["name", "value"],
        rows: [
          ["B", 2],
          ["A", 2],
          ["C", 1],
        ],
      },
    },
    s = {
      component: "bar",
      data: {
        source: "test",
        filter: [{ field: "value", op: ">=", value: 2 }],
        sort: { field: "value", dir: "desc" },
        limit: 2,
      },
      encoding: { category: "name", value: "value" },
    };
  const before = clone(sources);
  assert.deepEqual(
    resolveSpec(s, sources).rows.map((r) => r.name),
    ["B", "A"],
  );
  assert.deepEqual(sources, before);
});
for (const [name, mutate, pattern] of [
  ["unknown component", (s) => (s.component = "eval"), /component/],
  [
    "unknown source",
    (s) => (s.data.source = "https://example.invalid"),
    /source/,
  ],
  ["unknown encoding", (s) => (s.encoding.value = "missing"), /encoding.value/],
  ["unknown field", (s) => (s.html = "<script>"), /unknown field/],
  ["unknown option", (s) => (s.options.color = "red"), /unknown field/],
  ["inline numbers", (s) => (s.data.values = [1, 2]), /unknown field/],
  ["bad sort", (s) => (s.data.sort = { field: "absent" }), /sort.field/],
  [
    "bad filter",
    (s) => (s.data.filter = [{ field: "Primary", op: "in", value: 1 }]),
    /requires an array/,
  ],
  ["bad limit", (s) => (s.data.limit = 0), /minimum/],
])
  test(`reject ${name}`, () => {
    const s = clone(db.examples.bar);
    mutate(s);
    assert.throws(() => resolveSpec(s, db.sources), pattern);
  });
test("zero is retained, nonfinite/negative magnitude values rejected", () => {
  const s = db.examples.bar,
    sources = clone(db.sources),
    src = sources[s.data.source];
  src.rows[0][1] = 0;
  assert.equal(resolveSpec(s, sources).rows[0].Primary, 0);
  src.rows[0][1] = Infinity;
  assert.throws(() => resolveSpec(s, sources), /finite/);
  src.rows[0][1] = -1;
  assert.throws(() => resolveSpec(s, sources), /nonnegative/);
});
test("line missing value is a real gap, never zero", () => {
  const s = db.examples.line,
    sources = clone(db.sources);
  sources[s.data.source].rows[2][1] = null;
  const m = resolveSpec(s, sources),
    d = chartGeometry(m).marks[0].d;
  assert.equal(m.rows[2].Primary, null);
  assert.equal(d.match(/M/g).length, 2);
});
test("candlestick bounds must enclose open and close", () => {
  const s = db.examples.candlestick,
    x = clone(db.sources);
  x[s.data.source].rows[0][4] = 100;
  assert.throws(() => resolveSpec(s, x), /close/);
});
test("box quantiles and interval bounds must be ordered", () => {
  for (const key of ["boxplot", "gantt", "range"]) {
    const s = db.examples[key],
      x = clone(db.sources);
    const a = x[s.data.source].rows[0];
    a[a.length - 1] = -100;
    assert.throws(() => resolveSpec(s, x), /bounds/);
  }
});
test("node cycles and missing dependency IDs are rejected", () => {
  const s = db.examples.dependency,
    x = clone(db.sources);
  x[s.data.source].rows[0][2] = ["finish"];
  assert.throws(() => resolveSpec(s, x), /cycle/);
  x[s.data.source].rows[0][2] = ["absent"];
  assert.throws(() => resolveSpec(s, x), /unknown dependency/);
});
test("Sankey cycles are rejected before drawing", () => {
  const s = db.examples.sankey,
    x = clone(db.sources);
  x[s.data.source].rows.push(["Buy", "Browse", 2]);
  assert.throws(() => resolveSpec(s, x), /cycle/);
});
test("area cumulative total derives from every source row", () => {
  const m = resolveSpec(db.examples.area, db.sources);
  assert.equal(
    m.rows.at(-1).__cumulative,
    db.sources[db.examples.area.data.source].rows.reduce((s, r) => s + r[1], 0),
  );
});
test("histogram total equals observation count", () => {
  const m = resolveSpec(db.examples.histogram, db.sources),
    g = chartGeometry(m);
  assert.equal(
    g.texts
      .filter((_, i) => i % 2 === 0)
      .reduce((s, t) => s + Number(t.value), 0),
    m.rows.length,
  );
});
test("all original catalog anchors are present; unrelated sources unchanged by work", () => {
  const s = fs.readFileSync(
    new URL("../felix/components/charts.md", import.meta.url),
    "utf8",
  );
  assert.equal((s.match(/id="mono-/g) || []).length, 38);
  assert.equal((s.match(/id="basic-/g) || []).length, 17);
});
