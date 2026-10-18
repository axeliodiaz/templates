const test=require('node:test')
const assert=require('node:assert/strict')
const fs=require('node:fs')
const vm=require('node:vm')
for(const [file,action,delay] of [['StudioCatalog.vue','loading',650],['StudioExtended.vue','run',600]]){
 test(file+' cancels async feedback on unmount and prevents duplicate runs',()=>{
  const source=fs.readFileSync('.vitepress/theme/'+file,'utf8')
  const start=source.indexOf('let '+(action==='loading'?'loadingTimer':'runTimer'))
  const end=source.indexOf('\n</script>',start)
  const code=source.slice(start,end).replace(/: ReturnType<typeof setTimeout> \| undefined/,'')
  let next=0;const pending=new Map(),cleanup=[]
  const busy={value:false},notice={value:''}
  const ctx={busy,notice,toast:s=>{notice.value=s},setTimeout:(fn,ms)=>{assert.equal(ms,delay);pending.set(++next,fn);return next},clearTimeout:id=>pending.delete(id),onBeforeUnmount:fn=>cleanup.push(fn)}
  vm.createContext(ctx);vm.runInContext(code,ctx)
  ctx[action]();ctx[action]();assert.equal(pending.size,1);cleanup.forEach(fn=>fn());assert.equal(pending.size,0);assert.equal(notice.value,'')
 })
 test(file+' completes normal local feedback',()=>{
  const source=fs.readFileSync('.vitepress/theme/'+file,'utf8');const name=action==='loading'?'loadingTimer':'runTimer';const code=source.slice(source.indexOf('let '+name),source.indexOf('\n</script>')).replace(/: ReturnType<typeof setTimeout> \| undefined/,'')
  let complete;const busy={value:false},notice={value:''};const ctx={busy,notice,toast:s=>{notice.value=s},setTimeout:fn=>{complete=fn;return 1},clearTimeout:()=>{},onBeforeUnmount:()=>{}}
  vm.createContext(ctx);vm.runInContext(code,ctx);ctx[action]();complete();assert.equal(busy.value,false);assert.ok(notice.value)
 })
}
