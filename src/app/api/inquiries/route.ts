import { NextResponse } from "next/server";
import { createInquiry } from "@/lib/services/data";
import { inquirySchema } from "@/lib/validations/schemas";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = inquirySchema.parse(body);
    const inquiry = await createInquiry({
      name: parsed.name,
      company: parsed.company || null,
      country: parsed.country,
      email: parsed.email,
      phone: parsed.phone || null,
      product: parsed.product || null,
      quantity: parsed.quantity ? Number(parsed.quantity) : null,
      message: parsed.message || null,
    });
    return NextResponse.json(inquiry, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Invalid request" },
      { status: 400 }
    );
  }
}
