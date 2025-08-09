import { ApiService, type IApiService } from "./api.service";
import { API_ENDPOINTS } from "@/config/api-endpoints";

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  accessToken: string;
  refreshToken: string;
  message?: string;
}

export interface User {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  adminTypeName: string;
}

export interface IAuthService {
  login(credentials: LoginRequest): Promise<LoginResponse>;
  logout(): Promise<void>;
  getCurrentUser(): Promise<User>;
  refreshToken(): Promise<LoginResponse>;
}

export class AuthService implements IAuthService {
  private apiService: IApiService;

  constructor(apiService?: IApiService) {
    this.apiService = apiService || new ApiService();
  }

  async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      console.log(
        "AuthService: Attempting login for user:",
        credentials.username
      );

      const response = await this.apiService.post<LoginResponse>(
        API_ENDPOINTS.AUTH_LOGIN,
        credentials
      );

      console.log("AuthService: Login response received:", {
        success: response.success,
      });

      return response;
    } catch (error) {
      console.error("AuthService: Login failed:", error);
      throw new Error("فشل في تسجيل الدخول. يرجى التحقق من بيانات الاعتماد.");
    }
  }

  async logout(): Promise<void> {
    try {
      console.log("AuthService: Attempting logout");

      await this.apiService.post(API_ENDPOINTS.AUTH_LOGOUT);

      // Clear tokens from localStorage
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");

      console.log("AuthService: Logout successful");
    } catch (error) {
      console.error("AuthService: Logout failed:", error);
      // Still clear tokens even if API call fails
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      throw error;
    }
  }

  async getCurrentUser(): Promise<User> {
    try {
      console.log("AuthService: Fetching current user");

      const user = await this.apiService.get<User>(API_ENDPOINTS.ADMINS_ME);

      console.log("AuthService: User data received:", {
        id: user.id,
        username: user.username,
      });

      return user;
    } catch (error) {
      console.error("AuthService: Failed to get current user:", error);
      throw new Error("فشل في جلب بيانات المستخدم.");
    }
  }

  async refreshToken(): Promise<LoginResponse> {
    try {
      const refreshToken = localStorage.getItem("refreshToken");

      if (!refreshToken) {
        throw new Error("No refresh token available");
      }

      console.log("AuthService: Attempting token refresh");

      const response = await this.apiService.post<LoginResponse>(
        API_ENDPOINTS.AUTH_REFRESH,
        {
          refreshToken,
        }
      );

      console.log("AuthService: Token refresh successful");

      return response;
    } catch (error) {
      console.error("AuthService: Token refresh failed:", error);
      throw new Error("فشل في تحديث الجلسة.");
    }
  }
}
