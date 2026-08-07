/** Supabase URL from project Settings → API */
export function getSupabaseUrl(): string {
  return process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
}

/** Publishable (sb_publishable_...) or legacy anon JWT key */
export function getSupabaseAnonKey(): string {
  return (
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
    ""
  );
}

/** Secret (sb_secret_...) or legacy service_role JWT key — server only */
export function getSupabaseServiceKey(): string {
  return (
    process.env.SUPABASE_SECRET_KEY ??
    process.env.SUPABASE_SERVICE_ROLE_KEY ??
    ""
  );
}

export function isSupabaseConfigured(): boolean {
  const url = getSupabaseUrl();
  const key = getSupabaseAnonKey();
  return !!(url && key && !url.includes("your_supabase") && !url.includes("YOUR_PROJECT"));
}
