import { NextResponse } from "next/server";
import { mockInquiries } from "@/lib/data/mock";
import { requireAdmin } from "@/lib/supabase/require-admin";
import type { InquiryStatus } from "@/types";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  try {
    const { id } = await params;
    const body = await request.json();
    const idx = mockInquiries.findIndex((i) => i.id === id);
    if (idx < 0) {
      return NextResponse.json({ error: "Inquiry not found" }, { status: 404 });
    }
    mockInquiries[idx] = {
      ...mockInquiries[idx],
      ...body,
      status: (body.status as InquiryStatus) || mockInquiries[idx].status,
      updated_at: new Date().toISOString(),
    };
    return NextResponse.json(mockInquiries[idx]);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Update failed" },
      { status: 400 }
    );
  }
}
