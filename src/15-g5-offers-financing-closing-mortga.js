/* ───────────── G5: offers, financing, closing, mortgages ───────────── */
const FIN={
 fha:{name:'FHA (live in it)',down:.035,rate:.065,mip:.0055,minCredit:580,dti:.5,occ:true,job:true},
 conv:{name:'Investor loan',down:.25,rate:.0725,minCredit:620,dti:.45,job:true},
 hard:{name:'Hard money',down:.1,rate:.12,points:.03,minCredit:0,dti:9,fixer:true},
 cash:{name:'All cash',down:1,rate:0,minCredit:0,dti:9}};
const _initEcon5=initEcon;initEcon=function(L){_initEcon5(L);Object.assign(econ,{props:[],sup:L.sup,cosignUsed:false,ownerOcc:null})};
const propPITI=P=>P.pay+P.mip+(P.tax+P.ins)/12;
function lenderCheck(L,price,f){
 const F=FIN[f],cos=econ.sup=='cosign'&&!econ.cosignUsed,net=econ.sup=='network';
 const loan=price*(1-F.down),rate=Math.max(0,F.rate-(net&&F.rate?.0025:0)),pay=!loan?0:f=='hard'?loan*rate/12:mortgage(loan,rate),mip=loan*(F.mip||0)/12;
 const piti=pay+mip+(L.tax+L.ins)/12,cashNeed=price*F.down+price*.03+loan*(F.points||0);
 const rentCredit=(F.occ?L.units-1:L.units)*L.rentU*.75,gross=econ.salary/12+rentCredit;
 const other=econ.car+econ.loanPay+econ.props.reduce((s,P)=>s+propPITI(P)-P.units_.filter(u=>!u.you).length*P.rentU*.75,0);
 const dti=gross>0?(other+piti)/gross:9,reasons=[];let usedCosign=false;
 if(F.job&&!econ.salary)reasons.push('Lenders want a steady job, not just gigs.');
 if(econ.credit<F.minCredit){if(cos&&econ.credit>=F.minCredit-40)usedCosign=true;else reasons.push(`Needs a ${F.minCredit}+ credit score.`)}
 if(dti>F.dti){if(cos&&dti<=F.dti+.1)usedCosign=true;else reasons.push(`Debt-to-income would be ${pct(dti)} (max ${pct(F.dti)}).`)}
 if(F.occ&&econ.ownerOcc)reasons.push('FHA only covers the one home you live in.');
 if(F.fixer&&!['asis','cosmetic'].includes(L.cond))reasons.push('Hard money only funds fixer-uppers.');
 if(cashNeed>econ.cash)reasons.push(`You need ${money(cashNeed)} to close and have ${money(econ.cash)}.`);
 return{ok:!reasons.length,reasons,loan,rate,pay,mip,piti,cashNeed,dti,usedCosign}}
function sellerDecides(L,price){
 const th={low:.97,medium:.92,high:.85}[L.motive]-(L.dom>45?.03:0)-(mood=='recession'?.04:0)+(mood=='boom'?.03:0)-(hasTrait('Silver tongue')?.02:0)-((L.fin||'conv')=='cash'?.02:0),r=price/L.price;
 if(r>=th)return{res:'accept'};if(r>=th-.08)return{res:'counter',price:Math.round(L.price*(th+r)/2/500)*500};return{res:'reject'}}
function startEscrow(L,price){
 const f=L.fin||'conv',chk=lenderCheck(L,price,f);if(!chk.ok){devMsg='Lender: '+chk.reasons.join(' ');return}
 const earnest=Math.round(price*.01);if(econ.cash<earnest+(L.insp?450:0)){devMsg='Not enough cash for the earnest money deposit.';return}
 addTx(day,'Earnest money: '+L.addr,-earnest);if(L.insp)addTx(day,'Home inspection',-450);
 L.deal={price,fin:f,closeDay:day+10,insp:!!L.insp,inspDay:day+2,inspDone:false,newCost:0,credit:0,earnest,asked:false};L.counter=null;
 agenda.push({day:L.deal.closeDay,text:'Closing: '+L.addr});if(L.insp)agenda.push({day:L.deal.inspDay,text:'Inspection: '+L.addr});agenda.sort((a,b)=>a.day-b.day);
 devMsg=`Offer accepted at ${money(price)}! Closing is on day ${L.deal.closeDay}. Keep ${money(chk.cashNeed-earnest)} in the bank until then.`;econ.log.unshift({d:day,text:devMsg})}
