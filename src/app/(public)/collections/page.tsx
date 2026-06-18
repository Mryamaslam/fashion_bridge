import type { Metadata } from "next";
import { getCollections } from "@/lib/services/data";
import { FadeIn } from "@/components/animations/motion";
import { SectionHeader } from "@/components/shared/section-header";
import { CollectionCard } from "@/components/shared/collection-card";
import { CTASection } from "@/components/shared/cta-section";
import { SITE } from "@/lib/constants/site";

export const metadata: Metadata = {
  title: "Collections",
  description: `Explore seasonal and themed fashion collections from ${SITE.name}.`,
};

export default async function CollectionsPage() {
  const collections = await getCollections();

  return (
    <>
      <section className="bg-primary pt-28 pb-16">
        <div className="container mx-auto px-4">
          <FadeIn>
            <h1 className="font-display text-4xl font-bold text-white md:text-5xl">Collections</h1>
            <p className="mt-4 max-w-2xl text-white/70">
              Curated product lines designed for every season, style, and market.
            </p>
          </FadeIn>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <SectionHeader
            label="Curated"
            title="Our Collections"
            description="From summer essentials to premium denim — explore our themed product collections."
          />
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {collections.map((collection) => (
              <CollectionCard key={collection.id} collection={collection} />
            ))}
          </div>
        </div>
      </section>

      <CTASection
        title="Need a Custom Collection?"
        description="We can create bespoke collections tailored to your brand and market requirements."
        primaryLabel="Request Custom Collection"
        primaryHref="/inquiry"
      />
    </>
  );
}
