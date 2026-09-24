# JuntTycoon: Asset Prompts

Every remaining art asset for the 2D game, in production order. For each one: what to attach, the prompt to paste, and the exact file name and folder for the repo.

**How to use**
1. Attach the listed reference image(s) in ChatGPT, then paste the prompt.
2. Save the result as `.webp` (or `.png`) using the listed name, in the listed folder under `assets/art/`.
3. Commit it (or send it to Claude, who wires it into the game).
4. Tick the box.

**Rules that keep everything consistent** (already baked into the prompts)
- Rooms: flat orthographic "dollhouse cross-section" side view · 16:9 · bottom 17% is a walkable floor clear of furniture · a doorway is about 27% of image height · objects listed left to right by % of width.
- Time-of-day variants: "keep the IDENTICAL composition… change only the time."
- Sprites: one row, flat magenta `#FF00FF` background, same scale as the reference sheet, strict side view.
- Always: true pixel art, hard edges, no anti-aliasing, no blur · not horror · no people (in rooms), no text, no UI, no watermark.

---

## Phase A: finish the stages (needed to call the 2D version complete)

### A1 ☐ Corner suite at night
**Attach:** `suite/suite_goldenhour_v1.webp` · **Save as:** `assets/art/suite/suite_night_v1.webp`
```text
Using the attached image as the exact reference: keep the IDENTICAL composition, camera, and position of every object (bookshelf and its contents, trophy, globe, chesterfield sofa, pillows, throw blanket, side table, framed deed, framed house photo, window frames, skyline buildings, desk, both monitors, banker's lamp, leather chair, computer tower, plant, rug, herringbone floor, door, brass nameplate). Same pixel art style, same pixel size, crisp hard edges, no anti-aliasing, no blur.

Change only the time: it is late at night. Outside the window, the same skyline is now a deep navy night: the towers are dark silhouettes covered in small lit windows, with red aircraft lights on the tallest roofs and a few stars. The room is lit only by the green banker's lamp (a warm pool of light on the desk), the cool glow of the two monitors, and the faint city glow through the window. No sunbeams. The corners of the room fall into deep, warm brown shadow, and the floor softly reflects the lamp and monitors.

Mood: working late, the city still awake, quiet confidence. Not horror, not scary. No people, no text, no UI, no watermark.
```

### A2 ☐ Blazer outfit: walk sheet (corner suite)
**Attach:** `character/player_hoodie_sheet_v1.webp` · **Save as:** `assets/art/character/player_blazer_sheet_v1.webp`
```text
Using the attached sprite sheet as the exact reference: SAME person (same face, same messy dark-brown hair, same body proportions), same art style, same pixel size, same scale, same 6 poses in the same order and spacing, same flat solid magenta (#FF00FF) background.

Change ONLY the outfit: an unstructured navy blazer over a crisp white open-collar shirt, tan chinos, brown leather loafers, a simple steel watch. Confident, relaxed expression: 38 units, a real office.

Poses, left to right: 1 standing idle facing right, 2–5 a 4-frame walk cycle facing right, 6 facing the viewer with arms stretched overhead.

True pixel art: hard edges, no anti-aliasing, no blur, no shadows, no ground, no text, no watermark.
```

### A3 ☐ Blazer outfit: sleep and sit poses
**Attach:** the blazer sheet from A2 · **Save as:** `assets/art/character/player_blazer_poses_v1.webp`
```text
Using the attached sprite sheet as the exact character and style reference (same person, same blazer outfit, same pixel size, same colors), create 2 more poses on a flat solid magenta (#FF00FF) background, evenly spaced:

1. lying on their back asleep, horizontal, head on the RIGHT side, eyes closed, one arm resting on the stomach, strict side view, lying flat as if on a sofa (no sofa drawn)
2. sitting on the edge of a sofa (no sofa drawn), facing right, knees bent, feet flat on the ground, elbows on knees, groggy, just woke up

Same scale as the attached sheet. True pixel art: hard edges, no anti-aliasing, no blur, no shadows, no ground, no text, no watermark.
```

