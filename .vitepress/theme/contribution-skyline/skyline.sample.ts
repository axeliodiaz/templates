import type { SkylineCellInput } from './skyline.types'
export const DATASETS = ['Synthetic year','Outlier','All zero','With unknown days','Partial range'] as const
export function sampleCells(dataset:string):SkylineCellInput[] {
  const total=dataset==='Partial range'?91:365
  return Array.from({length:Math.ceil(total/7)*7},(_,i)=>{
    if(i>=total)return {col:Math.floor(i/7),row:i%7,date:null,count:null,level:null}
    // Calendar generation is explicitly UTC. No parsing of local ISO dates.
    const date=new Date(Date.UTC(2025,10,2+i)).toISOString().slice(0,10)
    const count=dataset==='All zero'?0:dataset==='With unknown days'&&i%17===0?null:dataset==='Outlier'?(i===180?1000:i%9):i%5===0?0:(i*13+7)%47
    return {col:Math.floor(i/7),row:i%7,date,count,level:count===null?null:count===0?0:Math.min(4,Math.ceil(count/12))}
  })
}
