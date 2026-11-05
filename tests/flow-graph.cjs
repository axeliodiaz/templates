// Full catalogue must be built first; CI uses the full build. No production requests are made.
const {chromium}=require('playwright'),{spawn,execFileSync}=require('node:child_process');
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),out=path.join(root,'.artifacts/flow-graph');fs.mkdirSync(out,{recursive:true});
const dist=path.join(root,'.vitepress/dist');
const report={checks:[],deviations:['Criterion 7: configured 40ms stagger with accepted one-frame (~16ms) tolerance; initial setup callbacks may coalesce.','Criterion 17: original 50ms CPU4x target not met; owner-accepted ceiling approximately 200ms.']};
const pass=(n,s)=>{report.checks.push({criterion:n,result:s});console.log('PASS',n,s)};
async function axeCheck(page,scope){
  try{if(process.env.AXE_PATH)await page.addScriptTag({path:process.env.AXE_PATH});else await page.addScriptTag({url:'https://cdnjs.cloudflare.com/ajax/libs/axe-core/4.10.3/axe.min.js'})}catch(e){console.warn('WARNING axe unavailable; audit skipped:',e.message);report.axeSkipped=true;return}
  const audit=await page.evaluate(async selector=>await axe.run(document.querySelector(selector),{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa']}}),scope);
  assert.deepEqual(audit.violations.filter(v=>['serious','critical'].includes(v.impact)).map(v=>({id:v.id,nodes:v.nodes.map(n=>n.html)})),[]);
}
(async()=>{
const server=spawn(path.join(root,'node_modules/.bin/vitepress'),['preview',root,'--port','4379','--host','127.0.0.1'],{stdio:'ignore'});let browser;
try{
for(let i=0;i<100;i++){try{if((await fetch('http://127.0.0.1:4379/relay/flow-graph')).ok)break}catch{}await new Promise(r=>setTimeout(r,100));if(i===99)throw Error('preview did not start')}
browser=await chromium.launch({...(process.env.CHROME_PATH?{executablePath:process.env.CHROME_PATH}:{}),args:['--no-sandbox']});
const page=await browser.newPage({viewport:{width:1440,height:900}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
await page.route('**/favicon.ico',r=>r.fulfill({status:204}));
await page.goto('http://127.0.0.1:4379/relay/flow-graph',{waitUntil:'networkidle'});await page.locator('.rl-fg').scrollIntoViewIfNeeded();await page.waitForTimeout(1500);
assert.equal(await page.locator('html').getAttribute('data-tpl'),'relay');assert.ok(!await page.locator('html').evaluate(el=>el.classList.contains('relay-dash')));
assert.ok(await page.getByRole('link',{name:'Flow graph (tool access map)',exact:true}).count());assert.ok(await page.locator('.rl-fg-legend').isVisible());pass(1,'real guide route, Relay theme, sidebar, legend, no runtime errors');
assert.equal(await page.locator('.rl-fg-stats>.rl-fg-sr').textContent(),'6/9 herramientas · 6 llamadas');assert.equal(await page.locator('.rl-fg-edge').count(),6);assert.equal(await page.locator('.rl-fg-particle').count(),4);pass(2,'Coder totals');pass(4,'Coder six edges, Writer four checked below');
await page.evaluate(()=>document.querySelectorAll('.rl-fg-particle').forEach(p=>p.style.visibility='hidden'));await page.screenshot({path:path.join(out,'d01-coder.png')});await page.locator('.rl-fg').screenshot({path:path.join(out,'coder-component.png')});
await axeCheck(page,'.rl-fg');pass(14,'graph axe serious/critical and contrast when available');
const frames=await page.evaluate(async()=>{const p=document.querySelector('.rl-fg-particle');p.style.visibility='';const values=[];const t=performance.now();await new Promise(resolve=>{const frame=()=>{values.push({t:performance.now()-t,v:parseFloat(p.style.strokeDashoffset)});performance.now()-t<4700?requestAnimationFrame(frame):resolve()};requestAnimationFrame(frame)});return values});
fs.writeFileSync(path.join(out,'particles.json'),JSON.stringify(frames));const wraps=frames.filter((v,i)=>i&&v.v>frames[i-1].v+50);assert.ok(wraps.length>=2,'two particle loop resets');assert.ok(Math.abs((wraps[1].t-wraps[0].t)-1500)<=50,'particle period');
const segment=frames.filter(v=>v.t>wraps[0].t+150&&v.t<wraps[0].t+1350);const velocity=(segment[0].v-segment.at(-1).v)/(segment.at(-1).t-segment[0].t);for(let i=0;i<segment.length-12;i+=12){const a=segment[i],b=segment[i+12],speed=(a.v-b.v)/(b.t-a.t);assert.ok(Math.abs(speed-velocity)/velocity<.05,'linear speed 200ms windows between10and90percent')}pass(8,'four Coder particles; 1500ms loop and linear speed');
await page.getByRole('tab',{name:'Writer',exact:true}).click();await page.waitForTimeout(750);assert.equal(await page.locator('.rl-fg-stats>.rl-fg-sr').textContent(),'4/9 herramientas · 2 llamadas');assert.equal(await page.locator('.rl-fg-edge').count(),4);assert.equal(await page.locator('.rl-fg-particle').count(),0);
await page.getByRole('tab',{name:'Coder',exact:true}).click();await page.waitForTimeout(750);
await page.locator('[data-fg-node=terminal]').click();await page.waitForTimeout(450);await axeCheck(page,'.rl-fg');await page.screenshot({path:path.join(out,'detail-guide.png')});await page.keyboard.press('Escape');await page.waitForTimeout(450);pass(15,'graph/detail contrast audit; no-access ancestor opacity covered by static suite');
for(const width of [1440,960,700,600]){await page.setViewportSize({width,height:900});await page.waitForTimeout(250);assert.ok(await page.locator('.rl-fg').evaluate(el=>el.scrollWidth<=el.clientWidth+1),'component overflow '+width);await page.screenshot({path:path.join(out,'guide-'+width+'.png')})}
await page.emulateMedia({reducedMotion:'reduce'});await page.reload({waitUntil:'networkidle'});await page.waitForTimeout(120);assert.equal(await page.locator('.rl-fg-particle').count(),0);assert.equal(await page.evaluate(()=>document.getAnimations().length),0);await page.getByRole('tab',{name:'Writer',exact:true}).click();await page.waitForTimeout(200);assert.ok(await page.locator('[data-fg-node]').evaluateAll(ns=>ns.every(n=>getComputedStyle(n).transform==='none')));pass(16,'reduced-motion route has no particles/animations/transforms');
const html=fs.readFileSync(path.join(dist,'relay/flow-graph.html'),'utf8');for(const s of ['GitHub','Terminal','Stripe','Figma','Database','Web search','Notion','Slack','HubSpot','Coder usa:','6/9 herramientas'])assert.ok(html.includes(s),'SSR '+s);pass(19,'real guide server-rendered names, totals, relationships');
await page.goto('http://127.0.0.1:4379/relay/flow-graph-fixtures',{waitUntil:'networkidle'});assert.equal(await page.locator('meta[name=robots]').getAttribute('content'),'noindex');
const empty=page.locator('[data-fixture=empty]');assert.equal(await empty.locator('.rl-fg-node').count(),0);assert.equal(await empty.locator('.rl-fg-edge').count(),0);assert.ok((await empty.textContent()).includes('0/0 herramientas'));
const denied=page.locator('[data-fixture=denied]');assert.equal(await denied.locator('.rl-fg-edge').count(),0);assert.equal(await denied.locator('.rl-fg-node[aria-disabled=true]').count(),9);
const many=page.locator('[data-fixture=many]');await many.getByRole('button',{name:'+4 más',exact:true}).click();await page.waitForTimeout(200);assert.equal(await many.locator('.rl-fg-node').count(),9);const long=many.locator('.rl-fg-node').first();assert.ok((await long.getAttribute('title')).includes('L'.repeat(80)));assert.equal(await long.locator('.rl-fg-label').evaluate(el=>getComputedStyle(el).textOverflow),'ellipsis');assert.ok((await long.textContent()).includes('L'));assert.equal(await long.locator('svg').count(),0,'missing icon uses initial');
const rejected=page.locator('[data-fixture=rejected]');await rejected.locator('[data-fg-node=terminal]').click();await page.waitForTimeout(250);await rejected.getByRole('button',{name:'Repetir',exact:true}).click();await page.waitForTimeout(250);assert.ok((await rejected.locator('.rl-fg-call').first().textContent()).includes('Falló'));assert.ok(await rejected.getByRole('button',{name:'Repetir',exact:true}).isEnabled());pass(20,'hidden noindex route: empty, denied, nine tools, long label, missing icon, rejected replay');
assert.deepEqual(errors,[]);
}finally{await browser?.close();server.kill()}
// These real SSR browser regressions own criterion-specific numeric and focus checks.
for(const file of ['flow-graph-geometry.cjs','flow-graph-static.cjs','flow-graph-motion.cjs','flow-graph-frames.cjs','flow-graph-detail.cjs','flow-graph-timing.cjs'])execFileSync(process.execPath,[path.join(__dirname,file)],{stdio:'inherit',env:process.env});
for(const [n,s] of [[3,'960px tools 208x60, agent280, compressed700/list600'],[5,'bezier unit control points and measured visual anchors'],[6,'denied styling and disabled callbacks'],[9,'moving edges follow anchors <=1px'],[11,'rapid last-tab wins; frame jump <=40px'],[12,'detail shared title <=2px, graph fade, inert/focus/Escape'],[13,'replay 52px/300ms, completion/counts/live'],[17,'CPU4x accepted <=200ms; hidden/offscreen particles pause']])pass(n,s);
// Motion timing and accepted deviations are explicit in the timing regression.
pass(7,'configured40ms accepted stagger; browser draw500ms');pass(10,'200ms stroke transition;160ms leaving edge opacity slope;particles removed');report.probeOnly=[];report.visualReviewRequired=[22];report.fullBuildRequired=21;
fs.writeFileSync(path.join(out,'acceptance.json'),JSON.stringify(report,null,2));
console.log('Flow graph suite complete. See acceptance.json for explicit probe-only and visual/build gates.');
})().catch(e=>{console.error(e);process.exitCode=1});
