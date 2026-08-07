/**
 * Product / collection image URLs.
 * ALL catalog product images are local files under /public/images/products.
 * Hero and collection banners use local assets (no external CDN).
 */

const local = (file: string) => `/images/products/${file}`;
const localCat = (file: string) => `/images/categories/${file}`;
const localHero = (file: string) => `/images/products/${file}`;

/** Local blank wholesale catalog images — product cards use these only */
const L = {
  bagToteBeige: local("bag-tote-beige.png"),
  bagToteNavy: local("bag-tote-navy.png"),
  bagBackpack: local("bag-backpack-black.png"),
  bagCrossbody: local("bag-crossbody-black.png"),
  bagDuffel: local("bag-duffel-black.png"),
  teeWhite: local("tee-white-flat.png"),
  teeBlack: local("tee-black-flat.png"),
  teeStack: local("tee-stack-basics.png"),
  teeRed: local("tee-red-performance.png"),
  poloNavy: local("polo-navy-folded.png"),
  poloWhite: local("polo-white-folded.png"),
  poloLongSleeve: local("polo-black-longsleeve.png"),
  hoodieGrey: local("hoodie-grey-flat.png"),
  hoodieZip: local("hoodie-black-zip.png"),
  hoodieBlack: local("hoodie-black-pullover.png"),
  hoodieTerry: local("hoodie-white-terry.png"),
  hoodieOversized: local("hoodie-beige-oversized.png"),
  hoodieCropped: local("hoodie-black-cropped.png"),
  windbreaker: local("jacket-navy-windbreaker.png"),
  shortsMesh: local("shorts-black-mesh.png"),
  shortsChino: local("shorts-khaki-chino.png"),
  shortsCargo: local("shorts-olive-cargo.png"),
  shortsCompression: local("shorts-black-compression.png"),
  jeansStack: local("jeans-blue-stack.png"),
  jeansDark: local("jeans-dark-wash.png"),
  shoesWhite: local("shoes-white-court.png"),
  shoesBlack: local("shoes-black-lifestyle.png"),
  shoesHighTop: local("shoes-black-hightop.png"),
  shoesRunner: local("shoes-red-runner.png"),
  shoesCanvas: local("shoes-white-canvas.png"),
  shoesTrail: local("shoes-grey-trail.png"),
  accCap: local("acc-cap-black.png"),
  accBelt: local("acc-belt-brown.png"),
  accBeanie: local("acc-beanie-navy.png"),
  accSocks: local("acc-socks-white.png"),
  accScarf: local("acc-scarf-brown.png"),
} as const;

const PHOTOS = {
  heroFashion: localHero("tee-stack-basics.png"),
  heroWholesale: localHero("hoodie-grey-flat.png"),
  heroManufacturing: localHero("jeans-blue-stack.png"),
  heroCatalog: localHero("polo-navy-folded.png"),
  summerCollection: localHero("tee-white-flat.png"),
  winterCollection: localHero("hoodie-black-pullover.png"),
  sportsCollection: localHero("shorts-black-mesh.png"),
  streetwearCollection: localHero("tee-black-flat.png"),
  denimCollection: localHero("jeans-dark-wash.png"),
  footwearCollection: localHero("shoes-black-lifestyle.png"),
  aboutManufacturing: localHero("tee-stack-basics.png"),
  aboutFactory: localHero("hoodie-black-zip.png"),
} as const;

