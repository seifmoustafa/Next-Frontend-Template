import {
  LayoutDashboard,
  Users,
  BarChart3,
  Settings,
  User,
} from "lucide-react";

export interface NavigationItem {
  name: string;
  href?: string;
  icon: any;
  children?: NavigationItem[];
  badge?: string | number; // Optional badge for notifications
  disabled?: boolean; // Optional disabled state
}

/**
 * ============================================================================
 * CENTRALIZED NAVIGATION CONFIGURATION
 * ============================================================================
 *
 * This is the single source of truth for all sidebar navigation items.
 * All sidebar components (Modern, Classic, Elegant, etc.) use this configuration.
 *
 * To add a new navigation item:
 * 1. Add it to the navigation array below
 * 2. It will automatically appear in all sidebar layouts
 * 3. No need to update individual sidebar components
 *
 * ============================================================================
 */

export const navigation: NavigationItem[] = [
  {
    name: "nav.dashboard", // Uses translation key
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "nav.users", // Uses translation key
    href: "/dashboard/users",
    icon: Users,
  },
  {
    name: "nav.analytics", // Uses translation key
    href: "/dashboard/analytics",
    icon: BarChart3,
  },
  {
    name: "الملف الشخصي", // Direct Arabic text
    href: "/dashboard/profile",
    icon: User,
  },
  {
    name: "nav.settings", // Uses translation key
    href: "/dashboard/settings",
    icon: Settings,
  },
];

/* 
============================================================================
NESTED MENU EXAMPLES - HOW TO ADD CHILDREN ITEMS
============================================================================

To add nested/children menu items, modify the navigation array above like this:

export const navigation: NavigationItem[] = [
  {
    name: "nav.dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "nav.users",
    icon: Users,
    children: [
      {
        name: "قائمة المستخدمين",
        href: "/dashboard/users",
        icon: Users,
      },
      {
        name: "إضافة مستخدم",
        href: "/dashboard/users/create",
        icon: UserPlus,
      },
      {
        name: "إدارة الأدوار",
        icon: Shield,
        children: [  // 3rd level nesting
          {
            name: "عرض الأدوار",
            href: "/dashboard/users/roles",
            icon: UserCheck,
          },
          {
            name: "إنشاء دور جديد",
            href: "/dashboard/users/roles/create",
            icon: UserPlus,
          },
          {
            name: "الصلاحيات المتقدمة",
            icon: Settings,
            children: [  // 4th level nesting
              {
                name: "صلاحيات النظام",
                href: "/dashboard/users/permissions/system",
                icon: Cog,
              },
              {
                name: "صلاحيات المحتوى",
                href: "/dashboard/users/permissions/content",
                icon: FileText,
              },
            ],
          },
        ],
      },
      {
        name: "المستخدمين النشطين",
        href: "/dashboard/users/active",
        icon: UserCheck,
        badge: 12, // Shows notification badge
      },
      {
        name: "المستخدمين المحظورين",
        href: "/dashboard/users/blocked",
        icon: UserX,
        disabled: true, // Disabled state
      },
    ],
  },
  {
    name: "nav.analytics",
    icon: BarChart3,
    children: [
      {
        name: "نظرة عامة",
        href: "/dashboard/analytics",
        icon: BarChart3,
      },
      {
        name: "الاتجاهات",
        href: "/dashboard/analytics/trends",
        icon: TrendingUp,
        badge: "جديد", // Text badge
      },
      {
        name: "التقارير المتقدمة",
        icon: PieChart,
        children: [  // 3rd level nesting
          {
            name: "تقرير المبيعات الشهري",
            href: "/dashboard/analytics/reports/monthly-sales",
            icon: BarChart,
          },
          {
            name: "تحليل سلوك المستخدمين",
            href: "/dashboard/analytics/reports/user-behavior",
            icon: Users,
          },
          {
            name: "تقارير مخصصة",
            icon: FileText,
            children: [  // 4th level nesting
              {
                name: "إنشاء تقرير جديد",
                href: "/dashboard/analytics/reports/custom/create",
                icon: UserPlus,
              },
              {
                name: "قوالب التقارير",
                href: "/dashboard/analytics/reports/custom/templates",
                icon: FileText,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    name: "الملف الشخصي",
    href: "/dashboard/profile",
    icon: User,
  },
  {
    name: "nav.settings",
    icon: Settings,
    children: [
      {
        name: "الإعدادات العامة",
        href: "/dashboard/settings",
        icon: Cog,
      },
      {
        name: "إعدادات المظهر",
        href: "/dashboard/settings/appearance",
        icon: Palette,
      },
      {
        name: "إعدادات الإشعارات",
        href: "/dashboard/settings/notifications",
        icon: Bell,
        badge: 3, // Notification count
      },
    ],
  },
]

============================================================================
FEATURES SUPPORTED:
============================================================================

1. **Unlimited Nesting Levels**: Add children to any item for nested menus
2. **Translation Support**: Use translation keys (e.g., "nav.dashboard") or direct text
3. **Badges**: Add notification badges with numbers or text
4. **Disabled States**: Mark items as disabled
5. **Icons**: Each item can have its own icon
6. **Flexible Routing**: Items can have href for direct links or children for dropdowns

============================================================================
ADDING NEW ITEMS:
============================================================================

To add a new navigation item:

1. Import the required icon at the top of this file
2. Add the new item to the navigation array
3. The item will automatically appear in all sidebar layouts

Example - Adding a "Reports" section:

import { FileText, Download, Upload } from 'lucide-react'

// Add to navigation array:
{
  name: "التقارير",
  icon: FileText,
  children: [
    {
      name: "عرض التقارير",
      href: "/dashboard/reports",
      icon: FileText,
    },
    {
      name: "تصدير البيانات",
      href: "/dashboard/reports/export",
      icon: Download,
    },
    {
      name: "استيراد البيانات",
      href: "/dashboard/reports/import",
      icon: Upload,
      badge: "قريباً",
    },
  ],
},

============================================================================
*/

/**
 * Helper function to get navigation items with translation support
 * This can be used by sidebar components to get translated navigation items
 */
export const getNavigationItems = (
  t: (key: string) => string
): NavigationItem[] => {
  const translateItem = (item: NavigationItem): NavigationItem => ({
    ...item,
    name: item.name.startsWith("nav.") ? t(item.name) : item.name,
    children: item.children?.map(translateItem),
  });

  return navigation.map(translateItem);
};

/**
 * Helper function to check if a navigation item or its children are active
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
 * Helper function to get all navigation items as a flat array (useful for search)
 */
export const getFlatNavigationItems = (
  items: NavigationItem[] = navigation
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
