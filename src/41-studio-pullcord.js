/* Studio pull chain: painted cord is occluded at render time, never erased from source art. */
const STUDIO_PULL={id:'hoodie_pullcord',ready:false,active:false,t:0,toggled:false};
{
 const im=new Image();
 im.onload=()=>{
  // Equal cells preserve pose spacing; transparent PNG needs no chroma key/despill.
  const cell=im.width/4,top=99,bottom=774,frames=[];
  for(let i=0;i<4;i++){
   const c=document.createElement('canvas');c.width=Math.ceil(cell);c.height=bottom-top;
   const x=c.getContext('2d');x.drawImage(im,i*cell,top,cell,bottom-top,0,0,cell,bottom-top);
   const p=x.getImageData(0,0,c.width,c.height).data;let sum=0,n=0;
   for(let y=c.height-45;y<c.height;y++)for(let xx=0;xx<c.width;xx++)if(p[(y*c.width+xx)*4+3]>150){sum+=xx;n++}
   frames.push({c,ax:n?sum/n:cell/2});
  }
  ANIMS[STUDIO_PULL.id]={frames,dur:[32,28,36,40],cache:{}};
  STUDIO_PULL.ready=true;
 };im.src='@@asset:image/png@assets/art/character/anim/hoodie_pullcord_v1.png@@';
}
function studioPullHand(i){
 const A=ANIMS[STUDIO_PULL.id],F=A.frames[i],scale=(st.charH||140)/675;
 const hands=[[382,120],[777,121],[1162,187]];
 return {x:pl.x+(hands[i][0]-i*443.5-F.ax)*scale,y:FLOOR-(st.charH||140)+(hands[i][1]-99)*scale};
}
function drawStudioChain(c){
 const q=STUDIO_PULL;let end={x:168,y:165};
 if(q.active){
  if(q.t>=32&&q.t<60)end=studioPullHand(1);
  else if(q.t>=60&&q.t<96)end=studioPullHand(2);
  else if(q.t>=96){const p=Math.min(1,(q.t-96)/40),h=studioPullHand(2);end={x:168+(h.x-168)*(1-p)+Math.sin(p*Math.PI*3)*2*(1-p),y:165+(h.y-165)*(1-p)}}
 }
 c.save();c.lineWidth=1;c.strokeStyle='#281c10';c.beginPath();c.moveTo(167,66);c.lineTo(end.x,end.y);c.stroke();
 const len=Math.hypot(end.x-167,end.y-66);
 for(let d=2;d<len;d+=3){const p=d/len;R(c,Math.round(167+(end.x-167)*p),Math.round(66+(end.y-66)*p),1,1,'#ad8850')}
 R(c,Math.round(end.x)-1,Math.round(end.y)-2,3,5,'#302115');R(c,Math.round(end.x),Math.round(end.y)-1,1,3,'#c29958');c.restore();
}
function startStudioPull(){
 if(mode!='free')return;
 if(!STUDIO_PULL.ready||!STU.ready){say('The light animation is still loading.');return}
 const q=STUDIO_PULL;q.active=false;q.t=0;q.toggled=false;
 playAnim(q.id,140,1,()=>{q.active=false;pl.vx=0});
 const step=seq.steps[2],baseStart=step.start,baseFrame=step.f;
 step.start=()=>{baseStart();q.active=true};
 step.f=(p,dt)=>{baseFrame(p,dt);q.t=pl.anim.t;if(q.t>=60&&!q.toggled){q.toggled=true;bulbOn=!bulbOn;say(bulbOn?'Click. One bare 60 watt. Very atmospheric.':'Click. Saving on the electric bill.')}};
}
// Install after the asynchronous studio artwork has replaced the procedural stage renderer.
const studioPullInstall=setInterval(()=>{
 if(!STU.ready||!STAGES[0].art)return;
 clearInterval(studioPullInstall);
 const S=STAGES[0],dyn=S.dyn;
 S.dyn=function(c,t){
  dyn.call(this,c,t);
  // Cover only the baked pull chain (not bulb/power cable). Nearby wallpaper retains
  // the original lighting; match the same day/night blend used by the room renderer.
  const dp=Math.max(0,dayCurve(gameMin/60)-dayCurve(this.sig));
  c.drawImage(STU.night,170,68,5,38,165,68,5,38);
  if(dp>0){c.save();c.globalAlpha=dp;c.drawImage(STU.day,170,68,5,38,165,68,5,38);c.restore()}
  drawStudioChain(c);
 };
 const thing=S.things.find(t=>t.name==='Pull chain');if(thing)thing.act=startStudioPull;
},40);