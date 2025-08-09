"use client";

import { useState, useEffect } from "react";
import { GenericCrudView } from "@/components/views/generic-crud-view";
import { useUsersViewModel } from "@/viewmodels/users.viewmodel";
import { useServices } from "@/providers/service-provider";
import { useI18n } from "@/providers/i18n-provider";
import type { User } from "@/services/user.service";
import type { UserType } from "@/services/user-type.service";
import { Input } from "@/components/ui/input";

export function UsersView() {
  const { userService, userTypeService } = useServices();
  const { t } = useI18n();
  const viewModel = useUsersViewModel(userService);
  const [userTypes, setUserTypes] = useState<UserType[]>([]);

  useEffect(() => {
    userTypeService
      .getUserTypes()
      .then(setUserTypes)
      .catch((e) => console.error("Failed to load user types", e));
  }, [userTypeService]);

  const userTypeOptions = userTypes.map((type) => ({
    value: type.id,
    label: type.adminTypeName,
  }));

  const createFields = [
    { name: "username", label: t("users.username"), type: "text", placeholder: t("users.form.usernamePlaceholder"), required: true },
    { name: "password", label: t("users.form.password"), type: "password", placeholder: t("users.form.passwordPlaceholder"), required: true },
    { name: "firstName", label: t("users.firstName"), type: "text", placeholder: t("users.form.firstNamePlaceholder"), required: true },
    { name: "lastName", label: t("users.lastName"), type: "text", placeholder: t("users.form.lastNamePlaceholder"), required: true },
    { name: "phoneNumber", label: t("users.phoneNumber"), type: "text", placeholder: t("users.form.phoneNumberPlaceholder"), required: true },
    { name: "userTypeId", label: t("users.adminType"), type: "select", options: userTypeOptions, placeholder: t("users.form.userTypePlaceholder"), required: true },
  ];

  const editFields = [
    { name: "username", label: t("users.username"), type: "text", placeholder: t("users.form.usernamePlaceholder"), required: true },
    { name: "firstName", label: t("users.firstName"), type: "text", placeholder: t("users.form.firstNamePlaceholder"), required: true },
    { name: "lastName", label: t("users.lastName"), type: "text", placeholder: t("users.form.lastNamePlaceholder"), required: true },
    { name: "phoneNumber", label: t("users.phoneNumber"), type: "text", placeholder: t("users.form.phoneNumberPlaceholder"), required: true },
    { name: "userTypeId", label: t("users.adminType"), type: "select", options: userTypeOptions, placeholder: t("users.form.userTypePlaceholder"), required: true },
  ];

  const columns = [
    { key: "username", label: t("users.username"), sortable: true },
    { key: "firstName", label: t("users.firstName"), sortable: true },
    { key: "lastName", label: t("users.lastName"), sortable: true },
    { key: "phoneNumber", label: t("users.phoneNumber"), sortable: false },
    { key: "adminTypeName", label: t("users.adminType"), sortable: true },
  ];

  const actions = [
    {
      label: t("common.edit"),
      onClick: (item: User) => viewModel.openEditModal(item),
      variant: "ghost" as const,
    },
    {
      label: t("common.delete"),
      onClick: (item: User) => viewModel.deleteItem(item.id),
      variant: "ghost" as const,
      className: "text-red-600 hover:text-red-700",
    },
  ];

  const searchComponent = (
    <div className="flex items-center gap-2">
      <Input
        value={viewModel.searchTerm}
        onChange={(e) => viewModel.searchUsers(e.target.value)}
        placeholder={t("users.searchPlaceholder")}
        className="max-w-xs"
      />
    </div>
  );

  return (
    <GenericCrudView
      title={t("users.title")}
      subtitle={t("users.subtitle")}
      columns={columns}
      actions={actions}
      createFields={createFields}
      editFields={editFields}
      viewModel={viewModel}
      pagination={{
        ...viewModel.pagination,
        onPageChange: viewModel.changePage,
        onPageSizeChange: viewModel.changePageSize,
      }}
      searchComponent={searchComponent}
    />
  );
}

