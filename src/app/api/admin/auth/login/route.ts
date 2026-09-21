import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getDb } from "@/lib/mongodb/client";
import { isMongoConfigured } from "@/lib/env";
import { verifyPassword } from "@/lib/auth/password";
import { createSessionToken, SESSION_COOKIE, SESSION_MAX_AGE } from "@/lib/auth/session";

const DEMO_EMAIL = "admin@fashionbridge.com";
const DEMO_PASSWORD = "admin123";

export async function POST(request: Request) {
  const { email, password } = await request.json();

  if (isMongoConfigured()) {
    const db = await getDb();
    const admin = await db!.collection("admins").findOne({ email: String(email).toLowerCase() });
    if (!admin || !(await verifyPassword(password, admin.password_hash))) {
      return NextResponse.json({ error: "Invalid login credentials" }, { status: 401 });
    }

    const token = await createSessionToken({ sub: admin._id.toString(), email: admin.email });
    const cookieStore = await cookies();
    cookieStore.set(SESSION_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: SESSION_MAX_AGE,
      path: "/",
    });
    return NextResponse.json({ user: { id: admin._id.toString(), email: admin.email } });
  }

  if (email === DEMO_EMAIL && password === DEMO_PASSWORD) {
    const cookieStore = await cookies();
    cookieStore.set("demo_admin_auth", "true", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });
    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
}
