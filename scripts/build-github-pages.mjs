import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

let exitCode = 1;

try {
  await import("./prepare-github-pages.mjs");

  const nextDir = path.join(process.cwd(), ".next");
  if (fs.existsSync(nextDir)) {
    fs.rmSync(nextDir, { recursive: true, force: true });
  }

  const env = {
    ...process.env,
    GITHUB_PAGES: "true",
    NEXT_PUBLIC_STATIC_EXPORT: "true",
    NEXT_PUBLIC_SITE_URL: "https://mryamaslam.github.io/fashion_bridge",
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY:
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
      "",
  };

  const result = spawnSync("npx", ["next", "build"], {
    stdio: "inherit",
    env,
    shell: true,
  });

  exitCode = result.status ?? 1;
} finally {
  await import("./restore-github-pages.mjs");
}

process.exit(exitCode);
