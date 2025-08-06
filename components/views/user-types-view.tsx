"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GenericTable } from "@/components/ui/generic-table";
import { GenericModal } from "@/components/ui/generic-modal";
import { UserTypeForm } from "@/components/forms/user-type-form";
import { useUserTypesViewModel } from "@/viewmodels/user-types.viewmodel";
import { useServices } from "@/providers/service-provider";
import type { UserType } from "@/services/user-type.service";
import { Plus, Shield, RefreshCw, Trash2, Edit } from "lucide-react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { ErrorMessage } from "@/components/ui/error-message";

export function UserTypesView() {
  const { userTypeService } = useServices();

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
      label: "اسم نوع المستخدم",
      sortable: true,
    },
  ];

  const actions = [
    {
      label: "تعديل",
      icon: Edit,
      onClick: (userType: UserType) => openEditModal(userType),
      variant: "ghost" as const,
    },
    {
      label: "حذف",
      icon: Trash2,
      onClick: (userType: UserType) => deleteUserType(userType.id),
      variant: "ghost" as const,
      className: "text-red-600 hover:text-red-700",
    },
  ];

  if (loading && userTypes.length === 0) {
    return <LoadingSpinner />;
  }

  if (error && userTypes.length === 0) {
    return <ErrorMessage message={error} onRetry={refreshUserTypes} />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            أنواع المستخدمين
          </h1>
          <p className="text-muted-foreground text-base sm:text-lg">
            إدارة أنواع المستخدمين والصلاحيات
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          {selectedUserTypes.length > 0 && (
            <Button
              onClick={deleteSelectedUserTypes}
              variant="destructive"
              size="lg"
              className="flex-1 sm:flex-none"
            >
              <Trash2 className="w-5 h-5 mr-2 rtl:mr-0 rtl:ml-2" />
              حذف المحدد ({selectedUserTypes.length})
            </Button>
          )}
          <Button
            onClick={refreshUserTypes}
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
            إضافة نوع جديد
          </Button>
        </div>
      </div>

      {/* Stats Card */}
      <Card className="glass border-0 hover-lift">
        <CardContent className="p-6">
          <div className="flex items-center space-x-4 rtl:space-x-reverse">
            <div className="p-3 rounded-xl bg-primary/20">
              <Shield className="w-8 h-8 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{userTypes.length}</p>
              <p className="text-muted-foreground">إجمالي أنواع المستخدمين</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* User Types Table */}
      <Card className="glass border-0 hover-lift">
        <CardHeader>
          <CardTitle className="text-xl">
            أنواع المستخدمين ({userTypes.length})
          </CardTitle>
        </CardHeader>

        <CardContent className="p-0 sm:p-6">
          <GenericTable
            data={userTypes}
            columns={columns}
            actions={actions}
            loading={loading}
            selectable={true}
            selectedItems={selectedUserTypes}
            onSelectionChange={(selected) => {
              // Handle selection change
              selected.forEach((id) => {
                if (!selectedUserTypes.includes(id)) {
                  toggleUserTypeSelection(id);
                }
              });
              selectedUserTypes.forEach((id) => {
                if (!selected.includes(id)) {
                  toggleUserTypeSelection(id);
                }
              });
            }}
            searchPlaceholder="البحث في أنواع المستخدمين..."
            emptyMessage="لا توجد أنواع مستخدمين"
          />
        </CardContent>
      </Card>

      {/* Create User Type Modal */}
      <GenericModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        title="إضافة نوع مستخدم جديد"
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
        title={`تعديل ${editingUserType?.adminTypeName}`}
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
