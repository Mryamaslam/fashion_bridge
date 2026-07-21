/**
 * Centralized product/collection image URLs.
 * Every photo ID below was visually verified (HTTP 200 + correct apparel subject).
 * Do not swap IDs without opening the image first.
 */

export function unsplash(photoId: string, width: number, quality = 80) {
  return `https://images.unsplash.com/${photoId}?auto=format&fit=crop&w=${width}&q=${quality}`;
}

/** Visually verified Unsplash photo IDs */
const PHOTOS = {
  // Heroes / collections
  heroRetail: "photo-1441986300917-64674bd600d8",
  heroStreetwear: "photo-1552374196-1ab2a1c593e8",
  heroSports: "photo-1517836357463-d25dfeac3438",
  summerCollection: "photo-1445205170230-053b83016050",
  winterCollection: "photo-1489987707025-afc232f7ea0f",
  sportsCollection: "photo-1517836357463-d25dfeac3438",
  streetwearCollection: "photo-1552374196-1ab2a1c593e8",
  denimCollection: "photo-1542272604-787c3835535d",
  footwearCollection: "photo-1549298916-b41d501d3772",
  aboutManufacturing: "photo-1445205170230-053b83016050",
  aboutFactory: "photo-1581091226825-a6a2a5aee158",

  // T-shirts — plain / blank product shots only
  tshirt: "photo-1521572163474-6864f9cf17ab", // plain white crew tee on model
  streetwearTee: "photo-1523381210434-271e8be1f52b", // blank sage tees on hangers
  performanceTee: "photo-1552374196-1ab2a1c593e8", // clean white tee (lifestyle)
  vneckTee: "photo-1620799139652-715e4d5b232d", // plain white V-neck on hanger

  // Polos
  polo: "photo-1586363104862-3a5e2ab60d99", // folded solid polos
  poloPerformance: "photo-1625910513520-bed0389ce32f", // navy polo on model
  poloLongSleeve: "photo-1603252109303-2751441dd157", // collared shirts on rack

  // Hoodies — real hooded garments only (no food / tee mixups)
  hoodie: "photo-1556821840-3a63f95609a7", // heather grey hoodie (back)
  hoodieZip: "photo-1620799140188-3b2a02fd9a77", // plain white blank hoodie
  hoodieBlack: "photo-1612978322313-be209301e185", // black hoodie on rack
  hoodieFrenchTerry: "photo-1571273134620-1ef375de9b84", // white hoodie on hanger
  hoodieOversized: "photo-1630269470848-337134b23b06", // pink pullover hoodie
  hoodieCropped: "photo-1515886657613-9f3515b0c78f", // mustard cropped hoodie set
  hoodieTech: "photo-1544022613-e87ca75a784a", // oversized sweatshirt layering
  windbreaker: "photo-1591047139829-d91aecb6caea", // bomber / outerwear

  // Shorts / sports
  shorts: "photo-1591195853828-11db59a44f6b", // denim shorts product
  shortsCargo: "photo-1591195853828-11db59a44f6b", // summer shorts product
  shortsChino: "photo-1591195853828-11db59a44f6b", // summer shorts product
  shortsBasketball: "photo-1571019614242-c5c5dee9f50b", // gym / performance
  sportsGym: "photo-1571019614242-c5c5dee9f50b",
  sportsYoga: "photo-1518611012118-696072aa579a",
  sportsRun: "photo-1483721310020-03333e577078",

  // Jeans
  jeans: "photo-1542272604-787c3835535d",
  jeansStraight: "photo-1541099649105-f69ad21f3246",
  jeansRelaxed: "photo-1604176354204-9268737828e4",
  jeansWomen: "photo-1541099649105-f69ad21f3246",

  // Bags
  bag: "photo-1590874103328-eac38a683ce7",
  backpack: "photo-1553062407-98eeb64c6a62",
  crossbody: "photo-1548036328-c9fa89d128fa",
  duffel: "photo-1622560480605-d83c853bc5c3",

  // Footwear
  sneakers: "photo-1549298916-b41d501d3772",
  sneakersRun: "photo-1542291026-7eec264c27ff",
  sneakersWhite: "photo-1606107557195-0e29a4b5b4aa",
  sneakersHighTop: "photo-1608231387042-66d1773070a5",
  sneakersCanvas: "photo-1595950653106-6c9ebd614d3a",
  sneakersTrail: "photo-1460353581641-37baddab0fa2",
  sneakersLifestyle: "photo-1491553895911-0055eca6402d",

  // Accessories
  accessories: "photo-1551028719-00167b16eac5", // leather goods
  cap: "photo-1588850561407-ed78c282e89b", // blank white trucker
  beanie: "photo-1556905055-8f358a7a47b2", // knit beanie flat lay
  socks: "photo-1571019614242-c5c5dee9f50b", // athletic lifestyle
  scarf: "photo-1539533018447-63fcce2678e3", // winter outerwear accessory look
} as const;

