/* ───────────── engine ───────────── */
function buildAll(){STAGES.forEach((st,i)=>{seed=11+i*97;const[a,b]=mk(W,H);st.bg(b);st.bgC=a;const[c,d]=mk(W,H);st.fg(d);st.fgC=c;st.tick(0)})}
buildAll();document.fonts&&document.fonts.ready.then(buildAll);

const $=id=>document.getElementById(id);
const msgEl=$('msg'),menuEl=$('menu'),say=t=>msgEl.textContent=t,dev=$('dev');
let si=0,st=STAGES[0],day=1,gameMin=Math.round(st.sig*60),energy=82,mode='free',seq=null,pose='stand',lampsOff=0,zz=[],zzT=0,flipT=0,prevDay=1,calA=0,lowWarned=false,agenda=[];
function fillAgenda(){let last=agenda.length?agenda[agenda.length-1].day:day;while(agenda.length<3){last+=1+(Math.random()*3|0);agenda.push({day:last,text:st.events[Math.random()*st.events.length|0]})}}
fillAgenda();
const fmt=()=>{const h=Math.floor(gameMin/60)%24,m=Math.floor(gameMin%60);return`${(h+11)%12+1}:${String(m).padStart(2,'0')} ${h<12?'AM':'PM'}`};

STAGES.forEach((s,i)=>{const b=document.createElement('button');b.textContent=`${i+1} ${s.key}`;b.setAttribute('aria-pressed',i==0);b.onclick=()=>setStage(i);dev.appendChild(b)});
function setStage(i){if(mode!='free')return;si=i;st=STAGES[i];gameMin=Math.round(st.sig*60);lampsOff=0;
 [...dev.querySelectorAll('button')].forEach((b,k)=>b.setAttribute('aria-pressed',k==i));
 $('stageName').textContent=st.name;$('cash').textContent=st.cash;$('units').textContent=st.units;say(st.intro)}

const pl={x:140,vx:0,face:1,walk:0},keys={};
addEventListener('keydown',e=>{const k=e.key.toLowerCase();keys[k]=true;if(k.startsWith('arrow'))e.preventDefault();
 if(mode=='menu'&&k==='escape'){closeMenu();say('Maybe later.');return}
 if(mode!='free')return;if(k==='e')interact();if(/^[1-5]$/.test(k))setStage(+k-1)});
addEventListener('keyup',e=>keys[e.key.toLowerCase()]=false);
const hold=(id,k)=>{const b=$(id);b.addEventListener('pointerdown',()=>keys[k]=true);['pointerup','pointerleave','pointercancel'].forEach(ev=>b.addEventListener(ev,()=>keys[k]=false))};
hold('bl','a');hold('br','d');$('be').addEventListener('click',()=>mode=='free'&&interact());
function nearest(){let best=null,bd=22;for(const t of st.things){const d=Math.abs(t.x-pl.x);if(d<bd){bd=d;best=t}}return best}
function interact(){const t=nearest();if(!t)return;if(t.sleep||t.name==='Sleep')return openSleepMenu();if(t.computer)return openDevice('laptop');t.act?t.act():say(t.msg)}

