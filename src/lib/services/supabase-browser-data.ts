import { createClient } from "@/lib/supabase/client";
import { filterProducts, paginate } from "@/lib/services/product-filters";
import type {
  Category,
  Collection,
  ContactMessage,
  DashboardStats,
  Inquiry,
  InquiryStatus,
  Media,
  Order,
  OrderItem,
  OrderStatus,
  Product,
  ProductFilters,
  PaginatedResponse,
} from "@/types";

function db() {
  return createClient();
}

export async function fetchCategories(): Promise<Category[]> {
  const { data, error } = await db().from("categories").select("*").order("sort_order");
  if (error) throw error;
  return (data as Category[]) || [];
}

export async function fetchCollections(activeOnly = false): Promise<Collection[]> {
  let query = db().from("collections").select("*").order("sort_order");
  if (activeOnly) query = query.eq("status", "active");
  const { data, error } = await query;
  if (error) throw error;
  return (data as Collection[]) || [];
}

export async function fetchAllProducts(): Promise<Product[]> {
  const { data, error } = await db()
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data as Product[]) || [];
}

export async function fetchActiveProducts(): Promise<Product[]> {
  const { data, error } = await db()
    .from("products")
    .select("*")
    .eq("status", "active")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data as Product[]) || [];
}

export async function fetchProductBySlug(slug: string): Promise<Product | null> {
  const { data, error } = await db().from("products").select("*").eq("slug", slug).maybeSingle();
  if (error) throw error;
  return data as Product | null;
}

export async function fetchCollectionBySlug(slug: string): Promise<Collection | null> {
  const { data, error } = await db().from("collections").select("*").eq("slug", slug).maybeSingle();
  if (error) throw error;
  return data as Collection | null;
}

export async function fetchProductsByCollection(collectionId: string): Promise<Product[]> {
  const products = await fetchActiveProducts();
  return products.filter((p) => p.collection_id === collectionId);
}

export async function fetchFeaturedProducts(limit = 4): Promise<Product[]> {
  const products = await fetchActiveProducts();
  return products.filter((p) => p.is_featured).slice(0, limit);
}

export async function fetchProductsPage(
  filters: ProductFilters = {},
  page = 1,
  pageSize = 24
): Promise<PaginatedResponse<Product>> {
  const [products, categories, collections] = await Promise.all([
    fetchActiveProducts(),
    fetchCategories(),
    fetchCollections(),
  ]);
  const base = filters.status
    ? products.filter((p) => p.status === filters.status)
    : products;
  const filtered = filterProducts(base, filters, categories, collections);
  return paginate(filtered, page, pageSize);
}

export async function fetchDashboardStats(): Promise<DashboardStats> {
  const [products, collections, inquiries, orders] = await Promise.all([
    fetchAllProducts(),
    fetchCollections(),
    fetchInquiries(),
    db().from("orders").select("total_amount"),
  ]);
  const orderRows = (orders.data || []) as { total_amount: number }[];
  return {
    totalProducts: products.length,
    totalCollections: collections.length,
    totalInquiries: inquiries.length,
    totalOrders: orderRows.length,
    lowStockCount: products.filter(
      (p) => p.stock_quantity > 0 && p.stock_quantity <= p.low_stock_threshold
    ).length,
    outOfStockCount: products.filter((p) => p.stock_quantity === 0).length,
    revenue: orderRows.reduce((sum, o) => sum + Number(o.total_amount), 0),
    pendingInquiries: inquiries.filter((i) => i.status === "new").length,
  };
}

export async function fetchInquiries(): Promise<Inquiry[]> {
  const { data, error } = await db()
    .from("inquiries")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data as Inquiry[]) || [];
}

export async function insertInquiry(data: Record<string, unknown>): Promise<Inquiry> {
  const { data: result, error } = await db().from("inquiries").insert(data).select().single();
  if (error) throw error;
  return result as Inquiry;
}

export async function insertProduct(data: Partial<Product>): Promise<Product> {
  const { data: result, error } = await db().from("products").insert(data).select().single();
  if (error) throw error;
  return result as Product;
}

