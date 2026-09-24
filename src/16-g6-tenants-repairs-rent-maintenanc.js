/* ───────────── G6: tenants, repairs, rent, maintenance, management ───────────── */
const TNAMES=['Maria','James','Aaliyah','Chen','Devon','Priya','Luis','Tasha','Ben','Fatima','Marcus','Grace','Andre','Hana','Tyler','Rosa','Kofi','Emily','Omar','Jade','Sam','Nia','Victor','Leah'];
// source-of-income protection by city (Harbor City's state bans refusing voucher holders; Palo Verde's state preempts local bans)
const SOI={'Millbrook':false,'Palo Verde':false,'Harbor City':true};
const PSTD={D:1.1,C:1.0,B:.92}; // voucher payment standard vs. market rent: above market in rough areas, below in good ones
const UL=i=>'Unit '+'ABCD'[i];
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
function genTenant(P,rent,forceNoVoucher){
 const v=!forceNoVoucher&&Math.random()<{D:.35,C:.22,B:.1}[P.grade],credit=clamp(Math.round({D:600,C:650,B:700}[P.grade]+gauss()*60),480,820);
 const incomeX=v?rint(15,30)/10:clamp(2+gauss()*.7,1.2,5),evict=Math.random()<{D:.12,C:.06,B:.03}[P.grade],pets=Math.random()<.35;
 const rel=clamp(.97-(credit<600?.1:0)-(incomeX<2.5?.08:0)-(evict?.15:0)+gauss()*.03,.5,.99);
 return{name:`${TNAMES[rint(0,TNAMES.length-1)]} ${String.fromCharCode(65+rint(0,25))}.`,voucher:v,credit,incomeX:Math.round(incomeX*10)/10,evict,pets,rel,
  dmg:clamp(.2+(pets?.1:0)+(evict?.2:0)+gauss()*.1,.05,.8),stayM:v?rint(24,72):rint(10,36),refs:rel>.9?'Glowing references':rel>.8?'Solid references':'Previous landlord was vague',rent,late:0}}
const vRent=(P,ask)=>Math.min(ask,Math.round(P.rentU*PSTD[P.grade]/5)*5);
function moveIn(P,u,T,d){u.t=T;u.occ=true;u.rent=T.voucher?vRent(P,T.rent):T.rent;T.since=d;T.until=d+T.stayM*30;T.hapStart=d+30;u.listing=null;u.pending=null}
function ensureTenants(P){P.units_.forEach(u=>{if(u.occ&&!u.t&&!u.you){const T=genTenant(P,u.rent,true);T.since=day;T.until=day+rint(3,12)*30;T.hapStart=day;u.t=T}})}
function repairCost(P){return P.issues.reduce((s,i)=>s+i.cost,0)*(hasTrait('Handy')?.8:1)}
function startRehab(P){
 const known=P.known.reduce((s,i)=>s+i.cost,0),truth=P.issues.reduce((s,i)=>s+i.cost,0),cost=Math.round(repairCost(P));
 if(econ.cash<cost)return devMsg=`The contractor wants ${money(cost)} up front. You have ${money(econ.cash)}.`;
 addTx(day,'Contractor: '+P.addr,-cost);const days=clamp(Math.round(truth/1500),3,45);P.rehab={until:day+days,cost:truth};
 const surprise=P.issues.filter(i=>!P.known.includes(i));
 devMsg=`Work starts today and takes ${days} days.${surprise.length?` The contractor opened the walls and found more: ${surprise.map(i=>i.name).join(', ')} (+${money(truth-known)} vs. what you knew).`:''}`;
 econ.log.unshift({d:day,text:devMsg});P.known=[...P.issues]}
const _act6=act;
act=function(a,id){
 const[pi,ui,x]=String(id).split('|'),P=econ.props?.find(p=>p.id==+pi),u=P?.units_[+ui];
 if(a=='prehab'){startRehab(P);return}
 if(a=='plist'){const r=Math.round(P.rentU*+x/5)*5;u.listing={rent:r,since:day,apps:[]};devMsg=`${UL(+ui)} listed at ${money(r)} a month.`;return}
 if(a=='punlist'){u.listing=null;devMsg='Listing taken down.';return}
 if(a=='pacc'){const T=u.listing.apps[+x];if(T.voucher){u.pending={t:T,day:day+rint(5,12),insp:true};devMsg=`Accepted ${T.name}. The housing authority will inspect the unit on day ${u.pending.day}.`}else{u.pending={t:T,day:day+3};devMsg=`Accepted ${T.name}. Move-in on day ${u.pending.day}.`}u.listing=null;return}
 if(a=='pdec'){const T=u.listing.apps[+x],others=T.credit>=580&&T.incomeX>=(T.voucher?1.5:2.5)&&!T.evict;
  if(T.voucher&&SOI[econ.city]&&others){devMsg=`You can't turn ${T.name} down for using a voucher. That's illegal source-of-income discrimination in ${econ.city}, and they otherwise meet your criteria.`;return}
  u.listing.apps.splice(+x,1);devMsg=`Declined ${T.name}.`;return}
 if(a=='pevict'){if(econ.cash<2000)return devMsg='Filing an eviction costs about $2,000 in court and attorney fees.';addTx(day,'Eviction filing: '+P.addr,-2000);u.t.evicting=day+45;devMsg=`Eviction filed. Expect it to take about 45 days.`;return}
 if(a=='ppm'){P.pm=!P.pm;devMsg=P.pm?'Hired a property manager for 8% of rent. They screen tenants and handle repair calls.':'You manage it yourself again.';return}
 _act6(a,id)};
