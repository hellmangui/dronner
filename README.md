# Dronner

A little red dragon runs. Stones block the path, husks stand in it. Jump one, burn the other.

**[▸ Play](https://hellmangui.github.io/dronner/)** — or clone and open `index.html`. No install, no runtime dependencies.

---

## Controls

| | |
|---|---|
| `Space` `↑` `W` | Jump |
| `↓` `S` `X` | Breathe fire |
| `R` | Restart |

On touch devices, two buttons sit under the canvas.

## Why two inputs

The jump peaks at 114 pixels. Stones reach 64, husks reach 128 — so a husk can never be cleared by jumping, only burned. Neither input is optional, and that is the whole design.

## How it's built

The game is one HTML file plus six illustrated WebP assets: the dragon, husk, stone, flame and two parallax layers. Canvas handles rendering, animation, transforms and collision; there are no sprite sheets or runtime libraries.

The high-resolution PNG sources are intentionally kept out of git. `assets/_build.js` uses Sharp from the local ALVOR project to remove the generated checkerboard, tune the husk palette, resize the artwork and produce the tracked game assets. That script is a maintainer tool, not part of running the game.

Best score is kept in `localStorage`, wrapped in try/catch so private windows don't break the game.

Fonts are Archivo Black and IBM Plex. Everything else is math.

## Running it locally

Open `index.html` in a browser. The asset paths are relative, so no local server is required.

---

Built by [@hellmangui](https://github.com/hellmangui).
