/* ───────────── UI pass: crisp text layer, clickable desktop/phone, door menu, gym, real-only calendar ───────────── */
// crisp text layer: sits above the shader canvas, drawn at 2x so letters stay sharp
const uiC=document.createElement('canvas');uiC.width=1280;uiC.height=720;uiC.className='uilayer';scr.after(uiC);
const ui=uiC.getContext('2d');ui.setTransform(2,0,0,2,0,0);ui.imageSmoothingEnabled=false;

// calendar holds only things you actually booked
fillAgenda=function(){};
const _initEconU=initEcon;initEcon=function(L){_initEconU(L);agenda=[];econ.gym=0;econ.speedBonus=0};
A('cal').render=function(){const ev=agenda.filter(a=>a.day>=day).sort((a,b)=>a.day-b.day);
 return toast()+(ev.length?`<table>${ev.map(e=>`<tr><td>Day ${e.day}</td><td>${e.text}</td></tr>`).join('')}</table>`:'<p class="muted">Nothing scheduled. Book a showing in Listings or apply for a job, and it shows up here.</p>')};
openSleepMenu=function(){
 mode='menu';const ev=agenda.filter(a=>a.day>day).sort((a,b)=>a.day-b.day)[0],opts=[];
 if(ev)opts.push(['event',`Sleep until day ${ev.day}: ${ev.text}`]);
 opts.push(['morning','Sleep until morning'],['nap','Nap for 2 hours (+25 energy)'],['cancel','Not yet']);
 say(`Energy ${Math.round(energy)}/100. ${energy<30?'You are running on fumes.':'How long?'}`);
 showMenu(opts,k=>{if(k=='cancel'){closeMenu();say('Maybe later.');return}if(k=='event')agenda=agenda.filter(a=>a.day>day).sort((a,b)=>a.day-b.day);startSleep(k)})};
function showMenu(opts,cb){menuEl.innerHTML='';opts.forEach(([k,label])=>{const b=document.createElement('button');b.textContent=label;b.onclick=()=>cb(k);menuEl.appendChild(b)});menuEl.hidden=false;mode='menu';menuEl.firstChild.focus()}

// the door: places to go
function openDoorMenu(){
 const L=listings.find(x=>x.showing==day),opts=[];
 if(L)opts.push(['show',`Go to the showing at ${L.addr}`]);
 opts.push(['gym',`Go to the gym ($25, 2 hours)`],['drive','Drive the neighborhood looking for deals (2 hours)'],['cancel','Stay in']);
 say(hasSetMsg?'Where to?':'Where to? Workouts make you faster over time, and driving around can turn up deals that never hit the listings.');hasSetMsg=true;
 showMenu(opts,k=>{closeMenu();
  if(k=='show')return enterWalk(L);
  if(k=='gym'){if(econ.cash<25)return say('Not enough cash for a day pass.');if(!spend(2,15))return say('Too tired to work out. Sleep first.');addTx(day,'Gym day pass',-25);econ.gym++;
   const nb=Math.min(.25,Math.floor(econ.gym/4)*.03),up=nb>econ.speedBonus;econ.speedBonus=nb;
   return say(up?`Workout done. You feel lighter on your feet: walk speed +${Math.round(nb*100)}%.`:`Workout done (${econ.gym} total). Every 4 workouts you get a little faster.`)}
  if(k=='drive'){if(!spend(2,10))return say('Too tired to drive around. Sleep first.');addTx(day,'Gas',-12);if(birdDog())return;
   if(Math.random()<.35){const N=genListing();N.motive='high';N.dom=0;N.desc='You spotted it yourself: overgrown yard, handwritten "For Sale" sign. '+N.desc;listings.push(N);return say(`Found one: ${N.addr}, a ${N.typeName.toLowerCase()}. It's in Listings now, and the owner sounds motivated.`)}
   return say('You drove around for two hours. Nothing worth calling about today.')}
  say('Maybe later.')})}
let hasSetMsg=false;
STAGES[4].things.push({x:24,name:'Elevator'});
STAGES.forEach(s=>s.things.forEach(t=>{if(['Door','Front doors','Elevator'].includes(t.name)){t.act=()=>{if(!econ.ready)return;openDoorMenu()}}}));

