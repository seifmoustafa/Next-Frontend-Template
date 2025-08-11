import { ProfileView } from "@/views/profile-view";
import { DashboardLayout } from "@/components/layout/dashboard-layout";

export default async function ProfilePage() {
  return (
    <DashboardLayout>
      <ProfileView />
    </DashboardLayout>
  );
}