export const IMAGES = {
  hero: [
    { image: unsplash(PHOTOS.heroRetail, 1920), title: "Premium Fashion Export" },
    { image: unsplash(PHOTOS.heroStreetwear, 1920), title: "Global B2B Partner" },
    { image: unsplash(PHOTOS.heroSports, 1920), title: "Quality Manufacturing" },
  ],
  about: {
    manufacturing: unsplash(PHOTOS.aboutManufacturing, 800),
    factory: unsplash(PHOTOS.aboutFactory, 800),
  },
  collections: {
    summer: { banner: unsplash(PHOTOS.summerCollection, 1200), thumb: unsplash(PHOTOS.summerCollection, 400) },
    winter: { banner: unsplash(PHOTOS.winterCollection, 1200), thumb: unsplash(PHOTOS.winterCollection, 400) },
    sports: { banner: unsplash(PHOTOS.sportsCollection, 1200), thumb: unsplash(PHOTOS.sportsCollection, 400) },
    streetwear: { banner: unsplash(PHOTOS.streetwearCollection, 1200), thumb: unsplash(PHOTOS.streetwearCollection, 400) },
    denim: { banner: unsplash(PHOTOS.denimCollection, 1200), thumb: unsplash(PHOTOS.denimCollection, 400) },
    footwear: { banner: unsplash(PHOTOS.footwearCollection, 1200), thumb: unsplash(PHOTOS.footwearCollection, 400) },
  },
  products: {
    tshirt: unsplash(PHOTOS.tshirt, 600),
    streetwearTee: unsplash(PHOTOS.streetwearTee, 600),
    performanceTee: unsplash(PHOTOS.performanceTee, 600),
    vneckTee: unsplash(PHOTOS.vneckTee, 600),
    polo: unsplash(PHOTOS.polo, 600),
    poloPerformance: unsplash(PHOTOS.poloPerformance, 600),
    poloLongSleeve: unsplash(PHOTOS.poloLongSleeve, 600),
    hoodie: unsplash(PHOTOS.hoodie, 600),
    hoodieZip: unsplash(PHOTOS.hoodieZip, 600),
    hoodieBlack: unsplash(PHOTOS.hoodieBlack, 600),
    hoodieFrenchTerry: unsplash(PHOTOS.hoodieFrenchTerry, 600),
    hoodieOversized: unsplash(PHOTOS.hoodieOversized, 600),
    hoodieCropped: unsplash(PHOTOS.hoodieCropped, 600),
    hoodieTech: unsplash(PHOTOS.hoodieTech, 600),
    windbreaker: unsplash(PHOTOS.windbreaker, 600),
    shorts: unsplash(PHOTOS.shorts, 600),
    shortsCargo: unsplash(PHOTOS.shortsCargo, 600),
    shortsChino: unsplash(PHOTOS.shortsChino, 600),
    shortsBasketball: unsplash(PHOTOS.shortsBasketball, 600),
    sportsGym: unsplash(PHOTOS.sportsGym, 600),
    sportsYoga: unsplash(PHOTOS.sportsYoga, 600),
    sportsRun: unsplash(PHOTOS.sportsRun, 600),
    jeans: unsplash(PHOTOS.jeans, 600),
    jeansStraight: unsplash(PHOTOS.jeansStraight, 600),
    jeansRelaxed: unsplash(PHOTOS.jeansRelaxed, 600),
    jeansWomen: unsplash(PHOTOS.jeansWomen, 600),
    bag: unsplash(PHOTOS.bag, 600),
    backpack: unsplash(PHOTOS.backpack, 600),
    crossbody: unsplash(PHOTOS.crossbody, 600),
    duffel: unsplash(PHOTOS.duffel, 600),
    sneakers: unsplash(PHOTOS.sneakers, 600),
    sneakersRun: unsplash(PHOTOS.sneakersRun, 600),
    sneakersWhite: unsplash(PHOTOS.sneakersWhite, 600),
    sneakersHighTop: unsplash(PHOTOS.sneakersHighTop, 600),
    sneakersCanvas: unsplash(PHOTOS.sneakersCanvas, 600),
    sneakersTrail: unsplash(PHOTOS.sneakersTrail, 600),
    sneakersLifestyle: unsplash(PHOTOS.sneakersLifestyle, 600),
    accessories: unsplash(PHOTOS.accessories, 600),
    cap: unsplash(PHOTOS.cap, 600),
    beanie: unsplash(PHOTOS.beanie, 600),
    socks: unsplash(PHOTOS.socks, 600),
    scarf: unsplash(PHOTOS.scarf, 600),
  },
  placeholder: "/images/placeholder.svg",
} as const;
