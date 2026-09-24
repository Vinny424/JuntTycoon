/* ───────────── G2a: the money loop + phone and computer ───────────── */
const MONTH=30,dom=d=>((d-1)%MONTH)+1,monthOf=d=>Math.floor((d-1)/MONTH)+1;
const econ={ready:false,cash:0,credit:650,creditStart:650,student:0,loanPay:0,car:0,rent:0,living:0,net:0,salary:0,job:'',bank:'',tx:[],log:[],pending:[],pastDue:0,rentStrikes:0};
const paycheck=()=>Math.round(econ.net*12/26);
function addTx(d,label,amt,silent){econ.tx.unshift({d,label,amt});if(econ.tx.length>60)econ.tx.pop();if(!silent)econ.cash+=amt}
function note(t){econ.log.unshift({d:day,text:t});if(econ.log.length>60)econ.log.pop();if(mode=='free')say(t);else econ.pending.push(t)}
function initEcon(L){
 Object.assign(econ,{ready:true,cash:L.cash,credit:L.credit,creditStart:L.credit,student:L.student,loanPay:L.loanPay,car:L.car,rent:L.rent,living:L.living,net:L.net,salary:L.salary,job:L.title,bank:`${L.city.name} Community Credit Union`,tx:[],log:[],pending:[],pastDue:0,rentStrikes:0});
 addTx(1,'Opening balance',L.cash,true);
 econ.log.push({d:1,text:`${econ.bank}: Welcome! Your checking account is open.`});
 econ.log.unshift({d:1,text:{low:'Mom: "Proud of you. Call me if you need anything, I mean it."',middle:'Dad: "Remember, pay yourself first."',upper:'Family office: "Your statements are attached."'}[L.cls]});
}
function newDay(d){
 if(!econ.ready)return;
 if(econ.salary>0&&d%14==0){const p=paycheck();addTx(d,'Paycheck: '+econ.job,p);let m=`Payday: +${money(p)}.`;
  if(econ.pastDue>0){const pay=Math.min(econ.pastDue,Math.max(0,econ.cash));if(pay>0){addTx(d,'Past-due bills',-pay);econ.pastDue-=pay;m+=` ${money(pay)} went to past-due bills.`}}
  note(m)}
 if(dom(d)==1&&d>1)issueBills(d);
}
function flushMoney(){if(!econ.pending.length)return'';const s=' Money: '+econ.pending.join(' ');econ.pending=[];return s}

/* ── device UI ── */
const CRED=c=>c>=800?['Excellent','pos']:c>=740?['Very good','pos']:c>=670?['Good','']:c>=580?['Fair','warn']:['Poor','neg'];
function upcoming(n){const out=[];for(let d=day+1;d<=day+n;d++){if(econ.salary>0&&d%14==0)out.push({d,label:'Paycheck',amt:paycheck()});
 if(dom(d)==1)[['Rent',econ.rent],['Car payment',econ.car],['Student loan',econ.loanPay],['Groceries, phone, utilities',econ.living]].forEach(([l,a])=>a>0&&out.push({d,label:l,amt:-a}))}return out}
