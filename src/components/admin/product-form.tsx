"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { productSchema, type ProductFormData } from "@/lib/validations/schemas";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { COLORS, SIZES } from "@/lib/constants/site";
import { useCategories, useAdminCollections } from "@/hooks/use-data";
import { generateSKU } from "@/lib/utils";
import type { Product } from "@/types";

interface ProductFormProps {
  product?: Product | null;
  onSubmit: (data: ProductFormData) => Promise<void>;
}

export function ProductForm({ product, onSubmit }: ProductFormProps) {
  const { data: categories } = useCategories();
  const { data: collections } = useAdminCollections();
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: product ? {
      name: product.name,
      sku: product.sku,
      description: product.description || "",
      category_id: product.category_id || "",
      collection_id: product.collection_id || "",
      price: product.price,
      wholesale_price: product.wholesale_price,
      moq: product.moq,
      sizes: product.sizes,
      colors: product.colors,
      material: product.material || "",
      stock_quantity: product.stock_quantity,
      low_stock_threshold: product.low_stock_threshold,
      images: product.images,
      status: product.status,
      is_featured: product.is_featured,
    } : {
      sku: generateSKU(),
      moq: 100,
      stock_quantity: 0,
      low_stock_threshold: 50,
      sizes: [],
      colors: [],
      images: [],
      status: "active",
      is_featured: false,
      price: 0,
      wholesale_price: 0,
    },
  });

  const selectedColors = watch("colors") || [];
  const selectedSizes = watch("sizes") || [];

  const toggleArrayItem = (field: "colors" | "sizes", value: string) => {
    const current = watch(field) || [];
    const updated = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    setValue(field, updated);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2 md:col-span-2">
          <Label>Product Name *</Label>
          <Input {...register("name")} />
          {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
        </div>
        <div className="space-y-2">
          <Label>SKU *</Label>
          <Input {...register("sku")} />
        </div>
        <div className="space-y-2">
          <Label>Status</Label>
          <Select defaultValue={product?.status || "active"} onValueChange={(v) => setValue("status", v as ProductFormData["status"])}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Category</Label>
          <Select defaultValue={product?.category_id || ""} onValueChange={(v) => setValue("category_id", v)}>
            <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
            <SelectContent>
              {(categories || []).map((c) => (
                <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Collection</Label>
          <Select defaultValue={product?.collection_id || ""} onValueChange={(v) => setValue("collection_id", v)}>
            <SelectTrigger><SelectValue placeholder="Select collection" /></SelectTrigger>
            <SelectContent>
              {(collections || []).map((c) => (
                <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Retail Price</Label>
          <Input type="number" step="0.01" {...register("price", { valueAsNumber: true })} />
        </div>
        <div className="space-y-2">
          <Label>Wholesale Price</Label>
          <Input type="number" step="0.01" {...register("wholesale_price", { valueAsNumber: true })} />
        </div>
        <div className="space-y-2">
          <Label>MOQ</Label>
          <Input type="number" {...register("moq", { valueAsNumber: true })} />
        </div>
        <div className="space-y-2">
          <Label>Stock Quantity</Label>
          <Input type="number" {...register("stock_quantity", { valueAsNumber: true })} />
        </div>
        <div className="space-y-2">
          <Label>Low Stock Threshold</Label>
          <Input type="number" {...register("low_stock_threshold", { valueAsNumber: true })} />
        </div>
        <div className="space-y-2">
          <Label>Material</Label>
          <Input {...register("material")} />
        </div>
        <div className="space-y-2">
          <Label>Image URL</Label>
          <Input {...register("images.0")} placeholder="https://..." />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label>Description</Label>
          <Textarea {...register("description")} rows={3} />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label>Colors</Label>
          <div className="flex flex-wrap gap-2">
            {COLORS.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => toggleArrayItem("colors", color)}
                className={`rounded-full border px-3 py-1 text-xs transition-colors ${
                  selectedColors.includes(color) ? "border-gold bg-gold/10 text-gold" : "border-border"
                }`}
              >
                {color}
              </button>
            ))}
          </div>
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label>Sizes</Label>
          <div className="flex flex-wrap gap-2">
            {SIZES.map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => toggleArrayItem("sizes", size)}
                className={`rounded-full border px-3 py-1 text-xs transition-colors ${
                  selectedSizes.includes(size) ? "border-gold bg-gold/10 text-gold" : "border-border"
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      </div>
      <Button type="submit" variant="gold" disabled={isSubmitting} className="w-full">
        {isSubmitting ? "Saving..." : product ? "Update Product" : "Create Product"}
      </Button>
    </form>
  );
}
