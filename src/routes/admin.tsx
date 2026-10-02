import { createFileRoute } from "@tanstack/react-router";
import { useAdminAuth } from "@/lib/admin-auth";
import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { AdminLogin } from "@/components/admin/AdminLogin";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "ISHOOTS CMS Admin Panel" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminPage,
});

function AdminPage() {
  const { isAuthenticated, login } = useAdminAuth();

  if (!isAuthenticated) {
    return <AdminLogin onLogin={login} />;
  }

  return <AdminDashboard />;
}
