import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getProductBySlug, getCategoryName } from "@/lib/services/data";
import { ProductDetailView } from "@/components/shared/product-detail-view";
import { ProductDetailClient } from "@/components/shared/product-detail-client";
import { getProductSlugsForExport } from "@/lib/services/static-params";
import { IS_STATIC_EXPORT } from "@/lib/constants/static-export";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getProductSlugsForExport();
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  if (IS_STATIC_EXPORT) {
    return {
      title: slug.replace(/-/g, " "),
      description: `${slug} — wholesale export from Fashion Bridge International`,
    };
  }
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Product Not Found" };
  return {
    title: product.name,
    description: product.description || `${product.name} — wholesale export from Fashion Bridge International`,
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;

  if (IS_STATIC_EXPORT) {
    return <ProductDetailClient slug={slug} />;
  }

  const product = await getProductBySlug(slug);
  if (!product || product.status !== "active") notFound();

  const categoryName = getCategoryName(product.category_id ?? null);

  return <ProductDetailView product={product} categoryName={categoryName} />;
}
