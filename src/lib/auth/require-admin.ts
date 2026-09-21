import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/auth/session";
import { isMongoConfigured } from "@/lib/env";

/** Guard for /api/admin/** routes — mirrors the /admin/* page redirect in middleware.ts */
export async function requireAdmin() {
  if (!isMongoConfigured()) return null;

  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  const session = token ? await verifySessionToken(token) : null;

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}
