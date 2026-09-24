/* ───────────── G4: property walkthrough (flashlight inspection) ───────────── */
const ISSUE_SPOT={'Roof near end of life':[470,46],'Foundation cracks':[120,264],'Knob-and-tube wiring':[392,166],'Galvanized plumbing':[300,282],'Mold behind drywall':[600,112],'Termite damage':[185,294],'Old furnace':[56,252],'Water heater leaking':[548,288],'Rotten deck':[628,286]};
const knownRehab=L=>L.walked?Math.max(L.sellerRehab,L.found.reduce((s,i)=>s+i.cost,0)):L.sellerRehab;
let walk=null;const aim={x:null,y:null};
scr.addEventListener('mousemove',e=>{const r=scr.getBoundingClientRect();aim.x=(e.clientX-r.left)/r.width*W;aim.y=(e.clientY-r.top)/r.height*H});
scr.addEventListener('pointerdown',e=>{const r=scr.getBoundingClientRect();aim.x=(e.clientX-r.left)/r.width*W;aim.y=(e.clientY-r.top)/r.height*H});
function beam(){const hx=pl.x+pl.face*7,hy=FLOOR-(SPR.ready?Math.round((st.charH||84)*.5):44);let ax=aim.x,ay=aim.y;if(ax==null){ax=hx+pl.face*100;ay=hy+20}
 return{hx,hy,ang:Math.atan2(ay-hy,ax-hx),len:270,sp:hasTrait('Handy')?.42:.34}}
