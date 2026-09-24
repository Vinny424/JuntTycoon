/*@@ module fail.js begin @@*/
/* ───────────── Rock bottom: family lifeline, bankruptcy, or start over ─────────────
   The popup opens when you are a month behind on bills you cannot cover, or badly overdrawn.
   Bankruptcy rules follow US law in simplified form (game years are 360 days):
   · waiting between filings: Ch7 to Ch7 8 years, Ch7 to Ch13 4, Ch13 to Ch7 6, Ch13 to Ch13 2 (counted from the filing date)
   · Ch7 needs the means test (income under the state median, or little left over after expenses); a trustee sells anything not exempt, rentals included
   · Ch13 is a 3 to 5 year repayment plan (3 if you earn under the median, 5 above) and needs regular income; you keep your property
   · credit counseling from an approved agency is required within 180 days before filing
   · student loans are not discharged; conventional lenders wait 4 years after a Ch7 and 2 years after a Ch13 discharge
   · filing is legal and not a crime, however many times the waiting periods allow. Hiding assets or lying on the forms is federal bankruptcy fraud (18 USC 152). */
const BK_YEAR=360,BK_FEE7=1850,BK_FEE13=4200;
const MEDIAN={'Millbrook':52000,'Palo Verde':64000,'Harbor City':88000};   // rough single-earner state medians for the means test
const FAM_CAP={low:1500,middle:6000,upper:40000};
const FAM_VOICE={low:'Mom',middle:'Dad',upper:'Your mother'};
const famS=()=>econ.fam||(econ.fam={used:0,last:-999,owed:0,cut:false,ask:null});
const bkS=()=>econ.bk||(econ.bk={hist:[],counsel:-999,plan:null,freeDay:0,dismissed:-999});
const debs=()=>econ.autoDeb||(econ.autoDeb=[]);
const _initEconF=initEcon;
initEcon=function(L){_initEconF(L);Object.assign(econ,{fam:{used:0,last:-999,owed:0,cut:false,ask:null},bk:{hist:[],counsel:-999,plan:null,freeDay:0,dismissed:-999},autoDeb:[],failSnooze:0,gigsDone:0,lastGig:0})};

// ── numbers ──
const rentMonthly=()=>(econ.props||[]).reduce((s,P)=>s+P.units_.reduce((a,u)=>a+(u.occ&&!u.you?u.rent:0),0),0);
const annualIncome=()=>(econ.salary||0)+Math.round(rentMonthly()*12*.8);
const dispMonthly=()=>Math.round((econ.net||0)+rentMonthly()*.8-econ.living-econ.rent-econ.car-(econ.student>0?econ.loanPay:0)-(econ.props||[]).reduce((s,P)=>s+propPITI(P),0)-(econ.office||0)-(econ.mike?3000:0));
function owedInfo(){const bills=(econ.bills||[]).reduce((s,b)=>s+b.amt,0),over=Math.max(0,-econ.cash),past=econ.pastDue||0;return{bills,over,past,total:bills+over+past}}
const propEquity=()=>(econ.props||[]).reduce((s,P)=>s+Math.max(0,Math.round(P.value*.92-P.loan)),0);

// ── when does the popup open? ──
function rockBottom(){
 if(!econ.ready||!econ.bills||bkS().plan)return null;
 const o=owedInfo(),old=econ.bills.filter(b=>day>=b.due+30);
 if(old.length&&o.bills>Math.max(0,econ.cash)){
  const b=old.find(x=>x.kind=='mortgage')||old.find(x=>x.kind=='rent')||old[0];
  if(b.kind=='mortgage')return{kind:'foreclosure',why:`The bank started foreclosure on ${b.label.split(': ')[1]||'one of your properties'}. ${money(b.amt)} is more than a month overdue.`};
  if(b.kind=='rent')return{kind:'eviction',why:`Your landlord filed for eviction. ${money(b.amt)} of rent is more than a month overdue.`};
  return{kind:'collections',why:`Collectors are calling. ${b.label} is more than a month overdue and you cannot cover it.`};
 }
 if(econ.cash<-1500)return{kind:'overdrawn',why:`The bank froze your account. You are overdrawn by ${money(-econ.cash)}.`};
 return null;
}
const failDue=()=>!!rockBottom()&&day>=(econ.failSnooze||0);

