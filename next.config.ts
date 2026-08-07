import type { NextConfig } from "next";

const isGithubPages = process.env.GITHUB_PAGES === "true";
const repoBase = "/fashion_bridge";

const remotePatterns = [
  { protocol: "https" as const, hostname: "images.unsplash.com" },
  { protocol: "https" as const, hostname: "*.supabase.co" },
];

const nextConfig: NextConfig = isGithubPages
  ? {
      output: "export",
      basePath: repoBase,
      assetPrefix: `${repoBase}/`,
      trailingSlash: true,
      images: { unoptimized: true, remotePatterns },
    }
  : {
      images: { remotePatterns },
    };

export default nextConfig;
