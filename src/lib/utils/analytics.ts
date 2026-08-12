import type { Order, OrderItem } from "@/types";

const MONTH_LABELS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** Groups orders by month (last 6 calendar months, oldest first), summing revenue and counting orders. */
export function buildRevenueSeries(orders: Order[], months = 6) {
  const now = new Date();
  const buckets: { key: string; month: string; revenue: number; orders: number }[] = [];
  for (let i = months - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    buckets.push({ key: `${d.getFullYear()}-${d.getMonth()}`, month: MONTH_LABELS[d.getMonth()], revenue: 0, orders: 0 });
  }
  const byKey = new Map(buckets.map((b) => [b.key, b]));

  for (const order of orders) {
    const d = new Date(order.created_at);
    const key = `${d.getFullYear()}-${d.getMonth()}`;
    const bucket = byKey.get(key);
    if (!bucket) continue;
    bucket.revenue += Number(order.total_amount) || 0;
    bucket.orders += 1;
  }

  return buckets.map(({ month, revenue, orders: count }) => ({ month, revenue, orders: count }));
}

/** Aggregates order line items by product name, ranked by total revenue. */
export function buildTopProducts(orderItems: OrderItem[], limit = 8) {
  const byProduct = new Map<string, number>();
  for (const item of orderItems) {
    const key = item.product_name;
    byProduct.set(key, (byProduct.get(key) || 0) + Number(item.total_price) || 0);
  }
  return Array.from(byProduct.entries())
    .map(([name, sales]) => ({ name, sales }))
    .sort((a, b) => b.sales - a.sales)
    .slice(0, limit);
}
