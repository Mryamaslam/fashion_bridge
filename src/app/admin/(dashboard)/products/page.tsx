"use client";

import { useState } from "react";
import { Plus, Search, Edit, Trash2, Copy, Download } from "lucide-react";
import { toast } from "sonner";
import { AdminHeader } from "@/components/admin/sidebar";
import { useAdminProducts, useProductMutations, useCategories } from "@/hooks/use-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { ProductForm } from "@/components/admin/product-form";
import { formatCurrency } from "@/lib/utils";
import { exportToCSV } from "@/lib/utils/export";
import type { Product } from "@/types";

export default function AdminProductsPage() {
  const { data: products, isLoading } = useAdminProducts();
  const { data: categories } = useCategories();
  const { create, update, remove } = useProductMutations();
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const filtered = (products || []).filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase())
  );

  const categoryCounts = (categories || []).map((cat) => ({
    ...cat,
    count: (products || []).filter((p) => p.category_id === cat.id).length,
  }));

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this product?")) return;
    try {
      await remove.mutateAsync(id);
      toast.success("Product deleted");
    } catch {
      toast.error("Failed to delete product");
    }
  };

  const handleDuplicate = async (product: Product) => {
    try {
      await create.mutateAsync({
        ...product,
        name: `${product.name} (Copy)`,
        sku: `${product.sku}-COPY`,
        id: undefined,
      });
      toast.success("Product duplicated");
    } catch {
      toast.error("Failed to duplicate product");
    }
  };

  const getCategoryName = (id: string | null) =>
    (categories || []).find((c) => c.id === id)?.name || "—";

  const handleExportCSV = () => {
    if (!filtered.length) {
      toast.error("No products to export");
      return;
    }
    exportToCSV(
      `fbi-products-${Date.now()}.csv`,
      filtered.map((p) => ({
        name: p.name,
        sku: p.sku,
        category: getCategoryName(p.category_id ?? null),
        wholesale_price: p.wholesale_price,
        moq: p.moq,
        stock: p.stock_quantity,
        status: p.status,
      }))
    );
    toast.success("Products exported");
  };

  return (
    <>
      <AdminHeader title="Product Management" />
      <div className="p-6 lg:p-8 space-y-6">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8">
          {categoryCounts.map((cat) => (
            <div key={cat.id} className="rounded-lg border bg-muted/30 px-4 py-3">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{cat.name}</p>
              <p className="mt-1 text-2xl font-bold text-gold">{cat.count}</p>
              <p className="text-xs text-muted-foreground">designs in stock</p>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative max-w-sm flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleExportCSV}>
              <Download className="mr-2 h-4 w-4" /> Export CSV
            </Button>
            <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) setEditingProduct(null); }}>
              <DialogTrigger asChild>
                <Button variant="gold" size="sm">
                  <Plus className="mr-2 h-4 w-4" /> Add Product
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>{editingProduct ? "Edit Product" : "Create Product"}</DialogTitle>
                </DialogHeader>
                <ProductForm
                  product={editingProduct}
                  onSubmit={async (data) => {
                    try {
                      if (editingProduct) {
                        await update.mutateAsync({ id: editingProduct.id, ...data });
                        toast.success("Product updated");
                      } else {
                        await create.mutateAsync(data);
                        toast.success("Product created");
                      }
                      setDialogOpen(false);
                      setEditingProduct(null);
                    } catch {
                      toast.error("Operation failed");
                    }
                  }}
                />
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <p className="text-sm text-muted-foreground">
          Showing {filtered.length} of {(products || []).length} products — same inventory as the public website.
        </p>

        <div className="overflow-x-auto rounded-xl border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="px-4 py-3 text-left font-medium">Product</th>
                <th className="px-4 py-3 text-left font-medium">SKU</th>
                <th className="px-4 py-3 text-left font-medium">Category</th>
                <th className="px-4 py-3 text-left font-medium">Price</th>
                <th className="px-4 py-3 text-left font-medium">Stock</th>
                <th className="px-4 py-3 text-left font-medium">Status</th>
                <th className="px-4 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}><td colSpan={7} className="px-4 py-3"><Skeleton className="h-8" /></td></tr>
                ))
              ) : filtered.map((product) => (
                <tr key={product.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3 font-medium">{product.name}</td>
                  <td className="px-4 py-3 text-muted-foreground">{product.sku}</td>
                  <td className="px-4 py-3">{getCategoryName(product.category_id ?? null)}</td>
                  <td className="px-4 py-3">{formatCurrency(product.wholesale_price)}</td>
                  <td className="px-4 py-3">
                    <span className={
                      product.stock_quantity === 0 ? "text-destructive font-medium" :
                      product.stock_quantity <= product.low_stock_threshold ? "text-amber-600 font-medium" :
                      ""
                    }>
                      {product.stock_quantity}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={product.status === "active" ? "success" : "outline"}>
                      {product.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" onClick={() => { setEditingProduct(product); setDialogOpen(true); }}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDuplicate(product)}>
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(product.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
