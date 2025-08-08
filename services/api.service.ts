// Base API Service following SOLID principles
export interface IApiService {
  get<T>(endpoint: string, params?: Record<string, any>): Promise<T>
  post<T>(endpoint: string, data?: any): Promise<T>
  put<T>(endpoint: string, data?: any): Promise<T>
  delete<T>(endpoint: string): Promise<T>
}

export class ApiService implements IApiService {
  private baseUrl: string
  private defaultHeaders: Record<string, string>
  private t?: (key: string, params?: Record<string, any>) => string

  constructor(
    baseUrl: string = process.env.NEXT_PUBLIC_API_URL || "/api",
    t?: (key: string, params?: Record<string, any>) => string
  ) {
    this.baseUrl = baseUrl
    this.defaultHeaders = {
      "Content-Type": "application/json",
      Accept: "application/json",
    }
    this.t = t
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const baseUrl = this.baseUrl.startsWith("http") ? this.baseUrl : `https://${this.baseUrl}`
    const url = `${baseUrl}${endpoint}`

    console.log("API Request:", { method: options.method || "GET", url }) // Debug log

    // Get the correct token from localStorage
    const token = localStorage.getItem("accessToken") // Changed from "authToken" to "accessToken"
    const headers: Record<string, string> = {
      ...this.defaultHeaders,
      ...(options.headers as Record<string, string>),
    }

    if (token) {
      headers.Authorization = `Bearer ${token}`
      console.log("Token added to request:", token.substring(0, 20) + "...") // Debug log
    } else {
      console.warn("No access token found in localStorage")
    }

    const config: RequestInit = {
      ...options,
      headers,
      mode: "cors", // Explicitly set CORS mode
    }

    try {
      const response = await fetch(url, config)

      console.log("API Response:", { status: response.status, statusText: response.statusText }) // Debug log

      if (!response.ok) {
        if (response.status === 401) {
          // Token expired or invalid, redirect to login
          console.error("Unauthorized - redirecting to login")
          localStorage.removeItem("accessToken")
          localStorage.removeItem("refreshToken")
          window.location.href = "/login"
          throw new Error("Unauthorized - please login again")
        }

        const errorText = await response.text()
        console.error("API Error Response:", errorText)
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`)
      }

      const data = await response.json()
      console.log("API Success:", data) // Debug log
      return data
    } catch (error) {
      console.error("API request failed:", error)

      if (error instanceof TypeError && error.message.includes("fetch")) {
        throw new Error(
          this.t
            ? this.t("api.networkError")
            : "Network error. Please check your internet connection."
        )
      }

      throw error
    }
  }

  async get<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
    const queryString = params ? "?" + new URLSearchParams(params).toString() : ""

    return this.request<T>(`${endpoint}${queryString}`, {
      method: "GET",
    })
  }

  async post<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async put<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, {
      method: "DELETE",
    })
  }
}
