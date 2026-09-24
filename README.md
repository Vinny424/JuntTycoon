# JuntTycoon

A 2D pixel-art real estate tycoon game. You roll a random upbringing, then climb from a run-down studio apartment to a Billionaires' Row penthouse by learning, working, buying, fixing, renting and refinancing real estate.

Shipping as an HTML5 game on itch.io now (Steam later). A walkable 3D version comes after the 2D game is complete.

## Play
Build it (below), then open `dist/index.html` in Chrome or Edge. It's one self-contained file with all art and fonts embedded, and it works offline.

- **Controls:** A/D or ←/→ walk · E interact · P phone · Esc close
- **Dev tools:** add `?dev` to the URL or press the backtick key (`` ` ``) to show the stage switcher, shader and market toggles, and restart.

## Build
The game is written as small modules in `src/` plus real image and font files in `assets/`. The build stitches them into one `dist/index.html`.

| Where | Command |
|---|---|
| Windows | `powershell -ExecutionPolicy Bypass -File build.ps1` (add `-Zip` for the itch.io upload zip) |
| Anywhere with Node 18+ (cloud sessions) | `node build.mjs` |

Both produce the same file.

## Layout
```
index.template.html   page shell, CSS and embedded fonts; @@SRC@@ is where src/ goes
src/NN-name.js        game modules, concatenated in filename order
assets/art/<stage>/   painted backgrounds, sprite sheets, splash art (.webp)
assets/fonts/         woff2 fonts (embedded so the game works offline)
ROADMAP.md            design decisions, systems, art status, what's next
ASSET_PROMPTS.md      every remaining art prompt, with file names and folders
```

## Conventions
- **Modules build on each other.** A later module wraps an earlier function instead of editing it, e.g. `const _prev=newDay; newDay=function(d){ _prev(d); … }`. To add a feature, add a new file with the next number.
- **Assets are referenced with a build token, never pasted in as base64:** `'@@asset:image/webp@assets/art/studio/studio_night_v1.webp@@'`. The build swaps it for a data URL.
- **Adding art:** put the file in `assets/art/<stage>/`, reference it with the token, and rebuild.
- `dist/` is build output and isn't committed.