const _newDay6=newDay;
newDay=function(d){
 if(econ.ready&&econ.props&&dom(d)==1&&d>1){let got=0,late=[];
  for(const P of econ.props){ensureTenants(P);P.units_.forEach((u,i)=>{const T=u.t;if(!u.occ||!T||u.you)return;let paid=0;
   if(T.voucher){if(d>=T.hapStart)paid+=u.rent*.7;if(Math.random()<T.rel)paid+=u.rent*.3;else{T.late++;late.push(`${T.name} (${P.addr} ${UL(i)})`)}}
   else if(Math.random()<T.rel){paid=u.rent;T.late=Math.max(0,T.late-1)}else{T.late++;late.push(`${T.name} (${P.addr} ${UL(i)})`)}
   if(paid){paid=Math.round(paid);addTx(d,`Rent: ${P.addr} ${UL(i)}`,paid);got+=paid;if(P.pm)addTx(d,'Property manager fee',-Math.round(paid*.08))}})}
  if(got||late.length)note(`Rent day: ${money(got)} collected.${late.length?` Late: ${late.join(', ')}.`:''}`)}
 _newDay6(d);if(!econ.ready||!econ.props)return;
 for(const P of econ.props){ensureTenants(P);
  if(P.rehab&&d>=P.rehab.until){P.value+=Math.round(P.rehab.cost*1.3);P.issues=[];P.known=[];P.cond='reno';P.rehab=null;note(`Repairs finished at ${P.addr}. It's worth about ${money(P.value)} now.`)}
  P.units_.forEach((u,i)=>{const T=u.t;
   if(u.listing){const r=u.listing.rent/P.rentU,pr=r<.95?.6:r<=1.02?.35:.15;if(u.listing.apps.length<4&&Math.random()<pr)u.listing.apps.push(genTenant(P,u.listing.rent));
    if(P.pm&&u.listing.apps.length>=2){const legal=[...u.listing.apps].sort((a,b)=>b.rel-a.rel)[0];u.pending={t:legal,day:d+(legal.voucher?rint(5,12):3),insp:legal.voucher};u.listing=null;note(`Property manager placed ${legal.name} in ${P.addr} ${UL(i)}.`)}}
   if(u.pending&&d>=u.pending.day){const pd=u.pending;if(pd.insp&&P.issues.length){pd.day=d+7;note(`${P.addr} ${UL(i)} failed the housing authority inspection (${P.issues[0].name}). Fix it, and they re-inspect in 7 days.`)}
    else{moveIn(P,u,pd.t,d);note(`${pd.t.name} moved into ${P.addr} ${UL(i)} at ${money(u.rent)} a month${pd.t.voucher?' (housing authority pays 70%)':''}.`)}}
   if(T&&!u.you){
    if(T.evicting&&d>=T.evicting){const c=Math.round((600+2400*T.dmg)/50)*50;addTx(d,'Turnover repairs after eviction',-c);u.t=null;u.occ=false;note(`The eviction at ${P.addr} ${UL(i)} is complete. Turnover repairs: ${money(c)}.`);return}
    if(d>=T.until){if(Math.random()<.45&&!T.late){T.until=d+360;note(`${T.name} renewed their lease at ${P.addr} ${UL(i)}.`)}else{const c=Math.round((300+1800*T.dmg)/50)*50;addTx(d,'Turnover: clean, paint, repairs',-c);u.t=null;u.occ=false;note(`${T.name} moved out of ${P.addr} ${UL(i)}. Turnover cost ${money(c)}.`);return}}
    if(dom(d)==15&&Math.random()<{D:.35,C:.25,B:.15}[P.grade]){const job=['Leaky faucet','Clogged drain','Broken water heater element','Furnace won\'t light','Toilet running','Dead outlet','Fridge not cooling','Window lock broken'][rint(0,7)];
     let c=rint(80,900)*(hasTrait('Handy')&&!P.pm?.7:1)*(P.pm?1.1:1);c=Math.round(c/5)*5;addTx(d,`Repair (${job}): ${P.addr}`,-c);note(`${T.name}, ${P.addr} ${UL(i)}: "${job}." Fixed for ${money(c)}.`)}}})}};
