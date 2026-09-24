/* ───────────── 4 · THE ESTATE · dusk · concrete + gold ───────────── */
STAGES.push({
 key:'Estate',name:'The Estate · Dusk',cash:'$4.8M liquid',units:'1,200 units',
 intro:'Board-formed concrete, gold inlay and a linear fireplace. The hypercar in the driveway gets more visitors than you do.',
 outfit:{top:'#18181c',shade:'#0e0e12',arm:'#141418',p1:'#2e2e34',p2:'#34343a',shoe:'#1a1410',hair:'#2B1E16',acc:'#e0b448',style:'turtle'},
 bg(s){
  R(s,0,0,W,H,'#111');R(s,0,0,W,36,'#5c5955');R(s,0,34,W,2,'#d4a93a');
  for(let y=36;y<300;y+=12){const v=128+rnd()*14|0;R(s,0,y,W,12,`rgb(${v},${v-3},${v-8})`);R(s,0,y,W,1,'#76726c');for(let k=0;k<30;k++)R(s,rnd()*W,y+1+rnd()*10,1,1,'rgba(60,56,50,.35)')}
  for(let x=30;x<W;x+=60)for(let y=60;y<290;y+=48)R(s,x,y,2,2,'#56524e');
  R(s,0,250,356,2,'#d4a93a');R(s,0,292,W,8,'#2a2826');
  R(s,0,300,W,60,'#141418');
  for(let v=0;v<14;v++){let x=rnd()*W,y=300+rnd()*60;const col=v%3?'#2a2a32':'#8a6a2a';for(let k=0;k<40;k++){R(s,x,y,1,1,col);x+=rnd()*3;y+=rnd()*2-1;if(y<300||y>359)break}}
  // art
  R(s,222,70,108,86,'#e8e2d6');ell(s,262,112,24,24,'#141414');R(s,286,86,2,58,'#d4a93a');R(s,238,140,70,2,'#d4a93a');
  // fireplace
  R(s,36,184,168,4,'#d4a93a');R(s,36,222,168,2,'#d4a93a');R(s,40,188,160,34,'#08080a');R(s,44,214,152,8,'#26262c');
  // pendants
  for(const px of[110,300]){R(s,px,36,1,86,'#222');poly(s,[[px-10,130],[px+11,130],[px+6,120],[px-5,120]],'#c9a038');R(s,px-10,129,21,2,'#8a6a20')}
  // floor-to-ceiling glass: dusk driveway
  R(s,356,36,272,264,'#c9a038');
  bands(s,360,40,264,180,['#1e1a3e','#3e2a5a','#7a3a5a','#c85a4a','#f0905a'],18);
  poly(s,[[360,216],[400,200],[450,210],[510,196],[570,206],[624,198],[624,236],[360,236]],'#2a2036');
  for(let i=0;i<30;i++)R(s,360+rnd()*264,204+rnd()*14,1,1,'#ffd08a');
  R(s,360,236,264,10,'#1e2a1e');for(let x=362;x<624;x+=5)R(s,x,234+(rnd()*3|0),2,4,'#16221a');
  R(s,360,246,264,54,'#2e2a2c');for(let y=250;y<300;y+=8)R(s,360,y,264,1,'#3a3536');for(let y=246;y<300;y+=8)for(let x=360+((y/8)%2)*10;x<624;x+=20)R(s,x,y,1,8,'#3a3536');
  // palm
  let px=598,py=246;for(let i=0;i<46;i++){R(s,px,py-i,4,1,'#241c1a');if(i%12==0)px+=1}
  for(const [dx,dy] of [[-18,6],[-12,-4],[16,4],[12,-6],[0,-10],[-22,12],[20,12]]){for(let k=0;k<14;k++)R(s,599+dx*k/14,200+dy*k/14+(k*k)/28,2,1,'#1a1a22')}
  // hypercar: two-tone, facing left
  poly(s,[[420,289],[423,279],[436,272],[462,264],[496,261],[520,265],[538,272],[546,281],[546,290],[420,290]],'#1f3f9a');
  s.save();s.beginPath();s.rect(0,0,474,H);s.clip();poly(s,[[420,289],[423,279],[436,272],[462,264],[496,261],[520,265],[538,272],[546,281],[546,290],[420,290]],'#0c0e14');s.restore();
  poly(s,[[456,268],[472,263],[498,262],[506,269],[462,270]],'#101820');R(s,470,263,2,7,'#1f3f9a');
  s.strokeStyle='#c8ccd4';s.lineWidth=1.5;s.beginPath();s.arc(492,278,12,Math.PI*.55,Math.PI*1.5);s.stroke();
  R(s,420,280,3,8,'#c8ccd4');R(s,424,288,122,2,'#0a0a0e');
  for(const wx of[441,526]){ell(s,wx,290,9,9,'#0a0a0c');ell(s,wx,290,6,6,'#8a90a0');ell(s,wx,290,2,2,'#1a1a20')}
  for(const lx of[378,470,592])poly(s,[[lx-1,246],[lx+1,246],[lx+8,210],[lx-8,210]],'rgba(255,208,138,.18)');
  for(const mx of[426,492,558])R(s,mx,40,2,260,'#0e0e10');
  reflect(s,360,300,264,60,.2);
 },
 fg(f){
  R(f,30,264,180,18,'#cfc7b6');R(f,30,280,180,16,'#d9d2c3');R(f,30,294,180,2,'#b8b0a0');for(let x=90;x<200;x+=60)R(f,x,264,1,30,'#bab2a2');
  R(f,40,262,18,16,'#1a1a1e');R(f,182,264,18,14,'#c9a038');R(f,34,296,6,4,'#111');R(f,200,296,6,4,'#111');
  R(f,222,252,26,48,'#e8e4dc');R(f,222,252,26,2,'#fff');
  poly(f,[[228,252],[232,232],[240,218],[246,226],[238,236],[244,252]],'#e0b448');poly(f,[[232,232],[236,224],[242,238]],'#8a6a20');
  R(f,262,254,88,6,'#8a8680');R(f,330,260,16,40,'#7a7670');R(f,280,226,46,26,'#0a0a0c');R(f,302,252,2,2,'#c9a038');
 },
 tick(t){this.ff=.85+Math.sin(t*.21)*.08+Math.sin(t*.53)*.07},
 amb(){return'rgba(14,10,22,.6)'},fgAmb(){return'rgba(14,10,22,.66)'},
 dyn(c,t){
  for(let x=46;x<196;x+=3){const h=5+Math.abs(Math.sin(x*.37+t*.18)+Math.sin(x*.11-t*.11))*6;R(c,x,214-h,3,h,'#ff7a22');R(c,x,214-h*.55,3,h*.55,'#ffc450');R(c,x+1,214-h*.2,1,h*.2,'#fff0b0')}
  for(const px of[110,300])R(c,px-4,130,9,3,'#fff0c0');
  R(c,421,277,3,2,'#e8f4ff');R(c,541,275,5,2,Math.floor(t/50)%2?'#ff3030':'#aa1010');
 },
 dynFg(c,t){R(c,282,228,42,22,'#0e0e12');let y=244;for(let x=284;x<322;x+=2){y-=Math.random()<.6?1:0;R(c,x,Math.max(230,y),2,1,'#e0b448')}},
 lights(){return[
  {rect:[360,40,264,260],a:.8,fg:0},{x:490,y:200,r:380,a:.45,fg:.6},{x:120,y:206,r:260,a:.8*this.ff,lamp:1},{x:110,y:130,r:180,a:.5,lamp:1},{x:300,y:130,r:180,a:.5,lamp:1},{x:303,y:240,r:70,a:.3,lamp:1}
 ]},
 glows(c){
  glow(c,120,206,160,`rgba(255,120,40,${.2*this.ff})`);glow(c,110,132,90,'rgba(255,190,90,.14)');glow(c,300,132,90,'rgba(255,190,90,.14)');
  glow(c,490,200,300,'rgba(120,70,140,.10)');poly(c,[[40,300],[200,300],[230,360],[20,360]],`rgba(255,130,50,${.06*this.ff})`);
 },
 things:[
  {x:120,name:'Sleep',msg:'The primary suite is down the hall. Sleep here would move time forward (phase 2).'},
  {x:170,name:'Fireplace',msg:'A linear gas fireplace, remote controlled. You remember heating a studio with the oven door open.'},
  {x:235,name:'Sculpture',msg:'Commissioned. The artist says it\'s about "yield". You nodded like you understood.'},
  {x:276,name:'Painting',msg:'A black circle and two gold lines. It appraised higher than your first fourplex.'},
  {x:304,name:'Family office',msg:'1,200 units across four states. Your CFO sends summaries you actually read.'},
  {x:480,name:'Hypercar',msg:'The hypercar in the driveway cost more than your first three buildings combined. It has 400 miles on it.'},
  {x:590,name:'Glass wall',msg:'Dusk over the hills. You can see three of your properties from here, if you squint.'},
 ]
});

