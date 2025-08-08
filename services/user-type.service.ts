import type { IApiService } from "./api.service";
import type { INotificationService } from "./notification.service";

export interface UserType {
  id: string;
  adminTypeName: string;
}

export interface CreateUserTypeRequest {
  adminTypeName: string;
}

export interface UpdateUserTypeRequest {
  adminTypeName: string;
}

export interface IUserTypeService {
  getUserTypes(): Promise<UserType[]>;
  getUserTypeById(id: string): Promise<UserType>;
  createUserType(data: CreateUserTypeRequest): Promise<UserType>;
  updateUserType(id: string, data: UpdateUserTypeRequest): Promise<UserType>;
  deleteUserType(id: string): Promise<void>;
}

export class UserTypeService implements IUserTypeService {
  constructor(
    private apiService: IApiService,
    private notificationService: INotificationService,
    private t: (key: string, params?: Record<string, any>) => string
  ) {}

  async getUserTypes(): Promise<UserType[]> {
    try {
      const response = await this.apiService.get<UserType[]>("/admin-types");
      return response;
    } catch (error) {
      this.notificationService.error(this.t("userTypes.fetchError"));
      throw error;
    }
  }

  async getUserTypeById(id: string): Promise<UserType> {
    try {
      const userType = await this.apiService.get<UserType>(
        `/admin-types/${id}`
      );
      return userType;
    } catch (error) {
      this.notificationService.error(this.t("userTypes.fetchOneError"));
      throw error;
    }
  }

  async createUserType(data: CreateUserTypeRequest): Promise<UserType> {
    try {
      const userType = await this.apiService.post<UserType>(
        "/admin-types",
        data
      );
      this.notificationService.success(this.t("userTypes.createSuccess"));
      return userType;
    } catch (error) {
      this.notificationService.error(this.t("userTypes.createError"));
      throw error;
    }
  }

  async updateUserType(
    id: string,
    data: UpdateUserTypeRequest
  ): Promise<UserType> {
    try {
      const userType = await this.apiService.put<UserType>(
        `/admin-types/${id}`,
        data
      );
      this.notificationService.success(this.t("userTypes.updateSuccess"));
      return userType;
    } catch (error) {
      this.notificationService.error(this.t("userTypes.updateError"));
      throw error;
    }
  }

  async deleteUserType(id: string): Promise<void> {
    try {
      await this.apiService.delete(`/admin-types/${id}`);
      this.notificationService.success(this.t("userTypes.deleteSuccess"));
    } catch (error) {
      this.notificationService.error(this.t("userTypes.deleteError"));
      throw error;
    }
  }
}
