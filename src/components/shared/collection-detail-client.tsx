"use client";

import { useEffect, useState } from "react";
import { notFound } from "next/navigation";
import { Loader2 } from "lucide-react";
import { FadeIn } from "@/components/animations/motion";
import { ProductCard } from "@/components/shared/product-card";
import { SafeImage } from "@/components/shared/safe-image";
import { Badge } from "@/components/ui/badge";
import {
  getClientCollectionBySlug,
  getClientProductsByCollection,
  getClientCategoryName,
} from "@/lib/services/client-data";
import { getCollectionImage } from "@/lib/constants/images";
import type { Collection, Product } from "@/types";

export function CollectionDetailClient({ slug }: { slug: string }) {
  const [collection, setCollection] = useState<Collection | null | undefined>(undefined);
  const [products, setProducts] = useState<Product[]>([]);
  const [categoryNames, setCategoryNames] = useState<Record<string, string>>({});

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const col = await getClientCollectionBySlug(slug);
      if (cancelled) return;
      if (!col) {
        setCollection(null);
        return;
      }
      setCollection(col);
      const list = await getClientProductsByCollection(col.id);
      if (cancelled) return;
      setProducts(list);
      const names: Record<string, string> = {};
      for (const p of list) {
        if (p.category_id && !names[p.category_id]) {
          const name = await getClientCategoryName(p.category_id);
          if (name) names[p.category_id] = name;
        }
      }
      if (!cancelled) setCategoryNames(names);
    })();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (collection === undefined) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center pt-28">
        <Loader2 className="h-8 w-8 animate-spin text-gold" />
      </div>
    );
  }

  if (!collection) notFound();

  const bannerImage = getCollectionImage(collection, "banner");

  return (
    <>
      <section className="relative h-[50vh] min-h-[400px]">
        {bannerImage && (
          <SafeImage
            src={bannerImage}
            alt={collection.name}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        <div className="absolute inset-0 flex items-end">
          <div className="container mx-auto px-4 pb-12 pt-28">
            <FadeIn>
              <div className="mb-4 flex gap-2">
                {collection.is_featured && <Badge variant="gold">Featured</Badge>}
                {collection.season && <Badge variant="secondary">{collection.season}</Badge>}
              </div>
              <h1 className="font-display text-4xl font-bold text-white md:text-5xl">{collection.name}</h1>
              {collection.description && (
                <p className="mt-4 max-w-2xl text-lg text-white/70">{collection.description}</p>
              )}
            </FadeIn>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          {products.length ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  categoryName={
                    product.category_id ? categoryNames[product.category_id] : undefined
                  }
                />
              ))}
            </div>
          ) : (
            <p className="py-20 text-center text-muted-foreground">No products in this collection yet.</p>
          )}
        </div>
      </section>
    </>
  );
}
