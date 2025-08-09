"use client";

import { useState, useCallback, useMemo } from "react";
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
    itemsCount: 0,
    pageSize: 10,
    currentPage: 1,
    pagesCount: 1,
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

  const service = useMemo(
    () => ({
      list,
      create: (data: CreateUserRequest) => userService.createUser(data),
      update: (id: string, data: UpdateUserRequest) => userService.updateUser(id, data),
      delete: (id: string) => userService.deleteUser(id),
    }),
    [userService, list]
  );

  const crud = useCrudViewModel<User, CreateUserRequest, UpdateUserRequest>(service);

  const searchUsers = (term: string) => {
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
    setSearchTerm(term);
  };

  const changePage = (page: number) => {
    setPagination((prev) => ({ ...prev, currentPage: page }));
  };

  const changePageSize = (size: number) => {
    setPagination((prev) => ({ ...prev, pageSize: size, currentPage: 1 }));
  };

  return {
    ...crud,
    pagination,
    searchTerm,
    searchUsers,
    changePage,
    changePageSize,
  };
}