### A4 ☐ Estate foyer in daytime
**Attach:** `estate/estate_foyer_goldenhour_v1.webp` · **Save as:** `assets/art/estate/estate_foyer_day_v1.webp`
```text
Using the attached image as the exact reference: keep the IDENTICAL composition, camera, and position of every object (curved staircase, gold railing, bust, marble column, urns, flowers, sconces, arched doorway, open bronze doors, garden, fountain, hypercar, cypress trees, lake, skyline, floor inlay). Same pixel art style, same pixel size, crisp hard edges, no anti-aliasing, no blur.

Change only the time: bright late morning on a clear day. Blue sky with a few soft white clouds, the sun high and out of frame. Fresh, even daylight floods through the open arch. The sconces are unlit. The marble floor reflects the bright doorway and blue sky instead of a sunset streak. The garden is vivid green and the fountain sparkles.

Mood: calm, bright, effortless: a normal day at the top. No people, no text, no UI, no watermark.
```

### A5 ☐ Estate study (the work area; the computer lives here)
**Attach:** `estate/estate_foyer_goldenhour_v1.webp` (style only) · **Save as:** `assets/art/estate/estate_study_goldenhour_v1.webp`
```text
Using the attached image ONLY as the art style reference (same detailed pixel art technique, same pixel size, same marble, gold and golden-hour lighting), create a different room at the SAME camera scale (a doorway is about 27% of the image height).

Side-view 2D pixel art game background, flat orthographic "dollhouse cross-section" view looking straight at the back wall, 16:9. True pixel art: hard edges, no anti-aliasing, no blur.

Scene: the private study of a very wealthy real estate investor inside a classical palatial mansion. Layout from LEFT to RIGHT:
1. (2–20%) floor-to-ceiling walnut bookshelves with a rolling brass library ladder
2. (22–36%) a cream leather daybed/chaise with a folded cashmere throw (for naps)
3. (38–46%, on the wall) a large framed architectural drawing of a skyscraper
4. (48–78%) a massive carved walnut desk with a slim monitor showing a portfolio dashboard, a gold desk lamp, a crystal decanter set and a leather desk chair
5. (58–88%, on the back wall behind the desk) a tall arched window with gold mullions looking out at gardens and a distant lake at golden hour
6. (80–86%) a marble pedestal with a small bronze sculpture
7. (88–99%) tall double doors with gold handles, leading back to the foyer

Room: cream marble walls with gold trim, a coffered ceiling with a crystal chandelier, and a polished marble floor with a Persian rug. The bottom 17% of the image is a flat, walkable floor, kept clear of furniture across the whole width.

Lighting: warm golden-hour sun through the arched window, soft chandelier glow, gold highlights.

Mood: quiet power, legacy, the family office. No people, no text, no UI, no watermark.
```

### A6 ☐ Estate study at night
**Attach:** the study from A5 · **Save as:** `assets/art/estate/estate_study_night_v1.webp`
```text
Using the attached image as the exact reference: keep the IDENTICAL composition, camera and every object in place. Same pixel art style, same pixel size, crisp hard edges.

Change only the time: night. Outside the arched window: a deep navy sky, dark gardens with small path lanterns, and the lake reflecting distant city lights. Inside: the chandelier and gold desk lamp are lit, the monitor glows softly, and warm pools of light fall on the marble; the corners are in rich shadow. Mood: late-night deals in comfort. Not horror. No people, no text, no UI, no watermark.
```

### A7 ☐ Turtleneck outfit: walk sheet (estate)
**Attach:** `character/player_hoodie_sheet_v1.webp` · **Save as:** `assets/art/character/player_turtleneck_sheet_v1.webp`
```text
Using the attached sprite sheet as the exact reference: SAME person (same face, same messy dark-brown hair, now neatly styled, same body proportions), same art style, same pixel size, same scale, same 6 poses in the same order and spacing, same flat solid magenta (#FF00FF) background.

Change ONLY the outfit: a cream cashmere turtleneck, tailored charcoal wool trousers, dark brown suede loafers, and a thin gold watch. Calm, self-assured expression: owns the estate.

Poses, left to right: 1 standing idle facing right, 2–5 a 4-frame walk cycle facing right, 6 facing the viewer with arms stretched overhead.

True pixel art: hard edges, no anti-aliasing, no blur, no shadows, no ground, no text, no watermark.
```

