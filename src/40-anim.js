/* ───────────── Interaction animations: walk to the object, play a sprite strip, then act ───────────── */
// A strip is one row of 3-6 frames on magenta, in the outfit for the stage where the action happens.
// Frames share one baseline; each frame is anchored by its FEET so bending/reaching poses don't slide.
function loadStrip(im,erase){
 const c=document.createElement('canvas'),w=c.width=im.width,h=c.height=im.height,x=c.getContext('2d');x.drawImage(im,0,0);
 if(erase){x.fillStyle='#ff00ff';for(const[a,b,cw,ch]of erase)x.fillRect(a,b,cw,ch)}
 const d=x.getImageData(0,0,w,h),p=d.data;
 for(let i=0;i<p.length;i+=4){const r=p[i],g=p[i+1],b=p[i+2],m=Math.min(r,b)-g;if(m>55&&Math.abs(r-b)<110)p[i+3]=0;else if(m>8){p[i]=Math.min(r,g+8);p[i+2]=Math.min(b,g+8)}}
 x.putImageData(d,0,0);
 const col=new Array(w).fill(0);let top=h,bot=0;
 for(let yy=0;yy<h;yy++)for(let xx=0;xx<w;xx++)if(p[(yy*w+xx)*4+3]){col[xx]++;if(yy<top)top=yy;if(yy>bot)bot=yy}
 const segs=[];let s=-1;for(let xx=0;xx<=w;xx++){const on=xx<w&&col[xx]>2;if(on&&s<0)s=xx;if(!on&&s>=0){if(xx-s>30)segs.push([s,xx]);s=-1}}
 return segs.map(([a,b])=>{let mx=0,n=0;for(let yy=Math.round(bot-(bot-top)*.08);yy<=bot;yy++)for(let xx=a;xx<b;xx++)if(p[(yy*w+xx)*4+3]){mx+=xx-a;n++}
  const f=document.createElement('canvas');f.width=b-a;f.height=bot-top+1;f.getContext('2d').drawImage(c,a,top,b-a,bot-top+1,0,0,b-a,bot-top+1);
  return{c:f,ax:n?mx/n:(b-a)/2}})}
const ANIMS={};
// dur: how long each frame is held (game frames at 60 fps)
function registerAnim(id,src,dur,opts){const im=new Image();im.onload=()=>{ANIMS[id]=Object.assign({frames:loadStrip(im,opts&&opts.erase),dur,cache:{}},opts)};im.src=src}
function animFrame(A,i,H){const k=i+'_'+H;if(A.cache[k])return A.cache[k];const F=A.frames[Math.min(i,A.frames.length-1)],s=H/F.c.height,Wd=Math.max(1,Math.round(F.c.width*s));
 let c=F.c,cw=c.width,ch=c.height;while(cw/2>=Wd){const n=document.createElement('canvas');n.width=cw=Math.round(cw/2);n.height=ch=Math.round(ch/2);const x=n.getContext('2d');x.imageSmoothingQuality='high';x.drawImage(c,0,0,cw,ch);c=n}
 const o=document.createElement('canvas');o.width=Wd;o.height=H;const x=o.getContext('2d');x.imageSmoothingQuality='high';x.drawImage(c,0,0,Wd,H);
 const d=x.getImageData(0,0,Wd,H),p=d.data;for(let j=3;j<p.length;j+=4)p[j]=p[j]<150?0:255;x.putImageData(d,0,0);
 return A.cache[k]={c:o,ax:F.ax*s}}
// walk to tx, face the object, play the strip, then run `after`
function playAnim(id,tx,face,after){
 const A=ANIMS[id];if(!A){after&&after();return}
 tx=Math.max(14,Math.min(626,tx));mode='seq';const total=A.dur.reduce((s,v)=>s+v,0);
 seq={i:0,steps:[
  {until:()=>pl.x===tx,f:(p,dt)=>{const d=Math.sign(tx-pl.x);if(d)pl.face=d;pl.vx=d*1.785;pl.x+=pl.vx*dt;if(Math.abs(pl.x-tx)<1.9)pl.x=tx;pl.walk+=1.785*dt*.12}},
  {d:8,start:()=>{pl.vx=0;pl.face=face}},
  {d:total,start:()=>{pl.anim={id,t:0}},f:(p,dt)=>{pl.anim.t+=dt}},
 ],done:()=>{pl.anim=null;mode='free';after&&after()}}}
const _drawPlayerA=drawPlayer;
drawPlayer=function(c,o,stretch){
 const A=pl.anim&&ANIMS[pl.anim.id];if(!A)return _drawPlayerA(c,o,stretch);
 const H=st.charH||84;let t=pl.anim.t,i=0;while(i<A.dur.length-1&&t>=A.dur[i]){t-=A.dur[i];i++}
 const f=animFrame(A,i,H),x=Math.round(pl.x),y=Math.round(FLOOR-(pl.lift||0)-H);
 if(pl.face<0){c.save();c.translate(x*2,0);c.scale(-1,1)}
 c.drawImage(f.c,Math.round(x-f.ax),y);
 if(pl.face<0)c.restore()};

/* ── 2B water cooler (bomber): take a cup, fill it, drink, crumple ── */
registerAnim('bomber_watercooler','@@asset:image/webp@assets/art/character/anim/bomber_watercooler_v1.webp@@',[36,50,24,56,44],{erase:[[680,355,52,70]]});
{const t=STAGES[1].things.find(t=>t.name=='Water cooler');if(t)t.act=()=>{
 if(st.sheet!='bomber'||!ANIMS.bomber_watercooler)return say('Glug. The only employee benefit.');
 playAnim('bomber_watercooler',t.x-24,1,()=>{energy=Math.min(100,energy+4);say('Glug. Ice-cold water, +4 energy. The only employee benefit.')})}}
