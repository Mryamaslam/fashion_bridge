"use client";

import { useEffect, useState } from "react";
import { notFound } from "next/navigation";
import { Loader2 } from "lucide-react";
import { ProductDetailView } from "@/components/shared/product-detail-view";
import { getClientProductBySlug, getClientCategoryName } from "@/lib/services/client-data";
import type { Product } from "@/types";

export function ProductDetailClient({ slug }: { slug: string }) {
  const [product, setProduct] = useState<Product | null | undefined>(undefined);
  const [categoryName, setCategoryName] = useState<string | undefined>();

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const p = await getClientProductBySlug(slug);
      if (cancelled) return;
      if (!p || p.status !== "active") {
        setProduct(null);
        return;
      }
      setProduct(p);
      setCategoryName(await getClientCategoryName(p.category_id ?? null));
    })();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (product === undefined) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center pt-28">
        <Loader2 className="h-8 w-8 animate-spin text-gold" />
      </div>
    );
  }

  if (!product) notFound();

  return <ProductDetailView product={product} categoryName={categoryName} />;
}
