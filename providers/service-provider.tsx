"use client";

import type React from "react";
import { createContext, useContext, useMemo } from "react";
import { ApiService } from "@/services/api.service";
import { NotificationService } from "@/services/notification.service";
import { SiteService } from "@/services/site.service";

import { CategoryService } from "@/services/category.service";
import { CivilianService } from "@/services/civilian.service";
import { NavigationService } from "@/services/navigation.service";

interface Services {
  apiService: ApiService;
  notificationService: NotificationService;
  siteService: SiteService;
  categoryService: CategoryService;
  civilianService: CivilianService;
  navigationService: NavigationService;
}

const ServiceContext = createContext<Services | null>(null);

export function ServiceProvider({ children }: { children: React.ReactNode }) {
  const services = useMemo(() => {
    const notificationService = new NotificationService();
    const apiService = new ApiService(process.env.NEXT_PUBLIC_API_URL || "");
    const siteService = new SiteService(apiService, notificationService);
    const categoryService = new CategoryService(apiService, notificationService);
    const civilianService = new CivilianService(apiService, notificationService);
    const navigationService = new NavigationService(apiService);

    return {
      apiService,
      notificationService,
      siteService,
      categoryService,
      civilianService,
      navigationService
    };
  }, []);

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
