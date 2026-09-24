# JuntTycoon: Design & Roadmap

*Last updated: 2026-09-23*

A 2D pixel-art real estate tycoon game (a walkable 3D version in Unity or Unreal comes later). You start with an RNG upbringing and climb from rough rentals to trophy assets: studio apartment → hustle office → downtown corner suite → estate → Billionaires' Row penthouse. The pacing is faster than real life, but the mechanics track the real thing.

---

## 1. How to run
- See README.md: build with `build.ps1` (Windows) or `node build.mjs`, then open `dist/index.html`.
- Canonical base: the itch build `junttycoon-itch-v1` (2026-09-24). It adds save/load (Continue on the title screen), hidden dev tools (`?dev` or backtick), fit-to-window, a next-step hint, bankruptcy and rock bottom, family help and debt, starter deals, bird-dogging, goals and outfit recoloring on top of G1–G8.

## 2. Locked design decisions
| Area | Decision |
|---|---|
| Format | 2D side-view, walkable rooms; 640×360 internal resolution; pixel art + dynamic lighting + WebGL post shaders |
| Vibe | Like *FNAF: Into the Pit* lighting, but NOT horror. Cozy hustle. |
| Art | AI-generated painterly pixel art (ChatGPT), cleaned up in code. Style anchor: the Estate foyer. Every stage gets night + day versions and eventually animation variant frames. |
| Palette arc | Muted 70s film (studio) → neon night (2B) → golden hour (suite) → marble + gold (estate) → cool night skyline (penthouse) |
| Time | The bed moves time forward (sleep until morning / next booked event / 2-hour nap). A day/night cycle drives the art crossfade. |
| Start | RNG life roll: upbringing, city, family help, job, savings, debt, credit, 2 traits. The starting stage scales with net worth and income (never the Estate or penthouse). |
| Stages | Forward-only moves with a moving-day animation. The stage you're in is where you live and work. |
| FHA / house-hacking | **Removed** until the 3D game (you live "in your stage," not in a specific property). You can still buy or sell any property. |
| Bills | Paid manually in the Bank app on the computer or phone. Autopay is optional per bill and off by default. |
| Computer | Clickable desktop "Junt-OS" with pixel icons and windows; the phone has a home screen. 7 apps: Bank, Listings, Portfolio, Career (Jobs/Learn/Gigs), Business, Inbox (Messages/News), Calendar. |
| Calendar | Only real bookings (showings, interviews, inspections, closings). |
| Title screen | 226 W 69th St (the creator's first real rental). Day or evening follows the system clock (falls back to in-game time). Cartoony "Junt Tycoon" title. |

## 3. Systems built (browser prototype)
- **G1 Life roll:** weighted RNG; realistic salaries, credit spread, student loans, car notes; 3 fictional cities (Millbrook = Rust Belt, Palo Verde = Sun Belt, Harbor City = coastal) with different rents, prices and taxes.
- **G2 Money loop:** paychecks every 14 days; bills on the 1st, due by the 5th; late fees; credit reporting at 30 days late; overdrafts; credit rises with on-time months.
- **G2 Career:** 7 courses (Learn), 12 jobs gated by courses and experience (Jobs, with interviews), 6 gigs (time and energy for cash). Traits matter (Handy, Numbers brain, Silver tongue, Connected, Frugal, Night owl).
- **G3 Listings:** generated deals by neighborhood grade (D/C/B, shown as Rough/Working-class/Solid) and condition; full underwriting (NOI, cap rate, cash flow, cash-on-cash), hidden until the player learns it.
- **G4 Walkthroughs:** a dark vacant house explored with a flashlight aimed by the mouse; hold the light on a defect to discover it; 80-second timer.
- **G5 Offers & financing:** investor loan / hard money / cash; lender check (credit, DTI, cash); seller accept/counter/reject by motivation; inspection contingency, repair credits, walking away; 10-day closing; monthly mortgage bills.
- **G6 Tenants:** contractor surprises behind the walls; list units; screen applicants; Housing Choice Voucher tenants modeled on research (long tenure, housing authority pays about 70%, rent capped by neighborhood, required inspection, no built-in damage penalty); source-of-income law by city; rent day; late payers; evictions; maintenance calls; turnover; property manager.
- **G7 Growth:** cash-out refinance (BRRRR, 90-day seasoning, DSCR ≥ 1.0), selling, net worth, reputation, off-market broker tips, HQ upgrades.
- **G8 Living world:** market cycles that drive rates, prices, demand and the mood shader; recession layoffs; News; rivals Vince Marlow & Keiko Hart snipe listings; story beats (Mike the handyman, the old landlord's letter); legacy goal of $100M and 1,000 units.
- **Other:** door menu (showing / gym / driving for deals), gym walk-speed upgrades, energy, a "Since yesterday" money summary on waking, a sharp text overlay, and HUD numbers in VT323.

## 4. Art status
| Asset | Status |
|---|---|
| Title screen: day + evening | ✅ |
| Studio: night + day | ✅ |
| Suite 2B: night + day | ✅ |
| Corner suite: golden hour | ✅ · night ⏳ next |
| Estate: golden hour + night (doors closed) + exterior | ✅ · daytime ⏳ · study room ⏳ |
| Penthouse (Billionaires' Row) | ⏳ still hand-drawn placeholder |
| Character: hoodie sheet + sleep/sit poses | ✅ |
| Character: bomber sheet + poses | ✅ |
| Character: blazer (suite), turtleneck (estate), suit (penthouse) | ⏳ |
| Walkthrough house interiors | ⏳ hand-drawn placeholder |
| Animation variant frames (trees, water, flames, neon) | ⏳ |

**Prompt rules that work:** attach an existing image as the style reference; flat orthographic "dollhouse cross-section" side view; 16:9; the bottom 17% is a walkable floor clear of furniture; a doorway is about 27% of image height; list objects left to right with % positions; "true pixel art, hard edges, no anti-aliasing"; "not horror"; no people, text, UI or watermark. For time-of-day variants: "keep the IDENTICAL composition… change only the time." For sprites: solid magenta #FF00FF background, one row, same scale.

## 5. Next up (pipeline)
Full art checklist with ready-to-paste prompts: see ASSET_PROMPTS.md.

1. Corner suite night → blazer outfit sheet + poses
2. Estate: daytime version, study room (the work area) and turtleneck outfit; penthouse art + suit outfit
3. Walkthrough house interiors by grade (D/C/B), each with dark and lit versions
4. Animated background variants (swaying trees, fountain, flames, flickering neon)
5. Shader refinement: calmer motion on Full, fix Subtle
6. **Save/load** (a refresh currently loses the run)
7. Sound: ambient room loops, UI clicks, cash register
8. Tutorial / mentor character
9. Balance pass on all numbers
10. Tenant screening expansion (the full voucher system per the research below)
11. Starting-home variants (parents' spare room, aunt's couch, condo) with their own art
12. Pick the engine and port for the local desktop build (below)

## 6. Tech notes
- Plain HTML/JS. `src/NN-name.js` modules are concatenated in filename order into `index.template.html`; assets are referenced by `@@asset:mime@path@@` tokens and inlined at build time.
- Modules extend each other by wrapping earlier functions (`const _prev=fn; fn=function(){ _prev(); … }`). New features go in new, higher-numbered files.
- **Porting to 3D later:** Unity (URP) is recommended. Move the simulation (economy, deals, tenants, market) into engine-free C# classes; the rendering layer only draws state.
- Lighting model: base art → half-resolution darkness mask with light holes → separate foreground mask (silhouettes) → additive glows → post shader (bloom, grain, vignette, chromatic aberration, per-stage grade, market-mood grade).
- Art cleanup in code: downscale in steps, key out magenta, remove the pink edge tint, threshold alpha, find poses by column, align on a shared baseline.

## 7. Research notes (Section 8 / Housing Choice Vouchers)
- Tenure is long: households stay in the program about 6.6 years on average (median 4.8), and about 10 years in their current unit. Elderly households stay longest.
- Rent: the payment standard is 90–110% of Fair Market Rent. That can be above market in cheap areas and below market in expensive ones.
- Damage: no evidence voucher tenants cause more damage than other tenants. The real friction is inspections, paperwork and payment timing.
- Law: about 23 states ban source-of-income discrimination; some (e.g. TX, IN) preempt local bans.
- Sources: HUD "Length of Stay in Assisted Housing"; HUD Cityscape 26(2); NLIHC source-of-income protections; Collinson & Ganong, "The Incidence of Housing Voucher Generosity"; Federal Register 2016 Small Area FMR rule.