/* ── sleep ── */
function closeMenu(){menuEl.hidden=true;menuEl.innerHTML='';if(mode=='menu')mode='free'}
function openSleepMenu(){
 mode='menu';const ev=agenda[0],evDay=Math.max(day+1,ev.day);
 const opts=[['event',`Sleep until Day ${evDay}: ${ev.text}`]];
 if(evDay>day+1)opts.push(['morning','Sleep until morning']);
 opts.push(['nap','Nap for 2 hours (+25 energy)'],['cancel','Not yet']);
 say(`Energy ${Math.round(energy)}/100. ${energy<30?'You are running on fumes.':'How long?'}`);
 menuEl.innerHTML='';opts.forEach(([k,label])=>{const b=document.createElement('button');b.textContent=label;b.onclick=()=>{if(k=='cancel'){closeMenu();say('Maybe later.')}else startSleep(k)};menuEl.appendChild(b)});
 menuEl.hidden=false;menuEl.firstChild.focus();
}
function startSleep(kind){
 closeMenu();mode='seq';const b=st.bed,up=!!b.upstairs,tx=up?b.x:b.hx+30;let total,dur,tDay=null,startAbs;
 if(kind=='nap'){total=120;dur=190}
 else{tDay=kind=='event'?Math.max(day+1,agenda[0].day):day+1;total=(tDay-day)*1440+420-gameMin;dur=Math.min(820,320+(tDay-day-1)*180)}
 say(kind=='nap'?'Just a quick one...':up?'Heading up for the night.':'Lights out.');
 const walk={until:()=>pl.x===tx,f:(p,dt)=>{const d=Math.sign(tx-pl.x);if(d)pl.face=d;pl.vx=d*1.7;pl.x+=pl.vx*dt;if(Math.abs(pl.x-tx)<1.8)pl.x=tx;pl.walk+=1.7*dt*.12}};
 const lapse={d:dur,start:()=>{startAbs=day*1440+gameMin;calA=1},f:p=>{const e=p*p*(3-2*p),abs=startAbs+total*e,nd=Math.floor(abs/1440);if(nd!==day){prevDay=day;day=nd;flipT=38;for(let q=prevDay+1;q<=nd;q++)newDay(q)}gameMin=abs-nd*1440}};
 const steps=up?[
  walk,
  {d:95,start:()=>{pl.face=-1;pl.vx=-1},f:(p,dt)=>{pl.x=tx-p*80;pl.lift=p*52;pl.alpha=1-p;pl.walk+=dt*.2;lampsOff=p*.6}},
  {d:12,start:()=>{pose='gone';pl.vx=0}},
  {d:30},lapse,
  {d:34,f:p=>{lampsOff=.6*(1-p);calA=1-p}},
  {d:95,start:()=>{pose='stand';pl.face=1;pl.vx=1},f:(p,dt)=>{pl.x=tx-80+p*80;pl.lift=52*(1-p);pl.alpha=p;pl.walk+=dt*.2}},
  {d:95,start:()=>{pl.vx=0;pl.lift=0;pl.alpha=1;pl.x=tx;pose='stretch'}},
 ]:[
  walk,
  {d:32,start:()=>{pl.vx=0;pose='sit'}},
  {d:44,start:()=>{pose='lie';bulbOn=false},f:p=>lampsOff=p},
  {d:70},lapse,
  {d:50,f:p=>{lampsOff=1-p;calA=1-p}},
  {d:40,start:()=>{pose='sit';zz=[]}},
  {d:95,start:()=>{pose='stretch';pl.face=1}},
 ];
 seq={i:0,steps,done:()=>{pose='stand';mode='free';finishSleep(kind)}};
}
function finishSleep(kind){
 if(kind=='nap'){energy=Math.min(100,energy+25);say(`Power nap. It's ${fmt()}. Energy +25.${flushMoney()}`);return}
 energy=100;let today='';
 while(agenda.length&&agenda[0].day<=day){if(agenda[0].day==day)today=agenda[0].text;agenda.shift()}fillAgenda();
 const n=[...st.notes].sort(()=>Math.random()-.5).slice(0,2);
 say(`Day ${day}, ${fmt()}. ${today?'Today: '+today+'. ':''}${(flushMoney(),'')}`);
}