export const IMAGES = {
  hero: [
    { image: PHOTOS.heroFashion, title: "Premium Fashion Export" },
    { image: PHOTOS.heroWholesale, title: "Wholesale Apparel Worldwide" },
    { image: PHOTOS.heroManufacturing, title: "Quality Manufacturing" },
  ],
  heroCatalog: PHOTOS.heroCatalog,
  about: {
    manufacturing: PHOTOS.aboutManufacturing,
    factory: PHOTOS.aboutFactory,
  },
  collections: {
    summer: { banner: PHOTOS.summerCollection, thumb: PHOTOS.summerCollection },
    winter: { banner: PHOTOS.winterCollection, thumb: PHOTOS.winterCollection },
    sports: { banner: PHOTOS.sportsCollection, thumb: PHOTOS.sportsCollection },
    streetwear: { banner: PHOTOS.streetwearCollection, thumb: PHOTOS.streetwearCollection },
    denim: { banner: PHOTOS.denimCollection, thumb: PHOTOS.denimCollection },
    footwear: { banner: PHOTOS.footwearCollection, thumb: PHOTOS.footwearCollection },
  },
  /** Category tile images — local /images/categories/*.png */
  categories: {
    "t-shirts": localCat("t-shirts.png"),
    "polo-shirts": localCat("polo-shirts.png"),
    hoodies: localCat("hoodies.png"),
    shorts: localCat("shorts.png"),
    jeans: localCat("jeans.png"),
    bags: localCat("bags.png"),
    shoes: localCat("shoes.png"),
    accessories: localCat("accessories.png"),
  },
  /** Every key is a local /images/products/*.png — no Unsplash in product cards */
  products: {
    bag: L.bagToteBeige,
    bagNavy: L.bagToteNavy,
    backpack: L.bagBackpack,
    crossbody: L.bagCrossbody,
    duffel: L.bagDuffel,
    tshirt: L.teeWhite,
    teeStack: L.teeStack,
    teeRed: L.teeRed,
    streetwearTee: L.teeBlack,
    performanceTee: L.teeRed,
    vneckTee: L.teeWhite,
    polo: L.poloNavy,
    poloWhite: L.poloWhite,
    poloPerformance: L.poloWhite,
    poloLongSleeve: L.poloLongSleeve,
    hoodie: L.hoodieGrey,
    hoodieZip: L.hoodieZip,
    hoodieBlack: L.hoodieBlack,
    hoodieFrenchTerry: L.hoodieTerry,
    hoodieOversized: L.hoodieOversized,
    hoodieCropped: L.hoodieCropped,
    hoodieTech: L.hoodieZip,
    windbreaker: L.windbreaker,
    shorts: L.shortsMesh,
    shortsCargo: L.shortsCargo,
    shortsChino: L.shortsChino,
    shortsBasketball: L.shortsMesh,
    sportsGym: L.shortsCompression,
    sportsYoga: L.shortsCompression,
    sportsRun: L.shoesRunner,
    jeans: L.jeansStack,
    jeansStraight: L.jeansDark,
    jeansRelaxed: L.jeansStack,
    jeansWomen: L.jeansDark,
    sneakers: L.shoesBlack,
    sneakersRun: L.shoesRunner,
    sneakersWhite: L.shoesWhite,
    sneakersHighTop: L.shoesHighTop,
    sneakersCanvas: L.shoesCanvas,
    sneakersTrail: L.shoesTrail,
    sneakersLifestyle: L.shoesBlack,
    accessories: L.accBelt,
    cap: L.accCap,
    beanie: L.accBeanie,
    socks: L.accSocks,
    scarf: L.accScarf,
  },
  placeholder: "/images/placeholder.svg",
} as const;

const COLLECTION_BY_SLUG: Record<string, string> = {
  "summer-collection": IMAGES.collections.summer.thumb,
  "winter-collection": IMAGES.collections.winter.thumb,
  "sports-collection": IMAGES.collections.sports.thumb,
  "streetwear-collection": IMAGES.collections.streetwear.thumb,
  "premium-denim-collection": IMAGES.collections.denim.thumb,
  "footwear-collection": IMAGES.collections.footwear.thumb,
};

/** Prefer local assets; ignore broken legacy Unsplash URLs in DB */
export function getCollectionImage(
  collection: { slug: string; thumbnail_url?: string | null; banner_url?: string | null },
  variant: "thumb" | "banner" = "thumb"
): string {
  const local = COLLECTION_BY_SLUG[collection.slug];
  const remote = variant === "banner" ? collection.banner_url : collection.thumbnail_url;
  const fallbackRemote = collection.banner_url || collection.thumbnail_url;

  if (local) return local;
  if (remote && !remote.includes("unsplash.com")) return remote;
  if (fallbackRemote && !fallbackRemote.includes("unsplash.com")) return fallbackRemote;
  return IMAGES.placeholder;
}
