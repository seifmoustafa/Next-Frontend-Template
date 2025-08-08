"use client";

import { useState, useEffect, useCallback } from "react";
import { useI18n } from "@/providers/i18n-provider";
import type {
  UserType,
  IUserTypeService,
  CreateUserTypeRequest,
  UpdateUserTypeRequest,
} from "@/services/user-type.service";

export function useUserTypesViewModel(userTypeService: IUserTypeService) {
  const [userTypes, setUserTypes] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedUserTypes, setSelectedUserTypes] = useState<string[]>([]);

  // Modal state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingUserType, setEditingUserType] = useState<UserType | null>(null);
  const { t } = useI18n();

  const loadUserTypes = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await userTypeService.getUserTypes();
      setUserTypes(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : t("common.error"));
    } finally {
      setLoading(false);
    }
  }, [userTypeService]);

  const createUserType = async (data: CreateUserTypeRequest) => {
    try {
      await userTypeService.createUserType(data);
      await loadUserTypes();
      setIsCreateModalOpen(false);
    } catch (err) {
      throw err;
    }
  };

  const updateUserType = async (id: string, data: UpdateUserTypeRequest) => {
    try {
      await userTypeService.updateUserType(id, data);
      await loadUserTypes();
      setIsEditModalOpen(false);
      setEditingUserType(null);
    } catch (err) {
      throw err;
    }
  };

  const deleteUserType = async (id: string) => {
    try {
      if (confirm(t("userTypes.confirmDelete"))) {
        await userTypeService.deleteUserType(id);
        await loadUserTypes();
      }
    } catch (err) {
      throw err;
    }
  };

  const deleteSelectedUserTypes = async () => {
    try {
      if (selectedUserTypes.length === 0) return;
      if (confirm(t("userTypes.confirmDeleteMany", { count: selectedUserTypes.length }))) {
        for (const id of selectedUserTypes) {
          await userTypeService.deleteUserType(id);
        }
        setSelectedUserTypes([]);
        await loadUserTypes();
      }
    } catch (err) {
      throw err;
    }
  };

  const toggleUserTypeSelection = (userTypeId: string) => {
    setSelectedUserTypes((prev) =>
      prev.includes(userTypeId)
        ? prev.filter((id) => id !== userTypeId)
        : [...prev, userTypeId]
    );
  };

  const toggleAllUserTypes = () => {
    setSelectedUserTypes((prev) =>
      prev.length === userTypes.length
        ? []
        : userTypes.map((userType) => userType.id)
    );
  };

  const openEditModal = (userType: UserType) => {
    setEditingUserType(userType);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setEditingUserType(null);
  };

  useEffect(() => {
    loadUserTypes();
  }, [loadUserTypes]);

  return {
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
    refreshUserTypes: loadUserTypes,
  };
}
