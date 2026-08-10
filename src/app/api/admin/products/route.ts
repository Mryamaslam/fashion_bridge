import { NextResponse } from "next/server";
import { getAllProducts, createProduct } from "@/lib/services/data";
import { productSchema } from "@/lib/validations/schemas";
import { slugify, generateSKU } from "@/lib/utils";
import { requireAdmin } from "@/lib/supabase/require-admin";

export async function GET() {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const products = await getAllProducts();
  return NextResponse.json(products);
}

export async function POST(request: Request) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  try {
    const body = await request.json();
    const parsed = productSchema.parse(body);
    const product = await createProduct({
      ...parsed,
      slug: slugify(parsed.name),
      sku: parsed.sku || generateSKU(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Invalid request" },
      { status: 400 }
    );
  }
}
