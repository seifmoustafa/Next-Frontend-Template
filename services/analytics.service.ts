import type { IApiService } from "./api.service"

export interface AnalyticsData {
  totalUsers: number
  revenue: number
  orders: number
  growth: number
  chartData: Array<{
    name: string
    value: number
  }>
}

export interface IAnalyticsService {
  getDashboardAnalytics(): Promise<AnalyticsData>
  getUserAnalytics(period: "day" | "week" | "month" | "year"): Promise<any>
}

export class AnalyticsService implements IAnalyticsService {
  constructor(private apiService: IApiService) {}

  async getDashboardAnalytics(): Promise<AnalyticsData> {
    try {
      const data = await this.apiService.get<AnalyticsData>("/analytics/dashboard")
      return data
    } catch (error) {
      // Return mock data for demo
      return {
        totalUsers: 1234,
        revenue: 45678,
        orders: 890,
        growth: 12.5,
        chartData: [
          { name: "jan", value: 400 },
          { name: "feb", value: 300 },
          { name: "mar", value: 600 },
          { name: "apr", value: 800 },
          { name: "may", value: 700 },
          { name: "jun", value: 900 },
        ],
      }
    }
  }

  async getUserAnalytics(period: "day" | "week" | "month" | "year") {
    try {
      const data = await this.apiService.get(`/analytics/users`, { period })
      return data
    } catch (error) {
      console.error("Failed to fetch user analytics:", error)
      throw error
    }
  }
}
