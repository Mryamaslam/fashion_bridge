import { NextResponse } from "next/server";
import { getAllCollections } from "@/lib/services/data";

export async function GET() {
  const collections = await getAllCollections();
  return NextResponse.json(collections);
}
