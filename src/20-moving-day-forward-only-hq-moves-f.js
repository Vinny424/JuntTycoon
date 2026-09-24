/* ───────────── Moving day (forward-only HQ moves) + FHA removed for the 2D game ───────────── */
delete FIN.fha;
const DOORX=[606,606,617,412,600];
let fadeA=0,moveCard=null;
function drawFade(c_,dt){const c=ui;
 if(fadeA>0)R(c,0,0,W,H,`rgba(6,4,3,${Math.min(1,fadeA)})`);
 if(!moveCard)return;const p=moveCard.p,tx=Math.round(-140+p*(W+280)),ty=236,bob=Math.floor(p*60)%2;
 R(c,0,0,W,H,'#0c0907');R(c,0,262,W,2,'#2a2016');for(let x=(-Math.floor(p*900))%40;x<W;x+=40)R(c,x,272,20,2,'#3a2c1e');
 R(c,tx,ty-44+bob,96,44,'#d8cbb0');R(c,tx,ty-44+bob,96,3,'#efe6cc');R(c,tx+10,ty-34+bob,76,18,'#c9a24a');c.textAlign='center';txt(c,'JUNT MOVERS',tx+48,ty-22+bob,'#2a1e16',8);
 R(c,tx+96,ty-30+bob,30,30,'#9e3b2b');R(c,tx+104,ty-26+bob,16,10,'#9fb4c7');R(c,tx+124,ty-8+bob,4,4,'#ffe8a0');
 for(const wx of[tx+18,tx+78,tx+112]){R(c,wx-7,ty-7,14,14,'#141414');R(c,wx-3,ty-3,6,6,'#8a8a8a')}
 for(let k=0;k<3;k++){R(c,tx+14+k*22,ty-58+bob,18,14,'#b08a5a');R(c,tx+14+k*22,ty-52+bob,18,1,'#8a6a40')}R(c,tx+8,ty-45+bob,80,1,'#5a4a30');
 txt(c,'MOVING DAY',W/2,110,'#f0d69c',16);txt(c,moveCard.name,W/2,132,'#c9a24a',8);c.textAlign='left';
}
function moveHQ(i){
 const H=HQ[i],tx=DOORX[si];closeDevice();mode='seq';say(`Packing up. Next stop: ${H.name}.`);
 seq={i:0,steps:[
  {until:()=>pl.x===tx,f:(p,dt)=>{const d=Math.sign(tx-pl.x);if(d)pl.face=d;pl.vx=d*1.7;pl.x+=pl.vx*dt;if(Math.abs(pl.x-tx)<1.8)pl.x=tx;pl.walk+=1.7*dt*.12}},
  {d:60,start:()=>{pl.vx=0},f:p=>fadeA=p},
  {d:250,start:()=>{moveCard={p:0,name:H.name}},f:p=>{moveCard.p=p}},
  {d:1,start:()=>{mode='free';setStage(i);mode='seq';day++;newDay(day);econ.hq=i;econ.office=H.cost;econ.rep=Math.min(100,econ.rep+5);moveCard=null;pl.x=DOORX[i];pl.face=-1}},
  {d:65,f:p=>fadeA=1-p},
  {d:40,start:()=>{pl.vx=-1.7},f:(p,dt)=>{pl.x-=1.7*dt;pl.walk+=1.7*dt*.12}},
 ],done:()=>{pl.vx=0;fadeA=0;mode='free';say(`Welcome to ${H.name}.${H.cost?` Lease: ${money(H.cost)} a month, billed on the 1st.`:''} There's no going back now.`)}};
}
const _actM=act;
act=function(a,id){
 if(a=='ghq'){const i=+id,H=HQ[i];if(i<=econ.hq){devMsg="You don't move backwards.";return}if(!H.need()){devMsg=`Unlocks at ${H.why}.`;return}moveHQ(i);return}
 _actM(a,id)};
