/**
 * Centralized, verified image URLs for the platform.
 * Use unsplash() helper to build consistent CDN URLs.
 */

export function unsplash(photoId: string, width: number, quality = 80) {
  return `https://images.unsplash.com/${photoId}?auto=format&fit=crop&w=${width}&q=${quality}`;
}

/** Verified Unsplash photo IDs (HTTP 200) */
const PHOTOS = {
  heroRetail: "photo-1441986300917-64674bd600d8",
  heroFashion: "photo-1490481651871-ab68de25d43d",
  heroStreetwear: "photo-1552374196-1ab2a1c593e8",
  heroSports: "photo-1517836357463-d25dfeac3438",
  heroWinter: "photo-1489987707025-afc232f7ea0f",
  heroManufacturing: "photo-1445205170230-053b83016050",
  summerCollection: "photo-1445205170230-053b83016050",
  winterCollection: "photo-1489987707025-afc232f7ea0f",
  sportsCollection: "photo-1517836357463-d25dfeac3438",
  streetwearCollection: "photo-1552374196-1ab2a1c593e8",
  denimCollection: "photo-1542272604-787c3835535d",
  footwearCollection: "photo-1549298916-b41d501d3772",

  // T-shirts & polos
  tshirt: "photo-1521572163474-6864f9cf17ab",
  streetwearTee: "photo-1576566588028-4147f3842f27",
  performanceTee: "photo-1571945153237-4929e783af4a",
  vneckTee: "photo-1583743814966-8936f5b7be1a",
  polo: "photo-1586363104862-3a5e2ab60d99",
  poloPerformance: "photo-1625910513520-bed0389ce32f",
  poloLongSleeve: "photo-1618354691438-25bc04584c23",

  // Hoodies
  hoodie: "photo-1556821840-3a63f95609a7",
  hoodieZip: "photo-1578587018452-892bacefd3f2",
  hoodieBlack: "photo-1618354691373-d851c5c3a990",
  hoodieFrenchTerry: "photo-1620799140408-edc6dcb6d633",
  hoodieOversized: "photo-1529374255404-311a2a4f1fd9",
  hoodieCropped: "photo-1572490122747-3968b75cc699",
  hoodieTech: "photo-1516762689617-e1cffcef479d",
  windbreaker: "photo-1591047139829-d91aecb6caea",

  // Shorts & sports
  shorts: "photo-1594938298603-c8148c4dae35",
  shortsCargo: "photo-1473966968600-fa801b869a1a",
  shortsChino: "photo-1591195853828-11db59a44f6b",
  shortsBasketball: "photo-1582418702059-97ebafb35d09",
  sportsGym: "photo-1571019614242-c5c5dee9f50b",
  sportsYoga: "photo-1518611012118-696072aa579a",
  sportsRun: "photo-1483721310020-03333e577078",

  // Jeans / denim
  jeans: "photo-1542272604-787c3835535d",
  jeansStraight: "photo-1541099649105-f69ad21f3246",
  jeansRelaxed: "photo-1604176354204-9268737828e4",
  jeansWomen: "photo-1582418702059-97ebafb35d09",

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
  accessories: "photo-1434389677669-e08b4cac3105",
  cap: "photo-1588850561407-ed78c282e89b",
  beanie: "photo-1576871337622-98d48d1cf531",
  socks: "photo-1588850561407-ed78c282e89b",
  scarf: "photo-1521369909029-2afed882baee",

  aboutManufacturing: "photo-1445205170230-053b83016050",
  aboutFactory: "photo-1581091226825-a6a2a5aee158",
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
