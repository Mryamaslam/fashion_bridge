import { isSupabaseConfigured } from "@/lib/supabase/env";
import { getAllProducts, getAllCollections } from "@/lib/services/data";
import { mockProducts, mockCollections } from "@/lib/data/mock";

/** Slugs for static export — Supabase at build time, mock fallback */
export async function getProductSlugsForExport() {
  if (isSupabaseConfigured()) {
    try {
      const products = await getAllProducts();
      const slugs = products.filter((p) => p.status === "active").map((p) => ({ slug: p.slug }));
      if (slugs.length) return slugs;
    } catch {
      /* fall through to mock */
    }
  }
  return mockProducts.filter((p) => p.status === "active").map((p) => ({ slug: p.slug }));
}

export async function getCollectionSlugsForExport() {
  if (isSupabaseConfigured()) {
    try {
      const collections = await getAllCollections();
      const slugs = collections
        .filter((c) => c.status === "active")
        .map((c) => ({ slug: c.slug }));
      if (slugs.length) return slugs;
    } catch {
      /* fall through */
    }
  }
  return mockCollections.map((c) => ({ slug: c.slug }));
}