function makeWalk(L){
 seed=L.id*7919+13;const has=n=>L.issues.some(i=>i.name==n);
 const G={D:{wall:'#5e5238',wall2:'#564a32',floor:'#3a2c1e',trim:'#2a2016'},C:{wall:'#6e6452',wall2:'#665c4b',floor:'#4a3624',trim:'#33261a'},B:{wall:'#8a857a',wall2:'#827d72',floor:'#5a4230',trim:'#3a2e24'}}[L.grade];
 const S={key:'Walk',name:`Showing · ${L.addr}`,outfit:st.outfit,sig:gameMin/60,win:[80,110,60,70],bed:{hx:0,y:0},events:[],notes:[],
  bg(s){
   R(s,0,0,W,H,'#0c0a08');R(s,0,0,W,36,G.trim);R(s,0,36,W,264,G.wall);for(let x=0;x<W;x+=24)R(s,x,36,10,264,G.wall2);
   for(let i=0;i<(L.grade=='D'?34:14);i++)R(s,rnd()*W,40+rnd()*250,4+rnd()*26,3+rnd()*16,'rgba(20,14,6,.28)');
   R(s,0,292,W,8,G.trim);R(s,0,300,W,60,G.floor);for(let y=306;y<H;y+=8)R(s,0,y,W,1,'rgba(0,0,0,.25)');for(let y=300;y<H;y+=8)for(let x=(y%16?0:30);x<W;x+=60)R(s,x,y,1,8,'rgba(0,0,0,.2)');
   for(const x of[220,400,560]){R(s,x-4,36,8,150,G.trim);R(s,x-7,184,14,5,G.trim)}
   R(s,4,196,18,104,'#3a2a1a');R(s,20,244,2,4,'#c8a060');
   R(s,78,108,64,74,G.trim);R(s,82,112,56,66,'#161c26');if(L.grade=='D')for(let y=116;y<176;y+=14)R(s,80,y,60,8,'#6a5436');
   R(s,236,120,150,44,'#5a4630');R(s,236,142,150,1,'#3a2c1c');R(s,234,258,154,5,'#8a8272');R(s,236,263,150,37,'#5a4630');R(s,288,258,34,3,'#2a2a2a');R(s,303,246,2,12,'#9a9a9a');R(s,348,240,36,18,'#b8b0a0');R(s,352,244,8,4,'#222');R(s,364,244,8,4,'#222');
   R(s,384,174,14,32,'#8a8a8a');R(s,386,176,10,28,'#6a6a6a');
   R(s,418,108,46,64,G.trim);R(s,422,112,38,56,'#161c26');R(s,478,196,44,104,'#5a4630');R(s,516,248,3,4,'#c8a060');
   R(s,566,268,58,32,'#c8c4b8');R(s,566,268,58,3,'#e0dcd0');R(s,588,148,22,28,'#9aa8b0');R(s,586,146,26,2,'#6a6a6a');
   R(s,626,196,12,104,'#3a2a1a');R(s,628,206,8,30,'#1a2230');
   if(L.cond=='asis'||L.cond=='cosmetic')for(let i=0;i<18;i++){const x=rnd()*W,y=50+rnd()*220;R(s,x,y,3+rnd()*8,2+rnd()*6,G.wall2=='#827d72'?'#9a958a':'#7a6e52')}
   if(has('Roof near end of life')){ell(s,470,46,22,6,'#4a3a20');ell(s,470,46,15,4,G.wall);ell(s,470,46,9,2,'#4a3a20')}
   if(has('Foundation cracks')){let x=112,y=292;for(let i=0;i<30;i++){R(s,x,y,2,2,'#1a140c');y-=2;x+=(i%4<2?1:-1)+(rnd()<.3?1:0)}}
   if(has('Knob-and-tube wiring')){for(let y=150;y<176;y+=6){R(s,390,y,3,3,'#e8e4d8');R(s,391,y+3,1,3,'#222')}R(s,380,160,12,1,'#222')}
   if(has('Galvanized plumbing')){R(s,298,266,5,26,'#8a4a20');R(s,298,280,20,4,'#7a4018');for(let i=0;i<5;i++)R(s,298+rnd()*18,268+rnd()*20,2,2,'#a05a28')}
   if(has('Mold behind drywall'))for(let i=0;i<40;i++)R(s,586+rnd()*30,96+rnd()*34,1+rnd()*3,1+rnd()*2,rnd()<.5?'#1e2a1a':'#2a3a22');
   if(has('Termite damage')){R(s,172,292,28,8,'#2a1e12');for(let i=0;i<10;i++)R(s,172+rnd()*26,293+rnd()*6,2,1,'#0e0a06');for(let i=0;i<8;i++)R(s,170+rnd()*32,299,1,1,'#b89a60')}
   if(has('Old furnace')){R(s,40,226,32,74,'#5a5048');R(s,44,236,24,10,'#3a322c');for(let i=0;i<6;i++)R(s,42+rnd()*28,250+rnd()*44,2,6,'#8a4a20')}
   if(has('Water heater leaking')){R(s,538,240,18,58,'#7a7a72');R(s,538,240,18,3,'#9a9a92');R(s,528,299,36,3,'#3a5a7a');R(s,534,300,20,2,'#5a7a9a')}
   if(has('Rotten deck')){for(let i=0;i<8;i++)R(s,616+rnd()*22,284+rnd()*14,3,2,'#1a120a')}
  },
  fg(f){},
  tick(t){this.fl=.95+Math.sin(t*.9)*.03+(Math.random()<.008?-.35:0);if(Math.abs(pl.vx)<.1&&aim.x!=null)pl.face=aim.x>pl.x?1:-1;
   if(!walk)return;const b=beam(),need=hasTrait('Handy')?22:40;
   for(const is of L.issues){if(walk.found.includes(is))continue;const sp=ISSUE_SPOT[is.name];if(!sp)continue;
    const dx=sp[0]-b.hx,dy=sp[1]-b.hy,dist=Math.hypot(dx,dy);let da=Math.atan2(dy,dx)-b.ang;da=Math.atan2(Math.sin(da),Math.cos(da));
    if(dist<b.len*.9&&Math.abs(da)<b.sp){walk.lit[is.name]=(walk.lit[is.name]||0)+1;if(walk.lit[is.name]>=need){walk.found.push(is);walk.pops.push({x:sp[0],y:sp[1],t:150,txt:`${is.name}: ~${money(is.cost)}`})}}}},
  amb(){return'rgba(4,4,8,.9)'},fgAmb(){return'rgba(4,4,8,.84)'},
  lights(){const b=beam(),f=this.fl||1,p=(a)=>[b.hx+Math.cos(a)*b.len,b.hy+Math.sin(a)*b.len];
   return[{poly:[[b.hx,b.hy],p(b.ang-b.sp),p(b.ang-b.sp/2),p(b.ang),p(b.ang+b.sp/2),p(b.ang+b.sp)],a:.9*f},{x:pl.x,y:FLOOR-40,r:90,a:.35},{rect:[82,112,56,66],a:.25,fg:0},{rect:[422,112,38,56],a:.2,fg:0}]},
  glows(c){const b=beam(),p=(a)=>[b.hx+Math.cos(a)*b.len,b.hy+Math.sin(a)*b.len];poly(c,[[b.hx,b.hy],p(b.ang-b.sp),p(b.ang),p(b.ang+b.sp)],`rgba(255,238,200,${.07*(this.fl||1)})`)},
  overlay(c,dt){if(!walk)return;walk.t-=dt;
   const sec=Math.max(0,Math.ceil(walk.t/60)),txt2=`SHOWING · ${Math.floor(sec/60)}:${String(sec%60).padStart(2,'0')} LEFT · FOUND ${walk.found.length}`;
   c.font='8px Silkscreen';c.textAlign='left';const w=c.measureText(txt2).width+10,bx=Math.round((W-w)/2);R(c,bx,8,w,14,'rgba(10,8,6,.92)');R(c,bx,21,w,1,'#7A5A3A');c.fillStyle=sec<15?'#ff8a78':'#f0d69c';c.fillText(txt2,bx+5,18);
   walk.pops=walk.pops.filter(p=>(p.t-=dt)>0);for(const p of walk.pops){c.font='8px Silkscreen';const tw=c.measureText(p.txt).width+8,px=Math.max(4,Math.min(W-tw-4,p.x-tw/2)),py=Math.max(24,p.y-24-(150-p.t)*.1);R(c,px,py,tw,12,'rgba(60,20,10,.9)');c.fillStyle='#ffd0a0';c.fillText(p.txt,px+4,py+9)}
   if(walk.t<=0){say('Agent: "Sorry, I have another showing. We need to wrap up."');endWalk()}},
  things:[{x:22,name:'Leave',act:()=>endWalk()}]};
 const[a,b]=mk(W,H);S.bg(b);S.bgC=a;const[c,d]=mk(W,H);S.fg(d);S.fgC=c;return S}
