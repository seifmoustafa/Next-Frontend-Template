"use client";

import { useState, useCallback, useEffect } from "react";
import type {
  User,
  IUserService,
  CreateUserRequest,
  UpdateUserRequest,
  UsersResponse,
} from "@/services/user.service";
import type { PaginationInfo } from "@/lib/pagination";
import { useCrudViewModel } from "@/hooks/use-crud-view-model";

export function useUsersViewModel(userService: IUserService) {
  const [pagination, setPagination] = useState<PaginationInfo>({
    itemCount: 0,
    pageSize: 10,
    currentPage: 1,
    pageCount: 1,
  });
  const [searchTerm, setSearchTerm] = useState("");

  const list = useCallback(async () => {
    const response: UsersResponse = await userService.getUsers({
      page: pagination.currentPage,
      pageSize: pagination.pageSize,
      search: searchTerm,
    });
    setPagination(response.pagination);
    return response.data;
  }, [userService, pagination.currentPage, pagination.pageSize, searchTerm]);

  const crud = useCrudViewModel<User, CreateUserRequest, UpdateUserRequest>({
    list,
    create: (data) => userService.createUser(data),
    update: (id, data) => userService.updateUser(id, data),
    delete: (id) => userService.deleteUser(id),
  });

  const searchUsers = (term: string) => {
    setSearchTerm(term);
  };

  const changePage = (page: number) => {
    setPagination((prev) => ({ ...prev, currentPage: page }));
  };

  useEffect(() => {
    crud.refreshItems();
  }, [list]);

  return {
    ...crud,
    pagination,
    searchTerm,
    searchUsers,
    changePage,
  };
}

