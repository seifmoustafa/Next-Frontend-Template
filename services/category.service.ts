import { ApiService, type IApiService } from "./api.service";
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
  isDeleted?: boolean; // default false
}

export interface UpdateCategoryRequest {
  id: string; // backend expects id in body (per your spec)
  categoryName: string;
}

export interface ICategoryService {
  getCategories(params?: {
    page?: number;
    pageSize?: number;
    PageSearch?: string;
  }): Promise<CategoriesResponse>;
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

  async getCategories(params?: {
    page?: number;
    pageSize?: number;
    search?: string;
    PageSearch?: string;
  }): Promise<CategoriesResponse> {
    try {
      const query = new URLSearchParams();
      if (params?.page !== undefined)
        query.append("PageNumber", String(params.page));
      if (params?.pageSize !== undefined)
        query.append("PageSize", String(params.pageSize));
      if (params?.search) query.append("PageSearch", params.search);
      if (params?.PageSearch) query.append("PageSearch", params.PageSearch);

      // NOTE: endpoint returns {statusCode, message, data, pagination...}
      // Assuming ApiService unwraps to {data, pagination}
      const res = await this.apiService.get<CategoriesResponse>(
        `${API_ENDPOINTS.GET_CATEGORYS}?${query.toString()}`
      );
      return res;
    } catch (e) {
      this.notificationService.error("فشل في جلب التصنيفات");
      throw e;
    }
  }

  async getCategoryById(id: string): Promise<Category> {
    try {
      const category = await this.apiService.get<Category>(
        API_ENDPOINTS.GET_CATEGORY(id)
      );
      return category;
    } catch (e) {
      this.notificationService.error("فشل في جلب بيانات التصنيف");
      throw e;
    }
  }

  async createCategory(data: CreateCategoryRequest): Promise<Category> {
    try {
      const payload: CreateCategoryRequest = { isDeleted: false, isActive: true, ...data };
      const category = await this.apiService.post<Category>(
        API_ENDPOINTS.CREATE_CATEGORY,
        payload
      );
      this.notificationService.success("تم إنشاء التصنيف بنجاح");
      return category;
    } catch (e) {
      this.notificationService.error("فشل في إنشاء التصنيف");
      throw e;
    }
  }

  async updateCategory(id: string, data: UpdateCategoryRequest): Promise<Category> {
    try {
      const payload: UpdateCategoryRequest = {...data, id };
      const category = await this.apiService.put<Category>(
        API_ENDPOINTS.UPDATE_CATEGORY(id),
        payload
      );
      this.notificationService.success("تم تحديث التصنيف بنجاح");
      return category;
    } catch (e) {
      this.notificationService.error("فشل في تحديث التصنيف");
      throw e;
    }
  }

  async deleteCategory(id: string): Promise<void> {
    try {
      await this.apiService.delete(API_ENDPOINTS.DELETE_CATEGORY(id));
      this.notificationService.success("تم حذف التصنيف بنجاح");
    } catch (e) {
      this.notificationService.error("فشل في حذف التصنيف");
      throw e;
    }
  }
}
