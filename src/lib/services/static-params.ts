import { createClient } from "@supabase/supabase-js";
import { getSupabaseAnonKey, getSupabaseUrl, isSupabaseConfigured } from "@/lib/supabase/env";
import { mockProducts, mockCollections } from "@/lib/data/mock";

function buildTimeClient() {
  if (!isSupabaseConfigured()) return null;
  return createClient(getSupabaseUrl(), getSupabaseAnonKey());
}

/** Slugs for static export — Supabase at build time, mock fallback */
export async function getProductSlugsForExport() {
  const supabase = buildTimeClient();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("products")
        .select("slug")
        .eq("status", "active");
      if (!error && data?.length) {
        return data.map((p) => ({ slug: p.slug }));
      }
    } catch {
      /* fall through */
    }
  }
  return mockProducts.filter((p) => p.status === "active").map((p) => ({ slug: p.slug }));
}

export async function getCollectionSlugsForExport() {
  const supabase = buildTimeClient();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("collections")
        .select("slug")
        .eq("status", "active");
      if (!error && data?.length) {
        return data.map((c) => ({ slug: c.slug }));
      }
    } catch {
      /* fall through */
    }
  }
  return mockCollections.map((c) => ({ slug: c.slug }));
}
