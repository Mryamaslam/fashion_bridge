import { isSupabaseConfigured } from "@/lib/supabase/client";
import {
  mockProducts,
  mockCollections,
  mockCategories,
  mockInquiries,
  mockOrders,
  mockOrderItems,
  mockContactMessages,
  mockDashboardStats,
} from "@/lib/data/mock";
import { filterProducts, paginate } from "@/lib/services/product-filters";
import type {
  Product,
  Collection,
  Category,
  ContactMessage,
  Inquiry,
  InquiryStatus,
  Media,
  Order,
  OrderItem,
  ProductFilters,
  DashboardStats,
  PaginatedResponse,
} from "@/types";

async function getSupabaseServer() {
  if (!isSupabaseConfigured()) return null;
  const { createClient } = await import("@/lib/supabase/server");
  return createClient();
}

export async function getProducts(
  filters: ProductFilters = {},
  page = 1,
  pageSize = 24
): Promise<PaginatedResponse<Product>> {
  // Public catalog always reads the same inventory as admin (Supabase or in-memory mock).
  const [all, categories, collections] = await Promise.all([
    getAllProducts(),
    getCategories(),
    getAllCollections(),
  ]);
  const base = filters.status
    ? all.filter((p) => p.status === filters.status)
    : all.filter((p) => p.status === "active");
  const filtered = filterProducts(base, filters, categories, collections);
  return paginate(filtered, page, pageSize);
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const supabase = await getSupabaseServer();
  if (supabase) {
    const { data } = await supabase.from("products").select("*").eq("slug", slug).single();
    return data as Product | null;
  }
  return mockProducts.find((p) => p.slug === slug) || null;
}

export async function getProductById(id: string): Promise<Product | null> {
  const supabase = await getSupabaseServer();
  if (supabase) {
    const { data } = await supabase.from("products").select("*").eq("id", id).single();
    return data as Product | null;
  }
  return mockProducts.find((p) => p.id === id) || null;
}

/** Adjust stock (+/-). Used by orders and admin inventory updates. */
export async function adjustProductStock(
  productId: string,
  delta: number,
  reason: string
): Promise<Product> {
  const supabase = await getSupabaseServer();
  if (supabase) {
    const product = await getProductById(productId);
    if (!product) throw new Error("Product not found");
    const newQty = Math.max(0, product.stock_quantity + delta);
    const { data, error } = await supabase
      .from("products")
      .update({ stock_quantity: newQty, updated_at: new Date().toISOString() })
      .eq("id", productId)
      .select()
      .single();
    if (error) throw error;
    await supabase.from("inventory").insert({
      product_id: productId,
      change_amount: delta,
      previous_quantity: product.stock_quantity,
      new_quantity: newQty,
      reason,
    });
    return data as Product;
  }

  const idx = mockProducts.findIndex((p) => p.id === productId);
  if (idx < 0) throw new Error("Product not found");
  const previous = mockProducts[idx].stock_quantity;
  const newQty = Math.max(0, previous + delta);
  if (delta < 0 && previous + delta < 0) {
    throw new Error(`Insufficient stock for ${mockProducts[idx].name}`);
  }
  mockProducts[idx] = {
    ...mockProducts[idx],
    stock_quantity: newQty,
    updated_at: new Date().toISOString(),
  };
  return mockProducts[idx];
}

export interface CreateOrderInput {
  buyer_name: string;
  buyer_email: string;
  buyer_country: string;
  buyer_company?: string | null;
  shipping_address?: string | null;
  currency?: string;
  items: { productId: string; quantity: number; color?: string; size?: string }[];
}

