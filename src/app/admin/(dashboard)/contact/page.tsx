"use client";

import { Download, Mail } from "lucide-react";
import { toast } from "sonner";
import { AdminHeader } from "@/components/admin/sidebar";
import { useContactMessages } from "@/hooks/use-data";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate } from "@/lib/utils";
import { exportToCSV } from "@/lib/utils/export";

export default function AdminContactPage() {
  const { data: messages, isLoading } = useContactMessages();

  const handleExportCSV = () => {
    if (!messages?.length) {
      toast.error("No messages to export");
      return;
    }
    exportToCSV(
      `fbi-contact-messages-${Date.now()}.csv`,
      messages.map((m) => ({
        name: m.name,
        email: m.email,
        subject: m.subject,
        message: m.message,
        date: m.created_at,
      }))
    );
    toast.success("Messages exported");
  };

  return (
    <>
      <AdminHeader title="Contact Messages" />
      <div className="p-6 lg:p-8 space-y-6">
        <div className="flex justify-end">
          <Button variant="outline" size="sm" onClick={handleExportCSV}>
            <Download className="mr-2 h-4 w-4" /> Export CSV
          </Button>
        </div>
        <div className="space-y-4">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-24 rounded-xl" />
            ))
          ) : messages?.length ? (
            messages.map((message) => (
              <div key={message.id} className="rounded-xl border p-5">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="font-semibold">{message.subject}</p>
                    <p className="text-sm text-muted-foreground">
                      {message.name} · {message.email}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <p className="text-xs text-muted-foreground">{formatDate(message.created_at)}</p>
                    <Button variant="ghost" size="icon" asChild>
                      <a href={`mailto:${message.email}?subject=Re: ${message.subject}`}>
                        <Mail className="h-4 w-4" />
                      </a>
                    </Button>
                  </div>
                </div>
                <p className="mt-3 text-sm text-muted-foreground whitespace-pre-wrap">{message.message}</p>
              </div>
            ))
          ) : (
            <p className="py-12 text-center text-muted-foreground">No contact messages yet.</p>
          )}
        </div>
      </div>
    </>
  );
}
