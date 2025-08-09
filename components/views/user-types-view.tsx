"use client";

import { GenericCrudView } from "@/components/views/generic-crud-view";
import { useUserTypesViewModel } from "@/viewmodels/user-types.viewmodel";
import { useServices } from "@/providers/service-provider";
import { useI18n } from "@/providers/i18n-provider";
import type { UserType } from "@/services/user-type.service";

export function UserTypesView() {
  const { userTypeService } = useServices();
  const { t } = useI18n();
  const viewModel = useUserTypesViewModel(userTypeService);

  const fields = [
    {
      name: "adminTypeName",
      label: t("userTypes.form.name"),
      type: "text",
      placeholder: t("userTypes.form.namePlaceholder"),
      required: true,
    },
  ];

  const columns = [
    {
      key: "adminTypeName",
      label: t("userTypes.name"),
      sortable: true,
    },
  ];

  const actions = [
    {
      label: t("common.edit"),
      onClick: (item: UserType) => viewModel.openEditModal(item),
      variant: "ghost" as const,
    },
    {
      label: t("common.delete"),
      onClick: (item: UserType) => viewModel.deleteItem(item),
      variant: "ghost" as const,
      className: "text-red-600 hover:text-red-700",
    },
  ];

  return (
    <>
      <GenericCrudView
        title={t("userTypes.title")}
        subtitle={t("userTypes.subtitle")}
        columns={columns}
        actions={actions}
        createFields={fields}
        viewModel={viewModel}
      />
      <viewModel.ConfirmationDialog />
    </>
  );
}

