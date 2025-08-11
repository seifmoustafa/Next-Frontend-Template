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
    page: 1,
    pagesCount: 1,
  });
  const [searchTerm, setSearchTerm] = useState("");

  const list = useCallback(async () => {
    const response: UsersResponse = await userService.getUsers({
      page: pagination.page,
      pageSize: pagination.pageSize,
      PageSearch: searchTerm,
    });
    setPagination(response.pagination);
    return response.data;
  }, [userService, pagination.page, pagination.pageSize, searchTerm]);

  const service = useMemo(
    () => ({
      list,
      create: (data: CreateUserRequest) => userService.createUser(data),
      update: (id: string, data: UpdateUserRequest) => userService.updateUser(id, data),
      delete: (id: string) => userService.deleteUser(id),
    }),
    [userService, list]
  );

  const crud = useCrudViewModel<User, CreateUserRequest, UpdateUserRequest>(service, {
    itemTypeName: "User",
    itemTypeNamePlural: "Users", 
    getItemDisplayName: (user: User) => `${user.firstName} ${user.lastName}`,
  });

  const searchUsers = (term: string) => {
    setPagination((prev) => ({ ...prev, page: 1 }));
    setSearchTerm(term);
  };

  const changePage = (page: number) => {
    setPagination((prev) => ({ ...prev, page: page }));
  };

  const changePageSize = (size: number) => {
    setPagination((prev) => ({ ...prev, pageSize: size, page: 1 }));
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

