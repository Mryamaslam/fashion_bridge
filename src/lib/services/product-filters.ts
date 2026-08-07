import type { Product, ProductFilters, PaginatedResponse } from "@/types";
import type { Category, Collection } from "@/types";
import { mockCategories, mockCollections } from "@/lib/data/mock";

export function paginate<T>(items: T[], page: number, pageSize: number): PaginatedResponse<T> {
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

export function filterProducts(
  products: Product[],
  filters: ProductFilters,
  categories: Category[] = mockCategories,
  collections: Collection[] = mockCollections
): Product[] {
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
