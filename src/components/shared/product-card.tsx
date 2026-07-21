"use client";

import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { cn, formatCurrency, getWhatsAppLink } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScaleOnHover } from "@/components/animations/motion";
import { SafeImage } from "@/components/shared/safe-image";
import type { Product } from "@/types";
import { useApp } from "@/providers/app-provider";
import { SITE } from "@/lib/constants/site";
import { IMAGES } from "@/lib/constants/images";

interface ProductCardProps {
  product: Product;
  categoryName?: string;
  className?: string;
}

export function ProductCard({ product, categoryName, className }: ProductCardProps) {
  const { currency } = useApp();
  const image = product.images[0] || IMAGES.placeholder;
  const isOutOfStock = product.stock_quantity === 0;
  const isLowStock =
    !isOutOfStock && product.stock_quantity <= product.low_stock_threshold;

  return (
    <ScaleOnHover>
      <Card className={cn("group overflow-hidden border-border/50 transition-shadow hover:shadow-xl", className)}>
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
            <Button asChild variant="gold" size="sm" className="w-full">
              <Link href={`/inquiry?product=${encodeURIComponent(product.name)}`}>
                <MessageCircle className="mr-1 h-4 w-4" />
                Send Inquiry
              </Link>
            </Button>
          </div>
        </div>
        <CardContent className="p-4">
          {categoryName && (
            <p className="text-xs font-medium uppercase tracking-wider text-gold">{categoryName}</p>
          )}
          <h3 className="mt-1 font-semibold leading-tight line-clamp-2 group-hover:text-gold transition-colors">
            <Link href={`/products?search=${encodeURIComponent(product.name)}`}>
              {product.name}
            </Link>
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
          <div className="mt-3 flex items-center justify-between">
            <div>
              <p className="text-lg font-bold">{formatCurrency(product.wholesale_price, currency.code)}</p>
              <p className="text-xs text-muted-foreground">MOQ: {product.moq} units</p>
            </div>
            <Button
              asChild
              variant="outline"
              size="sm"
              className="opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <a
                href={getWhatsAppLink(SITE.whatsapp, `Hi, I'm interested in ${product.name} (${product.sku})`)}
                target="_blank"
                rel="noopener noreferrer"
              >
                WhatsApp
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </ScaleOnHover>
  );
}
