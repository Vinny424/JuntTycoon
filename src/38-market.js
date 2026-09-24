/*@@ module market.js begin @@*/
/* ───────────── Market: sane prices per zone, starter deals, and a Zillow-style Listings screen ─────────────
   1. City price levels now track city rents, so a coastal metro is not 4x the price for 2.6x the rent.
   2. (first zone: Shreveport-style, see below) Each headquarters "zone" caps what the market shows you (in Millbrook dollars: 200K, 320K, 600K, 1.2M, no cap), times the city price level.
      About 3% of listings are "trophy" homes above the cap: visible, out of reach.
   3. The first zone always has starter deals (cheap rough houses, one with an owner who may carry the loan).
   4. Listings screen: photo cards, badges, filters, sorting. Click a card for the numbers and the offer panel. */

CITYX['Palo Verde'].r=1.5;CITYX['Harbor City'].r=2.2;
for(const[k,v]of Object.entries({Millbrook:1,'Palo Verde':1.5,'Harbor City':2.2}))CITYX[k].base=v;CITYX['Palo Verde'].p=1.5;CITYX['Harbor City'].p=2.2;
// Zone 1 (your first home) is a Shreveport-style market: mostly class D and C houses, largely under $50K, with a few up to about $150K.
// The city price level is squeezed toward 1 here so a coastal start is not priced out; it opens up as you climb.
const Z0F=.65;
const ZONE_CAP=[170000,320000,600000,1200000,Infinity];
const cityP=()=>{const c=CITYX[econ.city]||CITYX.Millbrook;return(econ.hq||0)==0?(1+(c.base-1)*.4)*Z0F:c.base};
const zoneCap=()=>ZONE_CAP[Math.min(4,econ.hq||0)]*((econ.hq||0)==0?cityP()/Z0F:cityP());
{const _g=genListing;genListing=function(){
 if(!econ.ready)return _g();
 const c=CITYX[econ.city]||CITYX.Millbrook,cap=zoneCap(),z0=(econ.hq||0)==0;let best=null;
 const make=()=>{c.p=cityP();try{return _g()}finally{c.p=c.base}};
 for(let i=0;i<30;i++){const L=make();
  if(z0&&(L.grade=='B'||(L.grade=='C'&&Math.random()<.4)||((L.type=='triplex'||L.type=='quad')&&Math.random()<.7)||(L.type=='duplex'&&Math.random()<.3)))continue;   // mostly D, some C, no B in the first zone
  if(L.price<=cap){best=L;break}if(!best||L.price<best.price)best=L}
 if(!best)best=make();
 if(best.price>cap){best.trophy=true;best.desc+=' Trophy listing. Way out of your league for now.'}
 else if(Math.random()<.03&&(econ.hq||0)<4){
  for(let i=0;i<10;i++){const L=make();if(L.price>cap&&L.price<cap*1.8){L.trophy=true;L.desc+=' Trophy listing. Way out of your league for now.';best=L;break}}
 }
 return best}}

// starter deals: cheap, rough, and one owner will carry the loan
const starterMax=()=>50000*((econ.hq||0)==0?cityP()/Z0F:cityP());
function starterDeal(){
 for(let i=0;i<400;i++){const L=genListing();if(L.price<=starterMax()&&L.units<=2&&!L.trophy)return L}
 return null}
function ensureStarters(){
 if(!econ.ready||(econ.hq||0)>0||(econ.props&&econ.props.length))return;
 const have=listings.filter(L=>!L.deal&&L.price<=starterMax());
 for(let n=have.length;n<3;n++){const L=starterDeal();if(!L)break;if(n==0&&!L.sf){L.sf=true;L.desc+=' The owner may carry the loan.'}listings.push(L)}
}
{const _i=initEcon;initEcon=function(L){_i(L);ensureStarters()}}
{const _n=newDay;newDay=function(d){_n(d);if(d%7==1)ensureStarters()}}

