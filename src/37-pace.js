/*@@ module pace.js begin @@*/
/* ───────────── Pacing + a faster first unit ─────────────
   1. The awake clock runs 3x faster than the first build (a game day was 12 real minutes) and speeds up as the empire grows.
   2. Sleeping can skip ahead: to payday, to the 1st (bills), or a week. The skip stops early if something needs you.
   3. The night cutscene is about a third as long, and shrinks a little more as you grow.
   4. First unit: seller financing (10% down, no bank), investor-loan down payment that drops with credit and track record,
      bird-dog finder's fees when you drive the neighborhood, and shorter refinance seasoning as you own more.
   (The exact-match patches for frame(), analyze(), the drive action and grefi are in tools/apply_modules.py.) */

// ── 1 · clock speed ──
function paceAwake(){
 const u=econ.props?unitsOwned():0;
 return Math.min(6,3+Math.min(1.5,u*.05)+Math.min(1.5,(econ.hq||0)*.4));
}
const nightK=()=>Math.max(.4,.6-(econ.props?unitsOwned():0)*.004);   // .6 at the start, .4 with a big portfolio

// ── 2 · sleeping and skipping ──
let skipTarget=0,skipRun=false,skipHit=0;
const URGENT=/late|Autopay failed|laid off|Beaten|failed the housing|moved out|fell through|Hard money|Broker|evict|Landlord/i;
{const _n=note;note=function(t){_n(t);if(skipRun&&URGENT.test(String(t)))skipHit=1}}

startSleep=function(kind){
 sleepMark={tx:econ.tx[0],cash:econ.cash,credit:econ.credit,day};
 closeMenu();mode='seq';
 const b=st.bed,up=!!b.upstairs,tx=up?b.x:b.hx+30,F=nightK()/.6*.4,S=d=>Math.max(6,Math.round(d*F));
 let total,dur,tDay=day,startAbs,stopped=false;
 if(kind=='nap'){total=120;dur=90}
 else{
  tDay=kind=='skip'?skipTarget:kind=='event'?Math.max(day+1,agenda[0].day):(gameMin<420?day:day+1);
  const n=tDay-day;total=n*1440+420-gameMin;
  dur=kind=='skip'?Math.min(260,90+n*8):Math.min(300,100+Math.max(0,n-1)*24);
 }
 dur=Math.round(dur*nightK()/.6);
 say(kind=='nap'?'Just a quick one...':kind=='skip'?'Time to let a few days go by...':up?'Heading up for the night.':'Lights out.');
 const walk={until:()=>pl.x===tx,f:(p,dt)=>{const d=Math.sign(tx-pl.x);if(d)pl.face=d;pl.vx=d*3;pl.x+=pl.vx*dt;if(Math.abs(pl.x-tx)<3.2)pl.x=tx;pl.walk+=3*dt*.12}};
 const lapse={d:dur,
  start:()=>{startAbs=day*1440+gameMin;calA=1;skipRun=true;skipHit=0},
  until:()=>stopped||lapse.t>=lapse.d,
  f:p=>{
   if(stopped)return;
   const e=p*p*(3-2*p),abs=startAbs+total*e,nd=Math.floor(abs/1440);
   while(day<nd){
    prevDay=day;day++;flipT=38;newDay(day);
    // stop the skip on the morning something needs you (never past an appointment; the target is already capped to the next one)
    if(kind!='nap'&&day<tDay&&(skipHit||(typeof failDue=='function'&&failDue()))){stopped=true;gameMin=420;return}
   }
   gameMin=abs-day*1440;
  }};
 const steps=up?[
  walk,
  {d:S(95),start:()=>{pl.face=-1;pl.vx=-1},f:(p,dt)=>{pl.x=tx-p*80;pl.lift=p*52;pl.alpha=1-p;pl.walk+=dt*.2;lampsOff=p*.6}},
  {d:S(12),start:()=>{pose='gone';pl.vx=0}},
  {d:S(30)},lapse,
  {d:S(34),f:p=>{lampsOff=.6*(1-p);calA=1-p}},
  {d:S(95),start:()=>{pose='stand';pl.face=1;pl.vx=1},f:(p,dt)=>{pl.x=tx-80+p*80;pl.lift=52*(1-p);pl.alpha=p;pl.walk+=dt*.2}},
  {d:S(95),start:()=>{pl.vx=0;pl.lift=0;pl.alpha=1;pl.x=tx;pose='stretch'}},
 ]:[
  walk,
  {d:S(32),start:()=>{pl.vx=0;pose='sit'}},
  {d:S(44),start:()=>{pose='lie';bulbOn=false},f:p=>lampsOff=p},
  {d:S(70)},lapse,
  {d:S(50),f:p=>{lampsOff=1-p;calA=1-p}},
  {d:S(40),start:()=>{pose='sit';zz=[]}},
  {d:S(95),start:()=>{pose='stretch';pl.face=1}},
 ];
 seq={i:0,steps,done:()=>{skipRun=false;pose='stand';mode='free';finishSleep(kind)}};
};

