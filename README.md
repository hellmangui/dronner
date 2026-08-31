# Dronner

A little red dragon runs. Stones block the path, husks stand in it. Jump one, burn the other.

**[▸ Play](https://hellmangui.github.io/dronner/)** — or clone and open `index.html`. No build, no dependencies.

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

One HTML file. No dependencies, no build step, no sprite sheets — the dragon, the ridges and the husks are all drawn as canvas paths, so the whole thing stays under 16 KB and scales to any screen.

Best score is kept in `localStorage`, wrapped in try/catch so private windows don't break the game.

Fonts are Archivo Black and IBM Plex. Everything else is math.

## Running it locally

Open `index.html` in a browser. That's it.

---

Built by [@hellmangui](https://github.com/hellmangui).
