import { NextResponse } from "next/server";
import { getProducts } from "@/lib/services/data";
import type { ProductFilters } from "@/types";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const filters: ProductFilters = {
    search: searchParams.get("search") || undefined,
    category: searchParams.get("category") || undefined,
    collection: searchParams.get("collection") || undefined,
    minPrice: searchParams.get("minPrice") ? Number(searchParams.get("minPrice")) : undefined,
    maxPrice: searchParams.get("maxPrice") ? Number(searchParams.get("maxPrice")) : undefined,
    colors: searchParams.get("colors")?.split(",").filter(Boolean),
    sizes: searchParams.get("sizes")?.split(",").filter(Boolean),
  };
  const page = Number(searchParams.get("page") || 1);
  const result = await getProducts(filters, page);
  return NextResponse.json(result);
}
