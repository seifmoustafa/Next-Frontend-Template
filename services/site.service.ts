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

export interface ISiteService {
  getSites(params?: { page?: number; pageSize?: number; PageSearch?: string }): Promise<SitesResponse>;
  getSitesWithChildren(params?: { page?: number; pageSize?: number; PageSearch?: string }): Promise<SitesResponse>;
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

  async getSites(params?: { page?: number; pageSize?: number; PageSearch?: string }): Promise<SitesResponse> {
    try {
      const q = new URLSearchParams();
      if (params?.page !== undefined) q.append("PageNumber", String(params.page));
      if (params?.pageSize !== undefined) q.append("PageSize", String(params.pageSize));
      if (params?.PageSearch) q.append("PageSearch", params.PageSearch);
      return await this.apiService.get<SitesResponse>(`${API_ENDPOINTS.GET_SITES}?${q.toString()}`);
    } catch (error) {
      this.notificationService.error("Failed to fetch sites");
      throw error;
    }
  }

  async getSitesWithChildren(params?: { page?: number; pageSize?: number; PageSearch?: string }): Promise<SitesResponse> {
    try {
      const q = new URLSearchParams();
      if (params?.page !== undefined) q.append("PageNumber", String(params.page));
      if (params?.pageSize !== undefined) q.append("PageSize", String(params.pageSize));
      if (params?.PageSearch) q.append("PageSearch", params.PageSearch);
      return await this.apiService.get<SitesResponse>(`${API_ENDPOINTS.GET_SITES_WITH_CHILDREN}?${q.toString()}`);
    } catch (error) {
      this.notificationService.error("Failed to fetch site tree");
      throw error;
    }
  }

  async getSiteById(id: string): Promise<Site> {
    try {
      return await this.apiService.get<Site>(API_ENDPOINTS.GET_SITE(id));
    } catch (error) {
      this.notificationService.error("Failed to fetch site");
      throw error;
    }
  }

  async createSite(data: CreateSiteRequest): Promise<Site> {
    try {
      const site = await this.apiService.post<Site>(API_ENDPOINTS.CREATE_SITE, data);
      this.notificationService.success("Site created successfully");
      return site;
    } catch (error) {
      this.notificationService.error("Failed to create site");
      throw error;
    }
  }

  async updateSite(id: string, data: UpdateSiteRequest): Promise<Site> {
    try {
      const site = await this.apiService.put<Site>(API_ENDPOINTS.UPDATE_SITE(id), data);
      this.notificationService.success("Site updated successfully");
      return site;
    } catch (error) {
      this.notificationService.error("Failed to update site");
      throw error;
    }
  }

  async deleteSite(id: string): Promise<void> {
    try {
      await this.apiService.delete(API_ENDPOINTS.DELETE_SITE(id));
      this.notificationService.success("Site deleted successfully");
    } catch (error) {
      this.notificationService.error("Failed to delete site");
      throw error;
    }
  }
}
