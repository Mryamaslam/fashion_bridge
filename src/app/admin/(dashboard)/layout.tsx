import { AdminSidebar } from "@/components/admin/sidebar";
import { AdminGuard } from "@/components/admin/admin-guard";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminGuard>
      <div className="flex min-h-screen">
        <AdminSidebar />
        <div className="flex-1 overflow-auto">{children}</div>
      </div>
    </AdminGuard>
  );
}
