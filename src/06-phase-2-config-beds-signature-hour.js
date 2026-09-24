/* ───────────── phase 2 config: beds, signature hour, windows, agenda, overnight notes ───────────── */
const EXTRA=[
 {sig:23+40/60,win:[470,130,90,100],bed:{hx:36,y:286,blanket:'#6E7F5F'},
  events:['Showing: 2-bed at 1418 Elm St','Rent due ($650)','Day job: double shift','Meet Mike the handyman','Credit union loan appointment'],
  notes:['Landlord: "Rent. Friday."','Mike: "Can do the faucet Saturday, cash only."','Bank: your balance is below $400.','A listing you saved dropped $6K.','Mom: "Are you eating?"']},
 {sig:2,win:[422,110,138,130],bed:{hx:40,y:275,blanket:'#8fa0b8'},
  events:['Duplex closing at the title office','Tenant move-in: Unit B','Contractor walkthrough, triplex','City code re-inspection','Lender call: DSCR refinance'],
  notes:['Tenant, Unit A: "Heat is making a noise."','Lender: pre-approval updated.','Wholesaler: "Off-market triplex, act fast."','The laundromat owner wants to sell the building.']},
 {sig:18+10/60,win:[330,66,210,184],bed:{hx:138,y:275,blanket:'#7a2e2e'},
  events:['Investor lunch','Portfolio lender review','Tour: 24-unit on Harbor Ave','Quarterly property manager meeting','Appraisal: Maple Court'],
  notes:['Property manager: 96% occupancy.','Broker: "Pocket listing, 24 units, call me."','Assistant moved your 9 AM to 10.','Rent deposits: $41,280 received.']},
 {sig:19.5,win:[360,40,264,260],bed:{hx:36,y:281,blanket:'#c9a038'},
  events:['Family office board call','Tour: medical office building','Charity gala','Acquisition committee','Tax strategy session'],
  notes:['CFO: Q3 distributions sent.','Architect sent new renderings.','A rival outbid you on the medical building.','The car was detailed. Again.']},
 {sig:23,win:[0,40,W,260],bed:{hx:52,y:281,blanket:'#3a3a44'},
  events:['Groundbreaking: Tower 15','Sovereign fund meeting','Television interview','Board of directors','Flight to Miami: waterfront parcel'],
  notes:['Tokyo office: term sheet signed.','Tower 9 hit 100% leased.','Press request: a profile piece.','A letter from your old landlord. He wants to sell you the building.']},
];
EXTRA.forEach((e,i)=>Object.assign(STAGES[i],e));

