"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GenericTable } from "@/components/ui/generic-table";
import { GenericModal } from "@/components/ui/generic-modal";
import { UserTypeForm } from "@/components/forms/user-type-form";
import { useUserTypesViewModel } from "@/viewmodels/user-types.viewmodel";
import { useServices } from "@/providers/service-provider";
import { useSettings } from "@/providers/settings-provider";
import { useI18n } from "@/providers/i18n-provider";
import type { UserType } from "@/services/user-type.service";
import { Plus, Shield, RefreshCw, Trash2, Edit } from "lucide-react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { ErrorMessage } from "@/components/ui/error-message";
import { cn } from "@/lib/utils";

export function UserTypesView() {
  const { userTypeService } = useServices();
  const settings = useSettings();
  const { t } = useI18n();

  const viewModel = useUserTypesViewModel(userTypeService);
  const {
    userTypes,
    loading,
    error,
    selectedUserTypes,
    isCreateModalOpen,
    isEditModalOpen,
    editingUserType,
    createUserType,
    updateUserType,
    deleteUserType,
    deleteSelectedUserTypes,
    toggleUserTypeSelection,
    toggleAllUserTypes,
    openEditModal,
    closeEditModal,
    setIsCreateModalOpen,
    refreshUserTypes,
  } = viewModel;

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
      onClick: (userType: UserType) => openEditModal(userType),
      variant: "ghost" as const,
    },
    {
      label: t("common.delete"),
      onClick: (userType: UserType) => deleteUserType(userType.id),
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

  if (loading && userTypes.length === 0) {
    return <LoadingSpinner />;
  }

  if (error && userTypes.length === 0) {
    return <ErrorMessage message={error} onRetry={refreshUserTypes} />;
  }

  return (
    <div className={getSpacingClasses()}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div
          className={cn(
            "space-y-2",
            settings.spacingSize === "compact" ? "space-y-1" : "space-y-2"
          )}
        >
          <h1
            className={cn(
              "font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent",
              settings.fontSize === "small"
                ? "text-2xl sm:text-3xl"
                : settings.fontSize === "large"
                ? "text-4xl sm:text-5xl"
                : "text-3xl sm:text-4xl"
            )}
          >
            {t("userTypes.title")}
          </h1>
          <p
            className={cn(
              "text-muted-foreground",
              settings.fontSize === "small"
                ? "text-sm sm:text-base"
                : settings.fontSize === "large"
                ? "text-lg sm:text-xl"
                : "text-base sm:text-lg"
            )}
          >
            {t("userTypes.subtitle")}
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          {selectedUserTypes.length > 0 && (
            <Button
              onClick={deleteSelectedUserTypes}
              variant="destructive"
              size={getButtonSize()}
              className="flex-1 sm:flex-none"
            >
              <Trash2 className="w-5 h-5 mr-2 rtl:mr-0 rtl:ml-2" />
              {t("userTypes.deleteSelected")} ({selectedUserTypes.length})
            </Button>
          )}
          <Button
            onClick={refreshUserTypes}
            variant="outline"
            size={getButtonSize()}
            className="hover-lift bg-transparent flex-1 sm:flex-none"
          >
            <RefreshCw className="w-5 h-5 mr-2 rtl:mr-0 rtl:ml-2" />
            {t("common.refresh")}
          </Button>
          <Button
            onClick={() => setIsCreateModalOpen(true)}
            className="gradient-primary hover-lift flex-1 sm:flex-none"
            size={getButtonSize()}
          >
            <Plus className="w-5 h-5 mr-2 rtl:mr-0 rtl:ml-2" />
            {t("userTypes.addType")}
          </Button>
        </div>
      </div>

      {/* Stats Card */}
      <Card className={getCardClasses()}>
        <CardContent
          className={cn(
            settings.spacingSize === "compact"
              ? "p-4"
              : settings.spacingSize === "comfortable"
              ? "p-8"
              : settings.spacingSize === "spacious"
              ? "p-10"
              : "p-6"
          )}
        >
          <div className="flex items-center space-x-4 rtl:space-x-reverse">
            <div
              className={cn(
                "rounded-xl bg-primary/20",
                settings.spacingSize === "compact"
                  ? "p-2"
                  : settings.spacingSize === "comfortable"
                  ? "p-4"
                  : settings.spacingSize === "spacious"
                  ? "p-5"
                  : "p-3"
              )}
            >
              <Shield
                className={cn(
                  "text-primary",
                  settings.spacingSize === "compact"
                    ? "w-6 h-6"
                    : settings.spacingSize === "comfortable"
                    ? "w-10 h-10"
                    : settings.spacingSize === "spacious"
                    ? "w-12 h-12"
                    : "w-8 h-8"
                )}
              />
            </div>
            <div>
              <p
                className={cn(
                  "font-bold",
                  settings.fontSize === "small"
                    ? "text-xl"
                    : settings.fontSize === "large"
                    ? "text-3xl"
                    : "text-2xl"
                )}
              >
                {userTypes.length}
              </p>
              <p className="text-muted-foreground">{t("userTypes.total")}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* User Types Table */}
      <Card className={getCardClasses()}>
        <CardHeader>
          <CardTitle
            className={cn(
              settings.fontSize === "small"
                ? "text-lg"
                : settings.fontSize === "large"
                ? "text-2xl"
                : "text-xl"
            )}
          >
            {t("userTypes.listTitle")} ({userTypes.length})
          </CardTitle>
        </CardHeader>

        <CardContent
          className={cn(
            settings.spacingSize === "compact"
              ? "p-0 sm:p-4"
              : settings.spacingSize === "comfortable"
              ? "p-0 sm:p-8"
              : settings.spacingSize === "spacious"
              ? "p-0 sm:p-10"
              : "p-0 sm:p-6"
          )}
        >
          <GenericTable
            data={userTypes}
            columns={columns}
            actions={actions}
            loading={loading}
          />
        </CardContent>
      </Card>

      {/* Create User Type Modal */}
        <GenericModal
          open={isCreateModalOpen}
          onOpenChange={setIsCreateModalOpen}
          title={t("userTypes.newTypeTitle")}
          size="md"
        >
        <UserTypeForm
          onSubmit={createUserType}
          onCancel={() => setIsCreateModalOpen(false)}
        />
      </GenericModal>

      {/* Edit User Type Modal */}
        <GenericModal
          open={isEditModalOpen}
          onOpenChange={closeEditModal}
          title={`${t("userTypes.editType")} ${editingUserType?.adminTypeName}`}
          size="md"
        >
        {editingUserType && (
          <UserTypeForm
            initialData={editingUserType}
            onSubmit={(data) => updateUserType(editingUserType.id, data)}
            onCancel={closeEditModal}
          />
        )}
      </GenericModal>
    </div>
  );
}
