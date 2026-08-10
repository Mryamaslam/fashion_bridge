"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { IS_STATIC_EXPORT } from "@/lib/constants/static-export";
import {
  getClientProducts,
  getClientAllProducts,
  getClientDashboardStats,
  getClientInquiries,
  submitClientInquiry,
  createClientProduct,
  updateClientProduct,
  deleteClientProduct,
  updateClientInquiry,
  getClientCategories,
  getClientAllCollections,
} from "@/lib/services/client-data";
import type { ProductFilters, Product, Inquiry, InquiryStatus, Category, Collection } from "@/types";

/** GitHub Pages has no API routes — read/write Supabase from the browser */
const useClientLayer = IS_STATIC_EXPORT;

export function useProducts(filters: ProductFilters = {}, page = 1) {
  return useQuery({
    queryKey: ["products", filters, page],
    staleTime: 0,
    refetchOnMount: "always",
    queryFn: async () => {
      if (useClientLayer) {
        return getClientProducts(filters, page);
      }
      const params = new URLSearchParams();
      if (filters.search) params.set("search", filters.search);
      if (filters.category) params.set("category", filters.category);
      if (filters.collection) params.set("collection", filters.collection);
      if (filters.minPrice) params.set("minPrice", String(filters.minPrice));
      if (filters.maxPrice) params.set("maxPrice", String(filters.maxPrice));
      if (filters.colors?.length) params.set("colors", filters.colors.join(","));
      if (filters.sizes?.length) params.set("sizes", filters.sizes.join(","));
      params.set("page", String(page));
      const res = await fetch(`/api/products?${params}`);
      if (!res.ok) throw new Error("Failed to fetch products");
      return res.json();
    },
  });
}

export function useAdminProducts() {
  return useQuery({
    queryKey: ["admin-products"],
    staleTime: 0,
    refetchOnMount: "always",
    queryFn: async () => {
      if (useClientLayer) {
        return getClientAllProducts();
      }
      const res = await fetch("/api/admin/products");
      if (!res.ok) throw new Error("Failed to fetch products");
      return res.json() as Promise<Product[]>;
    },
  });
}

/** Real categories — used for admin category assignment + display names (IDs are DB UUIDs, not the mock "1".."8" set) */
export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    staleTime: 5 * 60 * 1000,
    queryFn: async () => {
      if (useClientLayer) return getClientCategories();
      const res = await fetch("/api/categories");
      if (!res.ok) throw new Error("Failed to fetch categories");
      return res.json() as Promise<Category[]>;
    },
  });
}

/** All collections (incl. drafts) — for the admin product form's collection picker */
export function useAdminCollections() {
  return useQuery({
    queryKey: ["admin-collections"],
    staleTime: 5 * 60 * 1000,
    queryFn: async () => {
      if (useClientLayer) return getClientAllCollections();
      const res = await fetch("/api/collections");
      if (!res.ok) throw new Error("Failed to fetch collections");
      return res.json() as Promise<Collection[]>;
    },
  });
}

export function useDashboardStats() {
  return useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: async () => {
      if (useClientLayer) {
        return getClientDashboardStats();
      }
      const res = await fetch("/api/admin/stats");
      if (!res.ok) throw new Error("Failed to fetch stats");
      return res.json();
    },
  });
}

export function useInquiries() {
  return useQuery({
    queryKey: ["inquiries"],
    queryFn: async () => {
      if (useClientLayer) {
        return getClientInquiries();
      }
      const res = await fetch("/api/admin/inquiries");
      if (!res.ok) throw new Error("Failed to fetch inquiries");
      return res.json() as Promise<Inquiry[]>;
    },
  });
}

export function useCreateInquiry() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Record<string, unknown>) => {
      if (useClientLayer) {
        return submitClientInquiry(data);
      }
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to submit inquiry");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inquiries"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
    },
  });
}

export function useProductMutations() {
  const queryClient = useQueryClient();

  const create = useMutation({
    mutationFn: async (data: Partial<Product>) => {
      if (useClientLayer) {
        return createClientProduct(data);
      }
      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to create product");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
      queryClient.invalidateQueries({ queryKey: ["featured-products"] });
    },
  });

  const update = useMutation({
    mutationFn: async ({ id, ...data }: Partial<Product> & { id: string }) => {
      if (useClientLayer) {
        return updateClientProduct(id, data);
      }
      const res = await fetch(`/api/admin/products/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to update product");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
      queryClient.invalidateQueries({ queryKey: ["featured-products"] });
    },
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      if (useClientLayer) {
        return deleteClientProduct(id);
      }
      const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete product");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
      queryClient.invalidateQueries({ queryKey: ["featured-products"] });
    },
  });

  return { create, update, remove };
}

export function useUpdateInquiry() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...data }: { id: string; status?: InquiryStatus; notes?: string }) => {
      if (useClientLayer) {
        return updateClientInquiry(id, data);
      }
      const res = await fetch(`/api/admin/inquiries/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to update inquiry");
      return res.json();
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["inquiries"] }),
  });
}