### A8 ☐ Turtleneck outfit: sleep and sit poses
**Attach:** the turtleneck sheet from A7 · **Save as:** `assets/art/character/player_turtleneck_poses_v1.webp`
Same prompt as A3, with "same turtleneck outfit" and "as if on a daybed (no daybed drawn)".

### A9 ☐ Penthouse on Billionaires' Row at night
**Attach:** `suite/suite_goldenhour_v1.webp` (style only) · **Save as:** `assets/art/penthouse/penthouse_night_v1.webp`
```text
Using the attached image ONLY as the art style reference (same detailed pixel art technique, same crisp pixel size, same rich lighting), create a different room at the SAME camera scale (a doorway is about 27% of the image height).

Side-view 2D pixel art game background, flat orthographic "dollhouse cross-section" view looking straight at the back wall, 16:9. True pixel art: hard edges, no anti-aliasing, no blur.

Scene: a penthouse 96 floors up on Billionaires' Row in Manhattan at night. The ENTIRE back wall is floor-to-ceiling glass with thin black mullions, looking north over Central Park: the dark park stretching away with the reservoir reflecting light, lamp-lit winding paths, glowing apartment towers lining both sides of the park, and the city skyline fading into a purple-orange haze at the horizon. Interior layout from LEFT to RIGHT, all in front of the glass:
1. (3–7%) a private elevator door in dark bronze
2. (8–34%) a long, low charcoal modern sofa with a few pillows
3. (36–40%) a tall brass arc floor lamp curving over the sofa
4. (44–64%) a black concert grand piano with the lid open
5. (70–90%) a minimalist glass-and-steel desk with one slim glowing monitor and a sleek chair
6. (92–98%) a tall abstract bronze sculpture on a plinth

Room: a thin dark ceiling strip at the top, and a polished dark walnut floor that reflects the city lights and the window. The bottom 17% of the image is a flat, walkable floor, kept clear of furniture across the whole width.

Lighting: the room is dark and the furniture reads as silhouettes against the glowing city; warm light from the arc lamp and cool light from the monitor.

Mood: the summit. Quiet, vast, earned. Not horror. No people, no text, no UI, no watermark.
```

### A10 ☐ Penthouse in daytime
**Attach:** the penthouse from A9 · **Save as:** `assets/art/penthouse/penthouse_day_v1.webp`
```text
Using the attached image as the exact reference: keep the IDENTICAL composition, camera and every object in place. Same pixel art style, same pixel size, crisp hard edges.

Change only the time: a clear, bright afternoon. Through the glass: Central Park in full green with the reservoir sparkling blue, sunlit towers on both sides, and a pale blue sky with light haze. Inside, soft daylight shows the rich materials: walnut floor, bronze, black lacquer piano. The arc lamp is off. No people, no text, no UI, no watermark.
```

### A11 ☐ Suit outfit: walk sheet (penthouse)
**Attach:** `character/player_hoodie_sheet_v1.webp` · **Save as:** `assets/art/character/player_suit_sheet_v1.webp`
```text
Using the attached sprite sheet as the exact reference: SAME person (same face, hair now neatly styled, same body proportions), same art style, same pixel size, same scale, same 6 poses in the same order and spacing, same flat solid magenta (#FF00FF) background.

Change ONLY the outfit: a perfectly tailored charcoal suit, a white shirt with a dark burgundy tie, black oxford shoes, a gold watch. Calm, powerful expression: the top of the game.

Poses, left to right: 1 standing idle facing right, 2–5 a 4-frame walk cycle facing right, 6 facing the viewer with arms stretched overhead.

True pixel art: hard edges, no anti-aliasing, no blur, no shadows, no ground, no text, no watermark.
```

### A12 ☐ Suit outfit: sleep and sit poses
**Attach:** the suit sheet from A11 · **Save as:** `assets/art/character/player_suit_poses_v1.webp`
Same prompt as A3, with "same suit outfit" and "as if on a sofa".

---

