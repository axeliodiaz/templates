// TEM-367: rendered text and geometry across both workspaces and all Margin screens.
const {chromium}=require('playwright'),{spawn}=require('child_process'),fs=require('fs'),path=require('path'),assert=require('node:assert/strict');
function inspectText() {
  const bad = []
  function rgba(s) { const v = s.match(/[\d.]+/g)?.map(Number); return v?.length >= 3 ? [v[0], v[1], v[2], v[3] ?? 1] : null }
  function over(f, b) { const a = f[3] + b[3] * (1 - f[3]); return [0,1,2].map(i => (f[i]*f[3] + b[i]*b[3]*(1-f[3]))/a).concat(a) }
  function background(el) {
    const stack = []; for (let p = el; p; p = p.parentElement) { const c = rgba(getComputedStyle(p).backgroundColor); if(c) stack.push(c); if(c?.[3] === 1) break }
    return stack.reverse().reduce((b,c)=>over(c,b), [255,255,255,1])
  }
  function lum(c) { return c.slice(0,3).map(x => x/255).map(x => x<=.04045 ? x/12.92 : ((x+.055)/1.055)**2.4).reduce((s,x,i)=>s+x*[.2126,.7152,.0722][i],0) }
  for (const root of document.querySelectorAll(window.testRoot)) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT)
  let n
  while ((n = walker.nextNode())) {
    const text = n.textContent.replace(/\s+/g,' ').trim(), el = n.parentElement
    if (!text || !el || ['SCRIPT','STYLE','OPTION'].includes(el.tagName)) continue
    const cs = getComputedStyle(el)
    if (!el.getClientRects().length || cs.visibility !== 'visible') continue
    let hidden = false
    for(let p=el;p;p=p.parentElement) { const s = getComputedStyle(p); if(s.display==='none'||s.visibility==='hidden'||Number(s.opacity)===0) hidden=true }
    if(hidden) continue
    const bg = background(el), ink = rgba(cs.webkitTextFillColor) || rgba(cs.color)
    if(!ink) { bad.push({text,reason:'unparsed ink'}); continue }
    const fg = over(ink,bg), l1=lum(fg),l2=lum(bg),ratio=(Math.max(l1,l2)+.05)/(Math.min(l1,l2)+.05)
    const px=parseFloat(cs.fontSize);if(px<11||(px<12&&(cs.textTransform!=='uppercase'&&text!==text.toUpperCase()||parseFloat(cs.letterSpacing)<.1)))bad.push({text:text.slice(0,45),reason:'font below acceptance',px});const min=4.5
    if(ratio+.015<min)bad.push({text:text.slice(0,45),tag:el.tagName,cls:el.className,ratio:+ratio.toFixed(2),min,ink:cs.webkitTextFillColor,bg})
  }
  }
  return bad
}


