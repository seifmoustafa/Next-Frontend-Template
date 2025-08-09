import { ApiService, type IApiService } from "./api.service";
import { API_ENDPOINTS } from "@/lib/api-endpoints";
import type { INotificationService } from "./notification.service";
import type { PaginationInfo } from "@/lib/pagination";

export interface Vendor {
  id: string;
  vendorName: string;
  isDeleted: boolean;
  isActive: boolean;
  notes: string | null;
  createdTimestamp: string;
  updatedTimestamp: string | null;
  deletedTimestamp: string | null;
}

export interface VendorsResponse {
  data: Vendor[];
  pagination: PaginationInfo;
}

export interface CreateVendorRequest {
  vendorName: string;
  isActive: boolean;
  isDeleted?: boolean; // default false
}

export interface UpdateVendorRequest {
  id: string; // backend expects id in body (per your spec)
  vendorName: string;
  isActive: boolean;
  isDeleted?: boolean; // default false
}

export interface IVendorService {
  getVendors(params?: {
    page?: number;
    pageSize?: number;
    search?: string;
  }): Promise<VendorsResponse>;
  getVendorById(id: string): Promise<Vendor>;
  createVendor(data: CreateVendorRequest): Promise<Vendor>;
  updateVendor(id: string, data: UpdateVendorRequest): Promise<Vendor>;
  deleteVendor(id: string): Promise<void>;
}

export class VendorService implements IVendorService {
  constructor(
    private apiService: IApiService,
    private notificationService: INotificationService
  ) {}

  async getVendors(params?: {
    page?: number;
    pageSize?: number;
    search?: string;
  }): Promise<VendorsResponse> {
    try {
      const query = new URLSearchParams();
      if (params?.page !== undefined)
        query.append("PageNumber", String(params.page));
      if (params?.pageSize !== undefined)
        query.append("PageSize", String(params.pageSize));
      if (params?.search) query.append("PageSearch", params.search);

      // NOTE: endpoint returns {statusCode, message, data, pagination...}
      // Assuming ApiService unwraps to {data, pagination}
      const res = await this.apiService.get<VendorsResponse>(
        `${API_ENDPOINTS.GET_VENDORS}?${query.toString()}`
      );
      return res;
    } catch (e) {
      this.notificationService.error("فشل في جلب المورّدين");
      throw e;
    }
  }

  async getVendorById(id: string): Promise<Vendor> {
    try {
      const vendor = await this.apiService.get<Vendor>(
        API_ENDPOINTS.GET_VENDOR(id)
      );
      return vendor;
    } catch (e) {
      this.notificationService.error("فشل في جلب بيانات المورّد");
      throw e;
    }
  }

  async createVendor(data: CreateVendorRequest): Promise<Vendor> {
    try {
      const payload: CreateVendorRequest = { isDeleted: false, isActive: true, ...data };
      const vendor = await this.apiService.post<Vendor>(
        API_ENDPOINTS.CREATE_VENDOR,
        payload
      );
      this.notificationService.success("تم إنشاء المورّد بنجاح");
      return vendor;
    } catch (e) {
      this.notificationService.error("فشل في إنشاء المورّد");
      throw e;
    }
  }

  async updateVendor(id: string, data: UpdateVendorRequest): Promise<Vendor> {
    try {
      const payload: UpdateVendorRequest = { isDeleted: false, ...data, id };
      const vendor = await this.apiService.put<Vendor>(
        API_ENDPOINTS.UPDATE_VENDOR(id),
        payload
      );
      this.notificationService.success("تم تحديث المورّد بنجاح");
      return vendor;
    } catch (e) {
      this.notificationService.error("فشل في تحديث المورّد");
      throw e;
    }
  }

  async deleteVendor(id: string): Promise<void> {
    try {
      await this.apiService.delete(API_ENDPOINTS.DELETE_VENDOR(id));
      this.notificationService.success("تم حذف المورّد بنجاح");
    } catch (e) {
      this.notificationService.error("فشل في حذف المورّد");
      throw e;
    }
  }
}
