import type {
  Category,
  Collection,
  DashboardStats,
  Inquiry,
  Order,
  OrderItem,
  Product,
} from "@/types";
import { IMAGES } from "@/lib/constants/images";
import { generateCatalogProducts } from "@/lib/data/catalog";

const { collections: col, categories: catImg } = IMAGES;

/**
 * Product colors/sizes MUST use exact values from COLORS / SIZES in site.ts
 * so /products filters and admin forms work correctly.
 */

export const mockCategories: Category[] = [
  { id: "1", name: "T-Shirts", slug: "t-shirts", description: "Premium cotton and blended tees", image_url: catImg["t-shirts"], sort_order: 1, created_at: "2024-01-01" },
  { id: "2", name: "Polo Shirts", slug: "polo-shirts", description: "Classic and modern polos", image_url: catImg["polo-shirts"], sort_order: 2, created_at: "2024-01-01" },
  { id: "3", name: "Hoodies", slug: "hoodies", description: "Fleece and cotton hoodies", image_url: catImg.hoodies, sort_order: 3, created_at: "2024-01-01" },
  { id: "4", name: "Shorts", slug: "shorts", description: "Casual and athletic shorts", image_url: catImg.shorts, sort_order: 4, created_at: "2024-01-01" },
  { id: "5", name: "Jeans", slug: "jeans", description: "Premium denim collection", image_url: catImg.jeans, sort_order: 5, created_at: "2024-01-01" },
  { id: "6", name: "Bags", slug: "bags", description: "Fashion bags and totes", image_url: catImg.bags, sort_order: 6, created_at: "2024-01-01" },
  { id: "7", name: "Shoes", slug: "shoes", description: "Sneakers and footwear", image_url: catImg.shoes, sort_order: 7, created_at: "2024-01-01" },
  { id: "8", name: "Accessories", slug: "accessories", description: "Belts, caps, and more", image_url: catImg.accessories, sort_order: 8, created_at: "2024-01-01" },
];

export const mockCollections: Collection[] = [
  { id: "1", name: "Summer Collection", slug: "summer-collection", description: "Lightweight apparel for warm seasons", banner_url: col.summer.banner, thumbnail_url: col.summer.thumb, is_featured: true, is_seasonal: true, season: "Summer", status: "active", sort_order: 1, created_at: "2024-01-01", updated_at: "2024-01-01" },
  { id: "2", name: "Winter Collection", slug: "winter-collection", description: "Premium outerwear essentials", banner_url: col.winter.banner, thumbnail_url: col.winter.thumb, is_featured: true, is_seasonal: true, season: "Winter", status: "active", sort_order: 2, created_at: "2024-01-01", updated_at: "2024-01-01" },
  { id: "3", name: "Sports Collection", slug: "sports-collection", description: "Performance activewear", banner_url: col.sports.banner, thumbnail_url: col.sports.thumb, is_featured: false, is_seasonal: false, season: "All Season", status: "active", sort_order: 3, created_at: "2024-01-01", updated_at: "2024-01-01" },
  { id: "4", name: "Streetwear Collection", slug: "streetwear-collection", description: "Urban-inspired styles", banner_url: col.streetwear.banner, thumbnail_url: col.streetwear.thumb, is_featured: true, is_seasonal: false, season: "All Season", status: "active", sort_order: 4, created_at: "2024-01-01", updated_at: "2024-01-01" },
  { id: "5", name: "Premium Denim Collection", slug: "premium-denim-collection", description: "Crafted denim excellence", banner_url: col.denim.banner, thumbnail_url: col.denim.thumb, is_featured: false, is_seasonal: false, season: "All Season", status: "active", sort_order: 5, created_at: "2024-01-01", updated_at: "2024-01-01" },
  { id: "6", name: "Footwear Collection", slug: "footwear-collection", description: "Sneakers and footwear", banner_url: col.footwear.banner, thumbnail_url: col.footwear.thumb, is_featured: false, is_seasonal: false, season: "All Season", status: "active", sort_order: 6, created_at: "2024-01-01", updated_at: "2024-01-01" },
];

/** 30 designs × 8 categories = 240 SKUs — same inventory on web + admin */
export const mockProducts: Product[] = generateCatalogProducts();

