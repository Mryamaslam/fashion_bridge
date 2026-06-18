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
  tshirt: "photo-1521572163474-6864f9cf17ab",
  polo: "photo-1586363104862-3a5e2ab60d99",
  hoodie: "photo-1556821840-3a63f95609a7",
  jeans: "photo-1542272604-787c3835535d",
  bag: "photo-1489987707025-afc232f7ea0f",
  sneakers: "photo-1549298916-b41d501d3772",
  shorts: "photo-1594938298603-c8148c4dae35",
  accessories: "photo-1434389677669-e08b4cac3105",
  streetwearTee: "photo-1576566588028-4147f3842f27",
  windbreaker: "photo-1591047139829-d91aecb6caea",
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
    polo: unsplash(PHOTOS.polo, 600),
    hoodie: unsplash(PHOTOS.hoodie, 600),
    jeans: unsplash(PHOTOS.jeans, 600),
    bag: unsplash(PHOTOS.bag, 600),
    sneakers: unsplash(PHOTOS.sneakers, 600),
    shorts: unsplash(PHOTOS.shorts, 600),
    accessories: unsplash(PHOTOS.accessories, 600),
    streetwearTee: unsplash(PHOTOS.streetwearTee, 600),
    windbreaker: unsplash(PHOTOS.windbreaker, 600),
  },
  placeholder: "/images/placeholder.svg",
} as const;
