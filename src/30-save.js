/*@@ module save.js begin @@*/
/* ───────────── Save / load: localStorage autosave, Continue on the title screen ───────────── */
const SAVE_KEY='junttycoon.save.v1',SAVE_VER=1;
const lsGet=k=>{try{return localStorage.getItem(k)}catch(e){return null}};
const lsSet=(k,v)=>{try{localStorage.setItem(k,v);return true}catch(e){return false}};
const lsDel=k=>{try{localStorage.removeItem(k)}catch(e){}};
const jsonSer=v=>JSON.stringify(v,(k,x)=>x instanceof Set?{__set:[...x]}:x);
const jsonDes=s=>JSON.parse(s,(k,x)=>x&&typeof x=='object'&&Array.isArray(x.__set)?new Set(x.__set):x);
let wiping=false;

// what beginB() does to the studio for a given life roll, so a loaded game gets the same room text
function stage0FromLife(L){
 const S=STAGES[0];
 S.name=`${L.home} · ${L.city.name}`;S.cash=money(L.cash);S.units='0 units';
 S.things[3].msg=L.rent?`Rent: ${money(L.rent)}, due on the 1st.`:'No rent. The house rule is Sunday dinner, no excuses.';
 S.events=S.events.map(e=>e.startsWith('Rent due')?(L.rent?`Rent due (${money(L.rent)})`:'Sunday dinner with family'):e);
 S.events=S.events.map(e=>e.startsWith('Day job')?(L.job=='none'?'Job interview downtown':`Shift: ${L.title.toLowerCase()}`):e);
}
function snapshot(){
 return{v:SAVE_VER,t:Date.now(),si,day,gameMin,energy,px:pl.x,face:pl.face,agenda,life,mood,bulbOn,lid,
  listings,watch:[...watch],rivals:RIVALS.map(r=>({units:r.units,nw:r.nw})),econ};
}
function saveGame(manual){
 if(wiping||!econ.ready||!life)return false;
 if(!manual&&mode!='free')return false;
 if(walk||moveCard||seq)return false;
 try{const ok=lsSet(SAVE_KEY,jsonSer(snapshot()));if(ok)flashSaved();return ok}catch(e){console.warn('save failed',e);return false}
}
function readSave(){
 const raw=lsGet(SAVE_KEY);if(!raw)return null;
 try{const S=jsonDes(raw);return S&&S.v===SAVE_VER&&S.econ&&S.econ.ready&&S.life?S:null}catch(e){return null}
}
function loadSave(S){
 for(const k in econ)delete econ[k];Object.assign(econ,S.econ);
 life=S.life;stage0FromLife(life);
 listings=S.listings||[];lid=S.lid||0;watch.clear();(S.watch||[]).forEach(x=>watch.add(x));
 (S.rivals||[]).forEach((r,i)=>{if(RIVALS[i]){RIVALS[i].units=r.units;RIVALS[i].nw=r.nw}});
 mode='free';setStage(S.si||0);
 setMood(S.mood||'normal',true);
 day=S.day;prevDay=day;gameMin=S.gameMin;energy=S.energy;agenda=S.agenda||[];
 pl.x=S.px??140;pl.face=S.face||1;pl.vx=0;bulbOn=!!S.bulbOn;lampsOff=0;pose='stand';
 hudCache='';$('credit').textContent=econ.credit;
 say(`Welcome back. Day ${day}, ${fmt()}.${econ.pending&&econ.pending.length?flushMoney():''}`);
}

// small "saved" flash next to the HUD numbers
const savedEl=document.createElement('b');savedEl.style.cssText='font-family:Silkscreen,monospace;font-size:10px;color:#8fe08a;opacity:0;transition:opacity 1.2s;margin-left:10px;letter-spacing:.05em';savedEl.textContent='SAVED';
document.querySelector('.stats').appendChild(savedEl);
let flashTO=0;function flashSaved(){savedEl.style.transition='none';savedEl.style.opacity=1;clearTimeout(flashTO);flashTO=setTimeout(()=>{savedEl.style.transition='opacity 1.2s';savedEl.style.opacity=0},900)}

// autosave: when you close the laptop or phone, when you wake up, every 15 s, and when the tab is hidden
const _closeDeviceV=closeDevice;closeDevice=function(){_closeDeviceV();setTimeout(()=>saveGame(),0)};
const _closeWakeV=closeWake;closeWake=function(){_closeWakeV();setTimeout(()=>saveGame(),0)};
setInterval(()=>saveGame(),15000);
addEventListener('pagehide',()=>saveGame());
document.addEventListener('visibilitychange',()=>{if(document.hidden)saveGame()});

// Save / New game buttons (bottom-left; the dev row sits next to them when dev mode is on)
{
 const row=document.querySelector('.row'),box=document.createElement('div');box.className='sys';
 box.innerHTML='<button id="btnSave" title="Your run also autosaves">Save</button><button id="btnNew" title="Delete this run and start over">New game</button>';
 row.insertBefore(box,row.firstChild);
 const style=document.createElement('style');style.textContent='.sys{display:flex;gap:6px}.sys button{font-size:11px;padding:6px 10px;color:var(--dim)}.sys button.warn{color:#f08a74;border-color:#f08a74}';document.head.appendChild(style);
 $('btnSave').onclick=()=>{if(mode!='free'&&mode!='menu')return say('Finish what you are doing first, then save.');const ok=saveGame(true);say(ok?'Game saved. It also saves on its own.':'Could not save (browser storage is blocked?).')};
 let armed=0;$('btnNew').onclick=e=>{const b=e.currentTarget;
  if(!armed){armed=setTimeout(()=>{armed=0;b.textContent='New game';b.classList.remove('warn')},4000);b.textContent='Delete run? Click again';b.classList.add('warn');return}
  clearTimeout(armed);wiping=true;lsDel(SAVE_KEY);location.reload()};
}

// title screen: Continue (Enter) + New Game
{
 const sp=$('splash'),S=readSave();
 if(sp&&S){
  const start=$('spStart'),go=document.createElement('button');go.id='spContinue';go.className='sp-start';go.textContent='Continue';
  const hq=HQ[S.econ.hq||0];
  const info=document.createElement('p');info.className='sp-hint';info.textContent=`Day ${S.day} · ${money(S.econ.cash)} · ${hq?hq.name:''}`;
  start.parentElement.insertBefore(go,start);start.parentElement.insertBefore(info,start);
  start.textContent='New Game';start.style.cssText+=';font-size:clamp(14px,1.8vw,20px);padding:8px 20px 4px;margin-top:6px;background:#5a3a2a';
  const cont=()=>{if(mode!='title')return;sp.classList.add('out');setTimeout(()=>sp.remove(),600);rollEl.hidden=true;try{loadSave(S)}catch(e){console.error(e);lsDel(SAVE_KEY);location.reload()}};
  go.onclick=cont;window.spEnter=cont;setTimeout(()=>go.focus(),80);
  const hint=sp.querySelector('.sp-hint:last-child');if(hint&&hint!==info)hint.textContent='press Enter to continue';
 }
}
/*@@ module save.js end @@*/
