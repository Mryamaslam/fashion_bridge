import type {
  Category,
  Collection,
  DashboardStats,
  Inquiry,
  Order,
  Product,
} from "@/types";
import { IMAGES } from "@/lib/constants/images";

const { collections: col, products: prod } = IMAGES;

export const mockCategories: Category[] = [
  { id: "1", name: "T-Shirts", slug: "t-shirts", description: "Premium cotton and blended tees", image_url: null, sort_order: 1, created_at: "2024-01-01" },
  { id: "2", name: "Polo Shirts", slug: "polo-shirts", description: "Classic and modern polos", image_url: null, sort_order: 2, created_at: "2024-01-01" },
  { id: "3", name: "Hoodies", slug: "hoodies", description: "Fleece and cotton hoodies", image_url: null, sort_order: 3, created_at: "2024-01-01" },
  { id: "4", name: "Shorts", slug: "shorts", description: "Casual and athletic shorts", image_url: null, sort_order: 4, created_at: "2024-01-01" },
  { id: "5", name: "Jeans", slug: "jeans", description: "Premium denim collection", image_url: null, sort_order: 5, created_at: "2024-01-01" },
  { id: "6", name: "Bags", slug: "bags", description: "Fashion bags and totes", image_url: null, sort_order: 6, created_at: "2024-01-01" },
  { id: "7", name: "Shoes", slug: "shoes", description: "Sneakers and footwear", image_url: null, sort_order: 7, created_at: "2024-01-01" },
  { id: "8", name: "Accessories", slug: "accessories", description: "Belts, caps, and more", image_url: null, sort_order: 8, created_at: "2024-01-01" },
];

export const mockCollections: Collection[] = [
  { id: "1", name: "Summer Collection", slug: "summer-collection", description: "Lightweight apparel for warm seasons", banner_url: col.summer.banner, thumbnail_url: col.summer.thumb, is_featured: true, is_seasonal: true, season: "Summer", status: "active", sort_order: 1, created_at: "2024-01-01", updated_at: "2024-01-01" },
  { id: "2", name: "Winter Collection", slug: "winter-collection", description: "Premium outerwear essentials", banner_url: col.winter.banner, thumbnail_url: col.winter.thumb, is_featured: true, is_seasonal: true, season: "Winter", status: "active", sort_order: 2, created_at: "2024-01-01", updated_at: "2024-01-01" },
  { id: "3", name: "Sports Collection", slug: "sports-collection", description: "Performance activewear", banner_url: col.sports.banner, thumbnail_url: col.sports.thumb, is_featured: false, is_seasonal: false, season: "All Season", status: "active", sort_order: 3, created_at: "2024-01-01", updated_at: "2024-01-01" },
  { id: "4", name: "Streetwear Collection", slug: "streetwear-collection", description: "Urban-inspired styles", banner_url: col.streetwear.banner, thumbnail_url: col.streetwear.thumb, is_featured: true, is_seasonal: false, season: "All Season", status: "active", sort_order: 4, created_at: "2024-01-01", updated_at: "2024-01-01" },
  { id: "5", name: "Premium Denim Collection", slug: "premium-denim-collection", description: "Crafted denim excellence", banner_url: col.denim.banner, thumbnail_url: col.denim.thumb, is_featured: false, is_seasonal: false, season: "All Season", status: "active", sort_order: 5, created_at: "2024-01-01", updated_at: "2024-01-01" },
  { id: "6", name: "Footwear Collection", slug: "footwear-collection", description: "Sneakers and footwear", banner_url: col.footwear.banner, thumbnail_url: col.footwear.thumb, is_featured: false, is_seasonal: false, season: "All Season", status: "active", sort_order: 6, created_at: "2024-01-01", updated_at: "2024-01-01" },
];