/* ── actor ── */
const SKIN='#d4a276';
function drawPlayer(c,o,stretch){
 const x=Math.round(pl.x),fc=pl.face,moving=Math.abs(pl.vx)>.1,ph=moving?Math.floor(pl.walk)%4:0,bob=moving&&(ph%2)?-1:0,L=[[0,0],[3,-2],[0,0],[-3,2]][ph];
 const F=FLOOR-(pl.lift||0);R(c,x-5+L[0],F-26,5,22,o.p1);R(c,x+1+L[1],F-26,5,22,o.p2);
 R(c,x-6+L[0]+(fc>0?1:-1),F-4,7,4,o.shoe);R(c,x+L[1]+(fc>0?1:-1),F-4,7,4,o.shoe);
 const y=F+bob;
 R(c,x-9,y-52,18,27,o.top);R(c,x-9,y-30,18,4,o.shade);R(c,x+(fc>0?-9:5),y-50,4,20,o.shade);
 if(o.style=='hoodie'){R(c,x-2,y-44,1,8,o.acc);R(c,x+1,y-44,1,8,o.acc)}
 if(o.style=='jacket'){R(c,x,y-50,1,22,'#10141e');R(c,x-9,y-30,18,2,o.acc)}
 if(o.style=='blazer'||o.style=='suit'){R(c,x-3,y-52,6,10,o.acc);R(c,x-1,y-50,2,8,o.style=='suit'?'#6a2030':'#2a3550');R(c,x-3,y-52,1,10,o.shade);R(c,x+2,y-52,1,10,o.shade)}
 if(o.style=='turtle')R(c,x-4,y-54,8,4,o.top);
 if(stretch){const s=Math.sin(time*.15)>0?1:0;R(c,x-12,y-76-s,4,26,o.arm);R(c,x+8,y-76-s,4,26,o.arm);R(c,x-12,y-80-s,4,4,SKIN);R(c,x+8,y-80-s,4,4,SKIN)}
 else{const a=moving?[2,0,-2,0][ph]:0,ax=x+(fc>0?3:-7)+a*fc;R(c,ax,y-48,4,20,o.arm);R(c,ax,y-28,4,4,SKIN);if(o.style=='turtle')R(c,ax,y-30,4,2,o.acc)}
 R(c,x-3,y-56,6,4,SKIN);R(c,x-6,y-68,12,13,SKIN);R(c,x-7,y-70,14,6,o.hair);R(c,x+(fc>0?-7:4),y-66,3,6,o.hair);
 if(stretch)R(c,x-3,y-63,6,1,'#1b1410');else R(c,x+(fc>0?2:-3),y-63,1,2,'#1b1410');
}
function drawSit(c,o,x,y){
 R(c,x-4,y-6,18,6,o.p1);R(c,x+10,y,5,Math.max(0,FLOOR-y-4),o.p2);R(c,x+9,FLOOR-4,8,4,o.shoe);
 R(c,x-9,y-32,18,27,o.top);R(c,x-9,y-8,18,3,o.shade);R(c,x-1,y-30,4,18,o.arm);R(c,x-1,y-12,4,4,SKIN);
 R(c,x-3,y-36,6,4,SKIN);R(c,x-6,y-48,12,13,SKIN);R(c,x-7,y-50,14,6,o.hair);R(c,x-7,y-46,3,6,o.hair);R(c,x+2,y-43,1,2,'#1b1410');
}
function drawLie(c,o,b){if(b.flip){c.save();c.translate(2*b.hx+12,0);c.scale(-1,1)}
 const hx=b.hx,y=b.y,br=Math.sin(time*.07)>0?1:0;
 R(c,hx,y-12,12,11,SKIN);R(c,hx-2,y-13,5,13,o.hair);R(c,hx+5,y-7,3,1,'#1b1410');
 R(c,hx+11,y-13-br,28,12+br,o.top);R(c,hx+39,y-10,24,9,o.p1);R(c,hx+63,y-10,4,9,o.shoe);
 R(c,hx+20,y-15-br,48,14+br,b.blanket);R(c,hx+20,y-15-br,48,1,'rgba(255,255,255,.18)');R(c,hx+36,y-11,12,1,'rgba(0,0,0,.25)');R(c,hx+54,y-8,8,1,'rgba(0,0,0,.25)');if(b.flip)c.restore()
}
function drawActor(c){if(pose=='gone')return;c.globalAlpha=pl.alpha??1;const o=st.outfit;if(pose=='lie')drawLie(c,o,st.bed);else if(pose=='sit')drawSit(c,o,Math.round(pl.x),st.bed.y);else drawPlayer(c,o,pose=='stretch');c.globalAlpha=1}

