import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const stashDir = path.join(root, ".github-pages-stash");

const moves = [
  ["src/app/api", "api"],
  ["src/middleware.ts", "middleware.ts"],
];

function copyRecursive(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyRecursive(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

function removePath(relPath) {
  const target = path.join(root, relPath);
  if (!fs.existsSync(target)) return;
  fs.rmSync(target, { recursive: true, force: true });
}

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

  copyRecursive(from, to);
  removePath(fromRel);
  console.log(`Stashed ${fromRel} → .github-pages-stash/${stashName}`);
}

for (const [fromRel] of moves) {
  const from = path.join(root, fromRel);
  if (fs.existsSync(from)) {
    console.error(`ERROR: could not remove ${fromRel} before static export`);
    process.exit(1);
  }
}

console.log("Static export prep OK — no API routes or middleware in src/");
