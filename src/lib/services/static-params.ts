import { mockProducts, mockCollections } from "@/lib/data/mock";

/** Slugs for the GitHub Pages static export — always the demo catalog. */
export async function getProductSlugsForExport() {
  return mockProducts.filter((p) => p.status === "active").map((p) => ({ slug: p.slug }));
}

export async function getCollectionSlugsForExport() {
  return mockCollections.map((c) => ({ slug: c.slug }));
}
