import { isSupabaseConfigured } from "@/lib/supabase/client";
import {
  mockProducts,
  mockCollections,
  mockCategories,
  mockInquiries,
  mockOrders,
  mockDashboardStats,
} from "@/lib/data/mock";
import type {
  Product,
  Collection,
  Category,
  Inquiry,
  Order,
  ProductFilters,
  DashboardStats,
  PaginatedResponse,
} from "@/types";

async function getSupabaseServer() {
  if (!isSupabaseConfigured()) return null;
  const { createClient } = await import("@/lib/supabase/server");
  return createClient();
}

function paginate<T>(items: T[], page: number, pageSize: number): PaginatedResponse<T> {
  const start = (page - 1) * pageSize;
  const data = items.slice(start, start + pageSize);
  return {
    data,
    total: items.length,
    page,
    pageSize,
    totalPages: Math.ceil(items.length / pageSize),
  };
}

function filterProducts(products: Product[], filters: ProductFilters): Product[] {
  return products.filter((p) => {
    if (filters.search) {
      const q = filters.search.toLowerCase();
      if (!p.name.toLowerCase().includes(q) && !p.sku.toLowerCase().includes(q)) return false;
    }
    if (filters.category) {
      const cat = mockCategories.find((c) => c.slug === filters.category);
      if (cat && p.category_id !== cat.id) return false;
    }
    if (filters.collection) {
      const col = mockCollections.find((c) => c.slug === filters.collection);
      if (col && p.collection_id !== col.id) return false;
    }
    if (filters.minPrice !== undefined && p.wholesale_price < filters.minPrice) return false;
    if (filters.maxPrice !== undefined && p.wholesale_price > filters.maxPrice) return false;
    if (filters.colors?.length && !filters.colors.some((c) => p.colors.includes(c))) return false;
    if (filters.sizes?.length && !filters.sizes.some((s) => p.sizes.includes(s))) return false;
    if (filters.status && p.status !== filters.status) return false;
    return true;
  });
}

export async function getProducts(
  filters: ProductFilters = {},
  page = 1,
  pageSize = 12
): Promise<PaginatedResponse<Product>> {
  const supabase = await getSupabaseServer();
  if (supabase) {
    let query = supabase.from("products").select("*", { count: "exact" });
    if (filters.search) query = query.or(`name.ilike.%${filters.search}%,sku.ilike.%${filters.search}%`);
    if (filters.status) query = query.eq("status", filters.status);
    else query = query.eq("status", "active");
    const { data, count } = await query.range((page - 1) * pageSize, page * pageSize - 1);
    return {
      data: (data as Product[]) || [],
      total: count || 0,
      page,
      pageSize,
      totalPages: Math.ceil((count || 0) / pageSize),
    };
  }
  const filtered = filterProducts(mockProducts.filter((p) => p.status === "active"), filters);
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

export function getCategoryName(categoryId: string | null): string | undefined {
  if (!categoryId) return undefined;
  return mockCategories.find((c) => c.id === categoryId)?.name;
}

export function getProductsByCollection(collectionId: string): Product[] {
  return mockProducts.filter((p) => p.collection_id === collectionId && p.status === "active");
}

export function getFeaturedProducts(limit = 4): Product[] {
  return mockProducts.filter((p) => p.is_featured && p.status === "active").slice(0, limit);
}