/* ── light ── */
function lightHole(x,y,r,a){
 const g=l.createRadialGradient(x/2,y/2,0,x/2,y/2,r/2),n=5;
 for(let i=0;i<n;i++){const v=a*(1-i/n);g.addColorStop(i/n,`rgba(0,0,0,${v})`);g.addColorStop(Math.min(1,(i+1)/n-.001),`rgba(0,0,0,${v})`)}
 g.addColorStop(1,'rgba(0,0,0,0)');l.fillStyle=g;l.beginPath();l.arc(x/2,y/2,r/2,0,7);l.fill();
}
function buildMask(amb,lights,fg,dayA){
 l.globalCompositeOperation='source-over';l.clearRect(0,0,lc.width,lc.height);l.fillStyle=amb;l.fillRect(0,0,lc.width,lc.height);
 l.globalCompositeOperation='destination-out';
 for(const L of lights){let a=L.a*(fg?(L.fg??1):1);if(L.lamp)a*=1-.9*lampsOff;if(a<=0.001)continue;
  if(L.rect){l.fillStyle=`rgba(0,0,0,${a})`;l.fillRect(L.rect[0]/2,L.rect[1]/2,L.rect[2]/2,L.rect[3]/2)}
  else if(L.poly){l.fillStyle=`rgba(0,0,0,${a})`;l.beginPath();L.poly.forEach((p,i)=>i?l.lineTo(p[0]/2,p[1]/2):l.moveTo(p[0]/2,p[1]/2));l.closePath();l.fill()}
  else if(L.r>0)lightHole(L.x,L.y,L.r,a)}
 if(dayA>0){l.fillStyle=`rgba(0,0,0,${dayA})`;l.fillRect(0,0,lc.width,lc.height)}
 l.globalCompositeOperation='source-over';
}
const ss=(a,b,x)=>{const t=Math.min(1,Math.max(0,(x-a)/(b-a)));return t*t*(3-2*t)};
const dayCurve=h=>ss(5.5,9,h)*(1-ss(16,20.5,h));
function daylight(c,d,dawn,h){
 const[x,y,w,hh]=st.win,cx=x+w/2,cy=y+hh/2;c.globalCompositeOperation='lighter';
 if(d>0&&!st.art){R(c,x,y,w,hh,`rgba(110,140,180,${.3*d})`);glow(c,cx,cy,460,`rgba(255,236,200,${.14*d})`);const sx=(h-12)*16;poly(c,[[x,y+hh*.3],[x+w,y+hh*.3],[x+w-120+sx,H],[x-120+sx,H]],`rgba(255,230,170,${.07*d})`)}
 if(dawn>.02){R(c,x,y,w,hh,`rgba(255,110,50,${.2*dawn})`);glow(c,cx,cy,320,`rgba(255,140,70,${.2*dawn})`)}
 c.globalCompositeOperation='source-over';
}

/* ── overlays ── */
function drawZ(dt){
 if(pose=='lie'&&seq&&seq.i>=3){zzT+=dt;if(zzT>52){zzT=0;zz.push({x:st.bed.hx+8,y:st.bed.y-18,t:0})}}
 zz=zz.filter(z=>(z.t+=dt)<190);ui.textAlign='left';
 for(const z of zz){const a=1-z.t/190;ui.fillStyle=`rgba(210,225,255,${a})`;ui.font=`${8+Math.floor(z.t/65)*2}px Silkscreen`;ui.fillText('z',Math.round(z.x+z.t*.12+Math.sin(z.t*.08)*3),Math.round(z.y-z.t*.22))}
}
function drawCal(dt){
 if(calA<=0.01)return;if(flipT>0)flipT=Math.max(0,flipT-dt);
 const k=flipT/38,show=k>.5?prevDay:day,sy=k>.5?(k-.5)*2:(.5-k)*2,cx=W/2,cy=46;
 ui.save();ui.globalAlpha=calA;ui.translate(cx,cy);ui.scale(1,Math.max(.05,sy));
 R(ui,-26,-28,52,58,'#2a1e16');R(ui,-24,-26,48,54,'#efe6cc');R(ui,-24,-26,48,12,'#9e3b2b');
 ui.textAlign='center';txt(ui,'DAY',0,-17,'#efe6cc',8);txt(ui,String(show),0,16,'#2a1e16',20);ui.restore();
 ui.save();ui.globalAlpha=calA;ui.textAlign='center';R(ui,cx-30,82,60,13,'rgba(10,8,14,.8)');txt(ui,fmt(),cx,92,'#f0d69c',8);ui.restore();ui.textAlign='left';
}

