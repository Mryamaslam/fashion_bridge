import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { isMongoConfigured } from "@/lib/env";
import { SESSION_COOKIE } from "@/lib/auth/session";

export async function POST() {
  const cookieStore = await cookies();
  if (isMongoConfigured()) {
    cookieStore.delete(SESSION_COOKIE);
  } else {
    cookieStore.delete("demo_admin_auth");
  }
  return NextResponse.json({ success: true });
}