// ── the popup ──
const failEl=document.createElement('div');failEl.className='failwrap';failEl.hidden=true;document.body.appendChild(failEl);   // full-window overlay: the text needs more room than the game screen has
{const s=document.createElement('style');s.textContent=`.failwrap{position:fixed;inset:0;z-index:60;display:flex;align-items:center;justify-content:center;background:rgba(8,6,4,.84);padding:12px}.failwrap[hidden]{display:none}.fail-card{width:min(760px,100%);max-height:96vh}.fail-card h2{color:#f0a08a}.fopts{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin:10px 0 4px}
.fopt{border:1px solid #4a3526;background:#ffffff08;padding:8px 10px;display:flex;flex-direction:column;gap:6px}.fopt h3{margin:0;font-family:"Pixelify Sans",monospace;font-size:19px;font-weight:600;color:var(--ink)}
.fopt p{margin:0;font-size:17px}.fopt .act{align-self:flex-start}.fail-card .fine{font-size:15px;color:var(--dim)}.fail-card ul.chk{list-style:none;padding:0;margin:4px 0;font-size:17px}.fail-card ul.chk li{margin:2px 0}
.fail-card .cols2{display:grid;grid-template-columns:1fr 1fr;gap:12px}.fail-card .link{background:none;border:none;color:var(--dim);text-decoration:underline;cursor:pointer;font-family:"VT323",monospace;font-size:17px;padding:2px 0}
@media (max-width:760px){.fopts,.fail-card .cols2{grid-template-columns:1fr}}`;document.head.appendChild(s)}
let failView='main',failMsg='',failFrom=false;
const V=()=>FAM_VOICE[econ.cls||'middle'];
const nth=n=>['','first','second','third','fourth'][n]||n+'th';

function famAsk(){
 const F=famS();if(F.ask&&F.ask.day==day)return F.ask.res;
 const cls=econ.cls||'middle',o=owedInfo(),short=Math.max(0,o.total-Math.max(0,econ.cash)),B=bkS(),lastBk=B.hist[B.hist.length-1],
  seed=((day*7919+F.used*104729+Math.round(econ.credit))%1000)/1000,rents=rentMonthly(),eq=propEquity();
 const no=(text,why)=>({ok:false,text:`${V()}: "${text}"`,why});
 const sits={low:["Mom's hours got cut at the plant.","Your aunt's car died and the family is covering the repair.","Dad is between jobs himself right now.","Grandma's rent went up and everyone is chipping in."],
  middle:["We're paying for a new roof.","Your sister's tuition bill just landed.","Dad's retirement account took a hit this year.","We're helping your cousin with a security deposit."],
  upper:["Most of the money is tied up in a fund until the quarter closes.","The family office froze discretionary gifts while the auditors finish.","Your father is restructuring and can't touch principal right now."]}[cls];
 let res;
 if(F.cut)res=no("I love you. I'm not doing this again.",'They stopped answering after the last time.');
 else if(lastBk&&day-lastBk.day<720)res=no("You filed. That was your fresh start. Nobody is funding a second one so soon.",'Too soon after a bankruptcy filing.');
 else if(day-F.last<90)res=no(`You asked ${day-F.last} days ago. Give it a little time.`,'You asked too recently.');
 else if(F.owed>0)res=no(`You still owe us ${money(F.owed)}. Pay that back first.`,'An earlier lifeline is still unpaid.');
 else if(F.used>=(cls=='upper'?3:2))res=no(`That would be the ${nth(F.used+1)} time. We can't keep doing this.`,'They have helped enough.');
 else if(seed<({low:.35,middle:.22,upper:.08}[cls]+(mood=='recession'?.12:0)))res=no(`Honey, we can't right now. ${sits[Math.floor(seed*997)%sits.length]}`,'Their own money is tight.');
 else if(econ.props.length&&eq>=short+2000)res=no(`You own ${money(eq)} of real estate. Sell something before you ask us.`,'You have property you could sell.');
 else if(!econ.salary&&!rents&&(econ.lastGig||0)<day-45)res=no("Get some income going first. A job, gigs, anything. Then call us.",'You have no income.');
 else if(econ.props.some(P=>day-P.bought<60)&&short>0)res=no("You just bought a building and you can't pay your bills?",'You just bought property.');
 else{
  const cap=Math.round(FAM_CAP[cls]*Math.pow(.65,F.used)/100)*100,need=Math.ceil((short+(econ.spend||0))/100)*100,amount=Math.max(300,Math.min(need,cap)),
   monthly=Math.max(50,Math.ceil(amount/(cls=='upper'?24:12)/10)*10),partial=amount<need;
  res={ok:true,amount,monthly,partial,text:`${V()}: "${partial?`This is all we can spare: ${money(amount)}.`:`Here. ${money(amount)}.`} Pay us back ${money(monthly)} a month starting on the 1st. No interest."`};
 }
 F.ask={day,res};return res;
}
function famTake(res){
 const F=famS();addTx(day,'Family lifeline',res.amount);F.used++;F.last=day;F.owed=res.amount;F.ask=null;
 debs().push({id:'fam',label:'Family loan repayment',monthly:res.monthly,left:res.amount,kind:'fam',miss:0});
 econ.log.unshift({d:day,text:res.text});econ.failSnooze=day+3;
}

