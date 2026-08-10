import { NextResponse } from "next/server";
import { getDashboardStats } from "@/lib/services/data";
import { requireAdmin } from "@/lib/supabase/require-admin";

export async function GET() {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const stats = await getDashboardStats();
  return NextResponse.json(stats);
}
