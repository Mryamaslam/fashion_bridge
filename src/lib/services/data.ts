import { getDb } from "@/lib/mongodb/client";
import { serialize, serializeAll, toObjectId } from "@/lib/mongodb/serialize";
import { deleteFromCloudinary } from "@/lib/cloudinary/upload";
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

export async function getProducts(
  filters: ProductFilters = {},
  page = 1,
  pageSize = 24
): Promise<PaginatedResponse<Product>> {
  // Public catalog always reads the same inventory as admin (Mongo or in-memory mock).
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
  const db = await getDb();
  if (db) {
    const doc = await db.collection("products").findOne({ slug });
    return doc ? (serialize(doc) as unknown as Product) : null;
  }
  return mockProducts.find((p) => p.slug === slug) || null;
}

export async function getProductById(id: string): Promise<Product | null> {
  const db = await getDb();
  if (db) {
    const doc = await db.collection("products").findOne({ _id: toObjectId(id) });
    return doc ? (serialize(doc) as unknown as Product) : null;
  }
  return mockProducts.find((p) => p.id === id) || null;
}

/** Adjust stock (+/-). Used by orders and admin inventory updates. */
export async function adjustProductStock(
  productId: string,
  delta: number,
  reason: string
): Promise<Product> {
  const db = await getDb();
  if (db) {
    const product = await getProductById(productId);
    if (!product) throw new Error("Product not found");
    const newQty = Math.max(0, product.stock_quantity + delta);
    const _id = toObjectId(productId);
    await db
      .collection("products")
      .updateOne({ _id }, { $set: { stock_quantity: newQty, updated_at: new Date().toISOString() } });
    await db.collection("inventory").insertOne({
      product_id: productId,
      change_amount: delta,
      previous_quantity: product.stock_quantity,
      new_quantity: newQty,
      reason,
      created_at: new Date().toISOString(),
    });
    const updated = await getProductById(productId);
    return updated!;
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
  payment_method?: string;
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

  const db = await getDb();
  if (db) {
    const orderNumber = `FBI-ORD-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`;
    const now = new Date().toISOString();
    const orderDoc = {
      order_number: orderNumber,
      buyer_name: input.buyer_name,
      buyer_company: input.buyer_company ?? null,
      buyer_email: input.buyer_email,
      buyer_country: input.buyer_country,
      status: "pending" as const,
      total_amount: total,
      currency: input.currency ?? "USD",
      payment_method: input.payment_method ?? "Cash on Delivery",
      shipping_address: input.shipping_address ?? null,
      tracking_number: null as string | null,
      notes: null as string | null,
      created_at: now,
      updated_at: now,
    };
    const insertResult = await db.collection("orders").insertOne(orderDoc);
    const orderId = insertResult.insertedId.toString();
    if (lineItems.length) {
      await db.collection("order_items").insertMany(
        lineItems.map((li) => {
          const { id, ...rest } = li;
          void id;
          return { ...rest, order_id: orderId };
        })
      );
    }
    return { ...orderDoc, id: orderId };
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
    payment_method: input.payment_method ?? "Cash on Delivery",
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
  const db = await getDb();
  if (db) {
    const docs = await db.collection("products").find({}).sort({ created_at: -1 }).toArray();
    return serializeAll(docs) as unknown as Product[];
  }
  return mockProducts;
}

export async function getCollections(): Promise<Collection[]> {
  const db = await getDb();
  if (db) {
    const docs = await db
      .collection("collections")
      .find({ status: "active" })
      .sort({ sort_order: 1 })
      .toArray();
    return serializeAll(docs) as unknown as Collection[];
  }
  return mockCollections.filter((c) => c.status === "active");
}

export async function getCollectionBySlug(slug: string): Promise<Collection | null> {
  const db = await getDb();
  if (db) {
    const doc = await db.collection("collections").findOne({ slug });
    return doc ? (serialize(doc) as unknown as Collection) : null;
  }
  return mockCollections.find((c) => c.slug === slug) || null;
}

export async function getAllCollections(): Promise<Collection[]> {
  const db = await getDb();
  if (db) {
    const docs = await db.collection("collections").find({}).sort({ sort_order: 1 }).toArray();
    return serializeAll(docs) as unknown as Collection[];
  }
  return mockCollections;
}

export async function createCollection(collection: Partial<Collection>): Promise<Collection> {
  const db = await getDb();
  if (db) {
    const now = new Date().toISOString();
    const doc = { ...collection, created_at: now, updated_at: now };
    const result = await db.collection("collections").insertOne(doc);
    return { ...doc, id: result.insertedId.toString() } as Collection;
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
  const db = await getDb();
  if (db) {
    const _id = toObjectId(id);
    const updated_at = new Date().toISOString();
    await db.collection("collections").updateOne({ _id }, { $set: { ...updates, updated_at } });
    const doc = await db.collection("collections").findOne({ _id });
    return serialize(doc!) as unknown as Collection;
  }
  const idx = mockCollections.findIndex((c) => c.id === id);
  if (idx >= 0) {
    mockCollections[idx] = { ...mockCollections[idx], ...updates, updated_at: new Date().toISOString() };
  }
  return mockCollections[idx];
}

export async function deleteCollection(id: string): Promise<void> {
  const db = await getDb();
  if (db) {
    await db.collection("collections").deleteOne({ _id: toObjectId(id) });
    return;
  }
  const idx = mockCollections.findIndex((c) => c.id === id);
  if (idx >= 0) mockCollections.splice(idx, 1);
}

export async function getCategories(): Promise<Category[]> {
  const db = await getDb();
  if (db) {
    const docs = await db.collection("categories").find({}).sort({ sort_order: 1 }).toArray();
    return serializeAll(docs) as unknown as Category[];
  }
  return mockCategories;
}

export async function getInquiries(): Promise<Inquiry[]> {
  const db = await getDb();
  if (db) {
    const docs = await db.collection("inquiries").find({}).sort({ created_at: -1 }).toArray();
    return serializeAll(docs) as unknown as Inquiry[];
  }
  return mockInquiries;
}

export async function getOrders(): Promise<Order[]> {
  const db = await getDb();
  if (db) {
    const docs = await db.collection("orders").find({}).sort({ created_at: -1 }).toArray();
    return serializeAll(docs) as unknown as Order[];
  }
  return mockOrders;
}

export async function updateOrderStatus(
  id: string,
  updates: { status?: Order["status"]; tracking_number?: string | null; notes?: string | null }
): Promise<Order | null> {
  const db = await getDb();
  if (db) {
    const _id = toObjectId(id);
    const updated_at = new Date().toISOString();
    await db.collection("orders").updateOne({ _id }, { $set: { ...updates, updated_at } });
    const doc = await db.collection("orders").findOne({ _id });
    return doc ? (serialize(doc) as unknown as Order) : null;
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
  const db = await getDb();
  if (db) {
    const docs = await db.collection("order_items").find({}).toArray();
    return serializeAll(docs) as unknown as OrderItem[];
  }
  return mockOrderItems;
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const db = await getDb();
  if (db) {
    const [products, totalCollections, totalInquiries, orders, pendingInquiries] = await Promise.all([
      db
        .collection("products")
        .find({}, { projection: { stock_quantity: 1, low_stock_threshold: 1 } })
        .toArray(),
      db.collection("collections").countDocuments(),
      db.collection("inquiries").countDocuments(),
      db.collection("orders").find({}, { projection: { total_amount: 1 } }).toArray(),
      db.collection("inquiries").countDocuments({ status: "new" }),
    ]);
    return {
      totalProducts: products.length,
      totalCollections,
      totalInquiries,
      totalOrders: orders.length,
      lowStockCount: products.filter(
        (p) => p.stock_quantity > 0 && p.stock_quantity <= p.low_stock_threshold
      ).length,
      outOfStockCount: products.filter((p) => p.stock_quantity === 0).length,
      revenue: orders.reduce((sum: number, o) => sum + (o.total_amount || 0), 0),
      pendingInquiries,
    };
  }
  return mockDashboardStats;
}

export async function createInquiry(data: Omit<Inquiry, "id" | "status" | "notes" | "assigned_to" | "created_at" | "updated_at">) {
  const db = await getDb();
  if (db) {
    const now = new Date().toISOString();
    const doc = { ...data, status: "new" as const, notes: null, assigned_to: null, created_at: now, updated_at: now };
    const result = await db.collection("inquiries").insertOne(doc);
    return { ...doc, id: result.insertedId.toString() } as Inquiry;
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
  const db = await getDb();
  if (db) {
    const _id = toObjectId(id);
    const updated_at = new Date().toISOString();
    await db.collection("inquiries").updateOne({ _id }, { $set: { ...updates, updated_at } });
    const doc = await db.collection("inquiries").findOne({ _id });
    return doc ? (serialize(doc) as unknown as Inquiry) : null;
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
  const db = await getDb();
  if (db) {
    const docs = await db.collection("media").find({}).sort({ created_at: -1 }).toArray();
    return serializeAll(docs) as unknown as Media[];
  }
  return [];
}

/** Deletes the DB row and, when Cloudinary is configured, the backing asset. */
export async function deleteMedia(id: string): Promise<void> {
  const db = await getDb();
  if (!db) return;

  const _id = toObjectId(id);
  const doc = await db.collection("media").findOne({ _id });
  const publicId = (doc as { cloudinary_public_id?: string } | null)?.cloudinary_public_id;
  const resourceType = (doc as { cloudinary_resource_type?: "image" | "video" } | null)?.cloudinary_resource_type;
  if (publicId) {
    await deleteFromCloudinary(publicId, resourceType || "image");
  }
  await db.collection("media").deleteOne({ _id });
}

export async function createContactMessage(
  data: Omit<ContactMessage, "id" | "created_at">
): Promise<ContactMessage> {
  const db = await getDb();
  if (db) {
    const doc = { ...data, created_at: new Date().toISOString() };
    const result = await db.collection("contact_messages").insertOne(doc);
    return { ...doc, id: result.insertedId.toString() } as ContactMessage;
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
  const db = await getDb();
  if (db) {
    const docs = await db.collection("contact_messages").find({}).sort({ created_at: -1 }).toArray();
    return serializeAll(docs) as unknown as ContactMessage[];
  }
  return mockContactMessages;
}

export async function createProduct(product: Partial<Product>) {
  const db = await getDb();
  if (db) {
    const result = await db.collection("products").insertOne(product);
    return { ...product, id: result.insertedId.toString() } as Product;
  }
  const newProduct = { ...product, id: String(Date.now()) } as Product;
  mockProducts.unshift(newProduct);
  return newProduct;
}

export async function updateProduct(id: string, updates: Partial<Product>) {
  const db = await getDb();
  if (db) {
    const _id = toObjectId(id);
    await db.collection("products").updateOne({ _id }, { $set: updates });
    const doc = await db.collection("products").findOne({ _id });
    return serialize(doc!) as unknown as Product;
  }
  const idx = mockProducts.findIndex((p) => p.id === id);
  if (idx >= 0) mockProducts[idx] = { ...mockProducts[idx], ...updates };
  return mockProducts[idx];
}

export async function deleteProduct(id: string) {
  const db = await getDb();
  if (db) {
    await db.collection("products").deleteOne({ _id: toObjectId(id) });
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