## Phase B: property walkthroughs (the inspection houses)
Vacant, power off; the game adds the darkness and flashlight. Draw them **evenly lit, as dim daylight** so defects are visible where the light lands. Layout is the same for all three grades so defects line up: front door (0–4%) · living room with window (4–34%) · kitchen with sink, cabinets, stove and electrical panel (34–62%) · bedroom with window and closet (62–87%) · bathroom with tub and mirror (87–97%) · back door (97–100%). Thin interior walls with open doorways between rooms.

### B1 ☐ Rough house (D grade)
**Attach:** `studio/studio_day_v1.webp` (style) · **Save as:** `assets/art/walkthrough/house_D_v1.webp`
```text
Using the attached image ONLY as the art style reference (same pixel art technique, pixel size and gritty realism), create a side-view 2D pixel art game background, flat orthographic dollhouse cross-section, 16:9, SAME camera scale (a doorway is about 27% of image height). True pixel art, hard edges, no anti-aliasing.

Scene: the empty interior of a neglected, vacant single-story house in a rough neighborhood, dim flat daylight. One continuous cross-section, LEFT to RIGHT: the front door (0–4%); a living room with a boarded-up window and water-stained ceiling (4–34%); a kitchen with sagging cabinets, a rusty sink with exposed pipes under it, an old stove and a grey electrical panel on the wall (34–62%); a bedroom with a cracked window and a closet door off its hinges (62–87%); a small bathroom with a stained tub and a cracked mirror (87–97%); a back door (97–100%). Thin interior walls with open doorways between the rooms.

Details: peeling yellowed wallpaper, dirty worn floorboards, trash and debris in corners, cobwebs, faint wall cracks, an old furnace in the living room corner. The bottom 17% of the image is a flat, walkable floor kept clear across the whole width. Mood: sad but full of potential. Not horror. No people, no text, no UI, no watermark.
```

### B2 ☐ Working-class house (C grade)
**Save as:** `assets/art/walkthrough/house_C_v1.webp`. Same prompt as B1, but: *"a dated but lived-in vacant house on a working-class street: faded paint instead of peeling wallpaper, worn carpet in the living room and bedroom, 1990s oak kitchen cabinets, a beige electrical panel, curtains on the windows, a few scuffs and small stains. Tidy but tired."*

### B3 ☐ Solid house (B grade)
**Save as:** `assets/art/walkthrough/house_B_v1.webp`. Same prompt as B1, but: *"a clean, vacant house in a solid neighborhood: fresh neutral paint, wood floors, a white shaker kitchen, a modern electrical panel, blinds on the windows, only subtle signs of wear. Bright and sellable."*

---

## Phase C: starting homes (for life rolls that don't start in the studio)
Each needs a night and a day version, using the same left-to-right slots as the studio so all interactables line up: **bed (5–27%) · lamp or bulb (31%) · fridge/snacks (34–40%) · calendar (43%) · desk + laptop (44–63%) · corkboard (64–72%) · window (73–88%) · door (91–99%)**. Attach `studio/studio_night_v1.webp` as the style reference.

- ☐ **C1 Parents' spare room:** `assets/art/homes/parents_room_night_v1.webp` (+ `_day_`). *"A small suburban spare bedroom in the parents' house: a twin bed with a quilt, a nightstand lamp, a mini fridge, a family calendar, an old student desk with a laptop, a corkboard with family photos, a window onto a suburban street with a streetlamp, and a hallway door. Cozy, a little embarrassing, safe."*
- ☐ **C2 Aunt's couch:** `assets/art/homes/aunt_couch_night_v1.webp` (+ `_day_`). *"A cramped living room in a relative's apartment: a worn floral couch made up as a bed with a blanket and pillow, a floor lamp, a kitchenette counter with a fridge, a wall calendar, a TV tray used as a laptop desk, a corkboard with bills pinned up, a window with lace curtains, and the apartment door. Crowded, warm, temporary."*
- ☐ **C3 Downtown condo:** `assets/art/homes/condo_night_v1.webp` (+ `_day_`). *"A sleek modern downtown condo: a low platform bed, a designer pendant lamp, a stainless mini-bar fridge, a minimalist wall calendar, a floating desk with a laptop, a framed abstract print instead of a corkboard, floor-to-ceiling windows onto city lights, and a modern front door. Comfortable, a little sterile, privileged."*

