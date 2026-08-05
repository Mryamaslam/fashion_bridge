import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getProductBySlug, getCategoryName } from "@/lib/services/data";
import { ProductDetailView } from "@/components/shared/product-detail-view";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Product Not Found" };
  return {
    title: product.name,
    description: product.description || `${product.name} — wholesale export from Fashion Bridge International`,
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product || product.status !== "active") notFound();

  const categoryName = getCategoryName(product.category_id ?? null);

  return <ProductDetailView product={product} categoryName={categoryName} />;
}