// ── bankruptcy ──
function bkInfo(){
 const B=bkS(),o=owedInfo(),inc=annualIncome(),med=MEDIAN[econ.city]||55000,disp=dispMonthly(),rents=rentMonthly(),last=B.hist[B.hist.length-1];
 const wait=ch=>last?Math.max(0,last.day+({'7>7':8,'7>13':4,'13>7':6,'13>13':2}[last.ch+'>'+ch])*BK_YEAR-day):0;
 const common=[];
 if(o.total<1000)common.push('You have to actually owe something: at least $1,000 in debts.');
 const dw=Math.max(0,B.dismissed+180-day);if(dw)common.push(`A dismissed case means waiting 180 days to refile (${dw} to go).`);
 const c7=[...common],c13=[...common],yrs=d=>(Math.ceil(d/BK_YEAR*10)/10);
 if(wait(7))c7.push(`Too soon after your Chapter ${last.ch} filing: the law makes you wait ${last.ch==7?8:6} years (${yrs(wait(7))} left).`);
 if(wait(13))c13.push(`Too soon after your Chapter ${last.ch} filing: the law makes you wait ${last.ch==7?4:2} years (${yrs(wait(13))} left).`);
 if(inc>med&&disp>150)c7.push(`Means test failed: ${money(inc)} a year is over the ${money(med)} median and you still have ${money(disp)} a month after expenses.`);
 if(!(econ.salary>0||rents>0))c13.push('Chapter 13 needs regular income: a job or rent.');
 const len=inc>med?60:36,plan=Math.ceil((o.total*.6+BK_FEE13)/len/10)*10;
 if(!c13.length&&plan>Math.max(0,disp))c13.push(`The judge will not confirm a plan you cannot afford. It needs ${money(plan)} a month and you have ${money(Math.max(0,disp))} left after expenses.`);
 const counseled=day-B.counsel<=180;
 const lose=econ.props.length,units=unitsOwned(),keep=Math.min(2500,Math.max(250,Math.max(0,econ.cash))),proceeds=propEquity(),back=Math.max(0,Math.round(Math.max(0,econ.cash-keep)+proceeds-o.total));
 return{o,inc,med,disp,c7,c13,len,plan,counseled,lose,units,keep,proceeds,back};
}
function fileBk(ch){
 const B=bkS(),I=bkInfo(),o=I.o,F=famS();let msg='';
 B.hist.push({ch,day});
 const famOwed=F.owed;
 if(ch==7){
  const pool=Math.max(0,econ.cash-I.keep)+I.proceeds,paid=Math.min(pool,o.total),surplus=pool-paid,props=econ.props.length,units=unitsOwned();
  econ.props=[];econ.ownerOcc=null;econ.mike=false;econ.office=0;econ.hq=0;
  listings.forEach(L=>{L.deal=null;L.counter=null});agenda=agenda.filter(a=>!/^(Closing|Inspection):/.test(a.text));
  econ.bills=[];econ.pastDue=0;econ.rentStrikes=0;econ.lateMonth=false;
  const newCash=I.keep+Math.round(surplus);addTx(day,'Chapter 7 discharge',newCash-econ.cash);
  econ.credit=Math.max(350,Math.min(econ.credit-100,520));econ.rep=Math.max(0,(econ.rep||0)-15);
  econ.autoDeb=debs().filter(D=>D.kind!='fam');F.owed=0;
  econ.autoDeb.push({id:'fee',label:'Bankruptcy attorney and court fees',monthly:Math.round(BK_FEE7/6),left:BK_FEE7,kind:'fee',miss:0});
  if(famOwed>0){F.cut=true}
  try{setStage(0)}catch(e){}
  msg=`<p><b>Chapter 7 discharge granted.</b> The trustee sold ${props?`your ${props} propert${props>1?'ies':'y'} (${units} unit${units>1?'s':''})`:'what could be sold'} and used ${money(Math.round(paid))} to settle ${money(Math.round(o.total))} of debt. The rest was wiped out.</p>
   <p>You kept ${money(newCash)} in cash. Credit score: <b>${econ.credit}</b>. Student loans are not discharged, so ${econ.student>0?`you still owe ${money(econ.student)}`:'that is not a problem for you'}.</p>
   <p>The court let you pay the ${money(BK_FEE7)} in fees over six months. Conventional lenders will not touch you for 4 years, but seller financing, hard money and cash still work.${famOwed>0?`<br>${V()}: "You put us on the list. I understand. It still stings."`:''}</p>`;
 }else{
  const total=Math.round(o.total*.6+BK_FEE13);
  if(econ.cash<0)addTx(day,'Overdraft rolled into your plan',-econ.cash);
  econ.bills=[];econ.pastDue=0;econ.rentStrikes=0;econ.lateMonth=false;
  econ.credit=Math.max(350,Math.min(econ.credit-70,560));econ.rep=Math.max(0,(econ.rep||0)-8);
  B.plan={ch:13,start:day,len:I.len,monthly:I.plan,total,miss:0};
  debs().push({id:'plan',label:'Chapter 13 plan payment',monthly:I.plan,left:total,kind:'plan',miss:0});
  msg=`<p><b>Chapter 13 plan confirmed.</b> You keep every property. You will pay ${money(I.plan)} a month for ${I.len/12} years (${money(total)} in all, which covers 60% of what you owed plus ${money(BK_FEE13)} in attorney and court fees). Whatever is left is discharged when the plan ends.</p>
   <p>Credit score: <b>${econ.credit}</b>. While the plan runs you can buy with cash only, and the trustee has to approve any new debt. Miss three payments and the case is dismissed and the debt comes back.</p>`;
 }
 econ.log.unshift({d:day,text:`You filed Chapter ${ch}.`});econ.failSnooze=0;
 return msg;
}
function endPlan(D,ok){
 const B=bkS();B.plan=null;
 if(ok){B.freeDay=day+2*BK_YEAR;econ.credit=Math.min(850,econ.credit+30);note('Your Chapter 13 plan is complete. The rest of the debt was discharged. Conventional lenders will talk to you again in 2 years.')}
 else{B.dismissed=day;B.freeDay=B.hist[B.hist.length-1].day+4*BK_YEAR;econ.pastDue=(econ.pastDue||0)+Math.round(D.left);econ.credit=Math.max(300,econ.credit-40);
  note(`Your Chapter 13 case was dismissed after missed payments. The remaining ${money(Math.round(D.left))} is back on your books and comes out of your next paychecks.`)}
}