For each **day** version, attach the night one and use the "keep the IDENTICAL composition… change only the time: late morning daylight…" prompt pattern.

---

## Phase D: life and motion (animation variant frames)
Attach the base image and ask for a near-identical copy with one small change. The game cycles the frames.

- ☐ **D1 Splash trees in the wind** (2 frames): attach `splash/splash_226_day_v1.webp` → *"IDENTICAL image in every way, except the tree leaves and branches are swayed slightly to the right as if by a gentle breeze, and a few leaves are drifting."* Save as `splash_226_day_wind_v1.webp`. Repeat for the evening version.
- ☐ **D2 Estate fountain and cypresses** (2 frames): attach the golden foyer → *"IDENTICAL image, except the fountain water sprays are at a different point in their arc and the cypress tips lean slightly left."* Save as `estate_foyer_goldenhour_wind_v1.webp`.
- ☐ **D3 Studio rain** (2 frames): attach `studio_night_v1.webp` → *"IDENTICAL image, except it is raining outside: rain streaks and droplets on the window glass, wet reflections on the street below."* Save as `studio_night_rain_v1.webp` and `studio_night_rain2_v1.webp` (the droplets in different positions).

---

## Phase G: interaction animations (every action gets one)
Every interactable plays a short animation: you walk to the object, the animation plays, then the action happens (menu, sleep, time skip, and so on). These are **sprite strips**: a single row of 3–6 frames on magenta, in the outfit for the stage where the action happens. Actions that exist in every stage (door, computer, phone, sleep) are needed for **every outfit**.

> Image generators drift between frames, so ask for **3–5 key frames**. The game holds and blends between them (an ease-in, a pause on the key pose, an ease-out). If one frame comes out wrong, regenerate just that strip.

### Strip prompt template
**Attach:** the outfit's walk sheet (for example `character/player_hoodie_sheet_v1.webp`) · **Save as:** `assets/art/character/anim/<outfit>_<action>_v1.webp`
```text
Using the attached sprite sheet as the exact character, outfit and style reference (same person, same outfit, same pixel size, same scale, same colors), create ONE horizontal row of {N} animation frames on a flat solid magenta (#FF00FF) background, evenly spaced, all standing on the same baseline, strict side view facing RIGHT:

{FRAME LIST}

Keep the character's size, proportions and position consistent from frame to frame so the frames play smoothly as an animation. Draw any prop listed as part of the frame only if it is held by the character; do NOT draw furniture, walls or the floor. True pixel art: hard edges, no anti-aliasing, no blur, no shadows, no ground, no text, no numbers, no watermark.
```

### G1 ☐ Universal actions: every outfit (hoodie, bomber, blazer, turtleneck, suit)
| Action | Save as `…/anim/<outfit>_` | Frames ({N} and {FRAME LIST}) |
|---|---|---|
| **Open a door and step out** | `door_v1` | 4: 1 reaching toward a doorknob at waist height · 2 hand on the knob, turning · 3 pulling the door-side arm back, leaning into the step · 4 mid-step forward, body half turned away from the viewer |
| **Sit at a computer and type** | `computer_v1` | 4: 1 lowering onto a chair (no chair drawn), knees bending · 2 seated upright, hands at keyboard height · 3 seated typing, one hand raised · 4 seated typing, the other hand raised |
| **Use the phone** | `phone_v1` | 3: 1 pulling a phone from a pocket · 2 holding the phone at chest height, looking down at the glowing screen · 3 thumb tapping, slight smile |
| **Lie down to sleep** (improved) | `liedown_v1` | 5: 1 sitting on the edge of a bed (no bed), stretching and yawning · 2 leaning back on one elbow · 3 swinging legs up, half reclined · 4 lying flat on the back, pulling a blanket up (blanket drawn, held in hands) · 5 lying flat asleep under the blanket, eyes closed |
| **Sleeping** (loop) | `sleep_loop_v1` | 3: 1 asleep on the back, chest down · 2 asleep, chest slightly raised (breathing) · 3 asleep turned slightly onto one side, one arm over the head |
| **Wake up** | `wake_v1` | 4: 1 eyes opening while lying down · 2 sitting up abruptly, rubbing eyes · 3 sitting on the edge, groggy, hand on neck · 4 standing up, starting to stretch |
| **Flashlight walk** (walkthroughs) | `flashlight_walk_v1` | 4: a 4-frame walk cycle with one arm held forward pointing a small flashlight (the flashlight is drawn, its beam is NOT drawn) |

