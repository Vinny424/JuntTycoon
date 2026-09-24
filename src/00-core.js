
const W=640,H=360,FLOOR=300;
const mk=(w,h)=>{const c=document.createElement('canvas');c.width=w;c.height=h;const x=c.getContext('2d');x.imageSmoothingEnabled=false;return[c,x]};
const cv=document.createElement('canvas');cv.width=W;cv.height=H;const ctx=cv.getContext('2d');ctx.imageSmoothingEnabled=false;
const [lc,l]=mk(W/2,H/2);   // light mask (half-res = chunky pixel light)
const [fc,f]=mk(W,H);       // foreground layer (props + player)
const R=(c,x,y,w,h,col)=>{c.fillStyle=col;c.fillRect(Math.round(x),Math.round(y),Math.round(w),Math.round(h))};
const poly=(c,pts,col)=>{c.fillStyle=col;c.beginPath();pts.forEach((p,i)=>i?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]));c.closePath();c.fill()};
const ell=(c,cx,cy,rx,ry,col)=>{for(let dy=-ry;dy<=ry;dy++){const w=rx*Math.sqrt(Math.max(0,1-(dy/ry)**2));R(c,cx-w,cy+dy,w*2,1,col)}};
const txt=(c,s,x,y,col,px=8,font='Silkscreen')=>{c.font=`${px}px ${font}`;c.fillStyle=col;c.fillText(s,x,y)};
let seed=7;const rnd=()=>(seed=(seed*16807)%2147483647)/2147483647;
const hex=h=>[1,3,5].map(i=>parseInt(h.slice(i,i+2),16));
const lerp=(a,b,t)=>{const A=hex(a),B=hex(b);return`rgb(${A.map((v,i)=>Math.round(v+(B[i]-v)*t)).join(',')})`};
function bands(c,x,y,w,h,stops,n){for(let i=0;i<n;i++){const t=i/(n-1)*(stops.length-1),k=Math.min(stops.length-2,Math.floor(t));R(c,x,y+i*h/n,w,Math.ceil(h/n)+1,lerp(stops[k],stops[k+1],t-k))}}
function reflect(c,x,y0,w,h,a){const[tc,t]=mk(w,h);t.drawImage(c.canvas,x,y0-h,w,h,0,0,w,h);c.save();c.globalAlpha=a;c.scale(1,-1);c.drawImage(tc,x,-(y0+h),w,h);c.restore()}
function glow(c,x,y,r,col){if(r<=0)return;const g=c.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,col);g.addColorStop(1,'rgba(0,0,0,0)');c.fillStyle=g;c.fillRect(x-r,y-r,r*2,r*2)}

let bulbOn=false;
const STAGES=[];

