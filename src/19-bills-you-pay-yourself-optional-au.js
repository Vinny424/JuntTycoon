/* ───────────── Bills you pay yourself (optional autopay) + wealth-based starting stage ───────────── */
const _initEconB=initEcon;
initEcon=function(L){_initEconB(L);const c=L.city.cost;
 econ.phoneBill=Math.round(85*c/5)*5;econ.utilBill=Math.round(130*c/5)*5;econ.spend=Math.max(250,econ.living-econ.phoneBill-econ.utilBill);
 Object.assign(econ,{bills:[],autopay:new Set(),billId:0,lateMonth:false})};
function billSpecs(){const L=[];
 if(econ.rent)L.push(['rent','Rent',econ.rent,'rent']);
 if(econ.car)L.push(['car','Car payment',econ.car,'loan']);
 if(econ.loanPay&&econ.student>0)L.push(['student','Student loan',econ.loanPay,'loan']);
 L.push(['phone','Phone and internet',econ.phoneBill,'utility'],['util','Electric, gas and water',econ.utilBill,'utility']);
 for(const P of econ.props||[])L.push(['mort:'+P.id,'Mortgage, taxes, insurance: '+P.addr,Math.round(propPITI(P)),'mortgage',P.id]);
 if(econ.office)L.push(['office','Office lease',econ.office,'office']);
 if(econ.mike)L.push(['payroll','Payroll: Mike',3000,'payroll']);
 return L}
function payBill(b,auto){
 if(econ.cash<b.amt)return false;addTx(day,(auto?'Autopay: ':'')+b.label,-b.amt);b.paid=true;
 if(b.key=='student')econ.student=Math.max(0,econ.student-Math.round(b.amt*.6));
 if(b.kind=='mortgage'){const P=econ.props.find(p=>p.id==b.ref);if(P&&!P.io&&P.loan>0)P.loan=Math.max(0,P.loan-(P.pay-P.loan*P.rate/12))}
 econ.bills=econ.bills.filter(x=>!x.paid);return true}
function issueBills(d){
 if(!econ.lateMonth){const up=Math.max(1,Math.round(rint(2,6)*(850-econ.credit)/250));econ.credit=Math.min(850,econ.credit+up)}econ.lateMonth=false;
 addTx(d,'Everyday spending (groceries, gas)',-econ.spend);if(econ.cash<0)addTx(d,'Overdraft fee',-35);
 for(const[key,label,amt,kind,ref]of billSpecs()){const b={id:++econ.billId,key,label,amt,kind,ref,due:d+4,late:false,reported:false};econ.bills.push(b);
  if(econ.autopay.has(key)&&!payBill(b,true))note(`Autopay failed for ${label}: not enough in checking.`)}
 const n=econ.bills.length;note(n?`First of the month: ${n} bill${n>1?'s':''} due by day ${d+4}. Pay them in the Bank app on your computer or phone.`:'First of the month: every bill was paid by autopay.')}
const _newDayB=newDay;
newDay=function(d){_newDayB(d);if(!econ.ready||!econ.bills)return;
 for(const b of econ.bills){
  if(!b.late&&d>b.due){b.late=true;econ.lateMonth=true;const fee=b.kind=='rent'?75:b.kind=='mortgage'?Math.round(b.amt*.05):35;b.amt+=fee;
   if(b.kind=='rent'){econ.rentStrikes++;note(econ.rentStrikes>=2?'Landlord: "Second late rent. Next step is an eviction filing."':'Landlord: "Rent is late. $75 late fee added."')}else note(`${b.label} is late. ${money(fee)} late fee added.`)}
  if(!b.reported&&d>b.due+26&&['loan','mortgage','utility'].includes(b.kind)){b.reported=true;const hit=b.kind=='mortgage'?rint(60,90):b.kind=='utility'?rint(15,30):rint(40,70);econ.credit=Math.max(300,econ.credit-hit);note(`${b.label} is 30 days late and was reported to the credit bureaus: -${hit} points.`)}}};
upcoming=function(n){const out=[];for(let d=day+1;d<=day+n;d++){if(econ.salary>0&&d%14==0)out.push({d,label:'Paycheck',amt:paycheck()});
 if(dom(d)==1){out.push({d,label:'Everyday spending (automatic)',amt:-econ.spend});billSpecs().forEach(([k,l,a])=>out.push({d,label:l+(econ.autopay.has(k)?' (autopay)':' (bill)'),amt:-a}))}}return out};
