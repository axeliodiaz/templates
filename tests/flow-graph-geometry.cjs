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
const root = path.resolve(__dirname, '../.vitepress/theme/flow-graph')
const g = load(path.join(root, 'flow-graph.geometry.ts'))
const { sample } = load(path.join(root, 'flow-graph.sample.ts'))
const { DEFAULT_LABELS } = load(path.join(root, 'flow-graph.types.ts'))
const coder = sample.groups.find(x => x.id === 'coder')
test('sample header totals and details match the specification', () => {
  const totals = [[5,9,4], [6,9,6], [4,9,2], [4,9,5]]
  sample.groups.forEach((group, i) => {
    assert.deepEqual(Object.values(g.headerStats(group)), totals[i])
    assert.equal(group.nodes.filter(n => n.kind === 'agent').length, 1)
    for (const n of group.nodes.filter(n => n.kind !== 'agent' && n.calls > 0)) assert.equal(group.details[n.id].calls.length, n.calls)
  })
  assert.deepEqual(g.validateConfig(sample), [])
  assert.equal(sample.defaultGroupId, 'coder')
})
test('derived coder edges exclude denied tools and disable failed/idle traffic', () => {
  const edges = g.deriveEdges(coder); assert.equal(edges.length, 6)
  assert.ok(edges.every(e => !['github','slack','hubspot'].includes(e.from) && !['github','slack','hubspot'].includes(e.to)))
  assert.deepEqual(edges.find(e => e.from === 'terminal'), { from:'terminal', to:'agent-coder', status:'failed', animated:false })
  assert.equal(edges.find(e => e.to === 'web').animated, false)
  assert.equal(edges.filter(e => e.animated).length, 4)
  assert.equal(g.deriveEdges(sample.groups[2]).filter(e => e.animated).length, 0)
})
test('explicit denied or missing endpoints are discarded, explicit static edges respected', () => {
  assert.equal(g.deriveEdges({ ...coder, edges:[{from:'github',to:'agent-coder'},{from:'missing',to:'agent-coder'}] }).length, 0)
  assert.equal(g.deriveEdges({ ...coder, edges:[{from:'stripe',to:'agent-coder',animated:false}] })[0].animated, false)
  assert.equal(g.edgeDefaults({from:'stripe',to:'agent-coder',status:'failed',animated:true},coder).animated,false)
})
test('bezier and anchors use the exact right/left centers and one decimal', () => {
  assert.equal(g.bezier({x:0,y:0},{x:100,y:50}), 'M 0.0 0.0 C 50.0 0.0, 50.0 50.0, 100.0 50.0')
  assert.deepEqual(g.anchorOut({left:10,right:110,top:20,height:60}),{x:110,y:50})
  assert.deepEqual(g.anchorIn({left:10,right:110,top:20,height:60}),{x:10,y:50})
})
test('Spanish relation sentence is exact and all-denied/empty cases remain readable', () => {
  assert.equal(g.relationSentence(coder),'Coder usa: Terminal, Stripe, Figma, Database. Coder envía a: Web search, Notion. Sin acceso: GitHub, Slack, HubSpot.')
  assert.equal(g.relationSentence({...coder,nodes:coder.nodes.map(n => n.kind==='agent'?n:{...n,status:'no-access'})}),'Coder no tiene acceso a ninguna herramienta.')
  assert.match(g.relationSentence({...coder,nodes:coder.nodes.filter(n=>n.kind==='agent')}),/usa: ninguna/)
  assert.equal(DEFAULT_LABELS.calls(1), '1 llamada')
})
test('formatMs follows es-CL integer and decimal durations', () => {
  assert.equal(g.formatMs(730),'730 ms'); assert.equal(g.formatMs(1200),'1,2 s'); assert.equal(g.formatMs(10000),'10 s'); assert.equal(g.formatMs(0),'0 ms')
})
test('stable column ordering and access-first collapse do not mutate inputs', () => {
  const nodes=[{id:'a',status:'no-access',order:0},{id:'b',status:'active',order:2},{id:'c',status:'active',order:2}]
  assert.deepEqual(g.sortColumn(nodes).map(n=>n.id),['a','b','c'])
  assert.deepEqual(g.sortColumn(nodes,true).map(n=>n.id),['b','c','a']); assert.equal(nodes[0].id,'a')
})
test('validation detects zero/two agents, duplicate ids and missing edge endpoints', () => {
  const agent=coder.nodes.find(n=>n.kind==='agent')
  for (const nodes of [[],[agent,{...agent,id:'other'}]]) assert.match(g.validateConfig({groups:[{...coder,nodes}]})[0],/exactly one agent/)
  assert.match(g.validateConfig({groups:[{...coder,nodes:[...coder.nodes,{...agent}]}]}).join(' '),/duplicate node id/)
  assert.match(g.validateConfig({groups:[{...coder,edges:[{from:'missing',to:agent.id}]}]})[0],/unknown edge endpoint/)
})
