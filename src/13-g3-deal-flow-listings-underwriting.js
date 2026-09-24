/* ───────────── G3: deal flow (Listings + underwriting) ───────────── */
const STREETS=['Elm','Maple','Cedar','Front','Water','Mill','Grant','Lincoln','Oak','Walnut','Pine','Chestnut','Vine','Railroad','Church','Market','Spring','Hill','Ash','Union'];
const SUFX=['St','Ave','Rd','Ct','Ln'];
const PTYPES={sfh:{name:'Single-family, 2 bed',units:1},sfh3:{name:'Single-family, 3 bed',units:1},duplex:{name:'Duplex',units:2},triplex:{name:'Triplex',units:3},quad:{name:'Fourplex',units:4}};
const GRADE={D:{label:'Rough block',vac:.10,maint:.12,capex:.08},C:{label:'Working-class street',vac:.07,maint:.09,capex:.06},B:{label:'Solid neighborhood',vac:.05,maint:.07,capex:.05}};
// [min price, max price, market rent per unit] in Millbrook dollars
const PBASE={D:{sfh:[40000,70000,800],sfh3:[55000,85000,925],duplex:[70000,115000,650],triplex:[105000,150000,620],quad:[130000,190000,600]},
 C:{sfh:[90000,135000,1100],sfh3:[115000,165000,1300],duplex:[150000,220000,875],triplex:[215000,295000,825],quad:[270000,380000,800]},
 B:{sfh:[180000,250000,1500],sfh3:[220000,300000,1750],duplex:[290000,370000,1175]}};
const CITYX={'Millbrook':{p:1,r:1,tax:.018},'Palo Verde':{p:2.3,r:1.7,tax:.016},'Harbor City':{p:4.4,r:2.6,tax:.011}};
const COND={
 asis:{desc:'Handyman special. Sold as-is, cash or rehab loan preferred.',px:.8,reh:[.15,.4]},
 cosmetic:{desc:'Needs cosmetic updates. Great bones!',px:.92,reh:[.04,.1]},
 ready:{desc:'Move-in ready.',px:1,reh:[0,.02]},
 reno:{desc:'Fully renovated! New kitchen and baths.',px:1.08,reh:[0,.01]},
 tenant:{desc:'Tenant-occupied. Rents are below market.',px:.95,reh:[.02,.07]}};
const ISSUES=[['Roof near end of life',.35],['Foundation cracks',.5],['Knob-and-tube wiring',.3],['Galvanized plumbing',.25],['Mold behind drywall',.2],['Termite damage',.25],['Old furnace',.15],['Water heater leaking',.05],['Rotten deck',.08]];
let listings=[],lid=0,lDetail=null;const watch=new Set();
const mortgage=(P,rate,yrs=30)=>{const r=rate/12,n=yrs*12;return P*r/(1-Math.pow(1+r,-n))};
function genListing(){
 const g=pick([['D',.42],['C',.43],['B',.15]]),ts=Object.keys(PBASE[g]),t=ts[Math.random()*ts.length|0],b=PBASE[g][t],cx=CITYX[econ.city]||CITYX.Millbrook,T=PTYPES[t];
 const cond=pick(g=='D'?[['asis',.4],['cosmetic',.3],['ready',.15],['tenant',.15]]:[['asis',.12],['cosmetic',.3],['ready',.3],['reno',.13],['tenant',.15]]),C=COND[cond];
 const mp={normal:1,boom:1.12,recession:.86}[mood];
 const price=Math.round(rint(b[0],b[1])*cx.p*C.px*mp/500)*500,rentU=Math.round(b[2]*cx.r/5)*5;
 const rehab=Math.max(cond=='asis'?12000*cx.p:0,Math.round(price*(C.reh[0]+Math.random()*(C.reh[1]-C.reh[0]))/100)*100);
 const issues=[];let left=rehab;for(const[n,w]of[...ISSUES].sort(()=>Math.random()-.5)){if(left<1500)break;const c=Math.min(left,Math.round(rehab*w/100)*100);if(c>=800){issues.push({name:n,cost:c});left-=c}}
 if(left>=800)issues.push({name:'Paint, flooring and fixtures',cost:left});
 return{id:++lid,addr:`${rint(100,2999)} ${STREETS[Math.random()*STREETS.length|0]} ${SUFX[Math.random()*SUFX.length|0]}`,grade:g,type:t,units:T.units,typeName:T.name,cond,desc:C.desc,
  price,rentU,curRentU:cond=='tenant'?Math.round(rentU*.85/5)*5:0,tax:Math.round(price*cx.tax),ins:Math.max(900,Math.round(price*.006)),
  rehab,sellerRehab:Math.round(rehab*.6/100)*100,issues,dom:rint(1,60),motive:pick([['low',.4],['medium',.4],['high',mood=='recession'?.4:.2]])}
}
function analyze(L){
 const G=GRADE[L.grade],grossM=L.rentU*L.units,gross=grossM*12,vac=gross*G.vac,maint=gross*G.maint,capex=gross*G.capex,mgmt=gross*.08,opex=L.tax+L.ins+vac+maint+capex+mgmt,noi=gross-opex;
 const cd=FIN.conv.down,close=L.price*.03,inv={loan:L.price*(1-cd)},fha={loan:L.price*.965};
 inv.pay=mortgage(inv.loan,.0725);inv.cash=L.price*cd+close+knownRehab(L);inv.cf=noi/12-inv.pay;inv.coc=inv.cf*12/inv.cash;
 fha.pay=mortgage(fha.loan,.065)+fha.loan*.0055/12;fha.cash=L.price*.035+close+knownRehab(L);
 fha.house=L.units>1?fha.pay-(noi*(L.units-1)/L.units)/12:fha.pay+(L.tax+L.ins+maint+capex)/12;
 return{grossM,opexM:opex/12,noi,cap:noi/L.price,one:grossM/L.price,inv,fha}}