function closeDeal(L){
 const D=L.deal,chk=lenderCheck(L,D.price,D.fin),due=Math.round(chk.cashNeed-D.earnest-D.credit);
 if(econ.cash<due||(!chk.ok&&chk.reasons.some(r=>!r.startsWith('You need')))){note(`Closing on ${L.addr} fell through. ${econ.cash<due?`You were ${money(due-econ.cash)} short at the table.`:chk.reasons.join(' ')} Earnest money lost.`);L.deal=null;return}
 addTx(day,'Closing: '+L.addr,-due);
 const P={id:L.id,addr:L.addr,typeName:L.typeName,units:L.units,grade:L.grade,price:D.price,value:D.price,loan:chk.loan,rate:chk.rate,pay:chk.pay,mip:chk.mip,tax:L.tax,ins:L.ins,rentU:L.rentU,fin:D.fin,io:D.fin=='hard',
  issues:[...L.issues],known:[...(L.found||[])],cond:L.cond,units_:Array.from({length:L.units},(_,i)=>({you:D.fin=='fha'&&i==0,occ:L.cond=='tenant'&&!(D.fin=='fha'&&i==0),rent:L.cond=='tenant'?L.curRentU:0}))};
 econ.props.push(P);listings=listings.filter(x=>x!==L);watch.delete(L.id);if(chk.usedCosign)econ.cosignUsed=true;
 if(D.fin=='fha'){econ.rent=0;econ.ownerOcc=P.id;STAGES[0].name=`Your ${L.typeName.toLowerCase()} · ${L.addr}`;if(si==0)$('stageName').textContent=STAGES[0].name}
 note(`Keys in hand: you own ${L.addr}! ${money(due)} paid at closing.${D.fin=='fha'?' You move in this week, and your old rent is gone.':''}`)}