export const mockProducts: Product[] = [
  { id: "1", name: "Premium Cotton Crew Neck Tee", slug: "premium-cotton-crew-neck-tee", sku: "FBI-TS-001", description: "100% combed cotton crew neck t-shirt with reinforced stitching. Ideal for wholesale and private label.", category_id: "1", collection_id: "1", price: 12.99, wholesale_price: 8.50, moq: 100, sizes: ["S", "M", "L", "XL", "XXL"], colors: ["Black", "White", "Navy", "Grey"], material: "100% Combed Cotton", stock_quantity: 5000, low_stock_threshold: 500, images: [prod.tshirt], status: "active", is_featured: true, created_at: "2024-01-15", updated_at: "2024-06-01" },
  { id: "2", name: "Classic Pique Polo Shirt", slug: "classic-pique-polo-shirt", sku: "FBI-PL-001", description: "Premium pique polo with ribbed collar and cuffs. Available in 10+ colors.", category_id: "2", collection_id: "1", price: 18.99, wholesale_price: 12.00, moq: 100, sizes: ["S", "M", "L", "XL", "XXL"], colors: ["Navy", "White", "Black", "Red"], material: "100% Cotton Pique", stock_quantity: 3200, low_stock_threshold: 300, images: [prod.polo], status: "active", is_featured: true, created_at: "2024-01-20", updated_at: "2024-06-01" },
  { id: "3", name: "Heavyweight Fleece Hoodie", slug: "heavyweight-fleece-hoodie", sku: "FBI-HD-001", description: "400gsm fleece hoodie with kangaroo pocket and drawstring hood.", category_id: "3", collection_id: "2", price: 28.99, wholesale_price: 19.50, moq: 50, sizes: ["S", "M", "L", "XL", "XXL"], colors: ["Black", "Grey", "Navy"], material: "80% Cotton, 20% Polyester", stock_quantity: 1800, low_stock_threshold: 200, images: [prod.hoodie], status: "active", is_featured: true, created_at: "2024-02-01", updated_at: "2024-06-01" },
  { id: "4", name: "Slim Fit Denim Jeans", slug: "slim-fit-denim-jeans", sku: "FBI-JN-001", description: "Premium stretch denim with modern slim fit. Stone wash and raw options.", category_id: "5", collection_id: "5", price: 32.99, wholesale_price: 22.00, moq: 50, sizes: ["28", "30", "32", "34", "36", "38"], colors: ["Blue", "Black", "Grey"], material: "98% Cotton, 2% Elastane", stock_quantity: 2400, low_stock_threshold: 250, images: [prod.jeans], status: "active", is_featured: false, created_at: "2024-02-10", updated_at: "2024-06-01" },
  { id: "5", name: "Canvas Tote Bag", slug: "canvas-tote-bag", sku: "FBI-BG-001", description: "Heavy-duty canvas tote with reinforced handles. Custom print available.", category_id: "6", collection_id: null, price: 9.99, wholesale_price: 5.50, moq: 200, sizes: ["One Size"], colors: ["Natural", "Black", "Navy"], material: "12oz Canvas", stock_quantity: 8000, low_stock_threshold: 1000, images: [prod.bag], status: "active", is_featured: false, created_at: "2024-02-15", updated_at: "2024-06-01" },
  { id: "6", name: "Urban Street Sneakers", slug: "urban-street-sneakers", sku: "FBI-SH-001", description: "Lightweight street sneakers with cushioned sole. Multiple colorways.", category_id: "7", collection_id: "6", price: 45.99, wholesale_price: 32.00, moq: 50, sizes: ["7", "8", "9", "10", "11", "12"], colors: ["White", "Black", "Grey"], material: "Synthetic Upper, Rubber Sole", stock_quantity: 1200, low_stock_threshold: 150, images: [prod.sneakers], status: "active", is_featured: true, created_at: "2024-03-01", updated_at: "2024-06-01" },
  { id: "7", name: "Athletic Performance Shorts", slug: "athletic-performance-shorts", sku: "FBI-SH-002", description: "Moisture-wicking athletic shorts with elastic waistband.", category_id: "4", collection_id: "3", price: 14.99, wholesale_price: 9.50, moq: 100, sizes: ["S", "M", "L", "XL"], colors: ["Black", "Navy", "Red"], material: "Polyester Mesh", stock_quantity: 4500, low_stock_threshold: 400, images: [prod.shorts], status: "active", is_featured: false, created_at: "2024-03-10", updated_at: "2024-06-01" },
  { id: "8", name: "Leather Belt Collection", slug: "leather-belt-collection", sku: "FBI-AC-001", description: "Genuine leather belts with brushed metal buckle.", category_id: "8", collection_id: null, price: 15.99, wholesale_price: 10.00, moq: 100, sizes: ["S", "M", "L", "XL"], colors: ["Brown", "Black"], material: "Genuine Leather", stock_quantity: 35, low_stock_threshold: 50, images: [prod.accessories], status: "active", is_featured: false, created_at: "2024-03-15", updated_at: "2024-06-01" },
  { id: "9", name: "Oversized Streetwear Tee", slug: "oversized-streetwear-tee", sku: "FBI-TS-002", description: "Trendy oversized fit tee with drop shoulder design.", category_id: "1", collection_id: "4", price: 15.99, wholesale_price: 10.50, moq: 100, sizes: ["M", "L", "XL", "XXL"], colors: ["Black", "White", "Beige"], material: "100% Cotton", stock_quantity: 0, low_stock_threshold: 200, images: [prod.streetwearTee], status: "active", is_featured: true, created_at: "2024-04-01", updated_at: "2024-06-01" },
  { id: "10", name: "Waterproof Windbreaker", slug: "waterproof-windbreaker", sku: "FBI-HD-002", description: "Lightweight waterproof windbreaker jacket for outdoor wear.", category_id: "3", collection_id: "2", price: 35.99, wholesale_price: 24.00, moq: 50, sizes: ["S", "M", "L", "XL"], colors: ["Black", "Navy", "Green"], material: "Nylon Shell", stock_quantity: 900, low_stock_threshold: 100, images: [prod.windbreaker], status: "active", is_featured: false, created_at: "2024-04-15", updated_at: "2024-06-01" },
];

