"use client";

import { useState } from "react";
import { toast } from "sonner";
import { AdminHeader } from "@/components/admin/sidebar";
import { Button } from "@/components/ui/button";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { formatCurrency, formatDate } from "@/lib/utils";
import { exportOrdersPDF } from "@/lib/utils/export";
import { mockOrders } from "@/lib/data/mock";
import { ORDER_STATUSES } from "@/lib/constants/site";
import { Download } from "lucide-react";
import type { Order, OrderStatus } from "@/types";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>(mockOrders);

  const handleExportInvoices = async () => {
    if (!orders.length) {
      toast.error("No orders to export");
      return;
    }
    try {
      await exportOrdersPDF(orders);
      toast.success("Invoices exported as PDF");
    } catch {
      toast.error("Failed to export invoices");
    }
  };

  const handleStatusChange = (id: string, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status, updated_at: new Date().toISOString() } : o))
    );
    toast.success("Order status updated");
  };

  return (
    <>
      <AdminHeader title="Order Management" />
      <div className="p-6 lg:p-8 space-y-6">
        <div className="flex justify-end">
          <Button variant="outline" size="sm" onClick={handleExportInvoices}>
            <Download className="mr-2 h-4 w-4" /> Export Invoices
          </Button>
        </div>
        <div className="overflow-x-auto rounded-xl border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="px-4 py-3 text-left font-medium">Order #</th>
                <th className="px-4 py-3 text-left font-medium">Buyer</th>
                <th className="px-4 py-3 text-left font-medium">Country</th>
                <th className="px-4 py-3 text-left font-medium">Amount</th>
                <th className="px-4 py-3 text-left font-medium">Status</th>
                <th className="px-4 py-3 text-left font-medium">Tracking</th>
                <th className="px-4 py-3 text-left font-medium">Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-b last:border-0 hover:bg-muted/30">
                  <td className="px-4 py-3 font-medium">{order.order_number}</td>
                  <td className="px-4 py-3">
                    <p>{order.buyer_name}</p>
                    <p className="text-xs text-muted-foreground">{order.buyer_company}</p>
                  </td>
                  <td className="px-4 py-3">{order.buyer_country}</td>
                  <td className="px-4 py-3 font-medium">{formatCurrency(order.total_amount, order.currency)}</td>
                  <td className="px-4 py-3">
                    <Select
                      value={order.status}
                      onValueChange={(v) => handleStatusChange(order.id, v as OrderStatus)}
                    >
                      <SelectTrigger className="h-8 w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {ORDER_STATUSES.map((s) => (
                          <SelectItem key={s} value={s}>{s}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{order.tracking_number || "—"}</td>
                  <td className="px-4 py-3 text-muted-foreground">{formatDate(order.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
