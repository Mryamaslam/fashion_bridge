import { IMAGES } from "@/lib/constants/images";
import type { Product } from "@/types";

const { products: P } = IMAGES;

/** Hex swatches for color picker UI */
export const COLOR_SWATCHES: Record<string, string> = {
  Black: "#0a0a0a",
  White: "#f5f5f5",
  Navy: "#1e3a5f",
  Grey: "#737373",
  Red: "#dc2626",
  Blue: "#2563eb",
  Green: "#16a34a",
  Beige: "#d4c4a8",
  Brown: "#78350f",
  Gold: "#c9a227",
};

/** Category-aware color → presentation image map */
const CATEGORY_COLOR_IMAGES: Record<string, Record<string, string>> = {
  "1": {
    Black: P.streetwearTee,
    White: P.tshirt,
    Navy: P.polo,
    Grey: P.teeStack,
    Red: P.teeRed,
    Blue: P.performanceTee,
    Beige: P.teeStack,
    Brown: P.streetwearTee,
    Green: P.performanceTee,
    Gold: P.teeRed,
  },
  "2": {
    Navy: P.polo,
    White: P.poloWhite,
    Black: P.poloLongSleeve,
    Red: P.polo,
    Blue: P.poloWhite,
    Green: P.poloWhite,
    Grey: P.poloLongSleeve,
    Beige: P.poloWhite,
    Brown: P.poloLongSleeve,
    Gold: P.polo,
  },
  "3": {
    Black: P.hoodieBlack,
    Grey: P.hoodie,
    Navy: P.hoodieZip,
    Green: P.hoodieZip,
    White: P.hoodieFrenchTerry,
    Beige: P.hoodieOversized,
    Brown: P.hoodieOversized,
    Red: P.hoodieBlack,
    Blue: P.hoodieZip,
    Gold: P.hoodie,
  },
  "4": {
    Black: P.shorts,
    Grey: P.sportsGym,
    Navy: P.shorts,
    Beige: P.shortsChino,
    Brown: P.shortsChino,
    Green: P.shortsCargo,
    Blue: P.shorts,
    Red: P.shorts,
    White: P.shortsChino,
    Gold: P.shortsChino,
  },
  "5": {
    Black: P.jeansStraight,
    Blue: P.jeans,
    Grey: P.jeansStraight,
    Navy: P.jeansStraight,
    Beige: P.jeans,
    Brown: P.jeansStraight,
    White: P.jeans,
    Red: P.jeansStraight,
    Green: P.jeansStraight,
    Gold: P.jeans,
  },
  "6": {
    Black: P.backpack,
    Navy: P.bagNavy,
    Beige: P.bag,
    Brown: P.duffel,
    Grey: P.crossbody,
    White: P.bag,
    Red: P.duffel,
    Blue: P.bagNavy,
    Green: P.backpack,
    Gold: P.bag,
  },
  "7": {
    Black: P.sneakers,
    White: P.sneakersWhite,
    Navy: P.sneakers,
    Grey: P.sneakersTrail,
    Red: P.sneakersRun,
    Blue: P.sneakersCanvas,
    Beige: P.sneakersCanvas,
    Brown: P.sneakers,
    Green: P.sneakersTrail,
    Gold: P.sneakersRun,
  },
  "8": {
    Black: P.cap,
    White: P.socks,
    Navy: P.beanie,
    Grey: P.cap,
    Red: P.cap,
    Blue: P.beanie,
    Beige: P.scarf,
    Brown: P.accessories,
    Green: P.beanie,
    Gold: P.accessories,
  },
};

const FALLBACK_BY_COLOR: Record<string, string> = {
  Black: P.streetwearTee,
  White: P.tshirt,
  Navy: P.polo,
  Grey: P.hoodie,
  Red: P.teeRed,
  Blue: P.performanceTee,
  Green: P.shortsCargo,
  Beige: P.bag,
  Brown: P.accessories,
  Gold: P.teeRed,
};

export function getColorImage(product: Product, color: string): string {
  const categoryId = product.category_id || "";
  const categoryMap = CATEGORY_COLOR_IMAGES[categoryId];
  if (categoryMap?.[color]) return categoryMap[color];

  const productImage = product.images.find((img) =>
    img.toLowerCase().includes(color.toLowerCase())
  );
  if (productImage) return productImage;

  return FALLBACK_BY_COLOR[color] || product.images[0] || IMAGES.placeholder;
}

export interface ColorPresentation {
  color: string;
  image: string;
  swatch: string;
}

/** All available colors with their presentation images for the product detail page */
export function getProductColorPresentations(product: Product): ColorPresentation[] {
  return product.colors.map((color) => ({
    color,
    image: getColorImage(product, color),
    swatch: COLOR_SWATCHES[color] || "#737373",
  }));
}
