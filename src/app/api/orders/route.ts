import { NextResponse } from "next/server";
import { createOrderFromCart } from "@/lib/services/data";
import { orderSchema } from "@/lib/validations/schemas";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = orderSchema.parse(body);
    const order = await createOrderFromCart({
      buyer_name: parsed.buyer_name,
      buyer_email: parsed.buyer_email,
      buyer_country: parsed.buyer_country,
      buyer_company: parsed.buyer_company,
      shipping_address: parsed.shipping_address,
      currency: parsed.currency,
      items: parsed.items,
    });
    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Order failed" },
      { status: 400 }
    );
  }
}