// ── Zillow-style Listings screen ──
let lSort='price';const lFilt={aff:false,multi:false,sf:false,saved:false};
const HSIDE=['#c9b48a','#9fb3a0','#b98a7a','#8fa3b8','#d0c3a4','#a3937a'],HROOF=['#5a3a2a','#3c3f4a','#6a4a3a','#4a3a3a'],HSKY={D:['#7f858d','#9aa0a6'],C:['#8fb3cc','#b4d2e2'],B:['#a9d6ee','#d2ecf7']};
const shade=(hex,k)=>'#'+[1,3,5].map(i=>Math.max(0,Math.min(255,Math.round(parseInt(hex.substr(i,2),16)*k))).toString(16).padStart(2,'0')).join('');
function houseSVG(L){
 const id=L.id,s=HSIDE[id%6],r=HROOF[id%4],dark=shade(s,.82),n=L.units,wide=n>=3,two=n>=2,W=96,gy=50;
 const bw=wide?66:48,bx=Math.round((W-bw)/2)+(id%3-1)*3,bh=two?28:19,by=gy-bh,roofH=wide?8:11,trim=L.cond=='reno'?'#ffffff':'#e8dcc0',rough=L.grade=='D';
 let g=`<rect width="96" height="30" fill="${HSKY[L.grade][0]}"/><rect y="30" width="96" height="20" fill="${HSKY[L.grade][1]}"/>`;
 // sun or cloud, far trees
 g+=id%2?`<rect x="${10+id%40}" y="8" width="7" height="7" fill="#fff3b0"/><rect x="${9+id%40}" y="9" width="9" height="5" fill="#fff3b0"/>`:`<rect x="${58+id%20}" y="9" width="16" height="4" fill="#ffffff" opacity=".8"/><rect x="${62+id%20}" y="7" width="9" height="3" fill="#ffffff" opacity=".8"/>`;
 g+=`<rect x="0" y="36" width="14" height="14" fill="#4d7a3e"/><rect x="2" y="33" width="10" height="4" fill="#4d7a3e"/><rect x="83" y="37" width="13" height="13" fill="#4d7a3e"/><rect x="85" y="34" width="9" height="4" fill="#4d7a3e"/>`;
 // ground, sidewalk, yard
 g+=`<rect y="${gy}" width="96" height="10" fill="${rough?'#6f6a48':'#5f8a4a'}"/><rect y="${gy+6}" width="96" height="4" fill="#b8b0a0"/><rect y="${gy+6}" width="96" height="1" fill="#8f8878"/>`;
 // body with siding lines
 g+=`<rect x="${bx}" y="${by}" width="${bw}" height="${bh}" fill="${s}"/>`;
 for(let y=by+3;y<gy-1;y+=3)g+=`<rect x="${bx}" y="${y}" width="${bw}" height="1" fill="${dark}"/>`;
 g+=`<rect x="${bx}" y="${gy-2}" width="${bw}" height="2" fill="${shade(s,.6)}"/>`;
 // roof: stepped pixel gable with shingle lines, plus chimney
 let roof='';for(let k=0;k<roofH;k++){const inset=Math.round(k*(bw/2+3)/roofH);roof+=`<rect x="${bx-3+inset}" y="${by-1-k}" width="${bw+6-inset*2}" height="1" fill="${k%3==2?shade(r,.8):r}"/>`}
 g+=roof+`<rect x="${bx+bw-13}" y="${by-roofH-3}" width="5" height="${roofH+2}" fill="#7a4a3a"/><rect x="${bx+bw-14}" y="${by-roofH-4}" width="7" height="2" fill="#5a3428"/>`;
 // windows and door
 const cols=wide?n:2,cw=bw/cols,floors=two?2:1,boarded=L.cond=='asis',lit=L.cond=='tenant'||L.grade=='B';
 for(let f=0;f<floors;f++)for(let c=0;c<cols;c++){
  const gd=f==floors-1&&c==Math.floor(cols/2)-(cols%2?0:1)*0;
  if(f==floors-1&&c==(cols>2?Math.floor(cols/2):cols-1)){const dx=Math.round(bx+cw*c+cw/2-3);g+=`<rect x="${dx-1}" y="${gy-12}" width="8" height="12" fill="${trim}"/><rect x="${dx}" y="${gy-11}" width="6" height="11" fill="#4a3020"/><rect x="${dx+4}" y="${gy-6}" width="1" height="1" fill="#e0c060"/>`;continue}
  const wx=Math.round(bx+cw*c+cw/2-3),wy=by+4+f*11,glass=boarded?'#3a2a1a':lit?'#f4d67a':'#cfe2ee';
  g+=`<rect x="${wx-1}" y="${wy-1}" width="8" height="9" fill="${trim}"/><rect x="${wx}" y="${wy}" width="6" height="7" fill="${glass}"/>`;
  if(!boarded)g+=`<rect x="${wx+2.5}" y="${wy}" width="1" height="7" fill="${trim}"/><rect x="${wx}" y="${wy+3}" width="6" height="1" fill="${trim}"/>`;
  else g+=`<rect x="${wx-1}" y="${wy+1}" width="8" height="2" fill="#8a6a44"/><rect x="${wx-1}" y="${wy+4}" width="8" height="2" fill="#7a5a38"/>`;
  if(id%2&&!boarded)g+=`<rect x="${wx-3}" y="${wy}" width="2" height="7" fill="${shade(r,1.2)}"/><rect x="${wx+7}" y="${wy}" width="2" height="7" fill="${shade(r,1.2)}"/>`;
 }
 // porch step, yard details
 g+=`<rect x="${bx+bw/2-6}" y="${gy-1}" width="12" height="2" fill="#a8a090"/>`;
 if(L.grade=='B')g+=`<rect x="${bx-2}" y="${gy-5}" width="${bw+4}" height="4" fill="#3f7a3a"/><rect x="${bx-2}" y="${gy-5}" width="${bw+4}" height="1" fill="#5a9a4a"/>`;
 else if(L.grade=='C')g+=`<rect x="${bx-4}" y="${gy-3}" width="2" height="3" fill="#7a5a38"/><rect x="${bx+bw+2}" y="${gy-3}" width="2" height="3" fill="#7a5a38"/>`;
 else g+=`<rect x="${bx-6}" y="${gy-2}" width="5" height="3" fill="#3a5a2a"/><rect x="${bx+bw+2}" y="${gy-3}" width="6" height="4" fill="#3a5a2a"/><rect x="${bx+4}" y="${gy}" width="3" height="1" fill="#3a5a2a"/>`;
 // yard sign
 g+=`<rect x="${bx-13}" y="${gy-9}" width="1" height="10" fill="#6a4a2a"/><rect x="${bx-17}" y="${gy-12}" width="9" height="6" fill="#fafafa"/><rect x="${bx-17}" y="${gy-12}" width="9" height="2" fill="#d94a3a"/>`;
 return`<svg viewBox="0 0 96 60" shape-rendering="crispEdges" preserveAspectRatio="xMidYMid slice">${g}</svg>`}
