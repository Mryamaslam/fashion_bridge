export const SITE = {
  name: "Fashion Bridge International",
  shortName: "FBI",
  tagline: "Premium Apparel Export Worldwide",
  description:
    "Fashion Bridge International is a leading B2B apparel and fashion products exporter, delivering premium T-Shirts, Polo Shirts, Hoodies, Denim, Footwear, and Accessories to buyers worldwide.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  email: "export@fashionbridge.com",
  phone: "+1 (555) 123-4567",
  address: "150 Fashion District Blvd, New York, NY 10001, USA",
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "15551234567",
} as const;

export const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About Us" },
  { href: "/products", label: "Products" },
  { href: "/collections", label: "Collections" },
  { href: "/export-services", label: "Export Services" },
  { href: "/contact", label: "Contact" },
] as const;

export const CATEGORIES = [
  { slug: "t-shirts", name: "T-Shirts", icon: "Shirt" },
  { slug: "polo-shirts", name: "Polo Shirts", icon: "Shirt" },
  { slug: "hoodies", name: "Hoodies", icon: "Hoodie" },
  { slug: "shorts", name: "Shorts", icon: "Shorts" },
  { slug: "jeans", name: "Jeans", icon: "Jeans" },
  { slug: "bags", name: "Bags", icon: "Bag" },
  { slug: "shoes", name: "Shoes", icon: "Footprints" },
  { slug: "accessories", name: "Accessories", icon: "Gem" },
] as const;

export const COLLECTIONS = [
  {
    slug: "summer-collection",
    name: "Summer Collection",
    description: "Lightweight, breathable apparel for warm seasons.",
    season: "Summer",
  },
  {
    slug: "winter-collection",
    name: "Winter Collection",
    description: "Premium outerwear and layered essentials.",
    season: "Winter",
  },
  {
    slug: "sports-collection",
    name: "Sports Collection",
    description: "Performance-driven activewear for global retailers.",
    season: "All Season",
  },
  {
    slug: "streetwear-collection",
    name: "Streetwear Collection",
    description: "Urban-inspired styles with export-ready quality.",
    season: "All Season",
  },
  {
    slug: "premium-denim-collection",
    name: "Premium Denim Collection",
    description: "Crafted denim with superior fit and finish.",
    season: "All Season",
  },
  {
    slug: "footwear-collection",
    name: "Footwear Collection",
    description: "Sneakers and footwear for wholesale distribution.",
    season: "All Season",
  },
] as const;

export const EXPORT_SERVICES = [
  {
    title: "OEM Manufacturing",
    description:
      "Custom manufacturing tailored to your brand specifications with scalable production capacity.",
    icon: "Factory",
  },
  {
    title: "Private Label",
    description:
      "Launch your brand with our private label solutions including packaging and labeling.",
    icon: "Tag",
  },
  {
    title: "Wholesale Supply",
    description:
      "Bulk wholesale supply with competitive MOQs and consistent quality across all shipments.",
    icon: "Package",
  },
  {
    title: "International Shipping",
    description:
      "Global logistics network covering 80+ countries with reliable delivery timelines.",
    icon: "Ship",
  },
  {
    title: "Custom Branding",
    description:
      "Embroidery, screen printing, heat transfer, and woven label customization services.",
    icon: "Palette",
  },
] as const;

export const STATS = [
  { value: 80, suffix: "+", label: "Export Countries" },
  { value: 500, suffix: "+", label: "Product SKUs" },
  { value: 15, suffix: "+", label: "Years Experience" },
  { value: 10000, suffix: "+", label: "Monthly Units" },
] as const;

export const SIZES = ["XS", "S", "M", "L", "XL", "XXL", "3XL"] as const;

export const COLORS = [
  "Black",
  "White",
  "Navy",
  "Grey",
  "Red",
  "Blue",
  "Green",
  "Beige",
  "Brown",
  "Gold",
] as const;

export const CURRENCIES = [
  { code: "USD", symbol: "$", name: "US Dollar" },
  { code: "EUR", symbol: "€", name: "Euro" },
  { code: "GBP", symbol: "£", name: "British Pound" },
  { code: "AED", symbol: "د.إ", name: "UAE Dirham" },
] as const;

export const LANGUAGES = [
  { code: "en", name: "English" },
  { code: "es", name: "Español" },
  { code: "fr", name: "Français" },
  { code: "ar", name: "العربية" },
  { code: "zh", name: "中文" },
] as const;

export const EXPORT_COUNTRIES = [
  "United States", "United Kingdom", "Germany", "France", "Italy",
  "Spain", "Netherlands", "UAE", "Saudi Arabia", "Australia",
  "Canada", "Japan", "South Korea", "Brazil", "Mexico",
  "South Africa", "Nigeria", "India", "Pakistan", "Turkey",
] as const;

export const CERTIFICATIONS = [
  "ISO 9001:2015",
  "OEKO-TEX Standard 100",
  "GOTS Certified",
  "BSCI Compliant",
  "SEDEX Audited",
  "WRAP Certified",
] as const;

export const MANUFACTURING_STEPS = [
  { step: 1, title: "Design & Sampling", description: "Technical packs, prototypes, and buyer approvals." },
  { step: 2, title: "Material Sourcing", description: "Premium fabrics sourced from certified suppliers." },
  { step: 3, title: "Production", description: "State-of-the-art manufacturing with QC at every stage." },
  { step: 4, title: "Quality Control", description: "AQL inspection and final quality assurance." },
  { step: 5, title: "Packaging", description: "Export-ready packaging with custom branding options." },
  { step: 6, title: "Global Shipping", description: "Sea, air, and express freight to 80+ countries." },
] as const;

export const WHY_CHOOSE_US = [
  {
    title: "Premium Quality",
    description: "Export-grade materials and rigorous quality control on every order.",
    icon: "Award",
  },
  {
    title: "Competitive Pricing",
    description: "Factory-direct pricing with flexible MOQs for growing brands.",
    icon: "DollarSign",
  },
  {
    title: "Fast Turnaround",
    description: "Efficient production timelines with reliable delivery schedules.",
    icon: "Clock",
  },
  {
    title: "Global Reach",
    description: "Established logistics network shipping to 80+ countries worldwide.",
    icon: "Globe",
  },
  {
    title: "Custom Solutions",
    description: "OEM, private label, and custom branding tailored to your needs.",
    icon: "Settings",
  },
  {
    title: "Dedicated Support",
    description: "Personal account managers for seamless B2B communication.",
    icon: "Headphones",
  },
] as const;

export const TESTIMONIALS = [
  {
    name: "James Mitchell",
    company: "Urban Style Co., UK",
    quote:
      "Fashion Bridge International has been our trusted supplier for 3 years. Consistent quality and reliable shipping.",
    rating: 5,
  },
  {
    name: "Sarah Chen",
    company: "Pacific Retail Group, Australia",
    quote:
      "Their private label service helped us launch our brand in record time. Highly recommended for B2B buyers.",
    rating: 5,
  },
  {
    name: "Ahmed Al-Rashid",
    company: "Gulf Fashion Trading, UAE",
    quote:
      "Excellent OEM capabilities and competitive wholesale pricing. A true partner for international export.",
    rating: 5,
  },
] as const;

export const ORDER_STATUSES = [
  "pending", "confirmed", "processing", "shipped", "delivered", "cancelled",
] as const;

export const INQUIRY_STATUSES = [
  "new", "contacted", "quoted", "closed", "lost",
] as const;

export const PRODUCT_STATUSES = [
  "active", "draft", "archived",
] as const;
