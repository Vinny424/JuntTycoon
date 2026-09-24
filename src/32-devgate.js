/*@@ module devgate.js begin @@*/
/* ───────────── Dev tools are hidden for players. Open with ?dev in the URL, or press ` (backtick) ───────────── */
let DEV=/[?&]dev\b/.test(location.search)||lsGet('jt.dev')=='1';
const keysHint=document.querySelector('.keys');
function applyDev(){
 dev.style.display=DEV?'':'none';
 keysHint.textContent=DEV?'A / D or ← → to walk · E to interact · E at the bed to sleep · P phone · 1–5 stage · F shaders · M market mood · ` hides dev tools'
  :'A / D or ← → to walk · E to interact · E at the bed to sleep · P phone · F shaders on/off';
}
applyDev();
addEventListener('keydown',e=>{
 if(e.key==='`'){DEV=!DEV;lsSet('jt.dev',DEV?'1':'0');applyDev();e.preventDefault();return}
 if(!DEV&&(/^[1-5]$/.test(e.key)||e.key.toLowerCase()==='m'))e.stopImmediatePropagation();
},true);
/*@@ module devgate.js end @@*/
