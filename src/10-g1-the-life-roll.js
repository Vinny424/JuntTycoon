/* ───────────── G1: the life roll ───────────── */
const pick=o=>{let r=Math.random(),a=0;for(const[v,w]of o){a+=w;if(r<a)return v}return o[o.length-1][0]};
const rint=(a,b)=>Math.round(a+Math.random()*(b-a));
const gauss=()=>{let u=0,v=0;while(!u)u=Math.random();while(!v)v=Math.random();return Math.sqrt(-2*Math.log(u))*Math.cos(2*Math.PI*v)};
const money=n=>(n<0?'-':'')+'$'+Math.abs(Math.round(n)).toLocaleString('en-US');
const CITIES=[
 {name:'Millbrook',kind:'Rust Belt river town',rent:700,cost:.85},
 {name:'Palo Verde',kind:'Sun Belt boomtown',rent:1250,cost:1},
 {name:'Harbor City',kind:'coastal metro',rent:2150,cost:1.3}];
const JOBS={
 none:{t:['Gig deliveries on weekends','Between jobs, picking up cash work'],pay:[8000,14000]},
 low:{t:['Warehouse associate','Line cook','Retail keyholder','Call center rep','Security guard'],pay:[26000,36000]},
 medium:{t:['Dental hygienist','Electrician apprentice','Account manager','Licensed practical nurse','IT support specialist'],pay:[48000,72000]},
 high:{t:['Software engineer','Pharmacist','Sales director','Corporate attorney','Nurse anesthetist'],pay:[105000,180000]}};
const TRAITS=[['Handy','Repairs cost less, and you can do small fixes yourself.'],['Silver tongue','Better odds when negotiating.'],['Numbers brain','Deal metrics show up before anyone explains them.'],['Night owl','All-nighters cost less energy.'],['Frugal','Living costs are 15% lower.'],['Connected','Brokers and contractors return your calls.']];
const CLASS_TXT={low:'Rough start. Nobody in your family has ever owned property.',middle:'Middle class. Your parents own their house, and not much else.',upper:'Comfortable. Your family has "a guy" for everything.'};
const SUP_TXT={none:"None. You're on your own.",home:'Free housing: you live with family, rent-free.',cosign:'A parent will co-sign one loan.',network:'Connections: a realtor uncle and a lender who owes the family a favor.'};