const pct=x=>(x*100).toFixed(1)+'%';
const canMath=()=>econ.done.has('re101')||hasTrait('Numbers brain');
function listingHTML(L){
 const saved=watch.has(L.id),open=lDetail==L.id;
 let h=`<div class="item"><div><b>${L.addr}</b> <span class="muted">${L.typeName} · ${GRADE[L.grade].label}</span><br>${money(L.price)} · market rent ${money(L.rentU)}${L.units>1?' per unit':''}${L.curRentU?` <span class="warn">(currently ${money(L.curRentU)})</span>`:''} · ${L.dom} days listed<br><span class="muted">"${L.desc}"${L.sellerRehab?` Seller says repairs are about ${money(L.sellerRehab)}.`:''}</span></div>
 <div class="btncol"><button class="act" data-act="ldetail:${L.id}">${open?'Hide':'Details'}</button><button class="act ghost" data-act="lsave:${L.id}">${saved?'★ Saved':'☆ Save'}</button></div></div>`;
 if(open){
  if(!canMath())h+=`<div class="card">The numbers are a blur. Take <b>Real estate investing fundamentals</b> in Learn to see cap rate, cash flow and what you'd need to buy this.</div>`;
  else{const a=analyze(L),cls=v=>v>=0?'pos':'neg';
   h+=`<div class="card"><table>
   <tr><td>Gross rent</td><td class="n">${money(a.grossM)}/mo</td></tr>
   <tr><td>Expenses (taxes, insurance, vacancy, repairs, capex, management)</td><td class="n neg">-${money(a.opexM)}/mo</td></tr>
   <tr><td>Net operating income</td><td class="n">${money(a.noi)}/yr</td></tr>
   <tr><td>Cap rate · rent-to-price</td><td class="n">${pct(a.cap)} · ${pct(a.one)}</td></tr></table>
   <div class="label">Investor loan: ${Math.round(FIN.conv.down*100)}% down at ${(FIN.conv.rate*100).toFixed(2)}%</div><table>
   <tr><td>Cash to close (down payment, closing costs, seller's repair estimate)</td><td class="n">${money(a.inv.cash)}</td></tr>
   <tr><td>Mortgage</td><td class="n">${money(a.inv.pay)}/mo</td></tr>
   <tr><td>Cash flow · cash-on-cash return</td><td class="n ${cls(a.inv.cf)}">${money(a.inv.cf)}/mo · ${pct(a.inv.coc)}</td></tr></table>
   
   ${L.walked?`<p class="warn">Your walkthrough found: ${L.found.map(i=>i.name+' ~'+money(i.cost)).join(', ')||'nothing major'}.</p>`:`<p class="muted">Seller's repair estimates run low. A walkthrough shows what's really wrong.</p>`}</div>`}
  h+=`<p><button class="act" data-act="lshow:${L.id}">${L.showing?`Showing booked: day ${L.showing}`:'Book a showing'}</button>${L.showing==day?` <button class="act" data-act="lgo:${L.id}">Go to the showing now</button>`:''}</p>`}
 return h}
Object.assign(A('deals'),{lock:null,render(){
 const list=[...listings].sort((a,b)=>(watch.has(b.id)-watch.has(a.id))||a.price-b.price);
 return toast()+`<h3>Listings · ${econ.city}</h3><p class="muted">New listings every week. Good deals go fast${mood=='recession'?', but in a recession sellers get desperate':mood=='boom'?', especially in a boom':''}.</p>`+list.map(listingHTML).join('')}});
const _act2=act;
act=function(a,id){
 if(a=='ldetail'){lDetail=lDetail==+id?null:+id;devMsg='';return}
 if(a=='lsave'){devMsg='';watch.has(+id)?watch.delete(+id):watch.add(+id);return}
 if(a=='lshow'){const L=listings.find(x=>x.id==+id);if(!L||L.showing)return;L.showing=day+rint(1,2);agenda.push({day:L.showing,text:'Showing: '+L.addr,listing:L.id});agenda.sort((x,y)=>x.day-y.day);devMsg=`Showing booked for day ${L.showing}.`;return}
 _act2(a,id)};
const _newDay3=newDay;
newDay=function(d){_newDay3(d);if(!econ.ready)return;listings.forEach(L=>L.dom++);
 if(d%7==0){const sold=listings.filter(L=>!L.showing&&!L.deal&&Math.random()<(mood=='boom'?.4:.22));sold.forEach(L=>{if(watch.has(L.id))note(`A saved listing sold: ${L.addr}.`);watch.delete(L.id)});
  listings=listings.filter(L=>!sold.includes(L));for(let i=rint(2,3);i>0;i--)listings.push(genListing());}};
const _initEcon3=initEcon;initEcon=function(L){_initEcon3(L);econ.city=L.city.name;listings=[];for(let i=0;i<7;i++)listings.push(genListing())};
