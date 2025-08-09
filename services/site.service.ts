import type { IApiService } from "./api.service";
import { API_ENDPOINTS } from "@/config/api-endpoints";
import type { INotificationService } from "./notification.service";
import type { PaginationInfo } from "@/lib/pagination";

export interface Site {
  id: string;
  siteName: string;
  parentSiteId: string | null;
  children?: Site[];
  notes: string | null;
  isDeleted?: boolean;
  isActive?: boolean;
  createdTimestamp?: string | null;
  updatedTimestamp?: string | null;
  deletedTimestamp?: string | null;
}

export interface SitesResponse {
  data: Site[];
  pagination: PaginationInfo;
}

export interface CreateSiteRequest {
  siteName: string;
  parentSiteId: string | null;
}

export interface UpdateSiteRequest {
  id: string;
  siteName: string;
  parentSiteId: string | null;
}

export interface DeleteSite {
  SitesIds: string;
}

export interface ISiteService {
  getSites(params?: {
    page?: number;
    pageSize?: number;
    search?: string;
  }): Promise<SitesResponse>;

  // New: With-Children endpoint
  getSitesWithChildren(params?: {
    page?: number;
    pageSize?: number;
    search?: string;
  }): Promise<SitesResponse>;

  getSiteById(id: string): Promise<Site>;
  createSite(data: CreateSiteRequest): Promise<Site>;
  updateSite(id: string, data: UpdateSiteRequest): Promise<Site>;
  deleteSite(id: string): Promise<void>;
}

export class SiteService implements ISiteService {
  constructor(
    private apiService: IApiService,
    private notificationService: INotificationService
  ) {}

  async getSites(params?: {
    page?: number;
    pageSize?: number;
    search?: string;
  }): Promise<SitesResponse> {
    try {
      const queryParams = new URLSearchParams();
      if (params?.page) queryParams.append("page", params.page.toString());
      if (params?.pageSize)
        queryParams.append("pageSize", params.pageSize.toString());
      if (params?.search) queryParams.append("search", params.search);

      const response = await this.apiService.get<SitesResponse>(
        `${API_ENDPOINTS.GET_SITES}?${queryParams.toString()}`
      );
      return response;
    } catch (error) {
      this.notificationService.error("فشل في جلب الموقع");
      throw error;
    }
  }

  // New: Nested tree request using PageNumber/PageSize/PageSearch as per API
  async getSitesWithChildren(params?: {
    page?: number;
    pageSize?: number;
    search?: string;
  }): Promise<SitesResponse> {
    try {
      const queryParams = new URLSearchParams();
      if (params?.page)
        queryParams.append("PageNumber", params.page.toString());
      if (params?.pageSize)
        queryParams.append("PageSize", params.pageSize.toString());
      if (params?.search) queryParams.append("PageSearch", params.search);

      const response = await this.apiService.get<SitesResponse>(
        `${API_ENDPOINTS.GET_SITES_WITH_CHILDREN}?${queryParams.toString()}`
      );
      return response;
    } catch (error) {
      this.notificationService.error("فشل في جلب هيكل المواقع");
      throw error;
    }
  }

  async getSiteById(id: string): Promise<Site> {
    try {
      const site = await this.apiService.get<Site>(API_ENDPOINTS.GET_SITE(id));
      return site;
    } catch (error) {
      this.notificationService.error("فشل في جلب بيانات المستخدم");
      throw error;
    }
  }

  async createSite(data: CreateSiteRequest): Promise<Site> {
    try {
      const site = await this.apiService.post<Site>(
        API_ENDPOINTS.CREATE_SITE,
        data
      );
      this.notificationService.success("تم إنشاء الموقع بنجاح");
      return site;
    } catch (error) {
      this.notificationService.error("فشل في إنشاء الموقع");
      throw error;
    }
  }

  async updateSite(id: string, data: UpdateSiteRequest): Promise<Site> {
    try {
      const site = await this.apiService.put<Site>(
        API_ENDPOINTS.UPDATE_SITE(id),
        data
      );
      this.notificationService.success("تم تحديث الموقع بنجاح");
      return site;
    } catch (error) {
      this.notificationService.error("فشل في تحديث الموقع");
      throw error;
    }
  }

  async deleteSite(id: string): Promise<void> {
    try {
      await this.apiService.delete(API_ENDPOINTS.DELETE_SITE(id));
      this.notificationService.success("تم حذف الموقع بنجاح");
    } catch (error) {
      this.notificationService.error("فشل في حذف الموقع");
      throw error;
    }
  }
}
