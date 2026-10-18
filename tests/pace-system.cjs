const assert=require('node:assert/strict'),fs=require('node:fs')
const {chromium}=require('playwright')
const BASE=process.env.BASE_URL||'http://localhost:4173',OUT=process.env.SCREENSHOT_DIR||'/tmp/pace-shots'
fs.mkdirSync(OUT,{recursive:true})
const css=fs.readFileSync('.vitepress/theme/studio-systems.css','utf8')
const grab=sel=>{const m=css.match(new RegExp(sel.replace(/[.\\]/g,'\\$&')+'\\{([^}]*)\\}'));const o={};for(const [,k,v] of m[1].matchAll(/--sk-([a-z]+):(#[0-9a-f]{3,6})/g))o[k]=v.length===4?'#'+[...v.slice(1)].map(c=>c+c).join(''):v;return o}
const lum=h=>{const c=[1,3,5].map(i=>parseInt(h.slice(i,i+2),16)/255).map(v=>v<=.03928?v/12.92:((v+.055)/1.055)**2.4);return .2126*c[0]+.7152*c[1]+.0722*c[2]}
const cr=(a,b)=>{const[x,y]=[lum(a),lum(b)].sort((p,q)=>q-p);return(x+.05)/(y+.05)}
for(const [name,sel] of [['light','.studio-pace'],['dark','html.tpl-dark .studio-pace']]){
  const t=grab(sel)
  for(const [fg,bg] of [['ink','bg'],['ink','surface'],['muted','bg'],['muted','surface'],['on','accent'],['accent','bg'],['accent','surface'],['success','bg'],['warning','bg'],['danger','bg'],['info','bg'],['success','surface'],['warning','surface'],['danger','surface'],['info','surface']])
    assert.ok(cr(t[fg],t[bg])>=4.5,`${name} ${fg}/${bg} ${cr(t[fg],t[bg]).toFixed(2)}`)
}
console.log('contrast AA PASS (light+dark)')
const routes=['pace','pace/foundations','pace/tokens','pace/components','pace/charts','pace/layouts','pace/emails','pace/motion','fitness']
;(async()=>{
 const b=await chromium.launch();let n=0
 for(const [vw,vh,tag] of [[1280,900,'d'],[390,844,'m']]) for(const dark of [false,true]){
  const ctx=await b.newContext({viewport:{width:vw,height:vh},reducedMotion:'reduce'});
  await ctx.addInitScript(([d])=>{localStorage.setItem('tpl-theme-pace',d?'dark':'light')},[dark])
  const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>{if(m.type()==='error'&&!/fonts|favicon|net::/.test(m.text()))errs.push(m.text())})
  for(const r of routes){
   await p.goto(BASE+'/'+r,{waitUntil:'networkidle'});await p.waitForTimeout(300)
   const info=await p.evaluate(()=>({dark:document.documentElement.classList.contains('tpl-dark'),tpl:document.documentElement.dataset.tpl,over:document.documentElement.scrollWidth-document.documentElement.clientWidth,h1:document.querySelector('h1')?.textContent||''}))
   assert.equal(info.tpl,'pace',r+' data-tpl');assert.equal(info.dark,dark,r+' dark state');assert.ok(info.over<=2,`${r} ${tag} overflow ${info.over}`);assert.ok(info.h1.length>0,r+' h1')
   n++
  }
  assert.deepEqual(errs,[],'console errors '+errs.join('|'))
  // interactions
  await p.goto(BASE+'/pace/layouts',{waitUntil:'networkidle'})
  await p.getByRole('button',{name:'Book',exact:true}).first().click();assert.ok(await p.getByText('Booked locally').count(),'book toast')
  await p.getByRole('button',{name:'Cancel',exact:true}).first().click();assert.ok(await p.getByText('Booking canceled locally').count(),'cancel toast')
  await p.getByLabel('Status').selectOption('Full');assert.equal(await p.locator('.pace-admin tbody tr').count(),1,'filter')
  await p.goto(BASE+'/pace/emails',{waitUntil:'networkidle'});await p.getByRole('button',{name:'Payment receipt'}).click();assert.ok(await p.getByRole('heading',{name:'Payment received'}).count(),'email switch')
  await p.goto(BASE+'/pace/foundations',{waitUntil:'networkidle'});await p.getByPlaceholder('bike, clock…').fill('zzz');assert.ok(await p.getByText('No icon matches').count(),'icon empty')
  if(vw===1280||dark){for(const r of ['pace/layouts','pace/emails','pace/foundations','pace/components']){await p.goto(BASE+'/'+r,{waitUntil:'networkidle'});await p.waitForTimeout(250);await p.screenshot({path:`${OUT}/pace-${r.split('/')[1]}-${tag}-${dark?'dark':'light'}.png`})}}
  await ctx.close()
 }
 await b.close();console.log('pace routes/interactions PASS',n,'route checks')
})().catch(e=>{console.error(e);process.exit(1)})
