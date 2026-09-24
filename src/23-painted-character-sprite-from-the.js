/* ───────────── Painted character sprite (from the AI sprite sheet) ───────────── */
const SPRITE_SRC='@@asset:image/webp@assets/art/character/player_hoodie_sheet_v1.webp@@';
const SPR={ready:false,frames:[],cache:{}};
STAGES[0].charH=140;STAGES[3].charH=118;
if(SPRITE_SRC){const im=new Image();im.onload=()=>{
 const c=document.createElement('canvas'),w=c.width=im.width,h=c.height=im.height,x=c.getContext('2d');x.drawImage(im,0,0);
 const d=x.getImageData(0,0,w,h),p=d.data;
 for(let i=0;i<p.length;i+=4){const r=p[i],g=p[i+1],b=p[i+2],m=Math.min(r,b)-g;if(m>55&&Math.abs(r-b)<110)p[i+3]=0;else if(m>8){p[i]=Math.min(r,g+8);p[i+2]=Math.min(b,g+8)}}
 x.putImageData(d,0,0);
 const col=new Array(w).fill(0);let top=h,bot=0;
 for(let yy=0;yy<h;yy++)for(let xx=0;xx<w;xx++)if(p[(yy*w+xx)*4+3]){col[xx]++;if(yy<top)top=yy;if(yy>bot)bot=yy}
 const segs=[];let s=-1;for(let xx=0;xx<=w;xx++){const on=xx<w&&col[xx]>2;if(on&&s<0)s=xx;if(!on&&s>=0){if(xx-s>30)segs.push([s,xx]);s=-1}}
 SPR.frames=segs.slice(0,6).map(([a,b])=>{
  let mx=0,n=0;for(let yy=top;yy<top+(bot-top)*.35;yy++)for(let xx=a;xx<b;xx++)if(p[(yy*w+xx)*4+3]){mx+=xx-a;n++}
  const f=document.createElement('canvas');f.width=b-a;f.height=bot-top+1;f.getContext('2d').drawImage(c,a,top,b-a,bot-top+1,0,0,b-a,bot-top+1);
  return{c:f,ax:n?mx/n:(b-a)/2}});
 SPR.ready=SPR.frames.length>=6;
};im.src=SPRITE_SRC}
function sprFrame(i,H){const sh=SPR.sheets&&SPR.sheets[st.sheet]?st.sheet:'hoodie',k=sh+i+'_'+H;if(SPR.cache[k])return SPR.cache[k];const F=(SPR.sheets&&SPR.sheets[sh]||SPR.frames)[i],s=H/F.c.height,Wd=Math.max(1,Math.round(F.c.width*s));
 let c=F.c,cw=c.width,ch=c.height;while(cw/2>=Wd){const n=document.createElement('canvas');n.width=cw=Math.round(cw/2);n.height=ch=Math.round(ch/2);const x=n.getContext('2d');x.imageSmoothingQuality='high';x.drawImage(c,0,0,cw,ch);c=n}
 const o=document.createElement('canvas');o.width=Wd;o.height=H;const x=o.getContext('2d');x.imageSmoothingQuality='high';x.drawImage(c,0,0,Wd,H);
 const d=x.getImageData(0,0,Wd,H),p=d.data;for(let i2=3;i2<p.length;i2+=4)p[i2]=p[i2]<150?0:255;x.putImageData(d,0,0);
 return SPR.cache[k]={c:o,ax:F.ax*s}}
const _drawPlayerS=drawPlayer,_drawLieS=drawLie,_drawSitS=drawSit;
drawPlayer=function(c,o,stretch){
 if(!SPR.ready)return _drawPlayerS(c,o,stretch);
 const H=st.charH||84,moving=Math.abs(pl.vx)>.1,i=stretch?5:moving?1+Math.floor(pl.walk*.3)%4:0,f=sprFrame(i,H),x=Math.round(pl.x),y=Math.round(FLOOR-(pl.lift||0)-H+(moving&&Math.floor(pl.walk*.3)%2?-1:0));
 if(pl.face<0&&!stretch){c.save();c.translate(x*2,0);c.scale(-1,1)}
 c.drawImage(f.c,Math.round(x-(stretch?f.c.width/2:f.ax)),y);
 if(pl.face<0&&!stretch)c.restore()};
drawSit=function(c,o,x,y){if(!SPR.ready)return _drawSitS(c,o,x,y);const H=st.charH||84,f=sprFrame(0,H);c.drawImage(f.c,Math.round(x-f.ax),Math.round(FLOOR-H+4))};
drawLie=function(c,o,b){
 if(!SPR.ready)return _drawLieS(c,o,b);
 const H=st.charH||84,f=sprFrame(0,H),w=f.c.width,br=Math.sin(time*.07)>0?1:0,tx=b.hx+22,ty=b.y-w+8-br;
 c.save();if(!b.flip){c.translate(2*b.hx+12,0);c.scale(-1,1)}
 c.save();c.translate(tx,ty+Math.round(w*.35));c.rotate(Math.PI/2);c.beginPath();c.rect(0,0,w,Math.round(H*.24));c.clip();c.drawImage(f.c,0,0);c.restore();
 if(!st.art){const bx=tx-H,bw=Math.round(H*.8);R(c,bx,ty+Math.round(w*.35),bw,Math.round(w*.65),b.blanket)}
 c.restore()};
