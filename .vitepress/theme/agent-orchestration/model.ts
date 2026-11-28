import orchestrationDef from './orchestration.json'

export type Status='queued'|'running'|'paused'|'succeeded'|'failed'|'canceled'|'needs_input'
export type Kind='run'|'phase'|'agent'|'task'
export type Action='pause'|'resume'|'stop'|'retry'
export interface Node {id:string;kind:Kind;parent:string|null;label:string;status:Status;model:string|null;started:string|null;ended:string|null;duration:number|null;error?:string}
export interface Usage {id:string;subject:string;model:string|null;input:number|null;output:number|null;cache:number|null;cost:number|null;currency:'USD';basis:'exclusive'|'inclusive'}
export interface Event {id:string;ts:string;kind:'tool_call'|'handoff'|'approval'|'error'|'status_change'|'note';subject:string;summary:string}
export interface Run {id:string;label:string;created:string;started:string|null;ended:string|null;nodes:Node[];edges:{from:string;to:string;kind:'hierarchy'|'handoff'|'dependency'}[];usage:Usage[];events:Event[];capabilities:Record<Action,boolean>}
export interface Ack {state:'ack'|'error';message:string;status?:Status}
export const statusLabel:Record<Status,string>= orchestrationDef.labels?.statusLabel as Record<Status,string> ?? {queued:'Queued',running:'Running',paused:'Paused',succeeded:'Done',failed:'Failed',canceled:'Canceled',needs_input:'Needs you'}
export const stamp=(s:number)=>new Date(Date.UTC(2026,10,1,12,0,s)).toISOString()
export function fixture():Run {
  return structuredClone(orchestrationDef.run) as Run
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
export { orchestrationDef as ORCHESTRATION_DEF }