// ── monthly automatic payments: family loan, attorney fees, Chapter 13 plan ──
const _ndF=newDay;
newDay=function(d){_ndF(d);if(!econ.ready||!econ.bills)return;
 if(dom(d)!=1||d<=1)return;
 for(const D of [...debs()]){
  const amt=Math.min(D.monthly,Math.round(D.left));if(amt<=0){econ.autoDeb=debs().filter(x=>x!==D);continue}
  if(econ.cash>=amt){addTx(d,D.label,-amt);D.left-=amt;D.miss=0;if(D.kind=='fam')famS().owed=Math.max(0,Math.round(D.left))}
  else{
   D.miss=(D.miss||0)+1;
   if(D.kind=='fam'){note(`${V()}: "No rush on the ${money(amt)}. Just don't disappear on us."`);if(D.miss>=3){econ.autoDeb=debs().filter(x=>x!==D);famS().cut=true;famS().owed=0;econ.rep=Math.max(0,(econ.rep||0)-3);note('The family wrote off the loan and stopped answering your calls.')}}
   else if(D.kind=='plan'){const B=bkS();B.plan.miss++;note(`Chapter 13 trustee: payment of ${money(amt)} missed (${B.plan.miss} of 3).`);if(B.plan.miss>=3){econ.autoDeb=debs().filter(x=>x!==D);endPlan(D,false);continue}}
   else note(`Your attorney's installment of ${money(amt)} was skipped for lack of funds. It rolls into next month.`);
  }
  if(D.left<=.5){econ.autoDeb=debs().filter(x=>x!==D);if(D.kind=='plan')endPlan(D,true);if(D.kind=='fam'){famS().owed=0;note(`${V()}: "That's the last payment. Proud of you."`)}}
 }
};
{const _up=upcoming;upcoming=function(n){const out=_up(n);
 for(let d=day+1;d<=day+n;d++)if(dom(d)==1)for(const D of debs()){const a=Math.min(D.monthly,Math.round(D.left));if(a>0)out.push({d,label:D.label+' (automatic)',amt:-a})}
 return out.sort((a,b)=>a.d-b.d)}}

