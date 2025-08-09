import { VendorsView } from "@/components/views/vendors-view";
import { DashboardLayout } from "@/components/layout/dashboard-layout";

export default async function VendorsPage() {
  return (
    <DashboardLayout>
      <VendorsView />
    </DashboardLayout>
  );
}
