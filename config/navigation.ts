import {
  LayoutDashboard,
  Users,
  BarChart3,
  Settings,
  User,
  UserX,
  Shield,
  UserPlus,
  UserCheck,
  Cog,
  FileText,
  TrendingUp,
  PieChart,
  BarChart,
  MapPin,
  Store,
  Building,
  ContrastIcon,
  HardHat,
  Move3D,
  ShieldCheck,
  ArrowRightLeft,
  Users2,
  Truck,
  ScrollText,
  FolderTree,
  Grid3X3,
  Package2,
  Package,
  Warehouse,
} from "lucide-react";

export interface NavigationItem {
  name: string;
  href?: string;
  icon?: any; // Make icon optional
  children?: NavigationItem[];
  badge?: string | number; // Optional badge for notifications
  disabled?: boolean; // Optional disabled state
}

/**
 * Icon mapping from string names to actual icon components
 * Used to convert backend icon names to React components
 */
export const iconMap: Record<string, any> = {
  MapPin: MapPin,
  ShieldCheck: ShieldCheck,
  ArrowRightLeft: ArrowRightLeft,
  HardHat: HardHat,
  Users2: Users2,
  Shield: Shield,
  Truck: Truck,
  ScrollText: ScrollText,
  Package2: Package2,
  FolderTree: FolderTree,
  Grid3X3: Grid3X3,
  Package: Package,
  Warehouse: Warehouse,
  Store: Store,
  LayoutDashboard: LayoutDashboard,
  Users: Users,
  BarChart3: BarChart3,
  Settings: Settings,
  User: User,
  Building: Building,
  Cog: Cog,
  FileText: FileText,
  TrendingUp: TrendingUp,
  PieChart: PieChart,
  BarChart: BarChart,
};

/**
 * ============================================================================
 * DYNAMIC NAVIGATION SYSTEM - EASY MAINTENANCE & SWITCHING
 * ============================================================================
 *
 * 🚀 SUPER EASY TO MAINTAIN:
 * - Single toggle flag to switch between static/dynamic navigation
 * - All sidebar components automatically use the same system
 * - No need to update individual components when adding new items
 * - Centralized icon mapping and configuration
 *
 * 🔄 EASY SWITCHING:
 * - Development: Set USE_DYNAMIC_NAVIGATION = false (uses static navigation)
 * - Production: Set USE_DYNAMIC_NAVIGATION = true (uses backend navigation)
 * - Automatic fallback when backend is unavailable
 *
 * 📁 CLEAN ARCHITECTURE:
 * - useDynamicNavigation() hook handles all the logic
 * - Components just call the hook and render
 * - Route protection automatically enabled in dynamic mode
 * - Translation support built-in
 *
 * ============================================================================
 */

/**
 * 🎛️ NAVIGATION MODE SWITCH
 *
 * Change this ONE flag to switch between static and dynamic navigation:
 * - false = Static navigation (hardcoded, no backend calls, no route protection)
 * - true = Dynamic navigation (from backend, with route protection)
 */
export const USE_DYNAMIC_NAVIGATION = true;

// STATIC NAVIGATION - Used when USE_DYNAMIC_NAVIGATION is false
export const navigation: NavigationItem[] = [
  {
    name: "nav.sites",
    href: "/sites",
    icon: MapPin,
  },
  {
    name: "nav.roles",
    href: "/roles",
    icon: ShieldCheck,
  },
  {
    name: "nav.transactions",
    href: "/transactions",
    icon: ArrowRightLeft,
  },
  {
    name: "nav.siteWorkers",
    icon: HardHat,
    children: [
      {
        name: "nav.civilians",
        href: "/civilians",
        icon: Users2,
      },
      {
        name: "nav.militaryPersons",
        href: "/military-persons",
        icon: Shield,
      },
    ],
  },
  {
    name: "nav.imports",
    icon: Truck,
    children: [
      {
        name: "nav.vendors",
        href: "/vendors",
        icon: Store,
      },
      {
        name: "nav.contracts",
        href: "/contracts",
        icon: ScrollText,
      },
      {
        name: "nav.categories",
        children: [
          {
            name: "nav.mainCategories",
            href: "/categories",
            icon: FolderTree,
          },
          {
            name: "nav.subCategories",
            href: "/sub-categories",
            icon: Grid3X3,
          },
          {
            name: "nav.products",
            href: "/products",
            icon: Package,
          },
        ],
        icon: Package2,
      },

      {
        name: "nav.warehouseLocations",
        href: "/warehouseLocations",
        icon: Warehouse,
      },
    ],
  },
];

