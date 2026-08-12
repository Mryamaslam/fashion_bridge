"use client";

import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Upload, X, Link as LinkIcon, Film } from "lucide-react";
import { productSchema, type ProductFormData } from "@/lib/validations/schemas";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { SafeImage } from "@/components/shared/safe-image";
import { COLORS, SIZES } from "@/lib/constants/site";
import { useCategories, useAdminCollections } from "@/hooks/use-data";
import { generateSKU } from "@/lib/utils";
import { uploadClientMedia } from "@/lib/services/client-data";
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
      video_url: product.video_url || "",
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
      video_url: "",
      status: "active",
      is_featured: false,
      price: 0,
      wholesale_price: 0,
    },
  });

  const selectedColors = watch("colors") || [];
  const selectedSizes = watch("sizes") || [];
  const images = watch("images") || [];
  const videoUrl = watch("video_url") || "";

  const [imageUrlInput, setImageUrlInput] = useState("");
  const [uploadingImages, setUploadingImages] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const imageFileRef = useRef<HTMLInputElement>(null);
  const videoFileRef = useRef<HTMLInputElement>(null);

  const toggleArrayItem = (field: "colors" | "sizes", value: string) => {
    const current = watch(field) || [];
    const updated = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    setValue(field, updated);
  };

  const handleAddImageUrl = () => {
    const url = imageUrlInput.trim();
    if (!url) return;
    setValue("images", [...images, url]);
    setImageUrlInput("");
  };

  const handleRemoveImage = (index: number) => {
    setValue("images", images.filter((_, i) => i !== index));
  };

  const handleUploadImages = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;
    setUploadingImages(true);
    try {
      const uploaded = await Promise.all(
        Array.from(files).map((file) => uploadClientMedia(file, "products"))
      );
      setValue("images", [...images, ...uploaded.map((m) => m.url)]);
      toast.success(`${uploaded.length} image(s) uploaded`);
    } catch {
      toast.error("Image upload failed");
    } finally {
      setUploadingImages(false);
      if (imageFileRef.current) imageFileRef.current.value = "";
    }
  };

  const handleUploadVideo = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingVideo(true);
    try {
      const uploaded = await uploadClientMedia(file, "products");
      setValue("video_url", uploaded.url);
      toast.success("Video uploaded");
    } catch {
      toast.error("Video upload failed");
    } finally {
      setUploadingVideo(false);
      if (videoFileRef.current) videoFileRef.current.value = "";
    }
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
        <div className="space-y-2 md:col-span-2">
          <Label>Description</Label>
          <Textarea {...register("description")} rows={3} />
        </div>
        <div className="space-y-3 md:col-span-2">
          <Label>Product Images</Label>
          {images.length > 0 && (
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6">
              {images.map((url, i) => (
                <div key={`${url}-${i}`} className="relative aspect-square overflow-hidden rounded-lg border bg-muted">
                  <SafeImage src={url} alt={`Image ${i + 1}`} fill className="object-cover" sizes="120px" />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(i)}
                    className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80"
                    aria-label="Remove image"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
          <div className="flex flex-wrap items-center gap-2">
            <input
              ref={imageFileRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleUploadImages}
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={uploadingImages}
              onClick={() => imageFileRef.current?.click()}
            >
              <Upload className="mr-2 h-4 w-4" />
              {uploadingImages ? "Uploading..." : "Upload from device"}
            </Button>
            <div className="flex items-center gap-2">
              <Input
                value={imageUrlInput}
                onChange={(e) => setImageUrlInput(e.target.value)}
                placeholder="Or paste an image URL..."
                className="h-9 w-56"
              />
              <Button type="button" variant="outline" size="sm" onClick={handleAddImageUrl}>
                <LinkIcon className="mr-2 h-4 w-4" /> Add
              </Button>
            </div>
          </div>
        </div>
        <div className="space-y-3 md:col-span-2">
          <Label>Product Video</Label>
          {videoUrl && (
            <div className="relative max-w-sm">
              <video src={videoUrl} controls className="w-full rounded-lg border" />
              <button
                type="button"
                onClick={() => setValue("video_url", "")}
                className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80"
                aria-label="Remove video"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          )}
          <div className="flex flex-wrap items-center gap-2">
            <input
              ref={videoFileRef}
              type="file"
              accept="video/*"
              className="hidden"
              onChange={handleUploadVideo}
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={uploadingVideo}
              onClick={() => videoFileRef.current?.click()}
            >
              <Film className="mr-2 h-4 w-4" />
              {uploadingVideo ? "Uploading..." : "Upload from device"}
            </Button>
            <Input
              {...register("video_url")}
              placeholder="Or paste a video URL..."
              className="h-9 w-56"
            />
          </div>
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
