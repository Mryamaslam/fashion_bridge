import { NextResponse } from "next/server";
import { getInquiries } from "@/lib/services/data";
import { requireAdmin } from "@/lib/supabase/require-admin";

export async function GET() {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const inquiries = await getInquiries();
  return NextResponse.json(inquiries);
}
