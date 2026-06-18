import { NextResponse } from "next/server";
import { getInquiries } from "@/lib/services/data";

export async function GET() {
  const inquiries = await getInquiries();
  return NextResponse.json(inquiries);
}
