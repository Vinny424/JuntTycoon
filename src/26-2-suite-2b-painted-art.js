/* ───────────── 2 · SUITE 2B, painted art ───────────── */
const HUSTLE_ART='@@asset:image/webp@assets/art/hustle/hustle_2b_night_v1.webp@@';
if(HUSTLE_ART){const im=new Image();im.onload=()=>{
 const S=STAGES[1],night=downscale(im,W,H),D2={v:coolDay(night)},xs=[175,70,243,316,441,491,535,608];
 S.things.forEach((t,i)=>{if(xs[i]!=null)t.x=xs[i]});
 Object.assign(S,{art:true,charH:136,win:[373,56,188,124],bed:{hx:58,y:240,flip:false,blanket:'#4a5a3a'},
  bg(s){R(s,0,0,W,H,'#0e0a16')},fg(f){},dynFg:null,
  amb(){return'rgba(10,6,24,.18)'},fgAmb(){return'rgba(10,6,24,.5)'},
  dyn(c,t){const dp=Math.max(0,dayCurve(gameMin/60)-dayCurve(this.sig));c.drawImage(night,0,0);if(dp>0){c.globalAlpha=dp;c.drawImage(D2.v,0,0);c.globalAlpha=1}
   if(dp<.5&&this.fl<.5)R(c,134,11,151,12,'rgba(0,0,0,.55)');if(dp<.5&&!this.nf)R(c,505,122,48,24,'rgba(20,4,16,.75)')},
  lights(){return[{x:314,y:185,r:150,a:.55,lamp:1},{x:383,y:182,r:120,a:.45,lamp:1},{x:210,y:20,r:360,a:.35*this.fl,lamp:1},{rect:[373,56,188,124],a:.45,fg:0},{x:470,y:150,r:260,a:.4,fg:.7}]},
  glows(c){const n=1-Math.max(0,dayCurve(gameMin/60)-dayCurve(this.sig));glow(c,314,185,80,'rgba(60,200,190,.14)');glow(c,383,182,60,'rgba(255,170,80,.12)');
   glow(c,425,130,70,`rgba(40,220,210,${.14*n})`);glow(c,528,134,70,`rgba(255,50,150,${(.16*this.nf+.02)*n})`);glow(c,560,300,160,`rgba(255,60,150,${.06*this.nf*n})`)}});
 const[a]=mk(W,H),[b]=mk(W,H);S.bgC=a;S.fgC=b;
 {const i2=new Image();i2.onload=()=>{D2.v=downscale(i2,W,H)};i2.src='@@asset:image/webp@assets/art/hustle/hustle_2b_day_v1.webp@@'}
};im.src=HUSTLE_ART}

