"use client";

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from "recharts";
import { AdminHeader } from "@/components/admin/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { revenueChartData, topProductsData } from "@/lib/data/mock";

const COLORS = ["#c9a227", "#e8d48b", "#9a7b1a", "#0a0a0a", "#737373"];

export default function AdminAnalyticsPage() {
  return (
    <>
      <AdminHeader title="Analytics & Reports" />
      <div className="p-6 lg:p-8 space-y-6">
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader><CardTitle>Revenue Trend</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={revenueChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="revenue" fill="#c9a227" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Top Products</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={topProductsData} dataKey="sales" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                    {topProductsData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
        <Card>
          <CardHeader><CardTitle>Export Reports</CardTitle></CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Generate PDF and CSV export reports for products, inquiries, orders, and inventory from the respective management pages.
            </p>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