// ── lenders after a filing ──
function bkLoanBlock(f){
 const B=econ.bk;if(f=='cash'||!B)return'';
 if(B.plan)return"You are in a Chapter 13 plan, so new debt needs the trustee's approval. Cash deals are fine.";
 const last=B.hist[B.hist.length-1];
 if(f=='conv'&&last){
  if(last.ch==7&&day<last.day+4*BK_YEAR)return`Conventional lenders wait 4 years after a Chapter 7 (${last.day+4*BK_YEAR-day} days left). Hard money, seller financing and cash still work.`;
  if(last.ch==13&&day<(B.freeDay||0))return`Conventional lenders wait ${B.dismissed>=last.day?'4 years after a dismissed Chapter 13':'2 years after a Chapter 13 discharge'} (${B.freeDay-day} days left).`;
 }
 return'';
}
{const _lc=lenderCheck;lenderCheck=function(L,price,f){const r=_lc(L,price,f);const m=bkLoanBlock(f);if(m){r.ok=false;r.reasons.push(m)}return r}}

// ── gigs count as "you are trying" for the family ──
{const _a=act;act=function(a,id){const e0=energy;_a(a,id);
 if(a=='gig'&&energy<e0){econ.gigsDone=(econ.gigsDone||0)+1;econ.lastGig=day}
 if(a=='failopen'){closeDevice();showFail(true)}}}

