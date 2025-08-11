export interface IApiService {
  get<T>(endpoint: string, params?: Record<string, any>): Promise<T>;
  post<T>(endpoint: string, data?: any): Promise<T>;
  put<T>(endpoint: string, data?: any): Promise<T>;
  delete<T>(endpoint: string): Promise<T>;
}

export class ApiService implements IApiService {
  private baseUrl: string;
  private defaultHeaders: Record<string, string>;

  constructor(baseUrl: string = process.env.NEXT_PUBLIC_API_URL || "/api") {
    this.baseUrl = baseUrl;
    this.defaultHeaders = {
      "Content-Type": "application/json",
      Accept: "application/json",
    };
  }

  private buildUrl(endpoint: string) {
    const baseUrl = this.baseUrl.startsWith("http") ? this.baseUrl : `https://${this.baseUrl}`;
    return `${baseUrl}${endpoint}`;
  }

  private unwrap<T>(json: any): T {
    if (json && typeof json === "object" && "data" in json) {
      if ("pagination" in json) {
        return { data: json.data, pagination: json.pagination } as T;
      }
      return json.data as T;
    }
    return json as T;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = this.buildUrl(endpoint);
    console.log("API Request:", { method: options.method || "GET", url });

    const token = localStorage.getItem("accessToken");
    const headers: Record<string, string> = {
      ...this.defaultHeaders,
      ...(options.headers as Record<string, string>),
    };
    if (token) {
      headers.Authorization = `Bearer ${token}`;
      console.log("Token added to request:", token.substring(0, 20) + "...");
    } else {
      console.warn("No access token found in localStorage");
    }

    const config: RequestInit = {
      ...options,
      headers,
      mode: "cors",
    };

    try {
      const response = await fetch(url, config);
      console.log("API Response:", { status: response.status, statusText: response.statusText });

      if (!response.ok) {
        if (response.status === 401) {
          if(window.location.pathname != "/login"){
          console.error("Unauthorized - redirecting to login");
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          window.location.href = "/login";
          throw new Error("Unauthorized - please login again");}
          else{
            throw new Error(response.statusText);}
        }
        const errorText = await response.text();
        console.error("API Error Response:", errorText);
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      if (response.status === 204) {
        console.log("API Success: 204 No Content");
        return null as T;
      }

      const json = await response.json();
      console.log("API Success (raw):", json);
      const unwrapped = this.unwrap<T>(json);
      console.log("API Success (unwrapped):", unwrapped);
      return unwrapped;
    } catch (error) {
      console.error("API request failed:", error);
      if (error instanceof TypeError && error.message.includes("fetch")) {
        throw new Error("خطأ في الاتصال بالخادم. تأكد من اتصال الإنترنت.");
      }
      throw error;
    }
  }

  async get<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
    const queryString = params ? "?" + new URLSearchParams(params).toString() : "";
    return this.request<T>(`${endpoint}${queryString}`, { method: "GET" });
  }

  async post<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: "DELETE" });
  }
}