Object.defineProperty(A('bank'),'name',{get:()=>'Bank'+(econ.bills&&econ.bills.length?` (${econ.bills.length})`:'')});
A('bank').render=function(){
 const [cl,cc]=CRED(econ.credit),dc=econ.credit-econ.creditStart,up=upcoming(30),proj=econ.cash+up.reduce((s,u)=>s+u.amt,0)-econ.bills.reduce((s,b)=>s+b.amt,0);
 const due=econ.bills.reduce((s,b)=>s+b.amt,0);
 return toast()+`<h3>${econ.bank}</h3>
 <div class="cards"><div class="card"><div class="label">Checking balance</div><div class="big ${econ.cash<0?'neg':''}">${money(econ.cash)}</div><div class="muted">Month ${monthOf(day)}, day ${dom(day)}</div></div>
 <div class="card"><div class="label">Credit score</div><div class="big ${cc}">${econ.credit}</div><div>${cl} · <span class="${dc>=0?'pos':'neg'}">${dc>=0?'+':''}${dc} since you started</span></div></div></div>
 <div class="label">Bills due</div>
 ${econ.bills.length?`<table>${econ.bills.map(b=>`<tr><td>${b.label}</td><td>${b.late?`<span class="neg">Late</span>`:`Due day ${b.due}`}</td><td class="n">${money(b.amt)}</td><td class="n"><button class="act" data-act="bpay:${b.id}" ${econ.cash>=b.amt?'':'disabled'}>Pay</button></td></tr>`).join('')}</table>
  <p><button class="act" data-act="bpayall:0" ${econ.cash>=due?'':'disabled'}>Pay all (${money(due)})</button>${econ.cash<due?' <span class="warn">Not enough in checking to pay everything.</span>':''}</p>`:'<p class="pos">Nothing due. You are all caught up.</p>'}
 <div class="label">Autopay</div><p class="muted">Off by default. Autopay pays the bill on the 1st if the money is there.</p>
 <table>${billSpecs().map(([k,l,a])=>`<tr><td>${l}</td><td class="n">${money(a)}/mo</td><td class="n"><button class="act ${econ.autopay.has(k)?'':'ghost'}" data-act="bauto:${k}">${econ.autopay.has(k)?'☑ On':'☐ Off'}</button></td></tr>`).join('')}</table>
 <div class="label">Next 30 days</div><table>${up.map(u=>row(u.d,u.label,u.amt)).join('')}</table>
 <p>Projected balance on day ${day+30}: <b class="${proj<0?'neg':'pos'}">${money(proj)}</b>${proj<0?' <span class="warn">You will come up short. Pick up work or cut costs.</span>':''}</p>
 <div class="label">Recent activity</div><table>${econ.tx.slice(0,8).map(t=>row(t.d,t.label,t.amt)).join('')}</table>
 <div class="label">Debts</div><table><tr><td>Student loans</td><td class="n">${econ.student?money(econ.student):'None'}</td></tr><tr><td>Car loan</td><td class="n">${econ.car?money(econ.car)+' a month':'None'}</td></tr></table>
 ${econ.done.has('finance')&&econ.student>0?`<p><button class="act" data-act="extra">Pay $500 extra on student loans</button></p>`:''}
 <p class="muted">Late bills cost a fee after the due date. Loans, mortgages and utilities that are 30 days late get reported and hurt your credit.</p>`};
const _actB=act;
act=function(a,id){
 if(a=='bpay'){const b=econ.bills.find(x=>x.id==+id);devMsg=b&&payBill(b)?`Paid: ${b.label}.`:'Not enough in checking.';return}
 if(a=='bpayall'){let n=0;for(const b of [...econ.bills])if(payBill(b))n++;devMsg=`Paid ${n} bill${n==1?'':'s'}.`;return}
 if(a=='bauto'){econ.autopay.has(id)?econ.autopay.delete(id):econ.autopay.add(id);devMsg=`Autopay ${econ.autopay.has(id)?'on':'off'}.`;return}
 _actB(a,id)};
// starting stage follows starting wealth and income (the Estate and penthouse must be earned)
const _beginB=beginB.onclick;
beginB.onclick=function(){_beginB();const nw=life.cash-life.student,inc=life.salary,s=nw>=100000&&inc>=100000?2:nw>=25000||inc>=85000?1:0;
 if(s>0){econ.hq=s;setStage(s);STAGES[s].cash=money(econ.cash);say(`${CLASS_TXT[life.cls]} With ${money(nw)} to your name and a ${money(inc)} salary, you start out working from ${HQ[s].name.toLowerCase()}.`)}};
