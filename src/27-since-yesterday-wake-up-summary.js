/* ───────────── "Since yesterday" wake-up summary ───────────── */
const wakeEl=document.createElement('div');wakeEl.className='wake';wakeEl.hidden=true;scr.parentElement.appendChild(wakeEl);
let sleepMark=null;
const _startSleepW=startSleep;startSleep=function(kind){sleepMark={tx:econ.tx[0],cash:econ.cash,credit:econ.credit,day};_startSleepW(kind)};
function groupTx(list){const m=new Map();for(const t of list){const k=t.label.replace(/: \d+ .*$/,'').replace(/ \(.*\)$/,'');m.set(k,(m.get(k)||0)+t.amt)}return[...m].sort((a,b)=>Math.abs(b[1])-Math.abs(a[1]))}
function showWake(kind,notes){
 if(!econ.ready||!sleepMark)return;const i=econ.tx.indexOf(sleepMark.tx),fresh=(i<0?econ.tx:econ.tx.slice(0,i)).filter(t=>t.amt);
 const ins=groupTx(fresh.filter(t=>t.amt>0)),outs=groupTx(fresh.filter(t=>t.amt<0)),net=econ.cash-sleepMark.cash,dc=econ.credit-sleepMark.credit,nb=econ.bills?.length||0;
 const li=(rows,cls)=>rows.length?rows.slice(0,6).map(([k,v])=>`<tr><td>${k}</td><td class="n ${cls}">${v>0?'+':''}${money(v)}</td></tr>`).join('')+(rows.length>6?`<tr><td class="muted">+ ${rows.length-6} more</td><td></td></tr>`:''):`<tr><td class="muted">Nothing</td><td></td></tr>`;
 const days=day-sleepMark.day;
 wakeEl.innerHTML=`<div class="wake-card" role="dialog" aria-labelledby="wakeT"><h2 id="wakeT">${kind=='nap'?'After your nap':days>1?`While you slept · ${days} days`:'Since yesterday'}</h2>
  <p class="muted">Day ${day}, ${fmt()}</p>
  <div class="wake-cols"><div><div class="label">Money in</div><table>${li(ins,'pos')}</table></div><div><div class="label">Money out</div><table>${li(outs,'neg')}</table></div></div>
  <div class="wake-sum"><div>Net <b class="${net>=0?'pos':'neg'}">${net>=0?'+':''}${money(net)}</b></div><div>Balance <b>${money(econ.cash)}</b></div><div>Credit <b>${econ.credit}</b>${dc?` <span class="${dc>0?'pos':'neg'}">(${dc>0?'+':''}${dc})</span>`:''}</div></div>
  ${nb?`<p class="warn">${nb} bill${nb>1?'s':''} due. Pay them in the Bank app.</p>`:''}
  ${notes.length?`<div class="label">News</div><ul>${notes.slice(0,5).map(n=>`<li>${n}</li>`).join('')}</ul>`:''}
  <button id="wakeGo" class="act">Start the day</button></div>`;
 wakeEl.hidden=false;mode='wake';$('wakeGo').onclick=closeWake;setTimeout(()=>$('wakeGo')?.focus(),30)}
function closeWake(){wakeEl.hidden=true;if(mode=='wake')mode='free'}
addEventListener('keydown',e=>{if(mode=='wake'&&['e','enter','escape',' '].includes(e.key.toLowerCase())){e.preventDefault();closeWake()}});
const _finishSleepW=finishSleep;finishSleep=function(kind){const notes=[...econ.pending];_finishSleepW(kind);showWake(kind,notes)};
/* location names without a time of day (the clock shows it) */
STAGES[1].name='Suite 2B, above the laundromat';STAGES[2].name='Corner suite, 14th floor';STAGES[3].name='The Estate';STAGES[4].name="Billionaires' Row, 96th floor";if(/ · Night$/.test(STAGES[0].name))STAGES[0].name='Studio apartment';
/* dev: restart from the title screen */
{const b=document.createElement('button');b.textContent='↺ Restart';b.title='Back to the title screen with a fresh life';b.onclick=()=>location.reload();dev.appendChild(b)}
