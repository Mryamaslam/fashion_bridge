"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { IS_STATIC_EXPORT, isDemoAdminAuthenticated } from "@/lib/constants/static-export";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/client";
import { Loader2 } from "lucide-react";

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [ready, setReady] = useState(!IS_STATIC_EXPORT);

  useEffect(() => {
    if (!IS_STATIC_EXPORT) return;

    if (isSupabaseConfigured()) {
      const supabase = createClient();
      supabase.auth.getUser().then(({ data: { user } }) => {
        if (!user) {
          router.replace("/admin/login/");
          return;
        }
        setReady(true);
      });
      return;
    }

    if (!isDemoAdminAuthenticated()) {
      router.replace("/admin/login/");
      return;
    }
    setReady(true);
  }, [router]);

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gold" />
      </div>
    );
  }

  return <>{children}</>;
}
