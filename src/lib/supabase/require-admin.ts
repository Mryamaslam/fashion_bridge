import { NextResponse } from "next/server";
import { isSupabaseConfigured } from "@/lib/supabase/client";

/** Guard for /api/admin/** routes — mirrors the /admin/* page redirect in middleware.ts */
export async function requireAdmin() {
  if (!isSupabaseConfigured()) return null;

  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}
