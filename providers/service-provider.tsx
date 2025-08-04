"use client"

import type React from "react"
import { createContext, useContext } from "react"
import { ApiService } from "@/services/api.service"
import { UserService } from "@/services/user.service"
import { AnalyticsService } from "@/services/analytics.service"
import { NotificationService } from "@/services/notification.service"

interface ServiceContextType {
  apiService: ApiService
  userService: UserService
  analyticsService: AnalyticsService
  notificationService: NotificationService
}

const ServiceContext = createContext<ServiceContextType | undefined>(undefined)

export function ServiceProvider({ children }: { children: React.ReactNode }) {
  // Dependency Injection - Create service instances
  const apiService = new ApiService()
  const notificationService = new NotificationService()
  const userService = new UserService(apiService, notificationService)
  const analyticsService = new AnalyticsService(apiService)

  return (
    <ServiceContext.Provider
      value={{
        apiService,
        userService,
        analyticsService,
        notificationService,
      }}
    >
      {children}
    </ServiceContext.Provider>
  )
}

export function useServices() {
  const context = useContext(ServiceContext)
  if (context === undefined) {
    throw new Error("useServices must be used within a ServiceProvider")
  }
  return context
}
