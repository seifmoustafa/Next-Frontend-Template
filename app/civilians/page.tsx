import { CiviliansView } from "@/views/civilians-view";
import { DashboardLayout } from "@/components/layout/dashboard-layout";

export default async function CiviliansPage() {
      
  return (
    <DashboardLayout>
      <CiviliansView />
    </DashboardLayout>
  );
}
