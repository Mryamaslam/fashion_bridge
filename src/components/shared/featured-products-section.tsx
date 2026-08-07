"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { FadeIn } from "@/components/animations/motion";
import { ProductCard } from "@/components/shared/product-card";
import { SectionHeader } from "@/components/shared/section-header";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { getClientFeaturedProducts, getClientCategoryName } from "@/lib/services/client-data";
import type { Product } from "@/types";

export function FeaturedProductsSection() {
  const { data: products, isLoading } = useQuery({
    queryKey: ["featured-products"],
    queryFn: () => getClientFeaturedProducts(4),
  });

  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <SectionHeader
          label="Wholesale"
          title="Featured Products"
          description="Top picks for global retailers — premium quality at competitive wholesale prices."
        />
        {isLoading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="aspect-[3/4] w-full rounded-xl" />
            ))}
          </div>
        ) : products?.length ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((product) => (
              <FeaturedProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <p className="py-12 text-center text-muted-foreground">No featured products yet.</p>
        )}
        <FadeIn className="mt-10 text-center">
          <Button asChild variant="outline" size="lg">
            <Link href="/products">
              View All Products <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </FadeIn>
      </div>
    </section>
  );
}

function FeaturedProductCard({ product }: { product: Product }) {
  const { data: categoryName } = useQuery({
    queryKey: ["category-name", product.category_id],
    queryFn: () => getClientCategoryName(product.category_id ?? null),
    enabled: !!product.category_id,
  });

  return <ProductCard product={product} categoryName={categoryName} />;
}
