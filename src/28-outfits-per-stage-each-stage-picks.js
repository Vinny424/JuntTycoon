/* ───────────── Outfits per stage (each stage picks a sprite sheet) ───────────── */
const BOMBER_SRC='@@asset:image/webp@assets/art/character/player_bomber_sheet_v1.webp@@';
STAGES[0].sheet='hoodie';STAGES[1].sheet='bomber';
function loadWalkSheet(im){
 const c=document.createElement('canvas'),w=c.width=im.width,h=c.height=im.height,x=c.getContext('2d');x.drawImage(im,0,0);
 const d=x.getImageData(0,0,w,h),p=d.data;
 for(let i=0;i<p.length;i+=4){const r=p[i],g=p[i+1],b=p[i+2],m=Math.min(r,b)-g;if(m>55&&Math.abs(r-b)<110)p[i+3]=0;else if(m>8){p[i]=Math.min(r,g+8);p[i+2]=Math.min(b,g+8)}}
 x.putImageData(d,0,0);
 const col=new Array(w).fill(0);let top=h,bot=0;
 for(let yy=0;yy<h;yy++)for(let xx=0;xx<w;xx++)if(p[(yy*w+xx)*4+3]){col[xx]++;if(yy<top)top=yy;if(yy>bot)bot=yy}
 const segs=[];let s=-1;for(let xx=0;xx<=w;xx++){const on=xx<w&&col[xx]>2;if(on&&s<0)s=xx;if(!on&&s>=0){if(xx-s>30)segs.push([s,xx]);s=-1}}
 return segs.slice(0,6).map(([a,b])=>{let mx=0,n=0;for(let yy=top;yy<top+(bot-top)*.35;yy++)for(let xx=a;xx<b;xx++)if(p[(yy*w+xx)*4+3]){mx+=xx-a;n++}
  const f=document.createElement('canvas');f.width=b-a;f.height=bot-top+1;f.getContext('2d').drawImage(c,a,top,b-a,bot-top+1,0,0,b-a,bot-top+1);return{c:f,ax:n?mx/n:(b-a)/2}})}
SPR.sheets=SPR.sheets||{};
{const wait=setInterval(()=>{if(SPR.ready){SPR.sheets.hoodie=SPR.frames;clearInterval(wait)}},100)}
if(BOMBER_SRC){const im=new Image();im.onload=()=>{const f=loadWalkSheet(im);if(f.length>=6)SPR.sheets.bomber=f};im.src=BOMBER_SRC}
/* per-outfit sleep/sit poses */
POSE.sheets={};{const w=setInterval(()=>{if(POSE.ready){POSE.sheets.hoodie=POSE.frames;clearInterval(w)}},100)}
{const im=new Image();im.onload=()=>{const f=keySheet(im);if(f.length>=2)POSE.sheets.bomber=f};im.src='@@asset:image/webp@assets/art/character/player_bomber_poses_v1.webp@@'}
