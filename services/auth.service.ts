import { ApiService, type IApiService } from "./api.service";
import { API_ENDPOINTS } from "@/config/api-endpoints";

export interface LoginRequest {
  username: string;
  password?: string;
}

export interface LoginResponse {
  success: boolean;
  accessToken: string;
  refreshToken: string;
}

export interface User {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  adminTypeName: string;
}

export class AuthService {
  constructor(private readonly apiService: IApiService) {}

  async login(credentials: LoginRequest): Promise<User> {
    const response = await this.apiService.post<LoginResponse>(API_ENDPOINTS.LOGIN, credentials);
    if (response && (response as any).accessToken) {
      localStorage.setItem("accessToken", response.accessToken);
      localStorage.setItem("refreshToken", response.refreshToken);
      return this.getMe();
    }
    throw new Error("Login failed: No access token received.");
  }

  async logout(): Promise<void> {
    try {
      await this.apiService.post(API_ENDPOINTS.LOGOUT);
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
    } catch (error) {
      throw error;
    }
  }

  async getMe(): Promise<User> {
    return this.apiService.get<User>("/admins/me");
  }

  hasToken(): boolean {
    return !!localStorage.getItem("accessToken");
  }

  async refreshToken(): Promise<LoginResponse | null> {
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) return null;

    try {
      const response = await this.apiService.post<LoginResponse>(API_ENDPOINTS.REFRESH, { refreshToken });
      if (response && response.accessToken) {
        localStorage.setItem("accessToken", response.accessToken);
      }
      return response;
    } catch {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      return null;
    }
  }
}

const apiService = new ApiService(process.env.NEXT_PUBLIC_API_URL);
export const authService = new AuthService(apiService);