/** Place order and deduct stock from shared inventory (web + admin). */
export async function createOrderFromCart(input: CreateOrderInput): Promise<Order> {
  if (!input.items.length) throw new Error("Order must include at least one item");

  const lineItems: OrderItem[] = [];
  let total = 0;

  for (const item of input.items) {
    const product = await getProductById(item.productId);
    if (!product || product.status !== "active") {
      throw new Error(`Product unavailable: ${item.productId}`);
    }
    if (product.stock_quantity < item.quantity) {
      throw new Error(
        `Insufficient stock for ${product.name}. Available: ${product.stock_quantity}, requested: ${item.quantity}`
      );
    }
  }

  for (const item of input.items) {
    const product = (await getProductById(item.productId))!;
    await adjustProductStock(product.id, -item.quantity, "order placed");
    const lineTotal = product.wholesale_price * item.quantity;
    total += lineTotal;
    lineItems.push({
      id: `${Date.now()}-${item.productId}`,
      order_id: "",
      product_id: product.id,
      product_name: product.name,
      sku: product.sku,
      quantity: item.quantity,
      unit_price: product.wholesale_price,
      total_price: lineTotal,
      size: item.size ?? null,
      color: item.color ?? null,
    });
  }

  const supabase = await getSupabaseServer();
  if (supabase) {
    const orderNumber = `FBI-ORD-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`;
    const { data: order, error } = await supabase
      .from("orders")
      .insert({
        order_number: orderNumber,
        buyer_name: input.buyer_name,
        buyer_company: input.buyer_company ?? null,
        buyer_email: input.buyer_email,
        buyer_country: input.buyer_country,
        status: "pending",
        total_amount: total,
        currency: input.currency ?? "USD",
        shipping_address: input.shipping_address ?? null,
      })
      .select()
      .single();
    if (error) throw error;
    await supabase.from("order_items").insert(
      lineItems.map((li) => ({ ...li, order_id: (order as Order).id }))
    );
    return order as Order;
  }

  const orderId = String(Date.now());
  const orderNumber = `FBI-ORD-${new Date().getFullYear()}-${String(mockOrders.length + 1).padStart(3, "0")}`;
  const order: Order = {
    id: orderId,
    order_number: orderNumber,
    buyer_name: input.buyer_name,
    buyer_company: input.buyer_company ?? null,
    buyer_email: input.buyer_email,
    buyer_country: input.buyer_country,
    status: "pending",
    total_amount: total,
    currency: input.currency ?? "USD",
    shipping_address: input.shipping_address ?? null,
    tracking_number: null,
    notes: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    items: lineItems.map((li) => ({ ...li, order_id: orderId })),
  };
  mockOrders.unshift(order);
  mockOrderItems.unshift(...order.items!);
  return order;
}

export async function getAllProducts(): Promise<Product[]> {
  const supabase = await getSupabaseServer();
  if (supabase) {
    const { data } = await supabase.from("products").select("*").order("created_at", { ascending: false });
    return (data as Product[]) || [];
  }
  return mockProducts;
}

export async function getCollections(): Promise<Collection[]> {
  const supabase = await getSupabaseServer();
  if (supabase) {
    const { data } = await supabase.from("collections").select("*").eq("status", "active").order("sort_order");
    return (data as Collection[]) || [];
  }
  return mockCollections.filter((c) => c.status === "active");
}

export async function getCollectionBySlug(slug: string): Promise<Collection | null> {
  const supabase = await getSupabaseServer();
  if (supabase) {
    const { data } = await supabase.from("collections").select("*").eq("slug", slug).single();
    return data as Collection | null;
  }
  return mockCollections.find((c) => c.slug === slug) || null;
}

export async function getAllCollections(): Promise<Collection[]> {
  const supabase = await getSupabaseServer();
  if (supabase) {
    const { data } = await supabase.from("collections").select("*").order("sort_order");
    return (data as Collection[]) || [];
  }
  return mockCollections;
}

export async function createCollection(collection: Partial<Collection>): Promise<Collection> {
  const supabase = await getSupabaseServer();
  if (supabase) {
    const { data, error } = await supabase.from("collections").insert(collection).select().single();
    if (error) throw error;
    return data as Collection;
  }
  const newCollection = {
    ...collection,
    id: String(Date.now()),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  } as Collection;
  mockCollections.unshift(newCollection);
  return newCollection;
}