// ── the screens ──
const runStats=()=>`Day ${day} · net worth ${money(netWorth())} · ${unitsOwned()} unit${unitsOwned()==1?'':'s'}`;
function renderFail(){
 const R=rockBottom(),o=owedInfo();let h='';
 if(failView=='main'){
  const F=famS(),I=bkInfo(),can7=!I.c7.length,can13=!I.c13.length;
  h=`<h2>${R?'Rock bottom':'Money trouble'}</h2><p class="muted">${runStats()}</p>
  <p>${R?R.why:'You are behind, but not yet out of moves.'}</p>
  <div class="wake-sum"><div>Owed <b class="neg">${money(o.total)}</b></div><div>Checking <b class="${econ.cash<0?'neg':''}">${money(econ.cash)}</b></div><div>Free each month <b class="${I.disp<0?'neg':''}">${money(I.disp)}</b></div></div>
  <div class="fopts">
   <div class="fopt"><h3>Family lifeline</h3><p>Call home and ask for a loan. They can say no, because of where they are or where you are.</p><p class="fine">${F.used?`Asked ${F.used} time${F.used>1?'s':''} so far.`:'You have not asked yet.'}</p><button class="act" data-f="fam">Call home</button></div>
   <div class="fopt"><h3>Bankruptcy</h3><p>A legal reset, with rules. ${can7||can13?'You may qualify.':'You do not qualify right now.'}</p><p class="fine">${can7?'Chapter 7: wipes debts, sells your property. ':''}${can13?'Chapter 13: repayment plan, keeps property.':''}</p><button class="act" data-f="bk">See the options</button></div>
   <div class="fopt"><h3>Start over</h3><p>Walk away and roll a new life. This run ends here.</p><p class="fine">Your best run is remembered.</p><button class="act ghost" data-f="over">Start over</button></div>
  </div>
  <p style="margin-top:8px"><button class="link" data-f="snooze">Not yet, I'll dig out (ask me again in 10 days)</button></p>`;
 }else if(failView=='fam'){
  const r=famAsk();
  h=`<h2>${r.ok?'They said yes':'They said no'}</h2><p>${r.text}</p>
  ${r.ok?`<div class="wake-sum"><div>You get <b class="pos">${money(r.amount)}</b></div><div>You repay <b>${money(r.monthly)}</b> a month from the 1st</div></div><p class="fine">It lands in checking. Pay your bills in the Bank app. If you skip three repayments in a row, the family stops answering.</p><button class="act" data-f="famyes">Take it</button> `
   :`<p class="fine">Why: ${r.why}</p>`}<button class="act ghost" data-f="back">Back</button>`;
 }else if(failView=='bk'){
  const I=bkInfo(),B=bkS(),okc=I.counseled;
  h=`<h2>Bankruptcy</h2><p class="fine">Filing is legal and it is not a crime. Hiding assets or lying on the forms is federal bankruptcy fraud: up to 5 years in prison and a $250,000 fine. Fees and thresholds here are simplified.</p>
  <div class="cols2"><div class="fopt"><h3>Chapter 7</h3><p>Liquidation. Debts are wiped, but a trustee sells everything not exempt, rentals included.</p>
   <ul class="chk">${I.c7.length?I.c7.map(x=>`<li class="neg">✗ ${x}</li>`).join(''):`<li class="pos">✓ Eligible (means test passed)</li>`}</ul>
   <p class="fine">You would lose ${I.lose?`${I.lose} propert${I.lose>1?'ies':'y'} (${I.units} units)`:'no property'}, keep about ${money(I.keep)}${I.back?` plus the ${money(I.back)} left after the sale pays your debts`:''}, and pay ${money(BK_FEE7)} in fees over 6 months. Credit falls to about 520. Ch7 to Ch7 needs 8 years.</p>
   <button class="act" data-f="c7" ${I.c7.length||!okc?'disabled':''}>File Chapter 7</button></div>
  <div class="fopt"><h3>Chapter 13</h3><p>A ${I.len/12}-year repayment plan. You keep your property and pay about 60% of what you owe plus fees.</p>
   <ul class="chk">${I.c13.length?I.c13.map(x=>`<li class="neg">✗ ${x}</li>`).join(''):`<li class="pos">✓ Eligible (plan: ${money(I.plan)} a month)</li>`}</ul>
   <p class="fine">Cash purchases only while the plan runs. Three missed payments and it is dismissed.</p>
   <button class="act" data-f="c13" ${I.c13.length||!okc?'disabled':''}>File Chapter 13</button></div></div>
  <p style="margin-top:8px">${okc?'<span class="pos">✓ Credit counseling done.</span>':`Required first: a credit counseling course from an approved agency (2 hours, ${econ.cash>=25?'$25':'free if you cannot pay'}). <button class="act" data-f="counsel">Take the course</button>`}</p>
  <button class="act ghost" data-f="back">Back</button>`;
 }else if(failView=='conf7'||failView=='conf13'){
  const ch=failView=='conf7'?7:13,I=bkInfo();
  h=`<h2>File Chapter ${ch}?</h2>${ch==7?`<p>The trustee will sell ${I.lose?`all ${I.lose} of your propert${I.lose>1?'ies':'y'} (${I.units} units)`:'anything you own that is not exempt'} and reset your headquarters to your starting home. You keep about ${money(I.keep)}. Student loans stay.</p>`
   :`<p>You will pay ${money(I.plan)} a month for ${I.len/12} years. You keep your properties, but you cannot borrow, only pay cash, until it ends.</p>`}
  <p class="fine">This cannot be undone. You will not be able to file again for ${ch==7?'4 to 8':'2 to 6'} years.</p>
  <button class="act" data-f="file${ch}">Yes, file Chapter ${ch}</button> <button class="act ghost" data-f="bk">Go back</button>`;
 }else if(failView=='done'){
  h=`<h2>Filed</h2>${failMsg}<button class="act" data-f="close">Start the day</button>`;
 }else if(failView=='over'){
  const best=readBest();
  h=`<h2>Start over?</h2><p>This run ends. ${runStats()}.</p>${best?`<p class="muted">Best run so far: ${best}</p>`:''}<p class="fine">You will roll a brand new life. Your saved game is deleted.</p>
  <button class="act" data-f="overyes">Yes, start over</button> <button class="act ghost" data-f="back">Back</button>`;
 }
 failEl.innerHTML=`<div class="wake-card fail-card" role="dialog" aria-labelledby="failT">${h.replace('<h2>','<h2 id="failT">')}</div>`;
}
function readBest(){try{const b=JSON.parse(lsGet('jt.best')||'null');return b?`day ${b.day}, net worth ${money(b.nw)}, ${b.units} units`:''}catch(e){return''}}
function saveBest(){try{const b=JSON.parse(lsGet('jt.best')||'null'),cur={day,nw:Math.round(netWorth()),units:unitsOwned()};if(!b||cur.nw>b.nw)lsSet('jt.best',JSON.stringify(cur))}catch(e){}}
function showFail(fromBank){failView='main';failFrom=!!fromBank;failEl.hidden=false;mode='roll';renderFail();setTimeout(()=>{const b=failEl.querySelector('button');b&&b.focus({preventScroll:true})},30)}
function closeFail(){failEl.hidden=true;if(mode=='roll')mode='free';setTimeout(()=>saveGame(),0)}
failEl.addEventListener('click',e=>{const b=e.target.closest('[data-f]');if(!b||b.disabled)return;const k=b.dataset.f;
 if(k=='fam'||k=='bk'||k=='over'||k=='back'||k=='conf7'||k=='conf13'){failView=k=='back'?'main':k;renderFail();return}
 if(k=='c7'||k=='c13'){failView='conf'+k.slice(1);renderFail();return}
 if(k=='famyes'){famTake(famS().ask.res);say(`${money(econ.cash)} in checking now.`);closeFail();return}
 if(k=='counsel'){const B=bkS();if(econ.cash>=25)addTx(day,'Credit counseling course',-25);spend(2,0);B.counsel=day;renderFail();return}
 if(k=='file7'||k=='file13'){failMsg=fileBk(k=='file7'?7:13);failView='done';renderFail();return}
 if(k=='snooze'){econ.failSnooze=day+10;closeFail();say('You are not out of moves yet. Bank app > Get help brings this back any time.');return}
 if(k=='close'){closeFail();say(`Day ${day}. A fresh start, or at least a plan.`);return}
 if(k=='overyes'){saveBest();wiping=true;lsDel(SAVE_KEY);location.reload()}
});
addEventListener('keydown',e=>{if(mode=='roll'&&!failEl.hidden&&e.key=='Escape'){e.preventDefault();if(failView=='main'){econ.failSnooze=day+10;closeFail()}else{failView='main';renderFail()}}});
setInterval(()=>{if(mode!='free'||!econ.ready||!life||seq||walk||moveCard||!failEl.hidden)return;if(failDue()){saveBest();showFail(false)}},1500);

// ── Bank app: always a way in ──
{const _r=A('bank').render;A('bank').render=function(){let h=_r.call(this);
 if(econ.cash<0||econ.bills.some(b=>b.late)||rockBottom())h+=`<p><button class="act ghost" data-act="failopen:0">Get help: family, bankruptcy, start over</button></p>`;
 const dd=debs();if(dd.length)h+=`<div class="label">Payment plans (automatic on the 1st)</div><table>${dd.map(D=>`<tr><td>${D.label}</td><td class="n">${money(D.monthly)}/mo</td><td class="n">${money(Math.round(D.left))} left</td></tr>`).join('')}</table>`;
 return h}}
/*@@ module fail.js end @@*/
requestAnimationFrame(frame);
