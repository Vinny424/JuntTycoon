/* ───────────── 5 · BILLIONAIRES' ROW · night over Central Park ───────────── */
STAGES.push({
 key:'Penthouse',name:"Billionaires' Row · 96th Floor · Night",cash:'$1.2B',units:'14 towers',
 intro:'Ninety-six floors above 57th Street. Floor-to-ceiling glass, and Central Park laid out below like a model.',
 outfit:{top:'#2c2e36',shade:'#1c1e24',arm:'#25272e',p1:'#2c2e36',p2:'#32343c',shoe:'#0e0e10',hair:'#3a3a3a',acc:'#f4f4f4',style:'suit'},
 bg(s){
  R(s,0,0,W,H,'#08080c');
  bands(s,0,40,W,102,['#060a20','#101838','#26264a','#4a3450'],14);
  for(let x=150;x<490;){const h=3+rnd()*12|0,w=3+rnd()*6|0;R(s,x,140-h,w,h,'#1c1a2c');if(rnd()<.7)R(s,x+1,140-h+1+(rnd()*Math.max(1,h-2)|0),1,1,'#e8c890');x+=w}
  poly(s,[[150,140],[490,140],[700,300],[-60,300]],'#0b1810');
  for(let i=0;i<1600;i++){const y=140+rnd()*160,t=(y-140)/160,xl=150-t*210,xr=490+t*210,sz=1+t*3;R(s,xl+rnd()*(xr-xl),y,sz,Math.max(1,sz*.7),rnd()<.5?'#10241a':'#07120c')}
  ell(s,300,240,92,12,'#132619');ell(s,228,213,36,6,'#15223a');ell(s,330,164,64,7,'#162542');
  for(let i=0;i<14;i++)R(s,280+rnd()*100,160+rnd()*8,2+rnd()*6,1,'#3a4a70');
  R(s,160,190,322,1,'#1a1a1a');
  for(let p=0;p<7;p++){let x=180+rnd()*280;for(let y=148;y<300;y+=5+((y-140)/160)*11){const t=(y-140)/160,xl=150-t*210,xr=490+t*210;x+=Math.sin(y*.05+p)*2.2;if(x>xl+4&&x<xr-4)R(s,x,y,t>.5?2:1,t>.5?2:1,'#ffcf7a')}}
  for(let side=0;side<2;side++)for(let i=0;i<=18;i++){const t=i/18,by=140+t*162,ex=side?490+t*210:150-t*210,col=lerp('#1c1c2c','#0c0c16',t);
   for(let k=0,bx=ex;k<14;k++){const w=(14+t*46)*(.7+rnd()*.6),h=(8+t*80)*(.6+rnd()*.8);const x0=side?bx:bx-w;R(s,x0,by-h,w-1,h,col);
    const ws=t>.55?2:1;for(let yy=by-h+2;yy<by-2;yy+=ws+2)for(let xx=x0+1;xx<x0+w-2;xx+=ws+2)if(rnd()<.28)R(s,xx,yy,ws,ws,rnd()<.8?'#ffd890':'#bcd0ff');
    bx=side?bx+w:bx-w;if(bx<-80||bx>720)break}}
  for(let i=0;i<40;i++)R(s,rnd()*W,40+rnd()*260,1,8+rnd()*20,'rgba(200,220,255,.03)');
  for(const mx of[0,127,255,383,511,637])R(s,mx,40,3,260,'#050508');R(s,0,36,W,4,'#050508');R(s,0,0,W,36,'#101014');R(s,0,34,W,1,'#2a2a34');
  R(s,0,292,W,8,'#0a0a10');R(s,0,300,W,60,'#1a1412');for(let y=306;y<H;y+=9)R(s,0,y,W,1,'#130e0c');
  reflect(s,0,292,W,60,.22);
 },
 fg(f){
  R(f,40,266,180,16,'#24242c');R(f,40,280,180,16,'#2c2c34');R(f,40,296,180,2,'#16161c');R(f,48,262,20,14,'#3a3a44');R(f,190,264,20,12,'#8a6a2a');
  f.strokeStyle='#b8923a';f.lineWidth=2;f.beginPath();f.moveTo(242,296);f.quadraticCurveTo(250,120,300,150);f.stroke();R(f,234,294,18,4,'#8a6a2a');
  poly(f,[[290,150],[312,150],[308,160],[294,160]],'#c9a038');
  poly(f,[[330,262],[440,262],[452,270],[452,282],[330,282]],'#0a0a0e');poly(f,[[344,262],[430,262],[398,222]],'#0e0e14');R(f,398,222,2,40,'#1a1a22');
  R(f,334,282,4,18,'#0a0a0e');R(f,444,282,4,18,'#0a0a0e');R(f,352,256,70,2,'#e8e8e8');for(let x=354;x<420;x+=4)R(f,x,256,1,1,'#111');
  R(f,380,284,30,4,'#0a0a0e');R(f,382,288,2,12,'#0a0a0e');R(f,406,288,2,12,'#0a0a0e');
  R(f,480,256,100,3,'#6a8098');R(f,484,259,2,41,'#8a9aaa');R(f,574,259,2,41,'#8a9aaa');R(f,506,224,48,28,'#08080a');R(f,528,252,4,4,'#8a9aaa');
 },
 tick(t){},
 amb(){return'rgba(6,8,22,.55)'},fgAmb(){return'rgba(4,6,16,.8)'},
 dyn(c,t){
  for(let i=0;i<6;i++){const x=160+((t*(.6+i*.13)+i*70)%322);R(c,x,189,2,1,i%2?'#fff4d0':'#ff4040')}
  if(Math.floor(t/40)%2)R(c,344,126,1,1,'#ff3030');
  const hx=(t*.25)%760-60;R(c,hx,70,2,1,'#e0e0ff');if(Math.floor(t/20)%2)R(c,hx+2,71,1,1,'#ff4040');
 },
 dynFg(c,t){R(c,508,226,44,24,'#0c1420');[[516,234],[524,238],[534,232],[544,240],[520,244],[540,228]].forEach(([x,y],i)=>R(c,x,y,2,2,(Math.floor(t/25)+i)%5?'#e0b448':'#fff'));R(c,508,249,44,1,'#e0b448')},
 lights(){return[
  {rect:[0,40,W,260],a:.95,fg:0},{x:320,y:220,r:700,a:.35,fg:.45},{x:301,y:162,r:170,a:.6,lamp:1},{x:530,y:240,r:70,a:.35,lamp:1}
 ]},
 glows(c){glow(c,301,162,110,'rgba(255,190,110,.14)');glow(c,320,160,420,'rgba(60,90,160,.10)');poly(c,[[260,300],[340,300],[360,360],[240,360]],'rgba(255,190,110,.04)')},
 things:[
  {x:130,name:'Sleep',msg:'The primary suite faces the Hudson. Sleep will move time forward (phase 2).'},
  {x:246,name:'Arc lamp',msg:'Brass, Italian, and older than you are.'},
  {x:390,name:'Piano',msg:'A concert grand you can\'t play. Yet.'},
  {x:530,name:'Holdings',msg:'Fourteen towers in six cities. The duplex from year one is still in the portfolio. You won\'t sell it.'},
  {x:600,name:'The view',msg:'Central Park: 843 acres, the only real estate in Manhattan nobody can buy.'},
 ]
});

