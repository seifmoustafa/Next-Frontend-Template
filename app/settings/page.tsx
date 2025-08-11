import { SettingsView } from "@/components/views/settings-view";
import { DashboardLayout } from "@/components/layout/dashboard-layout";

export default async function SettingsPage() {
  return (
    <DashboardLayout>
      <SettingsView />
    </DashboardLayout>
  );
}
