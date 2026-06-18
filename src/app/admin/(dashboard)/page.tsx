"use client";

import {
  Package, Layers, MessageSquare, ShoppingCart, AlertTriangle, TrendingUp, DollarSign,
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line,
} from "recharts";
import { AdminHeader } from "@/components/admin/sidebar";
import { useDashboardStats } from "@/hooks/use-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { FadeIn } from "@/components/animations/motion";
import { formatCurrency } from "@/lib/utils";
import { revenueChartData } from "@/lib/data/mock";
import { mockOrders, mockInquiries } from "@/lib/data/mock";

function StatCard({
  title, value, icon: Icon, trend, variant,
}: {
  title: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string }>;
  trend?: string;
  variant?: "default" | "warning" | "danger";
}) {
  return (
    <Card className="border-border/50 transition-shadow hover:shadow-md">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="mt-1 text-2xl font-bold">{value}</p>
            {trend && <p className="mt-1 text-xs text-muted-foreground">{trend}</p>}
          </div>
          <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${
            variant === "warning" ? "bg-amber-100 text-amber-600 dark:bg-amber-900/30" :
            variant === "danger" ? "bg-red-100 text-red-600 dark:bg-red-900/30" :
            "bg-gold/10 text-gold"
          }`}>
            <Icon className="h-6 w-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function AdminDashboardPage() {
  const { data: stats, isLoading } = useDashboardStats();

  return (
    <>
      <AdminHeader title="Dashboard Overview" />
      <div className="p-6 lg:p-8 space-y-8">
        {isLoading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-28 rounded-xl" />
            ))}
          </div>
        ) : (
          <FadeIn>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard title="Total Products" value={stats?.totalProducts || 0} icon={Package} />
              <StatCard title="Collections" value={stats?.totalCollections || 0} icon={Layers} />
              <StatCard title="Inquiries" value={stats?.totalInquiries || 0} icon={MessageSquare} trend={`${stats?.pendingInquiries || 0} pending`} />
              <StatCard title="Revenue" value={formatCurrency(stats?.revenue || 0)} icon={DollarSign} />
            </div>
            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              <StatCard title="Orders" value={stats?.totalOrders || 0} icon={ShoppingCart} />
              <StatCard title="Low Stock" value={stats?.lowStockCount || 0} icon={AlertTriangle} variant="warning" />
              <StatCard title="Out of Stock" value={stats?.outOfStockCount || 0} icon={TrendingUp} variant="danger" />
            </div>
          </FadeIn>
        )}

        <div className="grid gap-6 lg:grid-cols-2">
          <FadeIn delay={0.1}>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Revenue Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={280}>
                  <LineChart data={revenueChartData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis dataKey="month" className="text-xs" />
                    <YAxis className="text-xs" />
                    <Tooltip />
                    <Line type="monotone" dataKey="revenue" stroke="#c9a227" strokeWidth={2} dot={{ fill: "#c9a227" }} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </FadeIn>

          <FadeIn delay={0.2}>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Monthly Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={revenueChartData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis dataKey="month" className="text-xs" />
                    <YAxis className="text-xs" />
                    <Tooltip />
                    <Bar dataKey="orders" fill="#c9a227" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </FadeIn>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <FadeIn delay={0.3}>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Recent Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockOrders.slice(0, 5).map((order) => (
                    <div key={order.id} className="flex items-center justify-between border-b border-border/50 pb-3 last:border-0">
                      <div>
                        <p className="font-medium text-sm">{order.order_number}</p>
                        <p className="text-xs text-muted-foreground">{order.buyer_name}</p>
                      </div>
                      <div className="text-right">
                        <Badge variant="outline">{order.status}</Badge>
                        <p className="mt-1 text-sm font-medium">{formatCurrency(order.total_amount)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </FadeIn>

          <FadeIn delay={0.4}>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Recent Inquiries</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockInquiries.slice(0, 5).map((inquiry) => (
                    <div key={inquiry.id} className="flex items-center justify-between border-b border-border/50 pb-3 last:border-0">
                      <div>
                        <p className="font-medium text-sm">{inquiry.name}</p>
                        <p className="text-xs text-muted-foreground">{inquiry.company || inquiry.email}</p>
                      </div>
                      <Badge variant={inquiry.status === "new" ? "gold" : "outline"}>
                        {inquiry.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </FadeIn>
        </div>
      </div>
    </>
  );
}
