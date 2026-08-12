import { NextResponse } from "next/server";
import { getOrders } from "@/lib/services/data";
import { requireAdmin } from "@/lib/supabase/require-admin";

export async function GET() {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const orders = await getOrders();
  return NextResponse.json(orders);
}
