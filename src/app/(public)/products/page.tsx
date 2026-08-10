"use client";

import { useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";
import { FadeIn } from "@/components/animations/motion";
import { ProductCard } from "@/components/shared/product-card";
import { SafeImage } from "@/components/shared/safe-image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useProducts, useCategories } from "@/hooks/use-data";
import { CATEGORIES } from "@/lib/constants/site";
import { IMAGES } from "@/lib/constants/images";

function ProductsContent() {
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [category, setCategory] = useState(searchParams.get("category") || "");
  const [page, setPage] = useState(1);

  const filters = useMemo(
    () => ({
      search: search || undefined,
      category: category || undefined,
    }),
    [search, category]
  );

  const { data, isLoading } = useProducts(filters, page);
  const { data: categories } = useCategories();

  const clearFilters = () => {
    setSearch("");
    setCategory("");
    setPage(1);
  };

  const hasFilters = search || category;

  const getCategoryName = (id: string | null) =>
    (categories || []).find((c) => c.id === id)?.name;

  return (
    <>
      <section className="relative h-[45vh] min-h-[320px]">
        <SafeImage
          src={IMAGES.heroCatalog}
          alt="Fashion Bridge International wholesale catalog"
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/55 to-black/30" />
        <div className="absolute inset-0 flex items-end">
          <div className="container mx-auto px-4 pb-12 pt-28">
            <FadeIn>
              <h1 className="font-display text-4xl font-bold text-white md:text-5xl">Products</h1>
              <p className="mt-4 max-w-2xl text-lg text-white/75">
                Browse 240+ export-ready SKUs across 8 categories — wholesale pricing for global buyers.
              </p>
            </FadeIn>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4">
          {/* Essential filters only: search + category */}
          <div className="mb-8 space-y-4 rounded-xl border bg-card p-4 md:p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="relative flex-1 sm:max-w-md">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                  placeholder="Search by name or SKU..."
                  className="pl-9"
                />
              </div>
              {hasFilters && (
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  <X className="mr-1 h-3 w-3" /> Clear filters
                </Button>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge
                variant={!category ? "gold" : "outline"}
                className="cursor-pointer"
                onClick={() => {
                  setCategory("");
                  setPage(1);
                }}
              >
                All
              </Badge>
              {CATEGORIES.map((cat) => (
                <Badge
                  key={cat.slug}
                  variant={category === cat.slug ? "gold" : "outline"}
                  className="cursor-pointer"
                  onClick={() => {
                    setCategory(category === cat.slug ? "" : cat.slug);
                    setPage(1);
                  }}
                >
                  {cat.name}
                </Badge>
              ))}
            </div>
          </div>

          <p className="mb-6 text-sm text-muted-foreground">
            {isLoading ? "Loading..." : `${data?.total || 0} products found`}
          </p>

          {isLoading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="aspect-[3/4] rounded-xl" />
              ))}
            </div>
          ) : data?.data?.length ? (
            <>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {data.data.map((product: import("@/types").Product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    categoryName={getCategoryName(product.category_id ?? null)}
                  />
                ))}
              </div>
              {data.totalPages > 1 && (
                <div className="mt-10 flex justify-center gap-2">
                  <Button variant="outline" disabled={page <= 1} onClick={() => setPage(page - 1)}>
                    Previous
                  </Button>
                  <span className="flex items-center px-4 text-sm">
                    Page {page} of {data.totalPages}
                  </span>
                  <Button
                    variant="outline"
                    disabled={page >= data.totalPages}
                    onClick={() => setPage(page + 1)}
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="py-20 text-center">
              <p className="text-lg text-muted-foreground">No products found matching your filters.</p>
              {hasFilters && (
                <Button variant="gold" className="mt-4" onClick={clearFilters}>
                  Clear Filters
                </Button>
              )}
            </div>
          )}
        </div>
      </section>
    </>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="py-40 text-center">Loading products...</div>}>
      <ProductsContent />
    </Suspense>
  );
}