function rollLife(force){
 const cls=force||pick([['low',.38],['middle',.47],['upper',.15]]);
 const sup=pick({low:[['none',.7],['home',.2],['cash',.1]],middle:[['none',.3],['home',.25],['cosign',.2],['cash',.15],['network',.1]],upper:[['none',.1],['home',.15],['cosign',.15],['cash',.35],['network',.25]]}[cls]);
 const job=pick({low:[['none',.3],['low',.6],['medium',.1]],middle:[['none',.1],['low',.35],['medium',.45],['high',.1]],upper:[['none',.15],['low',.1],['medium',.4],['high',.35]]}[cls]);
 const city=CITIES[Math.random()*3|0],J=JOBS[job],title=J.t[Math.random()*J.t.length|0],salary=Math.round(rint(...J.pay)/500)*500;
 const traits=[...TRAITS].sort(()=>Math.random()-.5).slice(0,2),frugal=traits.some(t=>t[0]=='Frugal');
 const savings={low:rint(0,600),middle:rint(1500,9000),upper:rint(12000,45000)}[cls];
 const lump=sup=='cash'?{low:rint(500,2000),middle:rint(3000,15000),upper:rint(25000,150000)}[cls]:0;
 const student=Math.random()<{low:.3,middle:.55,upper:.25}[cls]?Math.round({low:rint(8000,25000),middle:rint(18000,45000),upper:rint(5000,30000)}[cls]/100)*100:0;
 const car=Math.random()<{low:.5,middle:.6,upper:.4}[cls]?rint(280,650):0;
 const credit=Math.max(480,Math.min(840,Math.round({low:620,middle:690,upper:740}[cls]+gauss()*{low:55,middle:45,upper:40}[cls])));
 const home=sup=='home'?{low:"Your aunt's couch",middle:"Parents' spare room",upper:'The family guest house'}[cls]:{low:'Studio apartment',middle:'One-bedroom apartment',upper:'Downtown condo'}[cls];
 const rent=sup=='home'?0:Math.round(city.rent*{low:.8,middle:1,upper:1.8}[cls]/5)*5;
 const living=Math.round({low:700,middle:1000,upper:1600}[cls]*city.cost*(frugal?.85:1)/10)*10;
 const net=Math.round(salary*.8/12),loanPay=Math.round(student*.011),flow=net-rent-loanPay-car-living;
 return{cls,sup,job,title,salary,city,savings,lump,cash:savings+lump,student,car,credit,home,rent,living,net,loanPay,flow,traits};
}
function lifeRows(L){
 const cr=L.credit>=740?'good':L.credit<640?'bad':'';
 return[
  ['Upbringing',CLASS_TXT[L.cls]],
  ['Hometown',`${L.city.name}, a ${L.city.kind}`],
  ['Living in',L.rent?`${L.home}, ${money(L.rent)} a month`:`${L.home}, no rent`],
  ['Family help',L.sup=='cash'?`A one-time gift of ${money(L.lump)}.`:SUP_TXT[L.sup]],
  ['Job',L.title],
  ['Salary',`${money(L.salary)} a year (${money(L.net)} a month after tax)`],
  ['Savings',money(L.savings)],
  ['Student loans',L.student?`${money(L.student)} (${money(L.loanPay)} a month)`:'None'],
  ['Car payment',L.car?`${money(L.car)} a month`:'None. You take the bus.'],
  ['Credit score',String(L.credit),cr],
  ['Traits',L.traits.map(t=>t[0]).join(' + ')],
 ];
}
let life=null,rerolls=2;
const rollEl=$('roll'),rowsEl=$('lifeRows'),sumEl=$('lifeSum'),traitEl=$('lifeTraits'),rerollB=$('reroll'),beginB=$('begin');
function showLife(L,animate){
 const rows=lifeRows(L),decoys=[rollLife(),rollLife(),rollLife(),rollLife()].map(lifeRows);
 rowsEl.innerHTML='';sumEl.innerHTML='';traitEl.innerHTML='';rerollB.disabled=beginB.disabled=true;
 const dds=rows.map(([k])=>{const dt=document.createElement('dt');dt.textContent=k;const dd=document.createElement('dd');dd.textContent='—';rowsEl.append(dt,dd);return dd});
 const finish=()=>{
  const fcls=L.flow>=0?'good':'bad';
  sumEl.innerHTML=`<div>Starting cash <b>${money(L.cash)}</b></div><div>Every month <b class="${fcls}">${L.flow>=0?'+':''}${money(L.flow)}</b> <span class="fine">after rent, bills, loans and living costs</span></div>`;
  traitEl.innerHTML=L.traits.map(t=>`<div><b>${t[0]}:</b> ${t[1]}</div>`).join('');
  rerollB.disabled=rerolls<=0;rerollB.textContent=`Reroll (${rerolls} left)`;beginB.disabled=false;beginB.focus();
 };
 if(!animate){dds.forEach((dd,i)=>{dd.textContent=rows[i][1];dd.className=rows[i][2]||''});return finish()}
 dds.forEach((dd,i)=>{
  let n=0;setTimeout(()=>{dd.className='rolling';const iv=setInterval(()=>{dd.textContent=decoys[n++%4][i][1];if(n>5){clearInterval(iv);dd.textContent=rows[i][1];dd.className=rows[i][2]||'';if(i==rows.length-1)finish()}},55)},i*230);
 });
}
function newLife(force){life=rollLife(force);showLife(life,true)}
rerollB.onclick=()=>{if(rerolls<=0)return;rerolls--;newLife()};
document.querySelectorAll('[data-force]').forEach(b=>b.onclick=()=>newLife(b.dataset.force));
beginB.onclick=()=>{
 const L=life,S=STAGES[0];
 S.name=`${L.home} · ${L.city.name}`;S.cash=money(L.cash);S.units='0 units';
 S.things[3].msg=L.rent?`Rent: ${money(L.rent)}, due on the 1st.`:'No rent. The house rule is Sunday dinner, no excuses.';
 S.events=S.events.map(e=>e.startsWith('Rent due')?(L.rent?`Rent due (${money(L.rent)})`:'Sunday dinner with family'):e);
 S.events=S.events.map(e=>e.startsWith('Day job')?(L.job=='none'?'Job interview downtown':`Shift: ${L.title.toLowerCase()}`):e);
 rollEl.hidden=true;mode='free';initEcon(L);setStage(0);$('credit').textContent=L.credit;
 say(`${CLASS_TXT[L.cls]} ${L.flow>=0?`You clear ${money(L.flow)} a month. That's your seed money.`:`You come up ${money(-L.flow)} short every month. First goal: fix that.`}`);
};
mode='roll';rollEl.hidden=false;newLife();
