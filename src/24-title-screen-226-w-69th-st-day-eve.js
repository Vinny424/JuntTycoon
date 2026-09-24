/* ───────────── Title screen: 226 W 69th St, day ⇄ evening ───────────── */
{
 const sp=document.createElement('div');sp.className='splash';sp.id='splash';
 sp.innerHTML=`<img class="sp-day" alt="" src="${'@@asset:image/webp@assets/art/splash/splash_226_day_v1.webp@@'}"><img class="sp-eve" alt="" src="${'@@asset:image/webp@assets/art/splash/splash_226_evening_v1.webp@@'}">
  <div class="sp-shade"></div>
  <div class="sp-center"><h1 class="sp-title"><span>Junt</span> <span>Tycoon</span></h1>
   <p class="sp-sub">From your first rental to Billionaires' Row</p>
   <button id="spStart" class="sp-start">Start</button><p class="sp-hint">press Enter</p></div>`;
 scr.parentElement.appendChild(sp);
 rollEl.hidden=true;mode='title';
 // day or evening from the system clock; fall back to in-game time if the clock can't be read
 {let h;try{h=new Date().getHours();if(!Number.isFinite(h))throw 0}catch(e){h=Math.floor(gameMin/60)}
  const eve=h<7||h>=17;sp.querySelector('.sp-eve').style.opacity=eve?1:0;if(h>=21||h<5)sp.classList.add('night')}
 const start=()=>{if(mode!='title')return;sp.classList.add('out');setTimeout(()=>sp.remove(),600);mode='roll';rollEl.hidden=false;newLife()};
 $('spStart').onclick=start;
 addEventListener('keydown',e=>{if(mode=='title'&&(e.key=='Enter'||e.key==' ')){e.preventDefault();(window.spEnter||start)()}});
 setTimeout(()=>$('spStart')?.focus(),50);
}
