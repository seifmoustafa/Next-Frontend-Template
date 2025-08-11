import { ProductsExamplePage } from "@/components/examples/products-example";
import { DashboardLayout } from "@/components/layout/dashboard-layout";

export default function ProductsDemoPage() {
  return (
    <DashboardLayout>
      <ProductsExamplePage />
    </DashboardLayout>
  );
}
