"use client";

import { useState, useEffect, useCallback } from "react";
import type {
  User,
  IUserService,
  CreateUserRequest,
  UpdateUserRequest,
  UsersResponse,
} from "@/services/user.service";
import type { PaginationInfo } from "@/lib/pagination";

export function useUsersViewModel(userService: IUserService) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationInfo>({
    itemCount: 0,
    pageSize: 10,
    currentPage: 1,
    pageCount: 1,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  // Modal state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const loadUsers = useCallback(
    async (page = 1, search = "") => {
      try {
        setLoading(true);
        setError(null);
        const response: UsersResponse = await userService.getUsers({
          page,
          pageSize: pagination.pageSize,
          search,
        });
        setUsers(response.data);
        setPagination(response.pagination);
        setSearchTerm(search);
      } catch (err) {
        setError(err instanceof Error ? err.message : "حدث خطأ");
      } finally {
        setLoading(false);
      }
    },
    [userService, pagination.pageSize]
  );

  const createUser = async (userData: CreateUserRequest) => {
    try {
      await userService.createUser(userData);
      await loadUsers(pagination.currentPage, searchTerm);
      setIsCreateModalOpen(false);
    } catch (err) {
      throw err;
    }
  };

  const updateUser = async (id: string, userData: UpdateUserRequest) => {
    try {
      await userService.updateUser(id, userData);
      await loadUsers(pagination.currentPage, searchTerm);
      setIsEditModalOpen(false);
      setEditingUser(null);
    } catch (err) {
      throw err;
    }
  };

  const deleteUser = async (id: string) => {
    try {
      if (confirm("هل أنت متأكد من حذف هذا المستخدم؟")) {
        await userService.deleteUser(id);
        await loadUsers(pagination.currentPage, searchTerm);
      }
    } catch (err) {
      throw err;
    }
  };

  const deleteSelectedUsers = async () => {
    try {
      if (selectedUsers.length === 0) return;
      if (confirm(`هل أنت متأكد من حذف ${selectedUsers.length} مستخدم؟`)) {
        await userService.deleteSelectedUsers(selectedUsers);
        setSelectedUsers([]);
        await loadUsers(pagination.currentPage, searchTerm);
      }
    } catch (err) {
      throw err;
    }
  };

  const toggleUserSelection = (userId: string) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const toggleAllUsers = () => {
    setSelectedUsers((prev) =>
      prev.length === users.length ? [] : users.map((user) => user.id)
    );
  };

  const openEditModal = (user: User) => {
    setEditingUser(user);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setEditingUser(null);
  };

  const searchUsers = (term: string) => {
    loadUsers(1, term);
  };

  const changePage = (page: number) => {
    loadUsers(page, searchTerm);
  };

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  return {
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
    refreshUsers: () => loadUsers(pagination.currentPage, searchTerm),
  };
}