// 🔄 Fallback navigation - used when backend is unavailable (same as static navigation)
export const fallbackNavigation: NavigationItem[] = navigation;

/**
 * ============================================================================
 * 📖 QUICK USAGE GUIDE
 * ============================================================================
 *
 * 🔧 FOR DEVELOPERS:
 * 1. Set USE_DYNAMIC_NAVIGATION = false for development
 * 2. Edit the 'navigation' array below to add/remove items
 * 3. All sidebar components will automatically update
 *
 * 🚀 FOR PRODUCTION:
 * 1. Set USE_DYNAMIC_NAVIGATION = true
 * 2. Implement /MenuItems API endpoint
 * 3. System handles everything automatically
 *
 * 🎨 ADDING NEW STATIC ITEMS:
 * 1. Import icon from lucide-react
 * 2. Add to iconMap if using dynamic navigation
 * 3. Add item to navigation array
 *
 * Example:
 * {
 *   name: "nav.newSection",
 *   href: "/new-section",
 *   icon: NewIcon,
 *   children: [...] // Optional nested items
 * }
 *
 * ============================================================================
 */

/**
 * 🔧 UTILITY FUNCTIONS
 * These are used internally by the navigation system
 */

/**
 * Translates navigation items using the i18n system
 */
export const getNavigationItems = (
  t: (key: string) => string,
  navigationItems: NavigationItem[] = fallbackNavigation
): NavigationItem[] => {
  const translateItem = (item: NavigationItem): NavigationItem => ({
    ...item,
    name: item.name.startsWith("nav.") ? t(item.name) : item.name,
    children: item.children?.map(translateItem),
  });

  return navigationItems.map(translateItem);
};

/**
 * Checks if a navigation item or its children match the current pathname
 */
export const isNavigationItemActive = (
  item: NavigationItem,
  pathname: string
): boolean => {
  if (item.href && pathname === item.href) return true;
  if (item.children) {
    return item.children.some((child) =>
      isNavigationItemActive(child, pathname)
    );
  }
  return false;
};

/**
 * Flattens nested navigation items into a single array (useful for search)
 */
export const getFlatNavigationItems = (
  items: NavigationItem[] = fallbackNavigation
): NavigationItem[] => {
  const flatItems: NavigationItem[] = [];

  const flatten = (items: NavigationItem[]) => {
    items.forEach((item) => {
      if (item.href) {
        flatItems.push(item);
      }
      if (item.children) {
        flatten(item.children);
      }
    });
  };

  flatten(items);
  return flatItems;
};

/**
 * 🔄 Converts backend menu items to frontend navigation format
 * Used internally by the dynamic navigation system
 */
export const convertMenuItemsToNavigation = (
  menuItems: any[]
): NavigationItem[] => {
  const convertMenuItem = (item: any): NavigationItem => {
    return {
      name: item.name,
      href: item.href,
      icon: iconMap[item.icon] || iconMap["Package"], // Default fallback icon
      children: item.children?.map(convertMenuItem) || [],
      disabled: !item.isActive,
    };
  };

  // Filter only active items and sort by order
  const activeMenuItems = menuItems
    .filter((item) => item.isActive && !item.isDeleted)
    .sort((a, b) => a.order - b.order);

  return activeMenuItems.map(convertMenuItem);
};
