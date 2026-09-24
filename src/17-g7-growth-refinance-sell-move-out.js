/* ───────────── G7: growth (refinance, sell, move out, reputation, HQ upgrades) ───────────── */
const HQ=[
 {name:'Home',cost:0,need:()=>true,why:''},
 {name:'Suite 2B, above the laundromat',cost:650,need:()=>unitsOwned()>=4||netWorth()>=100000,why:'4 units or $100K net worth'},
 {name:'Corner suite, 14th floor',cost:4500,need:()=>unitsOwned()>=20&&netWorth()>=750000,why:'20 units and $750K net worth'},
 {name:'The Estate',cost:18000,need:()=>netWorth()>=5e6,why:'$5M net worth'},
 {name:"Billionaires' Row penthouse",cost:65000,need:()=>netWorth()>=5e7,why:'$50M net worth'}];
const unitsOwned=()=>econ.props?econ.props.reduce((s,P)=>s+P.units,0):0;
const netWorth=()=>econ.cash+(econ.props||[]).reduce((s,P)=>s+P.value-P.loan,0)-econ.student;
const _initEcon7=initEcon;initEcon=function(L){_initEcon7(L);Object.assign(econ,{hq:0,rep:10,office:0,baseRent:L.rent||Math.round(L.city.rent*.9/5)*5})};
const _closeDeal7=closeDeal;closeDeal=function(L){const n=econ.props.length;_closeDeal7(L);if(econ.props.length>n){econ.props[econ.props.length-1].bought=day;econ.rep=Math.min(100,econ.rep+3)}};
function refiQuote(P){const loan=Math.round(P.value*.75),pay=mortgage(loan,.0725),close=Math.round(loan*.02),cashOut=loan-P.loan-close,
 rent=P.units_.reduce((s,u)=>s+(u.t?u.rent:0),0),dscr=(pay+(P.tax+P.ins)/12)>0?rent/(pay+(P.tax+P.ins)/12):0;return{loan,pay,close,cashOut,dscr}}
const _act7=act;
act=function(a,id){
 const P=econ.props?.find(p=>p.id==+String(id).split('|')[0]);
 if(a=='grefi'){const q=refiQuote(P);if(day-P.bought<seasoning()){devMsg=`Lenders want at least ${seasoning()} days of ownership (seasoning) before a cash-out refinance. ${P.bought+seasoning()-day} days to go.`;return}
  if(econ.credit<620){devMsg='Needs a 620+ credit score.';return}if(q.dscr<1){devMsg=`Rent only covers ${q.dscr.toFixed(2)}× the new payment. The lender wants at least 1.0×. Get units rented first.`;return}
  if(q.cashOut<=0){devMsg="There's no equity to pull out yet.";return}
  P.loan=q.loan;P.pay=q.pay;P.rate=.0725;P.mip=0;P.io=false;P.fin='conv';addTx(day,'Cash-out refinance: '+P.addr,q.cashOut);devMsg=`Refinanced ${P.addr}. ${money(q.cashOut)} cash out. That's your next down payment.`;econ.log.unshift({d:day,text:devMsg});return}
 if(a=='gsell'){const net=Math.round(P.value*.94-P.loan);addTx(day,'Sale proceeds: '+P.addr,net);if(econ.ownerOcc==P.id){econ.ownerOcc=null;econ.rent=econ.baseRent}econ.props=econ.props.filter(x=>x!==P);devMsg=`Sold ${P.addr} for ${money(P.value)}. After the loan and 6% selling costs, you walk away with ${money(net)}.`;econ.log.unshift({d:day,text:devMsg});return}
 if(a=='gmove'){if(day-P.bought<360){devMsg=`FHA requires living there for a year. You can move out on day ${P.bought+360}.`;return}P.units_[0].you=false;econ.ownerOcc=null;econ.rent=econ.baseRent;devMsg=`You moved out. Unit A is now a rental, and FHA is available for your next home. New rent: ${money(econ.rent)}.`;return}
 if(a=='ghq'){const i=+id,H=HQ[i];if(!H.need()){devMsg=`Unlocks at ${H.why}.`;return}econ.hq=i;econ.office=H.cost;if(i>0)econ.rep=Math.min(100,econ.rep+5);closeDevice();setStage(i);say(`New headquarters: ${H.name}.${H.cost?` ${money(H.cost)} a month.`:''}`);return}
 if(a=='pevict')econ.rep=Math.max(0,econ.rep-8);
 _act7(a,id)};
const _newDay7=newDay;
newDay=function(d){_newDay7(d);if(!econ.ready||!econ.props)return;
 if(dom(d)==1&&d>1){if(!econ.pastDue&&econ.props.length)econ.rep=Math.min(100,econ.rep+1)}
 if(d%7==3&&(econ.rep>=30||hasTrait('Connected'))&&Math.random()<.35){const L=genListing();L.motive='high';L.dom=0;L.desc='Off-market tip from a broker. '+L.desc;listings.push(L);note(`Broker: "Got an off-market ${L.typeName.toLowerCase()} on ${L.addr}. Seller needs out fast."`)}
 for(const P of econ.props)if(P.io&&d-P.bought==300)note(`Hard money on ${P.addr} comes due in 60 days. Refinance or sell.`)};
const _port7=A('port').render;
A('port').render=function(){let h=_port7();if(!econ.props.length)return h;
 return h+`<div class="label">Grow</div>`+econ.props.map(P=>{const q=refiQuote(P),own=day-P.bought;
  return`<div class="item"><div><b>${P.addr}</b><br><span class="muted">Owned ${own} days · refinance would give ${q.cashOut>0?money(q.cashOut)+' cash out':'no cash out yet'} (rent covers ${q.dscr.toFixed(2)}× the payment) · sale nets about ${money(P.value*.94-P.loan)}</span></div>
  <div class="btncol"><button class="act" data-act="grefi:${P.id}">Refinance</button><button class="act ghost" data-act="gsell:${P.id}">Sell</button>${econ.ownerOcc==P.id?`<button class="act ghost" data-act="gmove:${P.id}">Move out</button>`:''}</div></div>`}).join('')};
APPS.push({id:'biz',name:'Business',col:'#b89ad8',render(){
 const nw=netWorth();
 return toast()+`<h3>Business</h3><div class="cards"><div class="card"><div class="label">Net worth</div><div class="big ${nw<0?'neg':''}">${money(nw)}</div></div><div class="card"><div class="label">Units · reputation</div><div class="big">${unitsOwned()} · ${econ.rep}</div><div class="muted">Reputation grows with closings and on-time payments. Evictions hurt it. At 30+, brokers send you off-market deals.</div></div></div>
 <div class="label">Headquarters</div>`+HQ.map((H,i)=>`<div class="item"><div><b>${H.name}</b>${H.cost?` <span class="muted">· ${money(H.cost)} a month</span>`:''}<br><span class="${H.need()?'pos':'muted'}">${i==econ.hq?'You are here':i<econ.hq?'Behind you':H.need()?'Unlocked':'Unlocks at '+H.why}</span></div>${i>econ.hq&&H.need()?`<button class="act" data-act="ghq:${i}">Move here</button>`:''}</div>`).join('')}});
