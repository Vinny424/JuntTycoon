/* ───────────── G2b: careers, learning, side gigs ───────────── */
const COURSES=[
 {id:'finance',name:'Personal finance basics',cost:0,sessions:3,desc:'Budgeting, credit and debt payoff. Unlocks extra loan payments in the Bank app.'},
 {id:'re101',name:'Real estate investing fundamentals',cost:49,sessions:5,desc:'Cap rates, cash flow and how deals work. Unlocks deal analysis in Listings.'},
 {id:'license',name:'Real estate salesperson license',cost:650,sessions:10,req:['re101'],desc:'State exam prep. Unlocks agent jobs and the "show a rental" gig.'},
 {id:'pm',name:'Property management certificate',cost:450,sessions:6,req:['re101'],desc:'Leases, maintenance and fair housing. Unlocks property manager jobs.'},
 {id:'it',name:'IT support certificate',cost:300,sessions:8,desc:'Help desk and networking basics. Unlocks IT jobs.'},
 {id:'trade',name:'Trade school: electrical basics',cost:1200,sessions:12,desc:'Wiring, code and safety. Unlocks electrician jobs, handyman gigs and the Handy trait.'},
 {id:'nursing',name:'Practical nursing program',cost:4500,sessions:20,desc:'A long program. Unlocks nursing jobs.'},
];
const JOBCAT=[
 {id:'barista',title:'Barista',track:'general',pay:[26000,30000],req:[]},
 {id:'wh',title:'Warehouse associate',track:'general',pay:[31000,36000],req:[]},
 {id:'driver',title:'Delivery driver, full-time',track:'general',pay:[34000,40000],req:[]},
 {id:'itsup',title:'IT support specialist',track:'it',pay:[50000,62000],req:['it']},
 {id:'netadmin',title:'Network administrator',track:'it',pay:[78000,95000],req:['it'],exp:['it',120]},
 {id:'appr',title:'Electrician apprentice',track:'trade',pay:[46000,56000],req:['trade']},
 {id:'journey',title:'Journeyman electrician',track:'trade',pay:[68000,84000],req:['trade'],exp:['trade',150]},
 {id:'leasing',title:'Leasing agent',track:'re',pay:[42000,50000],req:['license']},
 {id:'agent',title:'Real estate agent (base + commission)',track:'re',pay:[55000,90000],req:['license'],exp:['re',90]},
 {id:'apm',title:'Assistant property manager',track:'pm',pay:[50000,60000],req:['pm']},
 {id:'pmgr',title:'Property manager',track:'pm',pay:[65000,80000],req:['pm'],exp:['pm',120]},
 {id:'lpn',title:'Licensed practical nurse',track:'nursing',pay:[54000,64000],req:['nursing']},
];
const GIGS=[
 {id:'deliv',name:'Food delivery shift',h:4,en:25,pay:[55,95]},
 {id:'move',name:'Help someone move',h:5,en:35,pay:[110,160]},
 {id:'bar',name:'Bartending shift',h:6,en:30,pay:[120,210]},
 {id:'tutor',name:'Math tutoring session',h:2,en:10,pay:[60,90],need:()=>hasTrait('Numbers brain'),why:'Needs the Numbers brain trait.'},
 {id:'handy',name:'Handyman job',h:4,en:25,pay:[140,260],need:()=>hasTrait('Handy'),why:'Needs the Handy trait (trade school gives it).'},
 {id:'show',name:'Show a rental for a landlord',h:2,en:10,pay:[150,300],need:()=>econ.done.has('license'),why:'Needs a real estate license.'},
];
const TRACK_OF={'IT support specialist':'it','Electrician apprentice':'trade','Licensed practical nurse':'nursing'};
const taxRate=s=>s<40000?.15:s<100000?.22:.3;
const hasTrait=n=>econ.traits.includes(n);
let devMsg='';
const toast=()=>devMsg?`<p class="toast">${devMsg}</p>`:'';
const _initEcon=initEcon;
initEcon=function(L){_initEcon(L);Object.assign(econ,{traits:L.traits.map(t=>t[0]),done:new Set(),prog:{},track:TRACK_OF[L.title]||(L.job=='high'?'pro':'general'),trackDays:180,applied:{}})};
function spend(h,en){if(energy<en)return false;energy-=en;gameMin+=h*60;while(gameMin>=1440){gameMin-=1440;day++;newDay(day)}return true}
const courseSessions=c=>hasTrait('Numbers brain')?Math.ceil(c.sessions*.8):c.sessions;
const reqMet=r=>(r||[]).every(x=>econ.done.has(x));
const expMet=j=>!j.exp||(econ.track==j.exp[0]&&econ.trackDays>=j.exp[1]);
const CN=id=>COURSES.find(c=>c.id==id).name;