export async function updateCollection(id: string, updates: Partial<Collection>): Promise<Collection> {
  const supabase = await getSupabaseServer();
  if (supabase) {
    const { data, error } = await supabase
      .from("collections")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return data as Collection;
  }
  const idx = mockCollections.findIndex((c) => c.id === id);
  if (idx >= 0) {
    mockCollections[idx] = { ...mockCollections[idx], ...updates, updated_at: new Date().toISOString() };
  }
  return mockCollections[idx];
}

export async function deleteCollection(id: string): Promise<void> {
  const supabase = await getSupabaseServer();
  if (supabase) {
    const { error } = await supabase.from("collections").delete().eq("id", id);
    if (error) throw error;
    return;
  }
  const idx = mockCollections.findIndex((c) => c.id === id);
  if (idx >= 0) mockCollections.splice(idx, 1);
}

export async function getCategories(): Promise<Category[]> {
  const supabase = await getSupabaseServer();
  if (supabase) {
    const { data } = await supabase.from("categories").select("*").order("sort_order");
    return (data as Category[]) || [];
  }
  return mockCategories;
}

export async function getInquiries(): Promise<Inquiry[]> {
  const supabase = await getSupabaseServer();
  if (supabase) {
    const { data } = await supabase.from("inquiries").select("*").order("created_at", { ascending: false });
    return (data as Inquiry[]) || [];
  }
  return mockInquiries;
}

export async function getOrders(): Promise<Order[]> {
  const supabase = await getSupabaseServer();
  if (supabase) {
    const { data } = await supabase.from("orders").select("*").order("created_at", { ascending: false });
    return (data as Order[]) || [];
  }
  return mockOrders;
}

export async function updateOrderStatus(
  id: string,
  updates: { status?: Order["status"]; tracking_number?: string | null; notes?: string | null }
): Promise<Order | null> {
  const supabase = await getSupabaseServer();
  if (supabase) {
    const { data, error } = await supabase
      .from("orders")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return data as Order;
  }
  const idx = mockOrders.findIndex((o) => o.id === id);
  if (idx < 0) return null;
  mockOrders[idx] = {
    ...mockOrders[idx],
    ...updates,
    updated_at: new Date().toISOString(),
  };
  return mockOrders[idx];
}

export async function getAllOrderItems(): Promise<OrderItem[]> {
  const supabase = await getSupabaseServer();
  if (supabase) {
    const { data } = await supabase.from("order_items").select("*");
    return (data as OrderItem[]) || [];
  }
  return mockOrderItems;
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const supabase = await getSupabaseServer();
  if (supabase) {
    const [products, collections, inquiries, orders] = await Promise.all([
      supabase.from("products").select("id, stock_quantity, low_stock_threshold", { count: "exact" }),
      supabase.from("collections").select("id", { count: "exact" }),
      supabase.from("inquiries").select("id, status", { count: "exact" }),
      supabase.from("orders").select("total_amount", { count: "exact" }),
    ]);
    const productData = (products.data || []) as Product[];
    return {
      totalProducts: products.count || 0,
      totalCollections: collections.count || 0,
      totalInquiries: inquiries.count || 0,
      totalOrders: orders.count || 0,
      lowStockCount: productData.filter((p) => p.stock_quantity > 0 && p.stock_quantity <= p.low_stock_threshold).length,
      outOfStockCount: productData.filter((p) => p.stock_quantity === 0).length,
      revenue: (orders.data || []).reduce((sum: number, o: { total_amount: number }) => sum + o.total_amount, 0),
      pendingInquiries: ((inquiries.data || []) as Inquiry[]).filter((i) => i.status === "new").length,
    };
  }
  return mockDashboardStats;
}

