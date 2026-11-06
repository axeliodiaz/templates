const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const source=fs.readFileSync('public/lumen-template/tick-progress.js','utf8').replaceAll('export function','function');
const ctx=vm.createContext({});vm.runInContext(source+';this.model=tickProgressModel',ctx);
for(const [value,expected]of [[0,0],[31,31],[100,100],[-1,0],[130,100],[null,null],[NaN,null],[Infinity,null],[undefined,null]]){const m=ctx.model(value);assert.equal(m.percent,expected);assert.equal(m.fills.length,60);assert(m.fills.every(x=>x>=0&&x<=1));if(expected!==null)assert(Math.abs(m.fills.reduce((a,b)=>a+b,0)-expected*.6)<1e-9)}
assert(ctx.model(.23).fills[0]>0);assert.equal(ctx.model(1,1000).fills.length,120);console.log('tick progress model: boundaries, exact fractional fill and unavailable PASS');