/* ── HUD ── */
let hudCache='';
function hud(){const e=Math.round(energy/10),bar='▮'.repeat(e)+'▯'.repeat(10-e),live=typeof econ!='undefined'&&econ.ready&&si==(econ.hq||0),s=day+'|'+fmt()+'|'+bar+'|'+(live?econ.cash+'|'+econ.credit+'|'+(econ.props?econ.props.length:0):si);if(s===hudCache)return;hudCache=s;if(live){$('cash').textContent=money(econ.cash);$('credit').textContent=econ.credit;if(econ.props)$('units').textContent=econ.props.reduce((s,P)=>s+P.units,0)+' units'}$('day').textContent=day;$('clock').textContent=fmt();$('energy').innerHTML=`<span class="ebar" title="Energy ${Math.round(energy)}/100"><i style="width:${Math.round(energy)}%"></i></span>`}

/* ── loop ── */
let t0=performance.now(),time=0;
function frame(now){ui.clearRect(0,0,W,H);
 const dt=Math.min(50,now-t0)/16.67;t0=now;time+=dt;
 if(seq){const s=seq.steps[seq.i];if(s.t==null){s.t=0;s.start&&s.start()}s.t+=dt;const p=s.d?Math.min(1,s.t/s.d):0;s.f&&s.f(p,dt);
  if(s.until?s.until():p>=1){seq.i++;if(seq.i>=seq.steps.length){const d=seq.done;seq=null;d()}}}
 else{
  const dir=mode=='free'?(keys['d']||keys['arrowright']?1:0)-(keys['a']||keys['arrowleft']?1:0):0,spd=(energy<20?1.2:1.785)*(1+(econ.speedBonus||0));
  pl.vx=dir*spd;if(dir)pl.face=dir;pl.x=Math.max(14,Math.min(626,pl.x+pl.vx*dt));pl.walk+=Math.abs(pl.vx)*dt*.12;
  if(mode!='roll'&&mode!='device'&&mode!='wake'&&mode!='title'){gameMin+=dt/30*paceAwake();if(gameMin>=1440){gameMin-=1440;day++;newDay(day)}
  energy=Math.max(0,energy-dt/300*paceAwake());}if(energy<20&&!lowWarned&&mode=='free'){lowWarned=true;say('You are exhausted and moving slowly. Go to bed.')}if(energy>=20)lowWarned=false;
 }
 const h=gameMin/60,dd=dayCurve(h)-dayCurve(st.sig),dP=Math.max(0,dd),dN=Math.max(0,-dd),dawn=Math.exp(-(((h-6.8)/.9)**2));
 st.tick(time);const lights=st.lights();

 ctx.globalCompositeOperation='source-over';ctx.drawImage(st.bgC,0,0);st.dyn&&st.dyn(ctx,time);
 buildMask(st.amb(),lights,false,.6*dP);ctx.drawImage(lc,0,0,W,H);

 f.globalCompositeOperation='source-over';f.clearRect(0,0,W,H);f.drawImage(st.fgC,0,0);st.dynFg&&st.dynFg(f,time);drawActor(f);
 buildMask(st.fgAmb?st.fgAmb():st.amb(),lights,true,.5*dP);f.globalCompositeOperation='source-atop';f.drawImage(lc,0,0,W,H);f.globalCompositeOperation='source-over';
 ctx.drawImage(fc,0,0);

 ctx.globalCompositeOperation='lighter';ctx.globalAlpha=1-.55*lampsOff;st.glows(ctx,time);ctx.globalAlpha=1;ctx.globalCompositeOperation='source-over';
 daylight(ctx,dP,dawn,h);
 if(dN>0)R(ctx,0,0,W,H,`rgba(4,4,14,${dN*.55*(1-(st.nm||0)*.85)})`);

 drawZ(dt);drawCal(dt);st.overlay&&st.overlay(ui,dt);drawFade(ctx,dt);
 const t=mode=='free'?nearest():null;
 if(t){ui.font='8px Silkscreen';ui.textAlign='left';const s='[E] '+t.name.toUpperCase(),w=ui.measureText(s).width+8,px=Math.round(Math.max(4,Math.min(W-w-4,pl.x-w/2))),py=FLOOR-(SPR.ready?(st.charH||84)+18:92);
  R(ui,px,py,w,13,'rgba(20,14,10,.85)');R(ui,px,py+12,w,1,'#7A5A3A');ui.fillStyle='#E8C98A';ui.fillText(s,px+4,py+9)}
 hud();post();
 requestAnimationFrame(frame);
}
