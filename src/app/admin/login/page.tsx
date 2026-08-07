"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Lock } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { loginSchema, type LoginFormData } from "@/lib/validations/schemas";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { FadeIn } from "@/components/animations/motion";
import {
  IS_STATIC_EXPORT,
  DEMO_ADMIN_EMAIL,
  DEMO_ADMIN_PASSWORD,
  setDemoAdminAuth,
} from "@/lib/constants/static-export";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/client";

export default function AdminLoginPage() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "admin@fashionbridge.com", password: "admin123" },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      if (IS_STATIC_EXPORT && isSupabaseConfigured()) {
        const supabase = createClient();
        const { error } = await supabase.auth.signInWithPassword({
          email: data.email,
          password: data.password,
        });
        if (error) throw error;
        toast.success("Welcome back!");
        router.push("/admin");
        router.refresh();
        return;
      }

      if (IS_STATIC_EXPORT) {
        if (data.email === DEMO_ADMIN_EMAIL && data.password === DEMO_ADMIN_PASSWORD) {
          setDemoAdminAuth(true);
          toast.success("Welcome back!");
          router.push("/admin");
          return;
        }
        throw new Error("Invalid credentials");
      }
      const res = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Invalid credentials");
      toast.success("Welcome back!");
      router.push("/admin");
      router.refresh();
    } catch {
      toast.error("Invalid email or password");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-primary p-4">
      <div className="absolute inset-0 hero-pattern opacity-20" />
      <FadeIn className="relative w-full max-w-md">
        <Card className="border-gold/20 shadow-2xl">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gold font-bold text-black text-lg">
              FB
            </div>
            <CardTitle className="font-display text-2xl">Admin Login</CardTitle>
            <CardDescription>Fashion Bridge International Dashboard</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" {...register("email")} />
                {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" {...register("password")} />
                {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
              </div>
              <Button type="submit" variant="gold" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Signing in...</>
                ) : (
                  <><Lock className="mr-2 h-4 w-4" /> Sign In</>
                )}
              </Button>
              <p className="text-center text-xs text-muted-foreground">
                {IS_STATIC_EXPORT && isSupabaseConfigured()
                  ? "Sign in with your Supabase admin account"
                  : "Demo: admin@fashionbridge.com / admin123"}
              </p>
            </form>
          </CardContent>
        </Card>
      </FadeIn>
    </div>
  );
}
