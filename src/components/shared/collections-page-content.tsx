"use client";

import { useQuery } from "@tanstack/react-query";
import { CollectionCard } from "@/components/shared/collection-card";
import { SectionHeader } from "@/components/shared/section-header";
import { Skeleton } from "@/components/ui/skeleton";
import { getClientCollections } from "@/lib/services/client-data";

export function HomeCollectionsSection({ limit = 3 }: { limit?: number }) {
  const { data: collections, isLoading } = useQuery({
    queryKey: ["home-collections"],
    queryFn: () => getClientCollections(),
  });

  const items = (collections || []).slice(0, limit);

  return (
    <section className="bg-secondary/30 py-16 md:py-24">
      <div className="container mx-auto px-4">
        <SectionHeader
          label="Collections"
          title="Seasonal & Themed Lines"
          description="Curated collections designed for different markets, seasons, and style preferences."
        />
        {isLoading ? (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: limit }).map((_, i) => (
              <Skeleton key={i} className="aspect-[4/3] w-full rounded-xl" />
            ))}
          </div>
        ) : items.length ? (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((collection) => (
              <CollectionCard key={collection.id} collection={collection} />
            ))}
          </div>
        ) : (
          <p className="py-12 text-center text-muted-foreground">No collections yet.</p>
        )}
      </div>
    </section>
  );
}

export function CollectionsPageContent() {
  const { data: collections, isLoading } = useQuery({
    queryKey: ["collections-page"],
    queryFn: () => getClientCollections(),
  });

  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <SectionHeader
          label="Curated"
          title="Our Collections"
          description="From summer essentials to premium denim — explore our themed product collections."
        />
        {isLoading ? (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="aspect-[4/3] w-full rounded-xl" />
            ))}
          </div>
        ) : collections?.length ? (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {collections.map((collection) => (
              <CollectionCard key={collection.id} collection={collection} />
            ))}
          </div>
        ) : (
          <p className="py-20 text-center text-muted-foreground">No collections yet.</p>
        )}
      </div>
    </section>
  );
}