export async function createInquiry(data: Omit<Inquiry, "id" | "status" | "notes" | "assigned_to" | "created_at" | "updated_at">) {
  const supabase = await getSupabaseServer();
  if (supabase) {
    const { data: result, error } = await supabase.from("inquiries").insert(data).select().single();
    if (error) throw error;
    return result as Inquiry;
  }
  const inquiry: Inquiry = {
    ...data,
    id: String(Date.now()),
    status: "new",
    notes: null,
    assigned_to: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  mockInquiries.unshift(inquiry);
  return inquiry;
}

export async function updateInquiry(
  id: string,
  updates: { status?: InquiryStatus; notes?: string }
): Promise<Inquiry | null> {
  const supabase = await getSupabaseServer();
  if (supabase) {
    const { data, error } = await supabase
      .from("inquiries")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return data as Inquiry;
  }
  const idx = mockInquiries.findIndex((i) => i.id === id);
  if (idx < 0) return null;
  mockInquiries[idx] = {
    ...mockInquiries[idx],
    ...updates,
    updated_at: new Date().toISOString(),
  };
  return mockInquiries[idx];
}

export async function getMedia(): Promise<Media[]> {
  const supabase = await getSupabaseServer();
  if (supabase) {
    const { data } = await supabase.from("media").select("*").order("created_at", { ascending: false });
    return (data as Media[]) || [];
  }
  return [];
}

/** Deletes the DB row and, when Supabase is configured, the backing Storage object. */
export async function deleteMedia(id: string): Promise<void> {
  const supabase = await getSupabaseServer();
  if (!supabase) return;

  const { data: row } = await supabase.from("media").select("url").eq("id", id).single();
  const url = (row as { url?: string } | null)?.url;
  const marker = "/object/public/media/";
  const path = url?.includes(marker) ? url.split(marker)[1] : null;
  if (path) {
    await supabase.storage.from("media").remove([path]);
  }
  const { error } = await supabase.from("media").delete().eq("id", id);
  if (error) throw error;
}

export async function createContactMessage(
  data: Omit<ContactMessage, "id" | "created_at">
): Promise<ContactMessage> {
  const supabase = await getSupabaseServer();
  if (supabase) {
    const { data: result, error } = await supabase
      .from("contact_messages")
      .insert(data)
      .select()
      .single();
    if (error) throw error;
    return result as ContactMessage;
  }
  const message: ContactMessage = {
    ...data,
    id: String(Date.now()),
    created_at: new Date().toISOString(),
  };
  mockContactMessages.unshift(message);
  return message;
}

export async function getContactMessages(): Promise<ContactMessage[]> {
  const supabase = await getSupabaseServer();
  if (supabase) {
    const { data } = await supabase
      .from("contact_messages")
      .select("*")
      .order("created_at", { ascending: false });
    return (data as ContactMessage[]) || [];
  }
  return mockContactMessages;
}

export async function createProduct(product: Partial<Product>) {
  const supabase = await getSupabaseServer();
  if (supabase) {
    const { data, error } = await supabase.from("products").insert(product).select().single();
    if (error) throw error;
    return data as Product;
  }
  const newProduct = { ...product, id: String(Date.now()) } as Product;
  mockProducts.unshift(newProduct);
  return newProduct;
}

export async function updateProduct(id: string, updates: Partial<Product>) {
  const supabase = await getSupabaseServer();
  if (supabase) {
    const { data, error } = await supabase.from("products").update(updates).eq("id", id).select().single();
    if (error) throw error;
    return data as Product;
  }
  const idx = mockProducts.findIndex((p) => p.id === id);
  if (idx >= 0) mockProducts[idx] = { ...mockProducts[idx], ...updates };
  return mockProducts[idx];
}

export async function deleteProduct(id: string) {
  const supabase = await getSupabaseServer();
  if (supabase) {
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) throw error;
    return;
  }
  const idx = mockProducts.findIndex((p) => p.id === id);
  if (idx >= 0) mockProducts.splice(idx, 1);
}

export function getCategoryName(categoryId: string | null, categories: Category[]): string | undefined {
  if (!categoryId) return undefined;
  return categories.find((c) => c.id === categoryId)?.name;
}

/** Active products in a collection — same inventory source as admin. */
export async function getProductsByCollection(collectionId: string): Promise<Product[]> {
  const products = await getAllProducts();
  return products.filter((p) => p.collection_id === collectionId && p.status === "active");
}

/** Featured active products for homepage — same inventory source as admin. */
export async function getFeaturedProducts(limit = 4): Promise<Product[]> {
  const products = await getAllProducts();
  return products.filter((p) => p.is_featured && p.status === "active").slice(0, limit);
}
