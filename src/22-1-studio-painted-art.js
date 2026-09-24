/* ───────────── 1 · STUDIO, painted art ───────────── */
const STUDIO_ART='@@asset:image/webp@assets/art/studio/studio_night_v1.webp@@';
const STU={ready:false};
if(STUDIO_ART){const im=new Image();im.onload=()=>{STU.night=downscale(im,W,H);STU.day=coolDay(STU.night);STU.ready=true;{const im2=new Image();im2.onload=()=>{STU.day=downscale(im2,W,H)};im2.src='@@asset:image/webp@assets/art/studio/studio_day_v1.webp@@'}
 const S=STAGES[0],xs=[110,163,210,265,316,375,476,605];S.things.forEach((t,i)=>{if(xs[i]!=null)t.x=xs[i]});
 Object.assign(S,{art:true,win:[424,64,106,146],bed:{hx:135,y:250,flip:true,blanket:'#4a5a2a'},
  bg(s){R(s,0,0,W,H,'#120c08')},fg(f){},dynFg:null,
  amb(){return`rgba(8,6,16,${bulbOn?.04:.2})`},fgAmb(){return`rgba(8,6,16,${bulbOn?.2:.5})`},
  dyn(c,t){const dp=Math.max(0,dayCurve(gameMin/60)-dayCurve(this.sig));c.drawImage(STU.night,0,0);if(dp>0){c.globalAlpha=dp;c.drawImage(STU.day,0,0);c.globalAlpha=1}
   if(bulbOn)R(c,160,70,6,8,'#fff3c4');
   if(Math.random()<.004)this.dip=6;if(this.dip>0){this.dip--;R(c,424,64,106,146,'rgba(0,0,0,.35)')}},
  lights(){const L=[{x:316,y:192,r:170,a:.6*this.lf,lamp:1},{rect:[424,64,106,146],a:.5*(1-Math.max(0,dayCurve(gameMin/60)-dayCurve(this.sig))),fg:.2},{x:520,y:230,r:220,a:.35,fg:.6}];
   if(bulbOn)L.push({x:163,y:76,r:420*this.bf,a:.8*this.bf,lamp:1});return L},
  glows(c){glow(c,316,192,80,`rgba(70,110,170,${.18*this.lf})`);glow(c,500,240,160,'rgba(170,90,20,.08)');
   if(bulbOn)glow(c,163,76,200*this.bf,`rgba(160,120,60,${.22*this.bf})`)}});
 const[a,b]=mk(W,H);S.bg(b);S.bgC=a;const[c2,d2]=mk(W,H);S.bgC=a;S.fgC=c2;
};im.src=STUDIO_ART}