openSleepMenu=function(){
 mode='menu';
 const evs=agenda.filter(a=>a.day>day).sort((a,b)=>a.day-b.day),ev=evs[0],cap=ev?ev.day:Infinity,opts=[];
 if(ev)opts.push(['event',`Sleep until day ${ev.day}: ${ev.text}`]);
 opts.push(['morning',gameMin<420?'Sleep until morning':'Sleep until tomorrow morning']);
 const seen=new Set([day+1,ev?ev.day:-1]);
 const add=(want,label)=>{const t=Math.min(want,cap);if(t<=day+1||seen.has(t))return;seen.add(t);
  opts.push(['skip:'+t,`${label}: day ${t} (${t-day} days${t<want?', stops for an appointment':''})`])};
 if(econ.ready){
  if(econ.salary>0){let p=day+1;while(p%14)p++;add(p,'Skip to payday')}
  add(day+(MONTH-((day-1)%MONTH)),'Skip to the 1st and bill day');
  add(day+7,'Skip a week');
 }
 opts.push(['nap','Nap for 2 hours (+25 energy)'],['cancel','Not yet']);
 say(`Energy ${Math.round(energy)}/100. ${energy<30?'You are running on fumes. ':''}${opts.length>4?'How long? Skips stop early if something needs you.':'How long?'}`);
 showMenu(opts,k=>{
  if(k=='cancel'){closeMenu();say('Maybe later.');return}
  if(k=='event')agenda=agenda.filter(a=>a.day>day).sort((a,b)=>a.day-b.day);
  if(k.startsWith('skip:')){skipTarget=+k.slice(5);k='skip'}
  startSleep(k)});
};

// ── 3 · first unit: seller financing ──
FIN.seller={name:'Seller financing',down:.10,rate:.0825,minCredit:0,dti:9,seller:true};
{const _g=genListing;genListing=function(){const L=_g();
 L.sf=L.motive!='low'&&Math.random()<(L.cond=='tenant'?.5:L.motive=='high'?.4:.25);
 if(L.sf)L.desc+=' The owner may carry the loan.';return L}}
{const _lc=lenderCheck;lenderCheck=function(L,price,f){const r=_lc(L,price,f);
 if(f=='seller'&&!L.sf){r.ok=false;r.reasons.unshift("This owner won't carry the loan.")}return r}}
{const _lh=listingHTML;listingHTML=function(L){let h=_lh(L);
 if(!L.sf)h=h.replace(new RegExp('<button[^>]*data-act="lfin:'+L.id+'\\|seller"[^>]*>[^<]*</button>\\s?'),'');return h}}

// ── 4 · first unit: down payment and seasoning that ease with credit and track record ──
function convDown(){
 if(!econ.ready||!econ.props)return .25;
 return Math.max(.15,.25-(econ.credit>=700?.03:0)-Math.min(.07,econ.props.length*.02));
}
Object.defineProperty(FIN.conv,'down',{get:convDown,configurable:true,enumerable:true});
function seasoning(){const n=econ.props?econ.props.length:0;return n>=4?30:n>=2?60:90}

// ── 5 · first unit: bird-dog fees (called from the drive action) ──
function birdDog(){
 if(Math.random()>=.12)return false;
 const fee=Math.round(rint(400,1200)*(econ.done&&econ.done.has('re101')?1.25:1)/25)*25;
 addTx(day,'Bird-dog fee',fee);
 say(`You spotted a boarded-up duplex and called it in to a wholesaler you know. Finder's fee: ${money(fee)}.`);
 return true;
}
/*@@ module pace.js end @@*/
