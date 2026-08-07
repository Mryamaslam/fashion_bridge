import { IMAGES } from "@/lib/constants/images";
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

/** Offsets image selection so adjacent SKUs with different colors show different photos */
const COLOR_ORDER: Record<string, number> = {
  Black: 0,
  White: 1,
  Navy: 2,
  Grey: 3,
  Blue: 4,
  Green: 5,
  Beige: 6,
  Brown: 7,
  Gold: 8,
};

/** Unique local images per category — no duplicate paths */
const CATEGORY_UNIQUE_POOLS: Record<string, string[]> = {
  "1": [P.tshirt, P.teeStack, P.streetwearTee, P.teeRed],
  "2": [P.polo, P.poloWhite, P.poloLongSleeve],
  "3": [
    P.hoodie,
    P.hoodieZip,
    P.hoodieBlack,
    P.hoodieFrenchTerry,
    P.hoodieOversized,
    P.hoodieCropped,
    P.windbreaker,
  ],
  "4": [P.shorts, P.shortsCargo, P.shortsChino, P.sportsGym],
  "5": [P.jeans, P.jeansStraight],
  "6": [P.bag, P.bagNavy, P.backpack, P.crossbody, P.duffel],
  "7": [
    P.sneakers,
    P.sneakersWhite,
    P.sneakersRun,
    P.sneakersHighTop,
    P.sneakersCanvas,
    P.sneakersTrail,
  ],
  "8": [P.accessories, P.cap, P.beanie, P.socks, P.scarf],
};

function productSkuIndex(product: Product): number {
  const match = product.sku?.match(/-(\d+)$/);
  return match ? parseInt(match[1], 10) - 1 : 0;
}

/** Strip legacy Red from catalog / Supabase rows */
export function getDisplayColors(colors: string[] | undefined): string[] {
  return (colors ?? []).filter((color) => color !== "Red");
}

function pickCategoryImage(product: Product, color?: string): string {
  const categoryId = product.category_id || "";
  const pool = CATEGORY_UNIQUE_POOLS[categoryId];
  if (!pool?.length) return IMAGES.placeholder;

  const colorKey = color ?? product.colors?.[0] ?? "";
  const colorOffset = COLOR_ORDER[colorKey] ?? 0;
  const idx = productSkuIndex(product);
  return pool[(idx + colorOffset) % pool.length];
}

export function getProductCardImage(product: Product): string {
  return pickCategoryImage(product);
}

export function getColorImage(product: Product, color: string): string {
  const fromPool = pickCategoryImage(product, color);
  if (fromPool !== IMAGES.placeholder) return fromPool;

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
  return getDisplayColors(product.colors).map((color) => ({
    color,
    image: getColorImage(product, color),
    swatch: COLOR_SWATCHES[color] || "#737373",
  }));
}
