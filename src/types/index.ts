export type UserRole = "admin" | "manager" | "viewer";

export type ProductStatus = "active" | "draft" | "archived";
export type CollectionStatus = "active" | "draft" | "archived";
export type InquiryStatus = "new" | "contacted" | "quoted" | "closed" | "lost";
export type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  role: UserRole;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  sort_order: number;
  created_at: string;
}

export interface Collection {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  banner_url: string | null;
  thumbnail_url: string | null;
  is_featured: boolean;
  is_seasonal: boolean;
  season: string | null;
  status: CollectionStatus;
  sort_order: number;
  created_at: string;
  updated_at: string;
  products?: Product[];
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  sku: string;
  description: string | null;
  category_id: string | null;
  collection_id: string | null;
  price: number;
  wholesale_price: number;
  moq: number;
  sizes: string[];
  colors: string[];
  material: string | null;
  stock_quantity: number;
  low_stock_threshold: number;
  images: string[];
  status: ProductStatus;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
  category?: Category;
  collection?: Collection;
}

export interface InventoryLog {
  id: string;
  product_id: string;
  change_amount: number;
  previous_quantity: number;
  new_quantity: number;
  reason: string;
  created_by: string | null;
  created_at: string;
}

export interface Inquiry {
  id: string;
  name: string;
  company: string | null;
  country: string;
  email: string;
  phone: string | null;
  product: string | null;
  quantity: number | null;
  message: string | null;
  status: InquiryStatus;
  notes: string | null;
  assigned_to: string | null;
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: string;
  order_number: string;
  buyer_name: string;
  buyer_company: string | null;
  buyer_email: string;
  buyer_country: string;
  status: OrderStatus;
  total_amount: number;
  currency: string;
  shipping_address: string | null;
  tracking_number: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  items?: OrderItem[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string | null;
  product_name: string;
  sku: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  size: string | null;
  color: string | null;
}

export interface Country {
  id: string;
  name: string;
  code: string;
  region: string | null;
}

export interface Media {
  id: string;
  name: string;
  url: string;
  folder: string;
  mime_type: string;
  size_bytes: number;
  alt_text: string | null;
  created_by: string | null;
  created_at: string;
}

export interface ActivityLog {
  id: string;
  user_id: string | null;
  action: string;
  entity_type: string;
  entity_id: string | null;
  details: Record<string, unknown> | null;
  created_at: string;
}

export interface DashboardStats {
  totalProducts: number;
  totalCollections: number;
  totalInquiries: number;
  totalOrders: number;
  lowStockCount: number;
  outOfStockCount: number;
  revenue: number;
  pendingInquiries: number;
}

export interface ProductFilters {
  search?: string;
  category?: string;
  collection?: string;
  minPrice?: number;
  maxPrice?: number;
  colors?: string[];
  sizes?: string[];
  status?: ProductStatus;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
