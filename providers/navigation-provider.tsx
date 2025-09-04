"use client";

import type React from "react";
import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useAuth } from "@/providers/auth-provider";
import { useServices } from "@/providers/service-provider";
import { NavigationData } from "@/services/navigation.service";

interface NavigationContextType {
  navigationData: NavigationData | null;
  isLoading: boolean;
  refreshNavigation: () => Promise<void>;
  hasPageAccess: (pathname: string) => boolean;
  getAllowedPages: () => string[];
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export function NavigationProvider({ children }: { children: React.ReactNode }) {
  const [navigationData, setNavigationData] = useState<NavigationData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { isAuthenticated, user, isLoading: authLoading } = useAuth();
  const { navigationService } = useServices();

  const refreshNavigation = useCallback(async () => {
    if (!isAuthenticated) {
      setNavigationData(null);
      navigationService.clearNavigationData();
      return;
    }

    setIsLoading(true);
    try {
      const data = await navigationService.fetchMenuItems();
      setNavigationData(data);
    } catch (error) {
      console.error("Failed to fetch navigation data:", error);
      setNavigationData(null);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, navigationService]);

  // Fetch navigation data when user logs in
  useEffect(() => {
    // Don't fetch if auth is still loading
    if (authLoading) {
      return;
    }

    if (isAuthenticated && user && !navigationData) {
      refreshNavigation();
    } else if (!isAuthenticated) {
      setNavigationData(null);
      navigationService.clearNavigationData();
      setIsLoading(false); // Ensure loading is false for unauthenticated users
    }
  }, [isAuthenticated, user, navigationData, refreshNavigation, navigationService, authLoading]);

  const hasPageAccess = useCallback((pathname: string): boolean => {
    if (!isAuthenticated) {
      return false;
    }

    // Remove query parameters and trailing slashes for comparison
    const cleanPath = pathname.split('?')[0].replace(/\/$/, '') || '/';
    
    // Always allow access to system pages for authenticated users
    const systemPages = [
      '/',           // Home page
      '',            // Root
      '/dashboard',  // Dashboard
      '/not-authorized',
      '/profile',    // User profile
      '/_not-found', // Not found page
      '/not-found',  // Next.js not-found page
      '/404',        // 404 page
      '/500',        // Error page
      '/global-error', // Global error page
      '/error'       // Generic error page
    ];
    
    if (systemPages.includes(cleanPath)) {
      return true;
    }

    // If no navigation data yet, allow access (will be checked again when data loads)
    if (!navigationData) {
      return true;
    }

    // Check for exact match first
    if (navigationData.allowedPages.includes(cleanPath)) {
      return true;
    }

    // Check for hierarchical access - if user has access to parent route, grant access to nested routes
    const pathSegments = cleanPath.split('/').filter(segment => segment !== '');
    
    // Build parent paths and check if user has access to any parent route
    for (let i = pathSegments.length - 1; i > 0; i--) {
      const parentPath = '/' + pathSegments.slice(0, i).join('/');
      if (navigationData.allowedPages.includes(parentPath)) {
        return true;
      }
    }

    return false;
  }, [navigationData, isAuthenticated]);

  const getAllowedPages = useCallback((): string[] => {
    return navigationData?.allowedPages || [];
  }, [navigationData]);

  return (
    <NavigationContext.Provider
      value={{
        navigationData,
        isLoading,
        refreshNavigation,
        hasPageAccess,
        getAllowedPages,
      }}
    >
      {children}
    </NavigationContext.Provider>
  );
}

export function useNavigation() {
  const context = useContext(NavigationContext);
  if (context === undefined) {
    throw new Error("useNavigation must be used within a NavigationProvider");
  }
  return context;
}