;(async()=>{const root=path.resolve(__dirname,'..'),out=path.join(root,'.artifacts/reference-dashboards/tem-367');fs.mkdirSync(out,{recursive:true});let browser;const server=spawn(path.join(root,'node_modules/.bin/vitepress'),['dev',root,'--port','4347'],{stdio:'ignore'});try{
let ready=false;for(let i=0;i<150;i++){try{if((await fetch('http://localhost:4347/projects')).ok){ready=true;break}}catch{}await new Promise(r=>setTimeout(r,100))}assert.ok(ready);
browser=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});const failures=[];
for(const width of (process.env.WIDTHS||'320,375,768,1024,1280,1440').split(',').map(Number))for(const theme of (process.env.THEMES||'dark,light,felix-light,felix-dark').split(',')){
const ctx=await browser.newContext({viewport:{width,height:1100},reducedMotion:'reduce'}),page=await ctx.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
for(const route of ['margin-analytics','projects']){
await page.goto('http://localhost:4347/'+route,{waitUntil:'networkidle'});if((await page.locator('html').evaluate(e=>e.classList.contains('lu-light')))!==theme.includes('light'))await page.locator('.lu-theme-toggle').click();
// Exercise supported embedded palette variants without changing stored site preference.
if(theme.startsWith('felix'))await page.evaluate(d=>{document.documentElement.classList.add('felix');document.documentElement.classList.toggle('felix-dark',d)},theme==='felix-dark');
await page.evaluate(r=>window.testRoot=r,route==='projects'?'.pw':'.margin');
async function check(state){const bad=await page.evaluate(inspectText);if(bad.length)failures.push({route,width,theme,state,bad});const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1);if(overflow)failures.push({route,width,theme,state,overflow:await page.evaluate(()=>Array.from(document.querySelectorAll('*')).filter(e=>e.getBoundingClientRect().right>innerWidth+1&&e.getClientRects().length).slice(-15).map(e=>({cls:e.className,w:e.getBoundingClientRect().width,right:e.getBoundingClientRect().right}))) });
const geometry=await page.evaluate(()=>{const bad=[];for(const e of document.querySelectorAll(window.testRoot+' *')){if(!e.getClientRects().length||getComputedStyle(e).visibility==='hidden'||e.closest('svg,.sr-only'))continue;const s=getComputedStyle(e);if(['hidden','clip'].includes(s.overflowX)&&e.scrollWidth>e.clientWidth+2&&e.textContent.trim())bad.push({cls:e.className,sw:e.scrollWidth,cw:e.clientWidth})}return bad});if(geometry.length)failures.push({route,width,theme,state,geometry});
const controls=page.locator(windowRoot(route)+' button:visible,'+windowRoot(route)+' select:visible,'+windowRoot(route)+' input:visible,'+windowRoot(route)+' summary:visible');for(const e of await controls.all()){if(await e.isDisabled())continue;if(await page.locator('dialog[open]').count()&&!await e.evaluate(e=>!!e.closest('dialog[open]')))continue;const info=await e.evaluate(e=>({cls:e.className,tab:e.tabIndex,w:e.getBoundingClientRect().width,h:e.getBoundingClientRect().height}));if(info.tab<0)continue;await e.focus();if(parseFloat(await e.evaluate(e=>getComputedStyle(e).outlineWidth))<2)failures.push({route,width,theme,state,focus:info});if(width<=600&&info.cls.split(' ')[0]!=='mg-dot'&&(info.w<39||info.h<39))failures.push({route,width,theme,state,touch:info})}
if([375,768,1280].includes(width)&&theme==='dark'){await page.evaluate(()=>{document.activeElement?.blur();document.querySelector(window.testRoot).querySelectorAll('*').forEach(e=>{if(e.scrollWidth>e.clientWidth)e.scrollLeft=0})});const css=await page.addStyleTag({content:'.VPNav,.VPLocalNav,.lu-theme-toggle{visibility:hidden!important}'});await page.locator(windowRoot(route)).first().screenshot({path:path.join(out,`${route}-${width}-${theme}-${state}.png`)});if(route==='projects')await page.locator('.pw').nth(1).screenshot({path:path.join(out,`studio-${width}-${theme}-${state}.png`)});await css.evaluate(e=>e.remove())}
}
function windowRoot(r){return r==='projects'?'.pw':'.margin'}
if(route==='margin-analytics'){
for(const name of ['Overview','Jobs','Leakage','Forecast','Customers','Job types','Technicians','Branches','Trends','Notifications','Settings','Help']){
if(width<=700)await page.locator('.mg-mobile-nav button').click();await page.locator('.mg-nav').filter({hasText:new RegExp(name)}).first().click();await check(name.replaceAll(' ','-'));if(name==='Forecast'){await page.locator('.mg-switch').first().click();assert.equal(await page.locator('.mg-switch input').first().isChecked(),false);await check('ScenarioChanged')}if(name==='Help'){await page.locator('.mg-faq summary').first().click();await check('HelpExpanded')}
if(name==='Jobs'){await page.locator('.mg-link').filter({hasText:'#5812'}).first().click();await check('JobDialog');await page.keyboard.press('Escape');assert.equal(await page.locator('dialog[open]').count(),0);await page.locator('.mg-link').filter({hasText:'#5812'}).first().click();await page.getByRole('button',{name:'Open profit bridge',exact:false}).click();await check('JobDetail');await page.getByRole('button',{name:'Full cost stack',exact:true}).click();await check('CostStack')}
}
}else{
for(const view of ['Board','List','Overview']){for(const workspace of await page.locator('.pw').all())await workspace.getByRole('tab',{name:view,exact:true}).click();await check(view)}
for(const workspace of await page.locator('.pw').all()){await workspace.getByRole('tab',{name:'Board',exact:true}).click();await workspace.locator('.pw-task').first().click()}await check('TaskDetail');
const first=page.locator('.pw').first();await first.getByRole('textbox',{name:'New task title'}).fill('Acceptance task');await first.getByRole('button',{name:'+ Add task',exact:true}).click();assert.ok((await first.innerText()).includes('Acceptance task'));await first.getByRole('searchbox').fill('zzzz-no-match');assert.ok((await first.innerText()).includes('No matching tasks'));await first.getByRole('searchbox').fill('');await check('CreatedTask');
}
assert.deepEqual(errors,[]);assert.equal(await page.evaluate(()=>document.querySelector(window.testRoot).getAnimations({subtree:true}).some(a=>a.playState==='running')),false);
}await ctx.close();fs.writeFileSync(path.join(out,'acceptance.json'),JSON.stringify(failures,null,2));console.log('checked',width,theme)}
fs.writeFileSync(path.join(out,'acceptance.json'),JSON.stringify(failures,null,2));assert.equal(failures.length,0,JSON.stringify(failures.slice(0,3)));console.log('PASS selected width/palette matrix: all Margin screens and both Project workspaces, rendered text contrast/fonts, contained geometry, focus/touch and local interactions');
}finally{if(browser)await browser.close();server.kill()}})().catch(e=>{console.error(e);process.exitCode=1})
