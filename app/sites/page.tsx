import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { SitesView } from "@/views/site-view";

export default async function SitesPage() {
  return (
    <DashboardLayout>
      <SitesView />
    </DashboardLayout>
  );
}
