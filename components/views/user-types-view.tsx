"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { GenericModal } from "@/components/ui/generic-modal";
import { GenericTable } from "@/components/ui/generic-table";
import { UserTypeForm } from "@/components/forms/user-type-form";
import { Plus, Edit, Trash2 } from "lucide-react";
import { useUserTypesViewModel } from "@/viewmodels/user-types.viewmodel";
import type { UserType } from "@/services/user-type.service";

export function UserTypesView() {
  const {
    userTypes,
    loading,
    selectedUserTypes,
    isModalOpen,
    modalMode,
    selectedUserType,
    loadUserTypes,
    handleCreateUserType,
    handleUpdateUserType,
    handleDeleteUserType,
    handleDeleteSelected,
    setSelectedUserTypes,
    openCreateModal,
    openEditModal,
    closeModal,
  } = useUserTypesViewModel();

  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadUserTypes();
  }, [loadUserTypes]);

  const filteredUserTypes = userTypes.filter((userType) =>
    userType.adminTypeName.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
      onClick: (userType: UserType) => handleDeleteUserType(userType.id),
      variant: "ghost" as const,
      className: "text-red-600 hover:text-red-700",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">أنواع المستخدمين</h1>
          <p className="text-muted-foreground">
            إدارة أنواع المستخدمين في النظام
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          {selectedUserTypes.length > 0 && (
            <Button
              variant="destructive"
              onClick={handleDeleteSelected}
              className="h-10"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              حذف المحدد ({selectedUserTypes.length})
            </Button>
          )}
          <Button onClick={openCreateModal} className="h-10 gradient-primary">
            <Plus className="h-4 w-4 mr-2" />
            إضافة نوع مستخدم
          </Button>
        </div>
      </div>

      <GenericTable
        data={filteredUserTypes}
        columns={columns}
        actions={actions}
        loading={loading}
        searchable
        selectable
        selectedItems={selectedUserTypes}
        onSelectionChange={setSelectedUserTypes}
        searchPlaceholder="البحث في أنواع المستخدمين..."
        emptyMessage="لا توجد أنواع مستخدمين"
      />

      <GenericModal
        open={isModalOpen}
        onOpenChange={closeModal}
        title={
          modalMode === "create" ? "إضافة نوع مستخدم" : "تعديل نوع المستخدم"
        }
        size="md"
      >
        <UserTypeForm
          initialData={selectedUserType}
          onSubmit={
            modalMode === "create" ? handleCreateUserType : handleUpdateUserType
          }
          onCancel={closeModal}
        />
      </GenericModal>
    </div>
  );
}