export const mockInquiries: Inquiry[] = [
  { id: "1", name: "John Smith", company: "Retail Plus Inc.", country: "United States", email: "john@retailplus.com", phone: "+1 555 0101", product: "Premium Cotton Crew Neck Tee", quantity: 500, message: "Interested in bulk order for summer season.", status: "new", notes: null, assigned_to: null, created_at: "2024-06-10", updated_at: "2024-06-10" },
  { id: "2", name: "Maria Garcia", company: "Moda Europa", country: "Spain", email: "maria@modaeuropa.es", phone: "+34 600 123456", product: "Classic Pique Polo Shirt", quantity: 1000, message: "Need pricing for private label polo shirts.", status: "contacted", notes: "Sent catalog", assigned_to: null, created_at: "2024-06-08", updated_at: "2024-06-09" },
  { id: "3", name: "Ahmed Hassan", company: "Gulf Trading Co.", country: "UAE", email: "ahmed@gulftrading.ae", phone: "+971 50 1234567", product: "Urban Street Sneakers", quantity: 200, message: "Looking for footwear supplier for retail chain.", status: "quoted", notes: "Quote sent: $32/unit", assigned_to: null, created_at: "2024-06-05", updated_at: "2024-06-07" },
];

export const mockOrders: Order[] = [
  { id: "1", order_number: "FBI-ORD-2024-001", buyer_name: "James Mitchell", buyer_company: "Urban Style Co.", buyer_email: "james@urbanstyle.co.uk", buyer_country: "United Kingdom", status: "shipped", total_amount: 4250.00, currency: "USD", shipping_address: "London, UK", tracking_number: "TRK123456789", notes: null, created_at: "2024-05-20", updated_at: "2024-06-01" },
  { id: "2", order_number: "FBI-ORD-2024-002", buyer_name: "Sarah Chen", buyer_company: "Pacific Retail", buyer_email: "sarah@pacificretail.au", buyer_country: "Australia", status: "processing", total_amount: 8900.00, currency: "USD", shipping_address: "Sydney, Australia", tracking_number: null, notes: "Priority order", created_at: "2024-06-01", updated_at: "2024-06-05" },
  { id: "3", order_number: "FBI-ORD-2024-003", buyer_name: "Pierre Dubois", buyer_company: "Paris Fashion House", buyer_email: "pierre@pfh.fr", buyer_country: "France", status: "confirmed", total_amount: 15600.00, currency: "EUR", shipping_address: "Paris, France", tracking_number: null, notes: null, created_at: "2024-06-08", updated_at: "2024-06-08" },
];

export const mockDashboardStats: DashboardStats = {
  totalProducts: mockProducts.length,
  totalCollections: mockCollections.length,
  totalInquiries: mockInquiries.length,
  totalOrders: mockOrders.length,
  lowStockCount: mockProducts.filter(p => p.stock_quantity > 0 && p.stock_quantity <= p.low_stock_threshold).length,
  outOfStockCount: mockProducts.filter(p => p.stock_quantity === 0).length,
  revenue: 28750,
  pendingInquiries: mockInquiries.filter(i => i.status === "new").length,
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
  { name: "Polo Shirt", sales: 3200 },
  { name: "Hoodie", sales: 2800 },
  { name: "Jeans", sales: 2100 },
  { name: "Sneakers", sales: 1800 },
];
