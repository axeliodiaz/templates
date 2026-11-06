/** Workflow-OPS-style 60-tick capacity indicator. Framework-free canonical implementation. */
export function tickProgressModel(value, ticks = 60) {
  const count = Math.max(1, Math.min(120, Math.round(Number(ticks) || 60)));
  const known = typeof value === 'number' && Number.isFinite(value);
  const percent = known ? Math.max(0, Math.min(100, value)) : null;
  return {percent, fills: Array.from({length:count}, (_,i)=>percent === null ? 0 : Math.max(0,Math.min(1,percent*count/100-i)))};
}
export function createTickProgress(host, options = {}) {
  let disposed = false;
  function update(next) {
    if(disposed)return;
    const model=tickProgressModel(next.value,next.ticks);
    const strip=document.createElement('div');strip.className='tpl-tick-progress';
    strip.dataset.state=model.percent===null?'unavailable':'known';
    strip.setAttribute('aria-label',next.label || 'Capacity used');
    if(model.percent!==null){strip.setAttribute('role','progressbar');strip.setAttribute('aria-valuemin','0');strip.setAttribute('aria-valuemax','100');strip.setAttribute('aria-valuenow',String(model.percent));}
    else strip.setAttribute('role','img');
    if(next.valueText)strip.setAttribute('aria-valuetext',next.valueText);
    if(next.color)strip.style.setProperty('--tick-progress-color',next.color);
    for(const fill of model.fills){const tick=document.createElement('i');tick.setAttribute('aria-hidden','true');tick.style.setProperty('--tick-fill',`${fill*100}%`);strip.append(tick);}
    host.replaceChildren(strip);
  }
  update(options);
  return {update, destroy(){disposed=true;host.replaceChildren();}};
}
