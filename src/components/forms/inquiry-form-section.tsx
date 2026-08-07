"use client";

import { useSearchParams } from "next/navigation";
import { InquiryForm } from "@/components/forms/inquiry-form";
import { Card, CardContent } from "@/components/ui/card";

export function InquiryFormSection() {
  const searchParams = useSearchParams();
  const product = searchParams.get("product") ?? undefined;
  const country = searchParams.get("country") ?? undefined;
  const quantityRaw = searchParams.get("quantity");
  const qty = quantityRaw ? Number(quantityRaw) : undefined;

  return (
    <Card className="border-gold/20">
      <CardContent className="p-8">
        <InquiryForm
          defaultProduct={product}
          defaultCountry={country}
          defaultQuantity={qty && !Number.isNaN(qty) ? qty : undefined}
        />
      </CardContent>
    </Card>
  );
}
