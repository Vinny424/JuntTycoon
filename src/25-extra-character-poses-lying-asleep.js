/* ───────────── Extra character poses: lying asleep (head right) + groggy sit ───────────── */
const POSES_SRC='@@asset:image/webp@assets/art/character/player_hoodie_poses_v1.webp@@';
const POSE={ready:false,frames:[],cache:{}};
function keySheet(im){
 const c=document.createElement('canvas'),w=c.width=im.width,h=c.height=im.height,x=c.getContext('2d');x.drawImage(im,0,0);
 const d=x.getImageData(0,0,w,h),p=d.data;
 for(let i=0;i<p.length;i+=4){const r=p[i],g=p[i+1],b=p[i+2],m=Math.min(r,b)-g;if(m>55&&Math.abs(r-b)<110)p[i+3]=0;else if(m>8){p[i]=Math.min(r,g+8);p[i+2]=Math.min(b,g+8)}}
 x.putImageData(d,0,0);
 const col=new Array(w).fill(0);for(let yy=0;yy<h;yy++)for(let xx=0;xx<w;xx++)if(p[(yy*w+xx)*4+3])col[xx]++;
 const segs=[];let s=-1;for(let xx=0;xx<=w;xx++){const on=xx<w&&col[xx]>2;if(on&&s<0)s=xx;if(!on&&s>=0){if(xx-s>30)segs.push([s,xx]);s=-1}}
 return segs.map(([a,b])=>{let top=h,bot=0;for(let yy=0;yy<h;yy++)for(let xx=a;xx<b;xx++)if(p[(yy*w+xx)*4+3]){if(yy<top)top=yy;if(yy>bot)bot=yy}
  const f=document.createElement('canvas');f.width=b-a;f.height=bot-top+1;f.getContext('2d').drawImage(c,a,top,b-a,bot-top+1,0,0,b-a,bot-top+1);return f})}
function scaleKeyed(src,s,key){if(POSE.cache[key])return POSE.cache[key];const Wd=Math.max(1,Math.round(src.width*s)),Hd=Math.max(1,Math.round(src.height*s));
 let c=src,cw=c.width,ch=c.height;while(cw/2>=Wd){const n=document.createElement('canvas');n.width=cw=Math.round(cw/2);n.height=ch=Math.round(ch/2);const x=n.getContext('2d');x.imageSmoothingQuality='high';x.drawImage(c,0,0,cw,ch);c=n}
 const o=document.createElement('canvas');o.width=Wd;o.height=Hd;const x=o.getContext('2d');x.imageSmoothingQuality='high';x.drawImage(c,0,0,Wd,Hd);
 const d=x.getImageData(0,0,Wd,Hd),p=d.data;for(let i=3;i<p.length;i+=4)p[i]=p[i]<150?0:255;x.putImageData(d,0,0);return POSE.cache[key]=o}
if(POSES_SRC){const im=new Image();im.onload=()=>{POSE.frames=keySheet(im);POSE.ready=POSE.frames.length>=2};im.src=POSES_SRC}
// scale against the standing sprite so sizes match (standing figure height in the source sheet)
const poseScale=()=>(st.charH||84)/(((SPR.sheets&&SPR.sheets[st.sheet])||SPR.frames)[0]?.c.height||659);
const _drawLieP=drawLie,_drawSitP=drawSit;
drawLie=function(c,o,b){
 if(!POSE.ready||!SPR.ready)return _drawLieP(c,o,b);
 const pf=(POSE.sheets&&POSE.sheets[st.sheet])||POSE.frames,src=pf[0],s=Math.min(poseScale(),(b.len||175)/src.width),f=scaleKeyed(src,s,(st.sheet||'')+'lie'+s.toFixed(4)),br=Math.sin(time*.07)>0?1:0,head=b.hx+30;
 c.save();if(!b.flip){c.translate(2*b.hx+12,0);c.scale(-1,1)}
 c.drawImage(f,Math.round(head-f.width),Math.round(b.y-f.height+8-br));c.restore()};
drawSit=function(c,o,x,y){
 if(!POSE.ready||!SPR.ready)return _drawSitP(c,o,x,y);
 const pf=(POSE.sheets&&POSE.sheets[st.sheet])||POSE.frames,src=pf[1],s=poseScale(),f=scaleKeyed(src,s,(st.sheet||'')+'sit'+s.toFixed(4));
 c.drawImage(f,Math.round(x-f.width*.45),Math.round(FLOOR-f.height))};