function offerPanel(L){
 if(L.deal){const D=L.deal;
  return`<div class="card"><div class="label">Under contract</div>${money(D.price)} with ${FIN[D.fin].name}. Closing on day ${D.closeDay}.
  ${D.insp?(D.inspDone?(D.newCost>0&&!D.asked?`<br>Inspection found ${money(D.newCost)} more in repairs. <button class="act" data-act="lcredit:${L.id}">Ask for a repair credit</button> <button class="act ghost" data-act="lwalk:${L.id}">Walk away</button>`:'<br>Inspection done.'):`<br>Inspection on day ${D.inspDay}.`):''}
  ${D.credit?`<br>Seller credit at closing: ${money(D.credit)}.`:''}</div>`}
 const f=L.fin||'conv',chk=lenderCheck(L,L.price,f);
 return`<div class="card"><div class="label">Make an offer</div><p>${Object.keys(FIN).map(k=>`<button class="act ${k==f?'':'ghost'}" data-act="lfin:${L.id}|${k}">${FIN[k].name}</button>`).join(' ')}</p>
 <p class="${chk.ok?'pos':'neg'}">${chk.ok?`Lender: approved. At asking price you'd need ${money(chk.cashNeed)} to close and pay ${money(chk.piti)} a month including taxes and insurance (debt-to-income ${pct(Math.min(chk.dti,9))}).${chk.usedCosign?' Your parent co-signs.':''}`:'Lender: '+chk.reasons.join(' ')}</p>
 <p><button class="act ${L.insp?'':'ghost'}" data-act="linsp:${L.id}">${L.insp?'☑':'☐'} Inspection contingency ($450)</button> <span class="muted">A pro finds everything, and you can back out.</span></p>
 ${L.counter?`<p class="warn">Seller countered at ${money(L.counter)}. <button class="act" data-act="lacc:${L.id}">Accept ${money(L.counter)}</button></p>`:''}
 <p>Offer: ${[.85,.9,.95,1].map(r=>`<button class="act" data-act="loffer:${L.id}|${r}">${money(Math.round(L.price*r/500)*500)}</button>`).join(' ')}</p></div>`}
const _lh5=listingHTML;listingHTML=function(L){let h=_lh5(L);if(lDetail==L.id||L.deal)h+=offerPanel(L);return h};
const _act5=act;
act=function(a,id){
 const[i,arg]=String(id).split('|'),L=listings.find(x=>x.id==+i);
 if(a=='lfin'){L.fin=arg;devMsg='';return}
 if(a=='linsp'){L.insp=!L.insp;devMsg='';return}
 if(a=='loffer'){const price=Math.round(L.price*+arg/500)*500,chk=lenderCheck(L,price,L.fin||'conv');if(!chk.ok){devMsg='Lender: '+chk.reasons.join(' ');return}
  const r=sellerDecides(L,price);if(r.res=='accept')startEscrow(L,price);else if(r.res=='counter'){L.counter=r.price;devMsg=`Seller's agent: "We can do ${money(r.price)}."`}else devMsg=`Seller's agent: "My client won't go that low. ${L.motive=='high'?'They might move a little, though.':'They are in no rush.'}"`;return}
 if(a=='lacc'){startEscrow(L,L.counter);return}
 if(a=='lcredit'){const D=L.deal,sh={high:1,medium:.6,low:.3}[L.motive];D.credit=Math.round(D.newCost*sh/100)*100;D.asked=true;devMsg=D.credit?`Seller agreed to a ${money(D.credit)} credit at closing.`:'Seller refused any credit.';return}
 if(a=='lwalk'){addTx(day,'Earnest money refunded',L.deal.earnest);agenda=agenda.filter(e=>!e.text.endsWith(L.addr));L.deal=null;devMsg='You walked away. Earnest money refunded thanks to the inspection contingency.';return}
 _act5(a,id)};
const _newDay5=newDay;
newDay=function(d){_newDay5(d);if(!econ.ready)return;
 for(const L of [...listings]){const D=L.deal;if(!D)continue;
  if(D.insp&&!D.inspDone&&d>=D.inspDay){D.inspDone=true;const known=Math.max((L.found||[]).reduce((s,x)=>s+x.cost,0),L.sellerRehab);L.found=[...L.issues];L.walked=true;D.newCost=Math.max(0,L.issues.reduce((s,x)=>s+x.cost,0)-known);
   note(`Inspection report for ${L.addr}: ${L.issues.map(x=>x.name).join(', ')}.${D.newCost>0?` That's ${money(D.newCost)} more than you expected.`:' No surprises.'}`)}
  if(d>=D.closeDay)closeDeal(L)}
 if(dom(d)==1&&d>1)for(const P of econ.props){  P.value=Math.round(P.value*(1+{normal:.003,boom:.007,recession:-.006}[mood]))}};
APPS.push({id:'port',name:'Portfolio',col:'#d8b050',render(){
 if(!econ.props.length)return toast()+`<h3>Portfolio</h3><p class="muted">You don't own anything yet. Find a deal in Listings, walk it, then make an offer.</p>`;
 return toast()+`<h3>Portfolio</h3>`+econ.props.map(P=>`<div class="card"><b>${P.addr}</b> <span class="muted">${P.typeName} · ${GRADE[P.grade].label}${P.fin=='fha'?' · you live here':''}</span><table>
 <tr><td>Value · loan · equity</td><td class="n">${money(P.value)} · ${money(P.loan)} · <span class="pos">${money(P.value-P.loan)}</span></td></tr>
 <tr><td>Mortgage, taxes, insurance</td><td class="n neg">-${money(propPITI(P))}/mo</td></tr>
 <tr><td>Units</td><td class="n">${P.units_.map(u=>u.you?'You':u.occ?'Rented '+money(u.rent):'Vacant').join(' · ')}</td></tr></table></div>`).join('')}});
