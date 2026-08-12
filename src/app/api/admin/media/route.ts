import { NextResponse } from "next/server";
import { getMedia } from "@/lib/services/data";
import { requireAdmin } from "@/lib/supabase/require-admin";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createServiceClient } from "@/lib/supabase/server";

export async function GET() {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const media = await getMedia();
  return NextResponse.json(media);
}

export async function POST(request: Request) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      { error: "Media upload requires Supabase to be configured" },
      { status: 400 }
    );
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const folder = (formData.get("folder") as string) || "general";
    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const supabase = await createServiceClient();
    const path = `${folder}/${Date.now()}-${file.name}`;
    const { error: uploadError } = await supabase.storage
      .from("media")
      .upload(path, file, { contentType: file.type || "application/octet-stream" });
    if (uploadError) throw uploadError;

    const { data: pub } = supabase.storage.from("media").getPublicUrl(path);
    const { data, error } = await supabase
      .from("media")
      .insert({
        name: file.name,
        url: pub.publicUrl,
        folder,
        mime_type: file.type || "application/octet-stream",
        size_bytes: file.size,
      })
      .select()
      .single();
    if (error) throw error;

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Upload failed" },
      { status: 400 }
    );
  }
}
