/**
 * Upload public/images to Supabase Storage and seed catalog with public URLs.
 *
 * Prerequisites:
 * 1. Run supabase/schema.sql
 * 2. Run supabase/storage-setup.sql
 * 3. Add to .env.local:
 *    SUPABASE_SECRET_KEY=sb_secret_...   (or SUPABASE_SERVICE_ROLE_KEY)
 *
 * Usage: npm run seed:supabase
 */

import fs from "node:fs";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";
import { mockCategories, mockCollections, mockProducts } from "../src/lib/data/mock";

const ROOT = process.cwd();
const IMAGES_DIR = path.join(ROOT, "public", "images");

function loadEnvFile(filePath: string) {
  if (!fs.existsSync(filePath)) return;
  for (const line of fs.readFileSync(filePath, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq < 0) continue;
    const key = trimmed.slice(0, eq).trim();
    const value = trimmed.slice(eq + 1).trim();
    if (!process.env[key]) process.env[key] = value;
  }
}

function mimeType(file: string) {
  if (file.endsWith(".png")) return "image/png";
  if (file.endsWith(".jpg") || file.endsWith(".jpeg")) return "image/jpeg";
  if (file.endsWith(".webp")) return "image/webp";
  if (file.endsWith(".svg")) return "image/svg+xml";
  return "application/octet-stream";
}

function walkFiles(dir: string, base = dir): string[] {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files: string[] = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...walkFiles(full, base));
    else files.push(full);
  }
  return files;
}

function toPublicPath(absPath: string) {
  const rel = path.relative(path.join(ROOT, "public"), absPath).replace(/\\/g, "/");
  return `/${rel}`;
}

function toStoragePath(publicPath: string) {
  return publicPath.replace(/^\//, "");
}

function mapUrl(urlMap: Map<string, string>, value: string | null | undefined) {
  if (!value) return value ?? null;
  return urlMap.get(value) ?? value;
}

function mapUrls(urlMap: Map<string, string>, values: string[]) {
  return values.map((v) => urlMap.get(v) ?? v);
}

async function main() {
  loadEnvFile(path.join(ROOT, ".env.local"));

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey =
    process.env.SUPABASE_SECRET_KEY ??
    process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceKey) {
    console.error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SECRET_KEY in .env.local"
    );
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const urlMap = new Map<string, string>();
  const files = walkFiles(IMAGES_DIR).filter((f) => !fs.statSync(f).isDirectory());

  console.log(`Uploading ${files.length} images to Supabase Storage (media bucket)...`);

  for (const file of files) {
    const publicPath = toPublicPath(file);
    const storagePath = toStoragePath(publicPath);
    const body = fs.readFileSync(file);

    const { error } = await supabase.storage.from("media").upload(storagePath, body, {
      contentType: mimeType(file),
      upsert: true,
    });

    if (error) {
      console.error(`Upload failed: ${storagePath}`, error.message);
      process.exit(1);
    }

    const publicUrl = `${supabaseUrl}/storage/v1/object/public/media/${storagePath}`;
    urlMap.set(publicPath, publicUrl);
    console.log(`  ✓ ${storagePath}`);
  }

  console.log("\nSeeding categories...");
  const categoryIdBySlug = new Map<string, string>();

  for (const cat of mockCategories) {
    const row = {
      name: cat.name,
      slug: cat.slug,
      description: cat.description,
      image_url: mapUrl(urlMap, cat.image_url),
      sort_order: cat.sort_order,
    };

    const { data, error } = await supabase
      .from("categories")
      .upsert(row, { onConflict: "slug" })
      .select("id, slug")
      .single();

    if (error) {
      console.error("Category seed failed:", cat.slug, error.message);
      process.exit(1);
    }
    categoryIdBySlug.set(data.slug, data.id);
  }

  console.log("Seeding collections...");
  const collectionIdBySlug = new Map<string, string>();

  for (const col of mockCollections) {
    const row = {
      name: col.name,
      slug: col.slug,
      description: col.description,
      banner_url: mapUrl(urlMap, col.banner_url),
      thumbnail_url: mapUrl(urlMap, col.thumbnail_url),
      is_featured: col.is_featured,
      is_seasonal: col.is_seasonal,
      season: col.season,
      status: col.status,
      sort_order: col.sort_order,
    };

    const { data, error } = await supabase
      .from("collections")
      .upsert(row, { onConflict: "slug" })
      .select("id, slug")
      .single();

    if (error) {
      console.error("Collection seed failed:", col.slug, error.message);
      process.exit(1);
    }
    collectionIdBySlug.set(data.slug, data.id);
  }

  const mockCategoryIdToSlug: Record<string, string> = {
    "1": "t-shirts",
    "2": "polo-shirts",
    "3": "hoodies",
    "4": "shorts",
    "5": "jeans",
    "6": "bags",
    "7": "shoes",
    "8": "accessories",
  };

  const mockCollectionIdToSlug: Record<string, string> = {
    "1": "summer-collection",
    "2": "winter-collection",
    "3": "sports-collection",
    "4": "streetwear-collection",
    "5": "premium-denim-collection",
    "6": "footwear-collection",
  };

  console.log(`Seeding ${mockProducts.length} products...`);

  const productRows = mockProducts.map((p) => {
    const categorySlug = p.category_id ? mockCategoryIdToSlug[p.category_id] : undefined;
    const collectionSlug = p.collection_id ? mockCollectionIdToSlug[p.collection_id] : undefined;

    return {
      name: p.name,
      slug: p.slug,
      sku: p.sku,
      description: p.description,
      category_id: categorySlug ? categoryIdBySlug.get(categorySlug) ?? null : null,
      collection_id: collectionSlug ? collectionIdBySlug.get(collectionSlug) ?? null : null,
      price: p.price,
      wholesale_price: p.wholesale_price,
      moq: p.moq,
      sizes: p.sizes,
      colors: p.colors,
      material: p.material,
      stock_quantity: p.stock_quantity,
      low_stock_threshold: p.low_stock_threshold,
      images: mapUrls(urlMap, p.images),
      status: p.status,
      is_featured: p.is_featured,
    };
  });

  const chunkSize = 50;
  for (let i = 0; i < productRows.length; i += chunkSize) {
    const chunk = productRows.slice(i, i + chunkSize);
    const { error } = await supabase.from("products").upsert(chunk, { onConflict: "slug" });
    if (error) {
      console.error("Product seed failed at batch", i, error.message);
      process.exit(1);
    }
    console.log(`  ✓ products ${i + 1}-${Math.min(i + chunkSize, productRows.length)}`);
  }

  console.log("\nDone!");
  console.log(`- ${urlMap.size} images uploaded to Supabase Storage`);
  console.log(`- ${mockCategories.length} categories`);
  console.log(`- ${mockCollections.length} collections`);
  console.log(`- ${mockProducts.length} products with Supabase image URLs`);
  console.log("\nExample URL:", urlMap.get("/images/products/tee-white-flat.png"));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
