import { UserTypesView } from "@/components/views/user-types-view";
import { DashboardLayout } from "@/components/layout/dashboard-layout";

export default async function UserTypesPage() {

  return (
    <DashboardLayout>
      <UserTypesView />
    </DashboardLayout>
  );
}
