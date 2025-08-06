"use client";

import { useState, useEffect } from "react";
import type {
  User,
  IUserService,
  CreateUserRequest,
  UpdateUserRequest,
  UsersResponse,
} from "@/services/user.service";

export function useUsersViewModel(userService: IUserService) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  const loadUsers = async (page = 1, search = "") => {
    try {
      setLoading(true);
      setError(null);
      const response: UsersResponse = await userService.getUsers({
        page,
        pageSize: 10,
        search,
      });
      setUsers(response.data);
      setTotal(response.pagination.itemsCount);
      setCurrentPage(page);
      setSearchTerm(search);
    } catch (err) {
      setError(err instanceof Error ? err.message : "حدث خطأ");
    } finally {
      setLoading(false);
    }
  };

  const createUser = async (userData: CreateUserRequest) => {
    try {
      await userService.createUser(userData);
      await loadUsers(currentPage, searchTerm); // Refresh the list
    } catch (err) {
      throw err;
    }
  };

  const updateUser = async (id: string, userData: UpdateUserRequest) => {
    try {
      await userService.updateUser(id, userData);
      await loadUsers(currentPage, searchTerm); // Refresh the list
    } catch (err) {
      throw err;
    }
  };

  const deleteUser = async (id: string) => {
    try {
      await userService.deleteUser(id);
      await loadUsers(currentPage, searchTerm); // Refresh the list
    } catch (err) {
      throw err;
    }
  };

  const deleteSelectedUsers = async () => {
    try {
      if (selectedUsers.length === 0) return;
      await userService.deleteSelectedUsers(selectedUsers);
      setSelectedUsers([]);
      await loadUsers(currentPage, searchTerm); // Refresh the list
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

  const searchUsers = (term: string) => {
    loadUsers(1, term);
  };

  const changePage = (page: number) => {
    loadUsers(page, searchTerm);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  return {
    users,
    loading,
    error,
    total,
    currentPage,
    searchTerm,
    selectedUsers,
    createUser,
    updateUser,
    deleteUser,
    deleteSelectedUsers,
    toggleUserSelection,
    toggleAllUsers,
    searchUsers,
    changePage,
    refreshUsers: () => loadUsers(currentPage, searchTerm),
  };
}
