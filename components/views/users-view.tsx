"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GenericTable } from "@/components/ui/generic-table";
import { GenericModal } from "@/components/ui/generic-modal";
import { GenericForm, type FieldConfig } from "@/components/forms/generic-form";
import { useUsersViewModel } from "@/viewmodels/users.viewmodel";
import { useServices } from "@/providers/service-provider";
import { useI18n } from "@/providers/i18n-provider";
import { useSettings } from "@/providers/settings-provider";
import type { User, CreateUserRequest, UpdateUserRequest } from "@/services/user.service";
import type { UserType } from "@/services/user-type.service";
import { Plus, Search, Filter, Download, UsersIcon, RefreshCw, Trash2, Edit } from 'lucide-react';
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { ErrorMessage } from "@/components/ui/error-message";
import { cn } from "@/lib/utils";

export function UsersView() {
  const { userService, userTypeService } = useServices();
  const { t } = useI18n();
  const settings = useSettings();
  const [userTypes, setUserTypes] = useState<UserType[]>([]);

  const viewModel = useUsersViewModel(userService);
  const {
    users,
    loading,
    error,
    pagination,
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

  // Load user types for select options
  useEffect(() => {
    const loadTypes = async () => {
      try {
        const types = await userTypeService.getUserTypes();
        setUserTypes(types);
      } catch (error) {
        console.error("Failed to load user types", error);
      }
    };
    loadTypes();
  }, [userTypeService]);

  const userTypeOptions = userTypes.map((type) => ({
    value: type.id,
    label: type.adminTypeName,
  }));

  const createFields: FieldConfig[] = [
    {
      name: "username",
      label: t("users.username"),
      type: "text",
      placeholder: t("users.form.usernamePlaceholder"),
      required: true,
    },
    {
      name: "password",
      label: t("users.form.password"),
      type: "password",
      placeholder: t("users.form.passwordPlaceholder"),
      required: true,
    },
    {
      name: "firstName",
      label: t("users.firstName"),
      type: "text",
      placeholder: t("users.form.firstNamePlaceholder"),
      required: true,
    },
    {
      name: "lastName",
      label: t("users.lastName"),
      type: "text",
      placeholder: t("users.form.lastNamePlaceholder"),
      required: true,
    },
    {
      name: "phoneNumber",
      label: t("users.phoneNumber"),
      type: "text",
      placeholder: t("users.form.phoneNumberPlaceholder"),
      required: true,
    },
    {
      name: "userTypeId",
      label: t("users.adminType"),
      type: "select",
      options: userTypeOptions,
      placeholder: t("users.form.userTypePlaceholder"),
      required: true,
    },
  ];

  const editFields: FieldConfig[] = [
    {
      name: "username",
      label: t("users.username"),
      type: "text",
      placeholder: t("users.form.usernamePlaceholder"),
      required: true,
    },
    {
      name: "firstName",
      label: t("users.firstName"),
      type: "text",
      placeholder: t("users.form.firstNamePlaceholder"),
      required: true,
    },
    {
      name: "lastName",
      label: t("users.lastName"),
      type: "text",
      placeholder: t("users.form.lastNamePlaceholder"),
      required: true,
    },
    {
      name: "phoneNumber",
      label: t("users.phoneNumber"),
      type: "text",
      placeholder: t("users.form.phoneNumberPlaceholder"),
      required: true,
    },
    {
      name: "adminTypeId",
      label: t("users.adminType"),
      type: "select",
      options: userTypeOptions,
      placeholder: t("users.form.userTypePlaceholder"),
      required: true,
    },
  ];

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
      render: (value: string) => {
        const getBadgeClasses = () => {
          const baseClasses = "inline-flex px-3 py-1 text-xs font-medium";
          
          let styleClasses = "";
          switch (settings.badgeStyle) {
            case "rounded":
              styleClasses = "rounded-full";
              break;
            case "square":
              styleClasses = "rounded-none";
              break;
            case "pill":
              styleClasses = "rounded-full px-4";
              break;
            default:
              styleClasses = "rounded-md";
          }

          let colorClasses = "";
          if (value === "SuperAdmin") {
            colorClasses = "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
          } else if (value === "Admin") {
            colorClasses = "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
          } else {
            colorClasses = "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
          }

          return cn(baseClasses, styleClasses, colorClasses);
        };

        return (
          <span className={getBadgeClasses()}>
            {value}
          </span>
        );
      },
    },
  ];

  const actions = [
    {
      label: t("common.edit"),
      onClick: (user: User) => openEditModal(user),
      variant: "ghost" as const,
    },
    {
      label: t("common.delete"),
      onClick: (user: User) => deleteUser(user.id),
      variant: "ghost" as const,
      className: "text-red-600 hover:text-red-700",
    },
  ];

  // Get spacing classes based on settings
  const getSpacingClasses = () => {
    switch (settings.spacingSize) {
      case "compact":
        return "space-y-3";
      case "comfortable":
        return "space-y-8";
      case "spacious":
        return "space-y-12";
      default:
        return "space-y-6";
    }
  };

  // Get card classes based on settings
  const getCardClasses = () => {
    const baseClasses = "hover-lift transition-all duration-200";
    
    switch (settings.cardStyle) {
      case "glass":
        return cn(baseClasses, "bg-white/10 backdrop-blur border-white/20");
      case "solid":
        return cn(baseClasses, "bg-muted border-0");
      case "bordered":
        return cn(baseClasses, "border-2");
      case "elevated":
        return cn(baseClasses, "shadow-lg border-0");
      default:
        return cn(baseClasses, "border-0");
    }
  };

  // Get button size based on settings
  const getButtonSize = () => {
    switch (settings.spacingSize) {
      case "compact":
        return "sm";
      case "comfortable":
      case "spacious":
        return "lg";
      default:
        return "default";
    }
  };

  if (loading && users.length === 0) {
    return <LoadingSpinner />;
  }

  if (error && users.length === 0) {
    return <ErrorMessage message={error} onRetry={refreshUsers} />;
  }

  return (
    <div className={getSpacingClasses()}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className={cn("space-y-2", settings.spacingSize === "compact" ? "space-y-1" : "space-y-2")}>
          <h1 className={cn(
            "font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent",
            settings.fontSize === "small" ? "text-2xl sm:text-3xl" :
            settings.fontSize === "large" ? "text-4xl sm:text-5xl" :
            "text-3xl sm:text-4xl"
          )}>
            {t("users.title")}
          </h1>
          <p className={cn(
            "text-muted-foreground",
            settings.fontSize === "small" ? "text-sm sm:text-base" :
            settings.fontSize === "large" ? "text-lg sm:text-xl" :
            "text-base sm:text-lg"
          )}>
            إدارة المستخدمين والصلاحيات
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          {selectedUsers.length > 0 && (
            <Button
              onClick={deleteSelectedUsers}
              variant="destructive"
              size={getButtonSize()}
              className="flex-1 sm:flex-none"
            >
              <Trash2 className="w-5 h-5 mr-2 rtl:mr-0 rtl:ml-2" />
              حذف المحدد ({selectedUsers.length})
            </Button>
          )}
          <Button
            onClick={refreshUsers}
            variant="outline"
            size={getButtonSize()}
            className="hover-lift bg-transparent flex-1 sm:flex-none"
          >
            <RefreshCw className="w-5 h-5 mr-2 rtl:mr-0 rtl:ml-2" />
            تحديث
          </Button>
          <Button
            onClick={() => setIsCreateModalOpen(true)}
            className="gradient-primary hover-lift flex-1 sm:flex-none"
            size={getButtonSize()}
          >
            <Plus className="w-5 h-5 mr-2 rtl:mr-0 rtl:ml-2" />
            {t("users.addUser")}
          </Button>
        </div>
      </div>

      {/* Stats Card */}
      <Card className={getCardClasses()}>
        <CardContent className={cn(
          settings.spacingSize === "compact" ? "p-4" :
          settings.spacingSize === "comfortable" ? "p-8" :
          settings.spacingSize === "spacious" ? "p-10" :
          "p-6"
        )}>
          <div className="flex items-center space-x-4 rtl:space-x-reverse">
            <div className={cn(
              "rounded-xl bg-primary/20",
              settings.spacingSize === "compact" ? "p-2" :
              settings.spacingSize === "comfortable" ? "p-4" :
              settings.spacingSize === "spacious" ? "p-5" :
              "p-3"
            )}>
              <UsersIcon className={cn(
                "text-primary",
                settings.spacingSize === "compact" ? "w-6 h-6" :
                settings.spacingSize === "comfortable" ? "w-10 h-10" :
                settings.spacingSize === "spacious" ? "w-12 h-12" :
                "w-8 h-8"
              )} />
            </div>
            <div>
              <p className={cn(
                "font-bold",
                settings.fontSize === "small" ? "text-xl" :
                settings.fontSize === "large" ? "text-3xl" :
                "text-2xl"
              )}>{pagination.itemCount}</p>
              <p className="text-muted-foreground">إجمالي المستخدمين</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card className={getCardClasses()}>
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <CardTitle className={cn(
              settings.fontSize === "small" ? "text-lg" :
              settings.fontSize === "large" ? "text-2xl" :
              "text-xl"
            )}>المستخدمون ({pagination.itemCount})</CardTitle>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
              <div className="relative">
                <Search className="absolute left-3 rtl:left-auto rtl:right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder={t("users.searchPlaceholder")}
                  className={cn(
                    "pl-10 rtl:pl-4 rtl:pr-10 w-full sm:w-80 bg-muted/50 border-0",
                    settings.inputStyle === "rounded" && "rounded-full",
                    settings.inputStyle === "underlined" && "border-b-2 border-t-0 border-x-0 rounded-none bg-transparent",
                    settings.inputStyle === "filled" && "bg-muted border-0"
                  )}
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

        <CardContent className={cn(
          settings.spacingSize === "compact" ? "p-0 sm:p-4" :
          settings.spacingSize === "comfortable" ? "p-0 sm:p-8" :
          settings.spacingSize === "spacious" ? "p-0 sm:p-10" :
          "p-0 sm:p-6"
        )}>
          <GenericTable
            data={users}
            columns={columns}
            actions={actions}
            loading={loading}
            pagination={{
              ...pagination,
              onPageChange: changePage,
            }}
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
        <GenericForm
          fields={createFields}
          onSubmit={async (data) => {
            await createUser(data as unknown as CreateUserRequest);
          }}
          onCancel={() => setIsCreateModalOpen(false)}
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
          <GenericForm
            fields={editFields}
            initialValues={{
              username: editingUser.username,
              firstName: editingUser.firstName,
              lastName: editingUser.lastName,
              phoneNumber: editingUser.phoneNumber,
              adminTypeId:
                userTypeOptions.find(
                  (t) => t.label === editingUser.adminTypeName
                )?.value || "",
            }}
            onSubmit={async (data) => {
              await updateUser(editingUser.id, data as unknown as UpdateUserRequest);
            }}
            onCancel={closeEditModal}
          />
        )}
      </GenericModal>
    </div>
  );
}
