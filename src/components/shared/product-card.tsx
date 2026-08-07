"use client";

import { useRouter } from "next/navigation";
import { ShoppingCart } from "lucide-react";
import { toast } from "sonner";
import { cn, formatCurrency } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScaleOnHover } from "@/components/animations/motion";
import { SafeImage } from "@/components/shared/safe-image";
import type { Product } from "@/types";
import { useApp } from "@/providers/app-provider";
import { useCart } from "@/providers/cart-provider";
import { getProductCardImage } from "@/lib/utils/product-images";

interface ProductCardProps {
  product: Product;
  categoryName?: string;
  className?: string;
}

export function ProductCard({ product, categoryName, className }: ProductCardProps) {
  const router = useRouter();
  const { currency } = useApp();
  const { addItem } = useCart();
  const image = getProductCardImage(product);
  const isOutOfStock = product.stock_quantity === 0;
  const isLowStock =
    !isOutOfStock && product.stock_quantity <= product.low_stock_threshold;

  const goToProduct = () => router.push(`/products/${product.slug}`);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isOutOfStock) {
      toast.error("This product is out of stock");
      return;
    }
    addItem(product);
    toast.success(`Added ${product.name} to cart`, {
      description: `MOQ ${product.moq} units added`,
      action: {
        label: "View cart",
        onClick: () => {
          window.location.href = "/cart";
        },
      },
    });
  };

  return (
    <ScaleOnHover>
      <Card
        className={cn("group cursor-pointer overflow-hidden border-border/50 transition-shadow hover:shadow-xl", className)}
        onClick={goToProduct}
        role="link"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            goToProduct();
          }
        }}
      >
        <div className="relative aspect-[3/4] overflow-hidden bg-muted">
          <SafeImage
            src={image}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute left-3 top-3 flex flex-col gap-1">
            {product.is_featured && <Badge variant="gold">Featured</Badge>}
            {isOutOfStock && <Badge variant="destructive">Out of Stock</Badge>}
            {isLowStock && <Badge variant="warning">Low Stock</Badge>}
          </div>
          <div className="absolute inset-x-0 bottom-0 translate-y-full bg-gradient-to-t from-black/80 to-transparent p-4 transition-transform duration-300 group-hover:translate-y-0">
            <Button
              type="button"
              variant="gold"
              size="sm"
              className="w-full"
              disabled={isOutOfStock}
              onClick={handleAddToCart}
            >
              <ShoppingCart className="mr-1 h-4 w-4" />
              Add to Cart
            </Button>
          </div>
        </div>
        <CardContent className="p-4">
          {categoryName && (
            <p className="text-xs font-medium uppercase tracking-wider text-gold">{categoryName}</p>
          )}
          <h3 className="mt-1 font-semibold leading-tight line-clamp-2 group-hover:text-gold transition-colors">
            {product.name}
          </h3>
          <p className="mt-1 text-xs text-muted-foreground">SKU: {product.sku}</p>
          {product.colors?.length > 0 && (
            <p className="mt-2 text-xs text-muted-foreground line-clamp-1">
              Colors: {product.colors.join(", ")}
            </p>
          )}
          {product.sizes?.length > 0 && (
            <p className="text-xs text-muted-foreground line-clamp-1">
              Sizes: {product.sizes.slice(0, 8).join(", ")}
              {product.sizes.length > 8 ? "…" : ""}
            </p>
          )}
          <div className="mt-3 flex items-center justify-between gap-2">
            <div>
              <p className="text-lg font-bold">{formatCurrency(product.wholesale_price, currency.code)}</p>
              <p className="text-xs text-muted-foreground">MOQ: {product.moq} units</p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={isOutOfStock}
              className="shrink-0"
              onClick={handleAddToCart}
            >
              <ShoppingCart className="mr-1 h-3.5 w-3.5" />
              Add
            </Button>
          </div>
        </CardContent>
      </Card>
    </ScaleOnHover>
  );
}
