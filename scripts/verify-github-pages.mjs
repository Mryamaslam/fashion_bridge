import fs from "node:fs";
import path from "node:path";

const outDir = path.join(process.cwd(), "out");
const noJekyll = path.join(outDir, ".nojekyll");

if (!fs.existsSync(outDir)) {
  console.error("Build output folder missing: out/");
  process.exit(1);
}

fs.writeFileSync(noJekyll, "");
console.log("Created out/.nojekyll");

const indexCandidates = [
  path.join(outDir, "index.html"),
  path.join(outDir, "fashion_bridge", "index.html"),
];

const found = indexCandidates.find((p) => fs.existsSync(p));
if (!found) {
  console.error("No index.html found in export output:", indexCandidates.join(", "));
  process.exit(1);
}

console.log("Static export OK:", found);
