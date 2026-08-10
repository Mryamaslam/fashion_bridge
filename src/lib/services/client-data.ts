import {
  mockProducts,
  mockInquiries,
  mockDashboardStats,
  mockCategories,
  mockCollections,
} from "@/lib/data/mock";
import { filterProducts, paginate } from "@/lib/services/product-filters";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import * as sb from "@/lib/services/supabase-browser-data";
import type {
  Product,
  ProductFilters,
  PaginatedResponse,
  Inquiry,
  DashboardStats,
  InquiryStatus,
  Collection,
  Category,
} from "@/types";

const useSupabase = () => isSupabaseConfigured();

export function getClientProducts(
  filters: ProductFilters = {},
  page = 1,
  pageSize = 24
): PaginatedResponse<Product> | Promise<PaginatedResponse<Product>> {
  if (useSupabase()) return sb.fetchProductsPage(filters, page, pageSize);
  const base = filters.status
    ? mockProducts.filter((p) => p.status === filters.status)
    : mockProducts.filter((p) => p.status === "active");
  const filtered = filterProducts(base, filters, mockCategories, mockCollections);
  return paginate(filtered, page, pageSize);
}

export function getClientAllProducts(): Product[] | Promise<Product[]> {
  if (useSupabase()) return sb.fetchAllProducts();
  return mockProducts;
}

export function getClientFeaturedProducts(limit = 4): Product[] | Promise<Product[]> {
  if (useSupabase()) return sb.fetchFeaturedProducts(limit);
  return mockProducts.filter((p) => p.is_featured && p.status === "active").slice(0, limit);
}

export function getClientCollections(): Collection[] | Promise<Collection[]> {
  if (useSupabase()) return sb.fetchCollections(true);
  return mockCollections.filter((c) => c.status === "active");
}

export function getClientCategories(): Category[] | Promise<Category[]> {
  if (useSupabase()) return sb.fetchCategories();
  return mockCategories;
}

export function getClientAllCollections(): Collection[] | Promise<Collection[]> {
  if (useSupabase()) return sb.fetchCollections(false);
  return mockCollections;
}

export function getClientCollectionBySlug(slug: string) {
  if (useSupabase()) return sb.fetchCollectionBySlug(slug);
  return mockCollections.find((c) => c.slug === slug) || null;
}

export function getClientProductsByCollection(collectionId: string) {
  if (useSupabase()) return sb.fetchProductsByCollection(collectionId);
  return mockProducts.filter((p) => p.collection_id === collectionId && p.status === "active");
}

export function getClientProductBySlug(slug: string) {
  if (useSupabase()) return sb.fetchProductBySlug(slug);
  return mockProducts.find((p) => p.slug === slug) || null;
}

export function getClientDashboardStats(): DashboardStats | Promise<DashboardStats> {
  if (useSupabase()) return sb.fetchDashboardStats();
  return mockDashboardStats;
}

export function getClientInquiries(): Inquiry[] | Promise<Inquiry[]> {
  if (useSupabase()) return sb.fetchInquiries();
  return mockInquiries;
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function submitClientInquiry(data: Record<string, unknown>) {
  if (useSupabase()) return sb.insertInquiry(data);
  await delay(400);
  const inquiry = {
    ...data,
    id: String(Date.now()),
    status: "new",
    notes: null,
    assigned_to: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  } as Inquiry;
  mockInquiries.unshift(inquiry);
  return inquiry;
}

export async function submitClientContact(_data: Record<string, unknown>) {
  await delay(400);
  return { ok: true };
}

export async function submitClientOrder(items: unknown[]) {
  await delay(500);
  const orderNumber = `FBI-ORD-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 900) + 100)}`;
  return { order_number: orderNumber, items };
}

export async function createClientProduct(data: Partial<Product>) {
  if (useSupabase()) return sb.insertProduct(data);
  await delay(300);
  const product = { ...data, id: String(Date.now()) } as Product;
  mockProducts.unshift(product);
  return product;
}

export async function updateClientProduct(id: string, data: Partial<Product>) {
  if (useSupabase()) return sb.patchProduct(id, data);
  await delay(300);
  const idx = mockProducts.findIndex((p) => p.id === id);
  if (idx >= 0) mockProducts[idx] = { ...mockProducts[idx], ...data };
  return mockProducts[idx];
}

export async function deleteClientProduct(id: string) {
  if (useSupabase()) return sb.removeProduct(id);
  await delay(300);
  const idx = mockProducts.findIndex((p) => p.id === id);
  if (idx >= 0) mockProducts.splice(idx, 1);
}

export async function updateClientInquiry(
  id: string,
  data: { status?: InquiryStatus; notes?: string }
) {
  if (useSupabase()) return sb.patchInquiry(id, data);
  await delay(300);
  const idx = mockInquiries.findIndex((i) => i.id === id);
  if (idx >= 0) {
    mockInquiries[idx] = {
      ...mockInquiries[idx],
      ...data,
      updated_at: new Date().toISOString(),
    };
  }
  return mockInquiries[idx];
}

export async function getClientCategoryName(categoryId: string | null): Promise<string | undefined> {
  if (useSupabase()) {
    const categories = await sb.fetchCategories();
    return sb.getCategoryNameFromList(categoryId, categories);
  }
  return mockCategories.find((c) => c.id === categoryId)?.name;
}