// beds, baths and square feet: made up but stable per listing
function listFacts(L){
 const id=L.id,per={sfh:[2,1,820],sfh3:[3,1.5,1120],duplex:[2,1,740],triplex:[2,1,690],quad:[1.5,1,620]}[L.type]||[2,1,800],g={D:0,C:80,B:220}[L.grade];
 const sq=(per[2]+g+(id*37)%160)*L.units,bd=per[0]*L.units;
 return L.units>1?`${L.units} units · ${Math.round(bd)} bd · ${sq.toLocaleString('en-US')} sqft`:`${per[0]} bd · ${per[1]} ba · ${sq.toLocaleString('en-US')} sqft`}
const listNeed=L=>{const a=analyze(L);return L.sf?Math.min(a.inv.cash,L.price*.13+knownRehab(L)):a.inv.cash};
function listBadges(L){
 const b=[];if(L.trophy)b.push(['Trophy','#b89ad8']);if(L.deal)b.push(['Under contract','#e8c98a']);else if(L.showing)b.push([`Showing day ${L.showing}`,'#8fe08a']);
 if(L.dom<=7)b.push(['New','#5a9af0']);else if(L.dom>45&&!L.trophy)b.push(['Price drop','#e8c98a']);if(L.sf)b.push(['Owner financing','#4fc07a']);if(L.cond=='tenant')b.push(['Tenant-occupied','#e0a83a']);
 if(L.cond=='asis'||L.cond=='cosmetic')b.push(['Fixer-upper','#e0805a']);if(L.motive=='high'&&L.dom<=3)b.push(['Motivated seller','#e0605a']);
 return b.slice(0,3).map(([t,c])=>`<span class="lbadge" style="background:${c}">${t}</span>`).join('')}
function listCard(L){
 if(lDetail==L.id||L.deal)return`<div class="lopen">${listingHTML(L)}</div>`;
 const saved=watch.has(L.id),need=listNeed(L),math=canMath(),a=math?analyze(L):null,out=need>econ.cash*1.25+1;
 return`<div class="lcard${L.trophy?' trophy':''}"><button class="limg" data-act="ldetail:${L.id}" aria-label="Open ${L.addr}">${houseSVG(L)}<div class="lbadges">${listBadges(L)}</div></button>
  <button class="lstar${saved?' on':''}" data-act="lsave:${L.id}" aria-label="${saved?'Unsave':'Save'}">${saved?'★':'☆'}</button>
  <div class="lbody"><div class="lprice">${money(L.price)}</div>
   <div class="lmeta">${listFacts(L)}</div>
   <div class="laddr">${L.addr} · ${GRADE[L.grade].label} · ${L.dom}d listed</div>
   <div class="lnums">${math?`<span>Cap ${pct(a.cap)}</span><span class="${a.inv.cf>=0?'pos':'neg'}">${a.inv.cf>=0?'+':''}${money(a.inv.cf)}/mo</span>`:'<span class="muted">Numbers locked</span>'}</div>
   <div class="lneed ${out?'warn':'pos'}">${money(need)} to close${L.sf?' (owner financing)':''}</div></div></div>`}