### G2 ☐ Studio actions (hoodie)
| Action | Save as `hoodie_` | Frames |
|---|---|---|
| **Pull the light cord** | `pullcord_v1` | 4: 1 looking up, reaching one arm straight up · 2 hand closed around a short cord overhead (cord drawn in the hand) · 3 tugging down, elbow bent · 4 arm dropping, relaxed |
| **Open the mini fridge** | `fridge_v1` | 4: 1 crouching slightly, reaching low · 2 pulling a small door toward the viewer (door not drawn, pulling motion) · 3 peering down into the fridge, disappointed · 4 standing up holding a single egg |
| **Check the calendar** | `calendar_v1` | 3: 1 stepping close, looking at the wall · 2 lifting a page with one hand · 3 hand on hip, sighing |
| **Pin a note on the corkboard** | `corkboard_v1` | 3: 1 holding a small index card · 2 pressing it onto the wall with a thumb · 3 stepping back, arms crossed, looking at it |
| **Peek through the blinds** | `blinds_v1` | 3: 1 raising two fingers to eye level · 2 fingers spreading two blind slats apart, eyes peeking (slats NOT drawn) · 3 letting go, turning away |

### G3 ☐ Suite 2B actions (bomber)
| Action | Save as `bomber_` | Frames |
|---|---|---|
| **Water cooler: fill and drink** | `watercooler_v1` | 5: 1 taking a small paper cup from a holder · 2 bending slightly, holding the cup low at a tap · 3 standing, cup filled · 4 tilting the head back, drinking · 5 crumpling the paper cup, satisfied |
| **Write on the whiteboard** | `whiteboard_v1` | 4: 1 uncapping a marker · 2 writing high on the wall, arm raised · 3 writing lower, arm across the body · 4 stepping back, tapping the marker on the chin, thinking |
| **Search the filing cabinet** | `files_v1` | 4: 1 pulling a drawer out (drawer not drawn, pulling motion) · 2 flipping through folders with both hands · 3 pulling out one folder · 4 reading the folder, eyebrows raised |
| **Look at the bandit sign** | `pointsign_v1` | 3: 1 looking up at the wall · 2 pointing at it with one hand, grinning · 3 fist pump, determined |
| **Couch lie down / wake** | use G1 `liedown`, `sleep_loop`, `wake` in the bomber outfit | |

### G4 ☐ Corner suite actions (blazer)
| Action | Save as `blazer_` | Frames |
|---|---|---|
| **Pull a book from the shelf** | `bookshelf_v1` | 4: 1 reaching up to a high shelf · 2 sliding out a thick book · 3 opening the book, reading · 4 closing it with a satisfied nod |
| **Banker's lamp chain** | `lampchain_v1` | 3: 1 leaning over a desk, reaching low · 2 pinching a small pull chain (chain in the fingers) · 3 tugging, the hand coming back up |
| **Admire the framed deed** | `deed_v1` | 3: 1 looking up at the wall, hands in pockets · 2 straightening a picture frame with one hand (frame NOT drawn, only the hand motion) · 3 small proud smile |
| **Water the fiddle-leaf fig** | `waterplant_v1` | 4: 1 holding a small brass watering can · 2 tilting the can, pouring low · 3 still pouring · 4 setting the can down |
| **Look out the window** | `lookout_v1` | 3: 1 walking up, slowing · 2 standing still, hands clasped behind the back · 3 same pose, head tilted slightly up |

