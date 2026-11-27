const {chromium}=require('playwright')
const {spawn}=require('node:child_process')
const assert=require('node:assert/strict')
const fs=require('node:fs'),path=require('node:path')
const root=path.resolve(__dirname,'..'),out=path.join(root,'.artifacts/agent-toasts'),port=4392
fs.mkdirSync(out,{recursive:true})
const own={felix:'.fx-theme-toggle',lumen:'.lmn-theme-toggle',scopecraft:'.sc-theme-toggle',pulsefit:'.pf-theme-toggle',pawprint:'.pp-theme-toggle',lustro:'.lu-theme-toggle'}
const local=['meadow','sentinel','brief']
async function press(p,name){await p.getByRole('button',{name,exact:true}).click()}
async function populate(p){await press(p,'Clear');for(const n of ['Session','Tests','PR','Deploy','Build','Context'])await press(p,n);await p.waitForTimeout(30)}
async function variant(p,item,dark){if(local.includes(item.theme)){const b=p.getByRole('button',{name:'Dark mode',exact:true});if((await b.getAttribute('aria-pressed')==='true')!==dark)await b.click()}else if(!item.variants.includes('only')){const b=p.locator(own[item.theme]||'.tpl-theme-toggle');assert.equal(await b.count(),1,item.name+' theme control');const target=dark?'dark':'light';if((await b.getAttribute('aria-label'))===`Switch to ${target} mode`)await b.click()}await p.waitForTimeout(20)}
function contrastScript(){
 const host=document.querySelector('.atoast'),el=document.createElement('span');host.append(el)
 const rgba=color=>{el.style.color=color;const c=getComputedStyle(el).color;const cv=document.createElement('canvas'),ctx=cv.getContext('2d');ctx.fillStyle=c;ctx.fillRect(0,0,1,1);return [...ctx.getImageData(0,0,1,1).data].slice(0,3)}
 const lum=rgb=>rgb.map(x=>x/255).map(x=>x<=.04045?x/12.92:((x+.055)/1.055)**2.4).reduce((a,v,i)=>a+v*[.2126,.7152,.0722][i],0)
 const pairs=[['Title','--at-ink','--at-paper',4.5],['Detail / close','--at-muted','--at-paper',4.5],['Action','--at-act-ink','--at-act-bg',4.5],['Focus','--at-focus','--at-paper',3],['Success graphic','--at-ok','--at-paper',3],['Danger graphic','--at-bad','--at-paper',3],['Info graphic','--at-info','--at-paper',3],['Warning graphic','--at-warn','--at-paper',3],['Positive diff','--at-plus','--at-paper',4.5],['Negative diff','--at-minus','--at-paper',4.5],['Pressed control','--at-paper','--at-ink',4.5]]
 const result=pairs.map(([name,a,b,min])=>{const aa=rgba(`var(${a})`),bb=rgba(`var(${b})`),la=lum(aa),lb=lum(bb);return {name,a,b,colors:[aa,bb],ratio:(Math.max(la,lb)+.05)/(Math.min(la,lb)+.05),min}});el.remove();return result
}
;(async()=>{let browser;const server=spawn(path.join(root,'node_modules/.bin/vitepress'),['preview',root,'--host','127.0.0.1','--port',String(port)],{stdio:'ignore'});try{
 for(let i=0;i<120;i++){try{if((await fetch(`http://127.0.0.1:${port}/agent-toasts`)).ok)break}catch{}await new Promise(r=>setTimeout(r,250));if(i===119)throw Error('Preview unavailable')}
 browser=await chromium.launch({executablePath:process.env.CHROME_PATH||'/usr/bin/google-chrome',args:['--no-sandbox']})
 const context=await browser.newContext(),page=await context.newPage();page.setDefaultTimeout(8000);const errors=[];page.on('pageerror',e=>errors.push(e.message))
 await page.setViewportSize({width:1720,height:1100});await page.goto(`http://127.0.0.1:${port}/agent-toasts`)
 await page.locator('.atoast').waitFor();assert.equal(await page.locator('.atoast__item').count(),0,'manual start only')
 await press(page,'Auto-hide');await press(page,'Play sequence');await page.waitForTimeout(3800);assert.equal(await page.locator('.atoast__item').count(),6)
 await press(page,'Clear');await page.waitForTimeout(1000);assert.equal(await page.locator('.atoast__item').count(),0,'Clear cancels scripts')
 await press(page,'Play sequence');await press(page,'Clear');await page.waitForTimeout(3800);assert.equal(await page.locator('.atoast__item').count(),0)
 const inventory=JSON.parse(fs.readFileSync(path.join(root,'.vitepress/theme/agent-toasts/inventory.json'))),rows=[]
 for(const item of inventory){
  await page.setViewportSize({width:1720,height:1100});await page.goto(`http://127.0.0.1:${port}${item.route}`);await page.locator('.atoast').waitFor();
  await page.addStyleTag({content:'.VPNav,.VPLocalNav{visibility:hidden!important}'})
  await press(page,'Auto-hide');await press(page,'Expanded')
  for(const dark of item.variants.includes('only')?[item.variants.includes('Dark')]:[false,true]){
   await variant(page,item,dark);await populate(page)
   const pairs=await page.evaluate(contrastScript);rows.push({name:item.name,variant:dark?'dark':'light',pairs})
   for(const width of [1720,390,320]){
    await page.setViewportSize({width,height:width<481?1000:1100})
    await page.evaluate(w=>document.documentElement.style.setProperty('font-size',w===320?'200%':'','important'),width)
    await page.locator('.atoast').scrollIntoViewIfNeeded()
    const metrics=await page.evaluate(()=>{const s=document.querySelector('.atoast__stage').getBoundingClientRect(),l=document.querySelector('.atoast__list'),r=l.getBoundingClientRect(),cards=[...document.querySelectorAll('.atoast__card')].map(c=>c.getBoundingClientRect());return {overflow:document.documentElement.scrollWidth>innerWidth+1,contained:r.top>=s.top&&r.bottom<=s.bottom,scrollable:l.scrollHeight>=l.clientHeight,cards:cards.map(c=>({w:c.width,h:c.height})),listStyle:getComputedStyle(l).listStyleType,titleMargin:getComputedStyle(document.querySelector('.atoast__title')).marginTop}})
    assert.equal(metrics.overflow,false,`${item.name} ${dark} ${width} overflow`);assert.ok(metrics.contained,`${item.name} ${dark} ${width} clipped viewport`);assert.equal(metrics.listStyle,'none');assert.equal(metrics.titleMargin,'0px');assert.equal(metrics.cards.length,6)
    await page.locator('.atoast__list').evaluate(el=>el.scrollTop=el.scrollHeight)
    const last=await page.locator('.atoast__item').last().boundingBox(),stage=await page.locator('.atoast__stage').boundingBox();assert.ok(last.y+last.height<=stage.y+stage.height,`${item.name} last card reachable`)
    await page.locator('.atoast__list').evaluate(el=>el.scrollTop=0)
    await page.locator('.atoast').screenshot({animations:'disabled',path:path.join(out,`${item.theme}-${dark?'dark':'light'}-${width}.png`)})
   }
   await page.evaluate(()=>document.documentElement.style.removeProperty('font-size'))
  }
  console.log('PASS layout',item.name)
 }
 fs.writeFileSync(path.join(out,'contrast.json'),JSON.stringify(rows,null,2));fs.writeFileSync(path.join(root,'.vitepress/theme/agent-toasts/verificacion/contrast.json'),JSON.stringify(rows,null,2))
 const md=['---','aside: false','---','# Agent toasts contrast verification','','Measured from computed browser colors on all adapter routes. Generated by `tests/agent-toasts.cjs` after building the site. Text minimum 4.5:1, meaningful graphics and focus minimum 3:1. Decorative muted cells are excluded.','']
 for(const row of rows){md.push(`## ${row.name}: ${row.variant}`,'','| Pair | Foreground / background RGB | Ratio | Minimum | Result |','| --- | --- | --- | --- | --- |');for(const p of row.pairs)md.push(`| ${p.name} | ${p.colors.map(c=>c.join(',')).join(' / ')} | ${p.ratio.toFixed(2)}:1 | ${p.min}:1 | ${p.ratio>=p.min?'OK':'FAIL'} |`);md.push('')}
 fs.writeFileSync(path.join(root,'agent-toasts-contrastes.md'),md.join('\n'));fs.writeFileSync(path.join(root,'.vitepress/theme/agent-toasts/verificacion/contrastes.md'),md.slice(3).join('\n'))
 const failures=rows.flatMap(r=>r.pairs.filter(p=>p.ratio<p.min).map(p=>`${r.name} ${r.variant}: ${p.name} ${p.ratio.toFixed(2)}`));console.log('Contrast failures:',failures);assert.deepEqual(errors,[]);assert.deepEqual(failures,[]);console.log(`PASS ${inventory.length} adapters, ${rows.length} variants, widths 1720/390/320, computed contrast`)
 // Escape must actually collapse, and keyboard dismissal must leave a useful focus target.
 await page.setViewportSize({width:1720,height:1100});await page.goto(`http://127.0.0.1:${port}/agent-toasts`);await press(page,'Auto-hide');await populate(page);await press(page,'Expanded');await page.locator('.atoast__close').first().focus();await page.keyboard.press('Enter');await page.waitForTimeout(100);assert.ok(await page.locator('.atoast__act:focus,.atoast__close:focus').count());await page.keyboard.press('Escape');await page.waitForTimeout(250);assert.ok(await page.locator('.atoast__list--deck').count())
 await press(page,'Clear');await press(page,'Deploy');await page.locator('.atoast__region').hover();await page.waitForTimeout(500);await page.getByRole('button',{name:'Retry',exact:true}).click();await page.waitForFunction(()=>document.querySelector('.atoast__title')?.textContent==='Deploying');await page.waitForFunction(()=>document.querySelector('.atoast__title')?.textContent==='Deploy live');console.log('PASS keyboard focus, Escape and retry')
 }finally{await browser?.close();server.kill()}})().catch(e=>{console.error(e);process.exitCode=1})