export async function patchProduct(id: string, data: Partial<Product>): Promise<Product> {
  const { data: result, error } = await db()
    .from("products")
    .update({ ...data, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return result as Product;
}

export async function removeProduct(id: string): Promise<void> {
  const { error } = await db().from("products").delete().eq("id", id);
  if (error) throw error;
}

export async function patchInquiry(
  id: string,
  data: { status?: InquiryStatus; notes?: string }
): Promise<Inquiry> {
  const { data: result, error } = await db()
    .from("inquiries")
    .update({ ...data, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return result as Inquiry;
}

export async function insertCollection(data: Partial<Collection>): Promise<Collection> {
  const { data: result, error } = await db().from("collections").insert(data).select().single();
  if (error) throw error;
  return result as Collection;
}

export async function patchCollection(id: string, data: Partial<Collection>): Promise<Collection> {
  const { data: result, error } = await db()
    .from("collections")
    .update({ ...data, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return result as Collection;
}

export async function removeCollection(id: string): Promise<void> {
  const { error } = await db().from("collections").delete().eq("id", id);
  if (error) throw error;
}

export async function fetchOrders(): Promise<Order[]> {
  const { data, error } = await db()
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data as Order[]) || [];
}

export async function fetchOrderItems(): Promise<OrderItem[]> {
  const { data, error } = await db().from("order_items").select("*");
  if (error) throw error;
  return (data as OrderItem[]) || [];
}

export async function patchOrder(
  id: string,
  updates: { status?: OrderStatus; tracking_number?: string | null; notes?: string | null }
): Promise<Order> {
  const { data: result, error } = await db()
    .from("orders")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return result as Order;
}

export async function fetchMedia(): Promise<Media[]> {
  const { data, error } = await db().from("media").select("*").order("created_at", { ascending: false });
  if (error) throw error;
  return (data as Media[]) || [];
}

export async function uploadMedia(file: File, folder = "general"): Promise<Media> {
  const path = `${folder}/${Date.now()}-${file.name}`;
  const { error: uploadError } = await db()
    .storage.from("media")
    .upload(path, file, { contentType: file.type || "application/octet-stream" });
  if (uploadError) throw uploadError;

  const { data: pub } = db().storage.from("media").getPublicUrl(path);
  const { data, error } = await db()
    .from("media")
    .insert({
      name: file.name,
      url: pub.publicUrl,
      folder,
      mime_type: file.type || "application/octet-stream",
      size_bytes: file.size,
    })
    .select()
    .single();
  if (error) throw error;
  return data as Media;
}

export async function removeMedia(id: string): Promise<void> {
  const { data: row } = await db().from("media").select("url").eq("id", id).single();
  const url = (row as { url?: string } | null)?.url;
  const marker = "/object/public/media/";
  const path = url?.includes(marker) ? url.split(marker)[1] : null;
  if (path) {
    await db().storage.from("media").remove([path]);
  }
  const { error } = await db().from("media").delete().eq("id", id);
  if (error) throw error;
}

export async function fetchContactMessages(): Promise<ContactMessage[]> {
  const { data, error } = await db()
    .from("contact_messages")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data as ContactMessage[]) || [];
}

export async function insertContactMessage(
  data: Record<string, unknown>
): Promise<ContactMessage> {
  const { data: result, error } = await db()
    .from("contact_messages")
    .insert(data)
    .select()
    .single();
  if (error) throw error;
  return result as ContactMessage;
}

export async function fetchProductSlugs(): Promise<string[]> {
  const products = await fetchActiveProducts();
  return products.map((p) => p.slug);
}

export async function fetchCollectionSlugs(): Promise<string[]> {
  const collections = await fetchCollections(true);
  return collections.map((c) => c.slug);
}

export function getCategoryNameFromList(
  categoryId: string | null,
  categories: Category[]
): string | undefined {
  if (!categoryId) return undefined;
  return categories.find((c) => c.id === categoryId)?.name;
}
