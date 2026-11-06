const test = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs'), path = require('node:path'), vm = require('node:vm')
// Use the already-installed esbuild to execute the actual TypeScript, without adding a dependency.
const { transformSync } = require('esbuild')
const cache = new Map()
function load(file) {
  if (cache.has(file)) return cache.get(file)
  const module = { exports: {} }; cache.set(file, module.exports)
  const code = transformSync(fs.readFileSync(file, 'utf8'), { loader: 'ts', format: 'cjs', target: 'node22', define: { 'import.meta.env.DEV': 'false' } }).code
  const localRequire = name => load(path.resolve(path.dirname(file), name + '.ts'))
  vm.runInThisContext(`(function(require,module,exports){${code}\n})`, { filename: file })(localRequire, module, module.exports)
  cache.set(file, module.exports); return module.exports
}
const root = path.resolve(__dirname,'../.vitepress/theme/contribution-skyline')
const g = load(path.join(root,'skyline.geometry.ts'))
const {AXES, DEFAULTS, SkylineInputError, validateCells, kindOf, domainMax, heightFor, frame, project, unproject, paintKey, layoutSkyline, pointsAttr, pickPitch, prismAt, silhouette}=g
const r2=v=>Math.round(v*100)/100
const fixtures=JSON.parse(fs.readFileSync(path.join(root,'skyline.fixtures.json'),'utf8'))
for(const[name,c]of Object.entries(fixtures.cases))test('canonical fixture: '+name,()=>{
 const l=layoutSkyline(c.input.cells,c.input.weeksCount,fixtures.pitch),e=c.expected
 for(const k of ['max','width','height','ox','oy'])assert.equal(l[k],e[k],k)
 assert.deepEqual(l.prisms.map(p=>[p.col,p.row]),e.paintOrder)
 assert.deepEqual(l.prisms.map(p=>p.h),e.heights)
 assert.deepEqual(l.prisms.map(p=>p.kind),e.kinds)
 if(e.polygons)assert.deepEqual(l.prisms.map(p=>({top:pointsAttr(p.top),left:p.left&&pointsAttr(p.left),front:p.front&&pointsAttr(p.front)})),e.polygons)
})
function grid(weeks, countFn, { startPad = 0, endPad = 0 } = {}) {
  const cells = []
  let i = 0
  for (let c = 0; c < weeks; c++) for (let r = 0; r < 7; r++) {
    const flat = c * 7 + r
    const pad = flat < startPad || flat >= weeks * 7 - endPad
    const day = 1 + flat
    const date = pad ? null : `2026-${String(1 + Math.floor((day - 1) / 28)).padStart(2, '0')}-${String(1 + ((day - 1) % 28)).padStart(2, '0')}`
    const count = pad ? 0 : countFn(i++)
    cells.push({ col: c, row: r, date, count: pad ? null : count, level: null })
  }
  return cells
}
const synth = (i) => (((i * 37 + 11) % 23) < 9 ? 0 : 1 + ((i * 13 + 5) % 17))

function buildFixtures() {
  const P = 12
  const cases = {
    'small-mixed': { weeks: 2, cells: grid(2, (i) => [0, 1, 2, 5, 10, 0, 3, 7, 0, 0, 4, 1, 9, 6][i]) },
    'outlier': { weeks: 2, cells: grid(2, (i) => (i === 5 ? 400 : i % 3)) },
    'all-zero': { weeks: 2, cells: grid(2, () => 0) },
    'unknown-mixed': { weeks: 2, cells: grid(2, (i) => ([2, 6].includes(i) ? null : i)) },
    'pads-partial-range': { weeks: 2, cells: grid(2, (i) => i + 1, { startPad: 3, endPad: 2 }) },
    'year-53-weeks-synthetic': { weeks: 53, cells: grid(53, synth, { startPad: 4, endPad: 3 }) },
  }
  const out = { cases: {} }
  for (const [name, { weeks, cells }] of Object.entries(cases)) {
    const L = layoutSkyline(cells, weeks, P)
    out.cases[name] = {
      input: { weeksCount: weeks, cells },
      expected: {
        max: L.max, width: L.width, height: L.height, ox: L.ox, oy: L.oy,
        paintOrder: L.prisms.map((p) => [p.col, p.row]),
        heights: L.prisms.map((p) => p.h),
        kinds: L.prisms.map((p) => p.kind),
        // Full polygons only for small cases
        polygons: weeks <= 2 ? L.prisms.map((p) => ({ top: pointsAttr(p.top), left: p.left && pointsAttr(p.left), front: p.front && pointsAttr(p.front) })) : undefined,
      },
    }
  }
  return out
}

