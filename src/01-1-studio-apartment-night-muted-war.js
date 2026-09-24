/* ───────────── 1 · STUDIO APARTMENT · night · muted warm film ───────────── */
const SLATS=[];for(let y=132;y<228;y+=7)SLATS.push(y);
STAGES.push({
 key:'Studio',name:'Studio Apartment · Night',cash:'$312',units:'0 units',
 intro:"Your place. It isn't much. Walk with A/D or the arrow keys, and press E to interact.",
 outfit:{top:'#6E7F5F',shade:'#3E4A3A',arm:'#5e6e50',p1:'#2f3a33',p2:'#35433a',shoe:'#1b1410',hair:'#2B1E16',acc:'#E8C98A',style:'hoodie'},
 bg(s){
  R(s,0,0,W,H,'#1a120d');R(s,0,0,W,36,'#2B1E16');R(s,0,36,W,FLOOR-36,'#4A3426');
  for(let x=0;x<W;x+=16)R(s,x,36,6,FLOOR-36,'#553c2b');
  for(let i=0;i<9;i++)R(s,rnd()*W,40+rnd()*200,10+rnd()*30,6+rnd()*24,'rgba(30,20,12,.35)');
  R(s,0,36,W,3,'#3a291d');R(s,0,FLOOR-8,W,8,'#2B1E16');R(s,0,FLOOR,W,H-FLOOR,'#3a291d');
  for(let y=FLOOR+8;y<H;y+=10)R(s,0,y,W,1,'#2B1E16');
  for(let y=FLOOR;y<H;y+=10)for(let x=(y/10%2)*40;x<W;x+=80)R(s,x,y,1,10,'#2B1E16');
  R(s,264,174,24,32,'#E8C98A');R(s,264,174,24,7,'#9e3b2b');
  for(let r=0;r<4;r++)for(let q=0;q<4;q++)R(s,266+q*5,184+r*5,3,3,r==0&&q==0?'#9e3b2b':'#C89B5E');
  R(s,410,160,54,46,'#7A5A3A');R(s,413,163,48,40,'#C89B5E');R(s,418,168,14,10,'#E8C98A');R(s,440,172,14,18,'#e9e4d6');R(s,420,184,12,8,'#bcd0de');R(s,424,168,2,2,'#b33');R(s,446,172,2,2,'#b33');
  R(s,466,126,98,108,'#7A5A3A');R(s,470,130,90,100,'#141a26');
  R(s,480,196,14,34,'#1d2230');R(s,500,184,20,46,'#1a1f2c');R(s,528,200,26,30,'#1d2230');
  R(s,584,206,48,94,'#2B1E16');R(s,588,210,40,90,'#5a4030');R(s,592,216,32,34,'#4d3627');R(s,592,256,32,36,'#4d3627');R(s,620,258,3,4,'#C89B5E');
  R(s,199,36,1,78,'#111');R(s,196,114,7,6,'#333');
 },
 fg(f){
  R(f,30,286,140,14,'#b9a57c');R(f,30,298,140,2,'#7A5A3A');R(f,34,278,30,10,'#E8C98A');R(f,34,286,30,1,'#C89B5E');
  R(f,76,280,94,10,'#6E7F5F');R(f,84,282,20,2,'#3E4A3A');R(f,120,284,26,2,'#3E4A3A');R(f,160,280,10,16,'#3E4A3A');
  R(f,220,248,36,52,'#a89a80');R(f,220,248,36,2,'#E8C98A');R(f,222,270,32,1,'#6f6553');R(f,250,256,2,10,'#6f6553');R(f,250,276,2,14,'#6f6553');
  R(f,226,240,24,8,'#5a6a74');R(f,229,242,12,4,'#2a3238');
  R(f,280,258,124,5,'#7A5A3A');R(f,280,263,124,2,'#3a291d');R(f,284,263,4,37,'#3a291d');R(f,396,263,4,37,'#3a291d');
  R(f,362,278,26,22,'#3a5a6a');for(let y=281;y<298;y+=5)R(f,364,y,22,2,'#24404e');
  R(f,294,248,20,10,'#8a8a8a');R(f,296,244,16,4,'#8a8a8a');R(f,340,254,6,4,'#E8C98A');
  R(f,318,232,34,22,'#0f1418');R(f,314,254,42,4,'#6d6d6d');
 },
 tick(t){this.lf=.9+Math.sin(t*.3)*.03+(Math.random()<.03?-.08:0);this.bf=bulbOn?(Math.random()<.02?.6:1):0},
 amb(){return`rgba(8,6,16,${bulbOn?.5:.86})`},
 dyn(c,t){
  const fl=Math.sin(t*.05)>0;
  [[484,202],[508,190],[512,206],[532,206],[544,214]].forEach(([a,b],i)=>R(c,a,b,2,2,(i==2&&fl)?'#2a2a2a':'#C89B5E'));
  SLATS.forEach((y,i)=>{const b=i==5?2:0;R(c,470,y+b,90,3,'#b8a684');R(c,470+b*6,y+b+2,90-b*6,1,'#7d6c50')});
  R(c,197,120,5,7,bulbOn?'#fff3c4':'#6b6250');
 },
 dynFg(c,t){R(c,320,234,30,18,'#9FB4C7');for(let i=0;i<4;i++)R(c,322,236+i*4,8+((i*7+Math.floor(t/40))%16),1,'#5f7688')},
 lights(){
  const L=[{x:335,y:245,r:150,a:.75*this.lf,lamp:1},{x:515,y:180,r:120,a:.6,fg:.3}];
  if(bulbOn)L.push({x:200,y:125,r:360*this.bf,a:.85*this.bf,lamp:1});
  for(let i=0;i<SLATS.length-1;i++){const y=SLATS[i]+3,g=4;L.push({a:.55,poly:[[470,y],[560,y],[410,y+110],[320,y+110],[320,y+110+g],[410,y+110+g],[560,y+g],[470,y+g]]})}
  return L;
 },
 glows(c){
  glow(c,335,243,90,`rgba(70,110,160,${.22*this.lf})`);glow(c,470,260,150,'rgba(150,80,20,.10)');
  if(bulbOn)glow(c,200,124,200*this.bf,`rgba(150,110,50,${.22*this.bf})`);
  poly(c,[[470,132],[560,132],[410,300],[320,300]],'rgba(160,90,25,.05)');
 },
 things:[
  {x:100,name:'Sleep',msg:'A mattress on the floor. Sleeping will move time forward. That arrives in phase 2.'},
  {x:200,name:'Pull chain',act:()=>{bulbOn=!bulbOn;say(bulbOn?'Click. One bare 60 watt. Very atmospheric.':'Click. Saving on the electric bill.')}},
  {x:238,name:'Fridge',msg:'Half a jar of mustard, two eggs and some ambition.'},
  {x:276,name:'Calendar',msg:'Rent: $650 due on the 1st. The landlord has already texted twice.'},
  {x:332,name:'Laptop',msg:'Old laptop, 11% battery. Listings, email and the bank will live here.'},
  {x:436,name:'Corkboard',msg:'Deals: none yet. One business card pinned up: "MIKE: HANDYMAN, CHEAP".'},
  {x:515,name:'Window',msg:'Sodium streetlights. A car alarm two blocks over. Somebody owns all of this.'},
  {x:606,name:'Door',msg:'The neighborhood is out there. Property walkthroughs come later.'},
 ]
});

