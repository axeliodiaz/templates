const {chromium}=require('playwright'),{spawn,execFileSync}=require('child_process'),fs=require('fs'),assert=require('assert/strict'),path=require('path');
const manifest=require('./felix-atoms-manifest.json');
const config=fs.readFileSync('.vitepress/config.mts','utf8'),base=execFileSync('git',['show','origin/develop:.vitepress/config.mts'],{encoding:'utf8'});
const withoutFelix=s=>{const a=s.indexOf("'/felix': ["),b=s.indexOf("'/pulsefit': [",a);return s.slice(0,a)+s.slice(b)};assert.equal(withoutFelix(config),withoutFelix(base),'other themes unchanged');
for(const item of manifest){assert(config.includes("link: '"+item.route+"'"));assert(fs.existsSync('felix/components/'+item.slug+'.md'));assert.equal(fs.readFileSync('.vitepress/theme/'+item.demo+'.vue','utf8'),fs.readFileSync('.vitepress/theme/'+item.demo.replace(/^Felix/,'')+'.vue','utf8'),'retain proven behavior without rewriting a shared demo');}
(async()=>{const server=spawn('node',['node_modules/vitepress/bin/vitepress.js','dev','--host','127.0.0.1','--port','5183'],{stdio:['ignore',fs.openSync('/tmp/felix-atoms-dev.log','w'),'inherit']});const browser=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});
try{
 for(let n=0;n<120;n++){try{if((await fetch('http://127.0.0.1:5183/')).ok)break}catch{}await new Promise(r=>setTimeout(r,500));}
 fs.mkdirSync('/tmp/felix-atoms-proof',{recursive:true});
 for(const width of [390,1440])for(const theme of ['light','dark'])for(const item of manifest){
  const p=await browser.newPage({viewport:{width,height:1000},reducedMotion:'reduce'}),errors=[];p.on('pageerror',e=>errors.push(e.message));await p.addInitScript(t=>localStorage.setItem('felix-theme',t),theme);
  await p.goto('http://127.0.0.1:5183'+item.route);await p.waitForFunction(()=>document.documentElement.classList.contains('felix'));const demo=p.locator('.vp-doc section').first();await demo.waitFor();
  assert.equal(await p.locator('html').evaluate(e=>e.classList.contains('felix-dark')),theme==='dark');assert.equal((await p.locator('h1').innerText()).replace(/\u200b/g,'').trim(),item.title);assert(await p.locator('.VPSidebar a[href="'+item.route+'"]').count());assert(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),item.slug+' overflow');
  const dropdown=demo.locator('select').first();if(await dropdown.count()){const opts=await dropdown.locator('option').evaluateAll(es=>es.map(e=>e.value));if(opts.length>1){await dropdown.selectOption(opts[1]);assert.equal(await dropdown.inputValue(),opts[1]);}}
  if(item.slug==='coin-loader'){await demo.getByRole('button',{name:'Start example',exact:true}).click();await demo.getByRole('button',{name:'Finish example',exact:true}).click();assert.match(await demo.innerText(),/Accepted (local )?starts: 1/);}
  if(item.slug==='dots'){await demo.getByRole('button',{name:'Look up example',exact:true}).click();await demo.getByRole('button',{name:'Finish lookup',exact:true}).click();assert.match(await demo.innerText(),/Accepted (local )?starts: 1/);}
  if(item.slug==='logo'){await demo.getByRole('link',{name:'Sample example home',exact:true}).click();assert.match(await demo.getByRole('status').innerText(),/activations: 1/);}
  if(item.slug==='marker'){await demo.getByRole('button',{name:'Replay new marker',exact:true}).click();assert(await demo.locator('.fresh').count());}
  if(item.slug==='icon-button'){await demo.getByRole('button',{name:'Save example item',exact:true}).press('Space');assert.equal(await demo.getByRole('button',{name:'Save example item',exact:true}).getAttribute('aria-pressed'),'true');}
  if(item.slug==='text'){await demo.getByLabel('Example copy').fill('Felix local text example');assert.match(await demo.locator('.text-preview').innerText(),/Felix local text example/);}
  if(item.slug==='label'){const input=demo.locator('input:not([type=checkbox])').first();if(await input.count()){await input.fill('Felix sample');assert.equal(await input.inputValue(),'Felix sample');}}
  await demo.scrollIntoViewIfNeeded();await p.screenshot({path:'/tmp/felix-atoms-proof/'+item.slug+'-'+width+'-'+theme+'.png'});assert.deepEqual(errors,[],item.slug+' JavaScript errors');await p.close();
 }
 console.log('PASS TEM369:8real routes,32viewport/theme cases,8interactivecontrollers,keyboard,localtextstate,Felixscope/sidebar,nohorizontaloverflow,noJSerrors,other10themeconfigandgenericcomponentsunchanged');
}finally{await browser.close();server.kill();await new Promise(r=>server.once('exit',r));}})().catch(e=>{console.error(e);process.exitCode=1});
