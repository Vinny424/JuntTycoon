# JuntTycoon asset style specification

Reference priority: actual approved studio night/day and Suite 2B night/day backgrounds first; character sheets establish character identity. Do not use rejected food concepts as style anchors.

## Observed style
- Detailed illustrated pixel art, between coarse retro sprites and pixel-painted backgrounds. Not photorealism and not minimalist 8-bit icons.
- Recognizable silhouettes, stepped contours, broad shadow masses and selective small pixel clusters. Texture describes worn materials, rather than covering every surface with random noise.
- Studio: yellowed cream appliances, brown wallpaper and wood, dusty olive fabrics; subdued warm midtones, near-black brown shadows, selective cool monitor highlights and amber window light.
- 2B: scuffed purple-gray walls, plum fabric, dark blue-gray furniture; teal and magenta accents primarily belong to light sources. Daytime retains worn surfaces but lowers the neon influence.
- Objects have modest depth: front/three-quarter views, a few discrete planes and restrained highlights. Food should not resemble glossy product photography.
- Match at the final 640x360 gameplay scale. Large generated images are not evidence of game-ready pixel density. Review items placed on actual shelves at approximately 24-48 game pixels, with larger containers allowed up to 60 pixels wide.

## Reference roles for food generation
1. Studio night/day image: material rendering, contour treatment and muted color vocabulary. Do not reproduce the room.
2. Approved empty fridge interior: shelf perspective and upper-right illumination. Do not reproduce the fridge.
3. Optional approved food sprite: pixel density and object scale, once one has passed review.

## Exact food generation brief
Create isolated inventory food sprites for JuntTycoon that belong inside the attached worn studio mini fridge. Match the detailed illustrated pixel-art backgrounds, not photographic food and not flat vector icons. Give each object a readable stepped silhouette, a small number of deliberate color clusters, two main shadow planes and one restrained highlight plane. Add only a few pixels of wear where appropriate. No fine photographic grain or smoothly shaded curvature. No glow, halo, bloom, floating shadow, ground plane, environment or baked room lighting gradients. Use muted local colors with a slight warm upper-right highlight and darker lower-left edges; keep shadows soft in value but hard-edged in pixel shape. Preserve appetizing readable food forms without advertising-style gloss.

View: shallow three-quarter front view, just enough top surface visible to sit convincingly on the fridge shelves. Fixed camera orientation across the set. Each object occupies a separate cell with at least 15% empty margin on every side. Transparent background with no matte contamination. No text, brands, labels, UI, selection borders or watermark. Keep a consistent logical pixel density across all items. Render only the object and any packaging it physically contains.

Item specifications:
- Apple: modest red apple, slightly asymmetrical, short brown stem and small muted green leaf; one small angular highlight, no glossy white spot or fine pores.
- Yogurt: small cream cup with muted blue band and dull foil lid; simple flat planes; no writing.
- Leftovers: squat translucent tub with a simple lid; rice represented by a few off-white clusters, vegetables by sparse green/orange clusters; no individually rendered rice grains.
- Cheese: one pale yellow stick in a partly peeled wrapper, readable at small size; a few wrapper highlights, no glassy shine.
- Water: short blue-capped bottle, simplified ribs, large transparent regions with a few blue-gray edge pixels; no detailed refraction or glossy product-lighting streaks.
- Mustard: squat partly used ochre-yellow squeeze bottle and brown cap; subtle wear, no label text.

## Scenery lettering
2B whiteboard and WE BUY HOUSES sign need a separate text pass. Preserve existing boards, frames, tape, angle and lighting. Use intentionally authored legible typography rather than asking an image model to invent small equations. Suggested board content: DEAL CHECK; RENT - COSTS = NOI; CAP = NOI / PRICE; BUY > REPAIR > RENT. Sign must read exactly WE BUY / HOUSES. Do not add random pseudo-writing.

## Approval and integration
Show every generated draft before integration. Check pixel density at native game size, perspective on actual shelves, silhouette readability, alpha edges and absence of halos. Keep unapproved drafts out of the production asset directory. The first rejected food sheet was too photorealistic; simply making the next sheet extremely chunky is not sufficient to match the backgrounds.