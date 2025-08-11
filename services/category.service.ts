import { type IApiService } from "./api.service";
import { API_ENDPOINTS } from "@/config/api-endpoints";
import type { INotificationService } from "./notification.service";
import type { PaginationInfo } from "@/lib/pagination";

export interface Category {
  id: string;
  categoryName: string;
  isDeleted: boolean;
  isActive: boolean;
  notes: string | null;
  createdTimestamp: string;
  updatedTimestamp: string | null;
  deletedTimestamp: string | null;
}

export interface CategoriesResponse {
  data: Category[];
  pagination: PaginationInfo;
}

export interface CreateCategoryRequest {
  categoryName: string;
  isActive: boolean;
  isDeleted?: boolean;
}

export interface UpdateCategoryRequest {
  id: string; // backend expects id in body
  categoryName: string;
  isActive?: boolean;
  isDeleted?: boolean;
}

export interface ICategoryService {
  getCategories(params?: { page?: number; pageSize?: number; search?: string; PageSearch?: string }): Promise<CategoriesResponse>;
  getCategoryById(id: string): Promise<Category>;
  createCategory(data: CreateCategoryRequest): Promise<Category>;
  updateCategory(id: string, data: UpdateCategoryRequest): Promise<Category>;
  deleteCategory(id: string): Promise<void>;
}

export class CategoryService implements ICategoryService {
  constructor(
    private apiService: IApiService,
    private notificationService: INotificationService
  ) {}

  async getCategories(params?: { page?: number; pageSize?: number; search?: string; PageSearch?: string }): Promise<CategoriesResponse> {
    try {
      const query = new URLSearchParams();
      if (params?.page !== undefined) query.append("PageNumber", String(params.page));
      if (params?.pageSize !== undefined) query.append("PageSize", String(params.pageSize));
      if (params?.search) query.append("PageSearch", params.search);
      if (params?.PageSearch) query.append("PageSearch", params.PageSearch);
      return await this.apiService.get<CategoriesResponse>(`${API_ENDPOINTS.GET_CATEGORYS}?${query.toString()}`);
    } catch (e) {
      this.notificationService.error("Failed to fetch categories");
      throw e;
    }
  }

  async getCategoryById(id: string): Promise<Category> {
    try {
      return await this.apiService.get<Category>(API_ENDPOINTS.GET_CATEGORY(id));
    } catch (e) {
      this.notificationService.error("Failed to fetch category");
      throw e;
    }
  }

  async createCategory(data: CreateCategoryRequest): Promise<Category> {
    try {
      const payload: CreateCategoryRequest = { isDeleted: false, isActive: true, ...data };
      const category = await this.apiService.post<Category>(API_ENDPOINTS.CREATE_CATEGORY, payload);
      this.notificationService.success("Category created successfully");
      return category;
    } catch (e) {
      this.notificationService.error("Failed to create category");
      throw e;
    }
  }

  async updateCategory(id: string, data: UpdateCategoryRequest): Promise<Category> {
    try {
      const payload: UpdateCategoryRequest = { ...data, id };
      const category = await this.apiService.put<Category>(API_ENDPOINTS.UPDATE_CATEGORY(id), payload);
      this.notificationService.success("Category updated successfully");
      return category;
    } catch (e) {
      this.notificationService.error("Failed to update category");
      throw e;
    }
  }

  async deleteCategory(id: string): Promise<void> {
    try {
      await this.apiService.delete(API_ENDPOINTS.DELETE_CATEGORY(id));
      this.notificationService.success("Category deleted successfully");
    } catch (e) {
      this.notificationService.error("Failed to delete category");
      throw e;
    }
  }
}
