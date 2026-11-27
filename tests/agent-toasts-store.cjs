const {execFileSync}=require('node:child_process')
const {mkdirSync}=require('node:fs')
const assert=require('node:assert/strict')
const {test}=require('node:test')
mkdirSync('.artifacts',{recursive:true})
execFileSync('node_modules/.bin/esbuild',['.vitepress/theme/agent-toasts/toast.store.ts','--bundle','--platform=node','--format=cjs','--outfile=.artifacts/agent-toasts-store.cjs'])
const {createToastStore}=require('../.artifacts/agent-toasts-store.cjs')
const visual={type:'diff',added:1,removed:0}
const data=(id)=>({id,tone:'success',title:id,visual,duration:5000})
function clock(run){
 const old={now:Date.now,timeout:global.setTimeout,clear:global.clearTimeout,window:global.window}
 let now=100000,id=0;const jobs=new Map()
 Date.now=()=>now;global.window={};global.setTimeout=(fn,ms)=>{jobs.set(++id,{fn,at:now+ms});return id};global.clearTimeout=id=>jobs.delete(id)
 const tick=ms=>{const end=now+ms;for(;;){const next=[...jobs].sort((a,b)=>a[1].at-b[1].at)[0];if(!next||next[1].at>end)break;now=next[1].at;jobs.delete(next[0]);next[1].fn()}now=end}
 const store=createToastStore()
 try{run(store,tick,jobs)}finally{store.dispose();Date.now=old.now;global.setTimeout=old.timeout;global.clearTimeout=old.clear;global.window=old.window}
}
test('unrelated arrival does not reset an existing toast deadline',()=>clock((s,t)=>{s.push(data('a'));t(3000);s.push(data('b'));t(2001);assert.deepEqual(s.state.items.map(x=>x.data.id),['b']);t(3000);assert.equal(s.state.items.length,0)}))
test('pause freezes remaining time; final resume gives at least two seconds',()=>clock((s,t)=>{s.push(data('a'));t(4500);s.pause('hover');t(9000);assert.equal(s.state.items.length,1);s.resume('hover');t(1999);assert.equal(s.state.items.length,1);t(1);assert.equal(s.state.items.length,0)}))
test('all composed reasons must clear before clocks resume',()=>clock((s,t)=>{s.push(data('a'));s.pause('expanded');s.pause('hover');s.resume('hover');t(10000);assert.equal(s.state.items.length,1);s.resume('expanded');t(5000);assert.equal(s.state.items.length,0)}))
test('clear and Play replacement preserve control and visibility pause reasons',()=>clock((s,t)=>{for(const reason of ['autohide','expanded','hidden'])s.pause(reason);s.push(data('a'));s.clear();s.push(data('b'));t(30000);assert.equal(s.state.items.length,1);assert.equal(s.pauseReasons.size,3);s.resume('hidden');s.resume('expanded');t(30000);assert.equal(s.state.items.length,1);s.resume('autohide');t(5000);assert.equal(s.state.items.length,0)}))
test('same ID update resets only that item; busy to success starts timer',()=>clock((s,t)=>{s.push(data('a'));s.push({...data('b'),busy:true,duration:undefined});t(3000);s.update('b',data('b'));t(2001);assert.deepEqual(s.state.items.map(x=>x.data.id),['b']);t(2999);assert.equal(s.state.items.length,0)}))
test('dedupe refresh extends the matching deadline without duplicate entry',()=>clock((s,t)=>{const d={tone:'success',title:'dup',visual,duration:5000};s.push(d);t(1000);s.push(d);assert.equal(s.state.items.length,1);t(4001);assert.equal(s.state.items.length,1);t(999);assert.equal(s.state.items.length,0)}))
test('FIFO queue drains on dismiss and remains persistent',()=>clock((s,t,jobs)=>{for(let i=0;i<7;i++)s.push({...data(`q${i}`),duration:undefined,action:{id:'retry',label:'Retry'}});assert.equal(s.queueCount(),1);s.dismiss('q0');assert.equal(s.queueCount(),0);assert.deepEqual(s.state.items.map(x=>x.data.id),['q1','q2','q3','q4','q5','q6']);t(30000);assert.equal(s.state.items.length,6);s.dispose();assert.equal(jobs.size,0)}))

test('transient arrival waits when all six slots are persistent',()=>clock((s,t)=>{for(let i=0;i<6;i++)s.push({...data(`q${i}`),duration:undefined,action:{id:'retry',label:'Retry'}});s.push(data('transient'));assert.equal(s.state.items.length,6);assert.equal(s.queueCount(),1);s.dismiss('q0');assert.equal(s.state.items.length,6);assert.equal(s.queueCount(),0);t(5000);assert.equal(s.state.items.length,5)}))
