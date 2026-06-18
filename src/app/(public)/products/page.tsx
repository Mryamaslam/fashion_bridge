"use client";

import { useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { FadeIn } from "@/components/animations/motion";
import { SectionHeader } from "@/components/shared/section-header";
import { ProductCard } from "@/components/shared/product-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useProducts } from "@/hooks/use-data";
import { CATEGORIES, COLORS, SIZES } from "@/lib/constants/site";
import { cn } from "@/lib/utils";
import { mockCategories } from "@/lib/data/mock";

function ProductsContent() {
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [category, setCategory] = useState(searchParams.get("category") || "");
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [page, setPage] = useState(1);

  const filters = useMemo(() => ({
    search: search || undefined,
    category: category || undefined,
    colors: selectedColors.length ? selectedColors : undefined,
    sizes: selectedSizes.length ? selectedSizes : undefined,
    minPrice: minPrice ? Number(minPrice) : undefined,
    maxPrice: maxPrice ? Number(maxPrice) : undefined,
  }), [search, category, selectedColors, selectedSizes, minPrice, maxPrice]);

  const { data, isLoading } = useProducts(filters, page);

  const toggleColor = (color: string) => {
    setSelectedColors((prev) =>
      prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color]
    );
    setPage(1);
  };

  const toggleSize = (size: string) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
    setPage(1);
  };

  const clearFilters = () => {
    setSearch("");
    setCategory("");
    setSelectedColors([]);
    setSelectedSizes([]);
    setMinPrice("");
    setMaxPrice("");
    setPage(1);
  };

  const hasFilters = search || category || selectedColors.length || selectedSizes.length || minPrice || maxPrice;

  const getCategoryName = (id: string | null) =>
    mockCategories.find((c) => c.id === id)?.name;

  return (
    <>
      <section className="bg-primary pt-28 pb-16">
        <div className="container mx-auto px-4">
          <FadeIn>
            <h1 className="font-display text-4xl font-bold text-white md:text-5xl">Products</h1>
            <p className="mt-4 max-w-2xl text-white/70">
              Browse our complete catalog of export-ready fashion products.
            </p>
          </FadeIn>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col gap-8 lg:flex-row">
            {/* Filters Sidebar */}
            <AnimatePresence>
              {(filtersOpen || typeof window !== "undefined") && (
                <motion.aside
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={cn(
                    "lg:w-72 shrink-0",
                    !filtersOpen && "hidden lg:block"
                  )}
                >
                  <div className="sticky top-24 space-y-6 rounded-xl border bg-card p-6">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">Filters</h3>
                      {hasFilters && (
                        <Button variant="ghost" size="sm" onClick={clearFilters}>
                          <X className="mr-1 h-3 w-3" /> Clear
                        </Button>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Search</label>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          value={search}
                          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                          placeholder="Search products..."
                          className="pl-9"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Category</label>
                      <div className="flex flex-wrap gap-2">
                        {CATEGORIES.map((cat) => (
                          <Badge
                            key={cat.slug}
                            variant={category === cat.slug ? "gold" : "outline"}
                            className="cursor-pointer"
                            onClick={() => { setCategory(category === cat.slug ? "" : cat.slug); setPage(1); }}
                          >
                            {cat.name}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Price Range</label>
                      <div className="flex gap-2">
                        <Input type="number" placeholder="Min" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} />
                        <Input type="number" placeholder="Max" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Colors</label>
                      <div className="flex flex-wrap gap-2">
                        {COLORS.map((color) => (
                          <Badge
                            key={color}
                            variant={selectedColors.includes(color) ? "gold" : "outline"}
                            className="cursor-pointer"
                            onClick={() => toggleColor(color)}
                          >
                            {color}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Sizes</label>
                      <div className="flex flex-wrap gap-2">
                        {SIZES.map((size) => (
                          <Badge
                            key={size}
                            variant={selectedSizes.includes(size) ? "gold" : "outline"}
                            className="cursor-pointer"
                            onClick={() => toggleSize(size)}
                          >
                            {size}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.aside>
              )}
            </AnimatePresence>

            {/* Products Grid */}
            <div className="flex-1">
              <div className="mb-6 flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  {isLoading ? "Loading..." : `${data?.total || 0} products found`}
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="lg:hidden"
                  onClick={() => setFiltersOpen(!filtersOpen)}
                >
                  <SlidersHorizontal className="mr-2 h-4 w-4" />
                  Filters
                </Button>
              </div>

              {isLoading ? (
                <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <Skeleton key={i} className="aspect-[3/4] rounded-xl" />
                  ))}
                </div>
              ) : data?.data?.length ? (
                <>
                  <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
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
                      <Button variant="outline" disabled={page >= data.totalPages} onClick={() => setPage(page + 1)}>
                        Next
                      </Button>
                    </div>
                  )}
                </>
              ) : (
                <div className="py-20 text-center">
                  <p className="text-lg text-muted-foreground">No products found matching your filters.</p>
                  {hasFilters && (
                    <Button variant="gold" className="mt-4" onClick={clearFilters}>Clear Filters</Button>
                  )}
                </div>
              )}
            </div>
          </div>
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
