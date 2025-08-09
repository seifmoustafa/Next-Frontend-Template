"use client";

import { useCallback, useMemo } from "react";
import type {
  UserType,
  IUserTypeService,
  CreateUserTypeRequest,
  UpdateUserTypeRequest,
} from "@/services/user-type.service";
import { useCrudViewModel } from "@/hooks/use-crud-view-model";

export function useUserTypesViewModel(userTypeService: IUserTypeService) {
  const list = useCallback(() => userTypeService.getUserTypes(), [userTypeService]);
  const create = useCallback(
    (data: CreateUserTypeRequest) => userTypeService.createUserType(data),
    [userTypeService]
  );
  const update = useCallback(
    (id: string, data: UpdateUserTypeRequest) => userTypeService.updateUserType(id, data),
    [userTypeService]
  );
  const remove = useCallback(
    (id: string) => userTypeService.deleteUserType(id),
    [userTypeService]
  );

  const service = useMemo(
    () => ({ list, create, update, delete: remove }),
    [list, create, update, remove]
  );

  return useCrudViewModel<UserType, CreateUserTypeRequest, UpdateUserTypeRequest>(service);
}

