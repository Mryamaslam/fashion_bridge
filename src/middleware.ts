import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export async function middleware(request: NextRequest) {

  if (isSupabaseConfigured()) {
    return await updateSession(request);
  }

  if (
    request.nextUrl.pathname.startsWith("/admin") &&
    !request.nextUrl.pathname.startsWith("/admin/login")
  ) {
    const demoAuth = request.cookies.get("demo_admin_auth");
    if (!demoAuth) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin/login";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
