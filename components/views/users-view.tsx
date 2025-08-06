"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { GenericModal } from "@/components/ui/generic-modal";
import { GenericTable } from "@/components/ui/generic-table";
import { UserForm } from "@/components/forms/user-form";
import { Plus, Edit, Trash2 } from "lucide-react";
import { useUsersViewModel } from "@/viewmodels/users.viewmodel";
import { useI18n } from "@/providers/i18n-provider";
import type { User } from "@/services/user.service";

export function UsersView() {
  const { t } = useI18n();
  const {
    users,
    loading,
    selectedUsers,
    isModalOpen,
    modalMode,
    selectedUser,
    loadUsers,
    handleCreateUser,
    handleUpdateUser,
    handleDeleteUser,
    handleDeleteSelected,
    setSelectedUsers,
    openCreateModal,
    openEditModal,
    closeModal,
  } = useUsersViewModel();

  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const filteredUsers = users.filter(
    (user) =>
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    {
      key: "username",
      label: t("users.username"),
      sortable: true,
    },
    {
      key: "firstName",
      label: t("users.firstName"),
      sortable: true,
    },
    {
      key: "lastName",
      label: t("users.lastName"),
      sortable: true,
    },
    {
      key: "phoneNumber",
      label: t("users.phoneNumber"),
      sortable: false,
    },
    {
      key: "adminTypeName",
      label: t("users.adminType"),
      sortable: true,
    },
  ];

  const actions = [
    {
      label: t("common.edit"),
      icon: Edit,
      onClick: (user: User) => openEditModal(user),
      variant: "ghost" as const,
    },
    {
      label: t("common.delete"),
      icon: Trash2,
      onClick: (user: User) => handleDeleteUser(user.id),
      variant: "ghost" as const,
      className: "text-red-600 hover:text-red-700",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">{t("users.title")}</h1>
          <p className="text-muted-foreground">{t("users.description")}</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          {selectedUsers.length > 0 && (
            <Button
              variant="destructive"
              onClick={handleDeleteSelected}
              className="h-10"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              حذف المحدد ({selectedUsers.length})
            </Button>
          )}
          <Button onClick={openCreateModal} className="h-10 gradient-primary">
            <Plus className="h-4 w-4 mr-2" />
            {t("users.addUser")}
          </Button>
        </div>
      </div>

      <GenericTable
        data={filteredUsers}
        columns={columns}
        actions={actions}
        loading={loading}
        searchable
        selectable
        selectedItems={selectedUsers}
        onSelectionChange={setSelectedUsers}
        searchPlaceholder={t("users.searchPlaceholder")}
        emptyMessage={t("users.noUsers")}
      />

      <GenericModal
        open={isModalOpen}
        onOpenChange={closeModal}
        title={
          modalMode === "create" ? t("users.addUser") : t("users.editUser")
        }
        size="lg"
      >
        <UserForm
          initialData={selectedUser}
          onSubmit={
            modalMode === "create" ? handleCreateUser : handleUpdateUser
          }
          onCancel={closeModal}
          isEdit={modalMode === "edit"}
        />
      </GenericModal>
    </div>
  );
}
