import type { NextConfig } from "next";

const isGithubPages = process.env.GITHUB_PAGES === "true";
const repoBase = "/fashion_bridge";

const remotePatterns = [
  // Admins can paste product image/video URLs from anywhere, so any HTTPS
  // host is allowed here — Next.js otherwise hard-crashes on an
  // unrecognized hostname instead of just failing to load the image.
  { protocol: "https" as const, hostname: "**" },
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