// pixel icons
const ICON_MAPS={
 bank:[['.....aa.....','...aaaaaa...','.aaaaaaaaaa.','bbbbbbbbbbbb','.a..a..a..a.','.a..a..a..a.','.a..a..a..a.','.a..a..a..a.','.a..a..a..a.','bbbbbbbbbbbb','aaaaaaaaaaaa','............'],{a:'#8fe0a8',b:'#2e8a55'}],
 house:[['.....aa.....','....aaaa....','...aaaaaa...','..aaaaaaaa..','.aaaaaaaaaa.','bbbbbbbbbbbb','.bccb..bbbb.','.bccb..bccb.','.bbbb..bccb.','.b..b..bbbb.','.b..b..b..b.','.bbbbbbbbbb.'],{a:'#e05a4a',b:'#e8c98a',c:'#ffe7a0'}],
 city:[['......aa....','......aa....','.bb...aa....','.bb..aaaa...','.bbb.acac.b.','.bcb.aaaa.bb','.bbb.acac.bb','.bcb.aaaa.cb','.bbb.acac.bb','.bcb.aaaa.cb','.bbb.aaaa.bb','aaaaaaaaaaaa'],{a:'#d8b050',b:'#8a9aaa',c:'#ffe7a0'}],
 case:[['............','....bbbb....','....b..b....','.aaaaaaaaaa.','.aaaaaaaaaa.','.aaaaaaaaaa.','.bbbbccbbbb.','.aaaaccaaaa.','.aaaaaaaaaa.','.aaaaaaaaaa.','.bbbbbbbbbb.','............'],{a:'#b0763a',b:'#5a3a1a',c:'#e8c98a'}],
 chart:[['............','.b..........','.b.......cc.','.b......c...','.b.....c....','.b..aa.c....','.b..aa.ca...','.b.aaa.aaa..','.b.aaaaaaa..','.b.aaaaaaa..','.bbbbbbbbbb.','............'],{a:'#b89ad8',b:'#dfe8ef',c:'#8fe08a'}],
 mail:[['............','............','.bbbbbbbbbb.','.bab....bab.','.baab..baab.','.baaabbaaab.','.baaaaaaaab.','.baaaaaaaab.','.baaaaaaaab.','.bbbbbbbbbb.','............','............'],{a:'#dfe8ef',b:'#5a9af0'}],
 cal:[['..b....b....','.cccccccccc.','.cccccccccc.','.aaaaaaaaaa.','.abababab.a.','.aaaaaaaaaa.','.abababab.a.','.aaaaaaaaaa.','.ababab...a.','.aaaaaaaaaa.','............','............'],{a:'#efe6cc',b:'#5a4a3a',c:'#e0605a'}]};
const ICONS={};for(const[k,[m,pal]]of Object.entries(ICON_MAPS)){const c=document.createElement('canvas');c.width=c.height=48;const x=c.getContext('2d');m.forEach((r,y)=>[...r].forEach((p,i)=>{if(pal[p]){x.fillStyle=pal[p];x.fillRect(i*4,y*4,4,4)}}));ICONS[k]=c.toDataURL()}
const DESK=[
 {id:'bank',name:'Bank',icon:'bank'},{id:'deals',name:'Listings',icon:'house'},{id:'port',name:'Portfolio',icon:'city'},
 {id:'career',name:'Career',icon:'case',tabs:[['jobs','Jobs'],['learn','Learn'],['gigs','Gigs']]},{id:'biz',name:'Business',icon:'chart'},
 {id:'inbox',name:'Inbox',icon:'mail',tabs:[['msgs','Messages'],['news','News']]},{id:'cal',name:'Calendar',icon:'cal'}];
const WALL=['linear-gradient(160deg,#3a5a6a,#1e2e3a)','linear-gradient(160deg,#4a2a6a,#1a1030)','linear-gradient(160deg,#6a4a2a,#2a1a10)','linear-gradient(160deg,#5a4a2a,#1a1612)','linear-gradient(160deg,#1a2a4a,#060a14)'];
const devTab={career:'jobs',inbox:'msgs'};
const badge=d=>d.id=='bank'&&econ.bills?.length?`<em>${econ.bills.length}</em>`:'';
const iconBtn=d=>`<button class="dicon" data-app="${d.id}"><img src="${ICONS[d.icon]}" alt=""><span>${d.name}</span>${badge(d)}</button>`;
function appBody(d){
 if(d.tabs){const t=devTab[d.id];return`<div class="tabs">${d.tabs.map(([k,l])=>`<button class="tab" data-tab="${d.id}|${k}" aria-pressed="${k==t}">${l}</button>`).join('')}</div>`+A(t).render().replace(/<h3>.*?<\/h3>/,'')}
 return A(d.id).render().replace(/<h3>.*?<\/h3>/,'')}
renderDevice=function(){
 const d=devApp&&DESK.find(x=>x.id==devApp),body=d?appBody(d):'',n=econ.bills?.length||0;
 devEl.innerHTML=devKind=='phone'
  ?`<div class="phone"><div class="pbar"><span>${fmt()}</span><span>Day ${day}</span><span>▮▮▮ 5G</span></div>
   ${d?`<div class="phead"><button data-home>‹ Home</button><b>${d.name}</b></div><section class="app">${body}</section>`:`<div class="home-grid">${DESK.map(iconBtn).join('')}</div>`}
   <button class="home" data-close>Put phone away (Esc)</button></div>`
  :`<div class="bezel"><div class="desk" style="background:${WALL[si]||WALL[0]}"><div class="icons">${DESK.map(iconBtn).join('')}</div>
   ${d?`<div class="win"><div class="wbar"><span>${d.name}</span><button data-home aria-label="Close window">✕</button></div><section class="app">${body}</section></div>`:''}</div>
   <div class="taskbar"><span class="start">Junt-OS</span><span class="tb-app">${d?d.name:'Desktop'}</span><span class="tb-right">${n?`<span class="neg">${n} bill${n>1?'s':''} due</span> · `:''}Day ${day} · ${fmt()}</span><button data-close>Shut down (Esc)</button></div></div>`};
devEl.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;
 if(b.dataset.home!=null){devApp=null;devMsg='';renderDevice()}
 if(b.dataset.tab){const[a,t]=b.dataset.tab.split('|');devTab[a]=t;devMsg='';renderDevice()}});
const _openDeviceU=openDevice;openDevice=function(k){devApp=null;_openDeviceU(k)};

// walk speed: +5%, plus gym bonus
// dev stage switcher also sets your HQ, so "You are here", the HUD and bills agree
const _setStageU=setStage;setStage=function(i){_setStageU(i);if(econ.ready&&st===STAGES[i]&&!moveCard){econ.hq=i}};