// day hook: job experience + interview results
const _newDay=newDay;
newDay=function(d){_newDay(d);if(!econ.ready)return;if(econ.salary>0)econ.trackDays++;
 for(const[id,a]of Object.entries(econ.applied)){if(a.day!=d)continue;delete econ.applied[id];const j=JOBCAT.find(x=>x.id==id);
  let p=.55+(hasTrait('Connected')?.15:0)+(hasTrait('Silver tongue')?.1:0)-(econ.credit<600?.05:0)-(a.salary>econ.salary*1.6&&econ.salary>0?.15:0);p=Math.max(.2,Math.min(.9,p));
  if(Math.random()<p){const newT=j.track!=econ.track;econ.salary=a.salary;econ.net=Math.round(a.salary*(1-taxRate(a.salary))/12);econ.job=j.title;if(newT){econ.track=j.track;econ.trackDays=0}
   note(`Offer accepted: ${j.title} at ${money(a.salary)} a year. You start tomorrow.`)}
  else note(`${j.title}: they went with someone else. ${['"Great interview, just not the right fit."','"We need more experience for this one."','"Keep us in mind next year."'][rint(0,2)]}`)}};

function act(a,id){
 devMsg='';
 if(a=='study'){const c=COURSES.find(x=>x.id==id);if(devKind=='phone'){devMsg='Studying needs a real computer.';return}
  if(!(id in econ.prog)){if(econ.cash<c.cost){devMsg=`You need ${money(c.cost)} to enroll.`;return}if(c.cost)addTx(day,'Tuition: '+c.name,-c.cost);econ.prog[id]=0}
  if(!spend(3,15)){devMsg='Too tired to study. Sleep first.';return}
  econ.prog[id]++;const need=courseSessions(c);
  if(econ.prog[id]>=need){econ.done.add(id);delete econ.prog[id];let m=`Completed: ${c.name}!`;if(id=='trade'&&!hasTrait('Handy')){econ.traits.push('Handy');m+=' New trait: Handy.'}devMsg=m;econ.log.unshift({d:day,text:m})}
  else devMsg=`Study session done (${econ.prog[id]}/${need}). 3 hours passed.`;
 }
 if(a=='apply'){const j=JOBCAT.find(x=>x.id==id),sal=Math.round(rint(...j.pay)/500)*500,d=day+rint(1,3);econ.applied[id]={day:d,salary:sal};agenda.push({day:d,text:'Interview: '+j.title});agenda.sort((x,y)=>x.day-y.day);devMsg=`Applied. Interview on day ${d}.`}
 if(a=='gig'){const g=GIGS.find(x=>x.id==id);if(!spend(g.h,g.en)){devMsg='Too tired for that. Sleep first.';return}const p=rint(...g.pay);addTx(day,'Gig: '+g.name,p);devMsg=`${g.name}: +${money(p)}. ${g.h} hours passed, energy ${Math.round(energy)}.`}
 if(a=='extra'){if(econ.cash<500){devMsg='You need at least $500 in checking.';return}addTx(day,'Extra student loan payment',-500);econ.student=Math.max(0,econ.student-500);econ.loanPay=Math.round(econ.student*.011);devMsg=`Paid $500 extra. Loan balance ${money(econ.student)}, monthly payment now ${money(econ.loanPay)}.`}
}
devEl.addEventListener('click',e=>{const b=e.target.closest('[data-act]');if(!b||b.disabled)return;const[a,id]=b.dataset.act.split(':');act(a,id);renderDevice()});
const _closeDevice=closeDevice;closeDevice=function(){_closeDevice();devMsg='';if(econ.pending.length)say(flushMoney().trim())};
const _openDevice=openDevice;openDevice=function(k){devMsg='';_openDevice(k)};

