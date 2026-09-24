/* ───────────── 3 · CORNER SUITE, painted art ───────────── */
const SUITE_ART='@@asset:image/webp@assets/art/suite/suite_goldenhour_v1.webp@@';
if(SUITE_ART){const im=new Image();im.onload=()=>{
 const S=STAGES[2],gold=downscale(im,W,H),D3={v:coolDay(gold)},xs=[40,120,180,395,493,300,562,615];
 S.things.forEach((t,i)=>{if(xs[i]!=null)t.x=xs[i]});
 Object.assign(S,{art:true,charH:140,win:[268,42,281,130],bed:{hx:153,y:228,flip:false,len:160,blanket:'#3a4a2a'},D3,
  bg(s){R(s,0,0,W,H,'#1c120c')},fg(f){},dynFg:null,
  amb(){return'rgba(30,12,6,.12)'},fgAmb(){return'rgba(30,12,6,.34)'},
  dyn(c,t){const dp=Math.max(0,dayCurve(gameMin/60)-dayCurve(this.sig));c.drawImage(gold,0,0);if(dp>0){c.globalAlpha=dp;c.drawImage(D3.v,0,0);c.globalAlpha=1}
   for(let i=0;i<5;i++){const k=(t*.15+i*53)%120;R(c,420+Math.sin(k*.08+i)*40+i*18,160+k,1,1,`rgba(255,220,160,${.35*(1-k/120)})`)}},
  lights(){return[{rect:[268,42,281,130],a:.5,fg:0},{x:430,y:190,r:420,a:.45,fg:.65},{x:494,y:168,r:110,a:.45,lamp:1},{x:410,y:165,r:90,a:.3,lamp:1}]},
  glows(c){glow(c,470,120,200,`rgba(255,150,60,${.14*(this.sf||1)})`);glow(c,494,168,60,'rgba(255,210,120,.12)');glow(c,410,165,50,'rgba(90,200,140,.08)')}});
 const[a]=mk(W,H),[b]=mk(W,H);S.bgC=a;S.fgC=b;
};im.src=SUITE_ART}
