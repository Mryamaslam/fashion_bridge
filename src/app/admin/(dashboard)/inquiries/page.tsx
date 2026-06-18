"use client";

import { Download, Mail } from "lucide-react";
import { toast } from "sonner";
import { AdminHeader } from "@/components/admin/sidebar";
import { useInquiries, useUpdateInquiry } from "@/hooks/use-data";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { formatDate } from "@/lib/utils";
import { exportToCSV } from "@/lib/utils/export";
import { INQUIRY_STATUSES } from "@/lib/constants/site";
import type { InquiryStatus } from "@/types";

export default function AdminInquiriesPage() {
  const { data: inquiries, isLoading } = useInquiries();
  const updateInquiry = useUpdateInquiry();

  const handleExportCSV = () => {
    if (!inquiries?.length) {
      toast.error("No inquiries to export");
      return;
    }
    exportToCSV(
      `fbi-inquiries-${Date.now()}.csv`,
      inquiries.map((i) => ({
        name: i.name,
        company: i.company || "",
        email: i.email,
        country: i.country,
        product: i.product || "",
        quantity: i.quantity || "",
        status: i.status,
        date: i.created_at,
      }))
    );
    toast.success("Inquiries exported");
  };

  const handleStatusChange = async (id: string, status: InquiryStatus) => {
    try {
      await updateInquiry.mutateAsync({ id, status });
      toast.success("Status updated");
    } catch {
      toast.error("Failed to update status");
    }
  };

  return (
    <>
      <AdminHeader title="Buyer Inquiries" />
      <div className="p-6 lg:p-8 space-y-6">
        <div className="flex justify-end">
          <Button variant="outline" size="sm" onClick={handleExportCSV}>
            <Download className="mr-2 h-4 w-4" /> Export CSV
          </Button>
        </div>
        <div className="overflow-x-auto rounded-xl border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="px-4 py-3 text-left font-medium">Buyer</th>
                <th className="px-4 py-3 text-left font-medium">Company</th>
                <th className="px-4 py-3 text-left font-medium">Country</th>
                <th className="px-4 py-3 text-left font-medium">Product</th>
                <th className="px-4 py-3 text-left font-medium">Qty</th>
                <th className="px-4 py-3 text-left font-medium">Status</th>
                <th className="px-4 py-3 text-left font-medium">Date</th>
                <th className="px-4 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <tr key={i}><td colSpan={8} className="px-4 py-3"><Skeleton className="h-8" /></td></tr>
                ))
              ) : (inquiries || []).map((inquiry) => (
                <tr key={inquiry.id} className="border-b last:border-0 hover:bg-muted/30">
                  <td className="px-4 py-3">
                    <p className="font-medium">{inquiry.name}</p>
                    <p className="text-xs text-muted-foreground">{inquiry.email}</p>
                  </td>
                  <td className="px-4 py-3">{inquiry.company || "—"}</td>
                  <td className="px-4 py-3">{inquiry.country}</td>
                  <td className="px-4 py-3">{inquiry.product || "—"}</td>
                  <td className="px-4 py-3">{inquiry.quantity || "—"}</td>
                  <td className="px-4 py-3">
                    <Select
                      value={inquiry.status}
                      onValueChange={(v) => handleStatusChange(inquiry.id, v as InquiryStatus)}
                    >
                      <SelectTrigger className="h-8 w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {INQUIRY_STATUSES.map((s) => (
                          <SelectItem key={s} value={s}>{s}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{formatDate(inquiry.created_at)}</td>
                  <td className="px-4 py-3 text-right">
                    <Button variant="ghost" size="icon" asChild>
                      <a href={`mailto:${inquiry.email}?subject=Re: Your inquiry to Fashion Bridge International`}>
                        <Mail className="h-4 w-4" />
                      </a>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
