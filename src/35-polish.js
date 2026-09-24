/*@@ module polish.js begin @@*/
/* ───────────── Playability polish: fit to the window, a "Next step" hint line, small text fixes ───────────── */

// 1 · fit the whole game (HUD + screen + text box + buttons) into the window so itch.io's iframe never scrolls
const fitWrap=document.querySelector('.wrap'),fitCanvas=$('screen');
function fitGame(){
 const cs=getComputedStyle(document.body),pad=parseFloat(cs.paddingTop)+parseFloat(cs.paddingBottom);
 for(let k=0;k<4;k++){   // the HUD can wrap at narrower widths, so re-measure a few times until it settles
  const over=fitWrap.offsetHeight-fitCanvas.offsetHeight,avail=innerHeight-over-pad-2,w=Math.round(Math.max(520,Math.min(1280,avail*16/9)));
  if(fitWrap.style.maxWidth==w+'px')break;fitWrap.style.maxWidth=w+'px';
 }
}
{
 // menus float over the bottom of the scene instead of pushing the layout around
 const sw=document.querySelector('.screenwrap');sw.appendChild(menuEl);
 Object.assign(menuEl.style,{position:'absolute',left:'10px',right:'10px',bottom:'10px',zIndex:7,justifyContent:'center',background:'rgba(10,7,5,.85)',border:'2px solid #3a291d',padding:'8px'});
 const s=document.createElement('style');s.textContent='#msg{min-height:2.4em;max-height:4.7em;overflow:auto}';document.head.appendChild(s);
 let raf=0;new MutationObserver(()=>{cancelAnimationFrame(raf);raf=requestAnimationFrame(fitGame)}).observe(msgEl,{childList:true,characterData:true,subtree:true});
 addEventListener('resize',fitGame);fitGame();
 document.fonts&&document.fonts.ready.then(fitGame);
 setTimeout(fitGame,400);
}

// 2 · the opening message no longer says "With -$16,543 to your name"
{
 const _beginP=beginB.onclick;
 beginB.onclick=function(){_beginP();
  if(life&&life.cash-life.student<0)msgEl.textContent=msgEl.textContent.replace(/With -\$[\d,]+ to your name/,`With ${money(life.cash)} in the bank and ${money(life.student)} in student loans`)};
}

// 3 · "Next step" line under the HUD: tells a new player what to do without a tutorial screen
const goalEl=document.createElement('div');
goalEl.id='goal';goalEl.style.cssText='font-family:Silkscreen,monospace;font-size:10px;letter-spacing:.02em;color:var(--dim);min-height:14px;line-height:14px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis';
document.querySelector('.hud').after(goalEl);
function nextGoal(){
 if(!econ.ready||!econ.props)return'';
 if(typeof rockBottom=='function'&&rockBottom())return'Money trouble. Open the Bank app and choose Get help: family, bankruptcy or a fresh start.';
 const unpaid=econ.bills&&econ.bills.length;
 if(unpaid)return`Pay your ${unpaid} bill${unpaid>1?'s':''} in the Bank app (computer or phone) before they go late.`;
 if(!econ.salary)return'No income. Apply for work in Career, or pick up a gig.';
 if(!canMath())return'Take "Real estate investing fundamentals" in Career > Learn to unlock the deal numbers.';
 const owned=econ.props.length,under=listings.find(L=>L.deal);
 if(under)return`Under contract on ${under.addr}. Closing on day ${under.deal.closeDay}. Keep the cash in checking.`;
 const idleUnit=econ.props.find(P=>!P.rehab&&!P.issues.length&&P.units_.some(u=>!u.you&&!u.occ&&!u.listing&&!u.pending));
 if(idleUnit)return`${idleUnit.addr} has a vacant unit. List it in Portfolio to start collecting rent.`;
 const broken=econ.props.find(P=>P.issues.length&&!P.rehab);
 if(broken)return`${broken.addr} needs repairs before tenants can move in. Hire a contractor in Portfolio.`;
 const nextHQ=HQ[(econ.hq||0)+1];
 if(nextHQ&&nextHQ.need())return`You qualify for ${nextHQ.name}. Move in from Business > Headquarters.`;
 const refi=econ.props.find(P=>day-P.bought>=(typeof seasoning=='function'?seasoning():90)&&P.units_.some(u=>u.t)&&(q=>q.dscr>=1&&q.cashOut>10000)(refiQuote(P)));
 if(refi)return`${refi.addr} can be refinanced. Pull out equity in Portfolio and buy your next deal with it.`;
 if(!owned){
  const need=x=>x.L.sf?Math.min(x.a.inv.cash,x.L.price*.13+knownRehab(x.L)):x.a.inv.cash;
  const good=listings.map(L=>({L,a:analyze(L)})).filter(x=>x.a.inv.cf>0).sort((a,b)=>need(a)-need(b))[0];
  if(!good)return'No cash-flowing listings right now. Check Listings often, or drive the neighborhood from the door.';
  if(econ.cash<need(good))return`Save up: the cheapest cash-flowing deal needs about ${money(need(good))} to close${good.L.sf?' (owner financing)':''}. You have ${money(econ.cash)}. Gigs and driving the neighborhood both pay.`;
  return`You can afford a deal. Open Listings, book a showing, walk the house, then make an offer.`;
 }
 if(nextHQ)return`Next headquarters unlocks at ${nextHQ.why}. You are at ${unitsOwned()} units and ${money(netWorth())} net worth.`;
 return`Legacy goal: ${money(Math.max(0,netWorth()))} of $100,000,000 and ${unitsOwned()} of 1,000 units.`;
}
{let last='';const upd=()=>{let g='';try{g=(mode=='free'||mode=='menu'||mode=='device')?nextGoal():''}catch(e){g=''}
 const t=g?'NEXT ▸ '+g:'';if(t!==last){last=t;goalEl.textContent=t}};
 setInterval(upd,1000);upd()}
/*@@ module polish.js end @@*/
