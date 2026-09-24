/* ───────────── G8: market cycles, rivals, news, story beats ───────────── */
const BASE_RATES=Object.fromEntries(Object.entries(FIN).map(([k,f])=>[k,f.rate]));
const CYCLE={
 normal:{next:()=>Math.random()<.6?'boom':'recession',len:[120,240],rate:0,news:['Markets steady. Rents creep up about 3% a year.','Fed holds rates. Nothing exciting, which is good.']},
 boom:{next:()=>'recession',len:[90,180],rate:.005,news:['Bidding wars are back. Houses sell in days, over asking.','The Fed raises rates to cool a hot market.']},
 recession:{next:()=>'normal',len:[60,150],rate:-.0075,news:['Layoffs at the plant. Sellers are getting nervous.','The Fed cuts rates. Cash buyers are circling distressed sales.']}};
const RIVALS=[{name:'Vince Marlow',style:'buys rough houses for cash, fixes nothing',likes:L=>L.grade=='D',units:6,nw:900000},{name:'Keiko Hart',style:'syndicates bigger buildings with investor money',likes:L=>L.units>=3||L.grade=='B',units:40,nw:4200000}];
const _initEcon8=initEcon;initEcon=function(L){_initEcon8(L);Object.assign(econ,{cycleEnd:day+rint(120,240),news:[{d:1,text:'Welcome to the market. Investor loans run about 7.25%.'}],beats:new Set(),mike:false})};
function setMood(m,silent){mood=m;const r=CYCLE[m].rate;for(const k in FIN)if(BASE_RATES[k])FIN[k].rate=BASE_RATES[k]+r;
 const b=[...document.querySelectorAll('#dev button')].find(x=>x.textContent.startsWith('Market:'));if(b){b.textContent='Market: '+m;b.setAttribute('aria-pressed',m!='normal')}
 if(!silent){const h=CYCLE[m].news[rint(0,1)];econ.news.unshift({d:day,text:h});note('News: '+h)}}
function beat(id,text){if(econ.beats.has(id))return;econ.beats.add(id);econ.log.unshift({d:day,text});note(text)}
const _addTx8=addTx;addTx=function(d,label,amt,silent){if(econ.mike&&label.startsWith('Repair ('))amt=Math.round(amt*.7);_addTx8(d,label,amt,silent)};
const _newDay8=newDay;
newDay=function(d){_newDay8(d);if(!econ.ready)return;
 if(d>=econ.cycleEnd){const n=CYCLE[mood].next();setMood(n);econ.cycleEnd=d+rint(...CYCLE[n].len)}
 if(mood=='recession'&&dom(d)==10&&econ.salary&&econ.track=='general'&&Math.random()<.08){econ.salary=0;econ.net=0;note(`You were laid off from your job as a ${econ.job.toLowerCase()}. Time to hit the Jobs app.`)}
 if(d%7==5){for(const R of RIVALS){const pool=listings.filter(L=>!L.deal&&!L.showing&&R.likes(L));if(pool.length&&Math.random()<(mood=='recession'?.45:.25)){const L=pool[rint(0,pool.length-1)];listings=listings.filter(x=>x!==L);R.units+=L.units;R.nw+=Math.round(L.price*.3);
   const saved=watch.has(L.id);watch.delete(L.id);const t=`${R.name} bought ${L.addr} (${L.typeName.toLowerCase()}) for about ${money(L.price*(R.name.startsWith('V')?.9:1.02))}.`;econ.news.unshift({d,text:t});if(saved)note(`Beaten to it: ${t}`)}}}
 const u=unitsOwned();
 if(u>=1)beat('first',{low:'Mom: "You OWN a building? I told everyone at church."',middle:'Dad: "Proud of you. Now read the lease twice."',upper:'Your family office sent a card. It was typed.'}[econ.cls]||'Your family is proud of you.');
 if(u>=4)beat('mike','Mike the handyman: "You keep calling me, so hire me full-time. $3,000 a month and I cut your repair bills by about 30%." (Business app)');
 if(u>=10)beat('vince','Vince Marlow left a voicemail: "Heard you\'re buying on my side of town. Let\'s talk before you overpay for something."');
 if(econ.hq>=3)beat('landlord','A letter from your old landlord: "I\'m retiring. You were always on time, eventually. Want to buy the building?"')};
const _initEcon8b=initEcon;initEcon=function(L){_initEcon8b(L);econ.cls=L.cls};
const _act8=act;act=function(a,id){
 if(a=='hmike'){econ.mike=!econ.mike;devMsg=econ.mike?'Mike is on payroll. Repair bills drop about 30%.':'You let Mike go. He took it well.';return}
 _act8(a,id)};
const _newDay8b=newDay;newDay=function(d){_newDay8b(d);};
APPS.push({id:'news',name:'News',col:'#9aa8b0',render(){
 return toast()+`<h3>News · ${econ.city}</h3><p>Market: <b class="${mood=='boom'?'pos':mood=='recession'?'neg':''}">${mood}</b> · investor loans ${(FIN.conv.rate*100).toFixed(2)}%</p>
 <table>${econ.news.slice(0,15).map(n=>`<tr><td>Day ${n.d}</td><td>${n.text}</td></tr>`).join('')}</table>`}});
const _biz8=A('biz').render;
A('biz').render=function(){
 const me={name:'You',units:unitsOwned(),nw:netWorth()},board=[me,...RIVALS].sort((a,b)=>b.nw-a.nw);
 return _biz8()+`<div class="label">Rivals</div><table>${board.map(r=>`<tr><td>${r.name==='You'?'<b>You</b>':r.name}</td><td class="muted">${r.style||''}</td><td class="n">${r.units} units · ${money(r.nw)}</td></tr>`).join('')}</table>
 ${econ.beats.has('mike')?`<p><button class="act ${econ.mike?'':'ghost'}" data-act="hmike:0">${econ.mike?'☑ Mike on payroll ($3,000/mo)':'☐ Hire Mike full-time ($3,000/mo)'}</button></p>`:''}
 <div class="label">Legacy goal</div><p>${money(Math.max(0,netWorth()))} of $100,000,000 net worth · ${unitsOwned()} of 1,000 units${netWorth()>=1e8&&unitsOwned()>=1000?' <b class="pos">You made it.</b>':''}</p>`};
// keep the dev M button in sync with the cycle clock
{const b=[...document.querySelectorAll('#dev button')].find(x=>x.textContent.startsWith('Market:'));if(b)b.addEventListener('click',()=>{if(econ.ready){setMood(mood,true);econ.cycleEnd=day+rint(...CYCLE[mood].len)}})}