const A=id=>APPS.find(a=>a.id==id);
const _bank=A('bank').render;
A('bank').render=function(){return toast()+_bank()+(econ.done.has('finance')&&econ.student>0?`<p><button class="act" data-act="extra">Pay $500 extra on student loans</button></p>`:'')};
Object.assign(A('learn'),{lock:null,render(){
 return toast()+`<h3>Learn</h3><p class="muted">Each session takes 3 hours and 15 energy, and needs the computer. Tuition is paid when you enroll.${hasTrait('Numbers brain')?' Numbers brain: 20% fewer sessions.':''}</p>`+
 COURSES.map(c=>{const need=courseSessions(c),done=econ.done.has(c.id),inP=c.id in econ.prog,ok=reqMet(c.req);
  const st=done?'<span class="pos">Completed</span>':inP?`<span class="warn">In progress ${econ.prog[c.id]}/${need}</span>`:ok?`${c.cost?money(c.cost):'Free'} · ${need} sessions`:`<span class="muted">Requires ${c.req.map(CN).join(', ')}</span>`;
  const btn=done?'':`<button class="act" data-act="study:${c.id}" ${ok?'':'disabled'}>${inP?'Study session':c.cost?`Enroll (${money(c.cost)})`:'Start'}</button>`;
  return`<div class="item"><div><b>${c.name}</b><br><span class="muted">${c.desc}</span><br>${st}</div>${btn}</div>`}).join('')}});
Object.assign(A('jobs'),{lock:null,render(){
 return toast()+`<h3>Jobs</h3><div class="card"><div class="label">Current job</div>${econ.salary?`<b>${econ.job}</b> · ${money(econ.salary)} a year (${money(econ.net)} a month after tax) · ${econ.trackDays} days of ${econ.track} experience`:'<b>No steady job.</b> Gigs are all you have. Apply below.'}</div>`+
 JOBCAT.filter(j=>j.title!=econ.job).map(j=>{const ok=reqMet(j.req)&&expMet(j),ap=econ.applied[j.id];
  const why=!reqMet(j.req)?`Requires ${j.req.map(CN).join(', ')}`:!expMet(j)?`Requires ${j.exp[1]} days of ${j.exp[0]} experience`:'';
  return`<div class="item"><div><b>${j.title}</b><br><span class="muted">${money(j.pay[0])} to ${money(j.pay[1])} a year</span>${why?`<br><span class="muted">${why}</span>`:''}</div>${ap?`<span class="warn">Interview day ${ap.day}</span>`:`<button class="act" data-act="apply:${j.id}" ${ok?'':'disabled'}>Apply</button>`}</div>`}).join('')}});
Object.assign(A('gigs'),{lock:null,render(){
 return toast()+`<h3>Gigs</h3><p class="muted">Side work that pays today. Energy: ${Math.round(energy)}/100.</p>`+
 GIGS.map(g=>{const ok=!g.need||g.need();return`<div class="item"><div><b>${g.name}</b><br><span class="muted">${money(g.pay[0])} to ${money(g.pay[1])} · ${g.h} hours · ${g.en} energy${ok?'':' · '+g.why}</span></div><button class="act" data-act="gig:${g.id}" ${ok&&energy>=g.en?'':'disabled'}>Do it</button></div>`}).join('')}});
