import { IMAGES } from "@/lib/constants/images";
import {
  categoryKeyFromProduct,
  resolveProductImage,
} from "@/lib/utils/product-image-map";
import type { Product } from "@/types";

/** Hex swatches for color picker UI */
export const COLOR_SWATCHES: Record<string, string> = {
  Black: "#0a0a0a",
  White: "#f5f5f5",
  Navy: "#1e3a5f",
  Grey: "#737373",
  Blue: "#2563eb",
  Green: "#16a34a",
  Beige: "#d4c4a8",
  Brown: "#78350f",
  Gold: "#c9a227",
};

/** Strip legacy Red from catalog / Supabase rows */
export function getDisplayColors(colors: string[] | undefined): string[] {
  return (colors ?? []).filter((color) => color !== "Red");
}

export function getProductCardImage(product: Product): string {
  const stored = product.images?.find(
    (url) => url && /^https?:\/\//i.test(url)
  );
  if (stored) return stored;

  return resolveProductImage(
    product.name,
    categoryKeyFromProduct(product.category_id, product.sku),
    product.slug,
    product.sku
  );
}

export function getColorImage(product: Product, color: string): string {
  return getProductCardImage(product);
}

export interface ColorPresentation {
  color: string;
  image: string;
  swatch: string;
}

/** All available colors with their presentation images for the product detail page */
export function getProductColorPresentations(product: Product): ColorPresentation[] {
  const image = getProductCardImage(product);
  return getDisplayColors(product.colors).map((color) => ({
    color,
    image,
    swatch: COLOR_SWATCHES[color] || "#737373",
  }));
}
