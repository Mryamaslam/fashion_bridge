import type { Metadata } from "next";
import { Suspense } from "react";
import { FadeIn } from "@/components/animations/motion";
import { InquiryFormSection } from "@/components/forms/inquiry-form-section";
import { SITE } from "@/lib/constants/site";

export const metadata: Metadata = {
  title: "Buyer Inquiry",
  description: `Submit a wholesale buyer inquiry to ${SITE.name} for pricing, samples, and export quotes.`,
};

export default function InquiryPage() {
  return (
    <>
      <section className="bg-primary pt-28 pb-16">
        <div className="container mx-auto px-4">
          <FadeIn>
            <h1 className="font-display text-4xl font-bold text-white md:text-5xl">Buyer Inquiry</h1>
            <p className="mt-4 max-w-2xl text-white/70">
              Submit your wholesale inquiry and our export team will respond within 24 hours.
            </p>
          </FadeIn>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto max-w-3xl px-4">
          <Suspense fallback={<div className="py-20 text-center">Loading form...</div>}>
            <InquiryFormSection />
          </Suspense>
        </div>
      </section>
    </>
  );
}
