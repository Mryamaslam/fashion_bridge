import { NextResponse } from "next/server";
import { createCollection } from "@/lib/services/data";
import { collectionSchema } from "@/lib/validations/schemas";
import { slugify } from "@/lib/utils";
import { requireAdmin } from "@/lib/supabase/require-admin";

export async function POST(request: Request) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  try {
    const body = await request.json();
    const parsed = collectionSchema.parse(body);
    const collection = await createCollection({
      ...parsed,
      slug: slugify(parsed.name),
    });
    return NextResponse.json(collection, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Invalid request" },
      { status: 400 }
    );
  }
}
