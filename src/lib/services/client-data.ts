import {
  mockProducts,
  mockInquiries,
  mockContactMessages,
  mockMedia,
  mockOrders,
  mockOrderItems,
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
  ContactMessage,
  Inquiry,
  Media,
  Order,
  OrderItem,
  OrderStatus,
  DashboardStats,
  InquiryStatus,
  Collection,
  Category,
} from "@/types";

const isSupabaseMode = () => isSupabaseConfigured();

export function getClientProducts(
  filters: ProductFilters = {},
  page = 1,
  pageSize = 24
): PaginatedResponse<Product> | Promise<PaginatedResponse<Product>> {
  if (isSupabaseMode()) return sb.fetchProductsPage(filters, page, pageSize);
  const base = filters.status
    ? mockProducts.filter((p) => p.status === filters.status)
    : mockProducts.filter((p) => p.status === "active");
  const filtered = filterProducts(base, filters, mockCategories, mockCollections);
  return paginate(filtered, page, pageSize);
}

export function getClientAllProducts(): Product[] | Promise<Product[]> {
  if (isSupabaseMode()) return sb.fetchAllProducts();
  return mockProducts;
}

export function getClientFeaturedProducts(limit = 4): Product[] | Promise<Product[]> {
  if (isSupabaseMode()) return sb.fetchFeaturedProducts(limit);
  return mockProducts.filter((p) => p.is_featured && p.status === "active").slice(0, limit);
}

export function getClientCollections(): Collection[] | Promise<Collection[]> {
  if (isSupabaseMode()) return sb.fetchCollections(true);
  return mockCollections.filter((c) => c.status === "active");
}

export function getClientCategories(): Category[] | Promise<Category[]> {
  if (isSupabaseMode()) return sb.fetchCategories();
  return mockCategories;
}

export function getClientAllCollections(): Collection[] | Promise<Collection[]> {
  if (isSupabaseMode()) return sb.fetchCollections(false);
  return mockCollections;
}

export function getClientCollectionBySlug(slug: string) {
  if (isSupabaseMode()) return sb.fetchCollectionBySlug(slug);
  return mockCollections.find((c) => c.slug === slug) || null;
}

export function getClientProductsByCollection(collectionId: string) {
  if (isSupabaseMode()) return sb.fetchProductsByCollection(collectionId);
  return mockProducts.filter((p) => p.collection_id === collectionId && p.status === "active");
}

export function getClientProductBySlug(slug: string) {
  if (isSupabaseMode()) return sb.fetchProductBySlug(slug);
  return mockProducts.find((p) => p.slug === slug) || null;
}

export function getClientDashboardStats(): DashboardStats | Promise<DashboardStats> {
  if (isSupabaseMode()) return sb.fetchDashboardStats();
  return mockDashboardStats;
}

