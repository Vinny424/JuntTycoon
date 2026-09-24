/* Studio fridge close-up. Food is layered separately; this phase is empty. */
const fridgeStyle=document.createElement('style');
fridgeStyle.textContent=`
#studioFridge{position:fixed;inset:0;z-index:100;display:grid;place-items:center;padding:16px;background:#080604d9;box-sizing:border-box}
#studioFridge[hidden]{display:none!important}
.fridge-view{width:min(1100px,96vw,calc((100dvh - 110px)*1.7778));background:#21180f;border:2px solid #90704a;box-shadow:0 12px 60px #000a;color:#f5e4c8;animation:fridgeEnter .28s ease-out}
.fridge-top,.fridge-bottom{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:10px 14px;font:20px VT323,monospace}
.fridge-top h2{margin:0;font:24px VT323,monospace}.fridge-top button{font:20px VT323,monospace;padding:6px 12px;color:#f5e4c8;background:#493624;border:1px solid #ae875a;cursor:pointer}
.fridge-scene{position:relative;aspect-ratio:16/9}.fridge-scene img{display:block;width:100%;height:100%;object-fit:contain;image-rendering:pixelated}.fridge-bottom{justify-content:center;color:#d1b992}
@keyframes fridgeEnter{from{opacity:0;transform:scale(.98)}to{opacity:1;transform:scale(1)}}
@media(prefers-reduced-motion:reduce){.fridge-view{animation:none}}`;
document.head.appendChild(fridgeStyle);
const fridgeEl=document.createElement('div');fridgeEl.id='studioFridge';fridgeEl.hidden=true;
fridgeEl.innerHTML=`<section class="fridge-view" role="dialog" aria-modal="true" aria-labelledby="fridgeTitle"><header class="fridge-top"><h2 id="fridgeTitle">Your fridge</h2><button type="button" id="closeStudioFridge">Close · Esc</button></header><div class="fridge-scene"><img src="@@asset:image/png@assets/art/studio/fridge/studio_fridge_empty_v1.png@@" alt="An empty, worn mini fridge with two wire shelves and door bins."><div id="fridgeItems"></div></div><footer class="fridge-bottom">Nothing to eat. Just the hum of the fridge.</footer></section>`;
document.body.appendChild(fridgeEl);
let fridgeReturnFocus=null;
function closeStudioFridge(){
 if(fridgeEl.hidden)return;fridgeEl.hidden=true;mode='free';pl.vx=0;
 for(const k of Object.keys(keys))keys[k]=false;
 if(fridgeReturnFocus?.isConnected)fridgeReturnFocus.focus();say('You close the fridge.');
}
function openStudioFridge(){
 if(mode!='free'||st!==STAGES[0])return;
 fridgeReturnFocus=document.activeElement;mode='seq';pl.vx=0;const target=190;
 seq={i:0,steps:[{until:()=>pl.x===target,f:(p,dt)=>{const delta=target-pl.x,step=1.785*dt;pl.face=delta<0?-1:1;pl.vx=Math.sign(delta)*1.785;pl.x+=Math.sign(delta)*Math.min(Math.abs(delta),step);pl.walk+=Math.min(Math.abs(delta),step)*.12}},
 {d:22,start:()=>{pl.vx=0;pl.face=1}}],done:()=>{mode='fridge';pl.vx=0;for(const k of Object.keys(keys))keys[k]=false;fridgeEl.hidden=false;document.getElementById('closeStudioFridge').focus()}};
}
document.getElementById('closeStudioFridge').onclick=closeStudioFridge;
addEventListener('keydown',e=>{
 if(fridgeEl.hidden)return;
 if(e.key==='Escape'){e.preventDefault();e.stopImmediatePropagation();closeStudioFridge();return}
 // Modal owns keyboard input; prevent movement and other game shortcuts leaking through.
 if(e.key==='Tab'){e.preventDefault();document.getElementById('closeStudioFridge').focus()}
 e.stopImmediatePropagation();
},true);
const studioFridgeThing=STAGES[0].things.find(t=>t.name==='Fridge');
if(studioFridgeThing)studioFridgeThing.act=openStudioFridge;