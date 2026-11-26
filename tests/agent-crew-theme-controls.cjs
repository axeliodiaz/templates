// TEM391: real template controls must be independent of global docs appearance.
const {chromium}=require('playwright')
const {spawn}=require('node:child_process')
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict')
const root=path.resolve(__dirname,'..'),out=path.join(root,'.artifacts/agent-crew-theme-controls')
fs.mkdirSync(out,{recursive:true})
const inventory=require('../.vitepress/theme/agent-crew/inventory.json')
const own={Felix:'.fx-theme-toggle',Lumen:'.lmn-theme-toggle',Scopecraft:'.sc-theme-toggle',PulseFit:'.pf-theme-toggle',Pawprint:'.pp-theme-toggle',Lustro:'.lu-theme-toggle'}
const local=['Meadow','Sentinel','Brief']
;(async()=>{
 const server=spawn(path.join(root,'node_modules/.bin/vitepress'),['preview',root,'--host','127.0.0.1','--port','4391'],{stdio:'ignore'})
 let browser
 try {
  for(let i=0;i<100;i++){try{if((await fetch('http://127.0.0.1:4391/agent-crew')).ok)break}catch{};await new Promise(r=>setTimeout(r,150))}
  browser=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']})
  const page=await browser.newPage({viewport:{width:1720,height:1100},reducedMotion:'reduce'})
  // Deliberately leave the docs' global mode dark while using each real template toggle.
  await page.addInitScript(()=>localStorage.setItem('vitepress-theme-appearance','dark'))
  const results=[]
  for(const item of inventory){
   if(process.env.CREW_NAMES&&!process.env.CREW_NAMES.split(',').includes(item.name))continue
   await page.goto('http://127.0.0.1:4391'+item.route,{waitUntil:'networkidle'})
   const host=page.locator('.crew');await host.waitFor()
   const variants=item.variants.includes('+')?['light','dark']:[item.variants.includes('Dark')?'dark':'light']
   const modes={}
   for(const mode of variants){
    if(local.includes(item.name)){
     const btn=host.getByRole('button',{name:mode==='dark'?'Dark mode':'Light mode',exact:true})
     if(await btn.count())await btn.click()
    }else if(variants.length===2){
     const btn=page.locator(own[item.name]||'.tpl-theme-toggle')
     await btn.waitFor()
     if(await btn.getAttribute('aria-label')===`Switch to ${mode} mode`)await btn.click()
     await page.waitForFunction(({selector,mode})=>document.querySelector(selector)?.getAttribute('aria-label')===`Switch to ${mode==='dark'?'light':'dark'} mode`,{selector:own[item.name]||'.tpl-theme-toggle',mode})
    }
    modes[mode]=await host.evaluate(el=>{
     const s=getComputedStyle(el),r=getComputedStyle(document.documentElement)
     const tokens={};for(const key of s)if(key.startsWith('--crew-'))tokens[key]=s.getPropertyValue(key).trim()
     return {htmlClass:document.documentElement.className,htmlTheme:document.documentElement.dataset.tpl,bg:s.backgroundColor,text:s.color,card:getComputedStyle(el.querySelector('.crew-card')).backgroundColor,hostBg:r.getPropertyValue('--vp-c-bg').trim(),tokens}
    })
    for(const width of [1720,390]){
     await page.setViewportSize({width,height:width===390?844:1100});await host.scrollIntoViewIfNeeded()
     assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),`${item.name} ${mode} overflow`)
     await host.screenshot({path:path.join(out,`${item.name.toLowerCase().replace(/\s+/g,'-')}-${mode}-${width}.png`)})
    }
   }
   results.push({name:item.name,modes})
  }
  fs.writeFileSync(path.join(out,'baseline.json'),JSON.stringify(results,null,2))
  const custom=['Meadow','Evertrue','Trial journey','Sentinel','Brief','Felix','Assay']
  for(const item of results.filter(x=>!custom.includes(x.name))){
   assert.equal(item.modes.dark.bg,'rgb(27, 27, 31)',`${item.name} must preserve existing dark surface`)
   assert.notEqual(item.modes.light.bg,'rgb(27, 27, 31)',`${item.name} must not inherit global dark surface`)
  }
  const failures=results.filter(x=>x.modes.light&&x.modes.dark&&x.modes.light.bg===x.modes.dark.bg).map(x=>x.name)
  console.log(JSON.stringify({count:results.length,lightModeFailures:failures}))
  if(!process.env.CREW_BASELINE)assert.deepEqual(failures,[],'actual template controls must change Crew palette independently of global dark')
 }finally{await browser?.close();server.kill()}
})().catch(e=>{console.error(e);process.exitCode=1})
