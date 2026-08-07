import { IS_STATIC_EXPORT } from "@/lib/constants/static-export";

/** Must match `basePath` in next.config.ts for GitHub Pages */
const GITHUB_PAGES_BASE = "/fashion_bridge";

/** Prefix local public assets with the GitHub Pages base path when statically exported */
export function resolveAssetPath(src: string): string {
  if (!src.startsWith("/") || src.startsWith("//")) return src;
  if (/^https?:\/\//i.test(src)) return src;
  if (IS_STATIC_EXPORT && !src.startsWith(GITHUB_PAGES_BASE)) {
    return `${GITHUB_PAGES_BASE}${src}`;
  }
  return src;
}
