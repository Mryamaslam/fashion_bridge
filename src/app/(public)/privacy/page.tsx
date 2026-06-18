import type { Metadata } from "next";
import Link from "next/link";
import { FadeIn } from "@/components/animations/motion";
import { Button } from "@/components/ui/button";
import { SITE } from "@/lib/constants/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `Privacy Policy for ${SITE.name}.`,
};

export default function PrivacyPage() {
  return (
    <>
      <section className="bg-primary pt-28 pb-16">
        <div className="container mx-auto px-4">
          <FadeIn>
            <h1 className="font-display text-4xl font-bold text-white md:text-5xl">Privacy Policy</h1>
            <p className="mt-4 text-white/70">Last updated: {new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })}</p>
          </FadeIn>
        </div>
      </section>
      <section className="py-16">
        <div className="container mx-auto max-w-3xl px-4 prose prose-neutral dark:prose-invert">
          <FadeIn>
            <h2>Information We Collect</h2>
            <p>
              {SITE.name} collects information you provide when submitting buyer inquiries, contact forms,
              or registering for our B2B export services. This may include your name, company, email, phone,
              country, and product requirements.
            </p>
            <h2>How We Use Your Information</h2>
            <p>
              We use your information to respond to export inquiries, provide quotes, process orders,
              and communicate about our apparel and fashion export services. We do not sell your
              personal data to third parties.
            </p>
            <h2>Data Security</h2>
            <p>
              We implement industry-standard security measures to protect your business information
              and inquiry data stored on our systems.
            </p>
            <h2>Contact</h2>
            <p>
              For privacy-related questions, contact us at{" "}
              <a href={`mailto:${SITE.email}`} className="text-gold">{SITE.email}</a>.
            </p>
            <Button asChild variant="gold" className="mt-6">
              <Link href="/contact">Contact Us</Link>
            </Button>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
