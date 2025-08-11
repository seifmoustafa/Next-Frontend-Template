"use client";

import type React from "react";
import { createContext, useContext, useMemo } from "react";
import { ApiService } from "@/services/api.service";
import { UserService } from "@/services/user.service";
import { UserTypeService } from "@/services/user-type.service";
import { AnalyticsService } from "@/services/analytics.service";
import { NotificationService } from "@/services/notification.service";
import { SiteService } from "@/services/site.service";
import { CategoryService } from "@/services/category.service";

import { CivilianService } from "@/services/civilian.service";

interface Services {
  apiService: ApiService;
  userService: UserService;
  userTypeService: UserTypeService;
  analyticsService: AnalyticsService;
  notificationService: NotificationService;
  siteService: SiteService;
  categoryService: CategoryService;
  civilianService: CivilianService;
}

const ServiceContext = createContext<Services | null>(null);

export function ServiceProvider({ children }: { children: React.ReactNode }) {
  // Use useMemo to create stable service instances
  const services = useMemo(() => {
    const notificationService = new NotificationService();
    const apiService = new ApiService(process.env.NEXT_PUBLIC_API_URL || "");
    const userService = new UserService(apiService, notificationService);
    const userTypeService = new UserTypeService(
      apiService,
      notificationService
    );
    const analyticsService = new AnalyticsService(apiService);
    const siteService = new SiteService(apiService, notificationService);
    const categoryService = new CategoryService(
      apiService,
      notificationService
    );
    const civilianService = new CivilianService(
      apiService,
      notificationService
    );

    return {
      apiService,
      userService,
      userTypeService,
      analyticsService,
      notificationService,
      siteService,

      categoryService,

      civilianService,
    };
  }, []); // Empty dependency array = stable services

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
