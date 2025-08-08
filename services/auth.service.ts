import { ApiService, type IApiService } from "./api.service";

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
  private t?: (key: string, params?: Record<string, any>) => string;

  constructor(apiService?: IApiService, t?: (key: string, params?: Record<string, any>) => string) {
    this.apiService = apiService || new ApiService(undefined, t);
    this.t = t;
  }

  async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      console.log(
        "AuthService: Attempting login for user:",
        credentials.username
      );

      const response = await this.apiService.post<LoginResponse>(
        "/admin/auth/login",
        credentials
      );

      console.log("AuthService: Login response received:", {
        success: response.success,
      });

      return response;
    } catch (error) {
      console.error("AuthService: Login failed:", error);
      throw new Error(this.t ? this.t("auth.loginError") : "Login failed. Please check your credentials.");
    }
  }

  async logout(): Promise<void> {
    try {
      console.log("AuthService: Attempting logout");

      await this.apiService.post("/admin/auth/logout");

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

      const user = await this.apiService.get<User>("/admins/me");

      console.log("AuthService: User data received:", {
        id: user.id,
        username: user.username,
      });

      return user;
    } catch (error) {
      console.error("AuthService: Failed to get current user:", error);
      throw new Error(this.t ? this.t("auth.fetchUserError") : "Failed to fetch user data.");
    }
  }

  async refreshToken(): Promise<LoginResponse> {
    try {
      const refreshToken = localStorage.getItem("refreshToken");

      if (!refreshToken) {
        throw new Error(
          this.t
            ? this.t("auth.noRefreshToken")
            : "No refresh token available"
        );
      }

      console.log("AuthService: Attempting token refresh");

      const response = await this.apiService.post<LoginResponse>(
        "/admin/auth/refresh",
        {
          refreshToken,
        }
      );

      console.log("AuthService: Token refresh successful");

      return response;
    } catch (error) {
      console.error("AuthService: Token refresh failed:", error);
      throw new Error(this.t ? this.t("auth.refreshError") : "Failed to refresh session.");
    }
  }
}
