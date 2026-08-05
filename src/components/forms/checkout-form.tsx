"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCart } from "@/providers/cart-provider";
import { EXPORT_COUNTRIES } from "@/lib/constants/site";

export function CheckoutForm() {
  const router = useRouter();
  const { items, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    buyer_name: "",
    buyer_email: "",
    buyer_country: "",
    buyer_company: "",
    shipping_address: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!items.length) {
      toast.error("Your cart is empty");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          items: items.map((i) => ({
            productId: i.productId,
            quantity: i.quantity,
            color: i.color,
            size: i.size,
          })),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Order failed");
      clearCart();
      toast.success("Order placed successfully", {
        description: `Order ${data.order_number} — stock updated`,
      });
      router.push("/products");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not place order");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-4 border-t pt-6">
      <h3 className="font-semibold">Place wholesale order</h3>
      <p className="text-xs text-muted-foreground">
        Stock is deducted immediately when you confirm the order.
      </p>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="buyer_name">Full name *</Label>
          <Input
            id="buyer_name"
            required
            value={form.buyer_name}
            onChange={(e) => setForm({ ...form, buyer_name: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="buyer_email">Email *</Label>
          <Input
            id="buyer_email"
            type="email"
            required
            value={form.buyer_email}
            onChange={(e) => setForm({ ...form, buyer_email: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="buyer_country">Country *</Label>
          <Input
            id="buyer_country"
            required
            list="countries"
            value={form.buyer_country}
            onChange={(e) => setForm({ ...form, buyer_country: e.target.value })}
          />
          <datalist id="countries">
            {EXPORT_COUNTRIES.map((c) => (
              <option key={c} value={c} />
            ))}
          </datalist>
        </div>
        <div>
          <Label htmlFor="buyer_company">Company</Label>
          <Input
            id="buyer_company"
            value={form.buyer_company}
            onChange={(e) => setForm({ ...form, buyer_company: e.target.value })}
          />
        </div>
      </div>
      <div>
        <Label htmlFor="shipping_address">Shipping address</Label>
        <Textarea
          id="shipping_address"
          rows={2}
          value={form.shipping_address}
          onChange={(e) => setForm({ ...form, shipping_address: e.target.value })}
        />
      </div>
      <Button type="submit" variant="gold" className="w-full" disabled={loading}>
        {loading ? "Placing order…" : "Confirm order & deduct stock"}
      </Button>
    </form>
  );
}
