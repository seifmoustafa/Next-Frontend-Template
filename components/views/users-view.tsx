"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GenericTable } from "@/components/ui/generic-table";
import { GenericModal } from "@/components/ui/generic-modal";
import { UserForm } from "@/components/forms/user-form";
import { useUsersViewModel } from "@/viewmodels/users.viewmodel";
import { useServices } from "@/providers/service-provider";
import { useI18n } from "@/providers/i18n-provider";
import type { User } from "@/services/user.service";
import {
  Plus,
  Search,
  Filter,
  Download,
  UsersIcon,
  RefreshCw,
  Trash2,
  Edit,
} from "lucide-react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { ErrorMessage } from "@/components/ui/error-message";

export function UsersView() {
  const { userService } = useServices();
  const { t } = useI18n();

  const viewModel = useUsersViewModel(userService);
  const {
    users,
    loading,
    error,
    total,
    currentPage,
    searchTerm,
    selectedUsers,
    isCreateModalOpen,
    isEditModalOpen,
    editingUser,
    createUser,
    updateUser,
    deleteUser,
    deleteSelectedUsers,
    toggleUserSelection,
    toggleAllUsers,
    openEditModal,
    closeEditModal,
    setIsCreateModalOpen,
    searchUsers,
    changePage,
    refreshUsers,
  } = viewModel;

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
      render: (value: string) => (
        <span
          className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
            value === "SuperAdmin"
              ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
              : value === "Admin"
              ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
              : "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
          }`}
        >
          {value}
        </span>
      ),
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
      onClick: (user: User) => deleteUser(user.id),
      variant: "ghost" as const,
      className: "text-red-600 hover:text-red-700",
    },
  ];

  if (loading && users.length === 0) {
    return <LoadingSpinner />;
  }

  if (error && users.length === 0) {
    return <ErrorMessage message={error} onRetry={refreshUsers} />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            {t("users.title")}
          </h1>
          <p className="text-muted-foreground text-base sm:text-lg">
            إدارة المستخدمين والصلاحيات
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          {selectedUsers.length > 0 && (
            <Button
              onClick={deleteSelectedUsers}
              variant="destructive"
              size="lg"
              className="flex-1 sm:flex-none"
            >
              <Trash2 className="w-5 h-5 mr-2 rtl:mr-0 rtl:ml-2" />
              حذف المحدد ({selectedUsers.length})
            </Button>
          )}
          <Button
            onClick={refreshUsers}
            variant="outline"
            size="lg"
            className="hover-lift bg-transparent flex-1 sm:flex-none"
          >
            <RefreshCw className="w-5 h-5 mr-2 rtl:mr-0 rtl:ml-2" />
            تحديث
          </Button>
          <Button
            onClick={() => setIsCreateModalOpen(true)}
            className="gradient-primary hover-lift flex-1 sm:flex-none"
            size="lg"
          >
            <Plus className="w-5 h-5 mr-2 rtl:mr-0 rtl:ml-2" />
            {t("users.addUser")}
          </Button>
        </div>
      </div>

      {/* Stats Card */}
      <Card className="glass border-0 hover-lift">
        <CardContent className="p-6">
          <div className="flex items-center space-x-4 rtl:space-x-reverse">
            <div className="p-3 rounded-xl bg-primary/20">
              <UsersIcon className="w-8 h-8 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{total}</p>
              <p className="text-muted-foreground">إجمالي المستخدمين</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card className="glass border-0 hover-lift">
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <CardTitle className="text-xl">المستخدمون ({total})</CardTitle>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
              <div className="relative">
                <Search className="absolute left-3 rtl:left-auto rtl:right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder={t("users.searchPlaceholder")}
                  className="pl-10 rtl:pl-4 rtl:pr-10 w-full sm:w-80 bg-muted/50 border-0"
                  value={searchTerm}
                  onChange={(e) => searchUsers(e.target.value)}
                />
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="hover-lift bg-transparent"
                >
                  <Filter className="w-4 h-4" />
                </Button>

                <Button
                  variant="outline"
                  size="icon"
                  className="hover-lift bg-transparent"
                >
                  <Download className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0 sm:p-6">
          <GenericTable
            data={users}
            columns={columns}
            actions={actions}
            loading={loading}
            pagination={{
              currentPage,
              totalPages: Math.ceil(total / 10),
              onPageChange: changePage,
            }}
            selectable={true}
            selectedItems={selectedUsers}
            onSelectionChange={(selected) => {
              // Handle selection change
              selected.forEach((id) => {
                if (!selectedUsers.includes(id)) {
                  toggleUserSelection(id);
                }
              });
              selectedUsers.forEach((id) => {
                if (!selected.includes(id)) {
                  toggleUserSelection(id);
                }
              });
            }}
            searchPlaceholder={t("users.searchPlaceholder")}
            emptyMessage={t("users.noUsers")}
          />
        </CardContent>
      </Card>

      {/* Create User Modal */}
      <GenericModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        title={t("users.addUser")}
        size="lg"
      >
        <UserForm
          onSubmit={createUser}
          onCancel={() => setIsCreateModalOpen(false)}
          isEdit={false}
        />
      </GenericModal>

      {/* Edit User Modal */}
      <GenericModal
        open={isEditModalOpen}
        onOpenChange={closeEditModal}
        title={`تعديل ${editingUser?.firstName} ${editingUser?.lastName}`}
        size="lg"
      >
        {editingUser && (
          <UserForm
            initialData={editingUser}
            onSubmit={(data) => updateUser(editingUser.id, data)}
            onCancel={closeEditModal}
            isEdit={true}
          />
        )}
      </GenericModal>
    </div>
  );
}
