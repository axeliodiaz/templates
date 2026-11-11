export type Status='queued'|'running'|'paused'|'succeeded'|'failed'|'canceled'|'needs_input'
export type Kind='run'|'phase'|'agent'|'task'
export type Action='pause'|'resume'|'stop'|'retry'
export interface Node {id:string;kind:Kind;parent:string|null;label:string;status:Status;model:string|null;started:string|null;ended:string|null;duration:number|null;error?:string}
export interface Usage {id:string;subject:string;model:string|null;input:number|null;output:number|null;cache:number|null;cost:number|null;currency:'USD';basis:'exclusive'|'inclusive'}
export interface Event {id:string;ts:string;kind:'tool_call'|'handoff'|'approval'|'error'|'status_change'|'note';subject:string;summary:string}
export interface Run {id:string;label:string;created:string;started:string|null;ended:string|null;nodes:Node[];edges:{from:string;to:string;kind:'hierarchy'|'handoff'|'dependency'}[];usage:Usage[];events:Event[];capabilities:Record<Action,boolean>}
export interface Ack {state:'ack'|'error';message:string;status?:Status}
export const statusLabel:Record<Status,string>={queued:'Queued',running:'Running',paused:'Paused',succeeded:'Done',failed:'Failed',canceled:'Canceled',needs_input:'Needs you'}
export const stamp=(s:number)=>new Date(Date.UTC(2026,10,1,12,0,s)).toISOString()
export function fixture():Run {
 const n=(id:string,kind:Kind,parent:string|null,label:string,status:Status,start:number|null,duration:number|null,model:string|null=null):Node=>({id,kind,parent,label,status,model,started:start===null?null:stamp(start),ended:status==='succeeded'&&start!==null&&duration!==null?stamp(start+duration):null,duration})
 const nodes=[n('run','run',null,'Market research', 'running',0,103),
 n('research','phase','run','Research','succeeded',0,41),n('analyse','phase','run','Analyse','succeeded',12,59),n('write','phase','run','Writing','needs_input',40,59),n('review','phase','run','Review','running',70,31),n('repeat','phase','run','Repeat','queued',null,null),
 n('researcher','agent','research','Researcher','succeeded',0,41,'Atlas'),n('analyst','agent','analyse','Data analyst','succeeded',12,59,'Mica'),n('writer','agent','write','Writer','needs_input',40,59,'Atlas'),n('checker','agent','review','Fact checker','running',70,31,'Cedar'),n('reviewer','agent','repeat','Reviewer','queued',null,null,'Cedar'),
 n('search','task','researcher','Web search','succeeded',0,12,'Mica'),n('read','task','researcher','Read sources','succeeded',12,29,'Mica'),n('market','task','analyst','Size the market','succeeded',12,59,'Mica'),n('outline','task','writer','Draft outline','succeeded',40,18,'Atlas'),n('draft','task','writer','Confirm audience','needs_input',58,null,'Atlas'),n('claim','task','checker','Check claim','failed',70,8,'Cedar'),n('retry','task','checker','Cross-check source','running',80,21,'Cedar'),n('publish','task','reviewer','Review draft','queued',null,null,'Cedar')]
 nodes.find(x=>x.id==='claim')!.error='The synthetic source could not substantiate this claim.'
 const u=(id:string,subject:string,input:number|null,output:number|null,cache:number|null,cost:number|null):Usage=>({id,subject,model:nodes.find(x=>x.id===subject)?.model??null,input,output,cache,cost,currency:'USD',basis:'exclusive'})
 return {id:'demo-market-01',label:'Market research',created:stamp(0),started:stamp(0),ended:null,nodes,edges:[...nodes.filter(n=>n.parent).map(n=>({from:n.parent!,to:n.id,kind:'hierarchy' as const})),{from:'read',to:'market',kind:'handoff'},{from:'outline',to:'claim',kind:'dependency'}],usage:[u('u1','search',12000,1800,4000,.06),u('u2','read',18000,2200,6000,.08),u('u3','market',24000,4100,0,.19),u('u4','outline',16000,2800,8000,.12),u('u5','draft',null,null,null,null),u('u6','claim',5000,600,0,.03),u('u7','retry',7000,900,1000,.04),u('u8','publish',0,0,0,0)],events:[{id:'e1',ts:stamp(1),kind:'tool_call',subject:'search',summary:'Searched the synthetic source index.'},{id:'e2',ts:stamp(41),kind:'handoff',subject:'market',summary:'Research summary passed to the analyst.'},{id:'e3',ts:stamp(58),kind:'approval',subject:'draft',summary:'Waiting for the sample audience brief. No approval action is connected.'},{id:'e4',ts:stamp(78),kind:'error',subject:'claim',summary:'Claim could not be verified in the sample source.'},{id:'e5',ts:stamp(80),kind:'status_change',subject:'retry',summary:'Cross-check started in the simulated run.'}],capabilities:{pause:true,resume:true,stop:true,retry:true}}
}
export function scopeIds(run:Run,id:string|null):Set<string>{
 const ids=new Set<string>();if(!id)return new Set(run.nodes.map(x=>x.id));ids.add(id)
 let changed=true;while(changed){changed=false;for(const n of run.nodes)if(n.parent&&ids.has(n.parent)&&!ids.has(n.id)){ids.add(n.id);changed=true}}
 return ids
}
export function aggregate(rows:Usage[]){
 const local=rows.filter(x=>x.basis==='exclusive');
 const sum=(key:'input'|'output'|'cache'|'cost')=>{const known=local.filter(x=>x[key]!==null);return {value:known.length?known.reduce((s,x)=>s+x[key]!,0):null,missing:local.length-known.length}}
 return {input:sum('input'),output:sum('output'),cache:sum('cache'),cost:sum('cost')}
}
export function validate(run:Run):string[]{
 const errors:string[]=[],ids=new Set(run.nodes.map(x=>x.id));if(ids.size!==run.nodes.length)errors.push('Duplicate node id')
 if(run.nodes.filter(x=>x.kind==='run'&&x.parent===null).length!==1)errors.push('One root run required')
 for(const n of run.nodes){if(n.parent&&!ids.has(n.parent))errors.push('Missing parent');let p=n.parent,seen=new Set([n.id]);while(p){if(seen.has(p)){errors.push('Hierarchy cycle');break}seen.add(p);p=run.nodes.find(x=>x.id===p)?.parent??null}if(n.duration!==null&&n.duration<0)errors.push('Negative duration');for(const d of [n.started,n.ended])if(d!==null&&!Number.isFinite(Date.parse(d)))errors.push('Invalid timestamp')}
 for(const group of [run.usage,run.events])if(new Set(group.map(x=>x.id)).size!==group.length)errors.push('Duplicate record id')
 for(const e of run.events)if(!ids.has(e.subject)||!Number.isFinite(Date.parse(e.ts)))errors.push('Invalid event')
 for(const e of run.edges)if(!ids.has(e.from)||!ids.has(e.to))errors.push('Missing edge node')
 for(const u of run.usage){if(!ids.has(u.subject))errors.push('Missing usage subject');for(const k of ['input','output','cache','cost'] as const)if(u[k]!==null&&(!Number.isFinite(u[k])||u[k]!<0))errors.push('Invalid usage')}
 return errors
}
export function allowed(action:Action,status:Status){return action==='pause'?status==='running':action==='resume'?status==='paused':action==='stop'?['running','paused','needs_input'].includes(status):['failed','canceled'].includes(status)}
export function simulate(action:Action,status:Status,fail=false):Ack {
 if(fail)return {state:'error',message:'Simulated connection error. No state change acknowledged.'}
 if(!allowed(action,status))return {state:'error',message:'Control no longer applies to this run.'}
 const next:Record<Action,Status>={pause:'paused',resume:'running',stop:'canceled',retry:'running'}
 return {state:'ack',status:next[action],message:action==='pause'?'Simulation paused after the current sample call.':`Simulation ${action==='resume'?'resumed':action==='stop'?'stopped':'restarted'}.`}
}
