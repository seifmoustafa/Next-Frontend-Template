"use client";

import type {
  UserType,
  IUserTypeService,
  CreateUserTypeRequest,
  UpdateUserTypeRequest,
} from "@/services/user-type.service";
import { useCrudViewModel } from "@/hooks/use-crud-view-model";

export function useUserTypesViewModel(userTypeService: IUserTypeService) {
  return useCrudViewModel<UserType, CreateUserTypeRequest, UpdateUserTypeRequest>({
    list: () => userTypeService.getUserTypes(),
    create: (data) => userTypeService.createUserType(data),
    update: (id, data) => userTypeService.updateUserType(id, data),
    delete: (id) => userTypeService.deleteUserType(id),
  });
}

