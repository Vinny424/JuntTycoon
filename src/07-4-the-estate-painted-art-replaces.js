/* ───────────── 4 · THE ESTATE, painted art (replaces the procedural concrete version) ───────────── */
const ART={foyerG:'@@asset:image/webp@assets/art/estate/estate_foyer_goldenhour_v1.webp@@',foyerN:'@@asset:image/webp@assets/art/estate/estate_foyer_night_doorsclosed_v1.webp@@',ext:'@@asset:image/webp@assets/art/estate/estate_exterior_goldenhour_v1.webp@@'};
const EST={ready:false};
function archPath(c){c.beginPath();c.moveTo(284,274);c.lineTo(284,58);c.ellipse(411.5,58,127.5,34,0,Math.PI,2*Math.PI);c.lineTo(539,274);c.closePath()}
function downscale(img,w,h){let c=img,cw=img.width,ch=img.height;
 while(cw/2>=w){const n=document.createElement('canvas');n.width=cw=Math.round(cw/2);n.height=ch=Math.round(ch/2);const x=n.getContext('2d');x.imageSmoothingQuality='high';x.drawImage(c,0,0,n.width,n.height);c=n}
 const o=document.createElement('canvas');o.width=w;o.height=h;const x=o.getContext('2d');x.imageSmoothingQuality='high';x.drawImage(c,0,0,w,h);return o}
function coolDay(src){const c=document.createElement('canvas');c.width=src.width;c.height=src.height;const x=c.getContext('2d');x.drawImage(src,0,0);
 const d=x.getImageData(0,0,c.width,c.height),p=d.data;
 for(let i=0;i<p.length;i+=4){p[i]=Math.min(255,(p[i]*.9+6)*1.04);p[i+1]=Math.min(255,(p[i+1]*.98+10)*1.04);p[i+2]=Math.min(255,(p[i+2]*1.12+22)*1.04)}
 x.putImageData(d,0,0);return c}
function holed(src){const c=document.createElement('canvas');c.width=W;c.height=H;const x=c.getContext('2d');x.drawImage(src,0,0);x.globalCompositeOperation='destination-out';archPath(x);x.fill();return c}
if(ART)Promise.all(Object.entries(ART).map(([k,v])=>new Promise(r=>{const i=new Image();i.onload=()=>r([k,i]);i.onerror=()=>r([k,null]);i.src=v}))).then(list=>{
 const I=Object.fromEntries(list);if(!I.foyerG||!I.foyerN||!I.ext)return;
 EST.fg=downscale(I.foyerG,W,H);EST.fn=downscale(I.foyerN,W,H);EST.ex=downscale(I.ext,480,270);
 EST.fd=coolDay(EST.fg);EST.ready=true;
});
Object.assign(STAGES[3],{art:true,
 key:'Estate',name:'The Estate · Golden Hour',cash:'$4.8M liquid',units:'1,200 units',
 intro:'Marble, gold, and a front door you could drive through. The hypercar is parked where the sunset can see it.',
 outfit:{top:'#f2ece0',shade:'#cfc6b4',arm:'#e6dfd0',p1:'#2e2a26',p2:'#36322d',shoe:'#1a1410',hair:'#2B1E16',acc:'#e0b448',style:'turtle'},
 sig:19,win:[284,27,255,247],bed:{x:192,upstairs:1,hx:0,y:0,blanket:'#c9a038'},
 bg(s){R(s,0,0,W,H,'#1a140e')},fg(f){},dynFg:null,
 tick(t){try{const h=gameMin/60;this.nm=h>=12?ss(20,21.5,h):1-ss(5.5,7,h);this.dp=Math.max(0,dayCurve(h)-dayCurve(this.sig))}catch(e){this.nm=0;this.dp=0}
  this.fl=.9+Math.sin(t*.4)*.05+Math.sin(t*1.3)*.04},
 amb(){return`rgba(14,8,18,${.1+.12*(this.nm||0)})`},fgAmb(){return'rgba(22,12,6,.28)'},
 dyn(c,t){
  if(!EST.ready){R(c,0,0,W,H,'#2a2016');c.textAlign='center';txt(c,'Opening the front doors...',W/2,180,'#e8c98a',8);c.textAlign='left';return}
  const nm=this.nm,dp=this.dp;
  if(nm<1){
   c.drawImage(EST.fg,0,0);if(dp>0){c.globalAlpha=dp;c.drawImage(EST.fd,0,0);c.globalAlpha=1}
   for(let i=0;i<5;i++)R(c,337+Math.random()*12-6,226+Math.random()*8-4,1,1,'rgba(255,255,255,.85)');
   for(let i=0;i<4;i++)R(c,383+Math.random()*10-5,185+Math.random()*6,1+Math.random()*3,1,'rgba(255,230,160,.6)');
  }
  if(nm>0){c.globalAlpha=nm;c.drawImage(EST.fn,0,0);c.globalAlpha=1;
   for(let i=0;i<4;i++)R(c,429+Math.random()*10-5,192+Math.random()*8,1,1,`rgba(255,240,200,${.8*nm})`)}
 },
 lights(){const nm=this.nm||0,f=this.fl||1;return[
  {rect:[284,27,255,247],a:.55*(1-nm),fg:.5},
  {x:142,y:70,r:150,a:(.35+.4*nm)*f},{x:628,y:103,r:150,a:(.35+.4*nm)*f},{x:232,y:126,r:110,a:.5*nm*f},{x:410,y:60,r:320,a:.7*nm},
  {x:383,y:300,r:240,a:.4*(1-nm),fg:.8}]},
 glows(c,t){const nm=this.nm||0,f=this.fl||1,dp=this.dp||0,a=1-nm;
  if(a>0){glow(c,452,130,70,`rgba(255,190,110,${.22*a*(1-dp)})`);glow(c,412,200,260,`rgba(255,160,80,${.1*a})`);
   for(let y=278;y<H;y+=2){const w=6+Math.sin(y*.4+t*.05)*2;R(c,383-w/2+Math.sin(y*.2+t*.03)*2,y,w,2,`rgba(255,210,140,${.1*a*(1-dp*.6)})`)}}
  glow(c,142,70,60,`rgba(255,190,100,${(.12+.16*nm)*f})`);glow(c,628,103,60,`rgba(255,190,100,${(.12+.16*nm)*f})`);
  if(nm>0){glow(c,232,126,40,`rgba(255,190,100,${.25*nm*f})`);glow(c,410,60,160,`rgba(255,210,130,${.22*nm})`);
   for(let y=280;y<H;y+=3)R(c,405+Math.sin(y*.3+t*.04)*2,y,10,2,`rgba(255,220,150,${.07*nm})`)}
 },
 things:[
  {x:150,name:'Upstairs',sleep:1},
  {x:218,name:'Bust',msg:'A marble bust that came with the house. Nobody knows who it is. You kept it for the gravitas.'},
  {x:262,name:'Flowers',msg:'Fresh white roses, twice a week. Your first apartment had one plant, and it died.'},
  {x:412,name:'Front doors',act(){say(STAGES[3].nm>.5?'Closed for the night. Through the glass: fountain lights, the car, and the city on the horizon.':'Wide open. The hypercar in the driveway cost more than your first three buildings combined.')}},
  {x:520,name:'The view',msg:'A lake, and a skyline on the horizon. Four of those towers are yours.'},
  {x:612,name:'Study',msg:'Your study is through here. Family office: 1,200 units across four states.'},
 ],
});

