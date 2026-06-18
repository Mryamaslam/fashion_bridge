import { NextResponse } from "next/server";
import { contactSchema } from "@/lib/validations/schemas";

const contactMessages: Array<{
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  created_at: string;
}> = [];

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = contactSchema.parse(body);
    const entry = {
      id: String(Date.now()),
      ...parsed,
      created_at: new Date().toISOString(),
    };
    contactMessages.unshift(entry);
    return NextResponse.json(entry, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Invalid request" },
      { status: 400 }
    );
  }
}

export async function GET() {
  return NextResponse.json(contactMessages);
}