// ---------- Invariants ----------
function runChecks() {
  const res = []
  const ok = (name, cond, detail = '') => res.push({ name, pass: !!cond, detail })
  const P = 12, hMax = 60, hMin = Math.max(2, 0.18 * P)
  ok('h(0)=0', heightFor(0, 10, P) === 0)
  ok('h(null)=null (unknown is not zero)', heightFor(null, 10, P) === null)
  ok('h(max)=hMax', heightFor(10, 10, P) === hMax)
  ok('max=0 ⇒ all flat', heightFor(0, 0, P) === 0)
  ok('h(1, max=400) = hMin (minimum visible)', heightFor(1, 400, P) === r2(hMin), `hMin=${hMin}`)
  ok('linear: h(5,10)=hMax/2', heightFor(5, 10, P) === hMax / 2)
  ok('monotonic nondecreasing', [...Array(401).keys()].every((n) => n === 0 || heightFor(n, 400, P) >= heightFor(n - 1, 400, P)))
  const fx = buildFixtures()
  for (const [name, c] of Object.entries(fx.cases)) {
    const L = layoutSkyline(c.input.cells, c.input.weeksCount, P)
    const keys = L.prisms.map((p) => p.key)
    ok(`${name}: nondecreasing paint order by key r+(W-1-c)`, keys.every((k, i) => i === 0 || k >= keys[i - 1]))
    ok(`${name}: pads are not drawn`, L.prisms.every((p) => p.date !== null))
    const allPts = L.prisms.flatMap((p) => [...p.top, ...(p.left || []), ...(p.front || [])])
    ok(`${name}: all points inside viewBox`, allPts.every(([x, y]) => x >= 0 && y >= 0 && x <= L.width && y <= L.height))
    ok(`${name}: zero/unknown without side faces`, L.prisms.every((p) => (p.kind === 'positive') === (p.left !== null)))
    // unproject(base center) = cell
    ok(`${name}: unproject(base center) = cell`, L.prisms.every((p) => { const [x, y] = project(p.col + 0.5, p.row + 0.5, 0, P, L); const u = unproject(x, y, P, L); return u.col === p.col && u.row === p.row }))
  }
  const big = layoutSkyline(fx.cases['year-53-weeks-synthetic'].input.cells, 53, P)
  ok('53 weeks @12px: expected width/height', big.width === r2(12 + 26.4 + (0.94 * 53 + 3.5) * 12 + 12) && big.height === r2(12 + 60 + 0.34 * 53 * 12 + 0.72 * 7 * 12 + 19.2 + 12), `width=${big.width} height=${big.height}`)
  let threw = false; try { validateCells([{ col: 0, row: 0, date: '2026-01-01', count: -1, level: null }], 1) } catch (e) { threw = e instanceof SkylineInputError }
  ok('negative count ⇒ SkylineInputError', threw)
  threw = false; try { validateCells([{ col: 0, row: 0, date: '2026-01-01', count: 1.5, level: null }], 1) } catch (e) { threw = e instanceof SkylineInputError }
  ok('noninteger count ⇒ SkylineInputError', threw)
  threw = false; try { validateCells([{ col: 0, row: 0, date: '2026-01-01', count: 1, level: null }, { col: 0, row: 0, date: '2026-01-02', count: 1, level: null }], 1) } catch (e) { threw = e instanceof SkylineInputError }
  ok('cell duplicate ⇒ SkylineInputError', threw)
  ok('pickPitch(691,53)=12', pickPitch(691, 53) === 12)
  ok('pickPitch(300,53)=8 (minimum requires scroll)', pickPitch(300, 53) === 8)
  ok('pickPitch(2000,53)=14 (maximum)', pickPitch(2000, 53) === 14)
  ok('frame(53, pickPitch(691,53)).width ≤ 691', frame(53, pickPitch(691, 53)).width <= 691)
  const sm = layoutSkyline(fx.cases['small-mixed'].input.cells, 2, P)
  ok('prismAt(t=1) = final layout', sm.prisms.every((p) => JSON.stringify(prismAt(p, 1, P, sm)) === JSON.stringify({ top: p.top, left: p.left, front: p.front })))
  ok('prismAt(t=0) = flat top without side faces', sm.prisms.every((p) => { const q = prismAt(p, 0, P, sm); return q.left === null && q.front === null }))
  // silhouette: convex and contains all prism vertices, including hidden vertex
  const inside = (poly, [x, y]) => { let s = 0; for (let i = 0; i < poly.length; i++) { const [ax, ay] = poly[i], [bx, by] = poly[(i + 1) % poly.length]; const cr = (bx - ax) * (y - ay) - (by - ay) * (x - ax); if (Math.abs(cr) < 1e-6) continue; if (s === 0) s = Math.sign(cr); else if (Math.sign(cr) !== s) return false } return true }
  const convex = (poly) => { let s = 0; for (let i = 0; i < poly.length; i++) { const [ax, ay] = poly[i], [bx, by] = poly[(i + 1) % poly.length], [cx, cy] = poly[(i + 2) % poly.length]; const cr = (bx - ax) * (cy - by) - (by - ay) * (cx - bx); if (Math.abs(cr) < 1e-9) continue; if (s === 0) s = Math.sign(cr); else if (Math.sign(cr) !== s) return false } return true }
  const bigP = big.prisms.filter((p) => p.kind === 'positive')
  ok('silhouette: convex hexagon for positive prisms', bigP.every((p) => { const s = silhouette(p, 1, P, big); return s.length === 6 && convex(s) }))
  ok('silhouette: contains all vertices including hidden vertex', bigP.every((p) => { const s = silhouette(p, 1, P, big); const g = DEFAULTS.gap / 2; const hidden = project(p.col + 1 - g, p.row + g, 0, P, big); return [...p.top, ...p.left, ...p.front, hidden].every((v) => inside(s, v)) }))
  ok('silhouette: zero/unknown equals top', big.prisms.filter((p) => p.kind !== 'positive').every((p) => JSON.stringify(silhouette(p, 1, P, big)) === JSON.stringify(p.top)))
  for (const S of [8, 12, 14]) { const f = frame(53, S); res.push({ name: `info: 53 weeks pitch ${S}px ⇒ ${f.width}×${f.height}px`, pass: true, detail: '' }) }
  return res
}


for(const result of runChecks())test(result.name,()=>assert.ok(result.pass,result.detail))
test('public exports, partial options and validation boundaries',()=>{
 for(const name of ['validateCells','kindOf','domainMax','heightFor','frame','project','unproject','paintKey','layoutSkyline','prismAt','pickPitch','silhouette','pointsAttr','SkylineInputError'])assert.equal(typeof g[name],'function',name)
 assert.equal(heightFor(10,10,12,{hMaxFactor:4}),48)
 const bad=[{col:0,row:7,date:'2026-01-01',count:0,level:0},{col:1,row:0,date:'2026-01-01',count:0,level:0},{col:0,row:0,date:'bad',count:0,level:0},{col:0,row:0,date:'2026-01-01',count:NaN,level:0}]
 for(const cell of bad)assert.throws(()=>validateCells([cell],1),SkylineInputError)
 assert.throws(()=>validateCells([], -1),SkylineInputError)
 assert.deepEqual(layoutSkyline([],0,12).prisms,[])
})