### G5 ☐ Estate actions (turtleneck)
| Action | Save as `turtleneck_` | Frames |
|---|---|---|
| **Climb the staircase** | `stairs_up_v1` | 4: a 4-frame walk-up cycle facing LEFT, stepping up (knee raised high on alternate frames), one hand resting on a railing at hip height (railing NOT drawn) |
| **Open the grand double doors** | `grand_doors_v1` | 4: 1 both hands reaching forward at chest height · 2 pushing both arms forward, leaning in · 3 arms spread wide as if doors swing open · 4 stepping through, chin up |
| **Smell the roses** | `flowers_v1` | 3: 1 leaning toward something at waist height · 2 eyes closed, inhaling · 3 straightening up, content |
| **Admire the bust** | `bust_v1` | 3: 1 hand on chin, studying something at head height · 2 head tilted, skeptical · 3 shrug |

### G6 ☐ Penthouse actions (suit)
| Action | Save as `suit_` | Frames |
|---|---|---|
| **Elevator button and exit** | `elevator_v1` | 4: 1 pressing a wall button with one finger · 2 adjusting the cuffs while waiting · 3 stepping forward · 4 turning away mid-step |
| **Play the piano** | `piano_v1` | 4: 1 sitting down on a bench (no bench drawn), flipping the jacket tails · 2 seated, hands raised over keys (keys NOT drawn) · 3 hands down, head bowed · 4 hands raised, head tilted back, eyes closed |
| **Arc lamp switch** | `lampswitch_v1` | 3: 1 reaching toward a switch at waist height · 2 clicking it · 3 hand back |
| **The view** | use the G4 `lookout` frames in the suit outfit | |

### Engine plan (Claude)
- Every interactable gets an **anchor x** and an **animation id**. Pressing E walks you to the anchor, faces the object, plays the strip, then does the action.
- Strips load through the same magenta cleanup as the walk sheets. Frame timings, hold frames and a small shake or sound on the key frame make 3–5 AI frames feel smooth.
- Scenery animates too (a door swinging open, the cord bobbing, the fridge light, the water glugging in the cooler jug). That's drawn in code over the background until painted variant frames exist.
- Until a strip exists, the current fallback stays: walk up and a quick bob.

---

## Phase E: characters and UI (nice to have)
- ☐ **E1 Tenant and NPC portraits:** attach the hoodie sheet (style) · *"A grid of 8 head-and-shoulders pixel art portraits on a flat magenta (#FF00FF) background, same pixel style, diverse ages, genders and ethnicities, friendly neutral expressions, everyday clothes. Each portrait in its own square, evenly spaced, no text."* Save as `assets/art/ui/portraits_tenants_v1.webp`.
- ☐ **E2 Recurring characters:** the same format with 4 portraits: *"Mike, a scruffy middle-aged handyman in a cap; Vince Marlow, a slick slumlord in a gold chain and leather jacket; Keiko Hart, a sharp syndicator in a tailored grey suit; a kind older landlord in a cardigan."* Save as `assets/art/ui/portraits_cast_v1.webp`.
- ☐ **E3 Moving truck:** a side-view pixel art moving truck with "JUNT MOVERS" and boxes on the roof, on magenta. Save as `assets/art/ui/moving_truck_v1.webp`.

---

## Phase F: store page (itch.io now, Steam later)
- ☐ **F1 itch.io cover, 630×500:** attach `splash/splash_226_evening_v1.webp` + the hoodie sheet · *"Pixel art key art: the young investor in the olive hoodie standing on the sidewalk in front of this house at sunset, looking up at a glowing skyline in the distance, room at the top for a title. Warm, hopeful, cinematic. No text."* Save as `assets/art/store/itch_cover_v1.png`.
- ☐ **F2 Steam main capsule, 616×353:** same scene, wide crop, room for the logo on the left. Save as `assets/art/store/steam_capsule_main_v1.png`.
- ☐ **F3 Steam header, 460×215:** same, tighter crop. Save as `assets/art/store/steam_header_v1.png`.
- ☐ **F4 Library hero, 3840×1240** (the text-free wide background) plus the logo. Later, once the capsule art is locked.
- ☐ **F5 Screenshots:** captured from the game, not generated.

---

### Asset index (already done ✅)
splash day/evening · studio night/day · 2B night/day · corner suite golden hour · estate golden/night/exterior · hoodie sheet + poses · bomber sheet + poses
