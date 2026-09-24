/* ───────────── 3 · DOWNTOWN SUITE · golden hour · grounded warm ───────────── */
STAGES.push({
 key:'Downtown',name:'Corner Suite, 14th Floor · Golden Hour',cash:'$214,900',units:'38 units',
 intro:'A real office with wood paneling and a view. The sun comes in sideways at 6 PM, right on your desk.',
 outfit:{top:'#2a3550',shade:'#1c2438',arm:'#243049',p1:'#8a7a5a',p2:'#7e6e50',shoe:'#3a2014',hair:'#2B1E16',acc:'#f0ece0',style:'blazer'},
 bg(s){
  R(s,0,0,W,H,'#1c120c');R(s,0,0,W,34,'#4a3426');R(s,0,34,W,4,'#8a6440');R(s,0,38,W,2,'#5a3e2a');
  R(s,0,40,W,160,'#a88462');for(let i=0;i<300;i++)R(s,rnd()*W,40+rnd()*158,1,1,rnd()<.5?'#b08c6a':'#9c7a58');
  R(s,0,198,W,4,'#7a4c2c');R(s,0,202,W,98,'#5c3620');
  for(let x=0;x<W;x+=64){R(s,x+6,208,52,80,'#6a4028');R(s,x+6,208,52,2,'#4a2a18');R(s,x+6,286,52,2,'#7a4c30')}
  R(s,0,292,W,8,'#3a2014');R(s,0,300,W,60,'#5a3420');
  for(let y=300;y<H;y+=6)for(let x=(y/6%2)*6;x<W;x+=12){R(s,x,y,6,1,'#4e2c1a');R(s,x+6,y+3,6,1,'#6a4028')}
  R(s,150,308,300,28,'#6a2226');R(s,150,308,300,2,'#c8a060');R(s,150,334,300,2,'#c8a060');for(let x=158;x<446;x+=12)R(s,x,314,6,2,'#c8a060');for(let x=164;x<446;x+=12)R(s,x,328,6,2,'#9a6a40');
  // window: golden-hour skyline
  R(s,326,62,218,192,'#3a2416');
  bands(s,330,66,210,184,['#3a2a5a','#8a3a6a','#e0605a','#ff9a4a','#ffd08a'],16);
  ell(s,468,214,15,15,'#ffe6a0');ell(s,468,214,11,11,'#fff6d0');
  for(let x=330;x<540;){const w=10+rnd()*22|0,h=24+rnd()*110|0;R(s,x,250-h,w,h,'#4a2a3a');R(s,x+w-2,250-h,2,h,'#9a5040');
   for(let yy=250-h+4;yy<246;yy+=6)for(let xx=x+2;xx<x+w-3;xx+=4)if(rnd()<.18)R(s,xx,yy,2,2,'#ffd08a');x+=w+(rnd()*4|0)}
  R(s,398,66,4,184,'#3a2416');R(s,468,66,4,184,'#3a2416');R(s,330,150,210,3,'#3a2416');R(s,322,250,226,6,'#7a4c2c');
  // framed first deed + photo
  R(s,246,106,56,44,'#b8923a');R(s,249,109,50,38,'#efe6cc');for(let y=116;y<140;y+=4)R(s,253,y,34,1,'#a89878');R(s,288,134,6,6,'#a03030');
  R(s,180,120,50,36,'#2a1a10');R(s,183,123,44,30,'#8aa0b0');R(s,190,134,18,19,'#c8b090');R(s,193,128,12,6,'#7a3a2a');R(s,210,140,14,13,'#b8a080');
  // door
  R(s,598,190,40,110,'#3a2014');R(s,602,194,32,106,'#6a3a1e');R(s,606,200,24,40,'#5a3018');R(s,606,248,24,44,'#5a3018');R(s,628,246,3,5,'#d8b050');
 },
 fg(f){
  R(f,24,110,88,190,'#4a2a18');R(f,28,114,80,182,'#2e1a10');
  const cols=['#7a2e2e','#2e4a6a','#c8a060','#3e5a3a','#8a6a4a','#d8c8a0','#5a3a5a'];
  for(let sy=146;sy<=298;sy+=38){R(f,28,sy,80,4,'#6a4028');for(let x=30;x<104;){const w=4+rnd()*5|0,h=18+rnd()*14|0;if(rnd()<.08){x+=6;continue}R(f,x,sy-h,w,h,cols[rnd()*cols.length|0]);R(f,x,sy-h+3,w,1,'rgba(255,230,180,.35)');x+=w+1}}
  R(f,130,254,130,22,'#7a3e22');for(let y=258;y<274;y+=6)for(let x=136;x<256;x+=10)R(f,x+(y%12?5:0),y,2,2,'#5a2a16');
  R(f,130,274,130,14,'#8a4a2a');R(f,122,258,14,36,'#6a3418');R(f,254,258,14,36,'#6a3418');R(f,122,258,14,3,'#8a4a2a');R(f,254,258,14,3,'#8a4a2a');
  R(f,128,294,4,6,'#c8a060');R(f,258,294,4,6,'#c8a060');
  R(f,346,252,168,6,'#6a3a1e');R(f,352,258,156,42,'#5a3018');R(f,358,264,40,14,'#4e2814');R(f,358,282,40,14,'#4e2814');R(f,374,270,8,2,'#d8b050');R(f,374,288,8,2,'#d8b050');
  R(f,378,220,44,28,'#111');R(f,396,248,8,4,'#222');R(f,426,220,44,28,'#111');R(f,444,248,8,4,'#222');
  R(f,478,246,14,6,'#b8923a');R(f,484,236,2,10,'#b8923a');R(f,474,230,24,8,'#2e6a3e');R(f,474,237,24,1,'#1e4a2a');
  R(f,562,272,28,28,'#d8d0c0');R(f,562,272,28,3,'#bcb4a4');R(f,575,236,2,36,'#4a3a20');
  [[566,236],[580,228],[560,250],[582,246],[570,222],[586,260]].forEach(([x,y],i)=>{ell(f,x,y,6,4,i%2?'#3e6a3a':'#2e5a2e');R(f,x-4,y,8,1,'#5a8a4a')});
 },
 tick(t){this.sf=.95+Math.sin(t*.02)*.05},
 amb(){return'rgba(40,16,8,.3)'},fgAmb(){return'rgba(36,12,6,.46)'},
 dynFg(c,t){
  R(c,380,222,40,24,'#10202a');for(let i=0;i<9;i++){const h=3+i*2+(i==5?-4:0);R(c,383+i*4,244-h,3,h,'#5ad08a')}
  R(c,428,222,40,24,'#1a2a3a');R(c,428,233,40,1,'#2a3a4a');R(c,446,222,1,24,'#2a3a4a');
  [[434,228],[452,238],[460,226],[440,240]].forEach(([x,y],i)=>R(c,x,y,2,2,(Math.floor(t/20)+i)%4?'#ffb45a':'#fff'));
 },
 lights(){return[
  {rect:[330,66,210,184],a:.92,fg:0},{x:440,y:210,r:440,a:.55*this.sf,fg:.7},{x:486,y:242,r:120,a:.5,lamp:1},{x:424,y:236,r:100,a:.4,lamp:1}
 ]},
 glows(c){
  glow(c,450,215,300,`rgba(255,150,60,${.15*this.sf})`);glow(c,486,240,80,'rgba(255,200,120,.12)');
  poly(c,[[330,300],[540,300],[520,360],[250,360]],'rgba(255,170,80,.12)');
  for(const [a,b] of [[340,380],[410,450],[480,520]])poly(c,[[a,70],[b,70],[b-150,300],[a-150,300]],'rgba(255,190,110,.04)');
 },
 things:[
  {x:68,name:'Bookshelf',msg:'Tax code, negotiation, construction law and one fantasy novel you swear is research.'},
  {x:195,name:'Sleep',msg:'The chesterfield. You go home now, mostly. A power nap counts.'},
  {x:274,name:'First deed',msg:'The duplex. Your first deed, framed. You still drive past it sometimes.'},
  {x:430,name:'Workstation',msg:'Two monitors. 38 units, 96% occupancy, and a lender who calls you back now.'},
  {x:486,name:'Lamp',msg:'A banker\'s lamp. You bought it the day you felt like one.'},
  {x:520,name:'Window',msg:'Golden hour over downtown. Three of those buildings are for sale. You\'ve toured two.'},
  {x:576,name:'Fiddle-leaf fig',msg:'It\'s thriving. Your assistant waters it.'},
  {x:617,name:'Door',msg:'Suite 1400. Brass plate. Your name is spelled correctly.'},
 ]
});

