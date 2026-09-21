import { NextResponse } from "next/server";
import { getMedia } from "@/lib/services/data";
import { requireAdmin } from "@/lib/auth/require-admin";
import { isMongoConfigured, isCloudinaryConfigured } from "@/lib/env";
import { getDb } from "@/lib/mongodb/client";
import { uploadToCloudinary } from "@/lib/cloudinary/upload";

export async function GET() {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const media = await getMedia();
  return NextResponse.json(media);
}

export async function POST(request: Request) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  if (!isMongoConfigured() || !isCloudinaryConfigured()) {
    return NextResponse.json(
      { error: "Media upload requires MongoDB and Cloudinary to be configured" },
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

    const uploaded = await uploadToCloudinary(file, folder);
    const db = await getDb();
    const doc = {
      name: file.name,
      url: uploaded.url,
      folder,
      mime_type: file.type || "application/octet-stream",
      size_bytes: file.size,
      alt_text: null,
      cloudinary_public_id: uploaded.publicId,
      cloudinary_resource_type: file.type.startsWith("video/") ? "video" : "image",
      created_at: new Date().toISOString(),
    };
    const result = await db!.collection("media").insertOne(doc);

    return NextResponse.json({ ...doc, id: result.insertedId.toString() }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Upload failed" },
      { status: 400 }
    );
  }
}