const row=(d,label,amt)=>`<tr><td>Day ${d}</td><td>${label}</td><td class="n ${amt>0?'pos':amt<0?'neg':''}">${amt?(amt>0?'+':'')+money(amt):''}</td></tr>`;
const APPS=[
 {id:'bank',name:'Bank',col:'#4fc07a',render(){
  const up=upcoming(30),proj=econ.cash+up.reduce((s,u)=>s+u.amt,0)-econ.pastDue,[cl,cc]=CRED(econ.credit),dc=econ.credit-econ.creditStart;
  return`<h3>${econ.bank}</h3>
  <div class="cards"><div class="card"><div class="label">Checking balance</div><div class="big ${econ.cash<0?'neg':''}">${money(econ.cash)}</div><div class="muted">Month ${monthOf(day)}, day ${dom(day)}</div></div>
  <div class="card"><div class="label">Credit score</div><div class="big ${cc}">${econ.credit}</div><div>${cl} · <span class="${dc>=0?'pos':'neg'}">${dc>=0?'+':''}${dc} since you started</span></div></div></div>
  ${econ.pastDue>0?`<p class="neg">Past due: ${money(econ.pastDue)}. It comes out of your next paycheck first.</p>`:''}
  <div class="label">Next 30 days</div><table>${up.map(u=>row(u.d,u.label,u.amt)).join('')||'<tr><td class="muted">Nothing scheduled.</td></tr>'}</table>
  <p>Projected balance on day ${day+30}: <b class="${proj<0?'neg':'pos'}">${money(proj)}</b>${proj<0?' <span class="warn">You will come up short. Pick up work or cut costs.</span>':''}</p>
  <div class="label">Recent activity</div><table>${econ.tx.slice(0,8).map(t=>row(t.d,t.label,t.amt)).join('')}</table>
  <div class="label">Debts</div><table><tr><td>Student loans</td><td class="n">${econ.student?money(econ.student):'None'}</td></tr><tr><td>Car loan</td><td class="n">${econ.car?money(econ.car)+' a month':'None'}</td></tr></table>
  <p class="muted">Credit rises slowly with on-time payments and lower debt. One missed payment can cost 40 to 70 points.</p>`}},
 {id:'cal',name:'Calendar',col:'#e0605a',render(){
  const all=[...upcoming(30),...agenda.map(a=>({d:a.day,label:a.text,amt:0}))].sort((a,b)=>a.d-b.d);
  return`<h3>Calendar</h3><p class="muted">Today: day ${day} (month ${monthOf(day)}, day ${dom(day)}), ${fmt()}. Bills hit on the 1st, and paychecks come every 14 days.</p><table>${all.map(u=>row(u.d,u.label,u.amt)).join('')}</table>`}},
 {id:'msgs',name:'Messages',col:'#5a9af0',render(){
  return`<h3>Messages</h3>${econ.log.length?`<table>${econ.log.slice(0,20).map(m=>`<tr><td>Day ${m.d}</td><td>${m.text}</td></tr>`).join('')}</table>`:'<p class="muted">No messages yet.</p>'}`}},
 {id:'jobs',name:'Jobs',col:'#c9a038',lock:'G2b'},
 {id:'learn',name:'Learn',col:'#a07ae0',lock:'G2b'},
 {id:'gigs',name:'Gigs',col:'#e08a3a',lock:'G2b'},
 {id:'deals',name:'Listings',col:'#e8c98a',lock:'G3'},
];
const devEl=$('device');let devApp='bank',devKind='laptop';
const OSBAR=['#3a4a5a','#3a2a5a','#2a4a3a','#3a3020','#101418'];
function openDevice(kind){if(!econ.ready)return say('Finish your life roll first.');mode='device';devKind=kind;devEl.hidden=false;renderDevice()}
function closeDevice(){devEl.hidden=true;mode='free'}
function renderDevice(){
 const a=APPS.find(x=>x.id==devApp),body=a.lock?`<h3>${a.name}</h3><p class="muted">Coming in the next build (${a.lock}).</p>`:a.render();
 const btns=APPS.map(x=>`<button class="appbtn" data-app="${x.id}" aria-current="${x.id==devApp}"${x.lock?' title="Coming soon"':''}><span class="ico" style="background:${x.col}${x.lock?';opacity:.35':''}"></span>${x.name}</button>`).join('');
 devEl.innerHTML=devKind=='phone'
  ?`<div class="phone"><div class="pbar"><span>${fmt()}</span><span>Day ${day}</span><span>▮▮▮ 5G</span></div><section class="app">${body}</section><nav class="pdock">${btns}</nav><button class="home" data-close>Close phone (Esc)</button></div>`
  :`<div class="bezel"><div class="osbar" style="background:${OSBAR[si]}"><span>Junt-OS</span><span>Day ${day} · ${fmt()}</span><button data-close>Close (Esc)</button></div><div class="os"><nav class="dock">${btns}</nav><section class="app">${body}</section></div></div>`;
}
devEl.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;if(b.dataset.close!=null)return closeDevice();if(b.dataset.app){devApp=b.dataset.app;renderDevice()}});
addEventListener('keydown',e=>{const k=e.key.toLowerCase();if(mode=='device'&&k==='escape')closeDevice();else if(mode=='free'&&k==='p')openDevice('phone')});
{const b=document.createElement('button');b.textContent='Phone';b.setAttribute('aria-label','Open phone');b.onclick=()=>mode=='free'&&openDevice('phone');document.querySelector('.pad').prepend(b)}
{const COMP=['Laptop','Computer','Workstation','Study','Holdings'];STAGES.forEach((s,i)=>{const t=s.things.find(t=>t.name==COMP[i]);if(t)t.computer=1})}
// pixel mouse cursor for the devices
{const A=['X...........','XX..........','XWX.........','XWWX........','XWWWX.......','XWWWWX......','XWWWWWX.....','XWWWWWWX....','XWWWWXXXX...','XWXWWX......','XX.XWWX.....','X...XWWX....','.....XWX....','......X.....'];
 const c=document.createElement('canvas');c.width=24;c.height=28;const x=c.getContext('2d');A.forEach((r,y)=>[...r].forEach((p,i)=>{if(p!='.'){x.fillStyle=p=='X'?'#111':'#fff';x.fillRect(i*2,y*2,2,2)}}));
 const s=document.createElement('style');s.textContent=`.devwrap,.devwrap *{cursor:url(${c.toDataURL()}) 0 0,default}`;document.head.appendChild(s)}
