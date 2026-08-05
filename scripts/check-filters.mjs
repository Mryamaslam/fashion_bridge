import { readFileSync } from "fs";

const site = readFileSync("./src/lib/constants/site.ts", "utf8");
const mock = readFileSync("./src/lib/data/mock.ts", "utf8");

const colors = [...site.match(/export const COLORS = \[([\s\S]*?)\] as const/)[1].matchAll(/"([^"]+)"/g)].map((m) => m[1]);
const sizes = [...site.match(/export const SIZES = \[([\s\S]*?)\] as const/)[1].matchAll(/"([^"]+)"/g)].map((m) => m[1]);

const colorHits = Object.fromEntries(colors.map((c) => [c, 0]));
const sizeHits = Object.fromEntries(sizes.map((s) => [s, 0]));

const map = {
  APPAREL: ["XS", "S", "M", "L", "XL", "XXL"],
  APPAREL_PLUS: ["S", "M", "L", "XL", "XXL", "3XL"],
  WAIST: ["28", "30", "32", "34", "36", "38"],
  WAIST_WIDE: ["28", "30", "32", "34", "36", "38", "40", "42"],
  WAIST_WOMEN: ["24", "26", "28", "30", "32", "34"],
  SHOE: ["37", "39", "41", "43", "44", "45"],
  SHOE_FULL: ["36", "37", "39", "41", "43", "44", "45"],
};

const prodBlocks = [...mock.matchAll(/\{ id: "[^"]+",[\s\S]*?updated_at: "[^"]+" \}/g)];
let n = 0;
for (const b of prodBlocks) {
  const t = b[0];
  if (!t.includes('status: "active"')) continue;
  n++;
  const cols = t.match(/colors: \[([^\]]*)\]/);
  if (cols) {
    for (const c of [...cols[1].matchAll(/"([^"]+)"/g)].map((m) => m[1])) {
      if (c in colorHits) colorHits[c]++;
    }
  }
  const szMatch = t.match(/sizes: (\[[^\]]*\]|[A-Z_]+)/);
  let sizeList = [];
  if (szMatch) {
    const raw = szMatch[1].trim();
    if (raw.startsWith("[")) sizeList = [...raw.matchAll(/"([^"]+)"/g)].map((m) => m[1]);
    else sizeList = map[raw] || [];
  }
  for (const s of sizeList) if (s in sizeHits) sizeHits[s]++;
}

console.log("products", n);
console.log("COLORS", colorHits);
console.log("SIZES", sizeHits);
console.log("missing colors", colors.filter((c) => !colorHits[c]));
console.log("missing sizes", sizes.filter((s) => !sizeHits[s]));
