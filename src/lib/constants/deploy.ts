/** GitHub repository */
export const GITHUB_REPO = "https://github.com/Mryamaslam/fashion_bridge";

/** GitHub Pages / preview live URL (.io) — set as repo homepage in GitHub settings */
export const GITHUB_LIVE_URL = "https://mryamaslam.github.io/fashion_bridge";

/** Resolve public site URL: env → Vercel auto URL → GitHub .io fallback */
export function getSiteUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  if (process.env.NODE_ENV === "production") {
    return GITHUB_LIVE_URL;
  }
  return "http://localhost:3000";
}
