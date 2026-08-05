import { z } from "zod";

export const inquirySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  company: z.string().optional(),
  country: z.string().min(2, "Country is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  product: z.string().optional(),
  quantity: z.union([z.number().min(1), z.nan(), z.undefined()]).optional(),
  message: z.string().optional(),
});

export type InquiryFormData = z.infer<typeof inquirySchema>;

export const contactSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email"),
  subject: z.string().min(3, "Subject is required"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export type ContactFormData = z.infer<typeof contactSchema>;

export const productSchema = z.object({
  name: z.string().min(2, "Product name is required"),
  sku: z.string().min(2, "SKU is required"),
  description: z.string().optional(),
  category_id: z.string().optional(),
  collection_id: z.string().optional(),
  price: z.number().min(0),
  wholesale_price: z.number().min(0),
  moq: z.number().min(1),
  sizes: z.array(z.string()),
  colors: z.array(z.string()),
  material: z.string().optional(),
  stock_quantity: z.number().min(0),
  low_stock_threshold: z.number().min(0),
  images: z.array(z.string()),
  status: z.enum(["active", "draft", "archived"]),
  is_featured: z.boolean(),
});

export type ProductFormData = z.infer<typeof productSchema>;

export const collectionSchema = z.object({
  name: z.string().min(2, "Collection name is required"),
  description: z.string().optional(),
  banner_url: z.string().optional(),
  thumbnail_url: z.string().optional(),
  is_featured: z.boolean(),
  is_seasonal: z.boolean(),
  season: z.string().optional(),
  status: z.enum(["active", "draft", "archived"]),
  sort_order: z.number(),
});

export type CollectionFormData = z.infer<typeof collectionSchema>;

export const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const orderItemSchema = z.object({
  productId: z.string().min(1),
  quantity: z.number().min(1),
  color: z.string().optional(),
  size: z.string().optional(),
});

export const orderSchema = z.object({
  buyer_name: z.string().min(2, "Name is required"),
  buyer_email: z.string().email("Invalid email"),
  buyer_country: z.string().min(2, "Country is required"),
  buyer_company: z.string().optional(),
  shipping_address: z.string().optional(),
  currency: z.string().default("USD"),
  items: z.array(orderItemSchema).min(1, "Cart is empty"),
});

export type OrderFormData = z.infer<typeof orderSchema>;
