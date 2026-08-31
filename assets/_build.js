// Prepares the generated art for the game.
//   1. keys the baked checkerboard out of bg-mid into real alpha
//   2. cools the husk to blue-ash so "jump the stone / burn the husk" reads instantly
//   3. downscales everything — the originals total 7.6 MB, far too heavy for a web game
// Originals are preserved in assets/_source/.
// sharp lives in the ALVOR project; this script is a one-off build tool.
const sharp = require("C:/Users/ivar/Documents/NERD/SCRIPTS DE TRABALHO/ALVOR-RESTAURANTE/node_modules/sharp");
const fs = require("fs");
const path = require("path");

const DIR = "C:/Users/ivar/Documents/NERD/SCRIPTS DE TRABALHO/dronner/assets";
const SRC = path.join(DIR, "_source");

async function keyCheckerboard(inFile, outFile, width) {
  const img = sharp(inFile).ensureAlpha();
  const { data, info } = await img.raw().toBuffer({ resolveWithObject: true });
  const { width: W, height: H, channels: C } = info;

  for (let i = 0; i < data.length; i += C) {
    const r = data[i], g = data[i + 1], b = data[i + 2];
    const spread = Math.max(r, g, b) - Math.min(r, g, b);
    const lum = (r + g + b) / 3;
    // neutral + very light === the checkerboard the generator baked in
    if (spread <= 4 && lum >= 236) {
      data[i + 3] = 0;
    } else if (spread <= 6 && lum >= 210) {
      // feather the boundary so edges don't turn into hard stair-steps
      data[i + 3] = Math.round(255 * (1 - (lum - 210) / 26));
    }
  }

  await sharp(data, { raw: { width: W, height: H, channels: C } })
    .resize({ width, withoutEnlargement: true })
    .png({ compressionLevel: 9 })
    .toFile(outFile);
}

async function main() {
  fs.mkdirSync(SRC, { recursive: true });

  const files = ["dragon.png", "husk.png", "stone.png", "flame.png", "bg-far.png", "bg-mid.png"];
  for (const f of files) {
    const from = path.join(DIR, f), to = path.join(SRC, f);
    if (!fs.existsSync(to)) fs.copyFileSync(from, to);
  }

  const report = [];
  const note = async (name, file) => {
    const m = await sharp(file).metadata();
    report.push(`  ${name.padEnd(14)} ${String(m.width).padStart(4)}x${String(m.height).padEnd(4)}  ` +
                `${(fs.statSync(file).size / 1024).toFixed(0).padStart(4)} KB  alpha=${m.hasAlpha}`);
  };

  // sprites — plain downscale, alpha already real
  const plain = [["dragon.png", 660], ["stone.png", 340], ["flame.png", 420]];
  for (const [f, w] of plain) {
    await sharp(path.join(SRC, f)).resize({ width: w }).png({ compressionLevel: 9 })
      .toFile(path.join(DIR, f));
    await note(f, path.join(DIR, f));
  }

  // husk — cooled to blue ash. Burning something already made of fire made no
  // sense, and stone vs husk needs to read in a third of a second.
  await sharp(path.join(SRC, "husk.png"))
    .resize({ width: 320 })
    .modulate({ hue: 165, saturation: 0.42, brightness: 0.82 })
    .png({ compressionLevel: 9 })
    .toFile(path.join(DIR, "husk.png"));
  await note("husk.png", path.join(DIR, "husk.png"));

  // backdrop — no alpha needed, it sits behind everything
  await sharp(path.join(SRC, "bg-far.png")).resize({ width: 1880 })
    .png({ compressionLevel: 9 }).toFile(path.join(DIR, "bg-far.png"));
  await note("bg-far.png", path.join(DIR, "bg-far.png"));

  await keyCheckerboard(path.join(SRC, "bg-mid.png"), path.join(DIR, "bg-mid.png"), 1880);
  await note("bg-mid.png", path.join(DIR, "bg-mid.png"));

  console.log(report.join("\n"));
  const total = files.reduce((s, f) => s + fs.statSync(path.join(DIR, f)).size, 0);
  const before = files.reduce((s, f) => s + fs.statSync(path.join(SRC, f)).size, 0);
  console.log(`\n  antes: ${(before / 1024 / 1024).toFixed(1)} MB   depois: ${(total / 1024 / 1024).toFixed(2)} MB`);
}

main().catch(e => { console.error("FALHOU:", e.message); process.exit(1); });
