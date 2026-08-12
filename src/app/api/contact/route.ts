import { NextResponse } from "next/server";
import { contactSchema } from "@/lib/validations/schemas";
import { createContactMessage } from "@/lib/services/data";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = contactSchema.parse(body);
    const entry = await createContactMessage(parsed);
    return NextResponse.json(entry, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Invalid request" },
      { status: 400 }
    );
  }
}
