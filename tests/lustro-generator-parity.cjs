const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),http=require('node:http'),{spawnSync}=require('node:child_process'),{chromium}=require('playwright');
const root=path.resolve(__dirname,'..'),file=path.join(root,'public/lustro-template/components-more.html');
(async()=>{
 const original=fs.readFileSync(file);assert.equal(spawnSync(process.execPath,['scripts/build-lustro-bs6-components.mjs','--check'],{cwd:root}).status,0);
 try{fs.appendFileSync(file,'\n<!-- synthetic drift -->');assert.notEqual(spawnSync(process.execPath,['scripts/build-lustro-bs6-components.mjs','--check'],{cwd:root}).status,0);}finally{fs.writeFileSync(file,original);}
 assert.equal(spawnSync(process.execPath,['scripts/build-lustro-bs6-components.mjs'],{cwd:root}).status,0);assert.deepEqual(fs.readFileSync(file),original);
 const server=http.createServer((req,res)=>{const p=path.resolve(root,'public','.'+new URL(req.url,'http://localhost').pathname);if(!p.startsWith(path.join(root,'public')+path.sep)||!fs.existsSync(p)){res.writeHead(404);return res.end();}res.setHeader('content-type',p.endsWith('.css')?'text/css':p.endsWith('.js')?'application/javascript':'text/html');fs.createReadStream(p).pipe(res)});await new Promise(r=>server.listen(0,'127.0.0.1',r));
 const browser=await chromium.launch({executablePath:process.env.CHROME_PATH||'/usr/bin/google-chrome',args:['--no-sandbox']});
 try{
  for(const width of [1440,390])for(const reducedMotion of ['reduce','no-preference']){
   const page=await browser.newPage({viewport:{width,height:900},reducedMotion}),errors=[];page.on('pageerror',e=>errors.push(e.message));
   await page.goto('http://127.0.0.1:'+server.address().port+'/lustro-template/components-more.html',{waitUntil:'networkidle'});
   await page.waitForFunction(()=>typeof ThemeReveal==='object');
   await page.getByRole('button',{name:'Light mode',exact:true}).click();await page.waitForFunction(()=>document.documentElement.dataset.bsTheme==='light');
   await page.getByRole('button',{name:'Open detail drawer',exact:true}).click();const drawer=page.locator('#detailDrawer');await drawer.waitFor({state:'visible'});if(reducedMotion==='no-preference'){await page.waitForFunction(()=>document.getElementById('detailDrawer').getAnimations().length>0);await drawer.evaluate(e=>Promise.all(e.getAnimations().map(a=>a.finished)));}
   await page.getByRole('button',{name:'Mark reviewed',exact:true}).click();await page.getByRole('status').filter({hasText:'marked reviewed locally'}).waitFor();
   await page.waitForFunction(()=>{const d=document.getElementById('detailDrawer');return d.getBoundingClientRect().right<=innerWidth+1&&d.getAnimations().every(a=>a.playState==='finished')});
   await page.screenshot({path:path.join(root,'.artifacts/tem331/drawer-'+width+'-'+reducedMotion+'.png')});
   assert.equal(await drawer.evaluate(e=>e.getBoundingClientRect().width<=innerWidth+1),true);await page.keyboard.press('Escape');await drawer.waitFor({state:'hidden'});assert.equal(await page.evaluate(()=>document.activeElement.hasAttribute('data-detail-drawer')),true);
   const links=await page.locator('link[href="/vendor/fontawesome/css/all.min.css"]').count();assert.equal(links,1);assert.deepEqual(errors,[]);await page.close();
  }
  console.log('PASS Lustro generator equality/drift rejection, drawer/review/Escape/focus return, theme toggle and Font Awesome at desktop/mobile and reduced motion');
 }finally{await browser.close();await new Promise(r=>server.close(r));}
})().catch(e=>{console.error(e);process.exitCode=1});