function unitHTML(P,u,i){
 const id=`${P.id}|${i}`;
 if(u.you)return`<tr><td>${UL(i)}</td><td>You live here</td><td></td></tr>`;
 if(u.t){const T=u.t;return`<tr><td>${UL(i)}</td><td>${T.name}${T.voucher?' <span class="badge">Voucher</span>':''} · ${money(u.rent)}/mo · lease to day ${T.until}${T.late?` · <span class="neg">${T.late} late</span>`:''}${T.evicting?` · <span class="warn">eviction day ${T.evicting}</span>`:''}</td><td class="n">${T.late>=2&&!T.evicting?`<button class="act ghost" data-act="pevict:${id}">File eviction</button>`:''}</td></tr>`}
 if(u.pending)return`<tr><td>${UL(i)}</td><td>${u.pending.t.name} moving in${u.pending.insp?` after inspection on day ${u.pending.day}`:` on day ${u.pending.day}`}</td><td></td></tr>`;
 if(P.rehab)return`<tr><td>${UL(i)}</td><td class="muted">Vacant, under repair until day ${P.rehab.until}</td><td></td></tr>`;
 if(u.listing){const L=u.listing;return`<tr><td>${UL(i)}</td><td>Listed at ${money(L.rent)} · ${L.apps.length} applicant${L.apps.length==1?'':'s'}${P.pm?' (manager is screening)':''}
  ${L.apps.map((T,k)=>`<div class="app-card"><b>${T.name}</b>${T.voucher?' <span class="badge">Voucher</span>':''} · credit ${T.credit} · income ${T.incomeX}× ${T.voucher?'their share of the':'the'} rent${T.evict?' · <span class="neg">prior eviction</span>':''}${T.pets?' · pets':''} · ${T.refs}${T.voucher?`<br><span class="muted">Voucher rent is capped at ${money(vRent(P,L.rent))} here, and the housing authority pays about 70%. First payment arrives ~30 days after move-in.</span>`:''}
   <div><button class="act" data-act="pacc:${id}|${k}">Accept</button> <button class="act ghost" data-act="pdec:${id}|${k}">Decline</button></div></div>`).join('')}</td><td class="n"><button class="act ghost" data-act="punlist:${id}">Unlist</button></td></tr>`}
 const blocked=P.issues.length?'disabled title="Fix repairs first"':'';
 return`<tr><td>${UL(i)}</td><td>Vacant${P.issues.length?' <span class="muted">(repairs needed before listing)</span>':''}</td><td class="n">${[[.9,'-10%'],[1,'Market'],[1.1,'+10%']].map(([m,l])=>`<button class="act ${m==1?'':'ghost'}" data-act="plist:${id}|${m}" ${blocked}>${l} ${money(Math.round(P.rentU*m/5)*5)}</button>`).join(' ')}</td></tr>`}
A('port').render=function(){
 if(!econ.props.length)return toast()+`<h3>Portfolio</h3><p class="muted">You don't own anything yet. Find a deal in Listings, walk it, then make an offer.</p>`;
 econ.props.forEach(ensureTenants);
 const rent=econ.props.reduce((s,P)=>s+P.units_.reduce((a,u)=>a+(u.t?u.rent:0),0),0),piti=econ.props.reduce((s,P)=>s+propPITI(P),0);
 return toast()+`<h3>Portfolio</h3><p>Monthly rent ${money(rent)} · mortgages, taxes and insurance ${money(piti)} · <b class="${rent-piti>=0?'pos':'neg'}">${money(rent-piti)}</b> before repairs.${SOI[econ.city]?` <span class="muted">${econ.city} law: you can't refuse tenants for using a housing voucher.</span>`:''}</p>`+
 econ.props.map(P=>{const rc=repairCost(P);return`<div class="card"><b>${P.addr}</b> <span class="muted">${P.typeName} · ${GRADE[P.grade].label}</span>
  <table><tr><td>Value · loan · equity</td><td class="n">${money(P.value)} · ${money(P.loan)} · <span class="pos">${money(P.value-P.loan)}</span></td></tr>
  <tr><td>Mortgage, taxes, insurance</td><td class="n neg">-${money(propPITI(P))}/mo</td></tr>
  <tr><td>Repairs</td><td class="n">${P.rehab?`<span class="warn">In progress until day ${P.rehab.until}</span>`:P.issues.length?`${P.known.length?P.known.map(i=>i.name).join(', '):'Unknown'} <button class="act" data-act="prehab:${P.id}">Hire contractor (~${money(Math.max(rc*(P.known.length?P.known.reduce((s,i)=>s+i.cost,0)/P.issues.reduce((s,i)=>s+i.cost,0):.6),1000))})</button>`:'<span class="pos">None</span>'}</td></tr>
  <tr><td>Management</td><td class="n"><button class="act ghost" data-act="ppm:${P.id}">${P.pm?'☑ Property manager (8%)':'☐ Hire property manager (8%)'}</button></td></tr></table>
  <table>${P.units_.map((u,i)=>unitHTML(P,u,i)).join('')}</table></div>`}).join('')};