export const mockInquiries: Inquiry[] = [
  { id: "1", name: "John Smith", company: "Retail Plus Inc.", country: "United States", email: "john@retailplus.com", phone: "+1 555 0101", product: "Premium Cotton Crew Neck Tee", quantity: 500, message: "Interested in bulk order for summer season.", status: "new", notes: null, assigned_to: null, created_at: "2024-06-10", updated_at: "2024-06-10" },
  { id: "2", name: "Maria Garcia", company: "Moda Europa", country: "Spain", email: "maria@modaeuropa.es", phone: "+34 600 123456", product: "Classic Pique Polo Shirt", quantity: 1000, message: "Need pricing for private label polo shirts.", status: "contacted", notes: "Sent catalog", assigned_to: null, created_at: "2024-06-08", updated_at: "2024-06-09" },
  { id: "3", name: "Ahmed Hassan", company: "Gulf Trading Co.", country: "UAE", email: "ahmed@gulftrading.ae", phone: "+971 50 1234567", product: "Urban Street Sneakers", quantity: 200, message: "Looking for footwear supplier for retail chain.", status: "quoted", notes: "Quote sent: $28/unit", assigned_to: null, created_at: "2024-06-05", updated_at: "2024-06-07" },
  { id: "4", name: "Emma Wilson", company: "ActiveWear UK", country: "United Kingdom", email: "emma@activewear.uk", phone: "+44 7700 900123", product: "Performance Running Shoes", quantity: 300, message: "Need samples and FOB pricing for Q4 sports line.", status: "new", notes: null, assigned_to: null, created_at: "2024-06-12", updated_at: "2024-06-12" },
];

export const mockOrders: Order[] = [
  { id: "1", order_number: "FBI-ORD-2024-001", buyer_name: "James Mitchell", buyer_company: "Urban Style Co.", buyer_email: "james@urbanstyle.co.uk", buyer_country: "United Kingdom", status: "shipped", total_amount: 4250.00, currency: "USD", shipping_address: "London, UK", tracking_number: "TRK123456789", notes: null, created_at: "2024-05-20", updated_at: "2024-06-01" },
  { id: "2", order_number: "FBI-ORD-2024-002", buyer_name: "Sarah Chen", buyer_company: "Pacific Retail", buyer_email: "sarah@pacificretail.au", buyer_country: "Australia", status: "processing", total_amount: 8900.00, currency: "USD", shipping_address: "Sydney, Australia", tracking_number: null, notes: "Priority order", created_at: "2024-06-01", updated_at: "2024-06-05" },
  { id: "3", order_number: "FBI-ORD-2024-003", buyer_name: "Pierre Dubois", buyer_company: "Paris Fashion House", buyer_email: "pierre@pfh.fr", buyer_country: "France", status: "confirmed", total_amount: 15600.00, currency: "EUR", shipping_address: "Paris, France", tracking_number: null, notes: null, created_at: "2024-06-08", updated_at: "2024-06-08" },
];

export const mockOrderItems: OrderItem[] = [];

export const mockDashboardStats: DashboardStats = {
  totalProducts: mockProducts.length,
  totalCollections: mockCollections.length,
  totalInquiries: mockInquiries.length,
  totalOrders: mockOrders.length,
  lowStockCount: mockProducts.filter((p) => p.stock_quantity > 0 && p.stock_quantity <= p.low_stock_threshold).length,
  outOfStockCount: mockProducts.filter((p) => p.stock_quantity === 0).length,
  revenue: 28750,
  pendingInquiries: mockInquiries.filter((i) => i.status === "new").length,
};

export const revenueChartData = [
  { month: "Jan", revenue: 12000, orders: 8 },
  { month: "Feb", revenue: 18500, orders: 12 },
  { month: "Mar", revenue: 15200, orders: 10 },
  { month: "Apr", revenue: 22100, orders: 15 },
  { month: "May", revenue: 28750, orders: 18 },
  { month: "Jun", revenue: 19500, orders: 14 },
];

export const topProductsData = [
  { name: "Cotton Tee", sales: 4500 },
  { name: "Midweight Hoodie", sales: 3600 },
  { name: "Running Shoes", sales: 3400 },
  { name: "Polo Shirt", sales: 3200 },
  { name: "Zip Fleece Hoodie", sales: 3100 },
  { name: "Athletic Shorts", sales: 2900 },
  { name: "Street Sneakers", sales: 2600 },
  { name: "Slim Jeans", sales: 2100 },
];
