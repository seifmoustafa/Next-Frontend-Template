"use client";

import { GenericCrudView } from "@/components/views/generic-crud-view";
import { useVendorsViewModel } from "@/viewmodels/vendors.viewmodel";
import { useServices } from "@/providers/service-provider";
import { useI18n } from "@/providers/i18n-provider";
import type { Vendor } from "@/services/vendor.service";

export function VendorsView() {
  const { vendorService } = useServices();
  const { t } = useI18n();
  const vm = useVendorsViewModel(vendorService);

  const createFields = [
    {
      name: "vendorName",
      label: t("vendors.form.name"),
      type: "text" as const,
      placeholder: t("vendors.form.namePlaceholder"),
      required: true,
    },
  ];

  const editFields = [
    {
      name: "vendorName",
      label: t("vendors.form.name"),
      type: "text" as const,
      placeholder: t("vendors.form.namePlaceholder"),
      required: true,
    },
    {
      name: "isActive",
      label: t("vendors.form.isActive"),
      type: "switch" as const,
      defaultValue: true,
      required: false,
    },
  ];

  const columns = [
    { key: "vendorName", label: t("vendors.name"), sortable: true },
    //     { key: "isActive", label: t("vendors.isActive"), sortable: true },
    //     { key: "createdTimestamp", label: t("vendors.createdAt"), sortable: true },
  ];

  const actions = [
    {
      label: t("common.edit"),
      onClick: (item: Vendor) => vm.openEditModal(item),
      variant: "ghost" as const,
    },
    {
      label: t("common.delete"),
      onClick: (item: Vendor) => vm.deleteItem(item),
      variant: "ghost" as const,
      className: "text-red-600 hover:text-red-700",
    },
  ];

  return (
    <>
      <GenericCrudView
        title={t("vendors.title")}
        subtitle={t("vendors.subtitle")}
        columns={columns}
        actions={actions}
        createFields={createFields}
        editFields={editFields}
        viewModel={vm}
        pagination={{
          ...vm.pagination,
          onPageChange: vm.changePage,
          onPageSizeChange: vm.changePageSize,
        }}
        search={{
          value: vm.searchTerm,
          onChange: vm.searchVendors,
        }}
      />
      <vm.ConfirmationDialog />
    </>
  );
}
