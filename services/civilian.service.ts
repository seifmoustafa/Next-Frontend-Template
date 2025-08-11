import { ApiService, type IApiService } from "./api.service";
import { API_ENDPOINTS } from "@/config/api-endpoints";
import type { INotificationService } from "./notification.service";
import type { PaginationInfo } from "@/lib/pagination";

export interface Civilian {
  id: string;
  civilianName: string;
  nationalityNumber: string;
  phoneNumber: string;
  address: string;
  siteId: string;
  siteName: string | null;
  isDeleted: boolean;
  isActive: boolean;
  notes: string | null;
  createdTimestamp: string;
  updatedTimestamp: string | null;
  deletedTimestamp: string | null;
}

export interface CiviliansResponse {
  data: Civilian[];
  pagination: PaginationInfo;
}

export interface CreateCivilianRequest {
  civilianName: string;
  nationalityNumber: string;
  phoneNumber: string;
  address: string;
  siteId: string;
  isActive?: boolean;
  isDeleted?: boolean;
}

export interface UpdateCivilianRequest {
  id: string; // API expects id in body
  civilianName: string;
  nationalityNumber: string;
  phoneNumber: string;
  address: string;
  siteId: string;
  isActive?: boolean;
  isDeleted?: boolean;
}

export interface ICivilianService {
  getCivilians(params?: { page?: number; pageSize?: number; search?: string; PageSearch?: string }): Promise<CiviliansResponse>;
  getCivilianById(id: string): Promise<Civilian>;
  createCivilian(data: CreateCivilianRequest): Promise<Civilian>;
  updateCivilian(id: string, data: UpdateCivilianRequest): Promise<Civilian>;
  deleteCivilian(id: string): Promise<void>;
}

export class CivilianService implements ICivilianService {
  constructor(
    private apiService: IApiService,
    private notificationService: INotificationService
  ) {}

  async getCivilians(params?: { page?: number; pageSize?: number; search?: string; PageSearch?: string }): Promise<CiviliansResponse> {
    try {
      const q = new URLSearchParams();
      if (params?.page !== undefined) q.append("PageNumber", String(params.page));
      if (params?.pageSize !== undefined) q.append("PageSize", String(params.pageSize));
      if (params?.search) q.append("PageSearch", params.search); // mapping here
      if (params?.PageSearch) q.append("PageSearch", params.PageSearch); // direct PageSearch parameter

      return await this.apiService.get<CiviliansResponse>(`${API_ENDPOINTS.GET_CIVILIANS}?${q.toString()}`);
    } catch (e) {
      this.notificationService.error("فشل في جلب المواطنين");
      throw e;
    }
  }

  async getCivilianById(id: string): Promise<Civilian> {
    try {
      return await this.apiService.get<Civilian>(API_ENDPOINTS.GET_CIVILIAN(id));
    } catch (e) {
      this.notificationService.error("فشل في جلب بيانات المواطن");
      throw e;
    }
  }

  async createCivilian(data: CreateCivilianRequest): Promise<Civilian> {
    try {
      const payload: CreateCivilianRequest = { isDeleted: false, isActive: true, ...data };
      const res = await this.apiService.post<Civilian>(API_ENDPOINTS.CREATE_CIVILIAN, payload);
      this.notificationService.success("تم إنشاء المواطن بنجاح");
      return res;
    } catch (e) {
      this.notificationService.error("فشل في إنشاء المواطن");
      throw e;
    }
  }

  async updateCivilian(id: string, data: UpdateCivilianRequest): Promise<Civilian> {
    try {
      const payload: UpdateCivilianRequest = { isDeleted: false, isActive: true, ...data, id };
      const res = await this.apiService.put<Civilian>(API_ENDPOINTS.UPDATE_CIVILIAN(id), payload);
      this.notificationService.success("تم تحديث المواطن بنجاح");
      return res;
    } catch (e) {
      this.notificationService.error("فشل في تحديث المواطن");
      throw e;
    }
  }

  async deleteCivilian(id: string): Promise<void> {
    try {
      await this.apiService.delete(API_ENDPOINTS.DELETE_CIVILIAN(id));
      this.notificationService.success("تم حذف المواطن بنجاح");
    } catch (e) {
      this.notificationService.error("فشل في حذف المواطن");
      throw e;
    }
  }
}