Object.assign(A('deals'),{lock:null,render(){
 let list=[...listings];const n0=list.length;
 if(lFilt.aff)list=list.filter(L=>listNeed(L)<=econ.cash*1.25+1);
 if(lFilt.multi)list=list.filter(L=>L.units>1);
 if(lFilt.sf)list=list.filter(L=>L.sf);
 if(lFilt.saved)list=list.filter(L=>watch.has(L.id));
 const key={price:L=>L.price,cash:listNeed,new:L=>L.dom,cap:L=>-analyze(L).cap}[lSort]||(L=>L.price);
 list.sort((a,b)=>(lSort=='price'?watch.has(b.id)-watch.has(a.id):0)||key(a)-key(b));
 const chip=(k,t)=>`<button class="lchip${lFilt[k]?' on':''}" data-act="lfilter:${k}">${t}</button>`,srt=(k,t)=>`<button class="lchip${lSort==k?' on':''}" data-act="lsort:${k}">${t}</button>`;
 return toast()+`<h3>Listings · ${econ.city}</h3><p class="muted">${list.length} of ${n0} homes${mood=='recession'?'. Recession: sellers are desperate':mood=='boom'?'. Boom: houses go fast':''}. New ones every week; driving the neighborhood finds the rest.</p>
  <div class="lbar"><span class="muted">Show</span>${chip('aff','Within reach')}${chip('multi','Multi-family')}${chip('sf','Owner financing')}${chip('saved','Saved')}<span class="muted" style="margin-left:8px">Sort</span>${srt('price','Price')}${srt('cash','Cash to close')}${srt('new','Newest')}${canMath()?srt('cap','Cap rate'):''}</div>
  <div class="lgrid">${list.map(listCard).join('')||'<p class="muted">Nothing matches. Clear a filter, or drive the neighborhood from the door.</p>'}</div>`}});
{const _a=act;act=function(a,id){
 if(a=='lsort'){lSort=id;devMsg='';return}
 if(a=='lfilter'){lFilt[id]=!lFilt[id];devMsg='';return}
 _a(a,id)}}
{const s=document.createElement('style');s.textContent=`.lbar{display:flex;flex-wrap:wrap;gap:6px;align-items:center;margin:6px 0 8px;font-size:16px}
.lchip{font-family:"VT323",monospace;font-size:17px;padding:2px 10px;border:1px solid #ffffff30;background:#ffffff0a;color:var(--ink2);border-radius:14px;cursor:pointer}.lchip.on{background:#2c4a3a;border-color:#4fc07a;color:#e8ffe8}
.lgrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(190px,1fr));gap:10px}.lopen{grid-column:1/-1}
.lcard{transition:transform .12s,box-shadow .12s,border-color .12s;position:relative;background:#ffffff0c;border:1px solid #ffffff18;display:flex;flex-direction:column}.lcard.trophy{opacity:.72}
.limg{display:block;position:relative;padding:0;border:0;background:none;cursor:pointer;width:100%;aspect-ratio:8/5;overflow:hidden}.limg svg{width:100%;height:100%;display:block}
.lcard:hover{transform:translateY(-2px);box-shadow:0 6px 14px #0009;border-color:#ffffff40}.limg::after{content:'';position:absolute;inset:0;box-shadow:inset 0 -18px 18px -14px #000a;pointer-events:none}.lbadges{position:absolute;left:5px;top:5px;display:flex;flex-direction:column;gap:3px;align-items:flex-start}
.lbadge{font-family:"Silkscreen",monospace;font-size:8px;letter-spacing:.03em;padding:2px 4px;color:#1a120c;text-transform:uppercase}
.lstar{position:absolute;right:4px;top:2px;background:none;border:0;font-size:22px;color:#f0d69c;cursor:pointer;text-shadow:0 1px 2px #000}.lstar.on{color:#ffcf40}
.lbody{padding:6px 8px 8px;display:flex;flex-direction:column;gap:1px}.lprice{font-family:"VT323",monospace;font-size:32px;line-height:.95;color:var(--ink);letter-spacing:.01em}
.lmeta{font-size:17px;color:var(--ink2);margin-top:2px}.laddr{font-size:15px;color:var(--dim)}.lnums{display:flex;gap:10px;font-size:16px}.lneed{font-size:16px;margin-top:2px}
/* the laptop gets the whole window: the game screen is too small for a listings grid */
@media (min-width:761px){.devwrap{position:fixed;inset:0;z-index:40;background:rgba(8,6,4,.84)}.bezel{width:min(1120px,100%)}.bezel .app{max-height:min(72vh,680px)}}`;document.head.appendChild(s)}
/*@@ module market.js end @@*/
