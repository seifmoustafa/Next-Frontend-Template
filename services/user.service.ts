import type { IApiService } from "./api.service";
import type { INotificationService } from "./notification.service";

export interface User {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  adminTypeName: string;
}

export interface UsersResponse {
  data: User[];
  pagination: {
    itemsCount: number;
    pagesCount: number;
    pageSize: number;
    currentPage: number;
    firstPage: number | null;
    lastPage: number | null;
    nextPage: number | null;
    previousPage: number | null;
    hasPrevious: boolean;
    hasNext: boolean;
  };
}

export interface CreateUserRequest {
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  userTypeId: string;
}

export interface UpdateUserRequest {
  username: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  adminTypeId: string;
}

export interface DeleteSelectedUsersRequest {
  usersIds: string[];
}

export interface DeleteSelectedUsersResponse {
  count: number;
}

export interface IUserService {
  getUsers(params?: {
    page?: number;
    pageSize?: number;
    search?: string;
  }): Promise<UsersResponse>;
  getUserById(id: string): Promise<User>;
  createUser(data: CreateUserRequest): Promise<User>;
  updateUser(id: string, data: UpdateUserRequest): Promise<User>;
  deleteUser(id: string): Promise<void>;
  deleteSelectedUsers(userIds: string[]): Promise<DeleteSelectedUsersResponse>;
}

export class UserService implements IUserService {
  constructor(
    private apiService: IApiService,
    private notificationService: INotificationService,
    private t: (key: string, params?: Record<string, any>) => string
  ) {}

  async getUsers(params?: {
    page?: number;
    pageSize?: number;
    search?: string;
  }): Promise<UsersResponse> {
    try {
      const queryParams = new URLSearchParams();
      if (params?.page) queryParams.append("page", params.page.toString());
      if (params?.pageSize)
        queryParams.append("pageSize", params.pageSize.toString());
      if (params?.search) queryParams.append("search", params.search);

      const response = await this.apiService.get<UsersResponse>(
        `/admins?${queryParams.toString()}`
      );
      return response;
    } catch (error) {
      this.notificationService.error(this.t("users.fetchError"));
      throw error;
    }
  }

  async getUserById(id: string): Promise<User> {
    try {
      const user = await this.apiService.get<User>(`/admins/${id}`);
      return user;
    } catch (error) {
      this.notificationService.error(this.t("users.fetchUserError"));
      throw error;
    }
  }

  async createUser(data: CreateUserRequest): Promise<User> {
    try {
      const user = await this.apiService.post<User>("/admins", data);
      this.notificationService.success(this.t("users.createSuccess"));
      return user;
    } catch (error) {
      this.notificationService.error(this.t("users.createError"));
      throw error;
    }
  }

  async updateUser(id: string, data: UpdateUserRequest): Promise<User> {
    try {
      const user = await this.apiService.put<User>(`/admins/${id}`, data);
      this.notificationService.success(this.t("users.updateSuccess"));
      return user;
    } catch (error) {
      this.notificationService.error(this.t("users.updateError"));
      throw error;
    }
  }

  async deleteUser(id: string): Promise<void> {
    try {
      await this.apiService.delete(`/admins/${id}`);
      this.notificationService.success(this.t("users.deleteSuccess"));
    } catch (error) {
      this.notificationService.error(this.t("users.deleteError"));
      throw error;
    }
  }

  async deleteSelectedUsers(
    userIds: string[]
  ): Promise<DeleteSelectedUsersResponse> {
    try {
      const response = await this.apiService.post<DeleteSelectedUsersResponse>(
        "/admins/selected",
        {
          usersIds: userIds,
        }
      );
      this.notificationService.success(
        this.t("users.deleteSelectedSuccess", { count: response.count })
      );
      return response;
    } catch (error) {
      this.notificationService.error(this.t("users.deleteSelectedError"));
      throw error;
    }
  }
}
