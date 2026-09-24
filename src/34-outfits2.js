/*@@ module outfits2.js begin @@*/
/* ───────────── Outfits for stages 3–5 ─────────────
   Until the painted blazer / turtleneck / suit sheets exist, these are derived from the bomber sheet by
   recoloring jacket, shirt, trousers and shoes. When a painted sheet is embedded with registerOutfit(),
   it replaces the derived one automatically (see tools/embed_sheet.py). */
const OUTFITS={
 blazer:{stage:2,base:'bomber',jacket:'#26345a',shirt:'#e6dcc4',pants:'#8a7a5a',shoe:'#3a2014'},
 turtle:{stage:3,base:'bomber',jacket:'#1b1b20',shirt:'#0e0e12',pants:'#2e2e34',shoe:'#1a1410'},
 suit:  {stage:4,base:'bomber',jacket:'#3a3c46',shirt:'#f0f0f0',pants:'#3a3c46',shoe:'#0e0e10'},
};
for(const[k,o]of Object.entries(OUTFITS))STAGES[o.stage].sheet=k;

function hsl(r,g,b){r/=255;g/=255;b/=255;const M=Math.max(r,g,b),m=Math.min(r,g,b),l=(M+m)/2,d=M-m;let h=0,s=0;
 if(d){s=d/(1-Math.abs(2*l-1));h=M==r?((g-b)/d)%6:M==g?(b-r)/d+2:(r-g)/d+4;h*=60;if(h<0)h+=360}return[h,s,l]}
const lum=(r,g,b)=>.299*r+.587*g+.114*b;
// recolor one canvas frame. zones by vertical position t (0 top … 1 feet) keep the head and hands untouched
function recolorFrame(src,spec,kind){
 const w=src.width,h=src.height,o=document.createElement('canvas');o.width=w;o.height=h;const x=o.getContext('2d');x.drawImage(src,0,0);
 const d=x.getImageData(0,0,w,h),p=d.data,A=(xx,yy)=>xx<0||yy<0||xx>=w||yy>=h?0:p[(yy*w+xx)*4+3];
 const J=hex(spec.jacket),Sh=hex(spec.shirt),Pa=hex(spec.pants),Sk=hex(spec.shoe);
 const Jl=lum(...J),out=new Uint8ClampedArray(p);
 // average lightness of the jacket in the source so we keep its folds and highlights
 let sum=0,n=0;for(let i=0;i<p.length;i+=4){if(p[i+3]<200)continue;const[hh,s,l]=hsl(p[i],p[i+1],p[i+2]);if(s>.18&&hh>200&&hh<262&&l<.6){sum+=lum(p[i],p[i+1],p[i+2]);n++}}
 const jAvg=n?sum/n:40;
 const paint=(i,c,ref,lo=.5,hi=1.7)=>{const k=Math.max(lo,Math.min(hi,lum(p[i],p[i+1],p[i+2])/ref));out[i]=Math.min(255,c[0]*k);out[i+1]=Math.min(255,c[1]*k);out[i+2]=Math.min(255,c[2]*k)};
 for(let yy=0;yy<h;yy++)for(let xx=0;xx<w;xx++){
  const i=(yy*w+xx)*4;if(p[i+3]<200)continue;
  const r=p[i],g=p[i+1],b=p[i+2],[hh,s,l]=hsl(r,g,b),ch=Math.max(r,g,b)-Math.min(r,g,b),t=kind=='lie'?1-xx/w:yy/h;   // lying pose: head is on the right
  if(s>.18&&hh>200&&hh<262&&l<.6){paint(i,J,jAvg,.45,1.9);continue}                       // navy jacket -> jacket color
  const inner=A(xx-2,yy)&&A(xx+2,yy)&&A(xx,yy-2)&&A(xx,yy+2);
  if(ch<24&&l<.24&&inner){                                                                  // black neutrals
   const legs=kind=='sit'?t>.45:kind=='lie'?t>.4:t>.56&&t<.93;
   if(legs)paint(i,Pa,26,.5,2.2);                                                          // trousers
   else if(t>.3&&t<=.56&&r<=b+8)paint(i,Sh,22,.5,2.4);   // (r<=b+8 keeps dark hair)                                           // shirt
   continue}
  if(t>(kind=='lie'?.86:.88)&&ch<55&&l>.17)paint(i,Sk,190,.55,1.5);                          // sneakers -> shoes
 }
 d.data.set(out);x.putImageData(d,0,0);return o;
}
const deriveOutfits=()=>{
 const wSheet=SPR.sheets&&SPR.sheets.bomber,pSheet=POSE.sheets&&POSE.sheets.bomber;
 if(!wSheet||!pSheet)return false;
 for(const[k,spec]of Object.entries(OUTFITS)){
  if(!SPR.sheets[k])SPR.sheets[k]=wSheet.map(f=>({c:recolorFrame(f.c,spec),ax:f.ax}));
  if(!POSE.sheets[k])POSE.sheets[k]=pSheet.map((c,i)=>recolorFrame(c,spec,i?'sit':'lie'));
 }
 return true};
{const iv=setInterval(()=>{if(deriveOutfits())clearInterval(iv)},150)}

// painted sheets from ChatGPT replace the derived ones: registerOutfit('blazer', walkSheetDataURI, posesDataURI)
function registerOutfit(name,walkSrc,poseSrc){
 if(walkSrc){const im=new Image();im.onload=()=>{const f=loadWalkSheet(im);if(f.length>=6){SPR.sheets[name]=f;for(const k in SPR.cache)if(k.startsWith(name))delete SPR.cache[k]}};im.src=walkSrc}
 if(poseSrc){const im=new Image();im.onload=()=>{const f=keySheet(im);if(f.length>=2){POSE.sheets[name]=f;for(const k in POSE.cache)if(k.startsWith(name))delete POSE.cache[k]}};im.src=poseSrc}
}
/*@@ module outfits2.js end @@*/
