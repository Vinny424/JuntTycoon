/* ───────────── 2 · HUSTLE OFFICE · late night · neon ───────────── */
STAGES.push({
 key:'Hustle',name:'Suite 2B, above the laundromat · 2 AM',cash:'$8,420',units:'3 units',
 intro:'First real office: one room above a 24-hour laundromat. The neon never turns off, and neither do you.',
 outfit:{top:'#2e3f66',shade:'#1f2c4a',arm:'#27365a',p1:'#1d2029',p2:'#23262f',shoe:'#e8e8e8',hair:'#2B1E16',acc:'#ff4f9a',style:'jacket'},
 bg(s){
  R(s,0,0,W,H,'#0e0c16');R(s,0,0,W,40,'#2a2a34');for(let x=0;x<W;x+=40)R(s,x,0,1,40,'#1d1d25');R(s,0,20,W,1,'#1d1d25');R(s,0,39,W,1,'#15151b');
  R(s,258,32,124,8,'#8c95a0');
  R(s,0,40,W,180,'#3a3452');R(s,0,220,W,80,'#302b45');R(s,0,218,W,3,'#4a4466');
  for(let i=0;i<14;i++)R(s,rnd()*W,60+rnd()*220,4+rnd()*20,2+rnd()*8,'rgba(15,10,25,.3)');
  R(s,0,292,W,8,'#23202f');R(s,0,300,W,60,'#1e2232');
  for(let i=0;i<500;i++)R(s,rnd()*W,300+rnd()*60,1,1,rnd()<.5?'#262b3d':'#171a26');
  // bandit sign taped to the wall
  R(s,112,112,56,34,'#e8d24a');R(s,112,144,56,2,'#b8a030');txt(s,'WE BUY',118,125,'#1a1a1a',8);txt(s,'HOUSES',118,138,'#1a1a1a',8);R(s,136,110,8,3,'rgba(220,220,200,.7)');
  // whiteboard
  R(s,188,146,96,62,'#9aa0ac');R(s,191,149,90,54,'#dfe4ec');
  txt(s,'NOI',196,160,'#c03030',8);txt(s,'CAP 8%?',220,160,'#2a50b0',8);
  R(s,196,168,40,1,'#2a50b0');R(s,196,176,56,1,'#2a50b0');R(s,246,170,26,20,'#dfe4ec');R(s,246,170,26,1,'#c03030');R(s,246,189,26,1,'#c03030');R(s,246,170,1,20,'#c03030');R(s,271,170,1,20,'#c03030');
  txt(s,'BRRRR',196,196,'#2a8040',8);R(s,196,206,80,3,'#7a808c');
  // window: street + brick across
  R(s,418,106,146,138,'#15131e');R(s,422,110,138,130,'#120e22');R(s,422,146,138,94,'#3a1f2c');
  for(let y=148;y<240;y+=4)R(s,422,y,138,1,'#2e1824');
  for(let x=430;x<556;x+=22){R(s,x,154,12,16,'#1a1018');if(rnd()<.4)R(s,x+1,155,10,14,'#6a4a30')}
  R(s,426,200,44,16,'#0a0a10');R(s,474,200,82,16,'#0a0a10');R(s,422,222,138,18,'#1a1420');
  R(s,489,110,4,130,'#15131e');R(s,422,178,138,3,'#15131e');
  // door
  R(s,584,200,46,100,'#1e1b2a');R(s,588,204,38,96,'#4a4460');R(s,594,212,26,36,'#8a9ab0');txt(s,'2B',599,234,'#3a3a4a',10);R(s,620,256,3,5,'#c0c0c8');
 },
 fg(f){
  R(f,30,256,136,20,'#5a3a64');R(f,30,274,136,16,'#6a4676');R(f,24,262,12,34,'#4e3258');R(f,160,262,12,34,'#4e3258');
  R(f,30,290,4,10,'#1a1420');R(f,162,290,4,10,'#1a1420');R(f,86,266,54,9,'#8fa0b8');R(f,96,268,14,2,'#6a7a90');R(f,40,262,20,12,'#c8b0d0');
  R(f,300,256,120,5,'#4b4a58');R(f,304,261,4,39,'#2a2a34');R(f,412,261,4,39,'#2a2a34');
  R(f,352,246,6,10,'#222');R(f,330,216,52,32,'#111');R(f,340,252,30,3,'#333');R(f,376,252,6,4,'#333');
  R(f,392,244,18,22,'#1d1d24');R(f,386,264,26,5,'#1d1d24');R(f,398,269,3,20,'#1d1d24');R(f,386,289,26,3,'#1d1d24');R(f,386,292,3,3,'#111');R(f,409,292,3,3,'#111');
  R(f,432,246,30,54,'#6a6e78');for(let y=250;y<298;y+=17){R(f,434,y,26,15,'#5e626c');R(f,442,y+6,10,2,'#9aa0aa')}
  R(f,478,262,20,38,'#d8dce4');R(f,478,262,20,3,'#b0b4bc');R(f,480,238,16,24,'#5aa0e6');R(f,482,240,4,18,'#8ac0f0');R(f,486,272,4,3,'#3050a0');
  R(f,536,282,20,18,'#8a4a2a');R(f,534,280,24,3,'#a05a36');R(f,544,262,2,20,'#4a6a3a');R(f,538,264,6,3,'#4a6a3a');R(f,547,268,7,3,'#5a7a44');R(f,536,272,5,3,'#3e5a32');
 },
 tick(t){if(this.fT>0)this.fT--;else if(Math.random()<.008)this.fT=8+Math.random()*14|0;this.fl=this.fT>0&&(this.fT%3)?.25:1;this.nf=(Math.floor(t/7)%23==0)?0:1},
 amb(){return'rgba(10,6,24,.72)'},
 dyn(c,t){
  R(c,262,36,116,3,this.fl>.5?'#eaf6fa':'#6a7480');
  c.save();c.shadowColor='#3fe0d0';c.shadowBlur=6;txt(c,'PAWN',431,212,'#6ff0e0',9);c.shadowColor='#ff4f9a';txt(c,'LIQUOR',480,212,this.nf?'#ff7ab4':'#4a2030',9);c.restore();
  const cx=(t*1.3)%260-60;if(cx>0&&cx<138)R(c,422+cx,236,6,2,'#ffe8b0');
 },
 dynFg(c,t){
  R(c,332,218,48,28,'#bfe8e6');for(let y=222;y<246;y+=4)R(c,332,y,48,1,'#8ac8c4');for(let x=344;x<380;x+=12)R(c,x,218,1,28,'#8ac8c4');
  R(c,345,230,11,3,'#ff4f9a');if(Math.floor(t/30)%2)R(c,358,238,1,3,'#1a3a3a');
 },
 lights(){return[
  {x:320,y:40,r:340,a:.55*this.fl,lamp:1},{x:356,y:232,r:130,a:.7,lamp:1},{rect:[422,110,138,130],a:.85,fg:0},{x:490,y:210,r:230,a:.45,fg:.8},{x:488,y:250,r:40,a:.3}
 ]},
 glows(c){
  glow(c,320,40,220,`rgba(140,180,190,${.10*this.fl})`);glow(c,356,232,90,'rgba(60,200,190,.18)');
  glow(c,515,212,190,`rgba(255,50,140,${.16*this.nf+.03})`);glow(c,450,210,150,'rgba(40,200,180,.10)');
  poly(c,[[422,240],[560,240],[520,360],[340,360]],'rgba(255,60,150,.05)');
 },
 things:[
  {x:98,name:'Sleep',msg:'The office couch. You have an apartment. You mostly sleep here.'},
  {x:140,name:'Bandit sign',msg:'"WE BUY HOUSES", pulled off a telephone pole. Now it\'s your mission statement.'},
  {x:236,name:'Whiteboard',msg:'Deal math: a duplex under contract, a triplex under review, and one number circled three times.'},
  {x:356,name:'Computer',msg:'A used desktop from an auction. Twelve tabs of listings and one rent roll that doesn\'t add up.'},
  {x:447,name:'Files',msg:'Leases, inspection reports and one very polite letter from city code enforcement.'},
  {x:488,name:'Water cooler',msg:'Glug. The only employee benefit.'},
  {x:520,name:'Window',msg:'PAWN and LIQUOR, open late. The landlord across the street owns the whole block. For now.'},
  {x:606,name:'Door',msg:'Suite 2B. Your name is on it in label-maker tape.'},
 ]
});

