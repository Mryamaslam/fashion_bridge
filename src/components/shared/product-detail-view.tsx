"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ShoppingCart, Check } from "lucide-react";
import { toast } from "sonner";
import { SafeImage } from "@/components/shared/safe-image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn, formatCurrency } from "@/lib/utils";
import { getProductColorPresentations } from "@/lib/utils/product-images";
import { useApp } from "@/providers/app-provider";
import { useCart } from "@/providers/cart-provider";
import type { Product } from "@/types";

interface ProductDetailViewProps {
  product: Product;
  categoryName?: string;
}

export function ProductDetailView({ product, categoryName }: ProductDetailViewProps) {
  const { currency } = useApp();
  const { addItem } = useCart();
  const colorPresentations = getProductColorPresentations(product);

  const [selectedColor, setSelectedColor] = useState(colorPresentations[0]?.color ?? "");
  const [selectedSize, setSelectedSize] = useState(product.sizes[0] ?? "");
  const [activeImage, setActiveImage] = useState<string | null>(null);

  const activePresentation =
    colorPresentations.find((c) => c.color === selectedColor) ?? colorPresentations[0];

  // Extra photos beyond the one already shown as the main image.
  const mainImage = activePresentation?.image;
  const galleryImages = (product.images || []).filter(
    (url) => /^https?:\/\//i.test(url) && url !== mainImage
  );

  const selectColor = (color: string) => {
    setSelectedColor(color);
    setActiveImage(null);
  };

  const isOutOfStock = product.stock_quantity === 0;
  const isLowStock =
    !isOutOfStock && product.stock_quantity <= product.low_stock_threshold;

  const handleAddToCart = () => {
    if (isOutOfStock) {
      toast.error("This product is out of stock");
      return;
    }
    addItem(product, { color: selectedColor, size: selectedSize });
    toast.success(`Added ${product.name} to cart`, {
      description: `${selectedColor}${selectedSize ? ` · ${selectedSize}` : ""} · MOQ ${product.moq} units`,
      action: {
        label: "View cart",
        onClick: () => {
          window.location.href = "/cart";
        },
      },
    });
  };

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <Link
        href="/products"
        className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-gold"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Products
      </Link>

      <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
        {/* Main image */}
        <div>
          <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-muted">
            <SafeImage
              src={activeImage || activePresentation?.image}
              alt={`${product.name} — ${selectedColor}`}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
            <div className="absolute left-4 top-4 flex flex-col gap-2">
              {product.is_featured && <Badge variant="gold">Featured</Badge>}
              {isOutOfStock && <Badge variant="destructive">Out of Stock</Badge>}
              {isLowStock && <Badge variant="warning">Low Stock</Badge>}
            </div>
            {selectedColor && (
              <div className="absolute bottom-4 left-4">
                <Badge variant="secondary" className="bg-black/60 text-white backdrop-blur-sm">
                  {selectedColor}
                </Badge>
              </div>
            )}
          </div>

          {/* Color thumbnails */}
          {colorPresentations.length > 1 && (
            <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
              {colorPresentations.map(({ color, image }) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => selectColor(color)}
                  className={cn(
                    "relative h-20 w-20 shrink-0 overflow-hidden rounded-lg border-2 transition-all",
                    !activeImage && selectedColor === color
                      ? "border-gold ring-2 ring-gold/30"
                      : "border-transparent opacity-70 hover:opacity-100"
                  )}
                  aria-label={`View ${color}`}
                >
                  <SafeImage
                    src={image}
                    alt={`${product.name} — ${color}`}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                </button>
              ))}
            </div>
          )}

          {/* Additional product photos uploaded in admin */}
          {galleryImages.length > 0 && (
            <div className="mt-4">
              <p className="mb-2 text-sm font-medium text-muted-foreground">More Photos</p>
              <div className="flex gap-3 overflow-x-auto pb-2">
                {galleryImages.map((image, i) => (
                  <button
                    key={`${image}-${i}`}
                    type="button"
                    onClick={() => setActiveImage(image)}
                    className={cn(
                      "relative h-20 w-20 shrink-0 overflow-hidden rounded-lg border-2 transition-all",
                      activeImage === image
                        ? "border-gold ring-2 ring-gold/30"
                        : "border-transparent opacity-70 hover:opacity-100"
                    )}
                    aria-label={`View photo ${i + 1}`}
                  >
                    <SafeImage src={image} alt={`${product.name} — photo ${i + 1}`} fill className="object-cover" sizes="80px" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Product video */}
          {product.video_url && (
            <div className="mt-6">
              <p className="mb-2 text-sm font-medium text-muted-foreground">Product Video</p>
              <video src={product.video_url} controls className="w-full rounded-xl border" />
            </div>
          )}
        </div>

        {/* Product info */}
        <div>
          {categoryName && (
            <p className="text-xs font-medium uppercase tracking-wider text-gold">{categoryName}</p>
          )}
          <h1 className="font-display mt-2 text-3xl font-bold md:text-4xl">{product.name}</h1>
          <p className="mt-2 text-sm text-muted-foreground">SKU: {product.sku}</p>

          <div className="mt-6 flex items-baseline gap-3">
            <p className="text-3xl font-bold text-gold">
              {formatCurrency(product.wholesale_price * currency.rate, currency.code)}
            </p>
            <p className="text-sm text-muted-foreground">
              Retail: {formatCurrency(product.price * currency.rate, currency.code)}
            </p>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">MOQ: {product.moq} units</p>
          <p className="mt-1 text-sm">
            <span className="font-medium">In stock:</span>{" "}
            <span className={isOutOfStock ? "text-destructive font-semibold" : isLowStock ? "text-amber-600 font-semibold" : "text-green-600 font-semibold"}>
              {product.stock_quantity.toLocaleString()} units
            </span>
          </p>

          {product.description && (
            <p className="mt-6 leading-relaxed text-muted-foreground">{product.description}</p>
          )}

          {product.material && (
            <p className="mt-4 text-sm">
              <span className="font-medium">Material:</span>{" "}
              <span className="text-muted-foreground">{product.material}</span>
            </p>
          )}

          {/* Color selector */}
          {colorPresentations.length > 0 && (
            <div className="mt-8">
              <p className="mb-3 text-sm font-medium">
                Color: <span className="text-gold">{selectedColor}</span>
              </p>
              <div className="flex flex-wrap gap-2">
                {colorPresentations.map(({ color, swatch }) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => selectColor(color)}
                    className={cn(
                      "flex h-10 items-center gap-2 rounded-full border px-3 text-sm transition-all",
                      selectedColor === color
                        ? "border-gold bg-gold/10 text-gold"
                        : "border-border hover:border-gold/50"
                    )}
                  >
                    <span
                      className="h-5 w-5 rounded-full border border-black/10"
                      style={{ backgroundColor: swatch }}
                    />
                    {color}
                    {selectedColor === color && <Check className="h-3.5 w-3.5" />}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Size selector */}
          {product.sizes.length > 0 && (
            <div className="mt-8">
              <p className="mb-3 text-sm font-medium">
                Size: <span className="text-gold">{selectedSize}</span>
              </p>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setSelectedSize(size)}
                    className={cn(
                      "min-w-[3rem] rounded-md border px-3 py-2 text-sm font-medium transition-all",
                      selectedSize === size
                        ? "border-gold bg-gold text-black"
                        : "border-border hover:border-gold/50"
                    )}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mt-10 flex flex-wrap gap-4">
            <Button
              variant="gold"
              size="lg"
              disabled={isOutOfStock}
              onClick={handleAddToCart}
              className="min-w-[200px]"
            >
              <ShoppingCart className="mr-2 h-5 w-5" />
              Add to Cart
            </Button>
            <Button asChild variant="gold-outline" size="lg">
              <Link href="/inquiry">Request Quote</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* All colorways — complete presentation grid */}
      {colorPresentations.length > 0 && (
        <section className="mt-16 border-t pt-16 md:mt-24">
          <h2 className="font-display text-2xl font-bold md:text-3xl">
            Available Colorways
          </h2>
          <p className="mt-2 text-muted-foreground">
            Full presentation of all {colorPresentations.length} available colors for this product.
          </p>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {colorPresentations.map(({ color, image, swatch }) => (
              <button
                key={color}
                type="button"
                onClick={() => {
                  selectColor(color);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className={cn(
                  "group overflow-hidden rounded-xl border text-left transition-all hover:shadow-lg",
                  selectedColor === color ? "border-gold ring-2 ring-gold/20" : "border-border/50"
                )}
              >
                <div className="relative aspect-[3/4] overflow-hidden bg-muted">
                  <SafeImage
                    src={image}
                    alt={`${product.name} — ${color} colorway`}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                    <div className="flex items-center gap-2">
                      <span
                        className="h-4 w-4 rounded-full border border-white/30"
                        style={{ backgroundColor: swatch }}
                      />
                      <span className="font-medium text-white">{color}</span>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
