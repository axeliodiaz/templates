// TEM-366: rendered Pulse text, responsive geometry and local-only controls.
const { chromium } = require('playwright')
const { spawn } = require('node:child_process')
const path = require('node:path')
const fs = require('node:fs')
const assert = require('node:assert/strict')
const root = path.resolve(__dirname, '..')
const out = path.join(root, '.artifacts/reference-dashboards/tem-366')
fs.mkdirSync(out, { recursive: true })
async function ready(url) {
  const end = Date.now() + 20000
  while (Date.now() < end) {
    try { if ((await fetch(url)).ok) return } catch {}
    await new Promise(r => setTimeout(r, 100))
  }
  throw Error('Preview did not become ready')
}
// Runs in the document. Include offscreen content, but exclude actual hidden content.
function inspectText() {
  const root = document.querySelector('.pulseboard')
  const bad = []
  function rgba(s) { const v = s.match(/[\d.]+/g)?.map(Number); return v?.length >= 3 ? [v[0], v[1], v[2], v[3] ?? 1] : null }
  function over(f, b) { const a = f[3] + b[3] * (1 - f[3]); return [0,1,2].map(i => (f[i]*f[3] + b[i]*b[3]*(1-f[3]))/a).concat(a) }
  function background(el) {
    const stack = []; for (let p = el; p; p = p.parentElement) { const c = rgba(getComputedStyle(p).backgroundColor); if(c) stack.push(c); if(c?.[3] === 1) break }
    return stack.reverse().reduce((b,c)=>over(c,b), [255,255,255,1])
  }
  function lum(c) { return c.slice(0,3).map(x => x/255).map(x => x<=.04045 ? x/12.92 : ((x+.055)/1.055)**2.4).reduce((s,x,i)=>s+x*[.2126,.7152,.0722][i],0) }
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
    const px=parseFloat(cs.fontSize);if(px<11||(innerWidth<=700&&px<12&&text!==text.toUpperCase()))bad.push({text:text.slice(0,45),reason:'font below acceptance',px});const large=px>=24||(px>=18.66&&Number(cs.fontWeight)>=700),min=large?3:4.5
    if(ratio+.015<min)bad.push({text:text.slice(0,45),tag:el.tagName,cls:el.className,ratio:+ratio.toFixed(2),min,ink:cs.webkitTextFillColor,bg})
  }
  return bad
}
;(async()=>{
  const server=spawn(path.join(root,'node_modules/.bin/vitepress'),['preview',root,'--port','4343'],{stdio:'ignore'})
  let browser
  try {
    await ready('http://localhost:4343/pulse-projects')
    browser=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']})
    const failures=[]
    for (const width of [320,375,768,1024,1280,1440]) for(const colorScheme of ['light','dark']) {
      const context=await browser.newContext({viewport:{width,height:1000},reducedMotion:'reduce',colorScheme})
      const page=await context.newPage(),errors=[]
      page.on('pageerror',e=>errors.push(e.message))
      await page.goto('http://localhost:4343/pulse-projects',{waitUntil:'networkidle'})
      await page.locator('.pulseboard').waitFor()
      // The surrounding docs use the actual site theme control; dashboard keeps its light surfaces.
      await page.locator('.lu-theme-toggle').waitFor();if((await page.locator('html').evaluate(e=>e.classList.contains('lu-light')))!==(colorScheme==='light'))await page.locator('.lu-theme-toggle').click()
      const bad=await page.evaluate(inspectText)
      if(bad.length)failures.push({width,colorScheme,bad})
      assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false,'Document overflow '+width)
      const controls=page.locator('.pulseboard button:visible,.pulseboard select:visible,.pulseboard input:visible')
      for (const el of await controls.all()) {
        await el.focus()
        const c=await el.evaluate(e=>({outline:getComputedStyle(e).outlineWidth,box:{w:e.getBoundingClientRect().width,h:e.getBoundingClientRect().height}}))
        assert.ok(parseFloat(c.outline)>=2,'Missing focus outline')
        if(width<=700)assert.ok(c.box.w>=39&&c.box.h>=39,'Small touch target '+JSON.stringify(c.box))
      }
      if(width<=700)await page.selectOption('.pulse-mobile-nav select','Projects')
      await page.getByRole('textbox',{name:'Search Pulse projects'}).fill('Website')
      assert.equal(await page.locator('.pulse-projects tbody tr').count(),1)
      await page.getByRole('textbox',{name:'Search Pulse projects'}).fill('')
      await page.getByRole('button',{name:'New Project',exact:false}).click()
      await page.getByRole('textbox',{name:'Pulse demo title'}).fill('Acceptance sample')
      await page.getByRole('button',{name:'Save demo',exact:true}).click()
      assert.ok((await page.locator('.pulseboard').innerText()).includes('Acceptance sample'));const dialogStyles=await page.locator('.pulseboard dialog').evaluate(e=>({color:getComputedStyle(e).color,bg:getComputedStyle(e).backgroundColor}));assert.notEqual(dialogStyles.color,dialogStyles.bg)
      await page.getByRole('button',{name:'Invite Team',exact:false}).click()
      await page.keyboard.press('Escape')
      assert.equal(await page.locator('dialog[open]').count(),0)
      await page.getByRole('button',{name:'Details for Website Redesign',exact:true}).click()
      assert.equal(await page.locator('.pulse-detail').count(),1)
      assert.deepEqual(errors,[])
      assert.equal(await page.evaluate(()=>document.getAnimations().some(a=>a.playState==='running')),false)
      if([375,768,1280].includes(width)) {
        await page.locator('.pulseboard').scrollIntoViewIfNeeded()
        await page.screenshot({path:path.join(out,`pulse-${width}-${colorScheme}.png`),fullPage:true})
      }
      await context.close()
    }
    fs.writeFileSync(path.join(out,'contrast.json'),JSON.stringify(failures,null,2))
    if(failures.length)throw Error('Pulse rendered text/font failures: '+JSON.stringify(failures.slice(0,1)))
    console.log('PASS Pulse rendered text contrast/fonts, 6 widths/2 site themes, focus, touch, overflow, local create/search/detail/dialog/reduced motion')
  } finally { if(browser)await browser.close();server.kill() }
})().catch(e=>{console.error(e);process.exitCode=1})
