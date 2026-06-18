import type { Metadata } from "next";
import Link from "next/link";
import { FadeIn } from "@/components/animations/motion";
import { Button } from "@/components/ui/button";
import { SITE } from "@/lib/constants/site";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: `Terms of Service for ${SITE.name} B2B export platform.`,
};

export default function TermsPage() {
  return (
    <>
      <section className="bg-primary pt-28 pb-16">
        <div className="container mx-auto px-4">
          <FadeIn>
            <h1 className="font-display text-4xl font-bold text-white md:text-5xl">Terms of Service</h1>
            <p className="mt-4 text-white/70">Last updated: {new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })}</p>
          </FadeIn>
        </div>
      </section>
      <section className="py-16">
        <div className="container mx-auto max-w-3xl px-4 prose prose-neutral dark:prose-invert">
          <FadeIn>
            <h2>B2B Export Agreement</h2>
            <p>
              By using {SITE.name} services, you agree to these terms governing wholesale apparel
              export, OEM manufacturing, and private label arrangements.
            </p>
            <h2>Orders &amp; MOQ</h2>
            <p>
              All orders are subject to minimum order quantities (MOQ) as specified per product.
              Pricing, lead times, and shipping terms are confirmed upon quote acceptance.
            </p>
            <h2>Payment &amp; Shipping</h2>
            <p>
              Payment terms, Incoterms, and shipping arrangements are agreed upon per order.
              {SITE.name} exports to 80+ countries worldwide via sea, air, and express freight.
            </p>
            <h2>Quality &amp; Returns</h2>
            <p>
              All products undergo AQL quality inspection before shipment. Claims must be reported
              within 7 days of delivery with supporting documentation.
            </p>
            <h2>Contact</h2>
            <p>
              Questions about these terms? Reach our export team at{" "}
              <a href={`mailto:${SITE.email}`} className="text-gold">{SITE.email}</a>.
            </p>
            <Button asChild variant="gold" className="mt-6">
              <Link href="/inquiry">Submit Buyer Inquiry</Link>
            </Button>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
