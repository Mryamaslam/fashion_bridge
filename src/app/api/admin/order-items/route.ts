import { NextResponse } from "next/server";
import { getAllOrderItems } from "@/lib/services/data";
import { requireAdmin } from "@/lib/auth/require-admin";

export async function GET() {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const items = await getAllOrderItems();
  return NextResponse.json(items);
}
