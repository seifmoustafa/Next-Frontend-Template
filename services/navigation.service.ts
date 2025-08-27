import { ApiService } from "./api.service";
import { API_ENDPOINTS } from "@/config/api-endpoints";

export interface MenuItem {
  id: string;
  name: string;
  href: string | null;
  icon: string;
  order: number;
  parentMenuItem: {
    id: string;
    name: string;
  } | null;
  children: MenuItem[];
  requiredPermission: string | null;
  isDeleted: boolean;
  isActive: boolean;
  notes: string | null;
  createdTimestamp: string;
  updatedTimestamp: string | null;
  deletedTimestamp: string | null;
}

export interface MenuItemsResponse {
  statusCode: number;
  message: string;
  data: {
    menuItems: MenuItem[];
    pages: string[];
  };
  errors: any;
  pagination: any;
}

export interface NavigationData {
  menuItems: MenuItem[];
  allowedPages: string[];
}

class NavigationService {
  private navigationData: NavigationData | null = null;
  private apiService: ApiService;

  constructor(apiService: ApiService) {
    this.apiService = apiService;
  }

  /**
   * Fetch menu items from the backend
   */
  async fetchMenuItems(): Promise<NavigationData> {
    try {
      const response = await this.apiService.get<MenuItemsResponse>(
        API_ENDPOINTS.GET_MENU_ITEMS
      );

      console.log("Navigation API Response:", response); // Debug log

      // Handle different possible response structures
      if (response && (response.statusCode === 200 || !response.statusCode)) {
        let menuItems: MenuItem[] = [];
        let allowedPages: string[] = [];

        // Check if response has data property
        if (response.data) {
          menuItems = response.data.menuItems || response.data || [];
          allowedPages = response.data.pages || [];
        } else if (Array.isArray(response)) {
          // Direct array response
          menuItems = response;
          allowedPages = response
            .map((item: MenuItem) => item.href)
            .filter((href): href is string => href !== null);
        } else if ((response as any).menuItems) {
          // Direct menuItems property
          menuItems = (response as any).menuItems;
          allowedPages = (response as any).pages || [];
        }

        this.navigationData = {
          menuItems,
          allowedPages,
        };

        console.log("Processed navigation data:", this.navigationData); // Debug log
        return this.navigationData;
      }

      throw new Error(response?.message || "Failed to fetch menu items");
    } catch (error) {
      console.error("Error fetching menu items:", error);
      throw error;
    }
  }

  /**
   * Get cached navigation data
   */
  getNavigationData(): NavigationData | null {
    return this.navigationData;
  }

  /**
   * Check if user has access to a specific page
   */
  hasPageAccess(pathname: string): boolean {
    if (!this.navigationData) {
      return false;
    }

    // Remove query parameters and trailing slashes for comparison
    const cleanPath = pathname.split("?")[0].replace(/\/$/, "") || "/";

    // Allow access to root dashboard
    if (cleanPath === "" || cleanPath === "/") {
      return true;
    }

    // Check for exact match first
    if (this.navigationData.allowedPages.includes(cleanPath)) {
      return true;
    }

    // Check for hierarchical access - if user has access to parent route, grant access to nested routes
    const pathSegments = cleanPath
      .split("/")
      .filter((segment) => segment !== "");

    // Build parent paths and check if user has access to any parent route
    for (let i = pathSegments.length - 1; i > 0; i--) {
      const parentPath = "/" + pathSegments.slice(0, i).join("/");
      if (this.navigationData.allowedPages.includes(parentPath)) {
        return true;
      }
    }

    return false;
  }

  /**
   * Get allowed pages list
   */
  getAllowedPages(): string[] {
    return this.navigationData?.allowedPages || [];
  }

  /**
   * Clear cached navigation data (used on logout)
   */
  clearNavigationData(): void {
    this.navigationData = null;
  }

  /**
   * Convert backend menu items to frontend navigation format
   */
  convertToNavigationItems(): any[] {
    if (!this.navigationData) {
      return [];
    }

    // Use the convertMenuItemsToNavigation function from navigation config
    // This will be imported by the component that uses it to avoid circular dependencies
    return this.navigationData.menuItems;
  }
}

// Export the NavigationService class for use in service provider
export { NavigationService };
