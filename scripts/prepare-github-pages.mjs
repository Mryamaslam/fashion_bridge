import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const stashDir = path.join(root, ".github-pages-stash");

const moves = [
  ["src/app/api", "api"],
  ["src/middleware.ts", "middleware.ts"],
];

if (!fs.existsSync(stashDir)) {
  fs.mkdirSync(stashDir, { recursive: true });
}

for (const [fromRel, stashName] of moves) {
  const from = path.join(root, fromRel);
  const to = path.join(stashDir, stashName);

  if (!fs.existsSync(from)) {
    console.log(`Skip (not found): ${fromRel}`);
    continue;
  }

  if (fs.existsSync(to)) {
    fs.rmSync(to, { recursive: true, force: true });
  }

  fs.renameSync(from, to);
  console.log(`Stashed ${fromRel} → .github-pages-stash/${stashName}`);
}
