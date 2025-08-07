import { UserTypesView } from "@/components/views/user-types-view";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { redirect } from "next/navigation";

// Mock auth check - replace with your actual auth logic
async function checkAuth() {
  // Replace this with your actual authentication check
  const isAuthenticated = true; // This should come from your auth system
  if (!isAuthenticated) {
    redirect("/login");
  }
}

export default async function UserTypesPage() {
  await checkAuth();

  return (
    <DashboardLayout>
      <UserTypesView />
    </DashboardLayout>
  );
}