function enterWalk(L){
 if(walk)return;walk={L,prev:st,prevX:pl.x,t:80*60,found:[],lit:{},pops:[]};
 const cos=L.issues.find(i=>i.name.startsWith('Paint'));if(cos)walk.found.push(cos);
 st=makeWalk(L);pl.x=44;pl.face=1;aim.x=null;$('stageName').textContent=st.name;
 say(`Agent: "Sorry, the power's off. Here's a flashlight. We've got about twenty minutes." Aim the light with your mouse. Hold it on anything suspicious.`)}
function endWalk(){
 const w=walk;if(!w)return;walk=null;st=w.prev;pl.x=w.prevX;$('stageName').textContent=st.name;spend(1,5);
 const L=w.L,sum=w.found.reduce((s,i)=>s+i.cost,0);L.walked=true;L.found=w.found;L.showing=null;
 say(`Walkthrough done at ${L.addr}. Found: ${w.found.map(i=>`${i.name} (~${money(i.cost)})`).join(', ')||'nothing obvious'}. Your repair estimate is ${money(Math.max(sum,L.sellerRehab))}, and the seller said ${money(L.sellerRehab)}.`);
 econ.log.unshift({d:day,text:`Walkthrough at ${L.addr}: ${money(sum)} of repairs found.`})}
STAGES.forEach(s=>{const d=s.things.find(t=>t.name=='Door');if(d){d.act=()=>{const L=listings.find(x=>x.showing==day);if(L)enterWalk(L);else say('The neighborhood is out there. Book a showing in Listings, then head out the door on the day.')}}});
const _setStage4=setStage;setStage=function(i){if(walk)return;_setStage4(i)};
const _act4=act;act=function(a,id){if(a=='lgo'){const L=listings.find(x=>x.id==+id);closeDevice();if(L)enterWalk(L);return}_act4(a,id)};
const _newDay4=newDay;newDay=function(d){_newDay4(d);if(!econ.ready)return;listings.forEach(L=>{if(L.showing&&L.showing<d&&!(walk&&walk.L==L)){note(`You missed the showing at ${L.addr}.`);L.showing=null}})};