export function getClientInquiries(): Inquiry[] | Promise<Inquiry[]> {
  if (isSupabaseMode()) return sb.fetchInquiries();
  return mockInquiries;
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function submitClientInquiry(data: Record<string, unknown>) {
  if (isSupabaseMode()) return sb.insertInquiry(data);
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

export async function submitClientContact(data: Record<string, unknown>) {
  if (isSupabaseMode()) return sb.insertContactMessage(data);
  await delay(400);
  const message = {
    ...data,
    id: String(Date.now()),
    created_at: new Date().toISOString(),
  } as ContactMessage;
  mockContactMessages.unshift(message);
  return message;
}

export function getClientContactMessages(): ContactMessage[] | Promise<ContactMessage[]> {
  if (isSupabaseMode()) return sb.fetchContactMessages();
  return mockContactMessages;
}

export async function submitClientOrder(items: unknown[]) {
  await delay(500);
  const orderNumber = `FBI-ORD-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 900) + 100)}`;
  return { order_number: orderNumber, items };
}

export async function createClientProduct(data: Partial<Product>) {
  if (isSupabaseMode()) return sb.insertProduct(data);
  await delay(300);
  const product = { ...data, id: String(Date.now()) } as Product;
  mockProducts.unshift(product);
  return product;
}

export async function updateClientProduct(id: string, data: Partial<Product>) {
  if (isSupabaseMode()) return sb.patchProduct(id, data);
  await delay(300);
  const idx = mockProducts.findIndex((p) => p.id === id);
  if (idx >= 0) mockProducts[idx] = { ...mockProducts[idx], ...data };
  return mockProducts[idx];
}

export async function deleteClientProduct(id: string) {
  if (isSupabaseMode()) return sb.removeProduct(id);
  await delay(300);
  const idx = mockProducts.findIndex((p) => p.id === id);
  if (idx >= 0) mockProducts.splice(idx, 1);
}

export async function updateClientInquiry(
  id: string,
  data: { status?: InquiryStatus; notes?: string }
) {
  if (isSupabaseMode()) return sb.patchInquiry(id, data);
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

export async function createClientCollection(data: Partial<Collection>) {
  if (isSupabaseMode()) return sb.insertCollection(data);
  await delay(300);
  const collection = {
    ...data,
    id: String(Date.now()),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  } as Collection;
  mockCollections.unshift(collection);
  return collection;
}

export async function updateClientCollection(id: string, data: Partial<Collection>) {
  if (isSupabaseMode()) return sb.patchCollection(id, data);
  await delay(300);
  const idx = mockCollections.findIndex((c) => c.id === id);
  if (idx >= 0) {
    mockCollections[idx] = { ...mockCollections[idx], ...data, updated_at: new Date().toISOString() };
  }
  return mockCollections[idx];
}

export async function deleteClientCollection(id: string) {
  if (isSupabaseMode()) return sb.removeCollection(id);
  await delay(300);
  const idx = mockCollections.findIndex((c) => c.id === id);
  if (idx >= 0) mockCollections.splice(idx, 1);
}

export function getClientMedia(): Media[] | Promise<Media[]> {
  if (isSupabaseMode()) return sb.fetchMedia();
  return mockMedia;
}

export async function uploadClientMedia(file: File, folder = "general") {
  if (isSupabaseMode()) return sb.uploadMedia(file, folder);
  await delay(300);
  const media: Media = {
    id: String(Date.now() + Math.random()),
    name: file.name,
    url: URL.createObjectURL(file),
    folder,
    mime_type: file.type || "application/octet-stream",
    size_bytes: file.size,
    alt_text: null,
    created_by: null,
    created_at: new Date().toISOString(),
  };
  mockMedia.unshift(media);
  return media;
}

export async function deleteClientMedia(id: string) {
  if (isSupabaseMode()) return sb.removeMedia(id);
  await delay(200);
  const idx = mockMedia.findIndex((m) => m.id === id);
  if (idx >= 0) mockMedia.splice(idx, 1);
}

export function getClientOrders(): Order[] | Promise<Order[]> {
  if (isSupabaseMode()) return sb.fetchOrders();
  return mockOrders;
}

export function getClientOrderItems(): OrderItem[] | Promise<OrderItem[]> {
  if (isSupabaseMode()) return sb.fetchOrderItems();
  return mockOrderItems;
}

export async function updateClientOrder(
  id: string,
  data: { status?: OrderStatus; tracking_number?: string | null; notes?: string | null }
) {
  if (isSupabaseMode()) return sb.patchOrder(id, data);
  await delay(300);
  const idx = mockOrders.findIndex((o) => o.id === id);
  if (idx >= 0) {
    mockOrders[idx] = { ...mockOrders[idx], ...data, updated_at: new Date().toISOString() };
  }
  return mockOrders[idx];
}

export async function getClientCategoryName(categoryId: string | null): Promise<string | undefined> {
  if (isSupabaseMode()) {
    const categories = await sb.fetchCategories();
    return sb.getCategoryNameFromList(categoryId, categories);
  }
  return mockCategories.find((c) => c.id === categoryId)?.name;
}
