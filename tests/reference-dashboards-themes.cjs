// TEM-365: exercise the real page-theme control, including persisted reloads.
const { chromium } = require('playwright')
const { spawn } = require('node:child_process')
const path = require('node:path')
const fs = require('node:fs')
const assert = require('node:assert/strict')
const root = path.resolve(__dirname, '..')
const out = path.join(root, '.artifacts/reference-dashboards/tem-365/themes')
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
  const root = document.querySelector('.reference-dashboard')
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
  const server=spawn(path.join(root,'node_modules/.bin/vitepress'),['preview',root,'--port','4342'],{stdio:'ignore'})
  let browser
  try {
    await ready('http://localhost:4342/spark/overview')
    browser=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']})
    const failures=[]
    for (const width of [320,375,768,1024,1280,1440]) for (const route of ['spark/overview','fixtrack']) {
      const context=await browser.newContext({viewport:{width,height:1000},reducedMotion:'reduce'})
      const page=await context.newPage()
      await page.goto('http://localhost:4342/'+route,{waitUntil:'networkidle'})
      await page.locator('.tpl-theme-toggle').waitFor()
      for (let state=0;state<2;state++) {
        const dark=await page.locator('html').evaluate(e=>e.classList.contains('tpl-dark'))
        const theme=dark?'dark':'light'
        const bad=await page.evaluate(inspectText)
        if(bad.length) failures.push({route,width,theme,bad})
        if([375,768,1280].includes(width)) {
          await page.locator('.reference-dashboard').scrollIntoViewIfNeeded()
          await page.screenshot({path:path.join(out,`${route.replace('/','-')}-${width}-${theme}.png`),fullPage:true})
        }
        if(state===0) {
          await page.locator('.tpl-theme-toggle').click()
          await page.waitForFunction(d=>document.documentElement.classList.contains('tpl-dark')!==d,dark)
          await page.reload({waitUntil:'networkidle'})
          await page.locator('.tpl-theme-toggle').waitFor()
          assert.equal(await page.locator('html').evaluate(e=>e.classList.contains('tpl-dark')),!dark,'Theme did not persist')
        }
      }
      await context.close()
    }
    fs.writeFileSync(path.join(out,'contrast.json'),JSON.stringify(failures,null,2))
    if(failures.length) throw Error('Theme contrast failures: '+JSON.stringify(failures.slice(0,2)))
    console.log('PASS real theme toggle, persisted reload and rendered text contrast across both routes / 6 widths')
  } finally { if(browser)await browser.close();server.kill() }
})().catch(e=>{console.error(e);process.exitCode=1})
