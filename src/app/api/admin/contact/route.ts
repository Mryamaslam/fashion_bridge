import { NextResponse } from "next/server";
import { getContactMessages } from "@/lib/services/data";
import { requireAdmin } from "@/lib/auth/require-admin";

export async function GET() {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const messages = await getContactMessages();
  return NextResponse.json(messages);
}
