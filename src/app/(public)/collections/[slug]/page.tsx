import { notFound } from "next/navigation";
import { connection } from "next/server";
import type { Metadata } from "next";
import { getCollectionBySlug, getProductsByCollection, getCategoryName, getCategories } from "@/lib/services/data";
import { FadeIn } from "@/components/animations/motion";
import { ProductCard } from "@/components/shared/product-card";
import { SafeImage } from "@/components/shared/safe-image";
import { Badge } from "@/components/ui/badge";
import { CollectionDetailClient } from "@/components/shared/collection-detail-client";
import { getCollectionSlugsForExport } from "@/lib/services/static-params";
import { IS_STATIC_EXPORT } from "@/lib/constants/static-export";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getCollectionSlugsForExport();
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  if (IS_STATIC_EXPORT) {
    return { title: slug.replace(/-/g, " ") };
  }
  const collection = await getCollectionBySlug(slug);
  if (!collection) return { title: "Collection Not Found" };
  return { title: collection.name, description: collection.description || undefined };
}

export default async function CollectionDetailPage({ params }: Props) {
  const { slug } = await params;

  if (IS_STATIC_EXPORT) {
    return <CollectionDetailClient slug={slug} />;
  }

  // Admin edits must show up immediately — excludes this page from static
  // prerendering/caching for known slugs.
  await connection();

  const collection = await getCollectionBySlug(slug);
  if (!collection) notFound();

  const [products, categories] = await Promise.all([
    getProductsByCollection(collection.id),
    getCategories(),
  ]);

  return (
    <>
      <section className="relative h-[50vh] min-h-[400px]">
        {collection.banner_url && (
          <SafeImage
            src={collection.banner_url}
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
                  categoryName={getCategoryName(product.category_id ?? null, categories)}
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
