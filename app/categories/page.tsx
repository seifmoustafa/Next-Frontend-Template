import { CategoriesView } from "@/views/categories-view";
import { DashboardLayout } from "@/components/layout/dashboard-layout";

export default async function CategorysPage() {
  return (
    <DashboardLayout>
      <CategoriesView />
    </DashboardLayout>
  );
}
