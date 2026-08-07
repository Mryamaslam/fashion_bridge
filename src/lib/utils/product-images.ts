import { IMAGES } from "@/lib/constants/images";
import { resolveProductImage } from "@/lib/utils/product-image-map";
import type { Product } from "@/types";

const { products: P } = IMAGES;

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
  return resolveProductImage(
    product.name,
    product.category_id ?? "",
    product.slug
  );
}

export function getColorImage(product: Product, color: string): string {
  const base = getProductCardImage(product);
  if (base !== IMAGES.placeholder) return base;

  const productImage = product.images.find((img) =>
    img.toLowerCase().includes(color.toLowerCase())
  );
  if (productImage) return productImage;

  return product.images[0] || IMAGES.placeholder;
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
