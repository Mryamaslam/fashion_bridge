import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const stashDir = path.join(root, ".github-pages-stash");

const restores = [
  ["api", "src/app/api"],
  ["middleware.ts", "src/middleware.ts"],
];

for (const [stashName, toRel] of restores) {
  const from = path.join(stashDir, stashName);
  const to = path.join(root, toRel);

  if (!fs.existsSync(from)) {
    continue;
  }

  if (fs.existsSync(to)) {
    console.log(`Skip restore (already exists): ${toRel}`);
    continue;
  }

  fs.mkdirSync(path.dirname(to), { recursive: true });
  fs.renameSync(from, to);
  console.log(`Restored .github-pages-stash/${stashName} → ${toRel}`);
}
