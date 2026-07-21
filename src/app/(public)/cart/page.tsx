"use client";

import Link from "next/link";
import { ShoppingCart, Trash2, Minus, Plus, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { FadeIn } from "@/components/animations/motion";
import { SafeImage } from "@/components/shared/safe-image";
import { Button } from "@/components/ui/button";
import { useCart } from "@/providers/cart-provider";
import { useApp } from "@/providers/app-provider";
import { formatCurrency } from "@/lib/utils";
import { IMAGES } from "@/lib/constants/images";

export default function CartPage() {
  const { items, subtotal, updateQuantity, removeItem, clearCart, itemCount } = useCart();
  const { currency } = useApp();

  const inquiryHref = (() => {
    if (!items.length) return "/inquiry";
    const summary = items
      .map((i) => `${i.name} (${i.sku}) x${i.quantity}`)
      .join("; ");
    return `/inquiry?product=${encodeURIComponent(summary.slice(0, 400))}&quantity=${itemCount}`;
  })();

  return (
    <>
      <section className="bg-primary pt-28 pb-16">
        <div className="container mx-auto px-4">
          <FadeIn>
            <h1 className="font-display text-4xl font-bold text-white md:text-5xl">Cart</h1>
            <p className="mt-4 max-w-2xl text-white/70">
              Review your wholesale selection, then request a quote.
            </p>
          </FadeIn>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4">
          {!items.length ? (
            <div className="mx-auto max-w-md py-20 text-center">
              <ShoppingCart className="mx-auto h-12 w-12 text-muted-foreground" />
              <h2 className="mt-4 font-display text-2xl font-semibold">Your cart is empty</h2>
              <p className="mt-2 text-muted-foreground">
                Browse the catalog and add products to start a wholesale order.
              </p>
              <Button asChild variant="gold" className="mt-6">
                <Link href="/products">Browse Products</Link>
              </Button>
            </div>
          ) : (
            <div className="grid gap-10 lg:grid-cols-[1fr_320px]">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">{itemCount} units in cart</p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      clearCart();
                      toast.success("Cart cleared");
                    }}
                  >
                    Clear cart
                  </Button>
                </div>

                {items.map((item) => (
                  <div
                    key={item.productId}
                    className="flex flex-col gap-4 rounded-xl border bg-card p-4 sm:flex-row sm:items-center"
                  >
                    <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-muted">
                      <SafeImage
                        src={item.image || IMAGES.placeholder}
                        alt={item.name}
                        fill
                        className="object-cover"
                        sizes="96px"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <Link
                        href={`/products?search=${encodeURIComponent(item.name)}`}
                        className="font-semibold hover:text-gold transition-colors"
                      >
                        {item.name}
                      </Link>
                      <p className="text-xs text-muted-foreground">SKU: {item.sku}</p>
                      <p className="mt-1 text-sm font-medium">
                        {formatCurrency(item.wholesale_price, currency.code)} / unit
                      </p>
                      <p className="text-xs text-muted-foreground">MOQ: {item.moq}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center rounded-md border">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                          aria-label="Decrease quantity"
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-10 text-center text-sm font-medium">{item.quantity}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          aria-label="Increase quantity"
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                      <p className="w-24 text-right text-sm font-semibold">
                        {formatCurrency(item.wholesale_price * item.quantity, currency.code)}
                      </p>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="text-destructive"
                        onClick={() => {
                          removeItem(item.productId);
                          toast.success("Removed from cart");
                        }}
                        aria-label="Remove item"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <aside className="h-fit rounded-xl border bg-card p-6 lg:sticky lg:top-24">
                <h2 className="font-semibold">Order summary</h2>
                <div className="mt-4 flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal (wholesale)</span>
                  <span className="font-semibold">{formatCurrency(subtotal, currency.code)}</span>
                </div>
                <p className="mt-3 text-xs text-muted-foreground">
                  Final pricing, shipping, and MOQ confirmation happen when you request a quote.
                </p>
                <Button asChild variant="gold" className="mt-6 w-full">
                  <Link href={inquiryHref}>
                    Request Quote <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" className="mt-3 w-full">
                  <Link href="/products">Continue shopping</Link>
                </Button>
              </aside>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
