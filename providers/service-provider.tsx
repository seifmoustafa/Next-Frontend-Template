"use client";

import type React from "react";
import { createContext, useContext } from "react";
import { ApiService } from "@/services/api.service";
import { UserService } from "@/services/user.service";
import { UserTypeService } from "@/services/user-type.service";
import { AnalyticsService } from "@/services/analytics.service";
import { NotificationService } from "@/services/notification.service";
import { useI18n } from "@/providers/i18n-provider";

interface Services {
  apiService: ApiService;
  userService: UserService;
  userTypeService: UserTypeService;
  analyticsService: AnalyticsService;
  notificationService: NotificationService;
}

const ServiceContext = createContext<Services | null>(null);

export function ServiceProvider({ children }: { children: React.ReactNode }) {
  const { t } = useI18n();
  const notificationService = new NotificationService();
  const apiService = new ApiService(process.env.NEXT_PUBLIC_API_URL || "", t);
  const userService = new UserService(apiService, notificationService, t);
  const userTypeService = new UserTypeService(apiService, notificationService, t);
  const analyticsService = new AnalyticsService(apiService, t);

  const services: Services = {
    apiService,
    userService,
    userTypeService,
    analyticsService,
    notificationService,
  };

  return (
    <ServiceContext.Provider value={services}>
      {children}
    </ServiceContext.Provider>
  );
}

export function useServices() {
  const context = useContext(ServiceContext);
  if (!context) {
    throw new Error("useServices must be used within a ServiceProvider");
  }
  return context;
}
